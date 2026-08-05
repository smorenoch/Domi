/* ---------------------------------------------------------------
   Motor collect-match — validado en los prototipos de colores y animales.

   Grilla de 9 tiles; se pide juntar N (4) que comparten un atributo
   (el color, o la identidad del objeto) entre distractores. Cada acierto
   pronuncia la palabra objetivo; el error sólo hace vibrar el tile con un
   tono suave — no hay contador de fallos ni penalización.

   Sirve para vocabulario que se repite naturalmente en una escena:
   colores, animales, comida.

   data: {
     needed, totalTiles, visual: 'shape'|'emoji',
     items: [{ id, en, es, hex?, emoji?, reinforce? }]
   }
   --------------------------------------------------------------- */

import { el, clear, shuffle, range, restartAnimation } from '../lib/dom.js';

/* Mancha de pintura: la MISMA figura en todos los tiles del track de colores.

   Antes cada tile tomaba una forma distinta (círculo, estrella, corazón,
   flor). Se probó con la usuaria real y no funciona: a los 3 años ya sabe
   nombrar "corazón" y "estrella", así que la figura le gana la atención al
   color, que es lo único que la lección enseña. Con una sola forma, el
   color queda como el único atributo que varía entre tiles.

   Se eligió una mancha —y no un círculo— justamente porque no es nada:
   no tiene nombre que compita, y "mancha de pintura" es el objeto natural
   cuando lo que se está mirando es color puro. */
const PAINT_SPLAT = `<svg viewBox="0 0 100 100">
  <path d="M50.0 3.0C55.4 2.7 62.6 6.3 66.5 10.3C70.3 14.2 71.8 21.8 73.3 26.7C74.9 31.5 74.3 35.4 75.9 39.3C77.5 43.2 80.8 45.5 83.0 50.0C85.2 54.5 88.8 60.5 88.8 66.1C88.8 71.6 86.9 79.1 83.2 83.2C79.6 87.3 72.4 90.4 66.8 90.7C61.3 90.9 54.7 87.3 50.0 85.0C45.3 82.7 42.1 79.4 38.9 76.8C35.7 74.1 34.1 71.5 30.9 69.1C27.7 66.7 23.5 65.8 19.5 62.6C15.5 59.4 9.3 55.2 7.0 50.0C4.7 44.8 3.9 37.1 5.7 31.6C7.4 26.2 12.7 20.7 17.5 17.5C22.2 14.2 28.9 14.5 34.3 12.1C39.7 9.7 44.6 3.3 50.0 3.0Z" fill="currentColor"/>
  <circle cx="93" cy="36" r="3.4" fill="currentColor"/>
  <circle cx="7" cy="58" r="2.8" fill="currentColor"/>
  <circle cx="62" cy="96" r="2.4" fill="currentColor"/>
  <circle cx="26" cy="6" r="1.9" fill="currentColor"/>
</svg>`;

export function collectMatch(lesson, api) {
  const { items, needed = 4, totalTiles = 9, visual = 'emoji' } = lesson.data;

  let targetIndex = 0;
  let collected = 0;

  function itemVisual(item) {
    return visual === 'shape'
      ? PAINT_SPLAT
      : `<span class="tile-emoji">${item.emoji}</span>`;
  }

  function buildTargetCard(item) {
    // La tarjeta objetivo muestra exactamente lo mismo que hay que buscar
    // en la grilla: la misma mancha, en el color pedido.
    const isSplat = visual === 'shape';
    const visualNode = el('div.target-visual', {
      html: isSplat ? PAINT_SPLAT : item.emoji,
      style: isSplat ? { color: item.hex } : {}
    });

    return el('div.target-card', {}, [
      visualNode,
      el('div.target-word.display', { text: item.en.toUpperCase() }),
      el('div.target-word-es', { text: `(${item.es})` }),
      el('button.speak-btn', {
        attrs: { type: 'button', 'aria-label': `escuchar ${item.en}` },
        text: '🔊',
        on: { click: () => api.audio.speak(item.en, 'en') }
      })
    ]);
  }

  function buildTray() {
    return el('div.tray', {}, range(needed).map(() => el('div.slot')));
  }

  function fillTray(tray, item) {
    const slot = tray.querySelector('.slot:not([data-filled])');
    if (!slot) return;
    slot.dataset.filled = 'true';
    const color = item.hex || 'var(--primary)';
    slot.style.background = color;
    slot.style.borderColor = color;
  }

  /** Reparte 9 tiles: N del objetivo y el resto entre 2 distractores. */
  function buildPool(index) {
    const others = shuffle(range(items.length).filter((i) => i !== index)).slice(0, 2);
    const split = 2 + Math.floor(Math.random() * 2);
    const counts = [
      { idx: index, n: needed },
      { idx: others[0], n: split },
      { idx: others[1], n: totalTiles - needed - split }
    ];
    const pool = [];
    counts.forEach(({ idx, n }) => range(n).forEach(() => pool.push(idx)));
    return shuffle(pool);
  }

  function start(index) {
    targetIndex = index;
    collected = 0;
    const target = items[index];

    const tray = buildTray();
    const grid = el('div.grid.cols-3');

    buildPool(index).forEach((itemIdx) => {
      const item = items[itemIdx];
      const tile = el('div.tile', {
        html: itemVisual(item),
        style: visual === 'shape' ? { color: item.hex } : {},
        dataset: { itemIdx: String(itemIdx) }
      });
      tile.addEventListener('click', () => onTileClick(tile, itemIdx, tray));
      grid.appendChild(tile);
    });

    clear(api.stage);
    api.stage.append(buildTargetCard(target), tray, grid);

    api.after(350, () => api.audio.speak(target.en, 'en'));
  }

  function onTileClick(tile, itemIdx, tray) {
    if (tile.dataset.done) return;
    const target = items[targetIndex];

    if (itemIdx !== targetIndex) {
      api.audio.playRetry();
      restartAnimation(tile, 'wrong');
      return;
    }

    tile.dataset.done = 'true';
    tile.classList.add('collected');
    api.audio.playCorrect();
    // Refuerzo opcional encolado tras la palabra (ej. "Dog" → "Woof woof!").
    api.audio.speakQueue([target.en, target.reinforce], 'en');
    collected++;
    fillTray(tray, target);

    if (collected >= needed) {
      api.completeUnit({
        speak: [`Great job! ${target.en}!`],
        delay: target.reinforce ? 700 : 500
      });
    }
  }

  return { unitCount: items.length, start };
}
