/**
 * deck.js
 *
 * Gestione del mazzo:
 * - mazzo standard da 52 carte;
 * - Asso alto: A = 14;
 * - carte pescate senza reinserimento;
 * - se restano meno di 2 carte, il mazzo viene ricreato.
 */

export const SUITS = ["♥", "♦", "♣", "♠"];

export const SUIT_COLORS = {
  "♥": "red",
  "♦": "red",
  "♣": "black",
  "♠": "black",
};

export const VALUE_LABELS = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K",
  14: "A",
};

export function createDeck() {
  const deck = [];

  for (const suit of SUITS) {
    for (let value = 2; value <= 14; value++) {
      deck.push({
        id: `${VALUE_LABELS[value]}-${suit}`,
        value,
        label: VALUE_LABELS[value],
        suit,
        color: SUIT_COLORS[suit],
      });
    }
  }

  return deck;
}

export function shuffleDeck(deck) {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
}

export function createShuffledDeck() {
  return shuffleDeck(createDeck());
}

export function ensurePlayableDeck(deck) {
  if (!Array.isArray(deck) || deck.length < 2) {
    return createShuffledDeck();
  }

  return deck;
}

export function drawCard(deck) {
  const playableDeck = Array.isArray(deck) && deck.length > 0
    ? deck
    : createShuffledDeck();

  return {
    card: playableDeck[0],
    deck: playableDeck.slice(1),
  };
}