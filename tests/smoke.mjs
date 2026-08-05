/* ---------------------------------------------------------------
   Smoke test end-to-end.

   Abre el libro en un navegador real y juega las 7 lecciones completas,
   resolviendo cada motor a fuerza bruta — tocar todo lo tocable, que es
   literalmente lo que hace una niña de 3 años. Verifica que cada lección
   llegue a su pantalla final, que el progreso quede guardado y que no
   haya un solo error de consola en todo el recorrido.

   Uso:
     npx playwright install chromium   (una sola vez)
     npm test
   --------------------------------------------------------------- */

import { preview } from 'vite';
import { chromium } from 'playwright';

const PORT = 4173;
const errors = [];
let failures = 0;

function check(ok, label) {
  if (!ok) { failures++; console.log(`  ✗ ${label}`); }
  else console.log(`  ✓ ${label}`);
}

const server = await preview({ preview: { port: PORT, open: false } });
const base = `http://localhost:${PORT}/`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${m.text()} — ${m.location().url}`); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('response', (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });

/* Click despachado por JS: los tiles ya resueltos quedan en scale(0) y un
   click "real" los rechazaría por estar fuera del viewport. */
const tap = (sel, i) => page.locator(sel).nth(i).evaluate((e) => e.click());
const celebrating = () => page.locator('.celebration.active').isVisible();

await page.goto(base, { waitUntil: 'load' });
await page.waitForTimeout(600);

console.log('\n— Portada —');
check(await page.locator('.cover-title').isVisible(), 'portada visible');
check(await page.locator('.sun-wrap svg').first().isVisible(), 'mascota sol presente');
check(await page.locator('.audio-hint').isVisible(), 'aviso de audio en la primera apertura');

await page.click('.big-btn');
await page.waitForSelector('.tracks');

console.log('\n— Índice —');
check((await page.locator('.track').count()) === 2, 'dos tracks');
const available = await page.locator('.chapter:not(.locked)').count();
const locked = await page.locator('.chapter.locked').count();
check(available === 7, `7 capítulos jugables (encontrados: ${available})`);
check(locked === 7, `7 capítulos "pronto" (encontrados: ${locked})`);

/* Regresión: una lección empezada y no terminada queda "en progreso", y ese
   estado tiene que seguir siendo una fila normal del índice. Se comprueba
   que el capítulo siga dentro de la caja de su lista y en el flujo normal
   — no basta con que exista en el DOM. */
console.log('\n— Índice con una lección a medias —');
await page.locator('.chapter:not(.locked)').first().click();
await page.waitForSelector('.screen.active .big-btn');
await page.click('.screen.active .big-btn');
await page.waitForTimeout(600);
await page.click('.corner-btn.right');
await page.waitForSelector('.tracks');
await page.waitForTimeout(300);

const midway = await page.evaluate(() => {
  const c = document.querySelector('.chapter');
  const list = c.closest('.chapters').getBoundingClientRect();
  const box = c.getBoundingClientRect();
  return {
    status: c.dataset.status,
    position: getComputedStyle(c).position,
    dentroDeLaLista: box.top >= list.top - 1 && box.bottom <= list.bottom + 1
  };
});
check(midway.status === 'progress', `queda marcada en progreso (${midway.status})`);
check(midway.position === 'static', `sigue en el flujo de la lista (position: ${midway.position})`);
check(midway.dentroDeLaLista, 'sigue visible dentro de su lista, no se sale del índice');
check(await page.locator('.chapter').first().isVisible(), 'el capítulo jugado sigue visible');

async function solveUnit() {
  const cls = await page.locator('.screen.active').getAttribute('class');

  if (cls.includes('memoryPairs')) {
    const ids = await page.locator('.card').evaluateAll((els) => els.map((e) => e.dataset.pairId));
    const groups = {};
    ids.forEach((id, i) => { (groups[id] ||= []).push(i); });
    for (const idxs of Object.values(groups)) {
      for (const i of idxs) { await tap('.card', i); await page.waitForTimeout(80); }
      await page.waitForTimeout(150);
    }
    return;
  }

  if (cls.includes('phraseSituation')) {
    for (let i = 0; i < 3; i++) { await tap('.phrase-scene', 0); await page.waitForTimeout(120); }
    return;
  }

  const sel = cls.includes('countingTap') ? '.count-obj'
    : cls.includes('classification') ? '.odd-tile'
    : '.tile';

  // roomSequence pide los objetos de a uno: hay que dar varias vueltas.
  // El conteo se re-consulta en cada vuelta porque countingTap reemplaza
  // el escenario por el numeral grande al terminar.
  for (let round = 0; round < 8; round++) {
    if (await celebrating()) return;
    const n = await page.locator(sel).count();
    for (let i = 0; i < n; i++) {
      if (await celebrating()) return;
      if ((await page.locator(sel).count()) <= i) break;
      await tap(sel, i);
      await page.waitForTimeout(130);
    }
    await page.waitForTimeout(700);
  }
}

async function playLesson(index) {
  await page.locator('.chapter:not(.locked)').nth(index).click();
  await page.waitForSelector('.screen.active .big-btn');
  const title = (await page.locator('.screen.active .title').textContent()).trim();
  console.log(`\n— ${title} —`);
  check(await page.locator('.adult-note').isVisible(), 'nota para el adulto en la pantalla de inicio');

  await page.click('.screen.active .big-btn');
  await page.waitForTimeout(400);

  const totalUnits = await page.locator('.progress-dots .dot').count();
  check(totalUnits > 0, `${totalUnits} unidades con punto de progreso`);

  for (let unit = 0; unit < totalUnits; unit++) {
    await solveUnit();
    await page.waitForSelector('.celebration.active', { timeout: 15000 });
    await page.click('.celebration .big-btn');
    await page.waitForTimeout(350);
  }

  const finalTitle = (await page.locator('.screen.active .title').textContent()).trim();
  const medals = await page.locator('.medal').count();
  check(medals > 0, `pantalla final "${finalTitle}" con ${medals} medallas`);

  await page.click('.ghost-btn');
  await page.waitForSelector('.tracks');
  const status = (await page.locator('.chapter:not(.locked)').nth(index).locator('.chapter-meta').textContent()).trim();
  check(status === 'Completada', `progreso guardado (estado: "${status}")`);
}

for (let i = 0; i < available; i++) await playLesson(i);

console.log('\n— Persistencia —');
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('.tracks');
const doneAfterReload = await page.locator('.chapter[data-status="done"]').count();
check(doneAfterReload === 7, `7 lecciones siguen completadas tras recargar (${doneAfterReload})`);

await page.click('.corner-btn.right');
await page.waitForSelector('.cover-title');
check(!(await page.locator('.audio-hint').isVisible()), 'el aviso de audio no se repite');

await page.click('.corner-btn.left');
check((await page.locator('.corner-btn.left').textContent()) === '🔇', 'mute se activa');
await page.reload({ waitUntil: 'load' });
check((await page.locator('.corner-btn.left').textContent()) === '🔇', 'mute persiste tras recargar');

console.log('\n— Errores de consola —');
if (errors.length) { failures++; errors.forEach((e) => console.log('  ✗ ' + e)); }
else console.log('  ✓ ninguno');

await browser.close();
await server.close();
console.log(failures ? `\n❌ ${failures} problema(s)` : '\n✅ Todo OK');
process.exit(failures ? 1 : 0);
