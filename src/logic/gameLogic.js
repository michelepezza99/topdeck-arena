/**
 * gameLogic.js
 *
 * Logica pura del gioco.
 * Qui non c'è React: solo funzioni che ricevono dati e restituiscono nuovi dati.
 */

import { createShuffledDeck, drawCard, ensurePlayableDeck } from "./deck.js";

export const STARTING_BALANCE = 500;

export const PHASES = {
  BETTING: "betting",
  CHOOSING: "choosing",
  REVEAL: "reveal",
  GAMEOVER: "gameover",
};

export const CHOICES = {
  HIGHER: "higher",
  LOWER: "lower",
};

export const OUTCOMES = {
  WIN: "win",
  LOSS: "loss",
  TIE: "tie",
};

export function createInitialState() {
  return {
    balance: STARTING_BALANCE,
    currentBet: 0,
    deck: createShuffledDeck(),

    bankerCard: null,
    playerCard: null,

    phase: PHASES.BETTING,

    lastOutcome: null,
    lastDelta: 0,

    stats: {
      rounds: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      peakBalance: STARTING_BALANCE,
    },
  };
}

export function validateBet(amount, balance) {
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) {
    return {
      valid: false,
      error: "La puntata deve essere un numero intero.",
    };
  }

  if (amount < 1) {
    return {
      valid: false,
      error: "La puntata minima è 1 coin.",
    };
  }

  if (amount > balance) {
    return {
      valid: false,
      error: `Non puoi puntare più di ${balance} coins.`,
    };
  }

  return {
    valid: true,
    error: null,
  };
}

export function placeBet(state, amount) {
  if (state.phase !== PHASES.BETTING) {
    throw new Error(`placeBet chiamata in fase non valida: ${state.phase}`);
  }

  const validation = validateBet(amount, state.balance);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const playableDeck = ensurePlayableDeck(state.deck);
  const drawn = drawCard(playableDeck);

  return {
    ...state,
    deck: drawn.deck,
    currentBet: amount,
    bankerCard: drawn.card,
    playerCard: null,
    lastOutcome: null,
    lastDelta: 0,
    phase: PHASES.CHOOSING,
  };
}

export function makeChoice(state, choice) {
  if (state.phase !== PHASES.CHOOSING) {
    throw new Error(`makeChoice chiamata in fase non valida: ${state.phase}`);
  }

  if (choice !== CHOICES.HIGHER && choice !== CHOICES.LOWER) {
    throw new Error(`Scelta non valida: ${choice}`);
  }

  const drawn = drawCard(state.deck);
  const playerCard = drawn.card;

  const outcome = resolveOutcome(state.bankerCard, playerCard, choice);

  let newBalance = state.balance;
  let lastDelta = 0;

  const newStats = {
    ...state.stats,
    rounds: state.stats.rounds + 1,
  };

  if (outcome === OUTCOMES.WIN) {
    newBalance = state.balance + state.currentBet;
    lastDelta = state.currentBet;
    newStats.wins += 1;
  }

  if (outcome === OUTCOMES.LOSS) {
    newBalance = state.balance - state.currentBet;
    lastDelta = -state.currentBet;
    newStats.losses += 1;
  }

  if (outcome === OUTCOMES.TIE) {
    newBalance = state.balance;
    lastDelta = 0;
    newStats.ties += 1;
  }

  if (newBalance > newStats.peakBalance) {
    newStats.peakBalance = newBalance;
  }

  return {
    ...state,
    deck: drawn.deck,
    playerCard,
    balance: newBalance,
    lastOutcome: outcome,
    lastDelta,
    stats: newStats,
    phase: PHASES.REVEAL,
  };
}

export function resolveOutcome(bankerCard, playerCard, choice) {
  if (playerCard.value === bankerCard.value) {
    return OUTCOMES.TIE;
  }

  const playerCardIsHigher = playerCard.value > bankerCard.value;
  const userGuessedHigher = choice === CHOICES.HIGHER;

  return playerCardIsHigher === userGuessedHigher
    ? OUTCOMES.WIN
    : OUTCOMES.LOSS;
}

export function nextRound(state) {
  if (state.phase !== PHASES.REVEAL) {
    throw new Error(`nextRound chiamata in fase non valida: ${state.phase}`);
  }

  if (state.balance <= 0) {
    return {
      ...state,
      phase: PHASES.GAMEOVER,
    };
  }

  return {
    ...state,
    deck: ensurePlayableDeck(state.deck),
    currentBet: 0,
    bankerCard: null,
    playerCard: null,
    lastOutcome: null,
    lastDelta: 0,
    phase: PHASES.BETTING,
  };
}

export function quitGame(state) {
  return {
    ...state,
    phase: PHASES.GAMEOVER,
  };
}

export function newGame() {
  return createInitialState();
}