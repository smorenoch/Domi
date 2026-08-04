/* Página de lección: busca la lección en el catálogo y la entrega al
   shell. Toda la mecánica vive en LessonRunner y en el motor. */

import { go } from '../lib/router.js';
import { getLesson } from '../lessons/index.js';
import { LessonRunner } from '../components/LessonRunner.js';

export function LessonPage({ id }) {
  const lesson = getLesson(id);
  if (!lesson) {
    go('/indice');
    return null;
  }
  return LessonRunner(lesson, { onExit: () => go('/indice') });
}
