/* ---------------------------------------------------------------
   Catálogo del libro: qué capítulos existen y en qué orden.
   Lo que todavía no se construyó aparece igual en el índice, marcado
   como "pronto" — el mapa completo se ve desde el primer día, y el
   adulto sabe hacia dónde va la cosa.
   --------------------------------------------------------------- */

import { colors } from './en/colors.js';
import { animals } from './en/animals.js';
import { house } from './en/house.js';
import { numbers } from './en/numbers.js';
import { greetings } from './en/greetings.js';
import { memory } from './es/memory.js';
import { oddOneOut } from './es/oddOneOut.js';

const BUILT = [colors, animals, house, numbers, greetings, memory, oddOneOut];

export const LESSONS = Object.fromEntries(BUILT.map((lesson) => [lesson.id, lesson]));

export function getLesson(id) {
  return LESSONS[id] || null;
}

/** Capítulo de un track: una lección construida, o un espacio reservado. */
function chapter(lesson) {
  return { id: lesson.id, icon: lesson.icon, title: lesson.menuTitle, meta: lesson.menuMeta, available: true };
}
function soon(icon, title, meta) {
  return { id: null, icon, title, meta, available: false };
}

export const TRACKS = [
  {
    id: 'en',
    icon: '🌎',
    kicker: 'Track A',
    name: 'Aprendiendo Inglés',
    chapters: [
      chapter(colors),
      chapter(animals),
      chapter(house),
      chapter(numbers),
      chapter(greetings),
      soon('🧍', 'Mi Cuerpo', 'Pronto'),
      soon('👨‍👩‍👧', 'Mi Familia', 'Pronto'),
      soon('🍎', 'Comida', 'Pronto')
    ]
  },
  {
    id: 'es',
    icon: '🧠',
    kicker: 'Track B',
    name: 'Jugando y Pensando',
    chapters: [
      chapter(memory),
      chapter(oddOneOut),
      soon('🔁', 'Sigue el patrón', 'Pronto'),
      soon('📏', 'Grande y chico', 'Pronto'),
      soon('👂', 'Escucha y sigue', 'Pronto'),
      soon('📖', 'Ordena la historia', 'Pronto')
    ]
  }
];
