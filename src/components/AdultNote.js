/* Nota de contexto para el adulto acompañante.
   Va en la pantalla de inicio de cada lección (nunca durante el juego,
   para no competir por la atención de la niña). El adulto es parte del
   sistema: necesita saber qué se está practicando y cómo ayudar. */

import { el } from '../lib/dom.js';

export function AdultNote(text, label = 'Para el adulto') {
  if (!text) return null;
  return el('div.adult-note', {}, [
    el('span.adult-note-icon', { text: '👩‍🏫' }),
    el('div.adult-note-body', {}, [
      el('span.adult-note-label', { text: label }),
      el('span', { text })
    ])
  ]);
}
