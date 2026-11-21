#!/usr/bin/env node
// Builds library/storage/tracker-page/sample-data.json: fictional records encoded exactly as
// the Google Sheet returns them (get_values: strings, header row first). Used by the tracker
// page's mock mode and by validate.mjs. Usage: node scripts/build-sample-data.mjs [--check]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodeRecord, headerRows } from './lib/sheet-codec.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = path.join(ROOT, 'plugins', 'social-media-manager', 'library');
const OUT = path.join(P, 'storage', 'tracker-page', 'sample-data.json');
const ex = (n) => JSON.parse(fs.readFileSync(path.join(P, 'contracts', 'examples', `${n}.example.json`), 'utf8'));

const clientA = ex('client');
const clientB = {
  client_id: 'narmada-heights',
  client_code: 'NRH',
  name: 'Narmada Heights Developers',
  status: 'active',
  business_type: 'residential real estate developer',
  city: 'Jabalpur',
  contact_person: 'Mr. Tiwari (sales head)',
  decision_maker: { name: 'Mr. Agrawal', role: 'director' },
  whatsapp: '+910000000002',
  onboarding_source: 'interview',
  languages: ['Hindi', 'English'],
  platforms: ['instagram', 'facebook', 'youtube'],
  posting_frequency: '2 reels + 3 posts per week',
  audience: { summary: 'Families upgrading from rented flats; NRIs buying for parents.', age_range: '30-55', locations: ['Jabalpur', 'Napier Town'] },
  tone_of_voice: {
    summary: 'Assured and family-first.',
    attributes: [{ name: 'Assured', means: 'Specific facts: RERA number, possession date, carpet area', doesnt_mean: 'Pushy sales talk' }],
  },
  visual_identity: { colours: [{ name: 'River teal', hex: '#0F766E', use: 'primary' }] },
  do: ['Show RERA number on every creative'],
  dont: ['Promise returns or appreciation'],
  festival_calendar: [{ occasion: 'Navratri booking offer', date: null, priority: 'high' }],
  revision_cap: 2,
  next_job_number: 2,
  learnings: [],
  confidence: {
    name: { status: 'confirmed', basis: 'director on call' },
    audience: { status: 'guessed', basis: 'inferred from site visit enquiries' },
    tone_of_voice: { status: 'guessed', basis: 'inferred from brochure' },
    revision_cap: { status: 'confirmed', basis: 'default 2, admin approved' },
  },
  open_questions: [
    { question: 'Can we show the price per sq ft?', recommendation: 'Show "starting at" only, no per-sq-ft price.', priority: 'high', field: 'price_points' },
  ],
  version: 1,
  changelog: [{ version: 1, date: '2026-11-19', by: 'samarth', sections: ['all'], change: 'Initial profile from interview.' }],
  created_at: '2026-11-19T15:00:00+05:30',
  updated_at: '2026-11-19T15:00:00+05:30',
};

const job1 = ex('job');
const job2 = {
  job_id: 'SHL-02',
  client_id: 'shubh-laundry',
  type: 'poster',
  title: 'Wedding season saree dry-clean poster',
  track: 'quick',
  status: 'active',
  current_stage: 'client-poster-approval',
  waiting_on: 'client',
  next_action: 'Pooja to record Neha ji\'s reply on the two poster drafts.',
  stage_history: [
    { stage: 'intake', status: 'done', started_at: '2026-11-16T10:00:00+05:30', finished_at: '2026-11-16T10:10:00+05:30', by: 'samarth' },
    { stage: 'brief', status: 'done', started_at: '2026-11-16T10:10:00+05:30', finished_at: '2026-11-16T10:30:00+05:30', by: 'samarth' },
    { stage: 'concept', status: 'done', started_at: '2026-11-16T10:30:00+05:30', finished_at: '2026-11-16T11:00:00+05:30', by: 'pooja' },
    { stage: 'poster-drafts', status: 'done', started_at: '2026-11-17T09:00:00+05:30', finished_at: '2026-11-17T12:00:00+05:30', by: 'pooja' },
    { stage: 'client-poster-approval', status: 'in_progress', started_at: '2026-11-17T12:00:00+05:30', finished_at: null, by: 'pooja' },
  ],
  gates: [
    { stage: 'intake', kind: 'stage', owner_role: 'admin', status: 'approved', requested_at: '2026-11-16T10:05:00+05:30', decided_by: 'samarth', decided_by_role: 'admin', decided_at: '2026-11-16T10:10:00+05:30' },
    { stage: 'brief', kind: 'stage', owner_role: 'admin', status: 'approved', requested_at: '2026-11-16T10:25:00+05:30', decided_by: 'samarth', decided_by_role: 'admin', decided_at: '2026-11-16T10:30:00+05:30' },
    { stage: 'concept', kind: 'stage', owner_role: 'admin', status: 'approved', requested_at: '2026-11-16T10:55:00+05:30', decided_by: 'samarth', decided_by_role: 'admin', decided_at: '2026-11-16T11:00:00+05:30' },
    { stage: 'poster-drafts', kind: 'stage', owner_role: 'editor', status: 'approved', shown_outputs: { poster_drafts: 1 }, requested_at: '2026-11-17T11:50:00+05:30', decided_by: 'pooja', decided_by_role: 'designer', decided_at: '2026-11-17T12:00:00+05:30' },
    { stage: 'client-poster-approval', kind: 'stage', owner_role: 'client', status: 'pending', shown_outputs: { poster_drafts: 1 }, requested_at: '2026-11-17T12:05:00+05:30' },
  ],
  assignee: 'pooja',
  deadline: '2026-11-20',
  credits: {
    budget: 28,
    warn_at: 20,
    used: 14,
    ledger: [
      { at: '2026-11-17T09:30:00+05:30', stage: 'poster-drafts', amount: 6, estimate: 6, tier: 'draft', tool: 'higgsfield/draft-image', description: 'Draft A, 4:5', by: 'pooja' },
      { at: '2026-11-17T10:15:00+05:30', stage: 'poster-drafts', amount: 8, estimate: 8, tier: 'draft', tool: 'higgsfield/draft-image', description: 'Draft B, 4:5', by: 'pooja' },
    ],
  },
  outputs: {
    request: { version: 1, stage: 'intake', by: 'samarth', summary: 'Saree dry-clean poster for wedding season, Instagram 4:5', updated_at: '2026-11-16T10:05:00+05:30', data: { placeholder: true, note: 'sample' } },
    poster_drafts: { version: 1, stage: 'poster-drafts', by: 'system', summary: 'Two drafts (placeholder stage)', updated_at: '2026-11-17T12:00:00+05:30', data: { placeholder: true, note: 'poster-drafts not built yet' } },
  },
  client_feedback: [],
  revision_round: 0,
  log: [
    { at: '2026-11-17T09:30:00+05:30', by: 'pooja', kind: 'credit', message: 'Draft A: 6 credits (estimate 6).' },
    { at: '2026-11-17T10:15:00+05:30', by: 'pooja', kind: 'credit', message: 'Draft B: 8 credits (estimate 8).' },
    { at: '2026-11-17T12:05:00+05:30', by: 'pooja', kind: 'gate', message: 'Drafts sent to client; waiting on client.' },
  ],
  version: 12,
  created_at: '2026-11-16T10:00:00+05:30',
  updated_at: '2026-11-17T12:05:00+05:30',
};
const job3 = {
  job_id: 'NRH-01',
  client_id: 'narmada-heights',
  type: 'video',
  title: 'Navratri site-visit offer reel',
  track: 'full',
  status: 'active',
  current_stage: 'brief',
  waiting_on: 'admin',
  next_action: 'Samarth to approve the brief (placeholder) and confirm budget 200.',
  stage_history: [
    { stage: 'intake', status: 'done', started_at: '2026-11-20T11:00:00+05:30', finished_at: '2026-11-20T11:30:00+05:30', by: 'samarth' },
    { stage: 'brief', status: 'in_progress', started_at: '2026-11-20T11:30:00+05:30', finished_at: null, by: 'ravi' },
  ],
  gates: [
    { stage: 'intake', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { request: 1 }, requested_at: '2026-11-20T11:25:00+05:30', decided_by: 'samarth', decided_by_role: 'admin', decided_at: '2026-11-20T11:30:00+05:30' },
    { stage: 'brief', kind: 'stage', owner_role: 'admin', status: 'pending', shown_outputs: { brief: 1 }, requested_at: '2026-11-20T12:00:00+05:30' },
  ],
  assignee: 'ravi',
  deadline: '2026-12-05',
  credits: { budget: 200, used: 0, ledger: [] },
  outputs: {
    brief: { version: 1, stage: 'brief', by: 'system', updated_at: '2026-11-20T12:00:00+05:30', data: { placeholder: true, note: 'brief not built yet' } },
  },
  client_feedback: [],
  revision_round: 0,
  log: [{ at: '2026-11-20T12:00:00+05:30', by: 'system', kind: 'event', message: 'brief placeholder written; waiting on admin.' }],
  version: 4,
  created_at: '2026-11-20T11:00:00+05:30',
  updated_at: '2026-11-20T12:00:00+05:30',
};
const team = [
  { handle: 'samarth', name: 'Samarth', role: 'admin', email: 'admin@example.com', active: true, added_at: '2026-11-10T09:00:00+05:30', version: 1, updated_at: '2026-11-10T09:00:00+05:30' },
  ex('team'),
  { handle: 'pooja', name: 'Pooja', role: 'designer', email: 'pooja@example.com', active: true, added_at: '2026-11-10T09:00:00+05:30', version: 1, updated_at: '2026-11-10T09:00:00+05:30' },
];

// Simulate what get_values returns: strings, no leading apostrophe, booleans as TRUE/FALSE.
const sim = (cell) => (cell === '' ? '' : typeof cell === 'string' ? cell.replace(/^'/, '') : typeof cell === 'boolean' ? (cell ? 'TRUE' : 'FALSE') : String(cell));
const tabs = headerRows();
const add = (rec, data) => {
  for (const [tab, rows] of Object.entries(encodeRecord(rec, data))) tabs[tab] = tabs[tab].concat(rows.map((r) => r.map(sim)));
};
add('client', clientA);
add('client', clientB);
for (const j of [job1, job2, job3]) {
  // Credits rows carry client_id for the Dashboard.
  add('job', j);
}
for (const m of team) add('team', m);
add('config', ex('config'));

export const sampleRecords = { clients: [clientA, clientB], jobs: [job1, job2, job3], team };

const out = {
  $comment: 'GENERATED by scripts/build-sample-data.mjs. Fictional data in the exact shape Google Sheets get_values returns. Do not edit by hand.',
  tabs,
};
const text = JSON.stringify(out, null, 1) + '\n';
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  if (process.argv.includes('--check')) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (cur !== text) { console.error('sample-data.json is stale: run node scripts/build-sample-data.mjs'); process.exit(1); }
    console.log('sample-data.json is up to date');
  } else {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, text);
    console.log(`Wrote ${path.relative(ROOT, OUT)}`);
  }
}
