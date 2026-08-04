/* ---------------------------------------------------------------
   Motor classification — nuevo (¿Cuál no va?, Track B).

   Habilidad: pensamiento categórico. Cuatro imágenes, tres de una
   categoría que la niña ya maneja en español y una intrusa.

   Dos decisiones que importan:
     · Al acertar no se dice sólo "¡bien!": se dice POR QUÉ ("la manzana
       no va, los otros son animales"). La categoría verbalizada es el
       aprendizaje real; el acierto solo no enseña nada.
     · Al errar no se corrige con un "no": se reformula ("ese sí va con
       los demás") y se vuelve a mirar. No hay respuesta perdida.

   Narración completa en español, como todo Track B.

   data: { instruction, sets: [{ category, items:[{emoji,name}], intruder:{emoji,name} }] }
   --------------------------------------------------------------- */

import { el, clear, shuffle, restartAnimation } from '../lib/dom.js';

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function classification(lesson, api) {
  const { sets, instruction } = lesson.data;

  let solved = false;

  function start(index) {
    const set = sets[index];
    solved = false;

    const reason = el('div.odd-reason');
    const row = el('div.odd-row');

    const tiles = shuffle([
      ...set.items.map((item) => ({ item, isIntruder: false })),
      { item: set.intruder, isIntruder: true }
    ]);

    tiles.forEach(({ item, isIntruder }) => {
      const tile = el('button.odd-tile', {
        attrs: { type: 'button', 'aria-label': item.name },
        text: item.emoji
      });
      tile.addEventListener('click', () => onPick(tile, isIntruder, set, row, reason));
      row.appendChild(tile);
    });

    clear(api.stage);
    api.stage.append(
      el('div.instruction', {}, [
        el('span.instruction-text', { text: instruction }),
        el('button.speak-btn', {
          attrs: { type: 'button', 'aria-label': 'repetir la instrucción' },
          text: '🔊',
          on: { click: () => api.audio.speak(instruction, 'es') }
        })
      ]),
      row,
      reason
    );

    api.after(400, () => api.audio.speak(instruction, 'es'));
  }

  function onPick(tile, isIntruder, set, row, reason) {
    if (solved) return;

    if (!isIntruder) {
      api.audio.playRetry();
      restartAnimation(tile, 'wrong');
      api.audio.speak('Ese sí va con los demás. Mira otra vez.', 'es');
      return;
    }

    solved = true;
    api.audio.playCorrect();

    row.querySelectorAll('.odd-tile').forEach((t) => {
      t.classList.add(t === tile ? 'picked' : 'dim');
    });

    const line = `${capitalize(set.intruder.name)} no va, porque los otros son ${set.category}.`;
    reason.textContent = line;
    reason.classList.add('show');

    api.after(400, () => api.audio.speakQueue(['¡Muy bien!', line], 'es'));
    api.completeUnit({ text: '¡Muy bien! 🎉', delay: 3200 });
  }

  return { unitCount: sets.length, start };
}
