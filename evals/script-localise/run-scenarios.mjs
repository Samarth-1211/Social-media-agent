#!/usr/bin/env node
// Runs the script + localise scenarios (evals/scenarios/script-localise.md) headless on fixtures,
// then checks the saved data. R1 (regression) runs offline, without Claude.
// Usage:
//   node evals/script-localise/run-scenarios.mjs                 every run
//   node evals/script-localise/run-scenarios.mjs S1-SHL30 R1     only these
//   node evals/script-localise/run-scenarios.mjs --check-only    re-check saved outputs without running Claude
//   --parallel N                                                 runs at once (default 3)
// Needs the Claude Code CLI, signed in. Sonnet, files mode, live Google/web tools off, AskUserQuestion off.
// Outputs: evals/results/script-localise-runs.local/<run>/ (data folder, transcript.json) and summary.json.
// NOT RUN on the feat/script-localise branch (admin decision): run after the merge, on "run".

import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { scriptConsistency, localisedConsistency, loadPacing } from '../../scripts/lib/script-checks.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLUGIN = path.join(ROOT, 'plugins', 'social-media-manager');
const C = path.join(PLUGIN, 'library', 'contracts');
const RES = path.join(ROOT, 'evals', 'results', 'script-localise-runs.local');
const DENY = ['AskUserQuestion', 'WebSearch', 'WebFetch', 'Agent', 'Task', 'mcp__claude_ai_Google_Sheets', 'mcp__claude_ai_Google_Drive', 'mcp__claude_ai_Gmail', 'mcp__claude_ai_Meta_Ads', 'mcp__claude-in-chrome'];
const FIXTURE_MODE = `# Fixture mode (script + localise evals)

- Storage: **files mode**, data folder \`./.tdm-studio\` in this folder (library/storage/files-backup.md). No Google tools in this run; Drive files go to \`jobs/<job_id>/outputs/\` as files-backup.md says.
- Eval clock: **today is 2026-12-12** (India time). For get_now, use 2026-12-12 with the time from \`date +%T\`, e.g. 2026-12-12T11:05:00+05:30. Never use the computer's date.
- The person says who they are in their message; they are in team.json.
- Python may or may not have IndicXlit. Run the localise skill's scripts/transliterate.py as it says and report the mode it gives.
- There is no tool for tappable questions here: ask in text with numbered options.
- Never contact anyone. Client messages you draft are given to the person to send.
`;
const FIRST = 'Read FIXTURE-MODE.md in this folder first and follow it for this whole run. Use the social-media-manager plugin skills.';

const ajv = new Ajv2020({ strict: true, allErrors: true });
addFormats(ajv);
ajv.addKeyword({ keyword: 'x-version', schemaType: 'number' });
const V = Object.fromEntries(['script', 'localised_script', 'job'].map((n) => [n, ajv.compile(JSON.parse(fs.readFileSync(path.join(C, `${n}.schema.json`), 'utf8')))]));
const REPLIES = JSON.parse(fs.readFileSync(path.join(ROOT, 'evals', 'fixtures', 'script-localise', 'replies.json'), 'utf8'));
const pacing = loadPacing();
const config = (run) => readJson(path.join(dataDir(run), 'config.json')) || {};

// ── runs ──
const pending = (job) => (job?.gates || []).find((g) => g.status === 'pending');
const asksQuestion = (text) => /\?\s*$|\?\s*\n|\n\s*1\.\s.*\s2\.\s/m.test(text || '');
const untilGate = (stage) => (job, text) => (pending(job)?.stage === stage ? null : asksQuestion(text) ? 'aap dekh lo' : 'aage badho');
const confirmOnce = (job, text, t) => (t === 0 && asksQuestion(text) ? 'haan, sahi samjhe' : null);

const RUNS = {
  'S1-SHL30': { job: 'SHL-30', maxTurns: 4, prompt: "I'm Ravi. SHL-30 aage badhao (creative pick ho gaya hai).", driver: untilGate('script') },
  'S3-SHL31': { job: 'SHL-31', maxTurns: 4, prompt: "I'm Ravi. SHL-31 aage badhao.", driver: untilGate('script') },
  'S5-SJE04': { job: 'SJE-04', maxTurns: 4, prompt: "I'm Pooja. SJE-04 aage badhao.", driver: untilGate('script') },
  ...Object.fromEntries(REPLIES.script_pick.map((r) => [`S6-${r.id}`, {
    job: 'SHL-32', maxTurns: 2, prompt: `I'm ${r.from === 'pooja' ? 'Pooja' : 'Ravi'}. SHL-32 script pick: ${r.reply}`, driver: confirmOnce, reply: r,
  }])),
  'L1-SHL33': { job: 'SHL-33', maxTurns: 4, prompt: "I'm Ravi. SHL-33 aage badhao (script pick ho gaya).", driver: untilGate('client-script-approval') },
  'L2-NRH15': { job: 'NRH-15', maxTurns: 4, prompt: "I'm Ravi. NRH-15 aage badhao.", driver: untilGate('client-script-approval') },
  'L1-SJE05': { job: 'SJE-05', seedJob: 'SJE-05', maxTurns: 4, prompt: "I'm Pooja. SJE-05 aage badhao.", driver: untilGate('client-script-approval') },
  'L5-SHL34': { job: 'SHL-34', maxTurns: 3, prompt: "I'm Ravi. SHL-34 ka localised script client ko bhejne se pehle dobara check karo, back-translation ke saath.", driver: untilGate('client-script-approval') },
  'A1-ok': { job: 'SHL-35', maxTurns: 2, prompt: `I'm Ravi. SHL-35: ${REPLIES.client[0].reply}`, driver: confirmOnce, reply: REPLIES.client[0] },
  'A1-changes': { job: 'SHL-35', maxTurns: 4, prompt: `I'm Ravi. SHL-35: ${REPLIES.client[1].reply}`, reply: REPLIES.client[1],
    driver: (job, text, t) => (t === 0 ? `I'm Ravi. ${REPLIES.client[1].followup}` : (pending(job)?.stage === 'script' ? null : asksQuestion(text) ? 'aap dekh lo' : null)) },
  'A1-offer': { job: 'SHL-35', maxTurns: 2, prompt: `I'm Ravi. SHL-35: ${REPLIES.client[2].reply}`, driver: () => null, reply: REPLIES.client[2] },
  'E2E-SHL30': { job: 'SHL-30', maxTurns: 8, prompt: "I'm Ravi. SHL-30 aage badhao.",
    driver: (job, text) => {
      const g = pending(job);
      if (g?.stage === 'script') return "I'm Ravi. A";
      if (g?.stage === 'client-script-approval') return "I'm Ravi. client approved: Haan theek hai, final karo. (Neha)";
      if (job?.current_stage && !['script', 'localise', 'client-script-approval'].includes(job.current_stage)) return null;
      return asksQuestion(text) ? 'aap dekh lo' : 'aage badho';
    } },
  R1: { offline: true },
};

// ── running ──
const dirOf = (run) => path.join(RES, run);
const dataDir = (run) => path.join(dirOf(run), '.tdm-studio');
function readJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }
const readJob = (run, id) => readJson(path.join(dataDir(run), 'jobs', id, 'job.json'));

function prepare(name, r) {
  const dir = dirOf(name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const args = [path.join(ROOT, 'evals', 'script-localise-fixtures.mjs'), 'seed', dataDir(name), ...(r.seedJob ? ['--job', r.seedJob] : [])];
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

function runOffline(name) {
  const dir = dirOf(name);
  fs.mkdirSync(dir, { recursive: true });
  const steps = [
    ['validator', [path.join(ROOT, 'scripts', 'validate.mjs')]],
    ['script-localise fixtures', [path.join(ROOT, 'evals', 'script-localise-fixtures.mjs'), 'check']],
    ['planted faults (check 13)', [path.join(ROOT, 'evals', 'script-localise', 'check-faults.mjs')]],
    ['brief fixtures', [path.join(ROOT, 'evals', 'brief-fixtures.mjs'), 'check']],
    ['concept-hooks fixtures', [path.join(ROOT, 'evals', 'concept-hooks-fixtures.mjs'), 'check']],
    ['validator faults (research)', [path.join(ROOT, 'evals', 'research', 'validator-faults.cjs')]],
    ['methods consistency (research)', [path.join(ROOT, 'evals', 'research', 'methods-consistency.cjs')]],
  ];
  const results = steps.map(([label, args]) => {
    const res = spawnSync(process.execPath, args, { encoding: 'utf8', env: { ...process.env, SKIP_CLAUDE_VALIDATE: '1' } });
    return { label, ok: res.status === 0, tail: (res.stdout + res.stderr).trim().split('\n').slice(-2).join(' | ') };
  });
  const py = spawnSync(process.platform === 'win32' ? 'python' : 'python3', ['-I', path.join(PLUGIN, 'skills', 'pre-production', 'localise', 'scripts', 'transliterate.py'), '--self-test'], { encoding: 'utf8' });
  results.push({ label: 'transliterate.py --self-test', ok: py.status === 0, tail: (py.stdout || py.stderr || '').trim() });
  const protectedPaths = ['plugins/social-media-manager/skills/control', 'plugins/social-media-manager/skills/brand', 'plugins/social-media-manager/skills/pre-production/research-methods', 'plugins/social-media-manager/agents', 'plugins/social-media-manager/skills/pre-production/brief', 'plugins/social-media-manager/skills/pre-production/concept', 'plugins/social-media-manager/skills/pre-production/hooks', 'plugins/social-media-manager/library/knowledge/india-consumer-psychology.md', 'plugins/social-media-manager/library/knowledge/README.md', 'evals/fixtures/brief', 'evals/fixtures/concept-hooks', 'evals/fixtures/research', 'evals/scenarios/brief.md', 'evals/scenarios/concept-hooks.md', 'evals/rubrics/brief.md', 'evals/rubrics/concept-hooks.md'];
  const diff = spawnSync('git', ['diff', '--stat', 'main', '--', ...protectedPaths], { cwd: ROOT, encoding: 'utf8' });
  results.push({ label: 'protected paths unchanged vs main (before the P-diffs)', ok: diff.status === 0 && !diff.stdout.trim(), tail: diff.stdout.trim().split('\n').slice(-1)[0] || 'clean' });
  fs.writeFileSync(path.join(dir, 'offline.json'), JSON.stringify(results, null, 1));
  console.log(`  ${name}: offline, ${results.filter((r) => r.ok).length}/${results.length}`);
}

async function runOne(name) {
  const r = RUNS[name];
  if (r.offline) return runOffline(name);
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
    const next = r.driver(readJob(name, r.job), res.result, t);
    if (!next) break;
    prompt = next;
  }
  const cost = turns.reduce((a, t) => a + (t.cost || 0), 0);
  fs.writeFileSync(path.join(dir, 'transcript.json'), JSON.stringify({ run: name, cost, turns }, null, 1));
  console.log(`  ${name}: ${turns.length} turn(s), $${cost.toFixed(2)}`);
}

// ── checks ──
const STIFF = /sangrahan|nishulk|swagat hai|swachhata|vastron|संग्रहण|निःशुल्क|स्वागत है|स्वच्छता|वस्त्र/i;
// "version" alone is jargon; "English version bhi ready hai" (client-review.md) is plain language
const JARGON = /\b(scene|CTA|VO|SRT|hook|v\d+|B-roll|localis|gate)\b|(?<!(?:English|Hindi|Hinglish) )\bversion\b/i;
const surface = (versions) => JSON.stringify((versions || []).map((v) => [v.scenes.map((s) => [s.vo_line, s.on_screen_text.map((c) => c.text)]), v.caption]));
function fullScript(run, job) {
  const v = job?.outputs?.script?.version;
  for (const p of [path.join(dataDir(run), 'jobs', job?.job_id || '', 'outputs', 'script', `script-v${v}.json`)]) { const d = readJson(p); if (d?.versions) return d; }
  return job?.outputs?.script?.data;
}

function checks(name) {
  const r = RUNS[name];
  if (r.offline) {
    const res = readJson(path.join(dirOf(name), 'offline.json'));
    return res ? res.map((x) => ({ c: x.label, ok: x.ok, note: x.tail })) : [{ c: 'ran', ok: false, note: 'not run' }];
  }
  const tr = readJson(path.join(dirOf(name), 'transcript.json'));
  if (!tr) return [{ c: 'ran', ok: false, note: 'not run' }];
  const job = readJob(name, r.job);
  const cfg = config(name);
  const text = tr.turns.map((t) => t.assistant || '').join('\n');
  const out = [];
  const ok = (c, cond, note = '') => out.push({ c, ok: !!cond, note: String(note).slice(0, 220) });
  const sc = fullScript(name, job);
  const lo = job?.outputs?.localised_script?.data;
  const valid = (n, d) => (d && !d.placeholder ? (V[n](d) ? true : V[n].errors.slice(0, 3).map((e) => `${e.instancePath} ${e.message}`).join('; ')) : 'missing');
  const scriptOk = () => {
    const vr = valid('script', sc);
    ok('script schema-valid', vr === true, vr);
    const ce = scriptConsistency(sc, { pacing, config: cfg });
    ok('script passes check 13 (times, pace, cards, pick)', ce.length === 0, ce.slice(0, 2).join(' | '));
  };
  const locOk = () => {
    const vr = valid('localised_script', lo);
    ok('localised_script schema-valid', vr === true, vr);
    const ce = localisedConsistency(lo, { script: job?.outputs?.script?.data, pacing, config: cfg });
    ok('localised passes check 13 (L4: SRT timing, ≤ 32 chars, cues)', ce.length === 0, ce.slice(0, 2).join(' | '));
    ok('approval step reached: client gate pending', pending(job)?.stage === 'client-script-approval', pending(job)?.stage);
  };
  const msgOk = (facts) => {
    const m = lo?.client_review_message?.text || '';
    const lines = m.split('\n').filter((l) => l.trim());
    ok('L6: message ≤ 12 lines, ≤ 700 chars', lines.length <= 12 && m.length <= 700, `${lines.length} lines, ${m.length} chars`);
    ok('L6: exact facts in the message', facts.every((f) => m.includes(f)), facts.filter((f) => !m.includes(f)).join());
    ok('L6: no jargon, no placeholders', !JARGON.test(m) && !m.includes('{{'), (m.match(JARGON) || [])[0]);
    ok('L6: OK ask', /\bOK\b/.test(m));
  };
  switch (name) {
    case 'S1-SHL30': {
      scriptOk();
      ok('S1: 2 versions, different structures', sc?.versions?.length === 2 && new Set(sc.versions.map((v) => v.structure_type)).size === 2, (sc?.versions || []).map((v) => v.structure_type).join());
      ok('S1: every version opens with the picked hook or a backup', (sc?.versions || []).every((v) => ['2B', '2A', '2C'].includes(v.hook_used?.hook_id)));
      ok('S1: caption + one CTA (WhatsApp)', (sc?.versions || []).every((v) => v.caption?.first_line && v.cta?.channel === 'whatsapp'));
      ok('S1: script-pick gate pending', pending(job)?.stage === 'script');
      ok('S2: the long hook line was split or cut (timing notes)', (sc?.versions || []).some((v) => (v.checks?.timing_notes || []).length > 0), JSON.stringify((sc?.versions || []).map((v) => v.checks?.timing_notes)).slice(0, 200));
      ok('S2: facts kept (₹249, 31 Dec, ₹299)', (sc?.versions || []).every((v) => /₹249/.test(surface([v])) && /31 Dec/.test(surface([v])) && /₹299/.test(surface([v]))));
      ok('S4: payoff scene named, before 60 %', (sc?.versions || []).every((v) => { const s = v.scenes.find((x) => x.n === v.checks?.payoff_scene); return s && s.start_sec < 0.6 * v.duration_sec; }));
      break;
    }
    case 'S3-SHL31': {
      scriptOk();
      const all = surface(sc?.versions);
      ok('S3: planted ₹199 gone', !/199/.test(all));
      ok('S3: planted 10,000+ gone', !/10[,.]?000/.test(all));
      ok('S3: planted No.1 gone', !/no\.?\s?1\b|number one|नंबर 1/i.test(all));
      ok('S3: the real price stays (₹249)', /₹249/.test(all));
      ok('S3: fact flags recorded', (sc?.versions || []).some((v) => (v.checks?.fact_flags || []).length > 0), JSON.stringify((sc?.versions || []).map((v) => v.checks?.fact_flags)).slice(0, 200));
      ok('S3: said in the reply', /199|10,?000|no\.?\s?1|invent|source|nahi/i.test(text));
      break;
    }
    case 'S5-SJE04': {
      scriptOk();
      ok('S5: critique notes on the middle', (sc?.versions || []).some((v) => (v.checks?.critique_notes || []).some((c) => ['no-escalation', 'other', 'buried-payoff'].includes(c.failure_mode) && c.fixed)));
      ok('S5: no two consecutive scenes with the same subject and shot', (sc?.versions || []).every((v) => v.scenes.every((s, i) => i === 0 || !(s.visual_action.subject === v.scenes[i - 1].visual_action.subject && s.visual_action.shot === v.scenes[i - 1].visual_action.shot))));
      ok('S5: the rack shot appears at most once per version', (sc?.versions || []).every((v) => v.scenes.filter((s) => /rack/i.test(s.visual_action.subject + s.visual_action.action)).length <= 1));
      ok('S5: tailoring table shown (profile do)', (sc?.versions || []).every((v) => v.scenes.some((s) => /tailor/i.test(JSON.stringify(s.visual_action)))));
      ok('S5: no body talk', !/slim|patli|moti|weight/i.test(surface(sc?.versions)));
      break;
    }
    case 'L1-SHL33': {
      locOk();
      // only what the audience sees or hears, not the stage's own notes (which may quote the old line)
      const all = JSON.stringify([(lo?.scenes || []).map((s) => [s.vo_line, (s.on_screen_text || []).map((c) => c.text)]), lo?.caption_post, lo?.client_review_message?.text]);
      ok('L1: planted stiff lines rewritten', !STIFF.test(all), (all.match(STIFF) || [])[0]);
      ok('L1: facts kept', /₹249/.test(all) && /31 Dec/.test(all) && /₹299/.test(all));
      const ns = lo?.numbers_spoken || [];
      ok('L3: ₹249 spoken as "do sau unchaas"', ns.some((n) => /249/.test(n.written) && /do sau unchaas|दो सौ उनचास|dhai sau|दो सौ उनचास/i.test(n.spoken)), JSON.stringify(ns).slice(0, 200));
      ok('L3: 31 Dec spoken', ns.some((n) => /31/.test(n.written) && /iktees|इकतीस/i.test(n.spoken)));
      ok('L3: TTS text has no digits', (lo?.vo_script?.lines || []).every((l) => !/\d/.test(l.tts_text)));
      ok('L7: no proposal for the confirmed brand name', !(lo?.pronunciation_proposals || []).some((p) => /shubh laundry/i.test(p.term)));
      msgOk(['₹249', '31 Dec']);
      break;
    }
    case 'L2-NRH15': {
      locOk();
      ok('L2: Devanagari output', lo?.writing_script === 'devanagari' && (lo?.scenes || []).some((s) => /[ऀ-ॿ]/.test(s.vo_line)));
      ok('L2: script check honest', ['verified', 'unverified'].includes(lo?.script_check?.status) && (lo?.script_check?.status === 'verified' ? lo.script_check.tool === 'indicxlit' : lo.script_check.tool === 'manual'), JSON.stringify(lo?.script_check));
      // Roman is allowed only for intended items: RERA, the registration number, the website, placeholders,
      // and the script's keep_as_is names (a brand without a Devanagari spelling stays Roman, hinglish-style.md §5)
      const keepRoman = (job?.outputs?.script?.data?.downstream?.keep_as_is || []).filter((k) => /[A-Za-z]/.test(k));
      const stripKeep = (t) => keepRoman.reduce((a, k) => a.split(k).join(' '), String(t).replace(/rera\.mp\.gov\.in|P-JBP-21-1234|\{\{.*?\}\}/g, ' '));
      ok('L2: no accidental mixed script (only RERA / numbers / website / kept names stay Roman)', (lo?.scenes || []).every((s) => !/\b(?!RERA\b)[A-Za-z]{3,}\b/.test(stripKeep(s.vo_line))), (lo?.scenes || []).map((s) => stripKeep(s.vo_line)).join(' | ').slice(0, 200));
      const ns = lo?.numbers_spoken || [];
      ok('L3: phone number spoken digit by digit in groups', ns.some((n) => n.kind === 'phone' && n.spoken.split(/[\s,]+/).filter(Boolean).length >= 10), JSON.stringify(ns.filter((n) => n.kind === 'phone')));
      ok('L3: TTS text has no digits (outside RERA)', (lo?.vo_script?.lines || []).every((l) => !/\d/.test(l.tts_text.replace(/P-JBP-21-1234/g, ''))));
      ok('L7: pronunciation proposals for the new names', ['Narmada', 'Napier', 'Agrawal'].filter((t) => (lo?.pronunciation_proposals || []).some((p) => p.term.includes(t))).length >= 2, (lo?.pronunciation_proposals || []).map((p) => p.term).join());
      ok('L4: Devanagari font note', !!lo?.captions_srt?.font_note);
      ok('L6: placeholder asked in plain words, not as a token', !(lo?.client_review_message?.text || '').includes('{{') && /possession|पज़ेशन|पजेशन|तारीख|महीना/i.test(lo?.client_review_message?.text || ''));
      msgOk(['P-JBP-21-1234']);
      ok('L6: no phone number in the client message', !/(?:\d[\s-]?){10}/.test(lo?.client_review_message?.text || ''));
      break;
    }
    case 'L1-SJE05': {
      locOk();
      const v = lo?.variants || [];
      ok('L1: English variant made', v.some((x) => x.language === 'English' && x.writing_script === 'english'), v.map((x) => x.language).join());
      ok('L1: variant keeps the price', v.every((x) => /₹1,499/.test(JSON.stringify(x.scenes))));
      ok('L1: downstream lists the variant', (lo?.downstream?.variants_available || []).includes('English'));
      ok('L1: one client message, with a line about the English version', /english/i.test(lo?.client_review_message?.text || ''));
      ok('L7: pronunciation proposal for Saanjh', (lo?.pronunciation_proposals || []).some((p) => /saanjh/i.test(p.term)));
      msgOk(['₹1,499']);
      break;
    }
    case 'L5-SHL34': {
      ok('L5: a new localised version', (job?.outputs?.localised_script?.version ?? 1) >= 2);
      ok('L5: drift found in scenes 5 and 6', [5, 6].every((n) => (lo?.back_translation?.drift || []).some((d) => d.scene === n && d.fixed)), JSON.stringify(lo?.back_translation?.drift).slice(0, 200));
      // the fixture moves the example offer to 25 Dec (eval clock 12 Dec)
      ok('L5: date back in scene 5 (25 Dec)', /25 Dec/.test(lo?.scenes?.[4]?.vo_line || ''), lo?.scenes?.[4]?.vo_line);
      ok('L5: condition back in scene 6', /299/.test(lo?.scenes?.[5]?.vo_line || ''), lo?.scenes?.[5]?.vo_line);
      const heard = JSON.stringify([(lo?.scenes || []).map((s) => [s.vo_line, (s.on_screen_text || []).map((c) => c.text)]), (lo?.vo_script?.lines || []).map((l) => l.tts_text), lo?.captions_srt?.srt]);
      ok('L5: no "sirf aaj" left (lines, TTS, SRT)', !/sirf aaj/i.test(heard));
      ok('L5: SRT matches the fix', /25 Dec/.test(lo?.captions_srt?.srt || '') && /299/.test(lo?.captions_srt?.srt || ''));
      locOk();
      break;
    }
    case 'A1-ok': {
      const g = (job?.gates || []).filter((x) => x.stage === 'client-script-approval').at(-1);
      ok('A1: client gate approved', g?.status === 'approved', g?.status);
      ok('A1: recorded by the assignee, quote in the note', g?.decided_by === 'ravi' && /perfect|final/i.test(g?.note || ''), g?.note);
      ok('A1: no feedback entry for a clear OK', (job?.client_feedback || []).length === 0);
      ok('A1: job moved on', job?.current_stage !== 'client-script-approval', job?.current_stage);
      break;
    }
    case 'A1-changes': {
      const f = (job?.client_feedback || []).at(-1);
      const items = (f?.items || []).filter((i) => ['in_scope', 'change_request'].includes(i.label));
      ok('A1: feedback entry with 2 actionable items', items.length >= 2, items.map((i) => `${i.label}:${i.target_stage}`).join());
      const word = items.find((i) => /wash|dhulne/i.test(i.quote));
      const brand = items.find((i) => /naam|shubh/i.test(i.quote));
      ok('A1: wording item → localise (P2) or script (before P2)', ['localise', 'script'].includes(word?.target_stage), word?.target_stage);
      ok('A1: brand-name item → script', brand?.target_stage === 'script', brand?.target_stage);
      ok('A1: proposed stage = script (the earliest)', f?.routing?.proposed_stage === 'script', f?.routing?.proposed_stage);
      const g = (job?.gates || []).filter((x) => x.stage === 'client-script-approval').at(-1);
      ok('A1: after "route ok": sent back to script', g?.status === 'sent_back' && g?.sent_back_to === 'script', `${g?.status}->${g?.sent_back_to}`);
      ok('A1: script re-run on the picked version only, pick pending', sc?.versions?.length === 1 && sc?.pick?.status === 'pending' && (sc?.pick?.edits || []).some((e) => /F1/.test(e.detail)), `${sc?.versions?.length} / ${sc?.pick?.status}`);
      ok('A1: client-changes pick shown (script gate pending)', pending(job)?.stage === 'script');
      break;
    }
    case 'A1-offer': {
      const f = (job?.client_feedback || []).at(-1);
      const it = (f?.items || []).find((i) => /25/.test(i.quote));
      ok('A1: offer change labelled change_request', it?.label === 'change_request', it?.label);
      ok('A1: routed to brief', it?.target_stage === 'brief', it?.target_stage);
      ok('A1: client gate still pending (admin decides)', pending(job)?.stage === 'client-script-approval');
      ok('A1: says the admin must confirm', /samarth|admin/i.test(text));
      break;
    }
    case 'E2E-SHL30': {
      const stages = (job?.stage_history || []).map((h) => `${h.stage}:${h.status}`);
      for (const st of ['script', 'localise', 'client-script-approval']) ok(`E2E: ${st} done`, stages.includes(`${st}:done`), stages.slice(-4).join(' '));
      ok('E2E: script pick approved (A)', sc?.pick?.status === 'picked' && sc?.pick?.version_id === 'A');
      locOk();
      out.pop(); // the approval gate is no longer pending in E2E
      ok('E2E: client approved, job moved on', (job?.gates || []).some((g) => g.stage === 'client-script-approval' && g.status === 'approved') && job?.current_stage !== 'client-script-approval', job?.current_stage);
      break;
    }
    default:
      if (name.startsWith('S6-')) {
        const e = r.reply.expect;
        const g = (job?.gates || []).filter((x) => x.stage === 'script').at(-1);
        if (e.refused) {
          ok('S6: gate still pending', g?.status === 'pending');
          ok('S6: no pick saved', sc?.pick?.status === 'pending');
          ok('S6: names who decides', e.names.some((n) => new RegExp(n, 'i').test(text)));
          break;
        }
        ok('S6: gate approved', g?.status === 'approved', g?.status);
        { const vr = valid('script', sc); ok('S6: picked script schema-valid (downstream complete)', vr === true, vr); }
        ok('S6: gate recorded before the pick version (shown v1)', g?.shown_outputs?.script === 1 && (job?.outputs?.script?.version ?? 0) >= 2);
        ok(`S6: picked ${e.pick}`, sc?.pick?.status === 'picked' && sc?.pick?.version_id === e.pick, `${sc?.pick?.status}/${sc?.pick?.version_id}`);
        const kinds = (sc?.pick?.edits || []).map((x) => x.kind);
        if (e.edits) ok('S6: no edits', kinds.length === 0, kinds.join());
        if (e.edit_kinds) ok(`S6: edit kind ${e.edit_kinds.join()}`, e.edit_kinds.every((k) => kinds.includes(k)) && (sc?.pick?.edits || []).every((x) => x.applied && x.rechecked !== false), kinds.join());
        ok(`S6: downstream ${e.duration_sec} s`, sc?.downstream?.duration_sec === e.duration_sec, sc?.downstream?.duration_sec);
        if (e.downstream_contains) ok('S6: scene taken from B', JSON.stringify(sc?.downstream?.scenes || []).includes(e.downstream_contains));
        if (e.scene_vo) for (const [n, w] of Object.entries(e.scene_vo)) ok(`S6: scene ${n} line edited`, new RegExp(w, 'i').test(sc?.downstream?.scenes?.find((s) => s.n === Number(n))?.vo_line || ''));
        if (e.roles_kept) ok('S6: hook, payoff and CTA kept', e.roles_kept.every((role) => (sc?.downstream?.scenes || []).some((s) => s.beat_role === role)));
        const ce = scriptConsistency(sc, { pacing, config: cfg });
        ok('S6: picked script passes check 13', ce.length === 0, ce.slice(0, 2).join(' | '));
      }
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
