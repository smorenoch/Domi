import { countingTap } from '../../engines/countingTap.js';

/* Números 1-10 — lección nueva (Fase 1).

   Cada número usa un objeto distinto y familiar, por dos razones:
   evita que el número quede pegado a un solo objeto ("three" = manzanas),
   y mantiene la atención en 10 rondas seguidas.

   Los objetos son de cantidad discreta y contable de un vistazo — nada
   que venga en racimo (uvas) o que se confunda entre sí. */

export const numbers = {
  id: 'numbers',
  track: 'en',
  icon: '🔢',
  menuTitle: 'Números',
  menuMeta: 'one – ten · 10 min',
  title: 'Cuenta en Inglés 🔢',
  subtitle: 'Toca cada cosita y escucha cómo se cuenta en inglés',
  note: 'Para jugar acompañada de un adulto · unos 8-10 minutos',
  adultNote: 'Ya sabe contar en español hasta 15. Aquí sólo aprende cómo se dicen los números en inglés — no hace falta explicarle qué es contar. Cuenta en voz alta con ella mientras toca.',
  engineName: 'countingTap',
  createEngine: countingTap,
  final: {
    title: '¡Contaste hasta diez!',
    subtitle: 'Aprendiste los números del one al ten',
  },
  medals: (lesson) => lesson.data.items.map((item) => ({ emoji: item.emoji })),
  data: {
    items: [
      { n: 1,  en: 'One',   es: 'un',     emoji: '🍎', enThing: 'apple',        esThing: 'manzana',      prompt: 'Toca la manzana' },
      { n: 2,  en: 'Two',   es: 'dos',    emoji: '🐥', enThing: 'chicks',       esThing: 'pollitos',     prompt: 'Toca los 2 pollitos' },
      { n: 3,  en: 'Three', es: 'tres',   emoji: '🎈', enThing: 'balloons',     esThing: 'globos',       prompt: 'Toca los 3 globos' },
      { n: 4,  en: 'Four',  es: 'cuatro', emoji: '🐟', enThing: 'fish',         esThing: 'pececitos',    prompt: 'Toca los 4 pececitos' },
      { n: 5,  en: 'Five',  es: 'cinco',  emoji: '⭐', enThing: 'stars',        esThing: 'estrellas',    prompt: 'Toca las 5 estrellas' },
      { n: 6,  en: 'Six',   es: 'seis',   emoji: '🌸', enThing: 'flowers',      esThing: 'flores',       prompt: 'Toca las 6 flores' },
      { n: 7,  en: 'Seven', es: 'siete',  emoji: '🍓', enThing: 'strawberries', esThing: 'frutillas',    prompt: 'Toca las 7 frutillas' },
      { n: 8,  en: 'Eight', es: 'ocho',   emoji: '🐞', enThing: 'ladybugs',     esThing: 'chinitas',     prompt: 'Toca las 8 chinitas' },
      { n: 9,  en: 'Nine',  es: 'nueve',  emoji: '🚗', enThing: 'cars',         esThing: 'autos',        prompt: 'Toca los 9 autos' },
      { n: 10, en: 'Ten',   es: 'diez',   emoji: '🐝', enThing: 'bees',         esThing: 'abejas',       prompt: 'Toca las 10 abejas' }
    ]
  }
};
