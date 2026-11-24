#!/usr/bin/env node
// Script + localise eval fixtures (evals/fixtures/script-localise/). Dev tooling only; nothing here ships.
//   node evals/script-localise-fixtures.mjs check
//        validate every fixture (clients, briefs, research, hooks picks, scripts, localised scripts, jobs,
//        configs, replies) against the contracts and scripts/lib/script-checks.mjs (validator check 13)
//   node evals/script-localise-fixtures.mjs seed <dir> [--job ID]
//        write a files-mode data folder (.tdm-studio layout); --job applies that job's config overrides
// Reuses the concept-hooks fixtures (clients, briefs, research) so the suites stay comparable.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { scriptConsistency, localisedConsistency, loadPacing } from '../scripts/lib/script-checks.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FX = path.join(ROOT, 'evals', 'fixtures', 'script-localise');
const CH = path.join(ROOT, 'evals', 'fixtures', 'concept-hooks');
const BRIEF_FX = path.join(ROOT, 'evals', 'fixtures', 'brief');
const C = path.join(ROOT, 'plugins', 'social-media-manager', 'library', 'contracts');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const fx = (n) => read(path.join(FX, `${n}.json`));
const ch = (n) => read(path.join(CH, `${n}.json`));
const ex = (n) => read(path.join(C, 'examples', `${n}.example.json`));
const renamed = (obj, from, to) => JSON.parse(JSON.stringify(obj).replaceAll(from, to));
// The SHL-01 contract examples run an offer till 25 Nov; the eval clock is 12 Dec, so example-based jobs move the
// offer to 25 Dec (otherwise the skills rightly stop on an expired offer).
const shift = (obj) => JSON.parse(JSON.stringify(obj).replaceAll('2026-11-25', '2026-12-25').replaceAll('25 Nov', '25 Dec').replaceAll('pachchees November', 'pachchees December'));

const ajv = new Ajv2020({ strict: true, allErrors: true });
addFormats(ajv);
ajv.addKeyword({ keyword: 'x-version', schemaType: 'number' });
ajv.addSchema(read(path.join(C, 'insight.schema.json')));
const V = Object.fromEntries(
  ['client', 'job', 'request', 'brief', 'config', 'research', 'hooks', 'script', 'localised_script'].map((n) => [n, ajv.compile(read(path.join(C, `${n}.schema.json`)))]),
);

const { clock, jobs: SPECS } = fx('jobs');
const T = new Date(clock);
const at = (minutesBefore) => {
  const d = new Date(T.getTime() - minutesBefore * 60000);
  return `${new Date(d.getTime() + 330 * 60000).toISOString().slice(0, 19)}+05:30`;
};
const roleOf = (handle) => ({ ravi: 'editor', pooja: 'designer', samarth: 'admin' }[handle] || 'editor');

// ── clients: brief fixtures → concept-hooks overrides → ours ───────────
export function clients() {
  const fromBrief = read(path.join(BRIEF_FX, 'clients.json')).clients;
  const { from_brief_fixtures: chOver, clients: chExtra } = ch('clients');
  const list = [];
  for (const [id, o] of Object.entries(chOver)) {
    const c = structuredClone(fromBrief.find((x) => x.client_id === id));
    if (o.next_job_number) c.next_job_number = o.next_job_number;
    if (o.learnings_add) c.learnings = [...c.learnings, ...o.learnings_add];
    list.push(c);
  }
  list.push(...structuredClone(chExtra));
  for (const [id, o] of Object.entries(fx('clients').overrides)) {
    const c = list.find((x) => x.client_id === id);
    if (!c) throw new Error(`clients.json: ${id} unknown`);
    Object.assign(c, o);
  }
  return list;
}

function briefFor(s) {
  let b;
  if (s.brief === 'example') b = { ...shift(ex('brief')), posting_date: '2026-12-18' };
  else {
    const { base, briefs } = ch('briefs');
    if (!briefs[s.brief]) throw new Error(`no brief ${s.brief}`);
    b = { ...base, ...briefs[s.brief] };
  }
  return { ...renamed(b, b.job_id || '@@', s.job_id), ...(s.brief_overrides || {}), job_id: s.job_id, client_id: s.client_id };
}

// ── hooks (creative pick) ──────────────────────────────────────────────
function pickSpec(key) {
  const all = fx('picks').picks;
  const p = all[key];
  if (!p) throw new Error(`picks.json: no ${key}`);
  if (!p.base) return structuredClone(p);
  const b = pickSpec(p.base);
  if (p.backups) b.backups = p.backups;
  if (p.concept_levers) b.concept.levers = p.concept_levers;
  if (p.concept_spine) b.concept.story_spine = p.concept_spine;
  if (p.script_notes_do_add) b.script_notes.do = [...b.script_notes.do, ...p.script_notes_do_add];
  return b;
}
function hooksRecord(s, research) {
  if (s.hooks === 'example') return shift(renamed(ex('job').outputs.hooks.data, 'SHL-01', s.job_id));
  const p = pickSpec(s.hooks);
  const hookObj = (h) => ({
    id: h.id, concept_ref: p.concept_key, formula_id: h.formula_id, layers: h.layers, language: p.language,
    tags: [], source_refs: [],
    scores: { clarity: 4, curiosity: 4, relevance: 4, specificity: 4, india_fit: 4, payoff: 4, brand_safety: 5, weighted: 45 },
    boost_note: null, critique_note: null, rewritten_from: null, status: 'top',
  });
  const ref = (h) => ({ id: h.id, formula_id: h.formula_id, layers: h.layers });
  return {
    job_id: s.job_id, client_id: s.client_id, version: 2, track_mode: 'full', concept_version: 1, reused_format: null,
    fallback_used: { brief: false, research: !research },
    hooks: [p.hook, ...p.backups].map(hookObj),
    top_per_concept: { [p.concept_key]: [p.hook.id, ...p.backups.map((h) => h.id)] },
    recommended: { concept_ref: p.concept_key, hook_id: p.hook.id, reason: 'Fixture pick.' },
    pick: { status: 'picked', concept_ref: p.concept_key, hook_id: p.hook.id, backups: p.backups.map((h) => h.id), mix_note: null,
      reply: p.hook.id, decided_by: s.assignee, decided_by_role: roleOf(s.assignee), decided_at: at(90), auto: false },
    downstream: {
      concept: p.concept, hook: ref(p.hook), backup_hooks: p.backups.map(ref), script_notes: p.script_notes,
      implied_assets: p.implied_assets, language: p.language, writing_script: p.writing_script,
      learning: { ...p.learning, outcome: 'untested', evidence: null },
    },
    assumptions: [],
    self_check: { passed: true, items: Array.from({ length: 10 }, (_, i) => ({ id: `HC${i + 1}`, ok: true })) },
    updated_at: at(90),
  };
}

// ── scripts ────────────────────────────────────────────────────────────
function sceneFromRow(r) {
  const [n, start, end, role, shot, subject, action, camera, setting, cards, vo, asset, real, device, sfx, music, refs] = r;
  return {
    n, start_sec: start, end_sec: end, beat_role: role,
    visual_action: { shot, subject, action, camera, setting },
    on_screen_text: cards.map(([text, i, o, position]) => ({ text, in_sec: i, out_sec: o, position })),
    vo_line: vo, sfx, music_cue: music, asset_hint: asset, must_be_real: real, retention_device: device, fact_refs: refs || [],
  };
}
function scriptRecord(s, hooks, research) {
  if (s.script === 'example') return shift(renamed(ex('script'), 'SHL-01', s.job_id));
  if (s.script === 'example-pending') {
    const r = shift(renamed(ex('script'), 'SHL-01', s.job_id));
    r.version = 1;
    r.pick = { status: 'pending', version_id: null, edits: [], reply: null, decided_by: null, decided_by_role: null, decided_at: null };
    r.downstream = null;
    r.updated_at = at(30);
    return r;
  }
  const sp = fx('scripts').scripts[s.script];
  if (!sp) throw new Error(`scripts.json: no ${s.script}`);
  const scenes = sp.scenes.map(sceneFromRow);
  const payoff = scenes.find((x) => x.beat_role === 'payoff')?.n ?? scenes.length;
  const version = {
    id: 'A', title: sp.title, structure_type: sp.structure_type, duration_sec: sp.duration_sec, platform: sp.platform,
    hook_used: { ...sp.hook, backup_reason: null }, scenes, caption: sp.caption, cta: sp.cta,
    checks: { timing_ok: true, timing_notes: [], facts_ok: true, fact_flags: [], payoff_scene: payoff, critique_notes: [], humanizer_done: true, humanizer_notes: [], ethics_ok: true, ethics_notes: [] },
    variant_notes: sp.variant_notes || [],
  };
  return {
    job_id: s.job_id, client_id: s.client_id, version: 2, language: sp.language,
    writing_script: sp.language === 'English' ? 'english' : 'roman-hinglish',
    inputs: { brief_version: 1, hooks_version: 2, concept_version: s.track === 'full' ? 1 : null, research_insight_id: research?.insight_id ?? null, style_preset: null },
    fallback_used: { brief: false, research: !research },
    versions: [version],
    recommended: { version_id: 'A', reason: 'Fixture: the picked version.' },
    pick: { status: 'picked', version_id: 'A', edits: [], reply: 'A', decided_by: s.assignee, decided_by_role: roleOf(s.assignee), decided_at: at(45) },
    downstream: {
      version_id: 'A', structure_type: sp.structure_type, duration_sec: sp.duration_sec, language: sp.language, platform: sp.platform,
      scenes,
      shot_list_seed: scenes.map((x) => ({ n: x.n, visual_action: x.visual_action, asset_hint: x.asset_hint, must_be_real: x.must_be_real })),
      audio_cues: scenes.map((x) => ({ n: x.n, start_sec: x.start_sec, end_sec: x.end_sec, vo_line: x.vo_line, sfx: x.sfx, music_cue: x.music_cue })),
      caption: sp.caption, cta: sp.cta, keep_as_is: sp.keep_as_is,
      learning: { hook_formula_id: hooks.downstream.learning.hook_formula_id, structure_type: sp.structure_type, angle_type: hooks.downstream.learning.angle_type, outcome: 'untested' },
    },
    assumptions: [],
    self_check: { passed: true, items: Array.from({ length: 10 }, (_, i) => ({ id: `SC${i + 1}`, ok: true })) },
    updated_at: at(45),
  };
}

// ── localised scripts ──────────────────────────────────────────────────
function localisedRecord(s) {
  if (!s.localised) return null;
  const l = shift(renamed(ex('localised_script'), 'SHL-01', s.job_id));
  if (s.localised === 'example') return l;
  if (s.localised === 'example-planted-drift') {
    // L5: an earlier pass let two meaning changes through: scene 5 lost "25 Nov tak" and gained "sirf aaj";
    // scene 6 lost the ₹299 condition. Cards and the client message still have the right facts.
    const set5 = { vo: 'Sirf aaj, 20% off.', tts: 'Sirf aaj, bees percent off.', text: 'Sirf aaj, *bees percent* off.' };
    const set6 = { vo: 'Pickup bilkul free.', tts: 'Pickup bilkul free.', text: 'Pickup *bilkul free*.' };
    for (const [n, v] of [[5, set5], [6, set6]]) {
      l.scenes[n - 1].vo_line = v.vo;
      Object.assign(l.vo_script.lines[n - 1], { text: v.text, tts_text: v.tts });
      l.downstream.vo_lines[n - 1].tts_text = v.tts;
    }
    l.captions_srt.srt = l.captions_srt.srt.replace('Dono pe 20% off, 25 Dec tak.', 'Sirf aaj, 20% off.').replace('Pickup free, ₹299 se upar.', 'Pickup bilkul free.');
    l.numbers_spoken = l.numbers_spoken.filter((x) => !(x.scene === 5 && x.kind === 'date') && !(x.scene === 6));
    return l;
  }
  throw new Error(`unknown localised fixture ${s.localised}`);
}

// ── one scenario job ───────────────────────────────────────────────────
export function buildJob(s) {
  const brief = briefFor(s);
  const research = s.research ? ch('research').outputs[s.research] : null;
  const request = {
    ...ex('request'), job_id: s.job_id, client_id: s.client_id, type: 'video', title: s.title, raw_request: `${s.title} (eval fixture)`,
    requested_by: 'samarth', requested_at: at(300), assignee: s.assignee, deadline: '2026-12-22', occasion: null, references: [],
    assumptions: ['Budget: video default 200.'], track: { proposed: s.track, reason: 'Eval fixture.', chosen: s.track },
  };
  const out = (stage, version, schema, data, by, m) => ({ version, stage, by, ...(schema ? { schema } : {}), summary: `${stage} (fixture)`, updated_at: at(m), data });
  const outputs = { request: out('intake', 1, 'request.schema.json', request, 'samarth', 290) };
  const history = [{ stage: 'intake', status: 'done', started_at: at(300), finished_at: at(290), by: 'samarth' }];
  const gates = [{ stage: 'intake', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { request: 1 }, requested_at: at(295), decided_by: 'samarth', decided_by_role: 'admin', decided_at: at(290) }];
  if (research) {
    outputs.research = out('research', 1, 'research.schema.json', research, 'system', 280);
    history.push({ stage: 'research', status: 'done', started_at: at(285), finished_at: at(280), by: 'system' });
  } else {
    history.push({ stage: 'research', status: 'skipped', started_at: at(285), finished_at: at(285), by: 'system', note: 'no research for this fixture' });
  }
  outputs.brief = out('brief', 1, 'brief.schema.json', brief, s.assignee, 240);
  history.push({ stage: 'brief', status: 'done', started_at: at(270), finished_at: at(240), by: s.assignee });
  gates.push({ stage: 'brief', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { brief: 1 }, requested_at: at(245), decided_by: 'samarth', decided_by_role: 'admin', decided_at: at(240) });
  if (s.track === 'full') {
    outputs.concept = out('concept', 1, null, { placeholder: true, note: 'fixture: the picked concept is in hooks.downstream.concept' }, s.assignee, 200);
    history.push({ stage: 'concept', status: 'done', started_at: at(230), finished_at: at(200), by: s.assignee });
  }
  const hooks = hooksRecord(s, research);
  outputs.hooks = out('hooks', 2, 'hooks.schema.json', hooks, s.assignee, 90);
  history.push({ stage: 'hooks', status: 'done', started_at: at(200), finished_at: at(90), by: s.assignee });
  gates.push({ stage: 'hooks', kind: 'stage', owner_role: 'editor', status: 'approved', shown_outputs: { hooks: 1, ...(s.track === 'full' ? { concept: 1 } : {}) }, requested_at: at(120), decided_by: s.assignee, decided_by_role: roleOf(s.assignee), decided_at: at(90), note: `creative pick: ${hooks.pick.concept_ref ?? ''}${hooks.pick.hook_id}` });

  let current = 'script';
  let waiting = 'none';
  let next = 'script stage next.';
  const name = s.assignee === 'pooja' ? 'Pooja' : 'Ravi';
  if (s.at === 'script') {
    history.push({ stage: 'script', status: 'in_progress', started_at: at(5), finished_at: null, by: s.assignee });
  } else {
    const sc = scriptRecord(s, hooks, research);
    outputs.script = out('script', sc.version, 'script.schema.json', sc, s.assignee, s.at === 'script-gate' ? 30 : 45);
    if (s.at === 'script-gate') {
      history.push({ stage: 'script', status: 'in_progress', started_at: at(60), finished_at: null, by: s.assignee });
      gates.push({ stage: 'script', kind: 'stage', owner_role: 'editor', status: 'pending', shown_outputs: { script: 1 }, requested_at: at(30) });
      waiting = 'editor';
      next = `${name} to make the script pick (A or B).`;
    } else {
      history.push({ stage: 'script', status: 'done', started_at: at(80), finished_at: at(45), by: s.assignee });
      gates.push({ stage: 'script', kind: 'stage', owner_role: 'editor', status: 'approved', shown_outputs: { script: 1 }, requested_at: at(60), decided_by: s.assignee, decided_by_role: roleOf(s.assignee), decided_at: at(46), note: 'script pick: A' });
      current = 'localise';
      next = 'localise stage next.';
      const lo = localisedRecord(s);
      if (lo) outputs.localised_script = out('localise', lo.version, 'localised_script.schema.json', lo, s.assignee, 20);
      if (s.at === 'localise') {
        history.push({ stage: 'localise', status: 'in_progress', started_at: at(10), finished_at: null, by: 'system' });
      } else if (s.at === 'client-gate') {
        history.push({ stage: 'localise', status: 'done', started_at: at(25), finished_at: at(20), by: 'system' });
        history.push({ stage: 'client-script-approval', status: 'in_progress', started_at: at(19), finished_at: null, by: s.assignee });
        gates.push({ stage: 'client-script-approval', kind: 'stage', owner_role: 'client', status: 'pending', shown_outputs: { script: outputs.script.version, localised_script: lo.version }, requested_at: at(18) });
        current = 'client-script-approval';
        waiting = 'client';
        next = `${name} to send the script review message to Neha and record the reply.`;
      }
    }
  }
  return {
    request, brief, hooks,
    job: {
      job_id: s.job_id, client_id: s.client_id, type: 'video', title: s.title, track: s.track,
      status: 'active', current_stage: current, waiting_on: waiting, next_action: next,
      stage_history: history, gates, assignee: s.assignee, deadline: request.deadline,
      credits: { budget: 200, used: 0, ledger: [] },
      research_status: research?.research_status ?? null, insight_id: research?.insight_id ?? null,
      outputs, client_feedback: [], revision_round: 0,
      log: [{ at: at(45), by: s.assignee, kind: 'gate', message: 'fixture setup' }],
      version: 8, created_at: at(300), updated_at: at(5),
    },
  };
}

function configFor(jobId) {
  const s = jobId ? SPECS.find((x) => x.job_id === jobId) : null;
  if (jobId && !s) throw new Error(`no fixture job ${jobId}`);
  return { ...ex('config'), ...(s?.config ?? {}) };
}

function check() {
  const errs = [];
  const fail = (where, v) => errs.push(`${where}: ${v.errors.map((e) => `${e.instancePath || '/'} ${e.message}`).join('; ')}`);
  const pacing = loadPacing();
  const cl = clients();
  cl.forEach((c) => V.client(c) || fail(`client ${c.client_id}`, V.client));
  const ids = new Set();
  let scripts = 0;
  let locs = 0;
  for (const s of SPECS) {
    if (ids.has(s.job_id)) errs.push(`jobs.json: duplicate ${s.job_id}`);
    ids.add(s.job_id);
    const c = cl.find((x) => x.client_id === s.client_id);
    if (!c) errs.push(`${s.job_id}: unknown client`);
    else if (Number(s.job_id.split('-')[1]) >= c.next_job_number) errs.push(`${s.job_id}: number not below ${c.client_id}.next_job_number`);
    let built;
    try { built = buildJob(s); } catch (e) { errs.push(`${s.job_id}: ${e.message}`); continue; }
    const { job } = built;
    V.job(job) || fail(`${s.job_id} job`, V.job);
    for (const [field, o] of Object.entries(job.outputs)) {
      const v = V[field];
      if (v && !o.data.placeholder && !v(o.data)) fail(`${s.job_id} outputs.${field}`, v);
    }
    const cfg = configFor(s.job_id);
    V.config(cfg) || fail(`${s.job_id} config`, V.config);
    const sc = job.outputs.script?.data;
    if (sc) { scripts++; for (const e of scriptConsistency(sc, { pacing, config: cfg, where: `${s.job_id} script` })) errs.push(e); }
    const lo = job.outputs.localised_script?.data;
    if (lo) { locs++; for (const e of localisedConsistency(lo, { script: sc, pacing, config: cfg, where: `${s.job_id} localised_script` })) errs.push(e); }
    if (job.outputs.hooks.data.pick.status !== 'picked') errs.push(`${s.job_id}: hooks pick not picked`);
  }
  // replies point at things that exist
  const pend = buildJob(SPECS.find((x) => x.at === 'script-gate')).job.outputs.script.data;
  const vids = new Set(pend.versions.map((v) => v.id));
  for (const r of fx('replies').script_pick) {
    if (!r.expect) errs.push(`replies ${r.id}: no expect`);
    if (r.expect?.pick && !vids.has(r.expect.pick)) errs.push(`replies ${r.id}: version ${r.expect.pick} not in the pending script`);
  }
  for (const r of fx('replies').client) if (!r.expect) errs.push(`replies ${r.id}: no expect`);
  if (errs.length) {
    console.error(`✘ ${errs.length} fixture problem(s):\n  - ${errs.join('\n  - ')}`);
    process.exit(1);
  }
  console.log(`✔ script-localise fixtures valid: ${cl.length} clients, ${SPECS.length} scenario jobs, ${scripts} script(s) and ${locs} localised script(s) pass check 13, ${fx('replies').script_pick.length} script-pick and ${fx('replies').client.length} client replies`);
}

function seed(dir, jobId) {
  const cl = clients();
  const jobs = SPECS.map((s) => buildJob(s).job);
  const team = [
    { handle: 'samarth', name: 'Samarth', role: 'admin', email: 'admin@example.com', active: true, added_at: '2026-11-10T09:00:00+05:30', version: 1, updated_at: '2026-11-10T09:00:00+05:30' },
    ex('team'),
    { handle: 'pooja', name: 'Pooja', role: 'designer', email: 'pooja@example.com', active: true, added_at: '2026-11-10T09:00:00+05:30', version: 1, updated_at: '2026-11-10T09:00:00+05:30' },
  ];
  const w = (p, o) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); };
  w(path.join(dir, 'config.json'), { ...configFor(jobId), storage_mode: 'files', data_folder: dir });
  w(path.join(dir, 'team.json'), team);
  w(path.join(dir, 'clients', 'index.json'), cl.map(({ client_id, client_code, name, status, business_type, city, updated_at }) => ({ client_id, client_code, name, status, business_type, city, updated_at })));
  for (const c of cl) w(path.join(dir, 'clients', c.client_id, 'client.json'), c);
  w(path.join(dir, 'jobs', 'index.json'), jobs.map(({ job_id, client_id, title, type, status, current_stage, waiting_on, assignee, deadline, updated_at }) => ({ job_id, client_id, title, type, status, current_stage, waiting_on, assignee, deadline, updated_at })));
  for (const j of jobs) {
    w(path.join(dir, 'jobs', j.job_id, 'job.json'), j);
    w(path.join(dir, 'jobs', j.job_id, 'log-full.json'), j.log);
  }
  console.log(`Seeded ${dir}: ${cl.length} clients, ${jobs.length} jobs${jobId ? `, config from ${jobId}` : ''}. Eval clock ${clock}.`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const [cmd, arg, ...rest] = process.argv.slice(2);
  const flag = (n) => (rest.includes(n) ? rest[rest.indexOf(n) + 1] : null);
  if (cmd === 'check') check();
  else if (cmd === 'seed' && arg) seed(path.resolve(arg), flag('--job'));
  else {
    console.error('usage: node evals/script-localise-fixtures.mjs check | seed <dir> [--job ID]');
    process.exit(2);
  }
}
