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

const clientA = { ...ex('client'), next_job_number: 3 }; // SHL-01 and SHL-02 exist in the sample
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
  own_handle: 'ex_narmadaheights',
  competitors: [
    { handle: 'ex_jabalpur_homes', platform: 'instagram', group: 'direct', reason: 'Gated township on the same road', confidence: 'guessed', struck: false, added_on: '2026-11-20' },
    { handle: 'ex_mp_realty_group', platform: 'instagram', group: 'direct', reason: 'Biggest ad spender in Jabalpur residential', confidence: 'guessed', struck: false, added_on: '2026-11-20' },
    { handle: 'ex_home_loan_tips', platform: 'instagram', group: 'adjacent', reason: 'Same buyers, home-loan explainers', confidence: 'guessed', struck: false, added_on: '2026-11-20' },
  ],
  meta: { linked: true, ad_account_id: '100000000000001', ig_account_id: '170000000000001', page_id: '110000000000001' },
  latest_insight_id: 'NRH-I202611-1',
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
    { stage: 'intake', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { request: 1 }, requested_at: '2026-11-16T10:05:00+05:30', decided_by: 'samarth', decided_by_role: 'admin', decided_at: '2026-11-16T10:10:00+05:30' },
    { stage: 'brief', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { brief: 1 }, requested_at: '2026-11-16T10:25:00+05:30', decided_by: 'samarth', decided_by_role: 'admin', decided_at: '2026-11-16T10:30:00+05:30' },
    { stage: 'concept', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { concept: 1 }, requested_at: '2026-11-16T10:55:00+05:30', decided_by: 'samarth', decided_by_role: 'admin', decided_at: '2026-11-16T11:00:00+05:30' },
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
    brief: { version: 1, stage: 'brief', by: 'system', summary: 'placeholder', updated_at: '2026-11-16T10:25:00+05:30', data: { placeholder: true, note: 'brief not built yet' } },
    concept: { version: 1, stage: 'concept', by: 'system', summary: 'placeholder', updated_at: '2026-11-16T10:55:00+05:30', data: { placeholder: true, note: 'concept not built yet' } },
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
    { stage: 'research', status: 'done', started_at: '2026-11-20T11:30:00+05:30', finished_at: '2026-11-20T11:52:00+05:30', by: 'system', note: 'new sheet; Instagram read queued (no browser)' },
    { stage: 'brief', status: 'in_progress', started_at: '2026-11-20T11:52:00+05:30', finished_at: null, by: 'ravi' },
  ],
  gates: [
    { stage: 'intake', kind: 'stage', owner_role: 'admin', status: 'approved', shown_outputs: { request: 1 }, requested_at: '2026-11-20T11:25:00+05:30', decided_by: 'samarth', decided_by_role: 'admin', decided_at: '2026-11-20T11:30:00+05:30' },
    { stage: 'brief', kind: 'stage', owner_role: 'admin', status: 'pending', shown_outputs: { brief: 1 }, requested_at: '2026-11-20T12:00:00+05:30' },
  ],
  assignee: 'ravi',
  deadline: '2026-12-05',
  urgent: false,
  research_status: 'partial',
  insight_id: 'NRH-I202611-1',
  credits: {
    budget: 200,
    used: 0,
    ledger: [
      { at: '2026-11-20T11:52:00+05:30', stage: 'research', amount: 0, provider: 'web', currency: 'USD', description: 'Web research (free)', by: 'system' },
      { at: '2026-11-20T11:52:00+05:30', stage: 'research', amount: 0, provider: 'meta', currency: 'USD', description: 'Meta Ad Library (free)', by: 'system' },
    ],
  },
  outputs: {
    request: { version: 1, stage: 'intake', by: 'samarth', summary: 'Navratri site-visit offer reel, full track, budget 200', updated_at: '2026-11-20T11:25:00+05:30', data: { placeholder: true, note: 'sample' } },
    research: {
      version: 1, stage: 'research', by: 'system', schema: 'research.schema.json', updated_at: '2026-11-20T11:52:00+05:30',
      summary: 'New sheet NRH-I202611-1 (unattended part); Instagram read queued',
      data: {
        research_status: 'partial', insight_id: 'NRH-I202611-1', insight_version: 1, insight_date: '2026-11-20',
        flags: ['browser_step_pending'], note: 'Ads, web and review parts are in; the Instagram read is queued for when someone is online with Chrome.',
        downstream: null, // copied from the insight below
      },
    },
    brief: { version: 1, stage: 'brief', by: 'system', updated_at: '2026-11-20T12:00:00+05:30', data: { placeholder: true, note: 'brief not built yet' } },
  },
  client_feedback: [],
  revision_round: 0,
  log: [{ at: '2026-11-20T12:00:00+05:30', by: 'system', kind: 'event', message: 'brief placeholder written; waiting on admin.' }],
  version: 4,
  created_at: '2026-11-20T11:00:00+05:30',
  updated_at: '2026-11-20T12:00:00+05:30',
};
// The handoff block is a copy of non-struck findings, pinned first, then strong → some → weak.
const ORDER = { strong: 0, some: 1, weak: 2 };
function buildDownstream(findings) {
  const pick = (cat) =>
    (findings[cat] ?? [])
      .filter((f) => !f.struck)
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || ORDER[a.confidence] - ORDER[b.confidence])
      .map((f) => ({
        id: f.id,
        text: f.text,
        confidence: f.confidence,
        ...(f.language ? { language: f.language } : {}),
        ...(f.details?.formula ? { formula: f.details.formula, multiple: f.details.multiple } : {}),
      }));
  return {
    brief: { pain_points: pick('pain_points'), working_angles: pick('working_angles'), timely_hooks: pick('timely_hooks') },
    concept_and_hooks: { working_angles: pick('working_angles'), outlier_hooks: pick('outlier_hooks'), competitors_overdo: pick('competitors_overdo') },
    script: { proof_points: pick('proof_points') },
    localise: { customer_phrases: pick('customer_phrases') },
    visuals: { visual_cliches: pick('visual_cliches') },
  };
}
const insightA = ex('insight');
const nrhFindings = {
  pain_points: [
    { id: 'F1', text: 'Buyers worry the possession date will slip; enquiries ask about it before price.', source: 'Google reviews of 4 Jabalpur projects, 30 read (2026-11-20)', confidence: 'some' },
  ],
  working_angles: [
    { id: 'F2', text: 'Lead with the RERA number and a dated construction-progress clip; local rivals show renders only.', source: 'Meta Ad Library: 6 Jabalpur residential advertisers, 38 active ads (2026-11-20)', confidence: 'some' },
  ],
  outlier_hooks: [],
  competitors_overdo: [
    { id: 'F3', text: 'Drone renders with "luxury living" text; 5 of 6 advertisers run them.', source: 'Meta Ad Library: 6 Jabalpur residential advertisers, 38 active ads (2026-11-20)', confidence: 'strong' },
  ],
  timely_hooks: [
    { id: 'F4', text: 'Navratri is a traditional time to book a home; rivals already run "shubh muhurat" booking offers.', source: 'Meta Ad Library + web search, 5 searches (2026-11-20)', confidence: 'some' },
  ],
  customer_phrases: [
    { id: 'F5', text: 'possession kab milega', source: 'Google reviews of 4 Jabalpur projects, 30 read (2026-11-20)', confidence: 'some', language: 'Hinglish' },
  ],
  proof_points: [
    { id: 'F6', text: 'Projects that post monthly site-progress photos get more 5-star reviews mentioning trust.', source: 'Google reviews of 4 Jabalpur projects, 30 read (2026-11-20)', confidence: 'weak' },
  ],
  visual_cliches: [
    { id: 'F7', text: 'Gold-on-black "luxury" templates and stock family-on-sofa photos.', source: 'Meta Ad Library: 6 Jabalpur residential advertisers, 38 active ads (2026-11-20)', confidence: 'strong' },
  ],
  competitor_ads: [
    {
      id: 'F8',
      text: 'A Navratri booking offer (free modular kitchen) running 24 days in 4 versions: early, but being iterated.',
      source: 'https://www.facebook.com/ads/library/?id=EXAMPLE2',
      confidence: 'some',
      details: { advertiser: 'MP Realty Group (fictional)', days_running: 24, versions: 4, reason_to_buy: 'offer', hook_type: 'offer-led', offer: 'free modular kitchen on booking', format: 'video', language: 'Hindi', status_read: 'test (under 30 days), several versions' },
    },
  ],
};
const insightB = {
  insight_id: 'NRH-I202611-1',
  client_id: 'narmada-heights',
  mode: 'unattended',
  trigger: 'intake',
  situation: ['new_client', 'ad_heavy', 'no_browser'],
  festival: null,
  methods_used: [
    { method: 'meta-ad-library', reason: 'Ad-heavy niche: ads first', path: 'connector', skill: null, status: 'done' },
    { method: 'web-competitor-intel', reason: 'New client: map the local field', path: 'web', skill: null, status: 'done' },
    { method: 'maps-review-reading', reason: 'Reviews carry buyer worries', path: 'web', skill: null, status: 'done' },
    { method: 'trends', reason: 'Navratri offer in the request', path: 'web', skill: null, status: 'done' },
    { method: 'ig-outlier-read', reason: 'What works on local real-estate Instagram', path: 'fallback', skill: null, status: 'queued', note: 'no browser in this session' },
  ],
  cost: [
    { provider: 'web', amount: 0, currency: 'USD' },
    { provider: 'meta', amount: 0, currency: 'USD' },
  ],
  competitors_analysed: [
    { handle: 'ex_jabalpur_homes', platform: 'instagram', group: 'direct' },
    { handle: 'ex_mp_realty_group', platform: 'instagram', group: 'direct' },
  ],
  own_account: null,
  findings: nrhFindings,
  widened: null,
  not_read: ['Instagram (queued: needs a person online with a browser)'],
  diff_vs_previous: null,
  pending_browser_step: { pending: true, methods: ['ig-outlier-read', 'ig-hook-classify'], task_id: 'T-20261120-1', estimate_minutes: 10 },
  raw_files: ['https://drive.google.com/drive/folders/EXAMPLE-NRH-RESEARCH'],
  ran_without_subagent: false,
  summary: 'First research for Narmada Heights (ads, web, reviews): possession-date worry leads; rivals overdo drone renders; Navratri booking offers already running.',
  downstream: buildDownstream(nrhFindings),
  version: 1,
  created_at: '2026-11-20T11:52:00+05:30',
  updated_at: '2026-11-20T11:52:00+05:30',
};
job3.outputs.research.data.downstream = insightB.downstream;
const taskA = {
  task_id: 'T-20261120-1',
  kind: 'research-browser-step',
  client_id: 'narmada-heights',
  job_id: 'NRH-01',
  insight_id: 'NRH-I202611-1',
  status: 'pending',
  trigger: 'intake',
  methods: ['ig-outlier-read', 'ig-hook-classify'],
  needs_person: true,
  needs_browser: true,
  estimate_minutes: 10,
  note: 'Instagram read for the new sheet; non-blocking for NRH-01.',
  created_at: '2026-11-20T11:52:00+05:30',
  created_by: 'system',
  version: 1,
  updated_at: '2026-11-20T11:52:00+05:30',
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
add('insight', insightA);
add('insight', insightB);
add('task', taskA);

export const sampleRecords = { clients: [clientA, clientB], jobs: [job1, job2, job3], team, insights: [insightA, insightB], tasks: [taskA] };

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
