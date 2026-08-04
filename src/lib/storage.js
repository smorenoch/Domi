/* ---------------------------------------------------------------
   Progreso y preferencias en localStorage.
   Sin backend, sin cuentas: una sola niña, un solo dispositivo.
   Todo vive bajo una única clave con versión, para poder migrar
   sin pisar datos si el formato cambia.
   --------------------------------------------------------------- */

const KEY = 'libro:progress:v1';

const DEFAULT_SETTINGS = { muted: false };

function emptyData() {
  return { v: 1, lessons: {}, settings: { ...DEFAULT_SETTINGS }, flags: {} };
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw);
    return {
      v: 1,
      lessons: parsed.lessons || {},
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      flags: parsed.flags || {}
    };
  } catch {
    // localStorage bloqueado (modo privado) o JSON corrupto: seguimos sin progreso.
    return emptyData();
  }
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* sin persistencia: la app sigue funcionando igual */
  }
}

/* ---------------- progreso por lección ---------------- */

/** @returns {'new'|'progress'|'done'} */
export function getStatus(lessonId) {
  const entry = read().lessons[lessonId];
  return entry ? entry.status : 'new';
}

export function getLessonProgress(lessonId) {
  return read().lessons[lessonId] || { status: 'new', completions: 0, lastPlayed: null };
}

export function markStarted(lessonId) {
  const data = read();
  const entry = data.lessons[lessonId] || { status: 'new', completions: 0, lastPlayed: null };
  // Una lección ya completada no vuelve a "en progreso": el estado sólo avanza.
  if (entry.status !== 'done') entry.status = 'progress';
  entry.lastPlayed = new Date().toISOString();
  data.lessons[lessonId] = entry;
  write(data);
}

export function markCompleted(lessonId) {
  const data = read();
  const entry = data.lessons[lessonId] || { status: 'new', completions: 0, lastPlayed: null };
  entry.status = 'done';
  entry.completions = (entry.completions || 0) + 1;
  entry.lastPlayed = new Date().toISOString();
  data.lessons[lessonId] = entry;
  write(data);
}

export function getAllProgress() {
  return read().lessons;
}

export function resetProgress() {
  const data = read();
  data.lessons = {};
  write(data);
}

/* ---------------- preferencias ---------------- */

export function getMuted() {
  return !!read().settings.muted;
}

export function setMuted(value) {
  const data = read();
  data.settings.muted = !!value;
  write(data);
}

/* ---------------- flags de una sola vez ---------------- */

export function getFlag(name) {
  return !!read().flags[name];
}

export function setFlag(name, value = true) {
  const data = read();
  data.flags[name] = !!value;
  write(data);
}
