import { memoryPairs } from '../../engines/memoryPairs.js';

/* Memorama — Track B (Fase 2).

   No es una lección de idioma: entrena memoria de trabajo y atención.
   Todo el audio va en español y con instrucciones completas, porque
   entender la instrucción hablada es parte de lo que se practica.

   Tres tableros que crecen (3 → 4 → 5 parejas). El mazo son animales
   que ya domina en español: reencontrarlos acá refuerza vocabulario que
   ya tiene mientras la cabeza trabaja en otra cosa. */

export const memory = {
  id: 'memory',
  track: 'es',
  icon: '🃏',
  menuTitle: 'Memorama',
  menuMeta: '3 tableros · 10 min',
  title: 'Memorama 🃏',
  subtitle: 'Da vuelta las cartas y encuentra las parejas',
  note: 'Para jugar acompañada de un adulto · unos 10 minutos',
  adultNote: 'Si le cuesta, no le muestres dónde está la carta: dale una pista de lugar ("estaba cerca de ti"). No hay límite de tiempo — que vaya a su ritmo. Los tableros van creciendo solos.',
  engineName: 'memoryPairs',
  createEngine: memoryPairs,
  celebText: '¡Muy bien! 🎉',
  final: {
    title: '¡Encontraste todas!',
    subtitle: 'Completaste los tres tableros'
  },
  medals: () => [{ emoji: '🃏' }, { emoji: '🃏' }, { emoji: '🃏' }],
  data: {
    levels: [
      { pairs: 3, columns: 3, instruction: 'Encuentra las parejas. Toca una carta.' },
      { pairs: 4, columns: 4, instruction: 'Ahora hay más cartas. Busca las parejas.' },
      { pairs: 5, columns: 5, instruction: 'Último tablero. Encuentra todas las parejas.' }
    ],
    deck: [
      { id: 'dog',    emoji: '🐶', es: 'perro',    esPlural: 'perros' },
      { id: 'cat',    emoji: '🐱', es: 'gato',     esPlural: 'gatos' },
      { id: 'cow',    emoji: '🐮', es: 'vaca',     esPlural: 'vacas' },
      { id: 'duck',   emoji: '🦆', es: 'pato',     esPlural: 'patos' },
      { id: 'horse',  emoji: '🐴', es: 'caballo',  esPlural: 'caballos' },
      { id: 'pig',    emoji: '🐷', es: 'cerdo',    esPlural: 'cerdos' },
      { id: 'bee',    emoji: '🐝', es: 'abeja',    esPlural: 'abejas' },
      { id: 'fish',   emoji: '🐟', es: 'pescado',  esPlural: 'pescados' },
      { id: 'bird',   emoji: '🐦', es: 'pajarito', esPlural: 'pajaritos' },
      { id: 'rabbit', emoji: '🐰', es: 'conejo',   esPlural: 'conejos' }
    ]
  }
};
