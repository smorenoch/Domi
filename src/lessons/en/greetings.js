import { phraseSituation } from '../../engines/phraseSituation.js';

/* Saludos — lección nueva (Fase 1).

   Son las primeras frases completas, no palabras sueltas. A los 3 años
   las fórmulas sociales se aprenden enteras, como un bloque, ligadas a
   un momento ("cuando alguien llega"). Por eso cada tarjeta muestra la
   situación en español (para el adulto) y la frase en inglés (para ella).

   Es una lección receptiva: se escucha y se asocia. No se evalúa
   pronunciación ni se usa micrófono. */

export const greetings = {
  id: 'greetings',
  track: 'en',
  icon: '👋',
  menuTitle: 'Saludos',
  menuMeta: '6 frases · 8 min',
  title: 'Saluda en Inglés 👋',
  subtitle: 'Frases para usar todos los días',
  note: 'Para jugar acompañada de un adulto · unos 8 minutos',
  adultNote: 'Son frases para usar en el día a día. Repítelas tú también en el momento real (al llegar, al despedirse, al pedir algo) — ahí es donde se fijan, no en la pantalla.',
  engineName: 'phraseSituation',
  createEngine: phraseSituation,
  final: {
    title: '¡Ya sabes saludar!',
    subtitle: 'Aprendiste 6 frases en inglés'
  },
  medals: (lesson) => lesson.data.items.map((item) => ({ emoji: item.emoji })),
  data: {
    repeats: 3,
    items: [
      { id: 'hello',     en: 'Hello!',     es: 'hola',            emoji: '🙋‍♀️', situation: 'Cuando alguien llega',            hint: 'Tócala para escuchar' },
      { id: 'byebye',    en: 'Bye bye!',   es: 'adiós',           emoji: '👋',   situation: 'Cuando alguien se va',            hint: 'Tócalo para escuchar' },
      { id: 'please',    en: 'Please',     es: 'por favor',       emoji: '🙏',   situation: 'Cuando pedimos algo',             hint: 'Tócalo para escuchar' },
      { id: 'thankyou',  en: 'Thank you!', es: 'gracias',         emoji: '🤗',   situation: 'Cuando nos dan algo',             hint: 'Tócalo para escuchar' },
      { id: 'yes',       en: 'Yes',        es: 'sí',              emoji: '👍',   situation: 'Cuando queremos algo',            hint: 'Tócalo para escuchar' },
      { id: 'no',        en: 'No',         es: 'no',              emoji: '🙅‍♀️', situation: 'Cuando no queremos algo',         hint: 'Tócala para escuchar' }
    ]
  }
};
