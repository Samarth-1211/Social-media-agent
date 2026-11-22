// Renders the tracker page with the generated sample data in a headless DOM and checks the research panel.
// Usage: npm i --no-save jsdom && node evals/research/tracker-page-render.cjs
const fs = require('fs');
const path = require('path');
let JSDOM;
try { ({ JSDOM } = require('jsdom')); } catch (e) { console.log('SKIP  jsdom not installed (npm i --no-save jsdom)'); process.exit(0); }
const dir = path.resolve(__dirname, '../../plugins/social-media-manager/library/storage/tracker-page');
let failed = 0;
let html = fs.readFileSync(dir + '/index.html', 'utf8');
// test hook in a copy only: expose state and render
html = html.replace('  boot();\n})();', '  window.__t = { state, render };\n  boot();\n})();');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' });
const w = dom.window;
if (!w.__t) { console.log('hook not installed'); process.exit(1); }
const sample = JSON.parse(fs.readFileSync(dir + '/sample-data.json', 'utf8'));
const { state, render } = w.__t;
state.raw = sample.tabs; state.errors = {}; state.source = 'mock';
const out = {};
for (const [view, client] of [['clients', null], ['clients', 'shubh-laundry'], ['clients', 'narmada-heights'], ['credits', null], ['jobs', null]]) {
  state.view = view; state.client = client; render();
  out[view + (client ? ':' + client : '')] = w.document.getElementById('main').textContent.replace(/\s+/g, ' ');
}
const show = (k, re) => { const t = out[k]; const m = t.match(re); if (!m) failed++;
  console.log(`${m ? 'OK  ' : 'MISS'} ${k}: ${re}${m ? '  →  …' + t.slice(Math.max(0, m.index - 10), m.index + 110) + '…' : ''}`); };
show('clients', /research \d+ days old/);
show('clients', /Instagram read pending/);
show('clients:shubh-laundry', /Latest insights/);
show('clients:shubh-laundry', /SHL-I202611-1/);
show('clients:shubh-laundry', /4\.2x · IG9/);
show('clients:shubh-laundry', /zari kharab ho gayi \(Hinglish\)/);
show('clients:narmada-heights', /Instagram read pending \(ig-outlier-read, ig-hook-classify\)/);
show('clients:narmada-heights', /Instagram read \(~10 min, needs browser\)/);
show('credits', /Higgsfield credits only/);
console.log('struck competitor hidden:', !out['clients:shubh-laundry'].includes('ex_bhopal_laundromat'));
console.log('jobs view renders:', out.jobs.includes('NRH-01'));
if (out['clients:shubh-laundry'].includes('ex_bhopal_laundromat') || !out.jobs.includes('NRH-01') || /[object Object]/.test(Object.values(out).join(' '))) failed++;
process.exit(failed ? 1 : 0);
