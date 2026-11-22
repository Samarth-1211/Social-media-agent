#!/usr/bin/env node
// Runs the market-researcher scenarios (evals/scenarios/market-researcher.md) on fixtures, headless, and checks the results.
// Usage:
//   node evals/research/run-scenarios.mjs                 run every scenario run, then check
//   node evals/research/run-scenarios.mjs onboard intake  run only these runs
//   node evals/research/run-scenarios.mjs --check-only    re-check the saved outputs without running Claude
// Needs the Claude Code CLI (`claude`), signed in. Each run uses Sonnet and only local files: live web, Meta,
// Google and browser tools are switched off, and fixture files stand in for them (evals/fixtures/research/FIXTURE-MODE.md).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { researchConsistency } from '../../scripts/lib/research-checks.mjs';
import { encodeRecord, decodeAll, normalise, headerRows, collectionOf } from '../../scripts/lib/sheet-codec.mjs';
import { FORBIDDEN } from '../fixtures/research/make-captures.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLUGIN = path.join(ROOT, 'plugins', 'social-media-manager');
const FIX = path.join(ROOT, 'evals', 'fixtures', 'research');
const RES = path.join(ROOT, 'evals', 'results', 'research-runs.local');
const DENY = ['WebSearch', 'WebFetch', 'mcp__claude_ai_Meta_Ads', 'mcp__claude_ai_Google_Sheets', 'mcp__claude_ai_Google_Drive', 'mcp__claude_ai_Gmail', 'mcp__claude_ai_Google_Docs', 'mcp__claude-in-chrome', 'mcp__Claude_Browser'];
const README_PROMPT = fs.readFileSync(path.join(PLUGIN, 'README.md'), 'utf8').split('### The prompt (paste exactly)')[1].split('```text')[1].split('```')[0].trim();
const FIRST = 'Read FIXTURE-MODE.md in this folder first and follow it for this whole run. Use the social-media-manager plugin skills.';

// ── runs: each covers one or more scenarios ──
const RUNS = {
  onboard: { data: 'new', turns: 90, scenarios: ['R1', 'R7', 'R13', 'R14', 'R15'],
    prompt: `${FIRST} I'm Samarth (admin). brand-keeper has just saved the new client Shubh Laundry & Dry Clean (client_id shubh-laundry, already in the data). Do what brand-keeper does right after a new client's first save: queue and start the client's first market research now. No browser is available. When it's done, reply with the research chat summary only.` },
  'onboard-inline': { data: 'new', turns: 90, deny: ['Agent', 'Task'], scenarios: ['R16', 'R13'],
    prompt: `${FIRST} Subagents are not available in this session. I'm Samarth (admin). brand-keeper has just saved the new client Shubh Laundry & Dry Clean (client_id shubh-laundry, already in the data). Do what brand-keeper does right after a new client's first save: queue and start the client's first market research now. No browser is available. When it's done, reply with the research chat summary only.` },
  intake: { data: 'intake', turns: 70, scenarios: ['R2', 'R5', 'R6'],
    prompt: `${FIRST} I'm Samarth (admin). No browser is available. For each job in this order: SHL-05, NRH-02, SHL-06, tell the producer "next": run that job's next stages until the first gate, then go to the next job. Don't approve any gate. End with one line per job: its research_status and the stage it stopped at.` },
  monthly: { data: 'monthly', turns: 120, scenarios: ['R3', 'R9', 'R13', 'R14', 'R15'],
    prompt: `${FIRST}\n\n${README_PROMPT}` },
  tracker: { data: 'tracker', turns: 100, scenarios: ['R10', 'R4', 'R13'],
    prompt: `${FIRST} I'm Samarth (admin). A browser is available and I'm here (the fixture stand-ins). Start the session with the tracker: show me the status board. If you offer pending Instagram reads, my answer is yes: run them all now.` },
  r8: { data: 'new', turns: 40, scenarios: ['R8'],
    prompt: `${FIRST} For this test only, ig-viral IS installed: use the real installed skill named ig-viral if your skill list has it (under any prefix). Task, without saving any insight or changing .tdm-studio: rank the reels in fixtures/shubh-laundry/reels.tsv with research-methods' m-ig-outlier-read twice. (1) Through the installed ig-viral skill, giving it the rows as pasted data; if its helper scripts can't run, follow the module's rule for that case. (2) With the module's own fallback steps, ignoring ig-viral. Write out/r8-installed.json and out/r8-fallback.json, each {"path": "installed-skill" or "fallback", "skill_used": string or null, "accounts": [{"account", "median"}], "outliers": [{"account", "url", "views", "multiple"}]} listing only reels above 3x, multiples to 2 decimals.` },
  r11: { data: 'new', turns: 30, scenarios: ['R11'],
    prompt: `${FIRST} Plan only: run no research method and save nothing. For client shubh-laundry, do research-methods step 6 (tool check and plan; don't run competitor discovery, just count the competitors) and write the plan with templates/research-plan.md, twice. (a) With config as it is: write out/r11-a.md. (b) Pretend config.apify_enabled is true and check Apify exactly as router.md §1 says (token, CLI, connector), without running any Apify actor: write out/r11-b.md. Don't edit .tdm-studio.` },
  r12: { data: 'new', turns: 20, scenarios: ['R12'],
    prompt: `${FIRST} Read the research-methods checklist checklists/before-saving.md and the draft insight in fixtures/r12-draft.md (and nothing in the skill's examples folder). Apply the checklist to the draft as if you were about to save it: fix or drop every failing finding. Write the findings you would keep to out/r12.json as a JSON list of {"category", "text", "source", "confidence", "language" (customer phrases only)}, and write what you dropped or changed and why to out/r12-dropped.md.` },
};

// ── helpers ──
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const walk = (d, out = []) => { if (!fs.existsSync(d)) return out; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p, out) : out.push(p); } return out; };
function prepare(name, run) {
  const work = path.join(os.tmpdir(), `tdm-research-${name}`);
  fs.rmSync(work, { recursive: true, force: true });
  fs.mkdirSync(path.join(work, 'out'), { recursive: true });
  spawnSync(process.execPath, [path.join(FIX, 'make-data.mjs'), run.data, work], { stdio: 'inherit' });
  fs.cpSync(path.join(FIX, 'captures'), path.join(work, 'fixtures'), { recursive: true });
  fs.copyFileSync(path.join(FIX, 'FIXTURE-MODE.md'), path.join(work, 'FIXTURE-MODE.md'));
  const bad = fs.readFileSync(path.join(PLUGIN, 'skills/pre-production/research-methods/examples/bad-invented-stats.md'), 'utf8');
  fs.writeFileSync(path.join(work, 'fixtures', 'r12-draft.md'), '# Draft insight (to self-check)\n\n' + bad.split('## The draft')[1].split('## What')[0].trim() + '\n');
  return work;
}
function runClaude(name, run, work) {
  return new Promise((resolve) => {
    const args = ['-p', run.prompt, '--plugin-dir', PLUGIN, '--model', 'sonnet', '--max-turns', String(run.turns),
      '--output-format', 'stream-json', '--verbose', '--permission-mode', 'acceptEdits',
      '--allowedTools', 'Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Agent', 'Skill', 'TodoWrite',
      '--disallowedTools', ...DENY, ...(run.deny || [])];
    fs.mkdirSync(RES, { recursive: true });
    const out = fs.createWriteStream(path.join(RES, `${name}.jsonl`));
    const child = spawn('claude', args, { cwd: work, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.pipe(out); child.stderr.pipe(out);
    child.on('close', (code) => { out.end(); resolve(code); });
  });
}
function events(name) {
  const p = path.join(RES, `${name}.jsonl`);
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter((l) => l.startsWith('{')).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}
function toolUses(evs) {
  const uses = [];
  for (const e of evs) for (const c of e.message?.content ?? []) if (c.type === 'tool_use') uses.push({ name: c.name, input: c.input, sub: !!e.parent_tool_use_id });
  return uses;
}
const finalText = (evs) => evs.filter((e) => e.type === 'result').map((e) => e.result || '').join('\n');
function saveCopy(name, work) {
  const dst = path.join(RES, name);
  fs.rmSync(dst, { recursive: true, force: true });
  fs.cpSync(path.join(work, '.tdm-studio'), path.join(dst, '.tdm-studio'), { recursive: true });
  fs.cpSync(path.join(work, 'out'), path.join(dst, 'out'), { recursive: true });
}
function load(dir) {
  const D = path.join(dir, '.tdm-studio');
  const f = (rel) => (fs.existsSync(path.join(D, rel)) ? readJson(path.join(D, rel)) : null);
  const clients = (f('clients/index.json') || []).map((c) => f(`clients/${c.client_id}/client.json`)).filter(Boolean);
  const insights = walk(path.join(D, 'clients')).filter((p) => p.endsWith(`${path.sep}insight.json`)).map(readJson);
  const jobs = (f('jobs/index.json') || []).map((j) => f(`jobs/${j.job_id}/job.json`)).filter(Boolean);
  return { D, config: f('config.json'), team: f('team.json') || [], tasks: f('tasks.json') || [], clients, insights, jobs };
}

// ── checks shared by every run ──
const ajv = new Ajv2020({ strict: true, allErrors: true }); addFormats(ajv); ajv.addKeyword({ keyword: 'x-version', schemaType: 'number' });
for (const s of fs.readdirSync(path.join(PLUGIN, 'library/contracts')).filter((x) => x.endsWith('.schema.json'))) ajv.addSchema(readJson(path.join(PLUGIN, 'library/contracts', s)));
const schema = (n) => ajv.getSchema(`urn:tdm:social-media-manager:contracts:${n}`);
const sim = (cell) => (cell === '' ? '' : typeof cell === 'string' ? cell.replace(/^'/, '') : typeof cell === 'boolean' ? (cell ? 'TRUE' : 'FALSE') : String(cell));
function common(name, data, evs) {
  const r = [];
  const add = (id, ok, detail) => r.push({ id, ok, detail });
  // schema validity
  const bad = [];
  for (const [n, list] of [['client', data.clients], ['insight', data.insights], ['task', data.tasks], ['job', data.jobs], ['team', data.team]]) for (const rec of list) if (!schema(n)(rec)) bad.push(`${n} ${rec.insight_id || rec.client_id || rec.task_id || rec.job_id || rec.handle}: ${schema(n).errors.slice(0, 2).map((e) => `${e.instancePath} ${e.message}`).join('; ')}`);
  add('schemas', bad.length === 0, bad.join(' | ') || 'all records valid');
  const cons = researchConsistency({ jobs: data.jobs, insights: data.insights, clients: data.clients, tasks: data.tasks });
  add('consistency', cons.length === 0, cons.join(' | ') || 'job copies, insight ids and downstream agree');
  // R13 privacy: no reviewer or commenter identities anywhere the run wrote
  const files = walk(data.D); // stored data only (out/ holds test artefacts such as R12's notes on what was dropped)
  const leaks = [];
  for (const p of files) { const t = fs.readFileSync(p, 'utf8'); for (const w of FORBIDDEN) if (t.includes(w)) leaks.push(`${path.basename(p)}: ${w}`); }
  add('R13 privacy', leaks.length === 0, leaks.join(', ') || `${files.length} files scanned, no names or handles of reviewers/commenters`);
  // R14 every handoff field present and non-empty where findings exist
  const missing = [];
  for (const i of data.insights) { const d = i.downstream || {}; for (const [k, lists] of Object.entries({ brief: ['pain_points', 'working_angles', 'timely_hooks'], concept_and_hooks: ['working_angles', 'outlier_hooks', 'competitors_overdo'], script: ['proof_points'], localise: ['customer_phrases'], visuals: ['visual_cliches'] })) for (const l of lists) if (!Array.isArray(d[k]?.[l])) missing.push(`${i.insight_id} ${k}.${l}`); }
  add('R14 handoff block', missing.length === 0, missing.join(', ') || `${data.insights.length} insight(s): all 5 blocks and 10 lists present`);
  // R15 Sheets round trip of everything saved in files mode
  const rt = [];
  for (const [rec, list] of [['client', data.clients], ['insight', data.insights], ['task', data.tasks], ['job', data.jobs]]) for (const x of list) {
    const tabs = headerRows();
    for (const [tab, rows] of Object.entries(encodeRecord(rec, x))) tabs[tab] = tabs[tab].concat(rows.map((row) => row.map(sim)));
    const back = decodeAll(tabs)[collectionOf[rec]][0];
    if (JSON.stringify(normalise(back)) !== JSON.stringify(normalise(x))) rt.push(`${rec} ${x.insight_id || x.client_id || x.task_id || x.job_id}`);
  }
  add('R15 round trip', rt.length === 0, rt.join(', ') || 'files-mode records survive the Sheets round trip unchanged');
  // no live tools, no Apify runs
  const uses = toolUses(evs);
  const live = uses.filter((u) => DENY.some((d) => u.name.startsWith(d)) || (u.name === 'Bash' && /\bapify\s+(call|actors|run|datasets)/.test(u.input?.command || '')));
  add('no live calls', live.length === 0, live.map((u) => u.name).join(', ') || `${uses.length} tool calls, none live`);
  return r;
}

// ── per-run expectations ──
const byId = (list, k, v) => list.find((x) => x[k] === v);
const EXPECT = {
  onboard(d, evs) {
    const r = []; const add = (id, ok, detail) => r.push({ id, ok, detail });
    const c = d.clients[0]; const ins = d.insights.filter((i) => i.client_id === 'shubh-laundry');
    const i = ins[0];
    add('R1 first run started', ins.length === 1 && i?.trigger === 'onboarding' && c.latest_insight_id === i?.insight_id, `${ins.length} sheet(s); trigger ${i?.trigger}; latest ${c.latest_insight_id}`);
    add('R1 onboarding task', d.tasks.some((t) => t.kind === 'research-run' && t.trigger === 'onboarding'), d.tasks.map((t) => `${t.kind}/${t.trigger}/${t.status}`).join(', '));
    const methods = Object.fromEntries((i?.methods_used || []).map((m) => [m.method, m.status]));
    add('R1 methods', ['web-competitor-intel', 'meta-ad-library', 'maps-review-reading', 'trends'].every((m) => methods[m] && methods[m] !== 'skipped') && ['ig-outlier-read', 'comment-reading'].every((m) => methods[m] === 'queued'), JSON.stringify(methods));
    add('R1 browser step queued', i?.pending_browser_step?.pending === true && d.tasks.some((t) => t.kind === 'research-browser-step' && t.status === 'pending'), JSON.stringify(i?.pending_browser_step));
    add('R1 situations', ['new_client', 'local_service', 'no_browser'].every((s) => i?.situation?.includes(s)), (i?.situation || []).join(', '));
    const subagent = toolUses(evs).some((u) => (u.name === 'Agent' || u.name === 'Task') && /market-researcher/.test(JSON.stringify(u.input)));
    add('R1 used the subagent', subagent && i?.ran_without_subagent !== true, `subagent call: ${subagent}; ran_without_subagent: ${i?.ran_without_subagent}`);
    const comps = c.competitors || [];
    const live = comps.filter((x) => !x.struck);
    add('R7 discovery auto-accepts as guessed', live.length >= 6 && comps.filter((x) => x.added_on === '2026-11-28').every((x) => x.confidence === 'guessed'), live.map((x) => `${x.handle}:${x.group}:${x.confidence}`).join(', '));
    add('R7 struck never reused', comps.filter((x) => x.handle === 'ex_bhopal_laundromat').length === 1 && comps.find((x) => x.handle === 'ex_bhopal_laundromat').struck === true && !(i?.competitors_analysed || []).some((x) => x.handle === 'ex_bhopal_laundromat'), 'ex_bhopal_laundromat stays struck and unread');
    add('R7 no guessed handles', !JSON.stringify(comps).toLowerCase().includes('sparkle'), 'Sparkle Dry Clean (no findable handle) not added');
    return r;
  },
  'onboard-inline'(d, evs) {
    const r = []; const add = (id, ok, detail) => r.push({ id, ok, detail });
    const i = d.insights[0];
    const sub = toolUses(evs).some((u) => u.name === 'Agent' || u.name === 'Task');
    add('R16 ran inline', !sub && i?.ran_without_subagent === true, `subagent call: ${sub}; ran_without_subagent: ${i?.ran_without_subagent}`);
    const other = fs.existsSync(path.join(RES, 'onboard')) ? load(path.join(RES, 'onboard')).insights[0] : null;
    if (other && i) {
      const m = (x) => (x.methods_used || []).map((y) => `${y.method}:${y.status === 'skipped' ? 'skipped' : y.status === 'queued' ? 'queued' : 'ran'}`).sort().join(',');
      const cats = (x) => Object.entries(x.findings).filter(([, v]) => v.length).map(([k]) => k).sort();
      const shared = cats(i).filter((k) => cats(other).includes(k));
      add('R16 same sheet as with subagent', m(i) === m(other) && JSON.stringify(i.situation.slice().sort()) === JSON.stringify(other.situation.slice().sort()) && shared.length >= Math.min(cats(i).length, cats(other).length) - 1,
        `methods ${m(i) === m(other) ? 'same' : `differ: ${m(i)} vs ${m(other)}`}; finding lists in both: ${shared.join(', ')}`);
    } else add('R16 same sheet as with subagent', false, 'run "onboard" first to compare');
    return r;
  },
  intake(d, evs) {
    const r = []; const add = (id, ok, detail) => r.push({ id, ok, detail });
    const j = (id) => byId(d.jobs, 'job_id', id);
    const out = (id) => j(id)?.outputs?.research?.data;
    add('R2 fresh sheet reused', out('SHL-05')?.research_status === 'fresh' && out('SHL-05')?.insight_id === 'SHL-I202611-1' && d.insights.length === 2, `SHL-05: ${out('SHL-05')?.research_status}, insights now ${d.insights.length}`);
    add('R5 partial continues', out('NRH-02')?.research_status === 'partial' && out('NRH-02')?.flags?.includes('browser_step_pending') && j('NRH-02')?.current_stage !== 'research', `NRH-02: ${out('NRH-02')?.research_status}, at ${j('NRH-02')?.current_stage}`);
    const nrhLine = finalText(evs).split(/\r?\n/).find((l) => l.includes('NRH-02')) || '';
    add('R5 says the Instagram read stays queued (no browser)', /instagram/i.test(nrhLine) && /queued/i.test(nrhLine), nrhLine.slice(0, 160));
    const h = (j('SHL-06')?.stage_history || []).find((x) => x.stage === 'research');
    add('R6 urgent skipped and flagged', out('SHL-06')?.research_status === 'skipped' && out('SHL-06')?.flags?.includes('no_fresh_research') && h?.status === 'skipped', `SHL-06: ${out('SHL-06')?.research_status}, history ${h?.status}`);
    add('jobs moved on', ['SHL-05', 'NRH-02', 'SHL-06'].every((id) => j(id)?.current_stage === 'brief'), ['SHL-05', 'NRH-02', 'SHL-06'].map((id) => `${id}@${j(id)?.current_stage}`).join(', '));
    return r;
  },
  monthly(d, evs) {
    const r = []; const add = (id, ok, detail) => r.push({ id, ok, detail });
    const fresh = d.insights.filter((i) => i.trigger === 'schedule' && i.created_at.startsWith('2026-11'));
    add('R3 both sheets refreshed', ['shubh-laundry', 'narmada-heights'].every((c) => fresh.some((i) => i.client_id === c)), fresh.map((i) => i.insight_id).join(', '));
    add('R3 diffs written', fresh.length > 0 && fresh.every((i) => i.diff_vs_previous?.previous_insight_id && i.diff_vs_previous.summary), fresh.map((i) => `${i.insight_id}←${i.diff_vs_previous?.previous_insight_id}`).join(', '));
    add('R3 Instagram queued', d.tasks.filter((t) => t.kind === 'research-browser-step' && t.status === 'pending').length >= 2 && fresh.every((i) => i.pending_browser_step.pending), d.tasks.map((t) => `${t.client_id}:${t.kind}`).join(', '));
    add('R3 festival queued', d.tasks.some((t) => t.client_id === 'shubh-laundry' && t.trigger === 'festival' && t.due >= '2026-11-28'), d.tasks.filter((t) => t.trigger === 'festival').map((t) => `${t.occasion} due ${t.due}`).join(', ') || 'none');
    add('R3 one combined summary', /shubh|Shubh/.test(finalText(evs)) && /narmada|Narmada/.test(finalText(evs)), finalText(evs).split('\n').slice(0, 3).join(' / '));
    const o = fresh.find((i) => i.client_id === 'narmada-heights')?.own_account;
    add('R9 own-account audit automatic', o?.metrics_source === 'meta-connector' && [1300, 1500].includes(o?.median_views) && (o?.top || []).length > 0, `source ${o?.metrics_source}, median ${o?.median_views}, top ${(o?.top || []).length}`);
    add('unattended asked nothing', !/\?\s*$/.test(finalText(evs).trim()), 'no question at the end');
    return r;
  },
  tracker(d, evs) {
    const r = []; const add = (id, ok, detail) => r.push({ id, ok, detail });
    add('R10 festival run queued', d.tasks.some((t) => t.client_id === 'shubh-laundry' && t.trigger === 'festival' && /wedding/i.test(t.occasion || '') && t.due >= '2026-11-28'), d.tasks.map((t) => `${t.client_id}:${t.kind}:${t.trigger}:${t.status}`).join(', '));
    const all = evs.map((e) => JSON.stringify(e.message?.content ?? e.result ?? '')).join('\n');
    add('R4 pending read shown in status', /Instagram read pending/i.test(all), 'status line present');
    const t = byId(d.tasks, 'task_id', 'T-20261118-1');
    const i = byId(d.insights, 'insight_id', 'NRH-I202611-1');
    add('R4 one yes ran the queue', t?.status === 'done' && i?.pending_browser_step?.pending === false && i?.version >= 2 && (i?.findings?.outlier_hooks || []).length > 0, `task ${t?.status}; sheet v${i?.version}, pending ${i?.pending_browser_step?.pending}, ${(i?.findings?.outlier_hooks || []).length} outlier hooks`);
    const mult = (i?.findings?.outlier_hooks || []).map((h) => `${h.details.account}:${h.details.multiple}`);
    add('R4 outliers by own median', (i?.findings?.outlier_hooks || []).every((h) => h.details.multiple > 3), mult.join(', '));
    return r;
  },
  r8(d) {
    const r = []; const add = (id, ok, detail) => r.push({ id, ok, detail });
    const tsv = fs.readFileSync(path.join(FIX, 'captures/shubh-laundry/reels.tsv'), 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).slice(1).map((l) => l.split('\t'));
    const by = {}; for (const [a, , v, , , , , url] of tsv) (by[a] ??= []).push({ v: Number(v), url });
    const med = (xs) => { const s = xs.slice().sort((a, b) => a - b); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
    const truth = Object.entries(by).flatMap(([a, xs]) => { const m = med(xs.map((x) => x.v)); return xs.filter((x) => x.v / m > 3).map((x) => ({ a, url: x.url, mult: x.v / m })); });
    const o = path.join(path.dirname(d.D), 'out');
    for (const k of ['installed', 'fallback']) {
      const f = path.join(o, `r8-${k}.json`); if (!fs.existsSync(f)) { add(`R8 ${k}`, false, 'file missing'); continue; }
      const got = readJson(f).outliers || [];
      const ok = truth.every((t) => got.some((g) => g.url === t.url && Math.abs(g.multiple - t.mult) < 0.15)) && got.length === truth.length;
      add(`R8 ${k} path`, ok, `${got.length} outliers vs ${truth.length} expected (${truth.map((t) => `${t.a}:${t.mult.toFixed(2)}`).join(', ')}); skill ${readJson(f).skill_used}`);
    }
    return r;
  },
  r11(d, evs) {
    const r = []; const add = (id, ok, detail) => r.push({ id, ok, detail });
    const o = path.join(path.dirname(d.D), 'out');
    const a = fs.existsSync(path.join(o, 'r11-a.md')) ? fs.readFileSync(path.join(o, 'r11-a.md'), 'utf8') : '';
    const b = fs.existsSync(path.join(o, 'r11-b.md')) ? fs.readFileSync(path.join(o, 'r11-b.md'), 'utf8') : '';
    add('R11 Apify off: free only', /free/i.test(a) && !/apify-optional\b[^\n]*(·|:)[^\n]*cap/i.test(a), a.split('\n').find((l) => /Cost/i.test(l)) || 'no cost line');
    add('R11 enabled, no token: clean fallback', /apify/i.test(b) && /(not connected|no token|skipp|unavailable|not available)/i.test(b) && /free/i.test(b), b.split('\n').filter((l) => /apify/i.test(l)).slice(0, 2).join(' / '));
    add('R11 no Apify run', !toolUses(evs).some((u) => u.name === 'Bash' && /\bapify\s+(call|actors|run|datasets)/.test(u.input?.command || '')), 'no actor run attempted');
    return r;
  },
  r12(d) {
    const r = []; const add = (id, ok, detail) => r.push({ id, ok, detail });
    const o = path.join(path.dirname(d.D), 'out', 'r12.json');
    const text = fs.existsSync(o) ? fs.readFileSync(o, 'utf8') : '';
    const planted = [[/73\s?%/, 'invented statistic'], [/Riya Sharma/, 'commenter name'], [/250\s?K/i, 'raw-views ranking'], [/go viral/i, 'prediction'], [/indore_mom_diaries/, 'private account'], [/₹\s?40,?000/, 'spend claim'], [/best performer/i, 'performance claim'], [/trending all over India/i, 'unsourced trend'], [/The service was excellent/i, 'translated phrase']];
    const caught = planted.filter(([re]) => !re.test(text));
    add('R12 planted faults caught', text && caught.length === planted.length, `${caught.length}/${planted.length} removed or fixed${planted.filter(([re]) => re.test(text)).map(([, w]) => `; left: ${w}`).join('')}`);
    let list = []; try { list = JSON.parse(text); } catch { /* reported below */ }
    add('R12 kept findings carry source and confidence', Array.isArray(list) && list.every((f) => f.source && ['strong', 'some', 'weak'].includes(f.confidence)), `${list.length} findings kept`);
    return r;
  },
};

// ── main ──
const argv = process.argv.slice(2);
const checkOnly = argv.includes('--check-only');
const names = argv.filter((a) => !a.startsWith('--'));
const selected = names.length ? names : Object.keys(RUNS);
if (!checkOnly) {
  await Promise.all(selected.map(async (name, k) => {
    await new Promise((res) => setTimeout(res, k * 4000)); // stagger starts
    const run = RUNS[name]; const work = prepare(name, run);
    const t0 = Date.now(); const code = await runClaude(name, run, work);
    console.log(`ran ${name}: exit ${code}, ${Math.round((Date.now() - t0) / 1000)} s`);
    saveCopy(name, work);
  }));
}
let pass = 0, total = 0;
const report = [];
for (const name of selected) {
  const dir = path.join(RES, name);
  if (!fs.existsSync(dir)) { console.log(`\n${name}: no saved output`); continue; }
  const data = load(dir); const evs = events(name);
  const res = [...(EXPECT[name]?.(data, evs) || []), ...common(name, data, evs)];
  console.log(`\n== ${name} (${RUNS[name].scenarios.join(', ')})`);
  for (const x of res) { total++; if (x.ok) pass++; console.log(`${x.ok ? 'PASS' : 'FAIL'}  ${x.id}: ${x.detail}`); }
  report.push({ name, scenarios: RUNS[name].scenarios, results: res, summary: finalText(evs).slice(0, 1500) });
}
fs.writeFileSync(path.join(RES, 'report.json'), JSON.stringify(report, null, 1));
console.log(`\n${pass}/${total} checks passed`);
