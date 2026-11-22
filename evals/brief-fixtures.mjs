#!/usr/bin/env node
// Brief eval fixtures (evals/fixtures/brief/). Dev tooling only; nothing here ships.
//   node evals/brief-fixtures.mjs check                     validate every fixture against the contracts
//   node evals/brief-fixtures.mjs seed <dir> [--job ID]     write a files-mode data folder (.tdm-studio layout) for the scenarios;
//                                                           --job applies that job's config overrides (e.g. B12 auto-approve)
//   node evals/brief-fixtures.mjs sheet-rows <out.json> [--job ID]
//                                                           rows for loading TDM Studio TEST Database (B14), via sheet-codec
// Fixture records are built the same way in every mode, so the files and sheet backends start from identical data.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FX = path.join(ROOT, 'evals', 'fixtures', 'brief');
const C = path.join(ROOT, 'plugins', 'social-media-manager', 'library', 'contracts');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const fx = (n) => read(path.join(FX, `${n}.json`));

const ajv = new Ajv2020({ strict: true, allErrors: true });
addFormats(ajv);
ajv.addKeyword({ keyword: 'x-version', schemaType: 'number' });
const V = Object.fromEntries(['client', 'job', 'request', 'brief', 'config', 'team'].map((n) => [n, ajv.compile(read(path.join(C, `${n}.schema.json`)))]));

const T0 = '2026-12-08';
const ts = (h) => `${T0}T${h}:00+05:30`;

// Build one scenario job record at the brief stage (intake approved).
export function buildJob(j, defaults) {
  const request = { job_id: j.job_id, client_id: j.client_id, type: j.type, ...defaults, ...j.request, assignee: j.assignee };
  const research = j.research ? fx('research').outputs[j.research] : null;
  const outputs = {
    request: { version: 1, stage: 'intake', by: 'samarth', schema: 'request.schema.json', summary: request.title, updated_at: ts('10:00'), data: request },
  };
  if (research) outputs.research = { version: 1, stage: 'research', by: 'system', schema: 'research.schema.json', summary: research.note, updated_at: ts('10:05'), data: research };
  return {
    job: {
      job_id: j.job_id, client_id: j.client_id, type: j.type, title: request.title, track: j.track,
      status: 'active', current_stage: 'brief', waiting_on: 'none', next_action: 'brief stage running.',
      stage_history: [
        { stage: 'intake', status: 'done', started_at: ts('09:50'), finished_at: ts('10:00'), by: 'samarth' },
        { stage: 'brief', status: 'in_progress', started_at: ts('10:10'), finished_at: null, by: j.assignee },
      ],
      gates: [{ stage: 'intake', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { request: 1 }, requested_at: ts('09:55'), decided_by: 'samarth', decided_by_role: 'admin', decided_at: ts('10:00') }],
      assignee: j.assignee, deadline: request.deadline ?? null,
      credits: { budget: 200, used: 0, ledger: [] },
      outputs, client_feedback: [], revision_round: 0,
      log: [{ at: ts('10:00'), by: 'samarth', kind: 'gate', message: 'intake approved; brief next.' }],
      version: 3, created_at: ts('09:50'), updated_at: ts('10:10'),
    },
    request,
  };
}

function allRecords(jobId) {
  const { defaults, jobs } = fx('jobs');
  const clients = fx('clients').clients;
  const past = fx('past-jobs').jobs;
  const built = jobs.map((j) => buildJob(j, defaults).job);
  const cfgBase = read(path.join(C, 'examples', 'config.example.json'));
  const pick = jobId ? jobs.find((j) => j.job_id === jobId) : null;
  if (jobId && !pick) throw new Error(`no fixture job ${jobId}`);
  const config = { ...cfgBase, ...(pick?.config ?? {}) };
  const team = [
    { handle: 'samarth', name: 'Samarth', role: 'admin', email: 'admin@example.com', active: true, added_at: '2026-11-10T09:00:00+05:30', version: 1, updated_at: '2026-11-10T09:00:00+05:30' },
    read(path.join(C, 'examples', 'team.example.json')),
  ];
  return { clients, jobs: [...past, ...built], config, team };
}

function check() {
  const errs = [];
  const fail = (where, v) => errs.push(`${where}: ${v.errors.map((e) => `${e.instancePath || '/'} ${e.message}`).join('; ')}`);
  const { clients } = fx('clients');
  clients.forEach((c) => V.client(c) || fail(`clients.json ${c.client_id}`, V.client));
  const { defaults, jobs } = fx('jobs');
  const ids = new Set();
  for (const j of jobs) {
    if (ids.has(j.job_id)) errs.push(`jobs.json: duplicate ${j.job_id}`);
    ids.add(j.job_id);
    const cl = clients.find((c) => c.client_id === j.client_id);
    if (!cl) errs.push(`jobs.json ${j.job_id}: unknown client`);
    else if (Number(j.job_id.split('-')[1]) >= cl.next_job_number) errs.push(`jobs.json ${j.job_id}: number not below ${cl.client_id}.next_job_number`);
    const { job, request } = buildJob(j, defaults);
    V.request(request) || fail(`jobs.json ${j.job_id} request`, V.request);
    V.job(job) || fail(`jobs.json ${j.job_id} job`, V.job);
    if (j.research && !fx('research').outputs[j.research]) errs.push(`jobs.json ${j.job_id}: research "${j.research}" not in research.json`);
    const cfg = { ...read(path.join(C, 'examples', 'config.example.json')), ...j.config };
    V.config(cfg) || fail(`jobs.json ${j.job_id} config`, V.config);
  }
  for (const p of fx('past-jobs').jobs) {
    V.job(p) || fail(`past-jobs.json ${p.job_id}`, V.job);
    V.brief(p.outputs.brief.data) || fail(`past-jobs.json ${p.job_id} brief`, V.brief);
  }
  const bad = fx('bad-brief').brief;
  V.brief(bad) || fail('bad-brief.json (must be schema-valid; it is meant to fail the self-check, not the schema)', V.brief);
  for (const [k, r] of Object.entries(fx('research').outputs)) {
    for (const key of ['research_status', 'insight_id', 'flags', 'downstream']) if (!(key in r)) errs.push(`research.json ${k}: missing ${key}`);
    for (const sec of ['brief', 'concept_and_hooks', 'script', 'localise', 'visuals']) if (!(sec in (r.downstream ?? {}))) errs.push(`research.json ${k}: downstream.${sec} missing`);
  }
  for (const r of fx('replies').replies) {
    if (!ids.has(r.job_id)) errs.push(`replies.json ${r.id}: unknown job ${r.job_id}`);
    if (!r.expect) errs.push(`replies.json ${r.id}: no expect`);
    if (/\+?\d{10,}/.test(r.text)) errs.push(`replies.json ${r.id}: looks like a phone number`);
  }
  if (errs.length) {
    console.error(`✘ ${errs.length} fixture problem(s):\n  - ${errs.join('\n  - ')}`);
    process.exit(1);
  }
  console.log(`✔ brief fixtures valid: ${clients.length} clients, ${jobs.length} scenario jobs, ${fx('past-jobs').jobs.length} past jobs, ${Object.keys(fx('research').outputs).length} research output(s), ${fx('replies').replies.length} replies, 1 bad brief`);
}

function seed(dir, jobId) {
  const { clients, jobs, config, team } = allRecords(jobId);
  const w = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); };
  w(path.join(dir, 'config.json'), { ...config, storage_mode: 'files', data_folder: dir });
  w(path.join(dir, 'team.json'), team);
  w(path.join(dir, 'clients', 'index.json'), clients.map(({ client_id, client_code, name, status, business_type, city, updated_at }) => ({ client_id, client_code, name, status, business_type, city, updated_at })));
  for (const c of clients) w(path.join(dir, 'clients', c.client_id, 'client.json'), c);
  w(path.join(dir, 'jobs', 'index.json'), jobs.map(({ job_id, client_id, title, type, status, current_stage, waiting_on, assignee, deadline, updated_at }) => ({ job_id, client_id, title, type, status, current_stage, waiting_on, assignee, deadline, updated_at })));
  for (const j of jobs) {
    w(path.join(dir, 'jobs', j.job_id, 'job.json'), j);
    w(path.join(dir, 'jobs', j.job_id, 'log-full.json'), j.log);
  }
  console.log(`Seeded ${dir}: ${clients.length} clients, ${jobs.length} jobs${jobId ? `, config overrides from ${jobId}` : ''}. The .md views are regenerated by the skills on their first save.`);
}

async function sheetRows(out, jobId) {
  const { encodeRecord, headerRows } = await import('../scripts/lib/sheet-codec.mjs');
  const { clients, jobs, config, team } = allRecords(jobId);
  const tabs = headerRows();
  const add = (rec, d) => { for (const [t, rows] of Object.entries(encodeRecord(rec, d))) tabs[t] = tabs[t].concat(rows); };
  clients.forEach((c) => add('client', c));
  jobs.forEach((j) => add('job', j));
  team.forEach((m) => add('team', m));
  add('config', config);
  fs.writeFileSync(out, JSON.stringify({ $comment: 'Rows to write into TDM Studio TEST Database (layout v3) for B14: clear rows 2+ of every data tab, then write each tab\'s rows after its header. Cells are encoded as google-sheets.md §2 says.', tabs }, null, 1) + '\n');
  console.log(`Wrote ${out}`);
}

const [cmd, arg, ...rest] = process.argv.slice(2);
const jobFlag = rest.includes('--job') ? rest[rest.indexOf('--job') + 1] : null;
if (cmd === 'check') check();
else if (cmd === 'seed' && arg) seed(path.resolve(arg), jobFlag);
else if (cmd === 'sheet-rows' && arg) await sheetRows(path.resolve(arg), jobFlag);
else {
  console.error('usage: node evals/brief-fixtures.mjs check | seed <dir> [--job ID] | sheet-rows <out.json> [--job ID]');
  process.exit(2);
}
