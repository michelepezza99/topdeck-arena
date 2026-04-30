import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:5173";
const outputDir = "output/smoke";

async function readState(page) {
  const raw = await page.evaluate(() => window.render_game_to_text?.() ?? "{}");
  return JSON.parse(raw);
}

async function screenshot(page, name) {
  await page.screenshot({ path: `${outputDir}/${name}.png`, fullPage: true });
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(url, { waitUntil: "networkidle" });

  await screenshot(page, "start");
  await page.getByRole("button", { name: "Start Game" }).click();
  await page.waitForTimeout(150);

  let state = await readState(page);
  assert.equal(state.screen, "game");
  assert.equal(state.coins, 500);
  assert.equal(state.roundNumber, 1);
  assert.equal(state.deckCount, 51);

  await page.getByRole("button", { name: /Higher/ }).click();
  await page.waitForTimeout(250);
  await screenshot(page, "reveal-1");

  state = await readState(page);
  assert.equal(state.screen, "game");
  assert.equal(state.roundNumber, 1);
  assert.ok(state.playerCard);
  assert.equal(state.sessionStats.rounds, 1);
  assert.equal(state.deckCount, 50);

  await page.getByRole("button", { name: "Deal Next Round" }).click();
  await page.waitForTimeout(150);

  state = await readState(page);
  assert.equal(state.roundNumber, 2);
  assert.equal(state.playerCard, "");
  assert.equal(state.deckCount, 49);

  await page.getByRole("button", { name: /Lower/ }).click();
  await page.waitForTimeout(250);
  await screenshot(page, "reveal-2");

  state = await readState(page);
  assert.equal(state.sessionStats.rounds, 2);
  assert.ok(state.playerCard);

  await page.getByRole("button", { name: "End Session" }).click();
  await page.waitForTimeout(150);
  await screenshot(page, "end");

  state = await readState(page);
  assert.equal(state.screen, "end");
} finally {
  await browser.close();
}
