#!/usr/bin/env node
// Builds a files-mode TDM Studio data folder (library/storage/files-backup.md layout) for one research scenario.
// Usage: node evals/fixtures/research/make-data.mjs <scenario> <out-dir>
// Scenarios: new | intake | monthly | tracker. Every record is built from the contract examples and validated.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { sampleRecords } from '../../../scripts/build-sample-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const C = path.join(ROOT, 'plugins/social-media-manager/library/contracts');
const ex = (n) => JSON.parse(fs.readFileSync(path.join(C, 'examples', `${n}.example.json`), 'utf8'));
const clone = (o) => JSON.parse(JSON.stringify(o));
const T = (d, hm = '10:00:00') => `${d}T${hm}+05:30`;

const [scenario, outDir] = process.argv.slice(2);
if (!scenario || !outDir) { console.error('usage: make-data.mjs <new|intake|monthly|tracker> <out-dir>'); process.exit(2); }

// ── base records ──
const config = { ...ex('config'), storage_mode: 'files', spreadsheet_id: null, drive_folder_id: null, data_folder: '.tdm-studio' };
const team = sampleRecords.team;
const shl0 = clone(sampleRecords.clients[0]);
const nrh0 = clone(sampleRecords.clients[1]);

function insightFrom(base, id, created, { pending = false, task = null, trigger = 'intake' } = {}) {
  const i = clone(base);
  i.insight_id = id; i.created_at = T(created, '11:00:00'); i.updated_at = i.created_at; i.version = 1; i.trigger = trigger;
  i.pending_browser_step = pending ? { pending: true, methods: ['ig-outlier-read', 'ig-hook-classify'], task_id: task, estimate_minutes: 10 } : { pending: false };
  i.raw_files = [`.tdm-studio/clients/${i.client_id}/insights/${id}/raw/`];
  return i;
}
function job(id, client, { type = 'video', track = 'quick', urgent = false, title }) {
  const j = clone(ex('job'));
  const req = clone(j.outputs.request);
  Object.assign(j, { job_id: id, client_id: client.client_id, type, track, title, urgent, status: 'active', current_stage: 'intake', waiting_on: 'none',
    next_action: "Say 'next' to run research.", assignee: 'ravi', deadline: '2026-12-10', research_status: null, insight_id: null,
    credits: { budget: type === 'video' ? 200 : 28, warn_at: type === 'video' ? null : 20, used: 0, ledger: [] }, client_feedback: [], revision_round: 0, version: 3,
    created_at: T('2026-11-28', '09:00:00'), updated_at: T('2026-11-28', '09:20:00') });
  req.data = { ...req.data, job_id: id, client_id: client.client_id, type, title, raw_request: `${title} chahiye.`, deliverables: [type === 'video' ? 'Instagram reel 9:16 ~20s' : 'Instagram poster 4:5'],
    track: { proposed: track, reason: 'Fixture.', chosen: track }, budget: { credits: j.credits.budget, warn_at: j.credits.warn_at }, occasion: null, requested_at: T('2026-11-28', '09:00:00') };
  req.updated_at = T('2026-11-28', '09:15:00');
  j.outputs = { request: req };
  j.stage_history = [{ stage: 'intake', status: 'done', started_at: T('2026-11-28', '09:00:00'), finished_at: T('2026-11-28', '09:20:00'), by: 'samarth' }];
  j.gates = [{ stage: 'intake', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { request: 1 }, requested_at: T('2026-11-28', '09:15:00'), decided_by: 'samarth', decided_by_role: 'admin', decided_at: T('2026-11-28', '09:20:00'), sent_back_to: null }];
  j.log = [{ at: T('2026-11-28', '09:20:00'), by: 'samarth', kind: 'gate', message: 'intake approved by samarth (admin).' }];
  return j;
}

// ── scenarios ──
let clients = [], insights = [], tasks = [], jobs = [];
const shlInsightBase = ex('insight');
const nrhInsightBase = sampleRecords.insights[1];

if (scenario === 'new') {
  // R1 onboarding, R7 discovery, R16 fallback: a just-onboarded client with 2 usable competitors and 1 struck one.
  const shl = clone(shl0);
  shl.latest_insight_id = null;
  shl.competitors = [
    { handle: 'ex_vijaynagar_drycleaners', platform: 'instagram', group: 'direct', reason: 'Same area, same saree dry-clean offer', confidence: 'confirmed', struck: false, added_on: '2026-11-27' },
    { handle: 'ex_indore_home_services', platform: 'instagram', group: 'adjacent', reason: 'Home cleaning for the same households', confidence: 'guessed', struck: false, added_on: '2026-11-27' },
    { handle: 'ex_bhopal_laundromat', platform: 'instagram', group: 'direct', reason: 'Proposed earlier', confidence: 'guessed', struck: true, struck_by: 'ravi', added_on: '2026-11-27' },
  ];
  shl.meta = { linked: false, ad_account_id: null, ig_account_id: null, page_id: null };
  clients = [shl];
} else if (scenario === 'intake') {
  // R2 fresh reuse, R5 partial (browser step pending), R6 urgent skip.
  const shl = clone(shl0); shl.latest_insight_id = 'SHL-I202611-1';
  const nrh = clone(nrh0); nrh.latest_insight_id = 'NRH-I202611-1';
  clients = [shl, nrh];
  insights = [insightFrom(shlInsightBase, 'SHL-I202611-1', '2026-11-23'), insightFrom(nrhInsightBase, 'NRH-I202611-1', '2026-11-18', { pending: true, task: 'T-20261118-1' })];
  tasks = [{ ...clone(ex('task')), task_id: 'T-20261118-1', insight_id: 'NRH-I202611-1', trigger: 'intake', created_at: T('2026-11-18', '11:00:00'), updated_at: T('2026-11-18', '11:00:00') }];
  jobs = [job('SHL-05', shl, { title: 'Wedding saree care reel' }), job('NRH-02', nrh, { track: 'full', title: 'Year-end site visit reel' }), job('SHL-06', shl, { type: 'poster', urgent: true, title: 'Same-day pickup poster' })];
} else if (scenario === 'monthly') {
  // R3 scheduled refresh across 2 clients, R9 own-account audit (NRH linked), festival check (SHL occasion in 10 days).
  const shl = clone(shl0); shl.latest_insight_id = 'SHL-I202610-1';
  shl.festival_calendar = [...(shl.festival_calendar || []), { occasion: 'Wedding season peak (Dev Uthani onward)', date: '2026-12-08', priority: 'high' }];
  const nrh = clone(nrh0); nrh.latest_insight_id = 'NRH-I202610-1';
  clients = [shl, nrh];
  insights = [insightFrom(shlInsightBase, 'SHL-I202610-1', '2026-10-24', { trigger: 'schedule' }), insightFrom(nrhInsightBase, 'NRH-I202610-1', '2026-10-23', { trigger: 'schedule' })];
} else if (scenario === 'tracker') {
  // R10 festival queued at session start, R4 pending browser step shown and run on one yes.
  const shl = clone(shl0); shl.latest_insight_id = 'SHL-I202611-1';
  shl.festival_calendar = [...(shl.festival_calendar || []), { occasion: 'Wedding season peak (Dev Uthani onward)', date: '2026-12-08', priority: 'high' }];
  const nrh = clone(nrh0); nrh.latest_insight_id = 'NRH-I202611-1';
  clients = [shl, nrh];
  insights = [insightFrom(shlInsightBase, 'SHL-I202611-1', '2026-11-23'), insightFrom(nrhInsightBase, 'NRH-I202611-1', '2026-11-18', { pending: true, task: 'T-20261118-1' })];
  tasks = [{ ...clone(ex('task')), task_id: 'T-20261118-1', insight_id: 'NRH-I202611-1', trigger: 'intake', created_at: T('2026-11-18', '11:00:00'), updated_at: T('2026-11-18', '11:00:00') }];
} else {
  console.error(`unknown scenario ${scenario}`); process.exit(2);
}

// ── validate everything before writing ──
const ajv = new Ajv2020({ strict: true, allErrors: true }); addFormats(ajv);
for (const f of fs.readdirSync(C).filter((x) => x.endsWith('.schema.json'))) ajv.addSchema(JSON.parse(fs.readFileSync(path.join(C, f), 'utf8')));
const v = (name, rec) => { const fn = ajv.getSchema(`urn:tdm:social-media-manager:contracts:${name}`); if (!fn(rec)) throw new Error(`${name} invalid: ${JSON.stringify(fn.errors.slice(0, 3))}`); };
v('config', config); team.forEach((t) => v('team', t)); clients.forEach((c) => v('client', c)); insights.forEach((i) => v('insight', i)); tasks.forEach((t) => v('task', t)); jobs.forEach((j) => v('job', j));

// ── write the files-mode layout ──
const D = path.resolve(outDir, '.tdm-studio');
fs.rmSync(D, { recursive: true, force: true });
const w = (rel, obj) => { const p = path.join(D, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n'); };
w('config.json', config);
w('team.json', team);
w('tasks.json', tasks);
w('clients/index.json', clients.map(({ client_id, client_code, name, status, business_type, city, updated_at }) => ({ client_id, client_code, name, status, business_type, city, updated_at })));
for (const c of clients) {
  w(`clients/${c.client_id}/client.json`, c);
  const mine = insights.filter((i) => i.client_id === c.client_id).sort((a, b) => b.created_at.localeCompare(a.created_at));
  w(`clients/${c.client_id}/insights/index.json`, mine.map((i) => ({ insight_id: i.insight_id, created_at: i.created_at, mode: i.mode, version: i.version, pending_browser_step: i.pending_browser_step })));
  for (const i of mine) w(`clients/${c.client_id}/insights/${i.insight_id}/insight.json`, i);
}
w('jobs/index.json', jobs.map(({ job_id, client_id, title, type, status, current_stage, waiting_on, assignee, deadline, updated_at }) => ({ job_id, client_id, title, type, status, current_stage, waiting_on, assignee, deadline, updated_at })));
for (const j of jobs) { w(`jobs/${j.job_id}/job.json`, j); w(`jobs/${j.job_id}/log-full.json`, j.log); }
console.log(`${scenario}: ${clients.length} clients, ${insights.length} insights, ${tasks.length} tasks, ${jobs.length} jobs → ${path.relative(process.cwd(), D)}`);
