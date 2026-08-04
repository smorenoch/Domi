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

import { el, clear, shuffle, pick, range, restartAnimation } from '../lib/dom.js';

/* Formas neutras para el track de colores: la forma varía para que la niña
   abstraiga el color, no la silueta. */
const SHAPES = [
  '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="currentColor"/></svg>',
  '<svg viewBox="0 0 100 100"><path d="M50 6 L61 38 L96 38 L68 59 L79 93 L50 72 L21 93 L32 59 L4 38 L39 38 Z" fill="currentColor"/></svg>',
  '<svg viewBox="0 0 100 100"><path d="M50 90 C18 66 4 44 4 27 C4 11 16 1 30 1 C41 1 48 8 50 16 C52 8 59 1 70 1 C84 1 96 11 96 27 C96 44 82 66 50 90 Z" fill="currentColor"/></svg>',
  '<svg viewBox="0 0 100 100"><g fill="currentColor"><circle cx="50" cy="22" r="17"/><circle cx="76" cy="38" r="17"/><circle cx="66" cy="66" r="17"/><circle cx="34" cy="66" r="17"/><circle cx="24" cy="38" r="17"/><circle cx="50" cy="50" r="15"/></g></svg>'
];

export function collectMatch(lesson, api) {
  const { items, needed = 4, totalTiles = 9, visual = 'emoji' } = lesson.data;

  let targetIndex = 0;
  let collected = 0;

  function itemVisual(item) {
    return visual === 'shape'
      ? pick(SHAPES)
      : `<span class="tile-emoji">${item.emoji}</span>`;
  }

  function buildTargetCard(item) {
    const swatch = visual === 'shape';
    const visualNode = el(`div.target-visual${swatch ? '.swatch' : ''}`, {
      html: swatch ? '' : item.emoji,
      style: swatch ? { color: item.hex } : {}
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
