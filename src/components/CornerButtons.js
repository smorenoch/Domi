/* Botones de esquina: silenciar (izquierda) y volver (derecha).
   El mute es global y persiste entre lecciones y sesiones. */

import { el } from '../lib/dom.js';
import { audio } from '../lib/audio.js';

export function MuteButton() {
  const btn = el('button.corner-btn.left', {
    attrs: { type: 'button', 'aria-label': 'silenciar' },
    text: audio.isMuted() ? '🔇' : '🔊',
    on: {
      click: () => {
        audio.unlock();
        audio.toggleMute();
      }
    }
  });
  const off = audio.onChange(() => { btn.textContent = audio.isMuted() ? '🔇' : '🔊'; });
  btn.destroy = off;
  return btn;
}

/** Botón de volver. `to` es la ruta destino (por defecto, el índice). */
export function BackButton(onBack, label = '🏠') {
  return el('button.corner-btn.right', {
    attrs: { type: 'button', 'aria-label': 'volver' },
    text: label,
    on: { click: onBack }
  });
}
