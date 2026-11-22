#!/usr/bin/env node
// Live S3 + B14 run on TDM Studio TEST Database (layout v3), headless, Sonnet.
// One quick video job end to end: urgent intake → research skipped → brief asks → client message (awaiting-client,
// BriefQuestions mirror, no gate) → new-session catch-up → client reply → brief gate → placeholders → delivery.
// Usage: node evals/brief/run-live.mjs [--from N] [--as <person>]   Transcript: evals/results/brief-runs.local/live/transcript[-fromN].json
// --from N starts at step N in a fresh session (the job state is in the sheet). Stops after two replies in a row that record nothing.
// Needs the Claude Code CLI with the Google Sheets and Google Drive connectors signed in. Writes only to the TEST sheet.

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLUGIN = path.join(ROOT, 'plugins', 'social-media-manager');
const OUT = path.join(ROOT, 'evals', 'results', 'brief-runs.local', 'live');
fs.mkdirSync(OUT, { recursive: true });
const ALLOW = ['Read', 'Glob', 'Grep', 'Skill', 'Bash(date:*)',
  'mcp__claude_ai_Google_Sheets__get_values', 'mcp__claude_ai_Google_Sheets__update_values', 'mcp__claude_ai_Google_Sheets__update_formulas', 'mcp__claude_ai_Google_Sheets__append_values', 'mcp__claude_ai_Google_Sheets__get_spreadsheet',
  'mcp__claude_ai_Google_Drive__search_files', 'mcp__claude_ai_Google_Drive__create_file'];
const DENY = ['AskUserQuestion', 'WebSearch', 'WebFetch', 'Agent', 'Task', 'Write', 'Edit', 'mcp__claude_ai_Meta_Ads', 'mcp__claude-in-chrome'];
const PRE = 'Use the social-media-manager plugin. Use the TDM Studio TEST Database (Google Sheets) only. There is no tappable-question tool: ask in text.';

function claude(prompt, sid) {
  const args = ['-p', prompt, '--plugin-dir', PLUGIN, '--model', 'sonnet', '--max-turns', '90', '--output-format', 'json',
    '--allowedTools', ...ALLOW, '--disallowedTools', ...DENY, ...(sid ? ['--resume', sid] : [])];
  return new Promise((resolve) => {
    const c = spawn('claude', args, { cwd: OUT, stdio: ['ignore', 'pipe', 'pipe'] });
    let o = '';
    c.stdout.on('data', (d) => (o += d));
    c.on('close', () => { try { resolve(JSON.parse(o)); } catch { resolve({ is_error: true, result: o.slice(0, 800) }); } });
  });
}

const STEPS = [
  { p: `${PRE} I'm Samarth (admin). New job for Shubh Laundry: winter kambal-razai dhulai offer reel, Instagram reel ~20 sec, deadline 30 Nov. Urgent hai, aaj hi brief chahiye.` },
  { p: 'approve, quick track, urgent', answer: [[/rate|price|kitn|₹|kab tak|validity|date/i, 'client se poochna padega']] },
  { p: `${PRE} I'm Ravi (editor). continue the winter kambal offer job`, newSession: true, label: 'catch-up (new session)' },
  { p: "Neha ji ka reply: haan ji 299 rakh do per piece, aur mahine ke end tak chalne do", answer: [[/\?/, 'aap dekh lo']] },
  { p: "I'm Samarth now. approve" },
  { p: 'approve' },
  { p: "I'm Ravi now. approve" },
  { p: 'client approved: "script theek hai, aage badho"' },
  { p: 'approve' },
  { p: 'approve' },
  { p: 'approve' },
  { p: 'approve' },
  { p: 'approve' },
  { p: "I'm Samarth now. approve" },
  { p: 'client approved: "perfect hai, post kar do"' },
  { p: 'approve' },
];

const asks = (t) => /\?\s*$|\?\s*\n|Guess:|guess:/m.test(t || '') && !/waiting for client reply|Neha ji ko bhej|bhej dijiye|send it to/i.test(t || '');
const argv = process.argv.slice(2);
const FROM = argv.includes('--from') ? Number(argv[argv.indexOf('--from') + 1]) : 0;
const AS = argv.includes('--as') ? argv[argv.indexOf('--as') + 1] : 'Ravi (editor)';
const TX = path.join(OUT, FROM ? `transcript-from${FROM}.json` : 'transcript.json');
const turns = [];
let sid = null;
let cost = 0;
let idle = 0;
for (const [i, s] of STEPS.entries()) {
  if (i < FROM) continue;
  if (s.newSession) sid = null;
  let prompt = i === FROM && FROM > 0 && !s.newSession ? `${PRE} I'm ${AS}. ${s.p}` : s.p;
  for (let k = 0; k < 4; k++) {
    const r = await claude(prompt, sid);
    sid = r.session_id || sid;
    cost += r.total_cost_usd || 0;
    turns.push({ step: s.label || s.p.slice(0, 60), user: prompt, assistant: r.result, error: r.is_error || false });
    console.log(`— ${prompt.slice(0, 70)}\n${(r.result || '').slice(0, 400)}\n`);
    idle = /nothing (was )?(recorded|to approve)|haven't recorded|not recorded|can't record/i.test(r.result || '') ? idle + 1 : 0;
    if (r.is_error || !s.answer || !asks(r.result)) break;
    const hit = s.answer.find(([re]) => re.test(r.result));
    prompt = hit ? hit[1] : 'aap dekh lo';
  }
  fs.writeFileSync(TX, JSON.stringify({ from: FROM, cost, turns }, null, 1));
  if (idle >= 2) { console.log('stopping: two replies in a row recorded nothing'); break; }
}
console.log(`done: ${turns.length} turns, $${cost.toFixed(2)}`);
