/* ---------------------------------------------------------------
   Mascota: el sol. Es el hilo visual entre todas las lecciones,
   así que vive en un solo lugar y se usa igual en portada, índice,
   intro de lección y celebración.
   Estados: idle (por defecto) y happy (ojos y boca de celebración).
   Los rayos giran sólo si el sistema no pide movimiento reducido
   (regla en base.css).
   --------------------------------------------------------------- */

import { el } from '../lib/dom.js';

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

const rays = RAY_ANGLES
  .map((deg) => `<rect x="46" y="0" width="8" height="20" rx="4"${deg ? ` transform="rotate(${deg} 50 50)"` : ''}/>`)
  .join('');

function svg(happy) {
  return `
  <svg viewBox="0 0 100 100" role="img" aria-label="sol">
    <g class="sun-rays" fill="var(--sun)">${rays}</g>
    <circle cx="50" cy="50" r="30" fill="var(--sun)"/>
    <g class="sun-face${happy ? ' happy' : ''}">
      <g class="eyes-normal">
        <circle cx="40" cy="46" r="3.2" fill="#3A3358"/>
        <circle cx="60" cy="46" r="3.2" fill="#3A3358"/>
      </g>
      <g class="eyes-happy">
        <path d="M35 46 q5 -6 10 0" stroke="#3A3358" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M55 46 q5 -6 10 0" stroke="#3A3358" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
      <path class="mouth-normal" d="M40 58 q10 8 20 0" stroke="#3A3358" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path class="mouth-happy" d="M36 56 q14 16 28 0" stroke="#3A3358" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`;
}

/**
 * @param {{happy?:boolean, size?:'md'|'sm'}} [opts]
 */
export function SunMascot({ happy = false, size = 'md' } = {}) {
  const node = el(`div.sun-wrap${size === 'sm' ? '.sm' : ''}`, { html: svg(happy) });
  node.setHappy = (value) => {
    const face = node.querySelector('.sun-face');
    face.classList.toggle('happy', !!value);
  };
  return node;
}
