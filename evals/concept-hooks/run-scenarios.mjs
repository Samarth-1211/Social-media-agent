#!/usr/bin/env node
// Runs the concept + hooks scenarios (evals/scenarios/concept-hooks.md) and an end-to-end pipeline run
// headless on fixtures, then checks the saved data.
// Usage:
//   node evals/concept-hooks/run-scenarios.mjs                run every run
//   node evals/concept-hooks/run-scenarios.mjs E2E-new G2-on  run only these
//   node evals/concept-hooks/run-scenarios.mjs --check-only   re-check saved outputs without running Claude
//   --parallel N                                              runs at once (default 3)
// Needs the Claude Code CLI, signed in. Sonnet, files mode, live Google/web tools off, AskUserQuestion off.
// Outputs: evals/results/concept-hooks-runs.local/<run>/ (data folder, transcript.json) and summary.json.

import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLUGIN = path.join(ROOT, 'plugins', 'social-media-manager');
const C = path.join(PLUGIN, 'library', 'contracts');
const RES = path.join(ROOT, 'evals', 'results', 'concept-hooks-runs.local');
const DENY = ['AskUserQuestion', 'WebSearch', 'WebFetch', 'Agent', 'Task', 'mcp__claude_ai_Google_Sheets', 'mcp__claude_ai_Google_Drive', 'mcp__claude_ai_Gmail', 'mcp__claude_ai_Meta_Ads', 'mcp__claude-in-chrome'];
const FIXTURE_MODE = `# Fixture mode (concept + hooks evals)

- Storage: **files mode**, data folder \`./.tdm-studio\` in this folder (library/storage/files-backup.md). No Google tools in this run; the Drive version files go to \`jobs/<job_id>/outputs/\` as files-backup.md says.
- Eval clock: **today is 2026-12-10** (India time). For get_now, use 2026-12-10 with the time from \`date +%T\`, e.g. 2026-12-10T11:05:00+05:30. Never use the computer's date.
- The person says who they are in their message; they are in team.json.
- Research tools (web, Instagram, Meta, Apify) are not available in this run. If research would run, treat it as unavailable and carry on the way the research stage says for that case.
- There is no tool for tappable questions here: ask in text with numbered options.
- Never contact anyone. Client messages you draft are given to the person to send.
`;
const FIRST = 'Read FIXTURE-MODE.md in this folder first and follow it for this whole run. Use the social-media-manager plugin skills.';

const ajv = new Ajv2020({ strict: true, allErrors: true });
addFormats(ajv);
ajv.addKeyword({ keyword: 'x-version', schemaType: 'number' });
const V = Object.fromEntries(['concept', 'hooks', 'job'].map((n) => [n, ajv.compile(JSON.parse(fs.readFileSync(path.join(C, `${n}.schema.json`), 'utf8')))]));

// ── runs ──
// turns: fixed replies in order. driver: decides the next reply from the saved job (or null = stop).
const RUNS = {
  'E2E-new': {
    job: null, seed: {}, maxTurns: 12,
    prompt: "I'm Samarth (admin). Naya job: Saanjh Ethnic Wear (Bhopal) ke liye winter wedding-guest kurta set reel. Festive kurta set ₹1,499 custom fitting ke saath (profile price), 25 Dec tak fitting slot. 20 sec Instagram reel, Hinglish, WhatsApp pe booking. Full track, Ravi ko assign karo, budget 200, deadline 18 Dec. Urgent hai, research skip karo. Yeh naya job hai, kisi purane job ka duplicate nahi.",
    driver: e2eDriver,
  },
  'PIPE-SHL26': { job: 'SHL-26', seed: {}, maxTurns: 6, prompt: "I'm Ravi. SHL-26 aage badhao (brief approved hai).", driver: pickDriver('2B') },
  'QUICK-SHL27': { job: 'SHL-27', seed: {}, maxTurns: 5, prompt: "I'm Ravi. SHL-27 aage badhao.", driver: pickDriver('QA', 'Q') },
  'NRH-14': { job: 'NRH-14', seed: {}, maxTurns: 4, prompt: "I'm Ravi. NRH-14 aage badhao.", driver: stopAtPick },
  'H6-SJE03': { job: 'SJE-03', seed: {}, maxTurns: 4, prompt: "I'm Pooja. SJE-03 aage badhao.", driver: stopAtPick },
  'F1-SJE02': { job: 'SJE-02', seed: {}, maxTurns: 4, prompt: "I'm Pooja. SJE-02 aage badhao.", driver: stopAtPick },
  'G1-P3': { job: 'SHL-03', seed: { job: 'SHL-03' }, maxTurns: 3, prompt: "I'm Ravi. SHL-03 creative pick: 1 with 3A", driver: confirmDriver },
  'G1-P5': { job: 'SHL-03', seed: { job: 'SHL-03' }, maxTurns: 2, prompt: "I'm Ravi. SHL-03 creative pick: more hooks like 2A", driver: () => null },
  'G1-P6': { job: 'SHL-03', seed: { job: 'SHL-03' }, maxTurns: 2, prompt: "I'm Ravi. SHL-03 creative pick: none, make it funnier", driver: () => null },
  'G1-P7': { job: 'SHL-03', seed: { job: 'SHL-03' }, maxTurns: 2, prompt: "I'm Ravi. SHL-03: theek hai", driver: () => null },
  'G1-P8': { job: 'SHL-03', seed: { job: 'SHL-03' }, maxTurns: 1, prompt: "I'm Pooja. SHL-03 creative pick: 2B", driver: () => null },
  'G2-on': { job: 'SHL-03', seed: { job: 'SHL-03', variant: 'G2-on' }, maxTurns: 1, prompt: "I'm Ravi. SHL-03 continue karo.", driver: () => null },
  'G2-off': { job: 'SHL-03', seed: { job: 'SHL-03' }, maxTurns: 1, prompt: "I'm Ravi. SHL-03 continue karo.", driver: () => null },
};

const pending = (job) => (job?.gates || []).find((g) => g.status === 'pending');
function e2eDriver(job, text) {
  if (!job) return null; // no new job found: stop instead of looping
  const g = pending(job);
  if (g?.stage === 'script') return null; // reached the script gate: done
  if (g && ['intake', 'brief'].includes(g.stage)) return "I'm Samarth. approve";
  if (g?.stage === 'hooks') return "I'm Ravi. theek hai";
  if (asksQuestion(text)) return 'aap dekh lo';
  return 'aage badho';
}
function pickDriver(pick) {
  return (job, text) => {
    const g = pending(job);
    if (g?.stage === 'hooks') return job.outputs?.hooks?.data?.pick?.status === 'picked' ? null : `I'm Ravi. ${pick}`;
    if (g?.stage === 'script' || job?.current_stage === 'script') return null;
    return asksQuestion(text) ? 'aap dekh lo' : 'aage badho';
  };
}
function stopAtPick(job, text) {
  if (pending(job)?.stage === 'hooks') return null;
  return asksQuestion(text) ? 'aap dekh lo' : 'aage badho';
}
function confirmDriver(job) {
  return pending(job)?.stage === 'hooks' ? 'haan, yahi theek hai' : null;
}
const asksQuestion = (text) => /\?\s*$|\?\s*\n|\n\s*1\.\s.*\s2\.\s/m.test(text || '');

// ── running ──
const dirOf = (run) => path.join(RES, run);
const dataDir = (run) => path.join(dirOf(run), '.tdm-studio');
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const readJob = (run, id) => readJson(path.join(dataDir(run), 'jobs', id, 'job.json'));
function newJobId(run) {
  const ids = readJson(path.join(dataDir(run), 'jobs', 'index.json'))?.map((j) => j.job_id) || [];
  const fixtureIds = new Set(['SHL-15', 'SHL-26', 'SHL-27', 'SHL-03', 'NRH-14', 'SJE-01', 'SJE-02', 'SJE-03']);
  return ids.find((i) => !fixtureIds.has(i)) || fs.readdirSync(path.join(dataDir(run), 'jobs')).find((d) => !fixtureIds.has(d) && d !== 'index.json');
}

function prepare(name, r) {
  const dir = dirOf(name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const args = [path.join(ROOT, 'evals', 'concept-hooks-fixtures.mjs'), 'seed', dataDir(name), ...(r.seed.job ? ['--job', r.seed.job] : []), ...(r.seed.variant ? ['--variant', r.seed.variant] : [])];
  const res = spawnSync(process.execPath, args, { encoding: 'utf8' });
  if (res.status !== 0) throw new Error(res.stderr);
  fs.writeFileSync(path.join(dir, 'FIXTURE-MODE.md'), FIXTURE_MODE);
}

function claude(dir, prompt, sid) {
  // The prompt goes over stdin: no shell, so spaces and quotes in it are never split.
  const args = ['-p', '--plugin-dir', PLUGIN, '--model', 'sonnet', '--max-turns', '80', '--output-format', 'json',
    '--permission-mode', 'acceptEdits', '--allowedTools', 'Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill', 'TodoWrite',
    '--disallowedTools', ...DENY, ...(sid ? ['--resume', sid] : [])];
  return new Promise((resolve) => {
    const child = spawn('claude', args, { cwd: dir, stdio: ['pipe', 'pipe', 'pipe'] });
    child.stdin.end(prompt);
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('close', () => {
      try { resolve(JSON.parse(out)); } catch { resolve({ is_error: true, result: `unparsable output: ${out.slice(0, 500)} ${err.slice(0, 500)}` }); }
    });
  });
}

async function runOne(name) {
  const r = RUNS[name];
  prepare(name, r);
  const dir = dirOf(name);
  const turns = [];
  let sid = null;
  let prompt = `${FIRST} ${r.prompt}`;
  for (let t = 0; t < r.maxTurns; t++) {
    const res = await claude(dir, prompt, sid);
    sid = res.session_id || sid;
    turns.push({ user: prompt, assistant: res.result, cost: res.total_cost_usd, error: res.is_error || false });
    if (res.is_error) break;
    const id = r.job || newJobId(name);
    const next = r.driver(id ? readJob(name, id) : null, res.result);
    if (!next) break;
    prompt = next;
  }
  const cost = turns.reduce((a, t) => a + (t.cost || 0), 0);
  fs.writeFileSync(path.join(dir, 'transcript.json'), JSON.stringify({ run: name, cost, turns }, null, 1));
  console.log(`  ${name}: ${turns.length} turn(s), $${cost.toFixed(2)}`);
}

// ── checks ──
const words = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;
const FORBIDDEN = /sirf aaj|no\.?\s?1\b|10,?000|moti|slim|warna miss|time countdown|countdown timer/i;
function fullHooks(run, job) {
  // The Drive/outputs version file holds every hook; the job cell may hold the compact form.
  const v = job?.outputs?.hooks?.version;
  const candidates = [
    path.join(dataDir(run), 'jobs', job?.job_id || '', 'outputs', 'hooks', `hooks-v${v}.json`),
    path.join(dataDir(run), 'jobs', job?.job_id || '', 'hooks', `hooks-v${v}.json`),
  ];
  for (const p of candidates) { const d = readJson(p); if (d?.hooks) return { data: d, file: p }; }
  return { data: job?.outputs?.hooks?.data, file: null };
}
function checks(name) {
  const r = RUNS[name];
  const tr = readJson(path.join(dirOf(name), 'transcript.json'));
  if (!tr) return [{ c: 'ran', ok: false, note: 'not run' }];
  const id = r.job || newJobId(name);
  const job = id ? readJob(name, id) : null;
  const text = tr.turns.map((t) => t.assistant || '').join('\n');
  const out = [];
  const ok = (c, cond, note = '') => out.push({ c, ok: !!cond, note: String(note).slice(0, 200) });
  const cdata = job?.outputs?.concept?.data;
  const hjob = job?.outputs?.hooks?.data;
  const { data: hfull, file: hfile } = fullHooks(name, job);
  const gate = (stage) => (job?.gates || []).filter((g) => g.stage === stage).at(-1);
  const valid = (n, d) => (d && !d.placeholder ? (V[n](d) ? true : V[n].errors.map((e) => `${e.instancePath} ${e.message}`).join('; ')) : 'missing');
  const conceptChecks = () => {
    const vr = valid('concept', cdata);
    ok('concept schema-valid', vr === true, vr);
    const types = new Set((cdata?.concepts || []).map((c) => c.angle_type));
    ok('3 concepts, 3 angle types', (cdata?.concepts || []).length === 3 && types.size === 3, [...types].join());
    ok('core insight sourced', !!cdata?.core_insight?.source?.kind, cdata?.core_insight?.text);
    ok('one recommended', (cdata?.concepts || []).filter((c) => c.recommended).length === 1 && !!cdata?.recommended?.concept_ref);
    ok('no invented credit numbers', (cdata?.concepts || []).every((c) => !c.producibility?.credit_estimate));
    ok('self_check CC ids', (cdata?.self_check?.items || []).filter((i) => /^CC\d+$/.test(i.id)).length >= 10, (cdata?.self_check?.items || []).length);
  };
  const hookChecks = (perConceptMin = 8) => {
    const vr = valid('hooks', hjob);
    ok('hooks schema-valid (job cell)', vr === true, vr);
    if (hfile) { const vf = V.hooks(hfull) ? true : V.hooks.errors.map((e) => `${e.instancePath} ${e.message}`).join('; '); ok('hooks version file schema-valid', vf === true, vf); }
    ok('hooks version file saved', !!hfile, hfile ? path.relative(dirOf(name), hfile) : 'none');
    const all = hfull?.hooks || [];
    const groups = Object.groupBy(all, (h) => h.concept_ref || 'Q');
    for (const [k, hs] of Object.entries(groups)) {
      const formulas = new Set(hs.map((h) => h.formula_id));
      ok(`${k}: ≥${perConceptMin} hooks`, hs.length >= perConceptMin, hs.length);
      ok(`${k}: ≥5 formulas`, formulas.size >= 5, formulas.size);
      ok(`${k}: ≥2 visual-led`, hs.filter((h) => (h.tags || []).includes('visual-led')).length >= 2);
      ok(`${k}: ≥1 proof`, hs.some((h) => (h.tags || []).includes('proof')));
      ok(`${k}: critique pass (≥1 replaced/rewritten)`, hs.some((h) => h.status === 'replaced' || h.rewritten_from));
    }
    ok('every text ≤ 6 words', all.every((h) => words(h.layers?.text) <= 6), all.filter((h) => words(h.layers?.text) > 6).map((h) => h.id).join());
    ok('top_per_concept ≤ 3 each', Object.values(hjob?.top_per_concept || {}).every((a) => a.length <= 3));
    const tops = Object.values(hjob?.top_per_concept || {});
    const byId = Object.fromEntries((hfull?.hooks || hjob?.hooks || []).map((h) => [h.id, h]));
    const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\u0900-\u097f₹]+/g, ' ').trim();
    const lines = tops.flat().map((i) => norm(byId[i]?.layers?.spoken));
    ok('no duplicate top lines across concepts', new Set(lines).size === lines.length, lines.filter((l, i) => lines.indexOf(l) !== i).join(' | '));
    if (tops.length > 1) {
      const leads = tops.map((a) => byId[a[0]]?.formula_id);
      ok('no formula leads two concepts', new Set(leads).size === leads.length, leads.join());
    }
  };
  const pickChecks = () => {
    const g = gate('hooks');
    ok('creative pick gate approved', g?.status === 'approved', g ? `${g.status}/${g.decided_by}` : 'no gate');
    ok('pick saved as a later hooks version', hjob?.pick?.status === 'picked' && job.outputs.hooks.version >= 2, `v${job?.outputs?.hooks?.version} ${hjob?.pick?.status}`);
    const d = hjob?.downstream;
    ok('downstream complete', d && d.concept?.story_spine?.length && d.hook?.layers?.text && (d.backup_hooks || []).length === 2 && d.script_notes?.do?.length && d.script_notes?.dont?.length && (d.implied_assets || []).length && d.learning?.hook_formula_id, d ? Object.keys(d).join() : 'none');
    ok('learning outcome untested', d?.learning?.outcome === 'untested');
  };
  const scriptReached = () => {
    const sh = (job?.stage_history || []).map((h) => `${h.stage}:${h.status}`);
    ok('script stage ran after the pick', sh.some((s) => s.startsWith('script:')) && !!job?.outputs?.script, sh.slice(-3).join(' '));
  };
  switch (name) {
    case 'E2E-new': {
      ok('new job created', !!job, id);
      const sh = (job?.stage_history || []).map((h) => h.stage);
      for (const st of ['intake', 'research', 'brief', 'concept', 'hooks', 'script']) ok(`path includes ${st}`, sh.includes(st), sh.join(' '));
      ok('intake + brief approved by admin', gate('intake')?.status === 'approved' && gate('brief')?.status === 'approved' && gate('brief')?.decided_by_role === 'admin');
      ok('brief real (not placeholder)', job?.outputs?.brief?.data && !job.outputs.brief.data.placeholder);
      ok('research skipped (urgent)', ['skipped'].includes(job?.outputs?.research?.data?.research_status) || (job?.stage_history || []).some((h) => h.stage === 'research' && h.status === 'skipped'));
      conceptChecks(); hookChecks(); pickChecks(); scriptReached();
      break;
    }
    case 'PIPE-SHL26': {
      conceptChecks(); hookChecks(); pickChecks(); scriptReached();
      ok('competitors_overdo removal', (cdata?.raw_angles || []).some((a) => a.removed_reason === 'competitors_overdo'));
      ok('research cited in insight', /F\d+/.test(JSON.stringify(cdata?.core_insight?.source || {})), JSON.stringify(cdata?.core_insight?.source));
      ok('customer phrase F7/F8 hook', (hfull?.hooks || []).some((h) => (h.tags || []).includes('customer-phrase') && /razai ghar pe dhulti hi nahi|sweater mein se smell/i.test(h.layers?.spoken + h.layers?.text)));
      const hs = hfull?.hooks || [];
      const h30 = hs.filter((h) => h.formula_id === 'H30');
      const bad = hs.filter((h) => ['H21', 'H02'].includes(h.formula_id));
      ok('H30 boosted with a note', !h30.length || h30.every((h) => (h.scores?.adjustment ?? 0) >= 3 && h.boost_note), h30.map((h) => `${h.id}:${h.scores?.adjustment}`).join());
      ok('H21/H02 penalised with a note', !bad.length || bad.every((h) => (h.scores?.adjustment ?? 0) <= -3 && h.boost_note), bad.map((h) => `${h.id}:${h.scores?.adjustment}`).join());
      ok('H21/H02 not recommended', !['H21', 'H02'].includes(hs.find((h) => h.id === hjob?.recommended?.hook_id)?.formula_id));
      ok('picked 2B', hjob?.pick?.hook_id === '2B' && hjob?.pick?.concept_ref === 'C2', `${hjob?.pick?.concept_ref}/${hjob?.pick?.hook_id}`);
      break;
    }
    case 'QUICK-SHL27':
      ok('concept not run', !job?.outputs?.concept, job?.outputs?.concept ? 'concept output exists' : '');
      ok('quick-reuse from SHL-15', hjob?.track_mode === 'quick-reuse' && hjob?.reused_format?.source_job === 'SHL-15', JSON.stringify(hjob?.reused_format || {}).slice(0, 150));
      ok('Q ids', (hfull?.hooks || []).every((h) => /^Q[A-L]$/.test(h.id)));
      hookChecks(); pickChecks(); scriptReached();
      break;
    case 'NRH-14':
      conceptChecks(); hookChecks();
      ok('brand film uses a creative method', (cdata?.raw_angles || []).some((a) => a.engine === 'creative-method') || (cdata?.concepts || []).some((c) => c.creative_method));
      ok('Devanagari on-screen text', (hjob?.hooks || []).some((h) => /[ऀ-ॿ]/.test(h.layers?.text || '')));
      ok('no returns promise', !/return|appreciation|dugn|दोगुन|रिटर्न/i.test(JSON.stringify(hjob?.top_per_concept ? (hjob.hooks || []).filter((h) => h.status === 'top').map((h) => h.layers) : [])));
      ok('pick gate pending', pending(job)?.stage === 'hooks');
      break;
    case 'H6-SJE03': {
      conceptChecks();
      const shown = JSON.stringify([(cdata?.concepts || []).map((c) => [c.title, c.logline, c.story_spine, c.levers]), (hjob?.hooks || []).filter((h) => h.status === 'top').map((h) => h.layers)]);
      const m = shown.match(FORBIDDEN);
      ok('no fake urgency / invented numbers / shaming in concepts and top hooks', !m, m?.[0]);
      ok('a stock limit only with a confirmation', !/last 5/i.test(shown) || /needed[^}]*(confirm|count)/i.test(shown));
      ok('refusal explained in the reply', /no\.?\s?1|10,?000|slim|moti|sirf aaj|urgency|body/i.test(text));
      ok('job continued to the pick', pending(job)?.stage === 'hooks');
      break;
    }
    case 'F1-SJE02':
      conceptChecks();
      ok('fallback_used.brief', cdata?.fallback_used?.brief === true);
      ok('no invented price', !/₹\s?\d/.test(JSON.stringify(cdata?.concepts || [])), (JSON.stringify(cdata?.concepts || []).match(/₹\s?\d[\d,]*/) || [])[0]);
      ok('fallback said in the reply', /brief|placeholder|fallback/i.test(text));
      break;
    case 'G1-P3':
      ok('picked C1 + 3A', hjob?.pick?.concept_ref === 'C1' && hjob?.pick?.hook_id === '3A', `${hjob?.pick?.concept_ref}/${hjob?.pick?.hook_id}`);
      ok('mix note', !!hjob?.pick?.mix_note || !!hjob?.downstream?.concept?.mix_note);
      pickChecks();
      break;
    case 'G1-P5': {
      const g = (job?.gates || []).filter((x) => x.stage === 'hooks');
      ok('changes_requested recorded', g.some((x) => x.status === 'changes_requested'), g.map((x) => x.status).join());
      ok('more C2 hooks in a new version', (job?.outputs?.hooks?.version ?? 1) >= 2 && (hfull?.hooks || []).filter((h) => h.concept_ref === 'C2').length >= 8, (hfull?.hooks || []).filter((h) => h.concept_ref === 'C2').length);
      ok('pick shown again (new gate pending)', pending(job)?.stage === 'hooks');
      break;
    }
    case 'G1-P6': {
      const g = (job?.gates || []).filter((x) => x.stage === 'hooks');
      ok('sent back to concept', g.some((x) => x.status === 'sent_back' && x.sent_back_to === 'concept'), g.map((x) => `${x.status}->${x.sent_back_to}`).join());
      ok('reason recorded', g.some((x) => /funn/i.test(x.note || '')));
      break;
    }
    case 'G1-P7':
      ok('recommended pair picked', hjob?.pick?.concept_ref === 'C1' && hjob?.pick?.hook_id === '1C', `${hjob?.pick?.concept_ref}/${hjob?.pick?.hook_id}`);
      pickChecks();
      break;
    case 'G1-P8':
      ok('gate still pending', pending(job)?.stage === 'hooks');
      ok('no pick saved', hjob?.pick?.status === 'pending');
      ok('names who decides', /ravi|samarth/i.test(text));
      break;
    case 'G2-on': {
      const g = gate('hooks');
      ok('auto-picked by system', g?.status === 'approved' && g?.decided_by_role === 'system' && hjob?.pick?.auto === true, g ? `${g.status}/${g.decided_by_role}/${hjob?.pick?.auto}` : '');
      ok('ruling logged', (job?.log || []).some((l) => l.kind === 'ruling' && /auto/i.test(l.message)));
      ok('said in reply', /auto/i.test(text));
      break;
    }
    case 'G2-off':
      ok('not auto-picked', pending(job)?.stage === 'hooks' && hjob?.pick?.status === 'pending');
      break;
    default:
  }
  const jv = job ? (V.job(job) ? true : V.job.errors.slice(0, 3).map((e) => `${e.instancePath} ${e.message}`).join('; ')) : 'no job';
  ok('job record schema-valid', jv === true, jv);
  return out;
}

// ── main ──
const argv = process.argv.slice(2);
const checkOnly = argv.includes('--check-only');
const par = Number(argv[argv.indexOf('--parallel') + 1]) || 3;
const names = argv.filter((a) => RUNS[a]);
const todo = names.length ? names : Object.keys(RUNS);
fs.mkdirSync(RES, { recursive: true });
if (!checkOnly) {
  console.log(`Running ${todo.length} run(s), ${par} at a time…`);
  const queue = [...todo];
  await Promise.all(Array.from({ length: par }, async () => { while (queue.length) await runOne(queue.shift()); }));
}
const summary = {};
let fails = 0;
for (const n of todo) {
  const res = checks(n);
  summary[n] = res;
  const bad = res.filter((x) => !x.ok);
  fails += bad.length;
  console.log(`${bad.length ? '✘' : '✔'} ${n}: ${res.length - bad.length}/${res.length}`);
  for (const b of bad) console.log(`    - ${b.c}${b.note ? ` (${b.note})` : ''}`);
}
fs.writeFileSync(path.join(RES, 'summary.json'), JSON.stringify(summary, null, 1));
process.exit(fails ? 1 : 0);
