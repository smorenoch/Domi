import { classification } from '../../engines/classification.js';

/* ¿Cuál no va? — Track B (Fase 2).

   Habilidad: pensamiento categórico. Las seis categorías son todas de
   uso cotidiano para ella (animales, frutas, vehículos, ropa, juguetes,
   plantas) y el intruso siempre viene de otra categoría igual de
   conocida — no se trata de adivinar una categoría rara, sino de notar
   que una cosa no pertenece al grupo.

   Los nombres llevan artículo para que la frase de refuerzo suene
   natural al leerse en voz alta ("La manzana no va, porque..."). */

export const oddOneOut = {
  id: 'odd-one-out',
  track: 'es',
  icon: '🗂️',
  menuTitle: '¿Cuál no va?',
  menuMeta: '6 rondas · 8 min',
  title: '¿Cuál no va? 🗂️',
  subtitle: 'Mira las cuatro y toca la que no pertenece al grupo',
  note: 'Para jugar acompañada de un adulto · unos 8 minutos',
  adultNote: 'Si duda, pregúntale en voz alta por qué eligió esa — verbalizar el porqué es la mitad del aprendizaje. Si se equivoca, no la corrijas: pídele que nombre las otras tres en voz alta y sola se dará cuenta.',
  engineName: 'classification',
  createEngine: classification,
  celebText: '¡Muy bien! 🎉',
  final: {
    title: '¡Muy bien pensado!',
    subtitle: 'Completaste las 6 rondas'
  },
  medals: (lesson) => lesson.data.sets.map((set) => ({ emoji: set.intruder.emoji })),
  data: {
    instruction: 'Toca el que no va con los demás.',
    sets: [
      {
        category: 'animales',
        items: [{ emoji: '🐶', name: 'el perro' }, { emoji: '🐱', name: 'el gato' }, { emoji: '🐮', name: 'la vaca' }],
        intruder: { emoji: '🍎', name: 'la manzana' }
      },
      {
        category: 'frutas',
        items: [{ emoji: '🍎', name: 'la manzana' }, { emoji: '🍌', name: 'el plátano' }, { emoji: '🍓', name: 'la frutilla' }],
        intruder: { emoji: '🚗', name: 'el auto' }
      },
      {
        category: 'cosas para andar',
        items: [{ emoji: '🚗', name: 'el auto' }, { emoji: '🚌', name: 'el bus' }, { emoji: '🚲', name: 'la bicicleta' }],
        intruder: { emoji: '🐴', name: 'el caballo' }
      },
      {
        category: 'ropa',
        items: [{ emoji: '👕', name: 'la polera' }, { emoji: '👖', name: 'el pantalón' }, { emoji: '🧦', name: 'el calcetín' }],
        intruder: { emoji: '🍌', name: 'el plátano' }
      },
      {
        category: 'juguetes',
        items: [{ emoji: '🧸', name: 'el osito' }, { emoji: '🎈', name: 'el globo' }, { emoji: '⚽', name: 'la pelota' }],
        intruder: { emoji: '🥕', name: 'la zanahoria' }
      },
      {
        category: 'plantas',
        items: [{ emoji: '🌳', name: 'el árbol' }, { emoji: '🌸', name: 'la flor' }, { emoji: '🌿', name: 'la hoja' }],
        intruder: { emoji: '🛁', name: 'la tina' }
      }
    ]
  }
};
