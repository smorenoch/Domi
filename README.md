# Mi Libro de Aprender

Libro web de lecciones interactivas para una niña de 3 años. Dos tracks: **inglés**
(adquisición de segundo idioma) y **español** (desarrollo cognitivo).

El brief de producto y las decisiones pedagógicas están en
[PROYECTO_LIBRO_APRENDIZAJE.md](PROYECTO_LIBRO_APRENDIZAJE.md) — ese documento es
la fuente de verdad; este README sólo cubre cómo está construido.

## Correr el proyecto

```bash
npm install
npm run dev          # servidor de desarrollo (también accesible desde la tablet en la misma red)
npm run build        # build estático en /dist
npm run preview      # servir /dist localmente
```

Para el test end-to-end hace falta bajar el navegador una sola vez:

```bash
npx playwright install chromium
npm test
```

`npm test` abre el libro en un navegador real y **juega las 7 lecciones completas**,
verificando que cada una llegue a su pantalla final, que el progreso quede guardado
y que no haya errores de consola en todo el recorrido.

## Cómo está organizado

```
/reference              los 3 prototipos originales, sin modificar
/src
  main.js               rutas + arranque
  /lib
    audio.js            voz (en/es) + tonos — la única pieza que habla
    storage.js          progreso y preferencias en localStorage
    router.js           router por hash
    dom.js              helpers (el, shuffle, ...)
  /styles               tokens · base · componentes · motores
  /components
    LessonRunner.js     el shell de lección: pantallas, progreso, celebración
    SunMascot.js  Celebration.js  ProgressDots.js  CornerButtons.js  AdultNote.js
  /engines              la mecánica de juego, sin contenido
    collectMatch  roomSequence  countingTap  phraseSituation  memoryPairs  classification
  /lessons              el contenido, sin mecánica
    index.js            catálogo del libro (qué capítulos existen y en qué orden)
    /en  colors  animals  house  numbers  greetings
    /es  memory  oddOneOut
/tests/smoke.mjs        recorrido end-to-end de las 7 lecciones
```

La separación que importa: **un motor no sabe qué se está enseñando y una lección no
sabe cómo se juega.** `LessonRunner` es lo único que se repite entre lecciones, y vive
en un solo archivo — a diferencia de los prototipos, donde cada `<script>` era una copia
completa del anterior.

### Agregar una lección

1. Elegir un motor de `/src/engines` (o escribir uno nuevo con el mismo contrato).
2. Crear el archivo de contenido en `/src/lessons/en` o `/src/lessons/es`.
3. Registrarlo en `/src/lessons/index.js`: agregarlo a `BUILT` y reemplazar su
   `soon(...)` por `chapter(...)` en el track que corresponda.

No hace falta tocar CSS, audio, progreso ni navegación.

### Contrato de un motor

```js
export function miMotor(lesson, api) {
  return {
    unitCount,          // cuántas unidades tiene la lección (rondas, tableros, ...)
    start(index),       // dibujar la unidad dentro de api.stage
    destroy()           // opcional
  };
}
```

`api` trae: `stage` (el contenedor), `audio`, `lang` (`'en'` | `'es'`), `after(ms, fn)`
para timers que se limpian solos al salir, y `completeUnit({ text, speak, delay })`
para avisar que la unidad se resolvió. El resto —celebración, confeti, puntos de
progreso, pantalla final, guardado— lo hace el shell.

## Decisiones que conviene no revertir sin pensarlo

- **El audio de los dos tracks es distinto a propósito.** En inglés sólo se pronuncia
  el vocabulario objetivo, nunca instrucciones; en español se narran instrucciones
  completas, porque entender la instrucción hablada es parte de lo que se practica.
  Cada idioma elige su propia voz en `lib/audio.js`.
- **No hay sonido de error.** El feedback de reintento es un tono grave y corto a bajo
  volumen, y nada más: sin mensajes, sin contador de fallos, sin pantallas de derrota.
- **Los tiempos de espera están calibrados**, no son arbitrarios: dan lugar a que
  termine un audio antes de que empiece el siguiente. Bajarlos corta frases a la mitad.
- **La página nunca hace scroll.** Todo se resuelve con `vh`/`clamp()`. La única lista
  con scroll interno es el índice, cuando hay más capítulos que alto de pantalla.
- **Nada de red salvo Google Fonts.** Sin analítica, sin telemetría, sin backend.

## Estado por fases

| Fase | Alcance | Estado |
|---|---|---|
| 0 | Fundación + 3 lecciones migradas | ✅ |
| 1 | Números (`countingTap`) + Saludos (`phraseSituation`) | ✅ |
| 2 | Memorama (`memoryPairs`) + ¿Cuál no va? (`classification`) | ✅ |
| 3 | Mi Cuerpo, Mi Familia, Comida — reutilizan motores existentes | pendiente |
| 4 | Los 4 motores restantes de Track B | pendiente |
| 5 | Pulido, accesibilidad, vista semanal para el adulto | pendiente |

Los capítulos de las fases 3 y 4 ya aparecen en el índice marcados como *Pronto*.

## Pendiente de conversar

**Despliegue.** El build de `/dist` es estático y se puede servir desde cualquier lado
(incluido abrirlo local). Si va al VPS/EasyPanel que ya se usa para otros proyectos,
falta definir eso — no se asumió Docker ni EasyPanel de entrada.
