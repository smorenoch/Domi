/* ---------------------------------------------------------------
   Motor room-sequence — validado en el prototipo de la casa.

   Una escena fija con 4 objetos visibles a la vez; se piden uno a uno,
   en orden aleatorio. Los encontrados no desaparecen: quedan marcados
   con ✅ y siguen siendo tocables para volver a oír la palabra. Eso
   convierte la escena en algo que se puede repasar, no en un test.

   Sirve para objetos únicos y no repetibles: una puerta, una silla,
   una parte del cuerpo, un miembro de la familia.

   data: {
     scenes: [{ id, en, es, icon, objects: [{ id, en, es, emoji?, svg? }] }]
   }
   --------------------------------------------------------------- */

import { el, clear, shuffle, range, restartAnimation } from '../lib/dom.js';

export function roomSequence(lesson, api) {
  const { scenes } = lesson.data;

  let sceneIndex = 0;
  let sequence = [];
  let position = 0;
  let targetCard = null;

  function objectHTML(obj) {
    return obj.svg ? obj.svg : `<span class="tile-emoji">${obj.emoji}</span>`;
  }

  function buildTargetCard() {
    const visual = el('div.target-visual');
    const word = el('div.target-word.display');
    const wordEs = el('div.target-word-es');

    const card = el('div.target-card', {}, [
      visual, word, wordEs,
      el('button.speak-btn', {
        attrs: { type: 'button', 'aria-label': 'escuchar la palabra' },
        text: '🔊',
        on: { click: () => speakCurrent() }
      })
    ]);

    card.render = (obj) => {
      visual.innerHTML = objectHTML(obj);
      word.textContent = obj.en.toUpperCase();
      wordEs.textContent = `(${obj.es})`;
    };
    return card;
  }

  function currentObject() {
    const scene = scenes[sceneIndex];
    const idx = sequence[position];
    return idx == null ? null : scene.objects[idx];
  }

  function speakCurrent() {
    const obj = currentObject();
    if (obj) api.audio.speak(obj.en, 'en');
  }

  function start(index) {
    sceneIndex = index;
    position = 0;
    const scene = scenes[index];
    sequence = shuffle(range(scene.objects.length));

    const banner = el('div.room-banner', {}, [
      el('span.room-banner-icon', { text: scene.icon }),
      el('span.room-banner-text.display', { text: scene.en.toUpperCase() }),
      el('span.room-banner-es', { text: `(${scene.es})` })
    ]);

    targetCard = buildTargetCard();
    targetCard.render(scene.objects[sequence[0]]);

    const tray = el('div.tray', {}, scene.objects.map(() => el('div.slot')));
    const grid = el('div.grid.cols-2');

    scene.objects.forEach((obj, i) => {
      const tile = el('div.tile', { html: objectHTML(obj) });
      tile.addEventListener('click', () => onTileClick(tile, i, tray));
      grid.appendChild(tile);
    });

    clear(api.stage);
    api.stage.append(banner, targetCard, tray, grid);

    // Primero el nombre de la escena, después el primer objeto: da contexto
    // ("Kitchen") antes de pedir algo concreto ("Spoon").
    api.after(300, () => {
      api.audio.speak(scene.en, 'en');
      api.after(1300, () => speakCurrent());
    });
  }

  function fillTray(tray) {
    const slot = tray.querySelector('.slot:not([data-filled])');
    if (!slot) return;
    slot.dataset.filled = 'true';
    slot.style.background = 'var(--primary)';
    slot.style.borderColor = 'var(--primary)';
  }

  function onTileClick(tile, index, tray) {
    const scene = scenes[sceneIndex];
    const obj = scene.objects[index];

    // Un objeto ya encontrado sigue disponible para volver a escucharlo.
    if (tile.dataset.done === 'true') {
      api.audio.speak(obj.en, 'en');
      return;
    }

    if (index !== sequence[position]) {
      api.audio.playRetry();
      restartAnimation(tile, 'wrong');
      return;
    }

    tile.dataset.done = 'true';
    tile.classList.add('found', 'pulse');
    tile.insertAdjacentHTML('beforeend', '<span class="found-badge">✅</span>');
    api.audio.playCorrect();
    api.audio.speak(obj.en, 'en');
    fillTray(tray);
    position++;

    if (position < scene.objects.length) {
      // La tarjeta se actualiza 900 ms después, no al instante: da tiempo a
      // oír la palabra recién acertada. Pero en ese margen la niña puede
      // seguir tocando y cerrar la habitación, así que al disparar hay que
      // confirmar que todavía queda un objetivo pendiente.
      api.after(900, () => {
        const next = currentObject();
        if (!next) return;
        targetCard.render(next);
        speakCurrent();
      });
    } else {
      api.completeUnit({ speak: [`Great job! ${scene.en}!`], delay: 700 });
    }
  }

  return { unitCount: scenes.length, start };
}
