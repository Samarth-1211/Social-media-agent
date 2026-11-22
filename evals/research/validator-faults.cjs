// Plants one fault at a time in a throwaway copy of the repo and checks that validate.mjs reports it.
// Usage: node evals/research/validator-faults.cjs   (never edits the real repo)
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'tdm-faults-'));
for (const p of ['scripts', 'plugins', 'package.json', '.claude-plugin', 'node_modules']) fs.cpSync(path.join(REPO, p), path.join(ROOT, p), { recursive: true });
process.on('exit', () => fs.rmSync(ROOT, { recursive: true, force: true }));
const C = path.join(ROOT, 'plugins/social-media-manager/library/contracts');
const read = (p) => fs.readFileSync(p, 'utf8');

const cases = [
  ['unknown stage key', 'stages.yaml', (s) => s.replace('    freshness_days: 30\n', '    freshness_days: 30\n    freshnes_days: 30\n'), /unknown key "freshnes_days"/],
  ['bad freshness_days', 'stages.yaml', (s) => s.replace('freshness_days: 30', 'freshness_days: 0'), /freshness_days must be/],
  ['bad spend_gate', 'stages.yaml', (s) => s.replace('spend_gate: admin', 'spend_gate: editor'), /spend_gate must be/],
  ['finding without source', 'examples/insight.example.json', (s) => { const j = JSON.parse(s); delete j.findings.pain_points[1].source; return JSON.stringify(j); }, /insight\.example\.json.*source/],
  ['bad confidence word', 'examples/insight.example.json', (s) => { const j = JSON.parse(s); j.findings.proof_points[0].confidence = 'high'; return JSON.stringify(j); }, /insight\.example\.json.*confidence/],
  ['customer phrase without language', 'examples/insight.example.json', (s) => { const j = JSON.parse(s); delete j.findings.customer_phrases[0].language; return JSON.stringify(j); }, /insight\.example\.json.*language/],
  ['outlier hook without multiple', 'examples/insight.example.json', (s) => { const j = JSON.parse(s); delete j.findings.outlier_hooks[0].details.multiple; return JSON.stringify(j); }, /insight\.example\.json.*multiple/],
  ['extra field on a finding', 'examples/insight.example.json', (s) => { const j = JSON.parse(s); j.findings.pain_points[0].commenter = 'someone'; return JSON.stringify(j); }, /insight\.example\.json.*unevaluated/],
  ['struck finding in downstream', 'examples/insight.example.json', (s) => { const j = JSON.parse(s); j.findings.visual_cliches[0].struck = true; return JSON.stringify(j); }, /carries struck finding F10/],
  ['downstream text drift', 'examples/insight.example.json', (s) => { const j = JSON.parse(s); j.downstream.script.proof_points[0].text = 'changed'; return JSON.stringify(j); }, /F9 text differs/],
  ['duplicate finding id', 'examples/insight.example.json', (s) => { const j = JSON.parse(s); j.findings.proof_points[0].id = 'F1'; j.downstream.script.proof_points[0].id = 'F1'; return JSON.stringify(j); }, /finding id F1 is used twice/],
  ['job copy drifts from output', 'examples/job.example.json', (s) => s.replace('"research_status": "skipped",\n  "insight_id"', '"research_status": "fresh",\n  "insight_id"'), /research_status fresh differs/],
  ['skipped without flag', 'examples/job.example.json', (s) => s.replace('"flags": ["no_fresh_research"]', '"flags": []'), /no_fresh_research flag/],
  ['research output wrong shape', 'examples/job.example.json', (s) => s.replace('"concept_and_hooks": { "working_angles": [], "outlier_hooks": [], "competitors_overdo": [] },', ''), /outputs\.research\.data.*concept_and_hooks/],
  ['ledger currency typo', 'examples/job.example.json', (s) => s.replace('"credits": { "budget": 200, "warn_at": null, "used": 0, "ledger": [] }', '"credits": { "budget": 200, "warn_at": null, "used": 0, "ledger": [{ "at": "2026-11-15T11:20:00+05:30", "stage": "research", "amount": 0, "currency": "usd", "description": "x" }] }'), /currency/],
  ['competitor bad group', 'examples/client.example.json', (s) => s.replace('"group": "adjacent"', '"group": "neighbour"'), /client\.example\.json.*group/],
  ['config list as text', 'examples/config.example.json', (s) => s.replace('"research_unattended_clients": "all"', '"research_unattended_clients": "some"'), /config\.example\.json.*research_unattended_clients/],
  ['task bad id', 'examples/task.example.json', (s) => s.replace('"T-20261128-1"', '"T-1128-1"'), /task\.example\.json.*task_id/],
];

let pass = 0;
for (const [name, file, mutate, expect] of cases) {
  const p = path.join(C, file);
  const orig = read(p);
  fs.writeFileSync(p, mutate(orig));
  const res = spawnSync(process.execPath, [path.join(ROOT, 'scripts/validate.mjs')], { encoding: 'utf8', env: { ...process.env, SKIP_CLAUDE_VALIDATE: '1' } });
  fs.writeFileSync(p, orig);
  const out = res.stdout + res.stderr;
  const ok = res.status !== 0 && expect.test(out);
  if (ok) pass++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '\n' + out.split('\n').filter((l) => l.includes('- ')).slice(0, 4).join('\n')}`);
}
// And the clean copy still passes.
const clean = spawnSync(process.execPath, [path.join(ROOT, 'scripts/validate.mjs')], { encoding: 'utf8', env: { ...process.env, SKIP_CLAUDE_VALIDATE: '1' } });
console.log(`${clean.status === 0 ? 'PASS' : 'FAIL'}  clean copy validates`);
console.log(`\n${pass}/${cases.length} planted faults caught`);
