/* ---------------------------------------------------------------
   Motor counting-tap — nuevo (lección Números).

   Decisión pedagógica: la niña ya cuenta hasta 15 en español, así que
   acá NO se enseña a contar. Se muestran N objetos idénticos y cada
   toque pronuncia el siguiente número en inglés. Lo que se transfiere
   es sólo la etiqueta sonora sobre un concepto ya dominado.

   Por eso:
     · el orden de los toques no importa — no es un test de secuencia;
     · el objeto tocado queda marcado con su número, para que el conteo
       quede visible y se pueda repasar con el dedo;
     · al completar, aparece el numeral grande y se dice el número junto
       al objeto ("Three… three balloons"), que es cómo se usa de verdad.

   data: { items: [{ n, emoji, en, es, enThing, esThing, prompt }] }
   --------------------------------------------------------------- */

import { el, clear, range } from '../lib/dom.js';

const NUMBER_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

export function countingTap(lesson, api) {
  const { items } = lesson.data;

  let counted = 0;

  function start(index) {
    counted = 0;
    const item = items[index];

    // Arranca con el dedo, no con un "0": el cero es un concepto que a los
    // 3 años todavía no está, y acá el círculo tiene que decir "tócame".
    const counterNum = el('div.counter-num', { text: '👆' });
    const counterWord = el('div.counter-word', { text: '' });
    const counter = el('div.counter', {}, [counterNum, counterWord]);

    const objects = el('div.count-objects');
    range(item.n).forEach(() => {
      const badge = el('span.count-badge');
      const obj = el('button.count-obj', {
        attrs: { type: 'button', 'aria-label': item.esThing }
      }, [document.createTextNode(item.emoji), badge]);
      obj.addEventListener('click', () => onObjectTap(obj, badge, counter, counterNum, counterWord, item));
      objects.appendChild(obj);
    });

    clear(api.stage);
    api.stage.append(
      el('div.count-prompt', { text: item.prompt }),
      counter,
      objects
    );
  }

  function onObjectTap(obj, badge, counter, counterNum, counterWord, item) {
    if (obj.dataset.counted) return;

    obj.dataset.counted = 'true';
    obj.classList.add('counted');
    counted++;

    const word = NUMBER_WORDS[counted - 1];
    badge.textContent = String(counted);
    counterNum.textContent = String(counted);
    counterWord.textContent = word.toUpperCase();
    counter.classList.remove('bump');
    void counter.offsetWidth;
    counter.classList.add('bump');

    api.audio.playCount(counted - 1);
    api.audio.speak(word, 'en');

    if (counted >= item.n) api.after(750, () => reveal(item));
  }

  /** Cierre de la unidad: el numeral grande + el número aplicado al objeto. */
  function reveal(item) {
    const card = el('div.number-reveal', {}, [
      el('div.number-reveal-num', { text: String(item.n) }),
      el('div.number-reveal-en', { text: `${item.en.toUpperCase()} ${item.emoji}` }),
      el('div.number-reveal-es', { text: `(${item.es} ${item.esThing})` })
    ]);

    clear(api.stage);
    api.stage.appendChild(card);

    api.audio.speakQueue([item.en, `${item.en} ${item.enThing}`], 'en');
    api.completeUnit({ speak: [`Great job! ${item.en}!`], delay: 2400 });
  }

  return { unitCount: items.length, start };
}
