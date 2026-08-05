/* Puntos de progreso de una lección: uno por unidad (ronda, habitación,
   número, frase, tablero...). Sin números ni porcentajes: a los 3 años
   el progreso se lee mejor como "cuántas bolitas me faltan". */

import { el, clear, range } from '../lib/dom.js';

export function ProgressDots(total) {
  const node = el('div.progress-dots.hide');

  node.setTotal = (n) => {
    clear(node);
    range(n).forEach(() => node.appendChild(el('div.dot')));
  };

  node.setCurrent = (index) => {
    const dots = node.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('done', i < index);
      dot.classList.toggle('current', i === index);
    });
  };

  node.show = () => node.classList.remove('hide');
  node.hide = () => node.classList.add('hide');

  node.setTotal(total);
  return node;
}
