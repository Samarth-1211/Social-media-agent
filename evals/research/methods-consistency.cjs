// Checks that the research method modules, the registry and the router agree, so adding a method
// stays "one m-*.md + one registry row + router rows".
// Usage: node evals/research/methods-consistency.cjs
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..');
const SKILL = path.join(REPO, 'plugins/social-media-manager/skills/pre-production/research-methods');
const REF = path.join(SKILL, 'references');
const CONTRACTS = path.join(REPO, 'plugins/social-media-manager/library/contracts');
const SECTIONS = ['Purpose', 'When to use', 'Tools needed', 'Needs a person present?', 'Inputs', 'Steps', 'Caps', 'Output fields', 'Pitfalls', 'Source and licence'];

const errors = [];
const read = (f) => fs.readFileSync(f, 'utf8');
const insight = JSON.parse(read(path.join(CONTRACTS, 'insight.schema.json')));
const config = JSON.parse(read(path.join(CONTRACTS, 'config.schema.json')));
const categories = new Set(Object.keys(insight.properties.findings.properties));
const insightFields = new Set(Object.keys(insight.properties));
const capKeys = new Set(Object.keys(config.properties.research_caps.properties));

// 1. Module files and their sections
const files = fs.readdirSync(REF).filter((f) => /^m-.*\.md$/.test(f));
const moduleIds = files.map((f) => f.slice(2, -3));
for (const f of files) {
  const text = read(path.join(REF, f));
  const heads = [...text.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  if (JSON.stringify(heads) !== JSON.stringify(SECTIONS)) errors.push(`${f}: sections are [${heads.join(' | ')}], expected the 10 standard sections in order`);
  if (!text.startsWith(`# ${f.slice(0, -3)}\n`)) errors.push(`${f}: title must be "# ${f.slice(0, -3)}"`);
  // Output fields must be insight fields or finding categories
  const out = text.split('## Output fields')[1]?.split('\n## ')[0] ?? '';
  for (const m of out.matchAll(/`([a-z_]+)`/g)) {
    const name = m[1];
    if (/_/.test(name) || categories.has(name) || insightFields.has(name)) {
      if (!categories.has(name) && !insightFields.has(name) && !isDetailField(name)) errors.push(`${f}: output field \`${name}\` is not in insight.schema.json`);
    }
  }
  // Caps keys mentioned must exist in config.research_caps
  const caps = text.split('## Caps')[1]?.split('\n## ')[0] ?? '';
  for (const m of caps.matchAll(/`([a-z_]+)`/g)) if (m[1].includes('_') && !capKeys.has(m[1]) && !m[1].startsWith('research_')) errors.push(`${f}: cap \`${m[1]}\` is not in config.research_caps`);
}
function isDetailField(name) {
  const defs = insight.$defs;
  const pools = [defs.outlierHook, defs.competitorAd].map((d) => Object.keys(d.properties.details.properties));
  pools.push(Object.keys(insight.properties.own_account.properties), Object.keys(insight.properties.competitors_analysed.items.properties), Object.keys(insight.properties.diff_vs_previous.properties));
  return pools.some((p) => p.includes(name));
}

// 2. Registry rows ↔ files
const registry = read(path.join(REF, 'methods-registry.md'));
const rows = [...registry.matchAll(/^\| `([a-z0-9-]+)` \| `(m-[a-z0-9-]+\.md)` \|(.*)$/gm)];
const regIds = rows.map((r) => r[1]);
for (const r of rows) if (r[2] !== `m-${r[1]}.md`) errors.push(`methods-registry.md: ${r[1]} points to ${r[2]}`);
for (const id of moduleIds) if (!regIds.includes(id)) errors.push(`m-${id}.md has no row in methods-registry.md`);
for (const id of regIds) if (!moduleIds.includes(id)) errors.push(`methods-registry.md lists ${id}, but m-${id}.md doesn't exist`);
// "Needs a person?" column agrees with the module's own answer (first word)
for (const r of rows) {
  const cells = r[3].split('|').map((c) => c.trim());
  const regAnswer = /^\*?\*?yes/i.test(cells[3]) ? 'yes' : /^no/i.test(cells[3]) || /^web route: no/i.test(cells[3]) ? 'no' : '?';
  const mod = read(path.join(REF, `m-${r[1]}.md`)).split('## Needs a person present?')[1]?.trim() ?? '';
  const modAnswer = /^\*?\*?yes/i.test(mod) ? 'yes' : /^(no|web route: no)/i.test(mod) ? 'no' : '?';
  if (regAnswer !== modAnswer) errors.push(`${r[1]}: registry says "${cells[3].slice(0, 30)}…" but the module says "${mod.slice(0, 30)}…"`);
}

// 3. Router uses only registry ids, and every id appears in it
const router = read(path.join(REF, 'router.md'));
const table = router.split('## 3.')[1].split('## 4.')[0];
const routed = new Set([...table.matchAll(/\b([a-z]+(?:-[a-z]+)+)\b/g)].map((m) => m[1]).filter((w) => !['new-client', 'no-browser'].includes(w)));
for (const w of routed) if (!regIds.includes(w)) errors.push(`router.md §3 names "${w}", which is not in methods-registry.md`);
for (const id of regIds) if (!router.includes(id)) errors.push(`router.md never mentions ${id}`);

// 4. Links between reference files resolve
for (const f of fs.readdirSync(REF)) {
  for (const m of read(path.join(REF, f)).matchAll(/`((?:m-[a-z0-9-]+|[a-z-]+)\.md)`/g)) {
    const target = m[1];
    const known = fs.existsSync(path.join(REF, target)) || ['README.md', 'SKILL.md', 'CHANGELOG.md'].includes(target) || target.startsWith('google-sheets') || target.startsWith('files-backup');
    if (!known && !fs.existsSync(path.join(SKILL, target))) errors.push(`${f}: mentions ${target}, which doesn't exist in references/`);
  }
}

console.log(`${files.length} modules, ${regIds.length} registry rows, ${routed.size} method ids in the router table`);
if (errors.length) {
  for (const e of errors) console.log(`FAIL  ${e}`);
  process.exit(1);
}
console.log('PASS  modules, registry and router agree');
