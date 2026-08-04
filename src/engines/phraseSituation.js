/* ---------------------------------------------------------------
   Motor phrase-situation — nuevo (lección Saludos).

   A diferencia del resto, acá no hay nada que "encontrar": las frases
   sociales no se aprenden buscándolas en una grilla, se aprenden por
   asociación entre una situación y un sonido. El motor es receptivo:
   la niña toca al personaje, el personaje dice la frase, y eso se
   repite unas pocas veces. No hay micrófono ni evaluación de
   pronunciación (fuera de alcance, sección 13 del brief).

   Las tres repeticiones no son un "objetivo" que se pueda fallar:
   son el ritmo de exposición mínimo para que la frase quede.

   data: { repeats?, items: [{ id, en, es, emoji, situation, hint }] }
   --------------------------------------------------------------- */

import { el, clear, range } from '../lib/dom.js';

export function phraseSituation(lesson, api) {
  const { items, repeats = 3 } = lesson.data;

  let taps = 0;

  function start(index) {
    taps = 0;
    const item = items[index];

    const tray = el('div.tray', {}, range(repeats).map(() => el('div.slot')));

    const scene = el('button.phrase-scene', {
      attrs: { type: 'button', 'aria-label': `escuchar ${item.en}` },
      text: item.emoji
    });

    const hint = el('div.phrase-hint', { text: item.hint || 'Tócalo para escuchar' });

    scene.addEventListener('click', () => onTap(scene, tray, hint, item));

    const card = el('div.phrase-card', {}, [
      scene,
      el('div.phrase-situation', { text: item.situation }),
      el('div.phrase-en.display', { text: item.en }),
      el('div.phrase-es', { text: `(${item.es})` }),
      hint
    ]);

    clear(api.stage);
    api.stage.append(card, tray);

    // La frase suena sola una vez al entrar: la niña escucha antes de actuar.
    api.after(450, () => {
      api.audio.speak(item.en, 'en');
      scene.classList.add('bounce');
      api.after(600, () => scene.classList.remove('bounce'));
    });
  }

  function onTap(scene, tray, hint, item) {
    if (taps >= repeats) return;

    scene.classList.remove('bounce');
    void scene.offsetWidth;
    scene.classList.add('bounce');

    api.audio.speak(item.en, 'en');
    taps++;

    const slot = tray.querySelector('.slot:not([data-filled])');
    if (slot) {
      slot.dataset.filled = 'true';
      slot.style.background = 'var(--primary)';
      slot.style.borderColor = 'var(--primary)';
    }

    if (taps >= repeats) {
      hint.textContent = '¡Dilo tú también! 💬';
      // El delay deja terminar el audio de este último toque antes de
      // celebrar: si celebra encima, se corta la frase a mitad.
      api.completeUnit({ speak: ['Great job!', item.en], delay: 1500 });
    }
  }

  return { unitCount: items.length, start };
}
