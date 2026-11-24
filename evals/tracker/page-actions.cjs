// Tracker page, layout v6: renders every view and project tab with the sample data, then drives the decision buttons
// and checks the exact Actions row the page would append (column order from sheet-layout.json, valid against
// action.schema.json once decoded the way Sheets returns it).
// Usage: npm i --no-save jsdom && node evals/tracker/page-actions.cjs
const fs = require('fs');
const path = require('path');
let JSDOM;
try { ({ JSDOM } = require('jsdom')); } catch (e) { console.log('SKIP  jsdom not installed (npm i --no-save jsdom)'); process.exit(0); }
const ROOT = path.resolve(__dirname, '../..');
const PLUGIN = path.join(ROOT, 'plugins/social-media-manager');
const dir = path.join(PLUGIN, 'library/storage/tracker-page');
const layout = JSON.parse(fs.readFileSync(path.join(PLUGIN, 'library/storage/sheet-layout.json'), 'utf8'));
const actionCols = layout.tabs.find((t) => t.name === 'Actions').columns;

let failed = 0; let passed = 0;
const ok = (cond, label, extra = '') => { if (cond) passed++; else failed++; console.log(`${cond ? 'OK  ' : 'FAIL'} ${label}${extra ? '  ' + extra : ''}`); };

let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
html = html.replace('  boot();\n})();', '  window.__t = { state, render, setMcp: (x) => { mcpRef = x; } };\n  boot();\n})();');
const errors = [];
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' });
const w = dom.window;
w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = function () {};
w.addEventListener('error', (e) => errors.push(e.message));
const { state, render } = w.__t;
const sample = JSON.parse(fs.readFileSync(path.join(dir, 'sample-data.json'), 'utf8'));
state.raw = sample.tabs; state.errors = {}; state.source = 'sample'; state.sampleReason = null;
const main = () => w.document.getElementById('main');
const text = () => main().textContent.replace(/\s+/g, ' ');
const go = (hash) => { w.location.hash = hash; w.dispatchEvent(new w.HashChangeEvent('hashchange')); };
const bad = (t) => /\[object Object\]|undefined|NaN/.test(t);
const click = (sel) => { const el = main().querySelector(sel); if (!el) throw new Error('no element ' + sel); el.click(); };
const type = (sel, v) => { const el = main().querySelector(sel); el.value = v; el.dispatchEvent(new w.Event('input')); };

// 1. Every view and every tab of every job renders without stray values
state.me = 'ravi';
for (const v of ['today', 'jobs', 'clients', 'client-shubh-laundry', 'client-narmada-heights', 'new', 'activity', 'credits', 'guide']) {
  go(v); const t = text(); ok(t.length > 50 && !bad(t), `view ${v} renders`, bad(t) ? (t.match(/.{40}(\[object Object\]|undefined|NaN).{20}/) || [''])[0] : '');
}
const jobIds = [...new Set(sample.tabs.Jobs.slice(1).map((r) => r[0]))];
for (const id of jobIds) {
  go('job-' + id);
  const tabs = [...main().querySelectorAll('[data-ptab]')].map((b) => b.dataset.ptab);
  for (const tab of tabs) { state.ptab = tab; render(); const t = text(); ok(!bad(t), `${id} tab ${tab}`, bad(t) ? (t.match(/.{40}(\[object Object\]|undefined|NaN).{20}/) || [''])[0] : ''); }
}
ok(errors.length === 0, 'no script errors', errors.join(' | '));

// 2. Content: the script pick shows A and B, the client gate shows the WhatsApp message
go('job-SHL-04'); state.ptab = 'script'; render();
ok(/Wahi sofa, wash ke baad/.test(text()) && /Ek WhatsApp, chaar steps/.test(text()), 'SHL-04 script tab shows versions A and B');
ok(/Pick script A or B/.test(text()), 'SHL-04 decision box asks for the script pick');
ok(main().querySelector('input[data-ui="version"][value="A"]').checked, 'recommended version A is preselected');
go('job-SHL-01'); state.ptab = 'language'; render();
ok(/Namaste Neha ji/.test(text()) && /bees percent/.test(text()), 'SHL-01 language tab shows the review message and VO');
ok(/Record the client's reply on the script/.test(text()), 'SHL-01 decision box is the client reply');

// 3. Permissions: Pooja (designer) can't pick SHL-04's script; nobody chosen can't act
state.me = 'pooja'; go('job-SHL-04');
ok(/This one is for Ravi/.test(text()) && !main().querySelector('[data-send]'), 'designer gets no buttons on an editor gate');
state.me = ''; render();
ok(/Choose who you are/.test(text()), 'no buttons until someone is chosen');

// 4. Sample mode: a click is kept locally and marked "sample only"
state.me = 'ravi'; go('job-SHL-04');
click('[data-send="pick-script"]');
ok(/sample only/.test(text()) && /Script pick/.test(text()), 'sample click shows as sent (sample only)');

// 5. Live mode: the appended row, decoded as Sheets returns it, is a valid action
const calls = [];
w.__t.setMcp({ callTool: async (server, tool, input) => { calls.push({ server, tool, input }); return { payload: {} }; }, invalidate: async () => {} });
state.source = 'live'; state.local = []; state.ui = {};
const flush = () => new Promise((r) => setTimeout(r, 0));
(async () => {
  go('job-SHL-04'); type('textarea[data-ui="edit"]', 'scene 7 line: WhatsApp karo, pickup hum karenge'); click('[data-send="pick-script"]'); await flush();
  go('job-SHL-01'); click('[data-send="client-approved"]'); await flush();
  ok(/Paste the client's reply first/.test(text()), 'client approved needs the reply pasted');
  type('textarea[data-ui="reply"]', 'Haan theek hai, chala do'); click('[data-send="client-approved"]'); await flush();
  state.me = 'samarth'; go('job-SHL-04');
  ok(/Script pick/.test(text()) && /waiting for Claude/.test(text()), 'a queued click hides the buttons for that gate');
  go('new'); const f = main().querySelector('#newjob');
  const setNj = (k, v) => { const el = f.querySelector(`[data-nj="${k}"]`); el.value = v; el.dispatchEvent(new w.Event('change')); };
  setNj('client', 'narmada-heights'); setNj('request', 'Republic Day site-visit reel'); setNj('deadline', '2027-01-20');
  f.dispatchEvent(new w.Event('submit', { cancelable: true })); await flush();
  ok(/Sent: new video for Narmada Heights/.test(text()), 'new job form sends and confirms');

  ok(calls.length === 3 && calls.every((c) => c.tool === 'append_values' && c.input.range === 'Actions!A1'), `3 rows appended to Actions!A1 (got ${calls.length})`);
  // decode like get_values: apostrophe dropped, numbers as strings, json parsed
  const Ajv = require('ajv/dist/2020').default; const addFormats = require('ajv-formats');
  const ajv = new Ajv({ strict: false, allErrors: true }); addFormats(ajv);
  const v = ajv.compile(JSON.parse(fs.readFileSync(path.join(PLUGIN, 'library/contracts/action.schema.json'), 'utf8')));
  for (const c of calls) {
    const row = c.input.values[0];
    ok(row.length === actionCols.length, `row has ${actionCols.length} columns in layout order`);
    const rec = {};
    actionCols.forEach((col, i) => {
      const cell = row[i]; if (cell === '' || cell === undefined) return;
      const s = typeof cell === 'string' ? cell.replace(/^'/, '') : cell;
      rec[col.key] = col.type === 'json' ? JSON.parse(s) : col.type === 'integer' ? Number(s) : s;
    });
    ok(v(rec), `${rec.kind} row is a valid action`, v.errors ? JSON.stringify(v.errors) : '');
  }
  const kinds = calls.map((c) => c.input.values[0][3].replace(/^'/, ''));
  ok(kinds.join(',') === 'pick-script,client-approved,new-job', 'kinds in click order', kinds.join(','));
  const pick = calls[0].input.values[0];
  ok(pick[2] === "'ravi" && JSON.parse(pick[7].slice(1)).script === 1 && /scene 7 line/.test(pick[8]), 'pick row carries who, the version shown and the edit');
  ok(errors.length === 0, 'still no script errors', errors.join(' | '));
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
