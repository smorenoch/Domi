/* Overlay de celebración: sol feliz + confeti + botón "Siguiente".
   Se muestra al cerrar cada unidad de una lección. El botón permite
   adelantar; si nadie toca, avanza solo (lo maneja el runner). */

import { el, clear, prefersReducedMotion } from '../lib/dom.js';
import { SunMascot } from './SunMascot.js';

const CONFETTI_COLORS = ['#FF6F91', '#FFD35C', '#7BC96F', '#5EC8E0', '#B892FF'];

export function Celebration({ onNext, nextLabel = 'Siguiente ▶' }) {
  const text = el('div.celeb-text.display', { text: '¡Genial! 🎉' });
  const button = el('button.big-btn.display', {
    attrs: { type: 'button' },
    text: nextLabel,
    on: { click: onNext }
  });

  const node = el('div.celebration', {}, [
    SunMascot({ happy: true }),
    text,
    button
  ]);

  node.setText = (value) => { text.textContent = value; };
  node.setNextLabel = (value) => { button.textContent = value; };

  node.open = (message) => {
    if (message) text.textContent = message;
    launchConfetti();
    node.classList.add('active');
  };

  node.close = () => {
    node.classList.remove('active');
    clearConfetti();
  };

  function launchConfetti() {
    if (prefersReducedMotion()) return;
    for (let i = 0; i < 36; i++) {
      node.appendChild(el('div.confetti-piece', {
        style: {
          left: Math.random() * 100 + 'vw',
          background: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          animationDuration: (1.6 + Math.random() * 1.4) + 's',
          animationDelay: (Math.random() * 0.4) + 's',
          borderRadius: Math.random() > 0.5 ? '50%' : '3px'
        }
      }));
    }
  }

  function clearConfetti() {
    node.querySelectorAll('.confetti-piece').forEach((p) => p.remove());
  }

  return node;
}
