/* Índice del libro: los dos tracks, uno al lado del otro.
   Cada capítulo muestra su estado leído desde localStorage y entra
   directo a la lección — sin pantallas intermedias. */

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { audio } from '../lib/audio.js';
import { getStatus } from '../lib/storage.js';
import { TRACKS } from '../lessons/index.js';
import { MuteButton, BackButton } from '../components/CornerButtons.js';

const STATUS_ICON = { new: '', progress: '▶️', done: '⭐' };
const STATUS_TEXT = { new: '', progress: 'En progreso', done: 'Completada' };

function Chapter(chapter) {
  if (!chapter.available) {
    return el('button.chapter.locked', { attrs: { type: 'button', disabled: 'disabled' } }, [
      el('div.chapter-icon', { text: chapter.icon }),
      el('div.chapter-body', {}, [
        el('div.chapter-name', { text: chapter.title }),
        el('div.chapter-meta', { text: chapter.meta })
      ]),
      el('div.chapter-status', { text: '🔒' })
    ]);
  }

  const status = getStatus(chapter.id);
  const meta = STATUS_TEXT[status] || chapter.meta;

  return el(`button.chapter.${status}`, {
    attrs: { type: 'button' },
    on: {
      click: () => {
        audio.unlock();
        go(`/leccion/${chapter.id}`);
      }
    }
  }, [
    el('div.chapter-icon', { text: chapter.icon }),
    el('div.chapter-body', {}, [
      el('div.chapter-name', { text: chapter.title }),
      el('div.chapter-meta', { text: meta })
    ]),
    el('div.chapter-status', { text: STATUS_ICON[status] || '' })
  ]);
}

function Track(track) {
  return el('section.track', { dataset: { track: track.id } }, [
    el('div.track-head', {}, [
      el('div.track-chip', { text: track.icon }),
      el('div.track-name.display', {}, [
        el('span.track-kicker', { text: track.kicker }),
        document.createTextNode(track.name)
      ])
    ]),
    el('div.chapters', {}, track.chapters.map(Chapter))
  ]);
}

export function MenuPage() {
  const muteBtn = MuteButton();

  const node = el('div.page', {}, [
    muteBtn,
    BackButton(() => go('/'), '📕'),
    el('div.screen.active.menu-screen', {}, [
      el('h1.menu-title.display', { text: '¿Qué jugamos hoy?' }),
      el('div.tracks', {}, TRACKS.map(Track))
    ])
  ]);

  return {
    node,
    destroy() { if (muteBtn.destroy) muteBtn.destroy(); }
  };
}
