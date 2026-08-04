/* ---------------------------------------------------------------
   Motor memory-pairs — nuevo (Memorama, Track B).

   Track B no enseña idioma: entrena proceso cognitivo. Acá, memoria de
   trabajo y atención sostenida. Por eso la narración SÍ es en español y
   SÍ dice instrucciones completas — entender la instrucción hablada es
   parte de la habilidad que se está practicando.

   La dificultad sube por niveles (3 → 4 → 5 parejas) en vez de empezar
   con un tablero grande: así el primer nivel se gana casi seguro y la
   sesión arranca con éxito, no con frustración.

   Las cartas usan animales que ya domina en español — reaparecer en otro
   contexto vale más que material nuevo (repetición espaciada informal).

   Sin tiempo, sin contador de intentos, sin sonido de error.

   data: { levels: [{ pairs, columns }], deck: [{ id, emoji, es, esPlural }] }
   --------------------------------------------------------------- */

import { el, clear, shuffle } from '../lib/dom.js';

const FLIP_BACK_MS = 1000;

export function memoryPairs(lesson, api) {
  const { levels, deck } = lesson.data;

  let matched = 0;
  let firstCard = null;
  let locked = false;
  let missedOnce = false;

  function start(index) {
    const level = levels[index];
    matched = 0;
    firstCard = null;
    locked = false;
    missedOnce = false;

    const chosen = shuffle(deck).slice(0, level.pairs);
    const cards = shuffle([...chosen, ...chosen]);

    const instructionText = level.instruction;
    const board = el('div.memory-board', {
      style: { gridTemplateColumns: `repeat(${level.columns}, minmax(0, 1fr))` }
    });

    cards.forEach((item) => board.appendChild(buildCard(item, board)));

    clear(api.stage);
    api.stage.append(
      el('div.instruction', {}, [
        el('span.instruction-text', { text: instructionText }),
        el('button.speak-btn', {
          attrs: { type: 'button', 'aria-label': 'repetir la instrucción' },
          text: '🔊',
          on: { click: () => api.audio.speak(instructionText, 'es') }
        })
      ]),
      board
    );

    api.after(400, () => api.audio.speak(instructionText, 'es'));
  }

  function buildCard(item, board) {
    const card = el('button.card', {
      attrs: { type: 'button', 'aria-label': 'carta' },
      dataset: { pairId: item.id }
    }, [
      el('div.card-inner', {}, [
        el('div.card-face.card-back', { text: '⭐' }),
        el('div.card-face.card-front', { text: item.emoji })
      ])
    ]);
    card.item = item;
    card.addEventListener('click', () => onCardClick(card, board));
    return card;
  }

  function onCardClick(card, board) {
    if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    api.audio.speak(card.item.es, 'es');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    const second = card;
    const isPair = firstCard.dataset.pairId === second.dataset.pairId;
    locked = true;

    if (isPair) {
      const item = second.item;
      firstCard.classList.add('matched');
      second.classList.add('matched');
      firstCard = null;
      locked = false;
      matched++;

      api.audio.playCorrect();
      api.after(500, () => api.audio.speak(`¡Muy bien! Dos ${item.esPlural}.`, 'es'));

      if (matched >= board.children.length / 2) {
        api.completeUnit({
          text: '¡Encontraste todas las parejas! 🎉',
          speak: ['¡Muy bien! Encontraste todas las parejas.'],
          delay: 1400
        });
      }
      return;
    }

    // Sin pareja: tono suave y vuelta atrás. Se acompaña con voz sólo la
    // primera vez del tablero, para que no se vuelva un regaño repetido.
    api.audio.playRetry();
    if (!missedOnce) {
      missedOnce = true;
      api.after(450, () => api.audio.speak('Casi. Prueba con otra carta.', 'es'));
    }
    const a = firstCard;
    firstCard = null;
    api.after(FLIP_BACK_MS, () => {
      a.classList.remove('flipped');
      second.classList.remove('flipped');
      locked = false;
    });
  }

  return { unitCount: levels.length, start };
}
