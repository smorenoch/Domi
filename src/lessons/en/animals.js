import { collectMatch } from '../../engines/collectMatch.js';

/* Animales — migrada del prototipo aprende_animales_ingles.html.
   Cada acierto encola dos audios: la palabra y la onomatopeya en inglés.
   El sonido es el anclaje: "Dog" solo es una etiqueta, "Dog → Woof woof"
   es una escena que se recuerda. */
export const animals = {
  id: 'animals',
  track: 'en',
  icon: '🐾',
  menuTitle: 'Animales',
  menuMeta: '6 animales · 10 min',
  title: 'Aprende los Animales 🐾',
  subtitle: 'Escucha, busca y encuentra los animales en inglés',
  note: 'Para jugar acompañada de un adulto · unos 10 minutos',
  adultNote: 'Después de cada animal suena su sonido en inglés ("woof woof", "moo"). Imítalo tú también: el sonido se imita antes que la palabra, y arrastra la palabra con él.',
  engineName: 'collectMatch',
  createEngine: collectMatch,
  final: {
    title: '¡Lo lograste!',
    subtitle: 'Aprendiste 6 animales en inglés'
  },
  medals: (lesson) => lesson.data.items.map((item) => ({ emoji: item.emoji })),
  data: {
    needed: 4,
    totalTiles: 9,
    visual: 'emoji',
    items: [
      { id: 'dog',   en: 'Dog',   es: 'perro',   emoji: '🐶', reinforce: 'Woof woof!' },
      { id: 'cat',   en: 'Cat',   es: 'gato',    emoji: '🐱', reinforce: 'Meow!' },
      { id: 'horse', en: 'Horse', es: 'caballo', emoji: '🐴', reinforce: 'Neigh!' },
      { id: 'cow',   en: 'Cow',   es: 'vaca',    emoji: '🐮', reinforce: 'Moo!' },
      { id: 'pig',   en: 'Pig',   es: 'cerdo',   emoji: '🐷', reinforce: 'Oink oink!' },
      { id: 'duck',  en: 'Duck',  es: 'pato',    emoji: '🦆', reinforce: 'Quack quack!' }
    ]
  }
};
