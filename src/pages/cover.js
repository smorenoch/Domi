/* Portada del libro. Es también el primer gesto del usuario: al abrir el
   libro se desbloquea el AudioContext, así que cualquier lección que se
   entre después ya tiene el audio listo. */

import { el } from '../lib/dom.js';
import { audio } from '../lib/audio.js';
import { go } from '../lib/router.js';
import { getFlag, setFlag } from '../lib/storage.js';
import { SunMascot } from '../components/SunMascot.js';
import { MuteButton } from '../components/CornerButtons.js';

const FIRST_RUN_FLAG = 'seenAudioHint';

export function CoverPage() {
  const hint = el('div.audio-hint.hide');
  const muteBtn = MuteButton();

  const node = el('div.page', {}, [
    muteBtn,
    el('div.screen.active', {}, [
      SunMascot(),
      el('h1.cover-title.display', { text: 'Mi Libro de Aprender' }),
      el('p.cover-sub', { text: 'Para jugar juntas, un ratito cada vez' }),
      el('div.cover-badges', {}, [
        el('div.cover-badge', { html: '<span>🌎</span><span>Aprendiendo Inglés</span>' }),
        el('div.cover-badge', { html: '<span>🧠</span><span>Jugando y Pensando</span>' })
      ]),
      el('button.big-btn.display', {
        attrs: { type: 'button' },
        text: '📖 Abrir el libro',
        on: {
          click: () => {
            audio.unlock();
            go('/indice');
          }
        }
      })
    ]),
    hint
  ]);

  /* Aviso discreto y no bloqueante sobre el audio.
     La advertencia de voz faltante se muestra siempre que falte de verdad
     (es información accionable); el recordatorio general de volumen, sólo
     la primera vez que se abre el libro. */
  function refreshHint() {
    if (audio.voicesReady() && !audio.hasVoice('en')) {
      hint.textContent = '🔈 Esta tablet no tiene voz en inglés instalada. Las lecciones de inglés no sonarán hasta agregarla en los ajustes del sistema.';
      hint.classList.remove('hide');
      return;
    }
    if (!getFlag(FIRST_RUN_FLAG)) {
      hint.textContent = '🔈 Revisa el volumen y que la tablet tenga voz en inglés instalada.';
      hint.classList.remove('hide');
      setFlag(FIRST_RUN_FLAG);
      return;
    }
    hint.classList.add('hide');
  }

  refreshHint();
  const offVoices = audio.onChange(() => {
    if (audio.voicesReady() && !audio.hasVoice('en')) refreshHint();
  });

  return {
    node,
    destroy() {
      offVoices();
      if (muteBtn.destroy) muteBtn.destroy();
    }
  };
}
