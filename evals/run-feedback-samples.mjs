// S7 (client-feedback triage) runner. Source of truth: evals/feedback-samples/samples.json.
// Usage (from the repo root):
//   node evals/run-feedback-samples.mjs render        rewrite the readable <id>.md files
//   node evals/run-feedback-samples.mjs run [ids...]  run samples headless through the plugin (dry run: no storage tools), 5 at a time
//   node evals/run-feedback-samples.mjs score         score the latest outputs against the expectations
// Needs the `claude` CLI. Outputs go to evals/results/feedback-runs.local/ (git-ignored).
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAMPLES = JSON.parse(fs.readFileSync(`${REPO}/evals/feedback-samples/samples.json`, 'utf8'));
const OUTDIR = path.join(REPO, 'evals', 'results', 'feedback-runs.local');
const PATHS = {
  'video-quick': 'intake, brief, concept, script, client-script-approval, storyboard, clips, voice-music, qa-clips, assemble, captions-motion, finish, client-final-approval, delivery',
  'video-full': 'intake, brief, concept, hooks, script, localise, client-script-approval, style-bible, casting, storyboard, production-plan, clips, voice-music, qa-clips, assemble, captions-motion, audio-mix, finish, resolve-export, client-final-approval, delivery',
  poster: 'intake, brief, concept, poster-drafts, client-poster-approval, poster-final, delivery',
};

function ctxTable(c) {
  return [
    ['Job', c.job], ['Path', PATHS[c.path]], ['Pending gate', c.pending_gate], ['Decision maker', c.decision_maker],
    ['Client languages', c.languages], ['revision_round so far', c.revision_round], ['revision_cap', c.revision_cap],
    ['Earlier feedback', c.earlier_feedback], ['Approved decisions', c.approved], ['From', c.from],
  ].map(([k, v]) => `| ${k} | ${v} |`).join('\n');
}

const cmd = process.argv[2];
if (cmd === 'render') {
  for (const s of SAMPLES) {
    const md = `# ${s.id}: ${s.title}\n\nCovers: ${s.covers.join(', ')}. All names and businesses are fictional. Source of truth: \`samples.json\`.\n\n## Job context (the current record)\n\n| | |\n|---|---|\n${ctxTable(s.ctx)}\n\n## Client reply (pasted by the assignee)\n\n\`\`\`\n${s.reply}\n\`\`\`\n\n## Expected\n\n${s.expected.note}\n\n- Items (by a phrase in the quote → accepted labels): ${s.expected.items.map((i) => `"${i.key}" → ${i.labels.join(' / ')}`).join('; ')}\n- Conflicts: ${s.expected.conflicts.length ? s.expected.conflicts.map((c) => c.type).join(', ') : 'none'}\n- Route: ${s.expected.routing.stage.map((x) => x ?? 'nothing reopened').join(' / ')} (${s.expected.routing.status.join(' / ')})\n- Over cap: ${s.expected.over_cap} · Round change: ${s.expected.round_change.join(' or ')}\n`;
    fs.writeFileSync(`${REPO}/evals/feedback-samples/${s.id}.md`, md);
  }
  console.log('rendered', SAMPLES.length);
} else if (cmd === 'run') {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const ids = process.argv.slice(3);
  const todo = SAMPLES.filter((s) => !ids.length || ids.includes(s.id));
  const runOne = (s) => new Promise((resolve) => {
    const prompt = `I'm Samarth (admin). EVALUATION DRY RUN: do not call any storage, Google Sheets or Drive tools, and do not save anything. Treat the job context below as the fresh get_job / brand brief read. Use the client-feedback skill to triage the client reply exactly as you would for real: show the change list, the routing proposal and the client message draft(s).\n\nJob context:\n${ctxTable(s.ctx)}\n\nClient reply (pasted by the assignee):\n"""\n${s.reply}\n"""\n\nAt the very end, add one fenced json block with exactly this shape (it's the feedback entry you would save, in short):\n{"items":[{"n":1,"quote":"...","label":"...","target_stage":null}],"conflicts":[{"type":"...","items":[1]}],"routing":{"proposed_stage":null,"status":"..."},"round":0,"over_cap":false,"revision_round_after":0}`;
    const child = spawn('claude', ['-p', '--plugin-dir', `${REPO}/plugins/social-media-manager`, '--allowedTools', 'Read,Glob,Grep', '--output-format', 'json'], { shell: false });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.on('close', () => { fs.writeFileSync(`${OUTDIR}/${s.id}.json`, out); resolve(); });
    child.stdin.write(prompt); child.stdin.end();
  });
  const pool = 5; let i = 0;
  await Promise.all(Array.from({ length: pool }, async () => { while (i < todo.length) await runOne(todo[i++]); }));
  console.log('ran', todo.length);
} else if (cmd === 'score') {
  let pass = 0; const lines = [];
  for (const s of SAMPLES) {
    const f = `${OUTDIR}/${s.id}.json`;
    if (!fs.existsSync(f)) { lines.push(`${s.id}: NOT RUN`); continue; }
    let res; try { res = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { lines.push(`${s.id}: bad output`); continue; }
    const text = res.result || '';
    const m = [...text.matchAll(/```json\s*([\s\S]*?)```/g)].pop();
    let got; try { got = JSON.parse(m[1]); } catch { lines.push(`${s.id}: no json block`); continue; }
    const fails = [];
    const e = s.expected;
    for (const it of e.items) {
      const match = got.items.filter((g) => (g.quote || '').toLowerCase().includes(it.key.toLowerCase()));
      if (!match.length) { fails.push(`no item quoting "${it.key}"`); continue; }
      if (!match.some((g) => it.labels.includes(g.label))) fails.push(`"${it.key}" labelled ${match.map((g) => g.label).join('/')} (want ${it.labels.join('/')})`);
    }
    const gotTypes = new Set((got.conflicts || []).map((c) => c.type));
    for (const c of e.conflicts) if (!gotTypes.has(c.type)) fails.push(`missing conflict ${c.type}`);
    if (!e.conflicts.length && gotTypes.size) fails.push(`unexpected conflicts ${[...gotTypes].join(',')}`);
    const rs = got.routing?.proposed_stage ?? null; const st = got.routing?.status;
    if (!e.routing.stage.includes(rs)) fails.push(`route ${rs} (want ${e.routing.stage.join('/')})`);
    if (!e.routing.status.includes(st)) fails.push(`routing status ${st} (want ${e.routing.status.join('/')})`);
    if (!!got.over_cap !== e.over_cap) fails.push(`over_cap ${got.over_cap}`);
    const before = s.ctx.revision_round; const delta = (got.revision_round_after ?? before) - before;
    if (!e.round_change.includes(delta)) fails.push(`round change ${delta} (want ${e.round_change.join('/')})`);
    if (!fails.length) pass++;
    lines.push(`${s.id}: ${fails.length ? 'FAIL: ' + fails.join('; ') : 'pass'}  ($${(res.total_cost_usd || 0).toFixed(2)})`);
  }
  console.log(lines.join('\n')); console.log(`\n${pass}/${SAMPLES.length} pass`);
}
