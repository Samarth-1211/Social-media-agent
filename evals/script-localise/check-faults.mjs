#!/usr/bin/env node
// Planted-fault test for validator check 13 (scripts/lib/script-checks.mjs). Offline: no Claude, no network.
// Takes the contract examples (script + localised_script for SHL-01), plants one fault at a time and
// expects the checks to catch every one. Usage: node evals/script-localise/check-faults.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scriptConsistency, localisedConsistency, spokenWords } from '../../scripts/lib/script-checks.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const EX = path.join(ROOT, 'plugins', 'social-media-manager', 'library', 'contracts', 'examples');
const ex = (n) => JSON.parse(fs.readFileSync(path.join(EX, `${n}.example.json`), 'utf8'));
const cfg = ex('config');

const scriptFaults = [
  ['over-length voiceover', (s) => { s.versions[0].scenes[1].vo_line = 'Mehmaan aane wale hain aur aapke curtain abhi bhi pichhli Diwali wale purane hain kya?'; }],
  ['gap between scenes', (s) => { s.versions[0].scenes[2].start_sec = 5.9; }],
  ['card outside its scene', (s) => { s.versions[0].scenes[3].on_screen_text[0].out_sec = 12; }],
  ['card too short to read', (s) => { s.versions[0].scenes[4].on_screen_text[0].in_sec = 13.0; }],
  ['payoff scene missing', (s) => { s.versions[1].checks.payoff_scene = 9; }],
  ['same structure twice', (s) => { s.versions[1].structure_type = 'before-after'; }],
  ['downstream not the picked version', (s) => { s.downstream.version_id = 'B'; }],
  ['audio cue drifts from its scene', (s) => { s.downstream.audio_cues[2].vo_line = 'changed'; }],
  ['em dash in Hinglish', (s) => { s.versions[0].scenes[0].vo_line = 'Diwali se pehle — 20% off.'; }],
  ['duration mismatch', (s) => { s.versions[0].duration_sec = 25; }],
  ['static scene too long', (s) => { const v = s.versions[0].scenes; v[6].start_sec = 15; v[5].end_sec = 15; }],
  ['hashtag missing from caption text', (s) => { s.versions[0].caption.hashtags[0] = '#NotInText'; }],
  ['downstream while pick pending', (s) => { s.pick.status = 'pending'; }],
];
const locFaults = [
  ['SRT line too long', (l) => { l.captions_srt.srt = l.captions_srt.srt.replace('Dono pe 20% off, 25 Nov tak.', 'Dono pe 20% off milega, 25 November tak sirf.'); }],
  ['SRT cue crosses scenes', (l) => { l.captions_srt.srt = l.captions_srt.srt.replace('00:00:10,800 --> 00:00:13,600', '00:00:10,800 --> 00:00:14,600'); }],
  ['client message missing the price', (l) => { l.client_review_message.text = l.client_review_message.text.replace('₹299', 'kuch amount'); }],
  ['client message with a phone number', (l) => { l.client_review_message.text += '\nCall: 98260 12345'; }],
  ['client message without the OK ask', (l) => { l.client_review_message.text = l.client_review_message.text.replace('Reply OK to approve, or tell us what to change.', 'Batana.'); }],
  ['TTS text still has marks', (l) => { l.vo_script.lines[0].tts_text += ' [pause 0.2s]'; }],
  ['scene times drift from the script', (l) => { l.scenes[2].end_sec = 8.6; l.scenes[3].start_sec = 8.6; }],
  ['back-translation drift but passed', (l) => { l.back_translation.price_ok = false; }],
  ['Devanagari without a script check', (l) => { l.writing_script = 'devanagari'; }],
  ['SRT cue count wrong', (l) => { l.captions_srt.cues = 6; }],
  ['downstream TTS differs', (l) => { l.downstream.vo_lines[1].tts_text = 'kuch aur'; }],
];

let caught = 0;
let total = 0;
for (const [name, f] of scriptFaults) {
  const s = ex('script'); f(s); total++;
  const e = scriptConsistency(s, { config: cfg });
  console.log(`${e.length ? 'CAUGHT' : 'MISSED'}  script: ${name}${e.length ? `  (${e[0]})` : ''}`);
  if (e.length) caught++;
}
for (const [name, f] of locFaults) {
  const l = ex('localised_script'); f(l); total++;
  const e = localisedConsistency(l, { script: ex('script'), config: cfg });
  console.log(`${e.length ? 'CAUGHT' : 'MISSED'}  localised: ${name}${e.length ? `  (${e[0]})` : ''}`);
  if (e.length) caught++;
}
// clean copies must pass
const clean = [...scriptConsistency(ex('script'), { config: cfg }), ...localisedConsistency(ex('localised_script'), { script: ex('script'), config: cfg })];
console.log(clean.length ? `FAIL  clean examples report: ${clean[0]}` : 'PASS  clean examples');
// spoken word counting
const counts = [['₹1,499 ka 20% off, 25 Nov tak', 'Hinglish', 12], ['₹45 lakh onwards', 'Hindi', 3], ['299 dollars', 'English', 5], ['Pickup free, ₹299 se upar. [pause 0.3s]', 'Hinglish', 7]];
let countOk = 0;
for (const [t, lang, want] of counts) { const got = spokenWords(t, lang); if (got === want) countOk++; else console.log(`FAIL  spokenWords("${t}") = ${got}, want ${want}`); }
console.log(`\n${caught}/${total} planted faults caught · ${countOk}/${counts.length} word counts right · clean examples ${clean.length ? 'FAIL' : 'pass'}`);
process.exit(caught === total && countOk === counts.length && !clean.length ? 0 : 1);
