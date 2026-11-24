// Converts logical records (client, job, team, insight, task, action, config) to Google Sheets rows and back,
// following plugins/social-media-manager/library/storage/sheet-layout.json.
// Dev tooling: used by validate.mjs (offline round trip) and the storage scenario tests.
// Skills follow the same rules in prose (library/storage/google-sheets.md); this file is the executable spec.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const STORAGE = path.join(ROOT, 'plugins', 'social-media-manager', 'library', 'storage');
const CONTRACTS = path.join(ROOT, 'plugins', 'social-media-manager', 'library', 'contracts');

export const layout = JSON.parse(fs.readFileSync(path.join(STORAGE, 'sheet-layout.json'), 'utf8'));
const configSchema = JSON.parse(fs.readFileSync(path.join(CONTRACTS, 'config.schema.json'), 'utf8'));

const TEXTLIKE = new Set(['text', 'date', 'timestamp']);

// ── cells ──────────────────────────────────────────────────────────
// Every text-like cell is written with a leading apostrophe so Sheets stores it as plain text
// (otherwise '+91…' loses its plus, '0012' becomes 12 and '=…' becomes a formula).
export function encodeCell(type, v) {
  if (v === undefined || v === null) return '';
  if (TEXTLIKE.has(type)) return `'${String(v)}`;
  if (type === 'list') return v.length ? `'${v.join('\n')}` : '';
  if (type === 'json') return `'${JSON.stringify(v)}`;
  if (type === 'number' || type === 'integer') return v;
  if (type === 'boolean') return Boolean(v);
  throw new Error(`unknown cell type ${type}`);
}

// Values come back from Sheets as formatted strings (numbers as "89.5", booleans as "TRUE").
export function decodeCell(type, s) {
  if (s === undefined || s === null || s === '') return undefined;
  const str = String(s);
  if (TEXTLIKE.has(type)) return str;
  if (type === 'list') return str.split('\n');
  if (type === 'json') return JSON.parse(str);
  if (type === 'number') return Number(str.replace(/,/g, ''));
  if (type === 'integer') return parseInt(str.replace(/,/g, ''), 10);
  if (type === 'boolean') return str.toUpperCase() === 'TRUE';
  throw new Error(`unknown cell type ${type}`);
}

// ── helpers ────────────────────────────────────────────────────────
const getPath = (obj, p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
function setPath(obj, p, v) {
  if (v === undefined) return;
  const keys = p.split('.');
  let o = obj;
  for (const k of keys.slice(0, -1)) o = o[k] ??= {};
  o[keys.at(-1)] = v;
}
const tabsFor = (record) => layout.tabs.filter((t) => t.record === record);
const parentKeyOf = { client: 'client_id', job: 'job_id', team: 'handle', insight: 'insight_id', task: 'task_id', action: 'action_id' };
// Collection names in decodeAll's result, per record type.
export const collectionOf = { client: 'clients', job: 'jobs', team: 'team', insight: 'insights', task: 'tasks', action: 'actions' };
// Config values that are objects or lists are stored as JSON text.
const configIsJson = (prop, v) => (v !== null && typeof v === 'object') || prop?.type === 'object' || prop?.type === 'array';

// ── encode ─────────────────────────────────────────────────────────
// Returns { [tabName]: rows[] } for one record (rows as arrays in column order).
export function encodeRecord(record, data) {
  const out = {};
  for (const t of tabsFor(record)) {
    if (t.kind === 'record') {
      out[t.name] = [t.columns.map((c) => encodeCell(c.type, getPath(data, c.field ?? c.key)))];
    } else if (t.kind === 'child') {
      let items = getPath(data, t.field) ?? [];
      if (t.order === 'newest_first') items = [...items].reverse(); // store oldest first, like every other tab
      out[t.name] = items.map((item, i) =>
        t.columns.map((c) => {
          if (c.key === t.parent_key) return encodeCell(c.type, data[t.parent_key]);
          if (c.key === 'seq') return i + 1;
          if (c.key === 'client_id' && c.storage_only) return encodeCell(c.type, data.client_id);
          if (c.key === 'status' && c.storage_only) return encodeCell(c.type, 'open');
          if (c.storage_only) return '';
          return encodeCell(c.type, item[c.key]);
        }),
      );
    } else if (t.kind === 'child-grouped') {
      // An object of lists (e.g. insight.findings): one row per item, `group_key` names its list.
      const groups = getPath(data, t.field) ?? {};
      const items = Object.entries(groups).flatMap(([group, list]) => (list ?? []).map((item) => [group, item]));
      out[t.name] = items.map(([group, item], i) =>
        t.columns.map((c) => {
          if (c.key === t.parent_key) return encodeCell(c.type, data[t.parent_key]);
          if (c.key === 'seq') return i + 1;
          if (c.key === t.group_key) return encodeCell(c.type, group);
          if (c.key === 'client_id' && c.storage_only) return encodeCell(c.type, data.client_id);
          if (c.storage_only) return '';
          return encodeCell(c.type, item[c.key]);
        }),
      );
    } else if (t.kind === 'child-map') {
      const map = getPath(data, t.field) ?? {};
      out[t.name] = Object.entries(map).map(([k, item]) =>
        t.columns.map((c) => {
          if (c.key === t.parent_key) return encodeCell(c.type, data[t.parent_key]);
          if (c.key === t.map_key) return encodeCell(c.type, k);
          return encodeCell(c.type, item[c.key]);
        }),
      );
    } else if (t.kind === 'mirror') {
      // A copy of a list stored elsewhere in the record (layout v3, BriefQuestions). Encoded for the
      // Dashboard; decodeAll ignores it, because the list's own home (e.g. the Outputs JSON) is the source of truth.
      const items = getPath(data, t.field) ?? [];
      out[t.name] = items.map((item) =>
        t.columns.map((c) => {
          if (c.key === t.parent_key) return encodeCell(c.type, data[t.parent_key]);
          if (c.key === 'client_id' && c.storage_only) return encodeCell(c.type, data.client_id);
          return encodeCell(c.type, item[c.key]);
        }),
      );
    } else if (t.kind === 'key-value') {
      out[t.name] = Object.entries(data).map(([k, v]) => {
        const prop = configSchema.properties[k];
        const isObj = configIsJson(prop, v);
        return [encodeCell('text', k), v === null || v === undefined ? '' : isObj ? encodeCell('json', v) : typeof v === 'number' || typeof v === 'boolean' ? v : encodeCell('text', v)];
      });
    }
  }
  return out;
}

// ── decode ─────────────────────────────────────────────────────────
// tabs: { [tabName]: string[][] } including the header row, as returned by "get values".
function rowsAsObjects(t, rows) {
  if (!rows?.length) return [];
  const header = rows[0];
  const expected = t.columns.map((c) => c.key);
  if (expected.some((k, i) => header[i] !== k)) {
    throw new Error(`${t.name}: header row does not match sheet-layout.json (got ${header.join(',')})`);
  }
  return rows
    .slice(1)
    .filter((r) => r.some((v) => v !== '' && v !== undefined))
    .map((r) => Object.fromEntries(t.columns.map((c, i) => [c.key, decodeCell(c.type, r[i])])));
}

export function decodeAll(tabs) {
  const result = { clients: [], jobs: [], team: [], insights: [], tasks: [], actions: [], config: null };
  const byRecord = Object.fromEntries(Object.entries(collectionOf).map(([rec, coll]) => [rec, result[coll]]));

  for (const t of layout.tabs.filter((x) => x.kind === 'record')) {
    for (const row of rowsAsObjects(t, tabs[t.name])) {
      const rec = {};
      for (const c of t.columns) setPath(rec, c.field ?? c.key, row[c.key]);
      byRecord[t.record].push(rec);
    }
  }
  for (const t of layout.tabs.filter((x) => x.kind === 'child' || x.kind === 'child-map')) {
    const parents = byRecord[t.record];
    const rows = rowsAsObjects(t, tabs[t.name]);
    for (const parent of parents) {
      const pk = parentKeyOf[t.record];
      let mine = rows.filter((r) => r[t.parent_key] === parent[pk]);
      if (t.filter) mine = mine.filter((r) => Object.entries(t.filter).every(([k, v]) => r[k] === v));
      if (mine.some((r) => r.seq !== undefined)) mine.sort((a, b) => a.seq - b.seq);
      if (t.keep_last) mine = mine.slice(-t.keep_last);
      if (t.order === 'newest_first') mine = mine.reverse();
      const strip = (r) =>
        Object.fromEntries(
          t.columns.filter((c) => !c.storage_only && c.key !== t.map_key && r[c.key] !== undefined).map((c) => [c.key, r[c.key]]),
        );
      if (t.kind === 'child-map') setPath(parent, t.field, Object.fromEntries(mine.map((r) => [r[t.map_key], strip(r)])));
      else setPath(parent, t.field, mine.map(strip));
    }
  }
  for (const t of layout.tabs.filter((x) => x.kind === 'child-grouped')) {
    // Every group from the group column's options is present, empty if it has no rows.
    const groups = t.columns.find((c) => c.key === t.group_key).options;
    const rows = rowsAsObjects(t, tabs[t.name]);
    for (const parent of byRecord[t.record]) {
      const mine = rows.filter((r) => r[t.parent_key] === parent[parentKeyOf[t.record]]).sort((a, b) => a.seq - b.seq);
      const strip = (r) => Object.fromEntries(t.columns.filter((c) => !c.storage_only && r[c.key] !== undefined).map((c) => [c.key, r[c.key]]));
      setPath(parent, t.field, Object.fromEntries(groups.map((g) => [g, mine.filter((r) => r[t.group_key] === g).map(strip)])));
    }
  }
  const cfg = tabs.Config;
  if (cfg?.length) {
    const conf = {};
    for (const [k, v] of cfg.slice(1)) {
      if (!k) continue;
      const prop = configSchema.properties[k];
      const types = [].concat(prop?.type ?? 'string');
      let val;
      if (v === '' || v === undefined) val = types.includes('null') ? null : undefined;
      else if (types.includes('object') || types.includes('array') || /^[[{]/.test(v)) val = JSON.parse(v);
      else if (types.includes('integer')) val = parseInt(v, 10);
      else if (types.includes('number')) val = Number(v);
      else if (types.includes('boolean')) val = v === 'TRUE';
      else val = v;
      if (val !== undefined) conf[k] = val;
    }
    result.config = conf;
  }
  return result;
}

// Remove nulls, undefined and empty arrays inside nested values, so a record compares equal
// to its Sheets round trip (an empty cell can't tell null from absent). Keys are sorted so order doesn't matter.
export function normalise(v) {
  if (Array.isArray(v)) return v.map(normalise);
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
      if (x === null || x === undefined || (Array.isArray(x) && x.length === 0)) continue; // an empty cell reads back as absent (google-sheets.md §2)
      o[k] = normalise(x);
    }
    return o;
  }
  return v;
}

export function headerRows() {
  return Object.fromEntries(layout.tabs.filter((t) => t.columns).map((t) => [t.name, [t.columns.map((c) => c.key)]]));
}
