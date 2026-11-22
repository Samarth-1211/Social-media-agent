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
// Layout v2 (feat/brief): what an existing v1 database needs, sent by setup.md §Upgrade. New tabs carry `since: 2`.
const upgrade2 = { batch_requests: [], values: [] };
const HEADER_BG = { red: 0.85, green: 0.92, blue: 1 };

layout.tabs.forEach((t, sheetId) => {
  const reqBefore = requests.length;
  const valBefore = values.length;
  if (sheetId > 0) {
    const cols = Math.max(26, t.columns?.length ?? 0);
    requests.push({ addSheet: { properties: { sheetId, title: t.name, gridProperties: { rowCount: 1000, columnCount: cols } } } });
  }
  if (!t.columns) return;
  const n = t.columns.length;
  values.push({ range: `${t.name}!A1:${colLetter(n - 1)}1`, values: [t.columns.map((c) => `'${c.key}`)] });
  requests.push({ updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } });
  requests.push({
    repeatCell: {
      range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: n },
      cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColorStyle: { rgbColor: HEADER_BG } } },
      fields: 'userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColorStyle',
    },
  });
  requests.push({
    addProtectedRange: {
      protectedRange: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: n },
        description: 'Column keys used by Claude. Do not rename or reorder.',
        warningOnly: true,
      },
    },
  });
  t.columns.forEach((c, i) => {
    if (!c.options) return;
    requests.push({
      setDataValidation: {
        range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: i, endColumnIndex: i + 1 },
        rule: { condition: { type: 'ONE_OF_LIST', values: c.options.map((o) => ({ userEnteredValue: o })) }, strict: true, showCustomUi: true },
      },
    });
  });
  if (t.since === 2) {
    upgrade2.batch_requests.push(...requests.slice(reqBefore));
    upgrade2.values.push(...values.slice(valBefore));
  }
});
// v2 widened one dropdown: Gates.decided_by_role gains "system". Re-send that column's rule on upgrade.
{
  const sheetId = layout.tabs.findIndex((t) => t.name === 'Gates');
  const i = tab('Gates').columns.findIndex((c) => c.key === 'decided_by_role');
  upgrade2.batch_requests.push({
    setDataValidation: {
      range: { sheetId, startRowIndex: 1, endRowIndex: 1000, startColumnIndex: i, endColumnIndex: i + 1 },
      rule: { condition: { type: 'ONE_OF_LIST', values: tab('Gates').columns[i].options.map((o) => ({ userEnteredValue: o })) }, strict: true, showCustomUi: true },
    },
  });
}

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
    q(credRange, `"select ${C('client_id')}, sum(${C('amount')}) where ${C('at')} starts with '"&${month}&"' group by ${C('client_id')} label sum(${C('amount')}) 'credits'"`, 'No credits this month'),
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

// Dashboard, layout v2: brief questions the client hasn't answered within client_question_reminder_hours (default 24).
{
  const B = (k) => col('BriefQuestions', k);
  const bqRange = `BriefQuestions!A:${colLetter(tab('BriefQuestions').columns.length - 1)}`;
  const cutoff = 'NOW()-IFERROR(VLOOKUP("client_question_reminder_hours",Config!A:B,2,FALSE),24)/24';
  const cutoffText = `TEXT(${cutoff},"yyyy-mm-dd")&"T"&TEXT(${cutoff},"HH:mm:ss")`;
  const block = [
    ['Brief: waiting for client reply', '', '', ''],
    [q(bqRange, `"select ${B('job_id')},${B('n')},${B('question')},${B('asked_at')} where ${B('status')}='open' and ${B('asked_at')} <> '' and ${B('asked_at')} < '"&${cutoffText}&"+05:30' order by ${B('asked_at')}"`, 'No client replies pending'), '', '', ''],
  ];
  const entry = { range: 'Dashboard!X2:AA3', values: block };
  const bold = {
    repeatCell: {
      range: { sheetId: 0, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 23, endColumnIndex: 27 },
      cell: { userEnteredFormat: { textFormat: { bold: true } } },
      fields: 'userEnteredFormat.textFormat.bold',
    },
  };
  values.push(entry);
  requests.push(bold);
  upgrade2.values.push(entry);
  upgrade2.batch_requests.push(bold);
}

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
  ['version', 1],
  ['updated_at', '<NOW>'],
].map(([k, v]) => [`'${k}`, v]);
values.push({ range: `Config!A2:B${configRows.length + 1}`, values: configRows });
// Config defaults added in layout v2 (brief). On upgrade they are appended after the last Config row instead.
const briefConfigRows = [
  ['brief_auto_approve_repeat', false],
  ['brief_max_questions', 5],
  ['client_question_reminder_hours', 24],
].map(([k, v]) => [`'${k}`, v]);
values.push({ range: `Config!A${configRows.length + 2}:B${configRows.length + 1 + briefConfigRows.length}`, values: briefConfigRows });
upgrade2.values.push({ append: true, range: 'Config!A1', values: briefConfigRows });

// Clock cell (google-sheets.md §1a): get_now rewrites E1 with this formula, then reads it back.
export const CLOCK_FORMULA = '=TEXT(NOW(),"yyyy-mm-dd")&"T"&TEXT(NOW(),"HH:mm:ss")&"+05:30"';
values.push({ range: 'Config!D1:E1', values: [["'clock (do not edit)", CLOCK_FORMULA]] });

const out = {
  $comment: 'GENERATED by scripts/build-sheet-setup.mjs from sheet-layout.json. Do not edit by hand. Send batch_requests in one batch update, then each values entry with update values. Replace <SPREADSHEET_ID>, <DRIVE_FOLDER_ID> and <NOW> (ISO timestamp, prefixed with an apostrophe) in the Config values before sending. Send the Config!D1:E1 clock entry first and read E1 back to get <NOW>.',
  layout_version: layout.version,
  batch_requests: requests,
  values,
  upgrades: {
    2: {
      $comment: 'Layout v1 → v2 (brief). For an existing database whose layout is v1: send batch_requests in one batch update, then each values entry (entries with append: true go through append values). Adds the BriefQuestions tab, the Dashboard block and the brief Config rows, and widens the Gates decided_by_role dropdown. Nothing existing is moved or deleted.',
      batch_requests: upgrade2.batch_requests,
      values: upgrade2.values,
    },
  },
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
