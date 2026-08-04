import { roomSequence } from '../../engines/roomSequence.js';

/* La Casa — migrada del prototipo aprende_casa_ingles.html.
   17 palabras en 5 habitaciones. "Lamp", "Window" y "Sink" aparecen a
   propósito en dos habitaciones distintas: reencontrar una palabra en
   otro contexto vale más que sumar una palabra nueva. */

const TABLE_SVG = '<svg viewBox="0 0 100 100"><rect x="8" y="34" width="84" height="10" rx="4" fill="#B5794B"/><rect x="16" y="44" width="9" height="42" rx="3" fill="#8C5A34"/><rect x="75" y="44" width="9" height="42" rx="3" fill="#8C5A34"/></svg>';

export const house = {
  id: 'house',
  track: 'en',
  icon: '🏠',
  menuTitle: 'La Casa',
  menuMeta: '5 habitaciones · 12 min',
  title: 'Recorre la Casa 🏠',
  subtitle: 'Aprende los objetos de la casa en inglés, habitación por habitación',
  note: 'Para jugar acompañada de un adulto · unos 10-12 minutos',
  adultNote: 'Después de jugar, busquen juntas los mismos objetos en la casa de verdad y nómbralos en inglés. Es la forma más rápida de que la palabra salga de la pantalla.',
  engineName: 'roomSequence',
  createEngine: roomSequence,
  final: {
    title: '¡Recorriste toda la casa!',
    subtitle: 'Aprendiste 5 habitaciones y sus objetos en inglés'
  },
  medals: (lesson) => lesson.data.scenes.map((scene) => ({ emoji: scene.icon })),
  data: {
    scenes: [
      {
        id: 'living', en: 'Living Room', es: 'sala de estar', icon: '🛋️',
        objects: [
          { id: 'sofa', en: 'Sofa', es: 'sofá', emoji: '🛋️' },
          { id: 'door', en: 'Door', es: 'puerta', emoji: '🚪' },
          { id: 'tv',   en: 'TV',   es: 'televisor', emoji: '📺' },
          { id: 'lamp', en: 'Lamp', es: 'lámpara', emoji: '💡' }
        ]
      },
      {
        id: 'dining', en: 'Dining Room', es: 'comedor', icon: '🍽️',
        objects: [
          { id: 'table', en: 'Table', es: 'mesa', svg: TABLE_SVG },
          { id: 'chair', en: 'Chair', es: 'silla', emoji: '🪑' },
          { id: 'plate', en: 'Plate', es: 'plato', emoji: '🍽️' },
          { id: 'cup',   en: 'Cup',   es: 'taza', emoji: '🥤' }
        ]
      },
      {
        id: 'kitchen', en: 'Kitchen', es: 'cocina', icon: '🍳',
        objects: [
          { id: 'stove',  en: 'Stove',  es: 'cocina/estufa', emoji: '🍳' },
          { id: 'sink',   en: 'Sink',   es: 'lavaplatos', emoji: '🚰' },
          { id: 'spoon',  en: 'Spoon',  es: 'cuchara', emoji: '🥄' },
          { id: 'window', en: 'Window', es: 'ventana', emoji: '🪟' }
        ]
      },
      {
        id: 'bedroom', en: 'Bedroom', es: 'dormitorio', icon: '🛏️',
        objects: [
          { id: 'bed',     en: 'Bed',        es: 'cama', emoji: '🛏️' },
          { id: 'teddy',   en: 'Teddy Bear', es: 'oso de peluche', emoji: '🧸' },
          { id: 'lamp2',   en: 'Lamp',       es: 'lámpara', emoji: '💡' },
          { id: 'window2', en: 'Window',     es: 'ventana', emoji: '🪟' }
        ]
      },
      {
        id: 'bathroom', en: 'Bathroom', es: 'baño', icon: '🛁',
        objects: [
          { id: 'toilet',  en: 'Toilet',  es: 'inodoro', emoji: '🚽' },
          { id: 'bathtub', en: 'Bathtub', es: 'tina', emoji: '🛁' },
          { id: 'mirror',  en: 'Mirror',  es: 'espejo', emoji: '🪞' },
          { id: 'sink2',   en: 'Sink',    es: 'lavamanos', emoji: '🚰' }
        ]
      }
    ]
  }
};
