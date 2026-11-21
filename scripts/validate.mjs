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
// Then: `claude plugin validate` on the marketplace and each plugin, if the CLI is available.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_SKILL_LINES = 200;
const MAX_DESCRIPTION = 200;
const ALLOWED_FRONTMATTER = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const REQUIRED_SECTIONS = ['Purpose', 'Reads', 'Writes', 'Steps', 'Quality bar', 'Gate', 'If it fails'];
const STAGE_STATUS = new Set(['planned', 'placeholder', 'active']);
const GATES = new Set(['admin', 'editor', 'client', 'none']);
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
      if (typeof st.credit_spend !== 'boolean') c5.errors.push(`${at}: credit_spend must be true or false`);
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
  const schemaFiles = [
    ...walkFiles(path.join(P, 'library', 'contracts')).filter((f) => f.endsWith('.schema.json')),
    ...walkFiles(path.join(P, 'library', 'presets')).filter((f) => f.endsWith('.schema.json')),
  ];
  let presetValidator = null;
  const contractValidators = new Map(); // "job" -> validate fn (from library/contracts/job.schema.json)
  for (const f of schemaFiles) {
    const schema = readJson(f, c7);
    if (!schema) continue;
    if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema') c7.errors.push(`${rel(f)}: $schema must be draft 2020-12`);
    try {
      const v = ajv.compile(schema);
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
    const { layout, encodeRecord, decodeAll, normalise, headerRows } = codec;
    // a) every top-level schema property is stored somewhere
    for (const rec of ['client', 'job', 'team']) {
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
    for (const rec of ['client', 'job', 'team', 'config']) {
      const f = path.join(exDir, `${rec}.example.json`);
      if (!isFile(f)) continue;
      const data = JSON.parse(readText(f));
      const tabs = headerRows();
      for (const [tab, rows] of Object.entries(encodeRecord(rec, data))) tabs[tab] = tabs[tab].concat(rows.map((r) => r.map(sim)));
      let back;
      try { back = decodeAll(tabs); } catch (e) { c11.errors.push(`${rec}.example.json: ${e.message}`); continue; }
      const got = rec === 'config' ? back.config : back[{ client: 'clients', job: 'jobs', team: 'team' }[rec]][0];
      if (JSON.stringify(normalise(got)) !== JSON.stringify(normalise(data))) c11.errors.push(`${rec}.example.json does not survive the Sheets round trip`);
    }
    const samplePath = path.join(P, 'library', 'storage', 'tracker-page', 'sample-data.json');
    let sampleBack = null;
    if (isFile(samplePath)) {
      try { sampleBack = decodeAll(JSON.parse(readText(samplePath)).tabs); } catch (e) { c11.errors.push(`sample-data.json: ${e.message.split(' (got')[0]}`); }
    }
    if (sampleBack) {
      const back = sampleBack;
      for (const [rec, list] of [['client', back.clients], ['job', back.jobs], ['team', back.team]]) {
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
      c11.notes.push(`${plugin.name}: sample data ${back.clients.length} clients, ${back.jobs.length} jobs`);
    }
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
