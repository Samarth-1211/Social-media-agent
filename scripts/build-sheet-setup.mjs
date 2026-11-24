#!/usr/bin/env node
// Builds library/storage/sheet-setup.json from library/storage/sheet-layout.json.
// The output is what first-run setup sends to Google Sheets, verbatim:
//   1. batch_requests  -> Google Sheets "batch update" (update_spreadsheet), one call
//   2. values          -> Google Sheets "update values", one call per entry (headers, Dashboard formulas, Config defaults)
// Usage: node scripts/build-sheet-setup.mjs [--check]   (--check: exit 1 if the file is stale)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STORAGE = path.join(ROOT, 'plugins', 'social-media-manager', 'library', 'storage');
const layout = JSON.parse(fs.readFileSync(path.join(STORAGE, 'sheet-layout.json'), 'utf8'));
const OUT = path.join(STORAGE, 'sheet-setup.json');

const colLetter = (i) => {
  let s = '';
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
};
const tab = (name) => layout.tabs.find((t) => t.name === name);
const col = (tabName, key) => {
  const i = tab(tabName).columns.findIndex((c) => c.key === key);
  if (i < 0) throw new Error(`no column ${key} in ${tabName}`);
  return colLetter(i);
};

const requests = [
  { updateSpreadsheetProperties: { properties: { timeZone: 'Asia/Kolkata' }, fields: 'timeZone' } },
  { updateSheetProperties: { properties: { sheetId: 0, title: 'Dashboard' }, fields: 'title' } },
];
const values = [];
const HEADER_BG = { red: 0.85, green: 0.92, blue: 1 };

// sheetId = the tab's position in the layout. New tabs are only ever added at the end, so ids never move.
const addTab = (t, sheetId, reqs) => {
  const cols = Math.max(26, t.columns?.length ?? 0);
  reqs.push({ addSheet: { properties: { sheetId, title: t.name, gridProperties: { rowCount: 1000, columnCount: cols } } } });
};
const validation = (sheetId, i, options) => ({
  setDataValidation: {
    range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: i, endColumnIndex: i + 1 },
    rule: { condition: { type: 'ONE_OF_LIST', values: options.map((o) => ({ userEnteredValue: o })) }, strict: true, showCustomUi: true },
  },
});
const formatTab = (t, sheetId, reqs, vals) => {
  const n = t.columns.length;
  vals.push({ range: `${t.name}!A1:${colLetter(n - 1)}1`, values: [t.columns.map((c) => `'${c.key}`)] });
  reqs.push({ updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } });
  reqs.push({
    repeatCell: {
      range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: n },
      cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColorStyle: { rgbColor: HEADER_BG } } },
      fields: 'userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColorStyle',
    },
  });
  reqs.push({
    addProtectedRange: {
      protectedRange: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: n },
        description: 'Column keys used by Claude. Do not rename or reorder.',
        warningOnly: true,
      },
    },
  });
  t.columns.forEach((c, i) => {
    if (c.options) reqs.push(validation(sheetId, i, c.options));
  });
};
layout.tabs.forEach((t, sheetId) => {
  if (sheetId > 0) addTab(t, sheetId, requests);
  if (t.columns) formatTab(t, sheetId, requests, values);
});

// Dashboard: title, then four live views side by side.
const J = (k) => col('Jobs', k);
const C = (k) => col('Credits', k);
const jobsRange = `Jobs!A:${colLetter(tab('Jobs').columns.length - 1)}`;
const credRange = `Credits!A:${colLetter(tab('Credits').columns.length - 1)}`;
const q = (range, sql, empty) => `=IFERROR(QUERY(${range},${sql},1),"${empty}")`;
const today = `TEXT(TODAY(),"yyyy-mm-dd")`;
const month = `TEXT(TODAY(),"yyyy-mm")`;
const dashboard = [
  ['TDM Studio: Dashboard (live, read-only)', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  ['Open jobs by who they are waiting on', '', '', '', '', '', '', '', '', 'Overdue', '', '', '', '', '', 'Credits used this month', '', '', 'Open jobs per assignee', '', '', '', ''],
  [
    q(jobsRange, `"select ${J('waiting_on')},${J('job_id')},${J('title')},${J('current_stage')},${J('assignee')},${J('deadline')},${J('next_action')} where ${J('status')}='active' order by ${J('waiting_on')},${J('deadline')}"`, 'No open jobs'),
    '', '', '', '', '', '', '', '',
    q(jobsRange, `"select ${J('job_id')},${J('title')},${J('assignee')},${J('deadline')},${J('waiting_on')} where ${J('status')}='active' and ${J('deadline')} <> '' and ${J('deadline')} < '"&${today}&"' order by ${J('deadline')}"`, 'Nothing overdue'),
    '', '', '', '', '',
    q(credRange, `"select ${C('client_id')}, sum(${C('amount')}) where ${C('at')} starts with '"&${month}&"' and (${C('currency')} = 'credits' or ${C('currency')} = '' or ${C('currency')} is null) group by ${C('client_id')} label sum(${C('amount')}) 'credits'"`, 'No credits this month'),
    '', '',
    q(jobsRange, `"select ${J('assignee')}, count(${J('job_id')}) where ${J('status')}='active' group by ${J('assignee')} label count(${J('job_id')}) 'open jobs'"`, 'No open jobs'),
    '', '', '', '',
  ],
];
values.push({ range: 'Dashboard!A1:W3', values: dashboard });
requests.push({
  repeatCell: {
    range: { sheetId: 0, startRowIndex: 0, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 23 },
    cell: { userEnteredFormat: { textFormat: { bold: true } } },
    fields: 'userEnteredFormat.textFormat.bold',
  },
});
requests.push({
  addProtectedRange: {
    protectedRange: { range: { sheetId: 0 }, description: 'Dashboard is formulas only. Edit data in the other tabs.', warningOnly: true },
  },
});

// Dashboard, layout v3 (brief): client questions not answered within client_question_reminder_hours (default 24).
const B = (k) => col('BriefQuestions', k);
const bqRange = `BriefQuestions!A:${colLetter(tab('BriefQuestions').columns.length - 1)}`;
const bqCutoff = 'NOW()-IFERROR(VLOOKUP("client_question_reminder_hours",Config!A:B,2,FALSE),24)/24';
const bqCutoffText = `TEXT(${bqCutoff},"yyyy-mm-dd")&"T"&TEXT(${bqCutoff},"HH:mm:ss")`;
const briefDashboard = {
  range: 'Dashboard!X2:AA3',
  values: [
    ['Brief: waiting for client reply', '', '', ''],
    [q(bqRange, `"select ${B('job_id')},${B('n')},${B('question')},${B('asked_at')} where ${B('status')}='open' and ${B('asked_at')} <> '' and ${B('asked_at')} < '"&${bqCutoffText}&"+05:30' order by ${B('asked_at')}"`, 'No client replies pending'), '', '', ''],
  ],
};
// The Dashboard tab starts with 26 columns (A–Z); the brief block reaches AA, so widen it first.
const briefDashboardWiden = { updateSheetProperties: { properties: { sheetId: 0, gridProperties: { columnCount: 30 } }, fields: 'gridProperties.columnCount' } };
const briefDashboardBold = {
  repeatCell: {
    range: { sheetId: 0, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 23, endColumnIndex: 27 },
    cell: { userEnteredFormat: { textFormat: { bold: true } } },
    fields: 'userEnteredFormat.textFormat.bold',
  },
};
values.push(briefDashboard);
requests.push(briefDashboardWiden, briefDashboardBold);

// Research settings (layout v2). Also appended to existing sheets by the v1 → v2 upgrade.
const RESEARCH_CONFIG = [
  ['freshness_days', 30],
  ['research_schedule_enabled', true],
  ['research_unattended_clients', "'all"],
  ['research_caps', `'${JSON.stringify({ accounts_min: 6, accounts_max: 12, reels_per_account: 12, comment_reels: 5, comments_per_reel: 30, reviews_per_business: 30, hashtag_scans: 2, trend_searches: 5, ad_library_advertisers: 6 })}`],
  ['competitor_confirm_required', false],
  ['apify_enabled', false],
  ['research_auto_approve_limit', 0],
  ['research_currency', "'USD"],
];

// Brief settings (layout v3). Also appended to existing sheets by the v2 → v3 upgrade.
const BRIEF_CONFIG = [
  ['brief_auto_approve_repeat', false],
  ['brief_max_questions', 5],
  ['client_question_reminder_hours', 24],
];

// Concept + hooks settings (layout v4). Also appended to existing sheets by the v3 → v4 upgrade.
const CREATIVE_CONFIG = [
  ['concepts_count', 3],
  ['hooks_per_concept', 8],
  ['creative_auto_pick_after_hours', ''],
];

// Script + localise settings (layout v5). Also appended to existing sheets by the v4 → v5 upgrade.
const SCRIPT_CONFIG = [
  ['script_versions', 2],
  ['pace_overrides', "'{}"],
  ['localise_variant_languages', "'[]"],
  ['caption_max_chars_per_line', 32],
];

// Config defaults (ADR 0003). spreadsheet_id and drive_folder_id are filled in by setup.
const configRows = [
  ['storage_mode', "'google-sheets"],
  ['spreadsheet_id', '<SPREADSHEET_ID>'],
  ['drive_folder_id', '<DRIVE_FOLDER_ID>'],
  ['tracker_page_url', ''],
  ['data_folder', ''],
  ['default_language', "'Hinglish"],
  ['default_revision_cap', 2],
  ['default_credit_budget_video', 200],
  ['default_credit_warn_video', ''],
  ['default_credit_budget_poster', 28],
  ['default_credit_warn_poster', 20],
  ['credit_policy', `'${JSON.stringify({ prompt_check_before_spend: true, estimate_before_spend: true, start_tier: 'draft', draft_variations: 1, upgrade_approver: 'editor' })}`],
  ...RESEARCH_CONFIG,
  ...BRIEF_CONFIG,
  ...CREATIVE_CONFIG,
  ...SCRIPT_CONFIG,
  ['version', 1],
  ['updated_at', '<NOW>'],
].map(([k, v]) => [`'${k}`, v]);
values.push({ range: `Config!A2:B${configRows.length + 1}`, values: configRows });

// Clock cell (google-sheets.md §1a): get_now rewrites E1 with this formula, then reads it back.
export const CLOCK_FORMULA = '=TEXT(NOW(),"yyyy-mm-dd")&"T"&TEXT(NOW(),"HH:mm:ss")&"+05:30"';
values.push({ range: 'Config!D1:E1', values: [["'clock (do not edit)", CLOCK_FORMULA]] });

// ── Upgrades for sheets built with an older layout ──────────────────
// A sheet is on layout v1 if it has no Insights tab, on v2 if it has Insights but no BriefQuestions tab, on v3 if its Learnings tab has no hook_formula_id column, and on v4 if its Clients tab has no pronunciation column. Apply upgrades in order. The admin runs the upgrade once (google-sheets.md §7):
// batch_requests in one batch update, then each values entry with update values, then each append entry with append values.
// Nothing existing moves: new columns go after the last column of their tab, new tabs after the last tab.
function upgrade(from, to) {
  const reqs = [];
  const vals = [];
  layout.tabs.forEach((t, sheetId) => {
    if (t.since === to) {
      addTab(t, sheetId, reqs);
      formatTab(t, sheetId, reqs, vals);
      return;
    }
    if (!t.columns) return;
    // Count only the columns that exist at layout v<to>, so older upgrades don't change when later columns are added.
    const n = t.columns.filter((c) => (c.since ?? 1) <= to).length;
    const added = t.columns.map((c, i) => [c, i]).filter(([c]) => c.since === to);
    if (added.length) {
      const first = added[0][1];
      if (added.some(([, i], k) => i !== first + k) || first + added.length !== n) throw new Error(`${t.name}: columns added in layout v${to} must be the last columns`);
      reqs.push({ updateSheetProperties: { properties: { sheetId, gridProperties: { columnCount: Math.max(26, n) } }, fields: 'gridProperties.columnCount' } });
      vals.push({ range: `${t.name}!${colLetter(first)}1:${colLetter(n - 1)}1`, values: [added.map(([c]) => `'${c.key}`)] });
      reqs.push({
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: first, endColumnIndex: n },
          cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColorStyle: { rgbColor: HEADER_BG } } },
          fields: 'userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColorStyle',
        },
      });
      reqs.push({
        addProtectedRange: {
          protectedRange: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: first, endColumnIndex: n },
            description: 'Column keys used by Claude. Do not rename or reorder.',
            warningOnly: true,
          },
        },
      });
    }
    t.columns.forEach((c, i) => {
      if (c.options && (c.since === to || c.options_changed === to)) reqs.push(validation(sheetId, i, c.options));
    });
  });
  // Per-version extras: v2 rewrites the main Dashboard block; v3 adds the brief block beside it.
  if (to === 2) vals.push({ range: 'Dashboard!A1:W3', values: dashboard });
  if (to === 3) {
    vals.push(briefDashboard);
    reqs.push(briefDashboardWiden, briefDashboardBold);
  }
  const newConfig = { 2: RESEARCH_CONFIG, 3: BRIEF_CONFIG, 4: CREATIVE_CONFIG, 5: SCRIPT_CONFIG }[to] ?? [];
  return { from, to, batch_requests: reqs, values: vals, append: [{ range: 'Config!A1', values: newConfig.map(([k, v]) => [`'${k}`, v]) }] };
}

const out = {
  $comment: 'GENERATED by scripts/build-sheet-setup.mjs from sheet-layout.json. Do not edit by hand. Send batch_requests in one batch update, then each values entry with update values. Replace <SPREADSHEET_ID>, <DRIVE_FOLDER_ID> and <NOW> (ISO timestamp, prefixed with an apostrophe) in the Config values before sending. Send the Config!D1:E1 clock entry first and read E1 back to get <NOW>. upgrades: steps for sheets built with an older layout (google-sheets.md §7).',
  layout_version: layout.version,
  batch_requests: requests,
  values,
  upgrades: [upgrade(1, 2), upgrade(2, 3), upgrade(3, 4), upgrade(4, 5)],
};
const text = JSON.stringify(out, null, 1) + '\n';

if (process.argv.includes('--check')) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (current !== text) {
    console.error('sheet-setup.json is stale: run node scripts/build-sheet-setup.mjs');
    process.exit(1);
  }
  console.log('sheet-setup.json is up to date');
} else {
  fs.writeFileSync(OUT, text);
  console.log(`Wrote ${path.relative(ROOT, OUT)}: ${requests.length} batch requests, ${values.length} value ranges`);
}
