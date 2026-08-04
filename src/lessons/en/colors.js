import { collectMatch } from '../../engines/collectMatch.js';

/* Colores — migrada del prototipo aprende_colores_ingles.html.
   La forma de cada figura cambia al azar a propósito: lo que se repite
   entre los 4 objetivos es el color, no la silueta. */
export const colors = {
  id: 'colors',
  track: 'en',
  icon: '🎨',
  menuTitle: 'Colores',
  menuMeta: '6 colores · 10 min',
  title: 'Aprende los Colores 🎈',
  subtitle: 'Un juego para aprender los colores en inglés, jugando',
  note: 'Para jugar acompañada de un adulto · unos 10 minutos',
  adultNote: 'Ya conoce los colores en español, así que aquí sólo está aprendiendo cómo suenan en inglés. Repite la palabra con ella cuando la escuche — no hace falta traducir cada vez.',
  engineName: 'collectMatch',
  createEngine: collectMatch,
  final: {
    title: '¡Lo lograste!',
    subtitle: 'Aprendiste 6 colores en inglés'
  },
  medals: (lesson) => lesson.data.items.map((item) => ({ color: item.hex })),
  data: {
    needed: 4,
    totalTiles: 9,
    visual: 'shape',
    items: [
      { id: 'red',    en: 'Red',    es: 'rojo',      hex: '#E53935' },
      { id: 'yellow', en: 'Yellow', es: 'amarillo',  hex: '#FDD835' },
      { id: 'blue',   en: 'Blue',   es: 'azul',      hex: '#1E88E5' },
      { id: 'green',  en: 'Green',  es: 'verde',     hex: '#43A047' },
      { id: 'orange', en: 'Orange', es: 'naranja',   hex: '#FB8C00' },
      { id: 'purple', en: 'Purple', es: 'morado',    hex: '#8E24AA' }
    ]
  }
};
