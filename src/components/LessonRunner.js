/* ---------------------------------------------------------------
   Shell de lección: lo único que se repite en las 7 lecciones.

   Se ocupa de todo lo que NO es el juego en sí:
     · pantalla de inicio (mascota, título, nota para el adulto, "Empezar")
     · desbloqueo del AudioContext en ese primer gesto
     · puntos de progreso, botones de esquina, celebración por unidad
     · pantalla final con medallas y progreso guardado
     · limpieza de timers y de audio al salir

   El motor sólo recibe un escenario vacío (`api.stage`) y avisa cuando
   una unidad termina (`api.completeUnit()`). Nada más.
   --------------------------------------------------------------- */

import { el, clear } from '../lib/dom.js';
import { audio } from '../lib/audio.js';
import { markStarted, markCompleted } from '../lib/storage.js';
import { SunMascot } from './SunMascot.js';
import { ProgressDots } from './ProgressDots.js';
import { Celebration } from './Celebration.js';
import { AdultNote } from './AdultNote.js';
import { MuteButton, BackButton } from './CornerButtons.js';

const AUTO_ADVANCE_MS = 4200;

const DEFAULT_CELEB = {
  en: '¡Genial! Great job! 🎉',
  es: '¡Muy bien! 🎉'
};

export function LessonRunner(lesson, { onExit }) {
  const timers = new Set();
  const node = el('div.page');

  /* ---------- timers acotados al ciclo de vida de la lección ---------- */
  function after(ms, fn) {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  }
  function clearTimers() {
    timers.forEach((id) => clearTimeout(id));
    timers.clear();
  }

  /* ---------- pantallas ---------- */
  const stage = el('div.stage');
  const progress = ProgressDots(1);

  const screenIntro = el('div.screen.active', {}, [
    SunMascot(),
    el('h1.title.display', { text: lesson.title }),
    el('p.subtitle', { text: lesson.subtitle }),
    el('p.note', { text: lesson.note }),
    AdultNote(lesson.adultNote),
    el('button.big-btn.display', {
      attrs: { type: 'button' },
      text: '▶ Empezar a jugar',
      on: { click: begin }
    })
  ]);

  const screenPlay = el(`div.screen.${lesson.engineName}`, {}, [stage]);

  const medals = el('div.medals');
  const screenFinal = el('div.screen', {}, [
    el('div.sun-wrap', { html: '<div style="font-size:min(20vw,110px);line-height:1;">🏆</div>' }),
    el('h1.title.display', { text: lesson.final.title }),
    el('p.subtitle', { text: lesson.final.subtitle }),
    medals,
    el('button.big-btn.display', {
      attrs: { type: 'button' },
      text: '🔁 Jugar de nuevo',
      on: { click: () => { audio.unlock(); startUnit(0); } }
    }),
    el('button.ghost-btn', {
      attrs: { type: 'button' },
      text: '📖 Volver al índice',
      style: { marginTop: '1.6vh' },
      on: { click: exit }
    })
  ]);

  const celebration = Celebration({ onNext: advance });
  const muteBtn = MuteButton();
  const backBtn = BackButton(exit);

  node.append(muteBtn, backBtn, progress, screenIntro, screenPlay, screenFinal, celebration);

  function showScreen(target) {
    [screenIntro, screenPlay, screenFinal].forEach((s) => s.classList.toggle('active', s === target));
  }

  /* ---------- API que ve el motor ---------- */
  let unitIndex = 0;
  let unitClosed = false;

  const api = {
    stage,
    lang: lesson.track,
    audio,
    after,
    /** El motor llama esto cuando la unidad actual está resuelta. */
    completeUnit({ text, speak, delay = 0 } = {}) {
      if (unitClosed) return;
      unitClosed = true;
      after(delay, () => completeUnit({ text, speak }));
    }
  };

  const engine = lesson.createEngine(lesson, api);
  progress.setTotal(engine.unitCount);

  /* ---------- flujo ---------- */
  function begin() {
    audio.unlock();          // primer gesto del usuario: desbloquea el AudioContext
    markStarted(lesson.id);
    startUnit(0);
  }

  function startUnit(index) {
    clearTimers();
    audio.cancelSpeech();
    celebration.close();
    unitIndex = index;
    unitClosed = false;
    progress.show();
    progress.setCurrent(index);
    clear(stage);
    showScreen(screenPlay);
    engine.start(index);
  }

  function completeUnit({ text, speak }) {
    audio.playFanfare();
    if (speak) audio.speakQueue(speak, lesson.track);
    celebration.setNextLabel(unitIndex + 1 < engine.unitCount ? 'Siguiente ▶' : 'Terminar ▶');
    celebration.open(text || lesson.celebText || DEFAULT_CELEB[lesson.track]);
    after(AUTO_ADVANCE_MS, advance);
  }

  function advance() {
    clearTimers();
    celebration.close();
    if (unitIndex + 1 < engine.unitCount) startUnit(unitIndex + 1);
    else showFinal();
  }

  function showFinal() {
    markCompleted(lesson.id);
    progress.hide();
    clear(medals);
    (lesson.medals ? lesson.medals(lesson) : []).forEach((m) => {
      medals.appendChild(el('div.medal', {
        text: m.emoji || '',
        style: m.color ? { background: m.color } : {}
      }));
    });
    showScreen(screenFinal);
  }

  function exit() {
    destroy();
    onExit();
  }

  function destroy() {
    clearTimers();
    audio.cancelSpeech();
    if (engine.destroy) engine.destroy();
    if (muteBtn.destroy) muteBtn.destroy();
  }

  return { node, destroy };
}
