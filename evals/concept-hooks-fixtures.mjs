#!/usr/bin/env node
// Concept + hooks eval fixtures (evals/fixtures/concept-hooks/). Dev tooling only; nothing here ships.
//   node evals/concept-hooks-fixtures.mjs check
//        validate every fixture (clients, briefs, research, built jobs, past job, picks) against the contracts
//   node evals/concept-hooks-fixtures.mjs seed <dir> [--job ID] [--variant NAME]
//        write a files-mode data folder (.tdm-studio layout); --job/--variant apply that job's config overrides
//        (e.g. --job SHL-03 --variant G2-on turns auto-pick on)
// Built the same way as evals/brief-fixtures.mjs so both suites seed comparable data.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FX = path.join(ROOT, 'evals', 'fixtures', 'concept-hooks');
const BRIEF_FX = path.join(ROOT, 'evals', 'fixtures', 'brief');
const C = path.join(ROOT, 'plugins', 'social-media-manager', 'library', 'contracts');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const fx = (n) => read(path.join(FX, `${n}.json`));
const ex = (n) => read(path.join(C, 'examples', `${n}.example.json`));

const ajv = new Ajv2020({ strict: true, allErrors: true });
addFormats(ajv);
ajv.addKeyword({ keyword: 'x-version', schemaType: 'number' });
ajv.addSchema(read(path.join(C, 'insight.schema.json')));
const V = Object.fromEntries(
  ['client', 'job', 'request', 'brief', 'config', 'team', 'research', 'concept', 'hooks'].map((n) => [n, ajv.compile(read(path.join(C, `${n}.schema.json`)))]),
);

const { clock, jobs: SPECS, past: PAST } = fx('jobs');
const T = new Date(clock);
const at = (minutesBefore) => {
  const d = new Date(T.getTime() - minutesBefore * 60000);
  const ist = new Date(d.getTime() + 330 * 60000).toISOString().slice(0, 19);
  return `${ist}+05:30`;
};

export function clients() {
  const fromBrief = read(path.join(BRIEF_FX, 'clients.json')).clients;
  const { from_brief_fixtures: over, clients: extra } = fx('clients');
  const out = [];
  for (const [id, o] of Object.entries(over)) {
    const c = structuredClone(fromBrief.find((x) => x.client_id === id));
    if (!c) throw new Error(`clients.json: ${id} not in ../brief/clients.json`);
    if (o.next_job_number) c.next_job_number = o.next_job_number;
    if (o.learnings_add) c.learnings = [...c.learnings, ...o.learnings_add];
    out.push(c);
  }
  return [...out, ...extra];
}

function briefFor(key, jobId) {
  if (key === 'placeholder') return { placeholder: true, note: 'brief not built yet' };
  const { base, briefs } = fx('briefs');
  const b = briefs[key];
  if (!b) throw new Error(`briefs.json: no brief ${key}`);
  return { ...base, ...b, job_id: jobId };
}

// One scenario job, at the stage the scenario starts from.
export function buildJob(s) {
  const reqEx = ex('request');
  const request = {
    ...reqEx, job_id: s.job_id, client_id: s.client_id, type: 'video', title: s.title, raw_request: s.raw_request,
    requested_by: 'samarth', requested_at: at(180), assignee: s.assignee, deadline: '2026-12-20',
    occasion: null, references: [], assumptions: ['Budget: video default 200.'],
    track: { proposed: s.track, reason: 'Eval fixture.', chosen: s.track },
  };
  const brief = briefFor(s.brief, s.job_id);
  const outputs = {
    request: { version: 1, stage: 'intake', by: 'samarth', schema: 'request.schema.json', summary: s.title, updated_at: at(170), data: request },
  };
  const history = [{ stage: 'intake', status: 'done', started_at: at(180), finished_at: at(170), by: 'samarth' }];
  const gates = [{ stage: 'intake', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { request: 1 }, requested_at: at(175), decided_by: 'samarth', decided_by_role: 'admin', decided_at: at(170) }];
  if (s.research) {
    const r = fx('research').outputs[s.research];
    outputs.research = { version: 1, stage: 'research', by: 'system', schema: 'research.schema.json', summary: r.note, updated_at: at(160), data: r };
    history.push({ stage: 'research', status: 'done', started_at: at(165), finished_at: at(160), by: 'system' });
  } else {
    history.push({ stage: 'research', status: 'skipped', started_at: at(165), finished_at: at(165), by: 'system', note: 'no research for this fixture' });
  }
  outputs.brief = { version: 1, stage: 'brief', by: 'ravi', ...(brief.placeholder ? {} : { schema: 'brief.schema.json' }), summary: brief.placeholder ? 'placeholder' : brief.key_message, updated_at: at(120), data: brief };
  history.push({ stage: 'brief', status: 'done', started_at: at(150), finished_at: at(110), by: s.assignee });
  gates.push({ stage: 'brief', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { brief: 1 }, requested_at: at(120), decided_by: 'samarth', decided_by_role: 'admin', decided_at: at(110) });

  let current = s.at;
  let waiting = 'none';
  let next = `${s.at} stage running.`;
  if (s.at === 'hooks-gate') {
    current = 'hooks';
    const pending = (s.gate_pending_hours ?? 1) * 60;
    outputs.concept = { version: 1, stage: 'concept', by: s.assignee, schema: 'concept.schema.json', summary: '3 concepts, recommended C1', updated_at: at(pending + 30), data: ex('concept') };
    outputs.hooks = { version: 1, stage: 'hooks', by: s.assignee, schema: 'hooks.schema.json', summary: '9 top hooks, recommended C1 + 1C', updated_at: at(pending + 5), data: ex('hooks') };
    history.push({ stage: 'concept', status: 'done', started_at: at(pending + 60), finished_at: at(pending + 30), by: s.assignee });
    history.push({ stage: 'hooks', status: 'in_progress', started_at: at(pending + 30), finished_at: null, by: s.assignee });
    gates.push({ stage: 'hooks', kind: 'stage', owner_role: 'editor', status: 'pending', shown_outputs: { hooks: 1, concept: 1 }, requested_at: at(pending) });
    waiting = 'editor';
    next = 'Ravi to make the creative pick (concept + hook).';
  } else {
    history.push({ stage: s.at, status: 'in_progress', started_at: at(5), finished_at: null, by: s.assignee });
  }
  return {
    request, brief,
    job: {
      job_id: s.job_id, client_id: s.client_id, type: 'video', title: s.title, track: s.track,
      status: 'active', current_stage: current, waiting_on: waiting, next_action: next,
      stage_history: history, gates, assignee: s.assignee, deadline: request.deadline,
      credits: { budget: 200, used: 0, ledger: [] },
      research_status: outputs.research?.data.research_status ?? null,
      insight_id: outputs.research?.data.insight_id ?? null,
      outputs, client_feedback: [], revision_round: 0,
      log: [{ at: at(110), by: 'samarth', kind: 'gate', message: 'brief approved by samarth (admin).' }],
      version: 6, created_at: at(180), updated_at: at(5),
    },
  };
}

// Delivered history: SHL-15 = the SHL-01 job example, renumbered, delivered and client-approved.
export function pastJobs() {
  return PAST.map((p) => {
    const j = JSON.parse(JSON.stringify(ex('job')).replaceAll('SHL-01', p.job_id));
    j.status = p.status;
    j.current_stage = 'delivery';
    j.waiting_on = 'none';
    j.next_action = 'Delivered. Nothing pending.';
    const t = p.client_final_approval_at;
    j.stage_history = j.stage_history.map((h) => (h.status === 'in_progress' ? { ...h, status: 'done', finished_at: t } : h));
    j.stage_history.push({ stage: 'client-final-approval', status: 'done', started_at: t, finished_at: t, by: 'ravi' });
    j.gates = j.gates.map((g) => (g.status === 'pending' ? { ...g, status: 'approved', decided_by: 'ravi', decided_by_role: 'editor', decided_at: t } : g));
    j.gates.push({ stage: 'client-final-approval', kind: 'stage', owner_role: 'client', status: 'approved', shown_outputs: {}, requested_at: t, decided_by: 'ravi', decided_by_role: 'editor', decided_at: t, note: 'Client approved (Neha).' });
    j.updated_at = t;
    return j;
  });
}

function configFor(jobId, variant) {
  const base = ex('config');
  const s = jobId ? SPECS.find((x) => x.job_id === jobId) : null;
  if (jobId && !s) throw new Error(`no fixture job ${jobId}`);
  const v = variant ? s?.config_variants?.[variant] : {};
  if (variant && !v) throw new Error(`job ${jobId} has no variant ${variant}`);
  return { ...base, ...(s?.config ?? {}), ...v };
}

function check() {
  const errs = [];
  const fail = (where, v) => errs.push(`${where}: ${v.errors.map((e) => `${e.instancePath || '/'} ${e.message}`).join('; ')}`);
  const cl = clients();
  cl.forEach((c) => V.client(c) || fail(`client ${c.client_id}`, V.client));
  for (const [k, r] of Object.entries(fx('research').outputs)) V.research(r) || fail(`research.json ${k}`, V.research);
  for (const k of Object.keys(fx('briefs').briefs)) {
    const b = briefFor(k, k);
    V.brief(b) || fail(`briefs.json ${k}`, V.brief);
  }
  const ids = new Set();
  for (const s of SPECS) {
    if (ids.has(s.job_id)) errs.push(`jobs.json: duplicate ${s.job_id}`);
    ids.add(s.job_id);
    const c = cl.find((x) => x.client_id === s.client_id);
    if (!c) errs.push(`jobs.json ${s.job_id}: unknown client`);
    else if (Number(s.job_id.split('-')[1]) >= c.next_job_number) errs.push(`jobs.json ${s.job_id}: number not below ${c.client_id}.next_job_number`);
    const { job, request } = buildJob(s);
    V.request(request) || fail(`${s.job_id} request`, V.request);
    V.job(job) || fail(`${s.job_id} job`, V.job);
    for (const [field, out] of Object.entries(job.outputs)) {
      const v = V[field];
      if (v && !out.data.placeholder && !v(out.data)) fail(`${s.job_id} outputs.${field}`, v);
    }
    for (const variant of [undefined, ...Object.keys(s.config_variants ?? {})]) {
      const cfg = configFor(s.job_id, variant);
      V.config(cfg) || fail(`${s.job_id} config ${variant ?? ''}`, V.config);
    }
  }
  for (const p of pastJobs()) {
    V.job(p) || fail(`past ${p.job_id}`, V.job);
    if (!V.hooks(p.outputs.hooks.data)) fail(`past ${p.job_id} hooks`, V.hooks);
  }
  const hk = ex('hooks');
  const topIds = new Set(Object.values(hk.top_per_concept).flat());
  for (const r of fx('picks').replies) {
    if (!r.expect) errs.push(`picks.json ${r.id}: no expect`);
    for (const id of [r.expect?.pick?.hook_id, ...(r.expect?.pick?.backups ?? [])].filter(Boolean)) {
      if (!topIds.has(id)) errs.push(`picks.json ${r.id}: hook ${id} is not a top hook in hooks.example.json`);
    }
  }
  if (errs.length) {
    console.error(`✘ ${errs.length} fixture problem(s):\n  - ${errs.join('\n  - ')}`);
    process.exit(1);
  }
  console.log(`✔ concept-hooks fixtures valid: ${cl.length} clients, ${SPECS.length} scenario jobs, ${PAST.length} past job(s), ${Object.keys(fx('research').outputs).length} research output(s), ${Object.keys(fx('briefs').briefs).length} briefs, ${fx('picks').replies.length} pick replies`);
}

function seed(dir, jobId, variant) {
  const cl = clients();
  const jobs = [...pastJobs(), ...SPECS.map((s) => buildJob(s).job)];
  const config = configFor(jobId, variant);
  const team = [
    { handle: 'samarth', name: 'Samarth', role: 'admin', email: 'admin@example.com', active: true, added_at: '2026-11-10T09:00:00+05:30', version: 1, updated_at: '2026-11-10T09:00:00+05:30' },
    ex('team'),
    { handle: 'pooja', name: 'Pooja', role: 'designer', email: 'pooja@example.com', active: true, added_at: '2026-11-10T09:00:00+05:30', version: 1, updated_at: '2026-11-10T09:00:00+05:30' },
  ];
  const w = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); };
  w(path.join(dir, 'config.json'), { ...config, storage_mode: 'files', data_folder: dir });
  w(path.join(dir, 'team.json'), team);
  w(path.join(dir, 'clients', 'index.json'), cl.map(({ client_id, client_code, name, status, business_type, city, updated_at }) => ({ client_id, client_code, name, status, business_type, city, updated_at })));
  for (const c of cl) w(path.join(dir, 'clients', c.client_id, 'client.json'), c);
  w(path.join(dir, 'jobs', 'index.json'), jobs.map(({ job_id, client_id, title, type, status, current_stage, waiting_on, assignee, deadline, updated_at }) => ({ job_id, client_id, title, type, status, current_stage, waiting_on, assignee, deadline, updated_at })));
  for (const j of jobs) {
    w(path.join(dir, 'jobs', j.job_id, 'job.json'), j);
    w(path.join(dir, 'jobs', j.job_id, 'log-full.json'), j.log);
  }
  console.log(`Seeded ${dir}: ${cl.length} clients, ${jobs.length} jobs${jobId ? `, config from ${jobId}${variant ? ` (${variant})` : ''}` : ''}. Eval clock ${clock}.`);
}

const [cmd, arg, ...rest] = process.argv.slice(2);
const flag = (n) => (rest.includes(n) ? rest[rest.indexOf(n) + 1] : null);
if (cmd === 'check') check();
else if (cmd === 'seed' && arg) seed(path.resolve(arg), flag('--job'), flag('--variant'));
else {
  console.error('usage: node evals/concept-hooks-fixtures.mjs check | seed <dir> [--job ID] [--variant NAME]');
  process.exit(2);
}
