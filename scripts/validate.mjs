#!/usr/bin/env node
// Validates the tdm-plugins marketplace and every plugin in it.
// Usage: node scripts/validate.mjs            (set SKIP_CLAUDE_VALIDATE=1 to skip the CLI step)
//
// Checks (numbers match docs/ADD-A-SKILL.md):
//  1  plugin.json + marketplace.json valid, names kebab-case, entry name == manifest name
//  2  every skill folder has SKILL.md with valid frontmatter and all template sections
//  3  skill folder names unique across groups
//  4  every registered group exists and has >= 1 skill; every group with skills is registered
//  5  every non-planned stage points to an existing skill in its group
//  6  every `reads` field is written earlier on each (job_type, track) path, or is `client`
//  7  all schemas compile; all presets validate against _preset.schema.json
//  8  every ${CLAUDE_PLUGIN_ROOT}/library/... link inside skills/agents points to a real file
//  9  SKILL.md <= 200 lines; description <= 200 chars, one line
// 10  frontmatter keys limited to those claude.ai skill uploads accept
// 11  storage: the sheet layout covers every stored record; examples and sample data survive the Sheets round trip;
//     research records agree with each other; generated files are current; tracker page stages match stages.yaml
// (5 also checks the optional stage keys: freshness_days, skippable_if_urgent, non_blocking_partial, spend_gate.)
// 12  brief text/detail pairs agree (offer/offer_detail, cta/cta_detail, audience/audience_detail), variants and mirrors consistent
// 13  script and localised_script records hang together: scene times, pace (voiceover-pacing.md), cards, pick and downstream, SRT cues
// Then: `claude plugin validate` on the marketplace and each plugin, if the CLI is available.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { researchConsistency } from './lib/research-checks.mjs';
import { scriptConsistency, localisedConsistency, loadPacing } from './lib/script-checks.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_SKILL_LINES = 200;
const MAX_DESCRIPTION = 200;
const ALLOWED_FRONTMATTER = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const REQUIRED_SECTIONS = ['Purpose', 'Reads', 'Writes', 'Steps', 'Quality bar', 'Gate', 'If it fails'];
const STAGE_STATUS = new Set(['planned', 'placeholder', 'active']);
const GATES = new Set(['admin', 'editor', 'client', 'none']);
const SPEND_GATES = new Set(['admin', 'none']);
const STAGE_KEYS = new Set([
  'id', 'group', 'skill', 'status', 'reads', 'optional_reads', 'writes', 'gate', 'credit_spend', 'tracks', 'job_types',
  // optional (docs/STAGE-CONTRACT.md, "Optional stage keys")
  'freshness_days', 'skippable_if_urgent', 'non_blocking_partial', 'spend_gate', 'gate_label',
]);
// Records the storage layer maps to Sheets tabs (besides config, a key-value tab).
const STORED_RECORDS = ['client', 'job', 'team', 'insight', 'task', 'action'];
const TRACKS = ['quick', 'full'];
const JOB_TYPES = ['video', 'poster'];
const BASE_FIELDS = new Set(['client']);

const results = []; // { check, errors: [], notes: [] }
function check(id, title) {
  const r = { id, title, errors: [], notes: [] };
  results.push(r);
  return r;
}

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const isDir = (p) => fs.existsSync(p) && fs.statSync(p).isDirectory();
const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
const subdirs = (p) => (isDir(p) ? fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : []);
const readText = (p) => fs.readFileSync(p, 'utf8');
function countLines(text) {
  const lines = text.split(/\r?\n/);
  if (lines.at(-1) === '') lines.pop();
  return lines.length;
}
function readJson(p, r) {
  try {
    return JSON.parse(readText(p));
  } catch (e) {
    r.errors.push(`${rel(p)}: invalid JSON (${e.message})`);
    return null;
  }
}
function walkFiles(dir, out = []) {
  if (!isDir(dir)) return out;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

// ── 1. Manifests ────────────────────────────────────────────────────
const c1 = check(1, 'Manifests valid, names kebab-case');
const marketplacePath = path.join(ROOT, '.claude-plugin', 'marketplace.json');
const marketplace = isFile(marketplacePath) ? readJson(marketplacePath, c1) : (c1.errors.push('.claude-plugin/marketplace.json missing'), null);
const plugins = []; // { name, dir, manifest }

if (marketplace) {
  if (!KEBAB.test(marketplace.name ?? '')) c1.errors.push(`marketplace name "${marketplace.name}" is not kebab-case`);
  if (!marketplace.owner?.name) c1.errors.push('marketplace owner.name is required');
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) c1.errors.push('marketplace plugins[] is empty');
  for (const entry of marketplace.plugins ?? []) {
    if (!KEBAB.test(entry.name ?? '')) c1.errors.push(`plugin entry name "${entry.name}" is not kebab-case`);
    if (typeof entry.source !== 'string' || !entry.source.startsWith('./')) {
      c1.notes.push(`plugin "${entry.name}": non-local source, skipped`);
      continue;
    }
    if (entry.source.includes('..')) c1.errors.push(`plugin "${entry.name}": source must not contain ".."`);
    const dir = path.join(ROOT, entry.source);
    const manifestPath = path.join(dir, '.claude-plugin', 'plugin.json');
    if (!isFile(manifestPath)) {
      c1.errors.push(`plugin "${entry.name}": ${rel(manifestPath)} missing`);
      continue;
    }
    const manifest = readJson(manifestPath, c1);
    if (!manifest) continue;
    if (!KEBAB.test(manifest.name ?? '')) c1.errors.push(`${rel(manifestPath)}: name "${manifest.name}" is not kebab-case`);
    if (manifest.name !== entry.name) c1.errors.push(`marketplace entry "${entry.name}" != plugin.json name "${manifest.name}"`);
    for (const k of ['version', 'description']) if (!manifest[k]) c1.errors.push(`${rel(manifestPath)}: "${k}" missing`);
    if (!manifest.author?.name) c1.errors.push(`${rel(manifestPath)}: author.name missing`);
    const mcpPath = path.join(dir, '.mcp.json');
    if (isFile(mcpPath)) readJson(mcpPath, c1);
    plugins.push({ name: entry.name, dir, manifest });
  }
}

// Per-plugin checks
const c2 = check(2, 'SKILL.md present, frontmatter valid, all template sections');
const c3 = check(3, 'Skill folder names unique across groups');
const c4 = check(4, 'Registered groups exist, contain skills, and every group with skills is registered');
const c5 = check(5, 'Non-planned stages point to existing skills');
const c6 = check(6, 'Every stage read is written earlier on each (job_type, track) path');
const c7 = check(7, 'Schemas compile; presets validate');
const c8 = check(8, '${CLAUDE_PLUGIN_ROOT}/library and /skills links resolve');
const c9 = check(9, `SKILL.md <= ${MAX_SKILL_LINES} lines; description <= ${MAX_DESCRIPTION} chars`);
const c10 = check(10, 'Frontmatter keys accepted by claude.ai uploads');
const c11 = check(11, 'Storage: layout covers schemas, records round-trip, generated files current');
const c12 = check(12, 'Brief pairs agree; variants and BriefQuestions mirror consistent');
const c13 = check(13, 'Script and localised script records consistent (times, pace, cards, SRT)');

for (const plugin of plugins) {
  const P = plugin.dir;
  const skillsRoot = path.join(P, 'skills');

  // ── Discover groups and skills ──
  const skills = []; // { name, group, dir }
  for (const group of subdirs(skillsRoot)) {
    const groupDir = path.join(skillsRoot, group);
    if (isFile(path.join(groupDir, 'SKILL.md'))) {
      c2.errors.push(`${rel(groupDir)}/SKILL.md: skills must live inside a group folder (skills/<group>/<skill>/SKILL.md)`);
    }
    for (const name of subdirs(groupDir)) skills.push({ name, group, dir: path.join(groupDir, name) });
  }

  // ── 2, 9, 10: SKILL.md ──
  for (const s of skills) {
    const where = rel(s.dir);
    if (!KEBAB.test(s.name)) c2.errors.push(`${where}: folder name must be kebab-case`);
    const skillPath = path.join(s.dir, 'SKILL.md');
    if (!isFile(skillPath)) {
      c2.errors.push(`${where}: SKILL.md missing`);
      continue;
    }
    const text = readText(skillPath);
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) {
      c2.errors.push(`${where}/SKILL.md: frontmatter must start on line 1 and be closed with ---`);
      continue;
    }
    let fm;
    try {
      fm = YAML.parse(m[1]) ?? {};
    } catch (e) {
      c2.errors.push(`${where}/SKILL.md: frontmatter is not valid YAML (${e.message.split('\n')[0]})`);
      continue;
    }
    const body = m[2];
    if (typeof fm.name !== 'string' || !fm.name.trim()) c2.errors.push(`${where}/SKILL.md: "name" missing`);
    else if (fm.name !== s.name) c2.errors.push(`${where}/SKILL.md: name "${fm.name}" must equal folder name "${s.name}"`);
    if (typeof fm.description !== 'string' || !fm.description.trim()) c2.errors.push(`${where}/SKILL.md: "description" missing`);
    else {
      if (/TODO|[<>]/.test(fm.description)) c2.errors.push(`${where}/SKILL.md: description still a placeholder (contains TODO or < >)`);
      if (fm.description.length > MAX_DESCRIPTION) c9.errors.push(`${where}/SKILL.md: description is ${fm.description.length} chars (max ${MAX_DESCRIPTION})`);
      if (/\n/.test(fm.description.trim())) c9.errors.push(`${where}/SKILL.md: description must be one line`);
    }
    for (const section of REQUIRED_SECTIONS) {
      const re = new RegExp(`^##\\s+${section.replace(/ /g, '\\s+')}\\b`, 'mi');
      if (!re.test(body)) c2.errors.push(`${where}/SKILL.md: section "## ${section}" missing`);
    }
    const lines = countLines(text);
    if (lines > MAX_SKILL_LINES) c9.errors.push(`${where}/SKILL.md: ${lines} lines (max ${MAX_SKILL_LINES})`);
    for (const key of Object.keys(fm)) {
      if (!ALLOWED_FRONTMATTER.has(key)) c10.errors.push(`${where}/SKILL.md: frontmatter key "${key}" is rejected by claude.ai uploads (allowed: ${[...ALLOWED_FRONTMATTER].join(', ')})`);
    }
  }

  // ── 3. Unique names ──
  const byName = new Map();
  for (const s of skills) byName.set(s.name, [...(byName.get(s.name) ?? []), s.group]);
  for (const [name, groups] of byName) if (groups.length > 1) c3.errors.push(`skill "${name}" exists in several groups: ${groups.join(', ')}`);

  // ── 4. Registration ──
  const raw = plugin.manifest.skills;
  const registered = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];
  const registeredGroups = new Set();
  for (const entry of registered) {
    if (typeof entry !== 'string' || !entry.startsWith('./')) {
      c4.errors.push(`plugin.json skills entry ${JSON.stringify(entry)} must be a path starting with ./`);
      continue;
    }
    const dir = path.join(P, entry);
    const relToSkills = path.relative(skillsRoot, dir);
    if (!isDir(dir)) c4.errors.push(`plugin.json skills entry "${entry}" does not exist`);
    else if (relToSkills.startsWith('..') || relToSkills === '' || relToSkills.includes(path.sep)) {
      c4.errors.push(`plugin.json skills entry "${entry}" must be a group folder: ./skills/<group>`);
    } else {
      registeredGroups.add(relToSkills);
      if (!skills.some((s) => s.group === relToSkills)) c4.errors.push(`group "${relToSkills}" is registered but has no skills`);
    }
  }
  for (const g of new Set(skills.map((s) => s.group))) {
    if (!registeredGroups.has(g)) c4.errors.push(`group "${g}" has skills but is not registered in plugin.json "skills" (they would not load)`);
  }
  c4.notes.push(`${plugin.name}: ${registeredGroups.size} group(s) registered, ${skills.length} skill(s)`);

  // ── 5 & 6. Stages ──
  const stagesPath = path.join(P, 'library', 'contracts', 'stages.yaml');
  if (!isFile(stagesPath)) {
    c5.errors.push(`${rel(stagesPath)} missing`);
  } else {
    let doc;
    try {
      doc = YAML.parse(readText(stagesPath));
    } catch (e) {
      c5.errors.push(`${rel(stagesPath)}: invalid YAML (${e.message.split('\n')[0]})`);
    }
    const stages = Array.isArray(doc?.stages) ? doc.stages : [];
    if (doc && !Array.isArray(doc.stages)) c5.errors.push(`${rel(stagesPath)}: top-level "stages" list missing`);
    const groupNames = new Set(subdirs(skillsRoot));
    const ids = new Set();
    for (const st of stages) {
      const at = `stage "${st.id}"`;
      if (!KEBAB.test(st.id ?? '')) c5.errors.push(`${at}: id must be kebab-case`);
      if (ids.has(st.id)) c5.errors.push(`${at}: duplicate id`);
      ids.add(st.id);
      if (!groupNames.has(st.group)) c5.errors.push(`${at}: group "${st.group}" is not a folder in skills/`);
      if (!KEBAB.test(st.skill ?? '')) c5.errors.push(`${at}: skill must be a kebab-case folder name`);
      if (!STAGE_STATUS.has(st.status)) c5.errors.push(`${at}: status must be planned | placeholder | active`);
      if (!GATES.has(st.gate)) c5.errors.push(`${at}: gate must be admin | editor | client | none`);
      // gate_label (optional): kebab-case name for a gate that decides more than its own output, e.g. creative-pick
      if (st.gate_label !== undefined) {
        if (!KEBAB.test(String(st.gate_label))) c5.errors.push(`${at}: gate_label must be kebab-case`);
        if (st.gate === 'none') c5.errors.push(`${at}: gate_label needs a gate other than none`);
      }
      if (typeof st.credit_spend !== 'boolean') c5.errors.push(`${at}: credit_spend must be true or false`);
      for (const k of Object.keys(st)) if (!STAGE_KEYS.has(k)) c5.errors.push(`${at}: unknown key "${k}"`);
      if ('freshness_days' in st && !(Number.isInteger(st.freshness_days) && st.freshness_days >= 1)) c5.errors.push(`${at}: freshness_days must be a whole number of days, 1 or more`);
      for (const k of ['skippable_if_urgent', 'non_blocking_partial']) {
        if (k in st && typeof st[k] !== 'boolean') c5.errors.push(`${at}: ${k} must be true or false`);
      }
      if ('spend_gate' in st && !SPEND_GATES.has(st.spend_gate)) c5.errors.push(`${at}: spend_gate must be admin | none`);
      if (st.non_blocking_partial && !(st.writes ?? []).length) c5.errors.push(`${at}: non_blocking_partial needs a stage that writes an output to carry the partial status`);
      for (const k of ['reads', 'optional_reads', 'writes', 'tracks', 'job_types']) {
        if (!Array.isArray(st[k])) c5.errors.push(`${at}: "${k}" must be a list`);
      }
      for (const t of st.tracks ?? []) if (!TRACKS.includes(t)) c5.errors.push(`${at}: unknown track "${t}"`);
      for (const j of st.job_types ?? []) if (!JOB_TYPES.includes(j)) c5.errors.push(`${at}: unknown job type "${j}"`);
      for (const f of [...(st.reads ?? []), ...(st.optional_reads ?? []), ...(st.writes ?? [])]) {
        if (!/^[a-z][a-z0-9_]*$/.test(f)) c5.errors.push(`${at}: field "${f}" must be snake_case`);
      }
      // planned: skipped. placeholder: run by the producer, no skill folder needed. active: skill must exist.
      if (st.status === 'active') {
        const s = skills.find((x) => x.name === st.skill);
        if (!s) c5.errors.push(`${at} is active but skill "${st.skill}" does not exist`);
        else if (s.group !== st.group) c5.errors.push(`${at}: skill "${st.skill}" is in group "${s.group}", not "${st.group}"`);
      }
    }
    const count = (s) => stages.filter((x) => x.status === s).length;
    c5.notes.push(`${plugin.name}: ${stages.length} stages (${count('active')} active, ${count('placeholder')} placeholder, ${count('planned')} planned)`);

    // 6: per (job_type, track) path
    for (const jt of JOB_TYPES) {
      for (const tr of TRACKS) {
        const pathStages = stages.filter((s) => s.job_types?.includes(jt) && s.tracks?.includes(tr));
        if (pathStages.length === 0) continue;
        const available = new Set(BASE_FIELDS);
        for (const st of pathStages) {
          for (const f of st.reads ?? []) {
            if (!available.has(f)) c6.errors.push(`[${jt}/${tr}] stage "${st.id}" reads "${f}", which no earlier stage writes`);
          }
          for (const f of st.writes ?? []) {
            if (available.has(f) && !BASE_FIELDS.has(f)) c6.errors.push(`[${jt}/${tr}] field "${f}" is written twice (again by "${st.id}")`);
            available.add(f);
          }
        }
        c6.notes.push(`${jt}/${tr}: ${pathStages.length} stages`);
      }
    }
    // optional reads must be written by some earlier stage on some path (catches typos)
    const writtenBefore = new Set(BASE_FIELDS);
    for (const st of stages) {
      for (const f of st.optional_reads ?? []) {
        if (!writtenBefore.has(f)) c6.errors.push(`stage "${st.id}" optional_reads "${f}", which no earlier stage writes`);
      }
      for (const f of st.writes ?? []) writtenBefore.add(f);
    }
  }

  // ── 7. Schemas and presets ──
  const ajv = new Ajv2020({ strict: true, allErrors: true });
  addFormats(ajv);
  // x-version: schema revision number (annotation only). v2 marks schemas extended additively on feat/brief.
  ajv.addKeyword({ keyword: 'x-version', schemaType: 'number' });
  const schemaFiles = [
    ...walkFiles(path.join(P, 'library', 'contracts')).filter((f) => f.endsWith('.schema.json')),
    ...walkFiles(path.join(P, 'library', 'presets')).filter((f) => f.endsWith('.schema.json')),
  ];
  let presetValidator = null;
  const contractValidators = new Map(); // "job" -> validate fn (from library/contracts/job.schema.json)
  // Register every schema first, so one contract can $ref another by its $id (research → insight).
  const loaded = [];
  for (const f of schemaFiles) {
    const schema = readJson(f, c7);
    if (!schema) continue;
    if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') c7.errors.push(`${rel(f)}: $schema must be draft 2020-12`);
    try {
      ajv.addSchema(schema);
      loaded.push([f, schema]);
    } catch (e) {
      c7.errors.push(`${rel(f)}: cannot be registered (${e.message})`);
    }
  }
  for (const [f, schema] of loaded) {
    try {
      const v = schema.$id ? ajv.getSchema(schema.$id) : ajv.compile(schema);
      if (path.basename(f) === '_preset.schema.json') presetValidator = v;
      else contractValidators.set(path.basename(f, '.schema.json'), v);
    } catch (e) {
      c7.errors.push(`${rel(f)}: does not compile (${e.message})`);
    }
  }
  c7.notes.push(`${plugin.name}: ${schemaFiles.length} schemas compiled`);

  // Examples: library/contracts/examples/<name>.example.json must validate against <name>.schema.json.
  // For job examples, each non-placeholder output's data must validate against <field>.schema.json if it exists.
  const reportErrors = (file, where, errors) => {
    for (const err of errors) c7.errors.push(`${rel(file)}: ${where}${err.instancePath || '/'} ${err.message}`);
  };
  const exampleFiles = walkFiles(path.join(P, 'library', 'contracts', 'examples')).filter((f) => f.endsWith('.example.json'));
  for (const f of exampleFiles) {
    const name = path.basename(f, '.example.json');
    const v = contractValidators.get(name);
    if (!v) {
      c7.errors.push(`${rel(f)}: no ${name}.schema.json to validate against`);
      continue;
    }
    const data = readJson(f, c7);
    if (!data) continue;
    if (!v(data)) reportErrors(f, '', v.errors);
    if (name === 'job' && data.outputs && typeof data.outputs === 'object') {
      for (const [field, out] of Object.entries(data.outputs)) {
        const fv = contractValidators.get(field);
        if (fv && out?.data && out.data.placeholder !== true && !fv(out.data)) reportErrors(f, `outputs.${field}.data`, fv.errors);
      }
    }
  }
  c7.notes.push(`${plugin.name}: ${exampleFiles.length} examples validated`);
  const presetFiles = walkFiles(path.join(P, 'library', 'presets')).filter(
    (f) => /\.(ya?ml|json)$/.test(f) && !f.endsWith('.schema.json'),
  );
  if (presetFiles.length && !presetValidator) c7.errors.push('presets exist but _preset.schema.json is missing or invalid');
  for (const f of presetFiles) {
    let data;
    try {
      data = f.endsWith('.json') ? JSON.parse(readText(f)) : YAML.parse(readText(f));
    } catch (e) {
      c7.errors.push(`${rel(f)}: cannot parse (${e.message.split('\n')[0]})`);
      continue;
    }
    if (presetValidator && !presetValidator(data)) {
      for (const err of presetValidator.errors) c7.errors.push(`${rel(f)}: ${err.instancePath || '/'} ${err.message}`);
    }
    const base = path.basename(f).replace(/\.(ya?ml|json)$/, '');
    if (data?.name !== base) c7.errors.push(`${rel(f)}: name "${data?.name}" must equal file name "${base}"`);
  }
  c7.notes.push(`${plugin.name}: ${presetFiles.length} presets validated`);

  // ── 8. Library links ──
  const linkRe = /\$\{CLAUDE_PLUGIN_ROOT\}\/((?:library|skills)\/[^\s)\]"'`<>|*]+)/g;
  let linkCount = 0;
  for (const f of [...walkFiles(skillsRoot), ...walkFiles(path.join(P, 'agents'))]) {
    if (!/\.(md|ya?ml|json|txt)$/.test(f)) continue;
    for (const m of readText(f).matchAll(linkRe)) {
      const target = m[1].replace(/[.,;:!?]+$/, '');
      linkCount++;
      if (!fs.existsSync(path.join(P, target))) c8.errors.push(`${rel(f)}: link to missing file ${target}`);
    }
  }
  // ${CLAUDE_SKILL_DIR}/... links resolve against the skill folder that contains the file.
  const skillDirRe = /\$\{CLAUDE_SKILL_DIR\}\/([^\s)\]"'`<>|*]+)/g;
  for (const s of skills) {
    for (const f of walkFiles(s.dir)) {
      if (!/\.(md|ya?ml|json|txt)$/.test(f)) continue;
      for (const m of readText(f).matchAll(skillDirRe)) {
        const target = m[1].replace(/[.,;:!?]+$/, '');
        linkCount++;
        if (!fs.existsSync(path.join(s.dir, target))) c8.errors.push(`${rel(f)}: link to missing file \${CLAUDE_SKILL_DIR}/${target}`);
      }
    }
  }
  c8.notes.push(`${plugin.name}: ${linkCount} link(s) checked`);

  // ── 11. Storage layer (only for plugins that have one) ──
  const layoutPath = path.join(P, 'library', 'storage', 'sheet-layout.json');
  if (isFile(layoutPath)) {
    const codec = await import(new URL('./lib/sheet-codec.mjs', import.meta.url));
    const { layout, encodeRecord, decodeAll, normalise, headerRows, collectionOf } = codec;
    // a) every top-level schema property is stored somewhere
    for (const rec of STORED_RECORDS) {
      const schemaFile = path.join(P, 'library', 'contracts', `${rec}.schema.json`);
      if (!isFile(schemaFile)) continue;
      const props = Object.keys(JSON.parse(readText(schemaFile)).properties);
      const covered = new Set();
      for (const t of layout.tabs.filter((x) => x.record === rec)) {
        if (t.kind === 'record') t.columns.forEach((c) => covered.add((c.field ?? c.key).split('.')[0]));
        else covered.add(t.field.split('.')[0]);
      }
      for (const p of props) if (!covered.has(p)) c11.errors.push(`sheet-layout.json: ${rec}.${p} has no column or tab`);
    }
    // b) examples and sample data survive encode → Sheets strings → decode, and stay valid
    const sim = (cell) => (cell === '' ? '' : typeof cell === 'string' ? cell.replace(/^'/, '') : typeof cell === 'boolean' ? (cell ? 'TRUE' : 'FALSE') : String(cell));
    const exDir = path.join(P, 'library', 'contracts', 'examples');
    for (const rec of [...STORED_RECORDS, 'config']) {
      const f = path.join(exDir, `${rec}.example.json`);
      if (!isFile(f)) continue;
      const data = JSON.parse(readText(f));
      const tabs = headerRows();
      for (const [tab, rows] of Object.entries(encodeRecord(rec, data))) tabs[tab] = tabs[tab].concat(rows.map((r) => r.map(sim)));
      let back;
      try { back = decodeAll(tabs); } catch (e) { c11.errors.push(`${rec}.example.json: ${e.message}`); continue; }
      const got = rec === 'config' ? back.config : back[collectionOf[rec]][0];
      if (JSON.stringify(normalise(got)) !== JSON.stringify(normalise(data))) c11.errors.push(`${rec}.example.json does not survive the Sheets round trip`);
    }
    const samplePath = path.join(P, 'library', 'storage', 'tracker-page', 'sample-data.json');
    let sampleBack = null;
    if (isFile(samplePath)) {
      try { sampleBack = decodeAll(JSON.parse(readText(samplePath)).tabs); } catch (e) { c11.errors.push(`sample-data.json: ${e.message.split(' (got')[0]}`); }
    }
    if (sampleBack) {
      const back = sampleBack;
      for (const [rec, list] of STORED_RECORDS.map((r) => [r, back[collectionOf[r]]])) {
        const v = contractValidators.get(rec);
        list.forEach((r, i) => { if (v && !v(r)) c11.errors.push(`sample-data.json: ${rec} #${i + 1} invalid: ${v.errors.map((e) => `${e.instancePath} ${e.message}`).join('; ')}`); });
      }
      // jobs are consistent with stages.yaml: every stage marked done (and the current stage) has its required reads,
      // and every done stage's writes exist (the producer refuses to run a stage whose reads are missing)
      if (isFile(stagesPath)) {
        const byId = new Map((YAML.parse(readText(stagesPath)).stages || []).map((s) => [s.id, s]));
        for (const j of back.jobs) {
          const outs = new Set(Object.keys(j.outputs || {}));
          const done = (j.stage_history || []).filter((h) => h.status === 'done').map((h) => h.stage);
          for (const st of done) for (const w of byId.get(st)?.writes || []) if (!outs.has(w)) c11.errors.push(`sample-data.json: ${j.job_id} marks ${st} done but has no outputs.${w}`);
          for (const r of byId.get(j.current_stage)?.reads || []) if (r !== 'client' && !outs.has(r)) c11.errors.push(`sample-data.json: ${j.job_id} is at ${j.current_stage}, which reads ${r}, but outputs.${r} is missing`);
        }
      }
      for (const e of researchConsistency(back)) c11.errors.push(`sample-data.json: ${e}`);
      c11.notes.push(`${plugin.name}: sample data ${back.clients.length} clients, ${back.jobs.length} jobs, ${back.insights.length} insights, ${back.tasks.length} tasks, ${back.actions.length} page actions`);
    }
    // Research records in the examples hang together the same way.
    const exRec = (n) => (isFile(path.join(exDir, `${n}.example.json`)) ? [JSON.parse(readText(path.join(exDir, `${n}.example.json`)))] : []);
    for (const e of researchConsistency({ jobs: exRec('job'), insights: exRec('insight'), clients: exRec('client'), tasks: exRec('task') }, { partial: true })) c11.errors.push(`examples: ${e}`);
    c11.notes.push(`${plugin.name}: research records cross-checked`);
    // c) generated files are current
    for (const script of ['build-sheet-setup.mjs', 'build-sample-data.mjs']) {
      const res = spawnSync(process.execPath, [path.join(ROOT, 'scripts', script), '--check'], { encoding: 'utf8' });
      if (res.status !== 0) c11.errors.push(`${script} --check: ${(res.stderr || res.stdout).trim()}`);
    }
    // d) tracker page stage list matches stages.yaml
    const pagePath = path.join(P, 'library', 'storage', 'tracker-page', 'index.html');
    if (isFile(pagePath) && isFile(stagesPath)) {
      const m = readText(pagePath).match(/const STAGES = (\[[^\]]*\])/);
      const pageStages = m ? JSON.parse(m[1].replace(/'/g, '"')) : [];
      const yamlStages = (YAML.parse(readText(stagesPath)).stages || []).map((s) => s.id);
      if (JSON.stringify(pageStages) !== JSON.stringify(yamlStages)) c11.errors.push('tracker-page/index.html STAGES list does not match stages.yaml order');
    }
  }

  // ── 12. Brief pairs, variants, mirror ──
  // Pair rule (docs/decisions/0004-brief-field-pairs.md): when a *_detail field is present it is the
  // source of truth, and its text field (generated from it on save) must agree with it.
  const CHANNEL_WORDS = {
    whatsapp: /whats\s?app|व्हाट्सएप|वॉट्सऐप|व्हाट्सऐप/i,
    call: /call|phone|फ़ोन|फोन|कॉल/i,
    visit: /visit|aao|aaiye|aayiye|padhar|pahunch|shop|store|site|office|branch|आइए|आइये|पधार|पहुँच/i,
    dm: /\bdm\b|message|msg|inbox|मैसेज/i,
    website: /website|link|\.com|\.in\b|वेबसाइट/i,
    form: /form|register|फॉर्म/i,
  };
  const hasPrice = (text, price) => {
    const flat = String(text).replace(/(\d),(?=\d)/g, '$1');
    return new RegExp(`(^|[^\d.])${String(price).replace('.', '\.')}(?![\d])`).test(flat);
  };
  const checkBrief = (b, where) => {
    if (!b || typeof b !== 'object' || b.placeholder === true) return;
    const err = (m) => c12.errors.push(`${where}: ${m}`);
    const od = b.offer_detail;
    if (od && typeof od === 'object') {
      if (typeof b.offer !== 'string' || !b.offer) err('offer_detail is set but offer (its generated text) is empty');
      else if (od.price != null && !hasPrice(b.offer, od.price)) err(`offer "${b.offer}" does not show offer_detail.price ${od.price}`);
      else if (od.price == null && /(₹|rs\.?\s?)\s?\d/i.test(b.offer)) err(`offer "${b.offer}" shows a price but offer_detail.price is null`);
      if (od.profile_match === 'differs' && !(b.open_questions ?? []).some((q) => /price|₹|daam|rate/i.test(q))) err('offer_detail.profile_match is differs, but no open question flags the price');
    }
    const cd = b.cta_detail;
    if (cd && typeof cd === 'object') {
      if (typeof b.cta !== 'string' || !b.cta) err('cta_detail is set but cta (its generated text) is empty');
      else {
        if (!b.cta.toLowerCase().includes(cd.action.toLowerCase())) err(`cta "${b.cta}" does not contain cta_detail.action "${cd.action}"`);
        const re = CHANNEL_WORDS[cd.channel];
        if (re && !re.test(b.cta)) err(`cta "${b.cta}" does not name the ${cd.channel} channel`);
      }
    }
    const ad = b.audience_detail;
    if (ad && typeof ad === 'object' && !(b.audience ?? '').toLowerCase().includes(ad.who.toLowerCase())) err('audience does not contain audience_detail.who');
    if (b.writing_script && b.language && (b.language === 'English') !== (b.writing_script === 'english')) err(`language ${b.language} and writing_script ${b.writing_script} disagree`);
    // platform variants vs master
    const dels = b.deliverables ?? [];
    for (const [i, d] of dels.entries()) {
      const differs = (b.aspect_ratio && d.aspect_ratio !== b.aspect_ratio) || (b.duration_sec != null && d.duration_sec != null && d.duration_sec !== b.duration_sec);
      if (differs && !d.changes_from_master) err(`deliverables[${i}] (${d.platform} ${d.format}) differs from the master but has no changes_from_master`);
    }
    if (Array.isArray(b.platforms)) {
      const a = [...new Set(dels.map((d) => d.platform))].sort().join(',');
      if ([...b.platforms].sort().join(',') !== a) err(`platforms [${b.platforms}] do not match the deliverables' platforms [${a}]`);
    }
    // research, readiness, questions
    if (b.research?.status === 'skipped' && !b.research.skip_reason) err('research.status is skipped but skip_reason is empty');
    if (b.ready_for_production === true && (!(b.self_check ?? []).length || b.self_check.some((c) => !c.pass))) err('ready_for_production is true but a self_check failed or none ran');
    if (['ready', 'approved'].includes(b.status) && b.ready_for_production !== true) err(`status ${b.status} needs ready_for_production true`);
    const cq = b.client_questions ?? [];
    if (new Set(cq.map((q) => q.n)).size !== cq.length) err('client_questions numbers (n) repeat');
    if (b.status === 'awaiting-client' && !cq.some((q) => q.status === 'open')) err('status awaiting-client but no client question is open');
  };
  const exBriefPath = path.join(P, 'library', 'contracts', 'examples', 'brief.example.json');
  let briefCount = 0;
  if (isFile(exBriefPath)) { checkBrief(JSON.parse(readText(exBriefPath)), 'brief.example.json'); briefCount++; }
  const exJobPath = path.join(P, 'library', 'contracts', 'examples', 'job.example.json');
  if (isFile(exJobPath)) { checkBrief(JSON.parse(readText(exJobPath)).outputs?.brief?.data, 'job.example.json outputs.brief'); briefCount++; }
  const samplePath12 = path.join(P, 'library', 'storage', 'tracker-page', 'sample-data.json');
  if (isFile(layoutPath) && isFile(samplePath12)) {
    const { decodeAll: dec, layout: lay } = await import(new URL('./lib/sheet-codec.mjs', import.meta.url));
    const tabs = JSON.parse(readText(samplePath12)).tabs;
    let back = null;
    try { back = dec(tabs); } catch { /* reported by check 11 */ }
    const bv = contractValidators.get('brief');
    for (const j of back?.jobs ?? []) {
      const b = j.outputs?.brief?.data;
      if (!b || b.placeholder) continue;
      briefCount++;
      if (bv && !bv(b)) c12.errors.push(`sample-data.json: ${j.job_id} brief invalid: ${bv.errors.map((e) => `${e.instancePath} ${e.message}`).join('; ')}`);
      checkBrief(b, `sample-data.json ${j.job_id} brief`);
      if (b.status === 'awaiting-client' && j.waiting_on !== 'client') c12.errors.push(`sample-data.json: ${j.job_id} brief is awaiting-client but waiting_on is ${j.waiting_on}`);
      // mirror tabs: rows must equal the brief's list
      for (const t of lay.tabs.filter((x) => x.kind === 'mirror' && x.record === 'job')) {
        const rows = tabs[t.name] ?? [];
        const keys = rows[0] ?? [];
        const mine = rows.slice(1).filter((r) => r[keys.indexOf(t.parent_key)] === j.job_id);
        const list = t.field.split('.').reduce((o, k) => (o == null ? undefined : o[k]), j) ?? [];
        const sig = (n, st) => `${n}:${st}`;
        const want = list.map((q) => sig(q.n, q.status)).sort().join(' ');
        const got = mine.map((r) => sig(Number(r[keys.indexOf('n')]), r[keys.indexOf('status')])).sort().join(' ');
        if (want !== got) c12.errors.push(`sample-data.json: ${j.job_id} ${t.name} rows [${got}] do not mirror ${t.field} [${want}]`);
      }
    }
  }
  c12.notes.push(`${plugin.name}: ${briefCount} brief(s) checked`);

  // ── 13. Script and localised script records ──
  {
    const exDir13 = path.join(P, 'library', 'contracts', 'examples');
    const pacingFile = path.join(P, 'library', 'knowledge', 'voiceover-pacing.md');
    if (isFile(pacingFile)) {
      let pacing = null;
      try { pacing = loadPacing(pacingFile); } catch (e) { c13.errors.push(e.message); }
      if (pacing) {
        const exJson = (n) => (isFile(path.join(exDir13, `${n}.example.json`)) ? JSON.parse(readText(path.join(exDir13, `${n}.example.json`))) : null);
        const config = exJson('config') || {};
        // pairs of { where, script, localised } from the examples, the job example and the sample data
        const sets = [];
        const exScript = exJson('script');
        const exLoc = exJson('localised_script');
        if (exScript || exLoc) sets.push({ where: 'examples', script: exScript, localised: exLoc, pair: !!(exLoc && exScript && exLoc.job_id === exScript.job_id) });
        const jobsToCheck = [];
        const exJob = exJson('job');
        if (exJob) jobsToCheck.push(['job.example.json', exJob]);
        const sp = path.join(P, 'library', 'storage', 'tracker-page', 'sample-data.json');
        if (isFile(sp)) {
          try {
            const { decodeAll: dec13 } = await import(new URL('./lib/sheet-codec.mjs', import.meta.url));
            for (const j of dec13(JSON.parse(readText(sp)).tabs).jobs) jobsToCheck.push([`sample-data.json ${j.job_id}`, j]);
          } catch { /* decode errors are reported by check 11 */ }
        }
        for (const [where, j] of jobsToCheck) {
          const sc = j.outputs?.script?.data;
          const lo = j.outputs?.localised_script?.data;
          if ((sc && !sc.placeholder) || (lo && !lo.placeholder)) sets.push({ where, script: sc, localised: lo, pair: true });
        }
        let n13 = 0;
        for (const set of sets) {
          if (set.script && !set.script.placeholder) { n13++; for (const e of scriptConsistency(set.script, { pacing, config, where: `${set.where} script` })) c13.errors.push(e); }
          if (set.localised && !set.localised.placeholder) {
            n13++;
            const scr = set.pair ? set.script : null;
            for (const e of localisedConsistency(set.localised, { script: scr, pacing, config, where: `${set.where} localised_script` })) c13.errors.push(e);
          }
        }
        c13.notes.push(`${plugin.name}: ${n13} script/localised record(s) checked`);
      }
    }
  }
}

// ── Report ──────────────────────────────────────────────────────────
let failed = 0;
console.log(`\nValidating ${rel(ROOT) || path.basename(ROOT)} (${plugins.length} plugin(s))\n`);
for (const r of results) {
  const ok = r.errors.length === 0;
  if (!ok) failed++;
  console.log(`${ok ? '✔' : '✘'} ${String(r.id).padStart(2)}. ${r.title}${r.notes.length ? `  [${r.notes.join('; ')}]` : ''}`);
  for (const e of r.errors) console.log(`      - ${e}`);
}

// ── claude plugin validate ──────────────────────────────────────────
console.log('');
if (process.env.SKIP_CLAUDE_VALIDATE === '1') {
  console.log('• claude plugin validate: skipped (SKIP_CLAUDE_VALIDATE=1)');
} else {
  const shell = process.platform === 'win32';
  const q = (s) => (shell ? `"${s}"` : s);
  const probe = spawnSync('claude', ['--version'], { shell, encoding: 'utf8' });
  if (probe.status !== 0) {
    console.log('• claude plugin validate: skipped (Claude Code CLI not found on PATH)');
  } else {
    for (const target of [ROOT, ...plugins.map((p) => p.dir)]) {
      const res = spawnSync('claude', ['plugin', 'validate', q(target)], { shell, encoding: 'utf8' });
      const out = `${res.stdout ?? ''}${res.stderr ?? ''}`;
      const verdict = out.split(/\r?\n/).filter((l) => /Validation (passed|failed)|Unexpected error/.test(l)).pop() ?? `exit ${res.status}`;
      const ok = res.status === 0;
      if (!ok) failed++;
      console.log(`${ok ? '✔' : '✘'} claude plugin validate ${rel(target) || '.'}: ${verdict.trim()}`);
      if (!ok) console.log(out.replace(/^/gm, '      '));
    }
  }
}

console.log(failed ? `\n✘ ${failed} check(s) failed.\n` : '\n✔ All checks passed.\n');
process.exit(failed ? 1 : 0);
