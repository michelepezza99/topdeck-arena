import test from "node:test";
import assert from "node:assert/strict";

import { createDeck, drawCard } from "./deck.js";
import { CHOICES, OUTCOMES, resolveOutcome, validateBet } from "./gameLogic.js";

test("validateBet accepts whole numbers within the balance and minimum", () => {
  assert.equal(validateBet(10, 100, 10).valid, true);
  assert.equal(validateBet(9, 100, 10).valid, false);
  assert.equal(validateBet(101, 100, 10).valid, false);
  assert.equal(validateBet(10.5, 100, 10).valid, false);
});

test("resolveOutcome handles higher, lower, and ties", () => {
  const eight = { value: 8 };
  const queen = { value: 12 };

  assert.equal(resolveOutcome(eight, queen, CHOICES.HIGHER), OUTCOMES.WIN);
  assert.equal(resolveOutcome(queen, eight, CHOICES.LOWER), OUTCOMES.WIN);
  assert.equal(resolveOutcome(eight, queen, CHOICES.LOWER), OUTCOMES.LOSS);
  assert.equal(resolveOutcome(eight, { value: 8 }, CHOICES.HIGHER), OUTCOMES.TIE);
});

test("drawCard removes one card from a standard deck", () => {
  const deck = createDeck();
  const drawn = drawCard(deck);

  assert.equal(deck.length, 52);
  assert.equal(drawn.deck.length, 51);
  assert.equal(drawn.deck.some((card) => card.id === drawn.card.id), false);
});
