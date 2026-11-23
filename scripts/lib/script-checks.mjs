// Consistency checks for script and localised_script records (validator check 13, and the
// script-localise eval runners). Pace numbers come from the machine-readable block in
// plugins/social-media-manager/library/knowledge/voiceover-pacing.md (§9), so there is one source.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PACING_MD = path.join(ROOT, 'plugins', 'social-media-manager', 'library', 'knowledge', 'voiceover-pacing.md');
const EPS = 0.051;

export function loadPacing(file = PACING_MD) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/```json pace-defaults\r?\n([\s\S]*?)```/);
  if (!m) throw new Error('voiceover-pacing.md: no ```json pace-defaults block');
  return JSON.parse(m[1]);
}

// ── Spoken word counting (voiceover-pacing.md §3) ────────────────────
const HI_UNITS = 1; // every number 0-100 is one word in Hindi ("ninyanve", "pachchees")
function hindiNumberWords(n) {
  if (!Number.isFinite(n) || n < 0) return 1;
  n = Math.floor(n);
  if (n <= 100) return HI_UNITS;
  let words = 0;
  const crore = Math.floor(n / 1e7); n %= 1e7;
  const lakh = Math.floor(n / 1e5); n %= 1e5;
  const thousand = Math.floor(n / 1e3); n %= 1e3;
  const hundred = Math.floor(n / 100); n %= 100;
  if (crore) words += hindiNumberWords(crore) + 1;
  if (lakh) words += 2;
  if (thousand) words += 2;
  if (hundred) words += 2;
  if (n) words += 1;
  return words;
}
function englishNumberWords(n) {
  if (!Number.isFinite(n) || n < 0) return 1;
  n = Math.floor(n);
  const under100 = (x) => (x === 0 ? 0 : x <= 20 || x % 10 === 0 ? 1 : 2);
  let words = 0;
  for (const [unit, size] of [[1e9, 1], [1e6, 1], [1e3, 1]]) {
    const q = Math.floor(n / unit);
    if (q) { words += englishNumberWords(q) + size; n %= unit; }
  }
  const h = Math.floor(n / 100); n %= 100;
  if (h) words += 2;
  words += under100(n);
  return Math.max(words, 1);
}

const MARK_RE = /\[pause\s+([0-9.]+)\s*s\]/gi;
export function markedPauseSec(text) {
  let s = 0;
  for (const m of String(text || '').matchAll(MARK_RE)) s += Number(m[1]) || 0;
  return s;
}

export function spokenWords(text, language = 'Hinglish') {
  const hindiish = language !== 'English';
  const clean = String(text || '')
    .replace(MARK_RE, ' ')
    .replace(/[*/]/g, ' ')
    .replace(/(\d),(?=\d)/g, '$1');
  let count = 0;
  for (const raw of clean.split(/\s+/)) {
    const tok = raw.replace(/^[^\p{L}\p{N}₹]+|[^\p{L}\p{N}%]+$/gu, '');
    if (!tok) continue;
    const num = tok.match(/^₹?(\d+(?:\.\d+)?)(%)?$/);
    if (num) {
      const n = Number(num[1]);
      count += (hindiish ? hindiNumberWords(n) : englishNumberWords(n)) + (num[2] ? 1 : 0);
      continue;
    }
    if (/^\p{P}+$/u.test(tok)) continue;
    count += 1;
  }
  return count;
}

const cardWords = (t) => String(t).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const near = (a, b) => Math.abs(a - b) <= EPS;

// ── Scene table (shared by script versions and downstream) ───────────
function checkScenes(scenes, { duration, language, pacing, where, err, overrides = {} }) {
  if (!Array.isArray(scenes) || !scenes.length) { err(`${where}: no scenes`); return; }
  const pace = overrides[language]?.words_per_sec ?? null;
  const hardMax = Math.max(pacing.words_per_sec[language]?.hard_max ?? 3.0, pace ?? 0);
  scenes.forEach((s, i) => {
    const at = `${where} scene ${s.n}`;
    if (s.n !== i + 1) err(`${at}: scenes must be numbered 1..${scenes.length} in order`);
    if (i === 0 && !near(s.start_sec, 0)) err(`${at}: first scene must start at 0`);
    if (i > 0 && !near(s.start_sec, scenes[i - 1].end_sec)) err(`${at}: starts at ${s.start_sec}, previous ends at ${scenes[i - 1].end_sec} (no gaps or overlaps)`);
    const len = s.end_sec - s.start_sec;
    if (!(len > 0)) err(`${at}: end_sec must be after start_sec`);
    if (s.visual_action) {
      const maxLen = s.visual_action.camera === 'static' ? pacing.scene_max_sec.static : pacing.scene_max_sec.moving;
      if (len > maxLen + EPS) err(`${at}: ${len.toFixed(1)} s with one ${s.visual_action.camera} shot (max ${maxLen} s: split it, a pattern change is due)`);
    }
    if (i === 0 && s.beat_role && s.beat_role !== 'hook') err(`${at}: the first scene must be the hook`);
    const words = spokenWords(s.vo_line, language);
    const secs = len - markedPauseSec(s.vo_line);
    if (words && secs > 0 && words / secs > hardMax + 1e-9) err(`${at}: ${words} spoken words in ${secs.toFixed(1)} s = ${(words / secs).toFixed(2)} words/s (hard max ${hardMax} for ${language})`);
    if (i === 0 && words) {
      const hookEnd = pacing.hook_line_end_sec;
      if (s.end_sec > hookEnd + EPS && words / Math.min(secs, hookEnd) > hardMax) err(`${at}: hook line can't be said by ${hookEnd} s`);
    }
    for (const c of s.on_screen_text || []) {
      if (!(c.out_sec > c.in_sec)) err(`${at}: card "${c.text}" out_sec must be after in_sec`);
      if (c.in_sec < s.start_sec - EPS || c.out_sec > s.end_sec + EPS) err(`${at}: card "${c.text}" (${c.in_sec}-${c.out_sec}) runs outside the scene (${s.start_sec}-${s.end_sec})`);
      const need = Math.max(pacing.card_min_sec, cardWords(c.text) / pacing.card_words_per_sec + pacing.card_lead_sec);
      if (c.out_sec - c.in_sec + EPS < need) err(`${at}: card "${c.text}" is up ${(c.out_sec - c.in_sec).toFixed(1)} s; needs ${need.toFixed(1)} s to read`);
    }
    if (language !== 'English') {
      for (const [k, v] of [['vo_line', s.vo_line], ...(s.on_screen_text || []).map((c) => ['card', c.text])]) if (/[—–]/.test(v || '')) err(`${at}: ${k} has a dash (none in ${language}; ai-tells.md §2)`);
    }
  });
  const last = scenes.at(-1);
  if (duration != null && !near(last.end_sec, duration)) err(`${where}: last scene ends at ${last.end_sec}, duration is ${duration}`);
}

function checkCaption(cap, { language, where, err }) {
  if (!cap) return;
  if (!String(cap.full_text).startsWith(cap.first_line)) err(`${where}: caption full_text must start with first_line`);
  for (const h of cap.hashtags || []) if (!String(cap.full_text).includes(h)) err(`${where}: hashtag ${h} missing from full_text`);
  const dashes = (String(cap.full_text).match(/—/g) || []).length;
  if (language !== 'English' && dashes) err(`${where}: caption has an em dash (none in ${language})`);
  if (language === 'English' && dashes > 1) err(`${where}: caption has ${dashes} em dashes (max 1)`);
}

// ── script record ────────────────────────────────────────────────────
export function scriptConsistency(rec, { pacing = loadPacing(), where = 'script', config = {} } = {}) {
  const errors = [];
  const err = (m) => errors.push(m);
  if (!rec || rec.placeholder === true || !Array.isArray(rec.versions)) return errors;
  const ids = rec.versions.map((v) => v.id);
  if (new Set(ids).size !== ids.length) err(`${where}: version ids must be unique`);
  const types = rec.versions.map((v) => v.structure_type);
  if (new Set(types).size !== types.length) err(`${where}: versions must use different structure_type`);
  const overrides = config.pace_overrides || {};
  for (const v of rec.versions) {
    const w = `${where} version ${v.id}`;
    checkScenes(v.scenes, { duration: v.duration_sec, language: rec.language, pacing, where: w, err, overrides });
    const ns = new Set(v.scenes.map((s) => s.n));
    if (!ns.has(v.checks?.payoff_scene)) err(`${w}: payoff_scene ${v.checks?.payoff_scene} is not a scene`);
    if (!ns.has(v.cta?.shown_in_scene)) err(`${w}: cta.shown_in_scene ${v.cta?.shown_in_scene} is not a scene`);
    if (v.cta?.said_in_scene != null && !ns.has(v.cta.said_in_scene)) err(`${w}: cta.said_in_scene ${v.cta.said_in_scene} is not a scene`);
    if (!v.scenes.some((s) => s.beat_role === 'cta')) err(`${w}: no cta scene`);
    if (!v.scenes.some((s) => s.beat_role === 'payoff')) err(`${w}: no payoff scene`);
    checkCaption(v.caption, { language: rec.language, where: w, err });
  }
  if (rec.recommended && !ids.includes(rec.recommended.version_id)) err(`${where}: recommended ${rec.recommended.version_id} is not a version`);
  const pick = rec.pick || {};
  if (pick.status === 'picked') {
    if (!ids.includes(pick.version_id)) err(`${where}: pick ${pick.version_id} is not a version`);
    const d = rec.downstream;
    if (!d) err(`${where}: picked but downstream is empty`);
    else {
      if (d.version_id !== pick.version_id) err(`${where}: downstream.version_id ${d.version_id} != pick ${pick.version_id}`);
      checkScenes(d.scenes, { duration: d.duration_sec, language: d.language, pacing, where: `${where} downstream`, err, overrides });
      const ns = d.scenes.map((s) => s.n).join(',');
      if ((d.shot_list_seed || []).map((s) => s.n).join(',') !== ns) err(`${where}: downstream.shot_list_seed scenes don't match the scene table`);
      if ((d.audio_cues || []).map((s) => s.n).join(',') !== ns) err(`${where}: downstream.audio_cues scenes don't match the scene table`);
      (d.audio_cues || []).forEach((a) => {
        const s = d.scenes.find((x) => x.n === a.n);
        if (s && (!near(a.start_sec, s.start_sec) || !near(a.end_sec, s.end_sec) || a.vo_line !== s.vo_line)) err(`${where}: downstream.audio_cues[${a.n}] differs from scene ${a.n}`);
      });
      if (!d.scenes.some((s) => s.n === d.cta?.shown_in_scene)) err(`${where}: downstream cta.shown_in_scene is not a scene`);
      checkCaption(d.caption, { language: d.language, where: `${where} downstream`, err });
    }
  } else if (rec.downstream) err(`${where}: downstream must be null until pick.status is picked`);
  return errors;
}

// ── SRT ──────────────────────────────────────────────────────────────
const TS = /^(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})$/;
const toSec = (h, m, s, ms) => Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;
export function parseSrt(text) {
  const blocks = String(text || '').replace(/\r/g, '').trim().split(/\n{2,}/);
  return blocks.map((b) => {
    const lines = b.split('\n');
    const m = (lines[1] || '').match(TS);
    return { index: Number(lines[0]), start: m ? toSec(...m.slice(1, 5)) : NaN, end: m ? toSec(...m.slice(5, 9)) : NaN, lines: lines.slice(2), raw: b };
  });
}

// ── localised_script record ──────────────────────────────────────────
export function localisedConsistency(loc, { script = null, pacing = loadPacing(), where = 'localised_script', config = {} } = {}) {
  const errors = [];
  const err = (m) => errors.push(m);
  if (!loc || loc.placeholder === true || !Array.isArray(loc.scenes)) return errors;
  const lang = loc.language;
  const down = script && !script.placeholder ? script.downstream : null;
  const checkOne = (L, w) => {
    const dur = down?.duration_sec ?? L.scenes.at(-1)?.end_sec;
    checkScenes(L.scenes, { duration: dur, language: L.language, pacing, where: w, err, overrides: config.pace_overrides || {} });
    if (down) {
      if (L.scenes.length !== down.scenes.length) err(`${w}: ${L.scenes.length} scenes, the picked script has ${down.scenes.length}`);
      L.scenes.forEach((s) => {
        const o = down.scenes.find((x) => x.n === s.n);
        if (o && (!near(o.start_sec, s.start_sec) || !near(o.end_sec, s.end_sec))) err(`${w} scene ${s.n}: times differ from the picked script (${o.start_sec}-${o.end_sec})`);
      });
    }
    const sceneOf = (t) => L.scenes.find((s) => t >= s.start_sec - EPS && t < s.end_sec - 1e-6);
    for (const line of L.vo_script?.lines || []) {
      const s = L.scenes.find((x) => x.n === line.n);
      if (!s) { err(`${w}: vo_script line ${line.n} has no scene`); continue; }
      if (!near(line.start_sec, s.start_sec) || !near(line.end_sec, s.end_sec)) err(`${w}: vo_script line ${line.n} times differ from scene ${s.n}`);
      if (/\[pause|\*|\//.test(line.tts_text)) err(`${w}: vo_script line ${line.n} tts_text still has marks`);
    }
    const srt = L.captions_srt;
    if (srt) {
      const cues = parseSrt(srt.srt);
      const maxChars = Math.min(srt.max_chars_per_line, config.caption_max_chars_per_line ?? srt.max_chars_per_line);
      if (srt.max_chars_per_line > (config.caption_max_chars_per_line ?? Infinity)) err(`${w}: captions_srt.max_chars_per_line ${srt.max_chars_per_line} > config ${config.caption_max_chars_per_line}`);
      if (cues.length !== srt.cues) err(`${w}: SRT has ${cues.length} cues, record says ${srt.cues}`);
      cues.forEach((c, i) => {
        const at = `${w} SRT cue ${i + 1}`;
        if (c.index !== i + 1) err(`${at}: index must be ${i + 1}`);
        if (!Number.isFinite(c.start)) { err(`${at}: bad timestamp line`); return; }
        if (!(c.end > c.start)) err(`${at}: end must be after start`);
        if (i > 0 && c.start < cues[i - 1].end - 1e-6) err(`${at}: overlaps the previous cue`);
        const d = c.end - c.start;
        if (d < pacing.srt.min_cue_sec - 1e-6 || d > pacing.srt.max_cue_sec + 1e-6) err(`${at}: lasts ${d.toFixed(2)} s (${pacing.srt.min_cue_sec}-${pacing.srt.max_cue_sec} s)`);
        const s1 = sceneOf(c.start + 0.01);
        if (!s1 || c.end > s1.end_sec + EPS) err(`${at}: must sit inside one scene`);
        if (!c.lines.length || c.lines.length > pacing.srt.max_lines) err(`${at}: ${c.lines.length} lines (1-${pacing.srt.max_lines})`);
        for (const l of c.lines) if ([...l].length > maxChars) err(`${at}: line "${l}" is ${[...l].length} characters (max ${maxChars})`);
        const cps = c.lines.join(' ').length / d;
        if (cps > pacing.srt.max_chars_per_sec + 1e-6) err(`${at}: ${cps.toFixed(1)} characters/s (max ${pacing.srt.max_chars_per_sec})`);
      });
    }
    for (const n of L.numbers_spoken || []) if (!L.scenes.some((s) => s.n === n.scene)) err(`${w}: numbers_spoken "${n.written}" points at scene ${n.scene}, which doesn't exist`);
    if (L.writing_script === 'devanagari' && L.script_check?.status === 'not-needed') err(`${w}: Devanagari output needs script_check verified or unverified`);
    if (L.script_check?.status === 'verified' && L.script_check?.tool !== 'indicxlit') err(`${w}: script_check verified needs tool indicxlit`);
    checkCaption(L.caption_post, { language: L.language, where: w, err });
  };
  checkOne(loc, where);
  (loc.variants || []).forEach((v, i) => {
    if (v.language === lang && v.writing_script === loc.writing_script) err(`${where}: variant ${i + 1} repeats the main language and script`);
    checkOne(v, `${where} variant ${v.language}`);
  });
  const bt = loc.back_translation || {};
  const btOk = bt.meaning_ok && bt.offer_ok && bt.price_ok && bt.cta_ok && !(bt.drift || []).some((d) => !d.fixed);
  if (!btOk && loc.self_check?.passed) err(`${where}: back-translation found drift but self_check passed`);
  // client message carries the exact offer facts (every keep_as_is item with a digit)
  const msg = loc.client_review_message?.text || '';
  for (const k of down?.keep_as_is || []) if (/\d/.test(k) && !msg.includes(k)) err(`${where}: client_review_message is missing "${k}"`);
  if (!/\bOK\b/i.test(msg)) err(`${where}: client_review_message must ask for "OK" to approve`);
  const d = loc.downstream;
  if (d) {
    if ((lang === 'English') !== (d.tts_language_code === 'en-IN')) err(`${where}: downstream.tts_language_code ${d.tts_language_code} doesn't fit ${lang}`);
    const tts = (loc.vo_script?.lines || []).map((l) => `${l.n}:${l.tts_text}`).join('|');
    if ((d.vo_lines || []).map((l) => `${l.n}:${l.tts_text}`).join('|') !== tts) err(`${where}: downstream.vo_lines differ from vo_script tts_text`);
    const cards = loc.scenes.flatMap((s) => (s.on_screen_text || []).map((c) => `${s.n}:${c.text}`)).join('|');
    if ((d.on_screen_cards || []).map((c) => `${c.n}:${c.text}`).join('|') !== cards) err(`${where}: downstream.on_screen_cards differ from the scene cards`);
    if (d.caption_post_text !== loc.caption_post?.full_text) err(`${where}: downstream.caption_post_text differs from caption_post.full_text`);
    const have = new Set((loc.variants || []).map((v) => v.language));
    for (const l of d.variants_available || []) if (!have.has(l)) err(`${where}: downstream lists variant ${l}, which doesn't exist`);
  }
  return errors;
}
