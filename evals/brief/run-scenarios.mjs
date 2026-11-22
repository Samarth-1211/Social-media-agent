#!/usr/bin/env node
// Runs the brief scenarios (evals/scenarios/brief.md) headless on fixtures and checks the saved data.
// Usage:
//   node evals/brief/run-scenarios.mjs                 run every run (in order; B5 replies and B13 reuse earlier runs' data)
//   node evals/brief/run-scenarios.mjs B1 B2           run only these
//   node evals/brief/run-scenarios.mjs --check-only    re-check saved outputs without running Claude
//   --parallel N                                       independent runs at once (default 3)
// Needs the Claude Code CLI, signed in. Sonnet, files mode, live Google/web tools off; AskUserQuestion off
// (headless), so the brief asks in text and a scripted responder answers by topic (answer keys below).
// Outputs: evals/results/brief-runs.local/<run>/ (data folder, transcript.json) and summary.json.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLUGIN = path.join(ROOT, 'plugins', 'social-media-manager');
const RES = path.join(ROOT, 'evals', 'results', 'brief-runs.local');
const FX = path.join(ROOT, 'evals', 'fixtures', 'brief');
const DENY = ['AskUserQuestion', 'WebSearch', 'WebFetch', 'Agent', 'Task', 'mcp__claude_ai_Google_Sheets', 'mcp__claude_ai_Google_Drive', 'mcp__claude_ai_Gmail', 'mcp__claude_ai_Meta_Ads', 'mcp__claude-in-chrome'];
const FIXTURE_MODE = `# Fixture mode (brief evals)

- Storage: **files mode**, data folder \`./.tdm-studio\` in this folder (library/storage/files-backup.md). No Google tools in this run.
- Eval clock: **today is 2026-12-08** (India time). For get_now, use 2026-12-08 with the time from \`date +%T\`, e.g. 2026-12-08T11:05:00+05:30. Never use the computer's date.
- The person says who they are in their message; they are in team.json.
- There is no tool for tappable questions here: ask in text with numbered options, as the brief's interview rules say.
- Never contact anyone. Client messages you draft are given to the person to send.
`;
const FIRST = 'Read FIXTURE-MODE.md in this folder first and follow it for this whole run. Use the social-media-manager plugin skills.';
const fixture = (n) => JSON.parse(fs.readFileSync(path.join(FX, `${n}.json`), 'utf8'));

// ── answer keys: [pattern on the brief's last message, reply] ──
const KEY_B2 = [[/rate|price|kitn|₹|daam|kitne ka|keemat/i, '₹299 per piece']];
const KEY_B4 = [
  [/opening|launch|khul|date|kab se|tareekh/i, '20 Dec ko opening'],
  [/offer|discount|chhoot/i, 'pehle 3 din 20% off'],
  [/post|deadline|kab tak|chahiye/i, '18 Dec tak post karna hai'],
  [/kya karein|aayein|whatsapp|call|end mein|channel|visit/i, 'shop aayein'],
];
const KEY_B5 = [[/rate|price|kitn|₹|date|kab tak|validity/i, 'client se poochna padega']];
const KEY_B6 = [[/rera/i, 'P-JBP-23-0456'], [/bhasha|language|hindi|english|hinglish/i, 'Hinglish']];
const KEY_B8 = [[/no\.? ?1|guarantee|10,?000|customer|claim|proof|sabut/i, 'Client ne bola hai likhna hai, likh do']];

const RUNS = {
  B1: { job: 'SHL-11', prompt: "I'm Ravi. brief SHL-11", key: [] },
  B2: { job: 'SHL-12', prompt: "I'm Ravi. brief SHL-12", key: KEY_B2 },
  B3: { job: 'SHL-13', prompt: "I'm Ravi. brief SHL-13. Neha ji ne bola: bas log call karein, chhota sa, jaise pichli baar. Koi offer nahi, bas winter reel.", key: [] },
  B4: { job: 'SHL-14', prompt: "I'm Ravi. brief SHL-14", key: KEY_B4 },
  B4b: { job: 'SHL-24', seedJob: 'SHL-24', prompt: "I'm Ravi. brief SHL-24", key: KEY_B4 },
  B5: { job: 'SHL-15', prompt: "I'm Ravi. brief SHL-15", key: KEY_B5 },
  ...Object.fromEntries(fixture('replies').replies.filter((r) => r.job_id === 'SHL-15').map((r) => [`B5-${r.id}`, {
    job: 'SHL-15', from: 'B5', prompt: `I'm Ravi. Neha ji ka reply aaya (SHL-15 brief questions): ${r.text}`, key: [], reply: r, maxTurns: 1,
  }])),
  'B5-R8': { job: 'SHL-11', from: 'B1', prompt: "I'm Ravi. Client ne SHL-11 pe likha: Logo thoda bada karo aur music badal do", key: [], reply: fixture('replies').replies.find((r) => r.id === 'R8'), maxTurns: 1 },
  B6: { job: 'NRH-10', prompt: "I'm Ravi. brief NRH-10", key: KEY_B6 },
  B7: { job: 'SHL-16', prompt: "I'm Ravi. brief SHL-16", key: [] },
  B8: { job: 'SHL-17', prompt: "I'm Ravi. brief SHL-17", key: KEY_B8 },
  B9: { job: 'SHL-18', prompt: "I'm Ravi. brief SHL-18", key: [] },
  'B9-NRH': { job: 'NRH-11', prompt: "I'm Ravi. brief NRH-11", key: [] },
  B10: { job: 'SHL-13', prompt: `I'm Samarth. Self-check this brief for SHL-13 before the gate, with the brief's ready-for-production checklist. Don't save anything; just list each check as pass or fail with the fix:\n\n${JSON.stringify(fixture('bad-brief').brief, null, 1)}`, key: [], maxTurns: 1 },
  B11: { job: 'NRH-12', prompt: "I'm Ravi. brief NRH-12", key: [] },
  'B12a': { job: 'SHL-19', seedJob: 'SHL-19', prompt: "I'm Ravi. brief SHL-19", key: [] },
  'B12b': { job: 'SHL-20', seedJob: 'SHL-20', prompt: "I'm Ravi. brief SHL-20", key: [] },
  'B12c': { job: 'SHL-22', seedJob: 'SHL-22', prompt: "I'm Ravi. brief SHL-22", key: [] },
  'B12d': { job: 'SHL-21', seedJob: 'SHL-21', prompt: "I'm Ravi. brief SHL-21", key: [] },
  'B12e': { job: 'SHL-23', seedJob: 'SHL-23', prompt: "I'm Ravi. brief SHL-23", key: [] },
};

// ── running ──
const dirOf = (run) => path.join(RES, run);
const jobPath = (run, id) => path.join(dirOf(run), '.tdm-studio', 'jobs', id, 'job.json');
const readJob = (run, id) => { try { return JSON.parse(fs.readFileSync(jobPath(run, id), 'utf8')); } catch { return null; } };
const briefOf = (job) => job?.outputs?.brief?.data;

function prepare(name, r) {
  const dir = dirOf(name);
  fs.rmSync(dir, { recursive: true, force: true });
  if (r.from) {
    fs.cpSync(dirOf(r.from), dir, { recursive: true, filter: (p) => !p.endsWith('transcript.json') });
  } else {
    fs.mkdirSync(dir, { recursive: true });
    const args = [path.join(ROOT, 'evals', 'brief-fixtures.mjs'), 'seed', path.join(dir, '.tdm-studio'), ...(r.seedJob ? ['--job', r.seedJob] : [])];
    const res = spawnSync(process.execPath, args, { encoding: 'utf8' });
    if (res.status !== 0) throw new Error(res.stderr);
  }
  fs.writeFileSync(path.join(dir, 'FIXTURE-MODE.md'), FIXTURE_MODE);
}

function claude(dir, prompt, sid) {
  const args = ['-p', prompt, '--plugin-dir', PLUGIN, '--model', 'sonnet', '--max-turns', '60', '--output-format', 'json',
    '--permission-mode', 'acceptEdits', '--allowedTools', 'Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill', 'TodoWrite',
    '--disallowedTools', ...DENY, ...(sid ? ['--resume', sid] : [])];
  return new Promise((resolve) => {
    const child = spawn('claude', args, { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('close', () => {
      try { resolve(JSON.parse(out)); } catch { resolve({ is_error: true, result: `unparsable output: ${out.slice(0, 500)} ${err.slice(0, 500)}` }); }
    });
  });
}

const asksQuestion = (text) => /\?\s*$|\?\s*\n|Guess:|guess:|अंदाज़ा:|\n\s*1\.\s.*\s2\.\s/m.test(text || '');

async function runOne(name) {
  const r = RUNS[name];
  prepare(name, r);
  const dir = dirOf(name);
  const turns = [];
  let sid = null;
  let prompt = `${FIRST} ${r.prompt}`;
  let questions = 0;
  const used = new Set();
  const startStatus = briefOf(readJob(name, r.job))?.status;
  for (let t = 0; t < 8; t++) {
    const res = await claude(dir, prompt, sid);
    sid = res.session_id || sid;
    turns.push({ user: prompt, assistant: res.result, cost: res.total_cost_usd, error: res.is_error || false });
    if (res.is_error || (r.maxTurns && turns.length >= r.maxTurns)) break;
    const st = briefOf(readJob(name, r.job))?.status;
    if (st === 'ready' || st === 'approved') break;
    if (st === 'awaiting-client' && st !== startStatus) break;
    if (!asksQuestion(res.result)) break;
    questions++;
    // Answer every key whose topic appears in the question lines (lines with '?'), each key once.
    const qText = (res.result || '').split('\n').filter((l) => l.includes('?')).join('\n') || res.result;
    const hits = r.key.filter(([re]) => re.test(qText) && !used.has(re));
    hits.forEach(([re]) => used.add(re));
    prompt = hits.length ? hits.map(([, a], i) => (hits.length > 1 ? `${i + 1}) ${a}` : a)).join(', ') : 'aap dekh lo';
  }
  const cost = turns.reduce((a, t) => a + (t.cost || 0), 0);
  fs.writeFileSync(path.join(dir, 'transcript.json'), JSON.stringify({ run: name, job: r.job, questions, cost, turns }, null, 1));
  console.log(`  ${name}: ${turns.length} turn(s), ${questions} question(s), $${cost.toFixed(2)}`);
}

// ── checks ──
const has = (b, p) => p.split('.').reduce((o, k) => o?.[k], b);
function checks(name) {
  const r = RUNS[name];
  const tPath = path.join(dirOf(name), 'transcript.json');
  if (!fs.existsSync(tPath)) return [{ c: 'ran', ok: false, note: 'not run' }];
  const tr = JSON.parse(fs.readFileSync(tPath, 'utf8'));
  const job = readJob(name, r.job);
  const b = briefOf(job) || {};
  const text = tr.turns.map((t) => t.assistant || '').join('\n');
  const out = [];
  const ok = (c, cond, note = '') => out.push({ c, ok: !!cond, note });
  const jargon = /\b(CTA|KPI|objective|USP|TG|target audience|funnel)\b/;
  const gate = (job?.gates || []).filter((g) => g.stage === 'brief').at(-1);
  const savedOk = () => {
    ok('saved: brief output + version file', job?.outputs?.brief?.version >= 1 && fs.existsSync(path.join(dirOf(name), '.tdm-studio', 'jobs', r.job, 'brief', `brief-v${job.outputs.brief.version}.json`)), `v${job?.outputs?.brief?.version}`);
    ok('self_check has 10 ids', (b.self_check || []).length >= 10, `${(b.self_check || []).length}`);
    ok('confidence filled', Object.keys(b.confidence || {}).length >= 4);
  };
  const gateOk = (wantSystem = false) => ok(wantSystem ? 'gate auto-approved by system' : 'admin gate requested (pending)', wantSystem ? gate?.decided_by === 'system' && gate?.status === 'approved' : gate?.status === 'pending' && gate?.owner_role === 'admin' && gate?.shown_outputs?.brief === job?.outputs?.brief?.version, gate ? `${gate.status}/${gate.decided_by || '-'}` : 'no gate');
  const noJargonQ = () => ok('no jargon in questions', !tr.turns.slice(0, -1).some((t) => jargon.test(t.assistant || '')));
  switch (name) {
    case 'B1':
      ok('0 questions', tr.questions === 0, `${tr.questions}`);
      ok('status ready', b.status === 'ready' && b.ready_for_production === true, b.status);
      ok('price 89 matches, validity 2026-12-31', b.offer_detail?.price === 89 && b.offer_detail?.profile_match === 'matches' && b.offer_detail?.validity === '2026-12-31', JSON.stringify(b.offer_detail));
      ok('cta whatsapp', b.cta_detail?.channel === 'whatsapp');
      ok('2 deliverables, status variant has changes_from_master', (b.deliverables || []).length === 2 && (b.deliverables || []).some((d) => d.platform === 'whatsapp-status' && d.changes_from_master));
      ok('research skipped with reason', b.research?.status === 'skipped' && !!b.research?.skip_reason);
      savedOk(); gateOk();
      // B13: the handoff block (from B1's saved brief)
      {
        const d = b.downstream || {};
        ok('B13 downstream has 5 parts', ['concept', 'hooks', 'script', 'localise', 'shot_sourcing'].every((k) => d[k]), Object.keys(d).join());
        ok('B13 concept: angle/format', !!(d.concept?.angle || d.concept?.creative_format));
        ok('B13 hooks: phrases verbatim from profile', (d.hooks?.customer_phrases || []).some((p) => ['kapde time pe chahiye', 'press wala nahi aaya', 'saree ka dry clean safe hai na?'].includes(p)), JSON.stringify(d.hooks?.customer_phrases));
        ok('B13 hooks: first frame price', /price|₹|89/i.test(d.hooks?.first_frame || ''), d.hooks?.first_frame);
        ok('B13 script: length, beats, offer and CTA lines', d.script?.duration_sec && (d.script?.structure || []).length >= 3 && d.script?.offer_line && d.script?.cta_line);
        ok('B13 localise: keeps brand name and price', /Shubh/i.test(JSON.stringify(d.localise?.keep_as_is || [])) && /89/.test(JSON.stringify(d.localise?.keep_as_is || [])), JSON.stringify(d.localise?.keep_as_is));
        ok('B13 shot_sourcing: person flag and must_show', typeof d.shot_sourcing?.person_on_camera === 'boolean' && (d.shot_sourcing?.must_show || []).length > 0);
      }
      break;
    case 'B2':
    {
      // A new item's price is client-only (Prompt 4 §4.4): one team question OR one client question is right.
      const cq = (b.client_questions || []).length;
      ok('exactly 1 question (team or client)', tr.questions + cq === 1, `team ${tr.questions}, client ${cq}`);
      ok('the question has a concrete price guess', /₹\s?\d/.test(cq ? String(b.client_questions[0].guess) : tr.turns[0]?.assistant || ''), cq ? b.client_questions[0].guess : '');
      ok('validity 2027-01-15', b.offer_detail?.validity === '2027-01-15');
      if (cq) ok('awaiting-client, waiting_on client, no gate', b.status === 'awaiting-client' && job?.waiting_on === 'client' && !gate);
      else { ok('price 299 not-in-profile', b.offer_detail?.price === 299 && b.offer_detail?.profile_match === 'not-in-profile', JSON.stringify(b.offer_detail)); gateOk(); }
      noJargonQ(); savedOk();
      break;
    }
    case 'B3':
      ok('channel call, objective leads', b.cta_detail?.channel === 'call' && b.objective_label === 'leads', `${b.cta_detail?.channel}/${b.objective_label}`);
      ok('duration 15-20', b.duration_sec >= 15 && b.duration_sec <= 20, `${b.duration_sec}`);
      ok('format from SHL-01 (offer-card-motion)', b.creative_format === 'offer-card-motion', b.creative_format);
      ok('no offer copied', !b.offer_detail && !/20%|25 Nov/.test(JSON.stringify(b.offer || '')), JSON.stringify(b.offer));
      ok('job_kind not offer-reel', b.job_kind && b.job_kind !== 'offer-reel', b.job_kind);
      savedOk();
      break;
    case 'B4':
    case 'B4b': {
      const cap = name === 'B4b' ? 2 : 5;
      ok(`questions 1..${cap}`, tr.questions >= 1 && tr.questions <= cap, `${tr.questions}`);
      ok('one question per message', tr.turns.slice(0, -1).every((t) => ((t.assistant || '').match(/\?/g) || []).length <= 2));
      ok('job_kind launch', b.job_kind === 'launch', b.job_kind);
      if (name === 'B4') ok('stopped early (<5)', tr.questions < 5, `${tr.questions}`);
      if (name === 'B4b') ok('blockers left in open_questions, essentials-confirmed false', (b.open_questions || []).length > 0 && (b.self_check || []).some((c) => c.check === 'essentials-confirmed' && !c.pass));
      noJargonQ();
      break;
    }
    case 'B5':
      ok('awaiting-client', b.status === 'awaiting-client', b.status);
      ok('waiting_on client, next_action prefix', job?.waiting_on === 'client' && /^Brief: waiting for client reply/.test(job?.next_action || ''), job?.next_action);
      ok('no brief gate requested', !gate);
      ok('client questions open with asked_at', (b.client_questions || []).filter((q) => q.status === 'open' && q.asked_at).length >= 1);
      ok('one numbered WhatsApp message', /Namaste|नमस्ते/.test(text) && /\n\s*1[.)]/.test(text) && /\n\s*2[.)]/.test(text));
      ok('no phone number or job id in the message', !/\+91\d{6,}/.test(text));
      break;
    case 'B5-R8':
      ok('brief not changed (not awaiting-client)', JSON.stringify(b) === JSON.stringify(briefOf(readJob('B1', 'SHL-11'))));
      ok('says it is client feedback', /feedback|client-feedback/i.test(text));
      break;
    case 'B6':
      ok('express line', /jaldi|express|urgent/i.test(text));
      ok('at most 1 question round', tr.questions <= 1, `${tr.questions}`);
      ok('RERA in mandatories', JSON.stringify(b.mandatories || []).includes('P-JBP-23-0456'));
      ok('offer 50,000 off till 2027-01-05', /50,?000|50000/.test(JSON.stringify(b.offer_detail || '') + (b.offer || '')) && b.offer_detail?.validity === '2027-01-05', JSON.stringify(b.offer_detail));
      ok('no auto-approve', gate?.decided_by !== 'system');
      break;
    case 'B7':
      ok('differs, profile 89, price 99', b.offer_detail?.price === 99 && b.offer_detail?.profile_match === 'differs' && b.offer_detail?.profile_price === 89, JSON.stringify(b.offer_detail));
      ok('flagged in open_questions or asked', /89/.test(JSON.stringify(b.open_questions || [])) || tr.questions > 0);
      break;
    case 'B8': {
      const asFact = [b.key_message, b.offer, ...(b.mandatories || []), ...(b.proof_points || []).map((p) => p.text), JSON.stringify(b.downstream?.script || {})].join(' ');
      ok('no No.1 / 100% guarantee as fact', !/no\.? ?1\b|100% guarantee/i.test(asFact.replace(/\[CLIENT TO CONFIRM[^\]]*\]/g, '')), asFact.slice(0, 200));
      ok('placeholder or question for the claims', /CLIENT TO CONFIRM/.test(JSON.stringify(b)) || (b.client_questions || []).length > 0 || /customer|guarantee|No\.?1/i.test(JSON.stringify(b.open_questions || [])));
      ok('no-invented-claims recorded', (b.self_check || []).some((c) => c.check === 'no-invented-claims'));
      break;
    }
    case 'B9':
      ok('research fresh with insight id', b.research?.status === 'fresh' && b.research?.insight_id === 'SHL-I261201-1', JSON.stringify(b.research || {}).slice(0, 120));
      ok('angle F5/F6 cited', (b.research?.angles_chosen || []).some((a) => ['F5', 'F6'].includes(a.id)));
      ok('pain point F2/F3 cited', (b.research?.pain_points_used || []).some((a) => ['F2', 'F3'].includes(a.id)));
      ok('customer phrase verbatim', JSON.stringify(b.downstream?.hooks?.customer_phrases || []).includes('saree ka dry clean safe hai na?'));
      break;
    case 'B9-NRH':
      ok('research skipped with reason', b.research?.status === 'skipped' && /no research output/i.test(b.research?.skip_reason || ''), b.research?.skip_reason);
      break;
    case 'B10': {
      const ids = ['editor-can-start', 'essentials-confirmed', 'offer-matches-profile', 'no-invented-claims', 'research-angle-or-reason', 'variants-consistent', 'pairs-agree', 'language-consistent', 'mandatories-present', 'downstream-complete'];
      const failed = ids.filter((id) => new RegExp(`${id}[^\\n]{0,80}(✘|❌|fail|FAIL)|(✘|❌|fail|FAIL)[^\\n]{0,40}${id}`, 'i').test(text));
      ok('≥ 8 checks fail', failed.length >= 8, `${failed.length}: ${failed.join(', ')}`);
      ok('the 6 named ones fail', ['editor-can-start', 'no-invented-claims', 'offer-matches-profile', 'essentials-confirmed', 'variants-consistent', 'mandatories-present'].every((id) => failed.includes(id)));
      break;
    }
    case 'B11': {
      const d = b.deliverables || [];
      ok('4 deliverables, platforms match', d.length === 4 && [...new Set(d.map((x) => x.platform))].sort().join() === [...(b.platforms || [])].sort().join(), d.map((x) => x.platform).join());
      ok('differing variants say what changes', d.every((x) => (x.aspect_ratio === b.aspect_ratio && (x.duration_sec == null || x.duration_sec === b.duration_sec)) || x.changes_from_master));
      ok('price 35 lakh onwards matches', b.offer_detail?.price === 3500000 && b.offer_detail?.profile_match === 'matches', JSON.stringify(b.offer_detail));
      ok('RERA in mandatories, cta call', JSON.stringify(b.mandatories || []).includes('P-JBP-23-0456') && b.cta_detail?.channel === 'call');
      break;
    }
    case 'B12a': gateOk(true); break;
    case 'B12b': case 'B12c': case 'B12d': case 'B12e':
      ok('admin gate, no auto', gate?.decided_by !== 'system' && gate?.status === 'pending', gate ? `${gate.status}/${gate.decided_by || '-'}` : 'no gate');
      ok('no claim the brief is approved', !/auto-approved|brief (v\d+ )?(is |has been )?approved|brief approve ho gaya/i.test(tr.turns.at(-1)?.assistant || ''));
      break;
    default:
      if (name.startsWith('B5-R')) {
        // "GUESS" = the value of that question's guess as the B5 run sent it.
        const asked = briefOf(readJob('B5', 'SHL-15'))?.client_questions || [];
        const guessOf = (field) => asked.find((q) => q.field === field)?.guess || '';
        const MONTHS = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
        const guessValue = (field) => {
          const g = guessOf(field);
          if (field.endsWith('price')) return Number((g.match(/₹\s?([\d,]+)/)?.[1] || '').replace(/,/g, '')) || null;
          const m = g.match(/(\d{1,2})\s*([A-Za-z]{3})[a-z]*\s*(\d{4})?/);
          if (!m) return null;
          const mm = MONTHS[m[2].toLowerCase()];
          return `${m[3] || (mm === '12' ? '2026' : '2027')}-${mm}-${m[1].padStart(2, '0')}`;
        };
        const want = (field) => (e[field] === 'GUESS' ? guessValue(field) : e[field]);
        const e = r.reply.expect;
        if ('offer_detail.price' in e) ok(`price ${want('offer_detail.price')}`, has(b, 'offer_detail.price') === want('offer_detail.price'), `${has(b, 'offer_detail.price')}`);
        if ('offer_detail.validity' in e) ok(`validity ${want('offer_detail.validity')}`, has(b, 'offer_detail.validity') === want('offer_detail.validity'), `${has(b, 'offer_detail.validity')}`);
        const open = (b.client_questions || []).filter((q) => q.status === 'open').length;
        if (e.still_open?.length) ok('still awaiting-client with open question', b.status === 'awaiting-client' && open >= 1, `${b.status}, ${open} open`);
        else ok('all answered, waiting_on none', open === 0 && job?.waiting_on !== 'client', `${b.status}, ${open} open, ${job?.waiting_on}`);
        if (e.new_condition) ok('new condition kept', /2\s*(kambal|blanket|piece|or more|\+)|do kambal|two/i.test(JSON.stringify(b.offer_detail?.conditions || []) + b.offer));
        // Only fields that put words on screen count; avoid, open_questions, notes and the changelog may name the declined claim.
        const claimFields = [b.key_message, b.offer, b.cta, ...(b.mandatories || []), ...(b.proof_points || []).map((p) => p.text),
          b.downstream?.script?.offer_line, b.downstream?.script?.cta_line, ...(b.downstream?.script?.must_say || [])].join(' ');
        if (e.must_not) ok('No.1 not added as a claim', !/no\.? ?1\b/i.test(claimFields), claimFields.slice(0, 120));
      }
  }
  // check 12 style pair rule on every saved brief
  if (b.offer_detail?.price != null && b.offer) ok('pair: offer shows the price', String(b.offer).replace(/(\d),(?=\d)/g, '$1').includes(String(b.offer_detail.price)));
  if (b.cta_detail && b.cta) ok('pair: cta contains action', b.cta.toLowerCase().includes(b.cta_detail.action.toLowerCase()));
  return out;
}

// ── main ──
const argv = process.argv.slice(2);
const checkOnly = argv.includes('--check-only');
const par = Number(argv[argv.indexOf('--parallel') + 1]) || 3;
const wanted = argv.filter((a) => RUNS[a]);
const names = wanted.length ? wanted : Object.keys(RUNS);
fs.mkdirSync(RES, { recursive: true });
if (!checkOnly) {
  const first = names.filter((n) => !RUNS[n].from);
  const later = names.filter((n) => RUNS[n].from);
  const queue = [...first];
  const work = async () => { while (queue.length) await runOne(queue.shift()); };
  await Promise.all(Array.from({ length: par }, work));
  const q2 = [...later];
  const work2 = async () => { while (q2.length) await runOne(q2.shift()); };
  await Promise.all(Array.from({ length: par }, work2));
}
const summary = {};
let pass = 0;
let total = 0;
for (const n of names) {
  const cs = checks(n);
  summary[n] = cs;
  const p = cs.filter((c) => c.ok).length;
  pass += p;
  total += cs.length;
  console.log(`${cs.every((c) => c.ok) ? '✔' : '✘'} ${n}  ${p}/${cs.length}`);
  for (const c of cs.filter((x) => !x.ok)) console.log(`     ✘ ${c.c}  ${c.note || ''}`);
}
fs.writeFileSync(path.join(RES, 'summary.json'), JSON.stringify(summary, null, 1));
console.log(`\n${pass}/${total} checks pass`);
