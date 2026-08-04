/* ---------------------------------------------------------------
   Motor de audio compartido — extraído de los 3 prototipos.

   Dos primitivas, sin archivos externos ni dependencias:
     1. speakQueue(lista, lang) sobre SpeechSynthesis
     2. tone(...) sobre Web Audio API → chimes

   Diferencia con los prototipos: acá soporta dos idiomas.
     - Track A (inglés): sólo se pronuncia el vocabulario objetivo.
     - Track B (español): se narran instrucciones completas.
   Cada idioma elige su propia voz; no se comparten.
   --------------------------------------------------------------- */

import { getMuted, setMuted as persistMuted } from './storage.js';

/** Locales preferidos por idioma, en orden. Se cae al primer 'xx-*' que exista. */
const VOICE_PREFS = {
  en: ['en-us', 'en-gb', 'en-au', 'en-ca', 'en'],
  es: ['es-cl', 'es-419', 'es-mx', 'es-us', 'es-es', 'es']
};

/** Ritmo por idioma: el inglés más lento (palabra suelta), el español algo
    más natural porque son instrucciones que se escuchan como frase. */
const RATE = { en: 0.85, es: 0.92 };
const PITCH = { en: 1.1, es: 1.05 };

const state = {
  ctx: null,
  muted: getMuted(),
  voices: { en: null, es: null },
  voicesLoaded: false
};

const listeners = new Set();

/* ---------------- voces ---------------- */

function scoreVoice(voice, lang) {
  const tag = (voice.lang || '').toLowerCase().replace('_', '-');
  const prefs = VOICE_PREFS[lang];
  for (let i = 0; i < prefs.length; i++) {
    if (tag === prefs[i] || tag.indexOf(prefs[i]) === 0) {
      // Las voces locales suenan sin latencia y funcionan sin red.
      return i * 2 + (voice.localService ? 0 : 1);
    }
  }
  return Infinity;
}

function pickVoice(voices, lang) {
  let best = null;
  let bestScore = Infinity;
  for (const voice of voices) {
    const score = scoreVoice(voice, lang);
    if (score < bestScore) { bestScore = score; best = voice; }
  }
  return best;
}

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || !voices.length) return;
  state.voices.en = pickVoice(voices, 'en');
  state.voices.es = pickVoice(voices, 'es');
  state.voicesLoaded = true;
  listeners.forEach((fn) => fn());
}

if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  // Safari/iOS a veces no dispara onvoiceschanged: reintento acotado.
  let tries = 0;
  const poll = setInterval(() => {
    if (state.voicesLoaded || ++tries > 10) clearInterval(poll);
    else loadVoices();
  }, 300);
}

/* ---------------- habla ---------------- */

function speakQueue(list, lang = 'en') {
  if (state.muted || !('speechSynthesis' in window)) return;
  const items = Array.isArray(list) ? list : [list];
  // Un solo cancel al inicio: las utterances de la lista se encolan
  // sin cortarse entre sí (palabra + refuerzo, ej. "Dog" → "Woof woof!").
  window.speechSynthesis.cancel();
  for (const text of items) {
    if (!text) continue;
    const u = new SpeechSynthesisUtterance(String(text));
    const voice = state.voices[lang];
    u.lang = voice ? voice.lang : (lang === 'es' ? 'es-ES' : 'en-US');
    u.rate = RATE[lang];
    u.pitch = PITCH[lang];
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  }
}

function speak(text, lang = 'en') {
  speakQueue([text], lang);
}

function cancelSpeech() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

/* ---------------- tonos ---------------- */

function unlock() {
  if (!state.ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) state.ctx = new Ctx();
  }
  if (state.ctx && state.ctx.state === 'suspended') state.ctx.resume();
}

function tone(freq, start, dur, type = 'sine', vol = 0.25) {
  if (state.muted || !state.ctx) return;
  const t0 = state.ctx.currentTime + start;
  const osc = state.ctx.createOscillator();
  const gain = state.ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.linearRampToValueAtTime(0, t0 + dur);
  osc.connect(gain).connect(state.ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

function playCorrect() {
  tone(523.25, 0, 0.16);
  tone(659.25, 0.11, 0.2);
}

/** Reintento: grave, corto y a bajo volumen. Nunca suena a error. */
function playRetry() {
  tone(200, 0, 0.16, 'sine', 0.14);
}

function playFanfare() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.15, 0.28));
}

/** Chime ascendente para contar: sube con cada objeto tocado. */
function playCount(step) {
  const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5, 1174.66, 1318.51];
  tone(scale[Math.min(step, scale.length - 1)], 0, 0.18, 'sine', 0.22);
}

/* ---------------- mute ---------------- */

function isMuted() { return state.muted; }

function setMuted(value) {
  state.muted = !!value;
  persistMuted(state.muted);
  if (state.muted) cancelSpeech();
  listeners.forEach((fn) => fn());
}

function toggleMute() {
  setMuted(!state.muted);
  return state.muted;
}

/* ---------------- disponibilidad de voces ---------------- */

function hasVoice(lang) { return !!state.voices[lang]; }
function voicesReady() { return state.voicesLoaded; }
function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

export const audio = {
  unlock,
  speak,
  speakQueue,
  cancelSpeech,
  tone,
  playCorrect,
  playRetry,
  playFanfare,
  playCount,
  isMuted,
  setMuted,
  toggleMute,
  hasVoice,
  voicesReady,
  onChange
};
