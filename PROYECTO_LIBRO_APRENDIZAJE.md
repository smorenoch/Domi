# Libro Web de Aprendizaje — Brief de Proyecto para Claude Code

## 0. Cómo usar este documento

Este documento es el **brief de producto y arquitectura** para construir un "libro web" interactivo de lecciones, dirigido a una niña de 3 años. Está escrito para que Claude Code lo use como fuente de verdad al planificar y construir, no como código a copiar literalmente.

**Antes de escribir código**, lee completo este documento, en especial la sección 11 (Fases de desarrollo) y la sección 12 (Supuestos a confirmar con el usuario). No implementes todas las fases en una sola sesión — se construye por fases, confirmando con el usuario al cerrar cada una.

**Insumos existentes**: ya existen 3 prototipos funcionales construidos en HTML/CSS/JS vanilla (sin build step), que deben tratarse como **la referencia de calidad y el punto de partida técnico**, no como algo a rehacer desde cero:
- `aprende_colores_ingles.html` — motor de juego "collect-match" (colectar N objetos que comparten un atributo, ej. color)
- `aprende_animales_ingles.html` — mismo motor "collect-match", aplicado a identidad de objeto (emoji) + refuerzo con onomatopeya
- `aprende_casa_ingles.html` — motor de juego "room-sequence" (una escena fija con N objetos, se pide encontrarlos uno a uno)

Copia estos 3 archivos a `/reference/` en el repo antes de empezar. Toda la sección 6 (sistema de diseño) y sección 8 (motores de juego) está extraída directamente de ese código ya validado.

---

## 1. Rol y estándar de calidad esperado

Actúa en dos roles simultáneos para todo el proyecto:

- **Profesor de inglés especializado en primera infancia (0-6 años), con formación en pedagogía**: cada decisión de contenido, ritmo, repetición y feedback debe tener justificación pedagógica, no solo ser "un juego más". Prioriza exposición repetida y de bajo riesgo emocional por sobre evaluación o corrección.
- **Desarrollador web senior, foco en frontend**: código limpio, componentizado, sin duplicación entre lecciones, con un sistema de diseño y un motor de audio compartidos. El resultado debe sentirse como **un producto único y coherente**, no como 12 mini-webs pegadas con un menú.

El usuario final (adulto) espera un desarrollo "súper profesional y fluido" — eso significa: transiciones suaves, sin bugs de estado, textos curados (no lorem ipsum ni placeholders), y consistencia visual estricta entre lecciones.

---

## 2. Perfil de la usuaria

Niña de 3 años, hispanohablante, con:
- Vocabulario amplio en español y capacidad de sostener parte de una conversación.
- Números del 1 al 15 en español (dominados).
- Muchos animales, colores y partes de la naturaleza en español (dominados).
- **Cero español→inglés previo**, salvo lo ya cubierto por los 3 prototipos (colores, animales, objetos de casa).

Esto es clave para el diseño de contenidos: para el track de inglés, **no hay que enseñar el concepto** (ya sabe qué es un número, un animal, contar) — solo la **etiqueta en inglés** sobre un concepto que ya domina en español. Esto acelera mucho el aprendizaje real vs. enseñar concepto + idioma a la vez.

Contexto de uso: tablet, sesiones de 2-3 veces por semana, acompañada siempre de un adulto, sesión objetivo de 8-12 minutos.

---

## 3. Filosofía pedagógica (aplica a todo el proyecto)

1. **Exposición antes que evaluación.** El objetivo a esta edad es la asociación repetida sonido-imagen, no "aprobar" una prueba. Nunca hay una respuesta "mal" que se sienta como fracaso — solo se reintenta.
2. **Refuerzo positivo exclusivo.** Sin sonidos negativos, sin mensajes de error, sin contadores de fallos visibles para la niña.
3. **Repetición espaciada informal.** Las mismas palabras deben reaparecer en más de una lección cuando tenga sentido (ej. "window" en dos habitaciones distintas) — la repetición entre contextos es más valiosa que la novedad constante.
4. **Sesión corta y completa.** 8-12 minutos reales de foco. Ninguna lección debe requerir más de eso para completarse una vez.
5. **Audio + imagen, nunca texto como requisito.** La niña no lee. El texto en pantalla es apoyo para el adulto, nunca la única vía para entender qué hacer.
6. **Dos idiomas, dos roles distintos** (ver sección 4) — no mezclar sus funciones.
7. **El adulto es parte del sistema, no un espectador.** Cada lección debe traer contexto claro para que el adulto sepa qué está pasando y cómo ayudar, sin tener que adivinar.

---

## 4. Los dos tracks — y por qué su audio funciona distinto

### Track A — Inglés (adquisición de segundo idioma)
- El audio de **vocabulario objetivo es siempre en inglés**.
- El juego **no debe narrar instrucciones en español** — el adulto acompañante cumple ese rol (decisión ya validada en los 3 prototipos existentes).
- Texto en pantalla: palabra en inglés grande + traducción en español pequeña entre paréntesis, solo como referencia para el adulto.

### Track B — Español, desarrollo cognitivo
- Es la contraparte natural: aquí el objetivo **no es idioma, es proceso cognitivo** (memoria, clasificación, secuencia, comparación, comprensión auditiva).
- El audio **sí debe narrar instrucciones completas en español** ("Encuentra el círculo rojo"), porque la comprensión auditiva de instrucciones es parte de la habilidad que se está desarrollando.
- No reutilices el motor de voz en inglés para este track — usa `lang = 'es-CL'` o `'es-ES'` según disponibilidad de voces.

No mezclar ambos tracks dentro de una misma lección.

---

## 5. Arquitectura de la aplicación

### 5.1 Concepto: "El Libro"
Pantalla de inicio = portada del libro. Desde ahí se accede a un **índice/menú** con capítulos organizados por track:

```
📖 Portada
 ├── 🌎 Aprendiendo Inglés (Track A)
 │     ├── 🎨 Colores       [construido]
 │     ├── 🐾 Animales      [construido]
 │     ├── 🏠 La Casa       [construido]
 │     ├── 🔢 Números       [nuevo]
 │     ├── 👋 Saludos       [nuevo]
 │     ├── 🧍 Mi Cuerpo      [nuevo, fase posterior]
 │     ├── 👨‍👩‍👧 Mi Familia    [nuevo, fase posterior]
 │     └── 🍎 Comida        [nuevo, fase posterior]
 └── 🧠 Jugando y Pensando (Track B)
       ├── 🃏 Memorama          [nuevo]
       ├── 🗂️ ¿Cuál no va?      [nuevo]
       ├── 🔁 Sigue el patrón   [fase posterior]
       ├── 📏 Grande y chico    [fase posterior]
       ├── 👂 Escucha y sigue   [fase posterior]
       └── 📖 Ordena la historia [fase posterior]
```

Cada ícono de capítulo muestra: estado (nueva / en progreso / completada, vía localStorage), y al tocar entra directo a la lección — sin pasos intermedios innecesarios.

### 5.2 Stack técnico recomendado
- **Sin backend, sin base de datos.** Es uso local de un solo niño en una tablet; no hay necesidad de cuentas ni sincronización multi-dispositivo en v1.
- **Vite + JavaScript vanilla** (sin framework de UI). Los 3 prototipos ya están en vanilla JS y funcionan bien; introducir React/Vue solo agregaría complejidad sin beneficio real para esta interacción (mayormente taps + animaciones CSS + audio). Vite solo se usa por comodidad de desarrollo (dev server, módulos ES, build a estático).
- **Progreso**: `localStorage`, namespaced (ej. `libro:progress:v1`). Esto es una app real desplegada/local, no un artifact de claude.ai — `localStorage` es válido y correcto acá (a diferencia de restricciones que aplican solo dentro del sandbox de artifacts).
- **Sin analítica, sin telemetría, sin llamadas de red salvo Google Fonts** (igual que los 3 prototipos).
- **Despliegue**: dejar el build estático listo para correr localmente (`npm run build` + servir `/dist`) y opcionalmente desplegable en el VPS/EasyPanel que ya usa el usuario para otros proyectos — esto es un detalle de infraestructura a confirmar con el usuario, no asumir Docker/EasyPanel de entrada.

### 5.3 Estructura de carpetas sugerida

```
/src
  /lib
    audio.js           → motor de voz + tonos (extraído de los 3 prototipos)
    storage.js          → progreso vía localStorage
    tokens.css           → variables de diseño compartidas
  /components
    SunMascot.js         → mascota reutilizable (idle / happy)
    ProgressDots.js
    Celebration.js       → overlay de confeti + fanfarria
    CornerButtons.js      → mute + home
  /engines
    collectMatch.js       → motor ya validado (colores, animales)
    roomSequence.js        → motor ya validado (casa, cuerpo, familia)
    countingTap.js          → nuevo (números)
    phraseSituation.js       → nuevo (saludos)
    memoryPairs.js            → nuevo (memorama)
    classification.js          → nuevo (¿cuál no va?)
  /lessons
    /en
      colors.js, animals.js, house.js, numbers.js, greetings.js, ...
    /es
      memory.js, classification.js, ...
  /pages (o rutas, si se usa un router simple)
    index.html (portada + menú)
App.js / router mínimo
/reference   → los 3 HTML originales, sin modificar, como consulta
```

No es obligatorio seguir esta estructura al pie de la letra, pero **sí es obligatorio** que exista una separación real entre motor de juego (`engines`), contenido de lección (`lessons`) y sistema de diseño (`lib`, `components`) — nada de duplicar el bloque `<script>` completo por cada lección como hacían los prototipos (ahí era aceptable porque eran artifacts standalone; acá no).

---

## 6. Sistema de diseño (ya validado, mantener consistente)

| Token | Valor |
|---|---|
| `--sky-top` | `#BDEBFF` |
| `--sky-bottom` | `#FFF3DA` |
| `--sun` | `#FFD35C` |
| `--grass` | `#7BC96F` |
| `--grass-dark` | `#5FA654` |
| `--ink` (texto) | `#3A3358` |
| `--card` | `#FFFFFF` |
| `--primary` (botones/acento) | `#FF6F91` |
| `--primary-dark` | `#E85575` |

- **Tipografía display**: "Baloo 2" (títulos, palabras objetivo, botones).
- **Tipografía body**: "Nunito" (texto secundario, traducciones).
- **Mascota**: un sol con cara amigable, dos estados (`idle` con animación de rotación de rayos respetando `prefers-reduced-motion`, y `happy` con ojos/boca de celebración) — es el hilo visual que conecta todas las lecciones, como una mascota de marca. Debe aparecer en portada, en cada lección y en la celebración.
- **Fondo**: cielo con gradiente + franja de pasto abajo, en todas las pantallas.
- **Botones grandes**: `border-radius: 100px`, sombra tipo "botón físico" (offset shadow que se achica al presionar), mínimo ~48px de alto para dedos de niño.
- **Sin scroll**: cada pantalla ocupa el viewport completo (`overflow: hidden`, layouts en `vh`/`vw`/`clamp()`).
- **`touch-action: manipulation`, `user-select: none`** en toda la app — evita zoom accidental y selección de texto en tablet.

---

## 7. Motor de audio (extraer tal cual del código existente)

Dos primitivas ya probadas, sin dependencias externas:

1. **`speakQueue(list, lang)`** — usa `SpeechSynthesisUtterance`, encola utterances sin cortarlas entre sí (permite decir palabra + refuerzo, ej. "Dog" → "Woof woof!"). Selecciona voz por prefijo de idioma (`en` o `es`) de `speechSynthesis.getVoices()`, con manejo de carga asíncrona vía `onvoiceschanged`. Rate ~0.82-0.85, pitch ~1.1 para claridad y tono amigable.
2. **`tone(freq, start, dur, type, vol)`** sobre Web Audio API — genera los chimes (`playCorrect`, `playWrong` suave y no punitivo, `playFanfare`) sin ningún archivo de audio externo. Requiere `ensureAudio()` en el primer gesto del usuario (botón "Empezar") para desbloquear el `AudioContext`.

**Importante**: antes de la primera sesión real, el adulto debe poder confirmar que el dispositivo tiene una voz en inglés instalada. Si no la detecta, la app no debe fallar en silencio — considera un aviso discreto (no bloqueante) en la portada tipo "revisa el volumen y que tu tablet tenga voz en inglés instalada" la primera vez que se abre.

---

## 8. Motores de juego (engines)

### Ya construidos — reutilizar sin rediseñar
- **`collectMatch`**: grilla de 9 tiles, se pide encontrar N (3-4) que comparten un atributo (color, o identidad de emoji) entre distractores. Bueno para conceptos que naturalmente se repiten (colores, animales en una escena).
- **`roomSequence`**: escena fija de 4 objetos visibles simultáneamente, se pide encontrarlos uno a la vez en orden aleatorio, con feedback de "encontrado" persistente (no desaparecen). Bueno para objetos únicos/no repetibles (una puerta, una silla, una parte del cuerpo).

### Nuevos — a diseñar en las fases correspondientes
- **`countingTap`** (Números): se muestran N objetos idénticos (ej. 3 manzanas); tocar cada uno dice el número en inglés en voz alta secuencialmente (1, 2, 3), y al final aparece el numeral grande + su nombre en inglés. Aprovecha que la niña ya sabe contar en español — solo transfiere la etiqueta.
- **`phraseSituation`** (Saludos): tarjetas de situación simple (alguien llega → "Hello!", alguien se despide → "Bye bye!") con reproducción y botón de repetir. Es receptivo (la niña escucha y asocia), no productivo — no se evalúa pronunciación, no hay micrófono involucrado.
- **`memoryPairs`** (Memorama, Track B): cartas boca abajo con animales/objetos ya conocidos, se voltean de a dos. Narración en español guía la instrucción.
- **`classification`** (¿Cuál no va?, Track B): 4 imágenes, 3 de una categoría y 1 intrusa; se pide tocar la que no pertenece, con narración en español.

Los siguientes se documentan como backlog para fases posteriores, sin diseñar en detalle todavía: `patternSequence` (secuencias/patrones), `comparison` (tamaños), `instructionFollow` (instrucciones de 2 pasos), `storySequence` (ordenar una secuencia narrativa).

---

## 9. Contenido — Track A: Inglés

| Lección | Vocabulario objetivo | Motor | Contexto para el adulto (mostrar en la app) |
|---|---|---|---|
| Colores *(hecho)* | red, blue, yellow, green, orange, purple | collectMatch | — |
| Animales *(hecho)* | dog, cat, horse, cow, pig, duck | collectMatch | — |
| La Casa *(hecho)* | 17 palabras, 5 habitaciones | roomSequence | — |
| Números | one–ten | countingTap | "Ya sabe contar en español hasta 15. Aquí solo aprende cómo se dicen los números en inglés — no hace falta explicarle qué es contar." |
| Saludos | Hello, Bye bye, Please, Thank you, Yes, No | phraseSituation | "Son frases para usar en el día a día. Repítelas tú también en el momento real (al llegar, al despedirse) para reforzar fuera de la pantalla." |
| Mi Cuerpo *(fase posterior)* | head, nose, eyes, mouth, hands, feet | roomSequence | "Puedes jugar a tocar tu propio cuerpo junto con la pantalla — refuerza mucho más que solo mirar." |
| Mi Familia *(fase posterior)* | mom, dad, baby, grandma, grandpa | roomSequence | — |
| Comida *(fase posterior)* | apple, banana, milk, bread, water | collectMatch | — |

---

## 10. Contenido — Track B: Español, desarrollo cognitivo

| Actividad | Habilidad que desarrolla | Motor | Contexto para el adulto |
|---|---|---|---|
| Memorama | Memoria de trabajo, atención sostenida | memoryPairs | "Si le cuesta, empieza con menos parejas y ve subiendo. No hay límite de tiempo — que vaya a su ritmo." |
| ¿Cuál no va? | Pensamiento categórico | classification | "Si duda, pregúntale en voz alta por qué eligió esa — verbalizar el porqué es parte del aprendizaje." |
| Sigue el patrón *(fase posterior)* | Lógica secuencial temprana | patternSequence | — |
| Grande y chico *(fase posterior)* | Conceptos comparativos | comparison | — |
| Escucha y sigue *(fase posterior)* | Comprensión auditiva, instrucciones de 2 pasos | instructionFollow | — |
| Ordena la historia *(fase posterior)* | Comprensión narrativa y causalidad | storySequence | — |

---

## 11. Fases de desarrollo

No construir todo de una vez. Cerrar y confirmar con el usuario al final de cada fase antes de avanzar a la siguiente.

**Fase 0 — Fundación**
- Extraer de los 3 prototipos: `lib/audio.js`, `tokens.css`, `SunMascot`, `Celebration`, `CornerButtons`, `ProgressDots`.
- Construir portada + menú navegable (aunque casi todo esté "bloqueado"/pendiente).
- Migrar las 3 lecciones existentes al nuevo shell, usando los motores compartidos (`collectMatch`, `roomSequence`) en vez de código repetido.
- **Criterio de cierre**: las 3 lecciones existentes funcionan igual o mejor que los prototipos originales, dentro del nuevo shell, con progreso guardándose en `localStorage`.

**Fase 1 — Primeras dos lecciones nuevas de inglés**
- Construir `countingTap` → lección Números.
- Construir `phraseSituation` → lección Saludos.
- **Criterio de cierre**: ambas lecciones jugables de principio a fin, con audio verificado.

**Fase 2 — Primeras dos actividades de Track B**
- Construir `memoryPairs` → Memorama.
- Construir `classification` → ¿Cuál no va?
- **Criterio de cierre**: narración completa en español funcionando, distinta del motor de voz en inglés.

**Fase 3 — Expandir Track A**
- Mi Cuerpo, Mi Familia, Comida (reutilizando motores ya existentes, bajo riesgo).

**Fase 4 — Expandir Track B**
- Los 4 motores restantes de la sección 10.

**Fase 5 — Pulido**
- Revisión de accesibilidad (`prefers-reduced-motion`, tamaños táctiles, contraste).
- Revisión de los textos de contexto para el adulto en cada lección.
- Opcional: vista simple para el adulto de "qué se ha practicado esta semana", basada en `localStorage`.

---

## 12. Supuestos a confirmar con el usuario (no asumir en silencio)

1. **Sin backend/base de datos en v1** — se asume que no hace falta sincronizar progreso entre dispositivos ni tener múltiples perfiles de niños. Si eso cambia, la arquitectura de la sección 5 debe revisarse.
2. **Vite + vanilla JS, sin framework de UI** — se prioriza consistencia con los 3 prototipos y simplicidad sobre "lo que se usa normalmente" en otros proyectos del usuario (Node/Express/MySQL). Confirmar si prefiere mantenerlo así o si tiene una razón para preferir otro stack.
3. **Alcance de v1 = Fase 0 a Fase 2** (fundación + 2 lecciones nuevas por track). Fases 3-5 quedan como roadmap documentado, no como compromiso de esta primera entrega.
4. **Voces en inglés/español del dispositivo**: la app depende de que la tablet tenga voces instaladas para ambos idiomas. No hay fallback con audio pregrabado en v1 — si se detectan problemas de voz en la tablet real, evaluar grabar audio propio como fase posterior.

---

## 13. Fuera de alcance (explícito, para no expandir sin conversarlo)

- Cuentas de usuario, login, o perfiles múltiples.
- Analítica, telemetría, o cualquier recolección de datos.
- Evaluación o puntaje comparativo (esto no es una app de "rendimiento", es de exposición).
- Reconocimiento de voz o evaluación de pronunciación.
- Contenido para más de un niño o rango etario distinto a ~3 años.
