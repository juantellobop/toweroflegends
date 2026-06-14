import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { uiAssetList } from '../data/uiAssets.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PORT = 8091;
const BASE = `http://127.0.0.1:${PORT}/`;
const OUT = path.join(ROOT, '.cache', 'visual');

function waitForServer(url, timeout = 8000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function tick() {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) reject(new Error(`Server did not start: ${url}`));
        else setTimeout(tick, 120);
      });
      req.setTimeout(800, () => req.destroy());
    }
    tick();
  });
}

async function playToBuild(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const requestedUiAssets = new Set(await page.evaluate(() =>
    performance.getEntriesByType('resource')
      .map((entry) => new URL(entry.name).pathname.replace(/^\//, ''))
      .filter((pathname) => pathname.startsWith('assets/ui/'))
  ));
  for (const asset of uiAssetList()) {
    assert.ok(requestedUiAssets.has(asset), `UI asset must preload on initial page load: ${asset}`);
  }
  await page.waitForTimeout(350);
  await page.click('.flag-opt');
  await page.click('#start');
  // Presentación de la plantilla inicial: once en el campo + suplentes.
  await page.waitForSelector('.squad-intro-screen .squad-chip');
  await assertSquadIntroLayout(page);
  await page.click('#squad-continue');
  // El sobre llega sellado: abrirlo revela las cartas.
  await page.waitForSelector('.pack-screen .pack-opener');
  await page.click('#openBtn');
  await page.waitForSelector('.pack-screen .player-card', { state: 'visible' });
  await page.waitForTimeout(900);
  await assertSquareBoxes(page, '.player-card .card-portrait', 'player card portraits');
  await assertInsideCards(page, '.player-card', ['.card-head', '.card-portrait', '.card-name', '.card-meta', '.card-stats'], 'player cards');
  // Selección directa: tocar la carta confirma sin botón aparte.
  await page.click('.deal-card:not(.disabled-deal)');
  await page.waitForSelector('.pack-screen[data-kind="item"]');
  await page.click('#openBtn');
  await page.waitForSelector('.pack-screen .item-card', { state: 'visible' });
  await page.waitForTimeout(700);
  await assertInsideCards(page, '.item-card', ['.card-head', '.card-name', '.item-desc'], 'item cards');
  await page.click('.deal-card');
  await page.waitForSelector('.scouting-screen');
  await assertScoutingLayout(page);
  await page.click('#scout-continue');
  await page.waitForSelector('.build-screen');
  await page.waitForTimeout(350);
}

async function assertSquadIntroLayout(page) {
  await page.waitForTimeout(900); // deja terminar el escalonado de fichas
  const viewport = page.viewportSize();
  await page.screenshot({
    path: path.join(OUT, `${viewport && viewport.width <= 760 ? 'mobile' : 'desktop'}-squad-intro.png`),
    fullPage: true,
  });
  const chips = await page.locator('.squad-intro-screen .squad-chip').count();
  assert.equal(chips, 11, 'Squad intro must show the 11 starters on the pitch');
  const subs = await page.locator('.squad-intro-screen .bench-item').count();
  assert.ok(subs > 0, 'Squad intro must show the substitutes strip');
}

async function assertScoutingLayout(page) {
  const viewport = page.viewportSize();
  await page.screenshot({
    path: path.join(OUT, `${viewport && viewport.width <= 760 ? 'mobile' : 'desktop'}-scouting.png`),
    fullPage: true,
  });
  if (!viewport || viewport.width > 760) return;

  const flag = await page.locator('.scout-team-card').boundingBox();
  const strength = await page.locator('.scout-strength').boundingBox();
  assert.ok(flag && strength, 'Mobile scouting must show flag and strength');
  assert.ok(Math.abs(flag.y - strength.y) <= 4, 'Mobile scouting flag and strength must share a row');

  const ratingTops = await page.locator('.scout-rating').evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().top))
  );
  assert.equal(new Set(ratingTops).size, 1, 'Mobile opponent ratings must fit in one row');
}

async function assertInsideCards(page, cardSelector, childSelectors, label) {
  const failures = await page.locator(cardSelector).evaluateAll((cards, selectors) => {
    const out = [];
    for (const card of cards) {
      const c = card.getBoundingClientRect();
      for (const selector of selectors) {
        const child = card.querySelector(selector);
        if (!child) continue;
        const r = child.getBoundingClientRect();
        if (r.left < c.left - 2 || r.right > c.right + 2 || r.top < c.top - 2 || r.bottom > c.bottom + 2) {
          out.push(`${selector}: ${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)} outside ${Math.round(c.left)},${Math.round(c.top)},${Math.round(c.right)},${Math.round(c.bottom)}`);
        }
      }
    }
    return out;
  }, childSelectors);
  assert.deepEqual(failures, [], `${label} overflow:\n${failures.join('\n')}`);
}

async function assertSquareBoxes(page, selector, label) {
  const boxes = await page.locator(selector).evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    })
  );
  assert.ok(boxes.length > 0, `No boxes found for ${label}`);
  for (const box of boxes) {
    assert.ok(Math.abs(box.width - box.height) <= 2, `${label} must be square: ${box.width}x${box.height}`);
  }
}

function intersects(a, b) {
  const x = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return x * y;
}

async function assertBuildLayout(page, label) {
  await assertSquareBoxes(page, '.build-screen .chip-face', `${label} field portraits`);
  await assertSquareBoxes(page, '.build-screen .bench-face', `${label} bench portraits`);
  assert.ok(await page.locator('.build-screen .flag-img').count(), `${label} must render country flags as images`);
  // Barra de acción única: fija al fondo. Las transiciones de pantalla solo
  // animan opacidad, así que el ancestro .screen no la descoloca.
  const playPosition = await page.locator('.build-screen .play-bar').evaluate((node) => getComputedStyle(node).position);
  assert.equal(playPosition, 'fixed', `${label} play button bar must be fixed to the bottom`);
  const fieldBox = await page.locator('.build-screen .field').boundingBox();
  const viewport = page.viewportSize();
  assert.ok(fieldBox && viewport && fieldBox.height <= viewport.height, `${label} field height must fit viewport`);
  const fullNames = await page.locator('.build-screen .field-chip.filled .chip-name').evaluateAll((nodes) =>
    nodes.filter((node) => node.title?.includes(' ')).map((node) => node.textContent.trim() === node.title.trim())
  );
  assert.ok(fullNames.every((same) => !same), `${label} tactical cards must use surnames instead of full names`);

  if (label === 'mobile') {
    const ratingsBox = await page.locator('.build-screen .ratings-glass').boundingBox();
    const rosterBox = await page.locator('.build-screen .team-roster').boundingBox();
    assert.ok(ratingsBox && rosterBox && fieldBox.y < rosterBox.y && rosterBox.y < ratingsBox.y, 'Mobile order must be tactical board, substitutes, then team strength');
    assert.ok(fieldBox.height >= 420 && fieldBox.height <= 470, `Mobile tactical field must be slightly taller (420-470px), got ${fieldBox.height}px`);
    assert.equal(await page.locator('.build-screen .roster-head h2').textContent(), 'Substitutes');
    assert.equal(await page.locator('.build-screen .roster-head p').count(), 0, 'Substitutes summary must be removed');

    const ratingTops = await page.locator('.build-screen .rating-row').evaluateAll((nodes) =>
      nodes.map((node) => Math.round(node.getBoundingClientRect().top))
    );
    assert.equal(new Set(ratingTops).size, 1, 'Mobile team ratings must fit in one row');

    const playBox = await page.locator('.build-screen #play').boundingBox();
    assert.ok(playBox && playBox.width >= 320 && playBox.height >= 54, 'Mobile play CTA must match the larger floating buttons');

    const benchBox = await page.locator('.build-screen .bench-item').first().boundingBox();
    assert.ok(benchBox && benchBox.width <= 124 && benchBox.height <= 104, 'Mobile substitutes must use compact cards');

    await page.locator('.build-screen .bench-strip').evaluate((strip) => {
      const template = strip.querySelector('.bench-item');
      if (!template) return;
      while (strip.querySelectorAll('.bench-item').length < 7) {
        strip.appendChild(template.cloneNode(true));
      }
    });
    const benchLayout = await page.locator('.build-screen .bench-strip').evaluate((strip) => {
      const stripRect = strip.getBoundingClientRect();
      const cards = [...strip.querySelectorAll('.bench-item')].map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          left: Math.round(rect.left),
          top: Math.round(rect.top),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom),
        };
      });
      return {
        display: getComputedStyle(strip).display,
        overflowX: getComputedStyle(strip).overflowX,
        strip: {
          left: Math.round(stripRect.left),
          right: Math.round(stripRect.right),
          bottom: Math.round(stripRect.bottom),
        },
        cards,
      };
    });
    assert.equal(benchLayout.display, 'grid', 'Mobile substitutes must use a wrapping grid');
    assert.equal(benchLayout.overflowX, 'visible', 'Mobile substitutes must not use a clipped horizontal carousel');
    assert.equal(new Set(benchLayout.cards.slice(0, 3).map((card) => card.top)).size, 1, 'Mobile substitutes must show three cards per row');
    assert.ok(benchLayout.cards[3].top > benchLayout.cards[0].top, 'Additional substitutes must wrap onto new rows');
    assert.ok(benchLayout.cards.every((card) =>
      card.left >= benchLayout.strip.left && card.right <= benchLayout.strip.right
    ), 'Every mobile substitute card must fit fully inside the grid');
    assert.ok(
      benchLayout.strip.bottom >= benchLayout.cards.at(-1).bottom,
      'Mobile substitutes grid must grow to contain every row'
    );
  }
  await page.screenshot({ path: path.join(OUT, `${label}-build.png`), fullPage: true });
}

async function assertCenteredForwards(page) {
  async function assertNoFieldChipOverlap(label) {
    const overlaps = await page.locator('.chip-anchor').evaluateAll((nodes) => {
      const out = [];
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i].getBoundingClientRect();
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j].getBoundingClientRect();
          const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (x * y > 4) {
            out.push(`${nodes[i].dataset.line}${nodes[i].dataset.slot}/${nodes[j].dataset.line}${nodes[j].dataset.slot}: ${Math.round(x)}x${Math.round(y)}`);
          }
        }
      }
      return out;
    });
    assert.deepEqual(overlaps, [], `${label} field chips must not overlap:\n${overlaps.join('\n')}`);
  }

  for (const formation of ['4-4-2', '3-5-2', '5-3-2']) {
    await page.selectOption('#formationSelect', formation);
    await page.waitForTimeout(120);
    const xs = await page.locator('.chip-anchor[data-line="FWD"]').evaluateAll((nodes) =>
      nodes.map((node) => parseFloat(node.style.left)).sort((a, b) => a - b)
    );
    assert.equal(xs.length, 2, `${formation} must have two forward slots`);
    // La dupla va separada (se ve el enlace de química entre las dos cartas)
    // pero sin abrirse a la banda como un tridente.
    assert.ok(xs[1] - xs[0] >= 25, `${formation} forwards must be split apart, got ${xs.join(', ')}`);
    assert.ok(xs.every((x) => x >= 28 && x <= 72), `${formation} forwards must stay inboard, got ${xs.join(', ')}`);
  }

  // Hueco mínimo entre fichas de una misma línea: el enlace de química nunca
  // queda tapado por dos cartas vecinas (líneas de 5 incluidas).
  await page.selectOption('#formationSelect', '3-5-2');
  await page.waitForTimeout(120);
  const midXs = await page.locator('.chip-anchor[data-line="MID"]').evaluateAll((nodes) =>
    nodes.map((node) => parseFloat(node.style.left)).sort((a, b) => a - b)
  );
  assert.equal(midXs.length, 5, '3-5-2 must have five midfield slots');
  for (let i = 1; i < midXs.length; i++) {
    assert.ok(midXs[i] - midXs[i - 1] >= 19.5, `3-5-2 midfield chips too close: ${midXs.join(', ')}`);
  }
  await page.selectOption('#formationSelect', '4-3-3');
  await page.waitForTimeout(120);
  const xs433 = await page.locator('.chip-anchor[data-line="FWD"]').evaluateAll((nodes) =>
    nodes.map((node) => parseFloat(node.style.left)).sort((a, b) => a - b)
  );
  assert.equal(xs433.length, 3, '4-3-3 must have three attacking slots');
  assert.ok(xs433[0] <= 25 && xs433[1] >= 45 && xs433[1] <= 55 && xs433[2] >= 75, `4-3-3 forwards must be wide-center-wide, got ${xs433.join(', ')}`);

  await page.selectOption('#formationSelect', '4-3-1-2');
  await page.waitForTimeout(120);
  const slots4312 = await page.locator('.chip-anchor').evaluateAll((nodes) =>
    nodes.map((node) => ({
      line: node.dataset.line,
      slot: node.dataset.slot,
      left: parseFloat(node.style.left),
      top: parseFloat(node.style.top),
    }))
  );
  const mids4312 = slots4312.filter((slot) => slot.line === 'MID');
  const fwds4312 = slots4312.filter((slot) => slot.line === 'FWD');
  const enganche = mids4312.find((slot) => slot.slot === '3');
  assert.equal(mids4312.length, 4, '4-3-1-2 must have four midfield-line slots including enganche');
  assert.equal(fwds4312.length, 2, '4-3-1-2 must have two forward slots');
  assert.ok(enganche && enganche.left >= 45 && enganche.left <= 55 && enganche.top > 24 && enganche.top < 36, `4-3-1-2 enganche must be centered between lines, got ${JSON.stringify(enganche)}`);
  assert.ok(fwds4312.every((slot) => slot.top <= 10), `4-3-1-2 forwards must move higher, got ${JSON.stringify(fwds4312)}`);
  assert.ok(fwds4312.some((slot) => slot.left <= 30) && fwds4312.some((slot) => slot.left >= 70), `4-3-1-2 forwards must be separated, got ${JSON.stringify(fwds4312)}`);
  await assertNoFieldChipOverlap('4-3-1-2');

  await page.selectOption('#formationSelect', '3-4-3');
  await page.waitForTimeout(120);
  const defs343 = await page.locator('.chip-anchor[data-line="DEF"]').evaluateAll((nodes) =>
    nodes.map((node) => parseFloat(node.style.left)).sort((a, b) => a - b)
  );
  const fwds343 = await page.locator('.chip-anchor[data-line="FWD"]').evaluateAll((nodes) =>
    nodes.map((node) => parseFloat(node.style.left)).sort((a, b) => a - b)
  );
  assert.equal(defs343.length, 3, '3-4-3 must have three defender slots');
  assert.ok(defs343[0] >= 20 && defs343[2] <= 80, `3-4-3 defenders must be central, got ${defs343.join(', ')}`);
  assert.equal(fwds343.length, 3, '3-4-3 must have three attacking slots');
  assert.ok(fwds343[0] <= 25 && fwds343[1] >= 45 && fwds343[1] <= 55 && fwds343[2] >= 75, `3-4-3 forwards must be wide-center-wide, got ${fwds343.join(', ')}`);

  await page.selectOption('#formationSelect', '4-3-3');
  await page.waitForTimeout(120);
}

async function assertDragAndDrop(page) {
  const bench = page.locator('.team-roster .bench-item').first();
  assert.ok(await bench.count(), 'Expected at least one bench player for drag test');
  const uid = await bench.getAttribute('data-uid');
  const line = await bench.getAttribute('data-line');
  assert.ok(uid && line, 'Bench player needs uid and line');
  const target = page.locator(`.chip-anchor[data-line="${line}"]`).first();
  assert.ok(await target.count(), `No target slot for line ${line}`);
  await bench.dragTo(target);
  await page.waitForFunction((draggedUid) =>
    !!document.querySelector(`.chip-anchor[data-uid="${draggedUid}"]`), uid
  );
}

async function assertImmediateTouchDrag(page) {
  const bench = page.locator('.team-roster .bench-item').first();
  // El retrato concreto: la cara también aloja la bandera (.chip-flag).
  const portrait = bench.locator('.bench-face img:not(.chip-flag)');
  const box = await portrait.boundingBox();
  assert.ok(box, 'Expected a visible substitute portrait for touch drag test');
  const uid = await bench.getAttribute('data-uid');
  const line = await bench.getAttribute('data-line');
  const target = page.locator(`.chip-anchor[data-line="${line}"]`).first();
  const targetBox = await target.boundingBox();
  assert.ok(uid && line && targetBox, 'Touch drag needs a compatible tactical slot');
  assert.equal(
    await bench.evaluate((node) => getComputedStyle(node).touchAction),
    'none',
    'Substitute cards must not let native panning cancel touch dragging'
  );
  assert.equal(
    await bench.evaluate((node) => getComputedStyle(node).userSelect),
    'none',
    'Substitute cards must disable text selection'
  );
  assert.equal(
    await bench.evaluate((node) => {
      const event = new Event('selectstart', { bubbles: true, cancelable: true });
      node.querySelector('.bench-name').dispatchEvent(event);
      return event.defaultPrevented;
    }),
    true,
    'Substitute cards must prevent native selection gestures'
  );
  assert.equal(
    await bench.evaluate((node) => {
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      node.querySelector('.bench-name').dispatchEvent(event);
      return event.defaultPrevented;
    }),
    true,
    'Substitute cards must prevent long-press context menus'
  );
  assert.equal(
    await portrait.evaluate((node) => getComputedStyle(node).pointerEvents),
    'none',
    'Substitute portraits must delegate pointer gestures to the full card'
  );
  assert.equal(await portrait.getAttribute('draggable'), 'false', 'Substitute portraits must disable native image dragging');
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const targetPoint = { x: targetBox.x + targetBox.width / 2, y: targetBox.y + targetBox.height / 2 };
  await portrait.evaluate((node, coords) => {
    document.elementFromPoint(coords.x, coords.y)?.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      pointerId: 51,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      clientX: coords.x,
      clientY: coords.y,
    }));
  }, point);
  assert.equal(await page.locator('.drag-ghost').count(), 1, 'Touch drag must show feedback immediately on pointerdown');
  assert.equal(await bench.getAttribute('draggable'), 'false', 'Touch drag must disable delayed native dragging');
  await bench.evaluate((node, coords) => {
    node.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      pointerId: 51,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      clientX: coords.x,
      clientY: coords.y,
    }));
  }, targetPoint);
  await bench.evaluate((node, coords) => {
    node.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      pointerId: 51,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      clientX: coords.x,
      clientY: coords.y,
    }));
  }, targetPoint);
  assert.equal(await page.locator('.drag-ghost').count(), 0, 'Touch drag feedback must clear on pointerup');
  await page.waitForFunction((draggedUid) =>
    !!document.querySelector(`.chip-anchor[data-uid="${draggedUid}"]`), uid
  );
}

await fs.mkdir(OUT, { recursive: true });
const server = spawn('python3', ['-m', 'http.server', String(PORT)], {
  cwd: ROOT,
  stdio: 'ignore',
});

let browser;
try {
  await waitForServer(BASE);
  browser = await chromium.launch();

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await playToBuild(desktop);
  await assertBuildLayout(desktop, 'desktop');
  await assertCenteredForwards(desktop);
  await assertDragAndDrop(desktop);
  await desktop.waitForTimeout(350);
  await desktop.screenshot({ path: path.join(OUT, 'desktop-after-drag.png'), fullPage: true });
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await playToBuild(mobile);
  await assertBuildLayout(mobile, 'mobile');
  await assertImmediateTouchDrag(mobile);
  await mobile.locator('.team-roster .bench-item').first().click();
  assert.ok(await mobile.locator('.bench-target').count(), 'Tapping a substitute must show compatible tactical slots');
  await mobile.screenshot({ path: path.join(OUT, 'mobile-sub-picker.png'), fullPage: true });
  await mobile.locator('.bench-target').first().click();
  await mobile.locator('#play').click();
  await mobile.waitForSelector('.match-screen');
  await mobile.waitForTimeout(600);
  const resultFab = mobile.locator('#viewResult');
  const resultFabBox = await resultFab.boundingBox();
  const resultFabPosition = await resultFab.evaluate((node) => getComputedStyle(node.closest('.match-result-fab')).position);
  assert.equal(resultFabPosition, 'fixed', 'View result CTA must float over highlights');
  assert.ok(resultFabBox && resultFabBox.width >= 320 && resultFabBox.height >= 54, 'View result CTA must match the large floating buttons');
  await mobile.screenshot({ path: path.join(OUT, 'mobile-match.png') });
  await resultFab.click();
  await mobile.waitForSelector('.result-screen');
  await mobile.waitForTimeout(500);
  const scoreBox = await mobile.locator('.result-score-card').boundingBox();
  const posterBox = await mobile.locator('.result-poster').boundingBox();
  const floorBox = await mobile.locator('.tower-next').boundingBox();
  assert.ok(scoreBox && posterBox && floorBox && scoreBox.y < posterBox.y, 'Mobile result score must appear first');
  assert.ok(Math.abs(posterBox.y - floorBox.y) <= 4, 'Mobile cup and floor must share one row');
  assert.ok(await mobile.locator('.result-score-card .result-scorers').count(), 'Scorers must be inside the score card');
  assert.equal(await mobile.locator('.result-stats').count(), 0, 'Saves must not appear in the result summary');
  await mobile.screenshot({ path: path.join(OUT, 'mobile-result.png'), fullPage: true });
  await mobile.close();

  console.log('Visual checks: OK');
} finally {
  await browser?.close();
  server.kill();
}
