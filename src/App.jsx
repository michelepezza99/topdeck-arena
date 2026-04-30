import { useEffect, useMemo, useState } from "react";
import { OUTCOMES, resolveOutcome, STARTING_BALANCE, validateBet } from "./logic/gameLogic";
import { createShuffledDeck, drawCard, ensurePlayableDeck } from "./logic/deck";
import "./styles/main.css";

const SITE_NAME = "Topdeck Arena";
const CONTACT_EMAIL = "michelepezza99@gmail.com";

const STARTING_COINS = STARTING_BALANCE;
const MIN_BET = 1;

const STORAGE_KEYS = {
  bestCoins: "topdeck-arena-best-coins-static-v1",
  gamesPlayed: "topdeck-arena-games-played-static-v1",
};

function drawFromDeck(deck) {
  return drawCard(ensurePlayableDeck(deck));
}

function formatCard(card) {
  if (!card) return "";

  return `${card.rank ?? card.label}${card.suit}`;
}

function createSessionStats() {
  return {
    rounds: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    peakCoins: STARTING_COINS,
    biggestWin: 0,
    biggestLoss: 0,
  };
}

function createInitialRound() {
  const drawn = drawFromDeck(createShuffledDeck());

  return {
    deck: drawn.deck,
    dealerCard: drawn.card,
  };
}

function TopNav({ onGoHome, onOpenPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleNavAction(action) {
    action();
    setIsMenuOpen(false);
  }

  return (
    <div className="top-nav-shell">
      <header className="top-nav app">
        <button
          type="button"
          className="brand-button"
          onClick={() => handleNavAction(onGoHome)}
          aria-label="Go to home page"
        >
          {SITE_NAME}
        </button>

        <button
          type="button"
          className="menu-button"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-expanded={isMenuOpen}
          aria-label="Open navigation menu"
        >
          Menu
        </button>

        <nav
          className={`top-nav-links ${isMenuOpen ? "open" : ""}`}
          aria-label="Main navigation"
        >
          <button type="button" onClick={() => handleNavAction(onGoHome)}>
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNavAction(() => onOpenPage("privacy"))}
          >
            Privacy
          </button>

          <button
            type="button"
            onClick={() => handleNavAction(() => onOpenPage("terms"))}
          >
            Terms
          </button>

          <button
            type="button"
            onClick={() => handleNavAction(() => onOpenPage("contact"))}
          >
            Contact
          </button>
        </nav>
      </header>
    </div>
  );
}

function Card({ card, hidden = false, label }) {
  const rank = card?.rank ?? card?.label;

  return (
    <div className="card-wrapper">
      <p className="card-label">{label}</p>

      <div className={`playing-card ${hidden ? "hidden-card" : card?.color}`}>
        {hidden ? (
          <span className="card-back">?</span>
        ) : (
          <>
            <div className="card-corner top-left">
              <span>{rank}</span>
              <span>{card.suit}</span>
            </div>

            <div className="card-center">
              <span>{card.suit}</span>
            </div>

            <div className="card-corner bottom-right">
              <span>{rank}</span>
              <span>{card.suit}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div>
        <strong>{SITE_NAME}</strong>
        <p>
          Free virtual card prediction game. No real money, no deposits, no
          withdrawals, and no prizes.
        </p>
      </div>

      <span className="footer-copy">© {year} {SITE_NAME}</span>
    </footer>
  );
}

function StartScreen({ bestCoins, gamesPlayed, onStart, onOpenPage }) {
  return (
    <main className="app page-shell">
      <section className="start-screen">
        <div className="start-content">
          <p className="eyebrow">Free Card Prediction Game</p>

          <h1>{SITE_NAME}</h1>

          <p className="subtitle">
            Predict whether your card will be higher or lower than the dealer's
            card. Play with virtual coins only.
          </p>

          <div className="disclaimer-box">
            <strong>Free-to-play disclaimer:</strong>
            <span>
              This game uses virtual coins only. It does not involve real-money
              gambling, deposits, withdrawals, cash prizes, or any form of
              financial reward.
            </span>
          </div>

          <div className="start-actions">
            <button
              className="primary-button large-button"
              type="button"
              onClick={onStart}
            >
              Start Game
            </button>

            <button
              className="secondary-button large-button"
              type="button"
              onClick={() => onOpenPage("terms")}
            >
              Read Rules
            </button>
          </div>
        </div>

        <div className="start-card">
          <h2>How it works</h2>

          <ol>
            <li>You start with 500 virtual coins.</li>
            <li>The dealer's card is shown first.</li>
            <li>You choose Higher or Lower.</li>
            <li>If you guess correctly, you win the amount you selected.</li>
            <li>If the cards have the same value, your coins are returned.</li>
          </ol>

          <div className="mini-stats">
            <div>
              <span>Best Score</span>
              <strong>{bestCoins}</strong>
            </div>

            <div>
              <span>Games Played</span>
              <strong>{gamesPlayed}</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function EndScreen({
  finalCoins,
  roundsPlayed,
  bestCoins,
  gamesPlayed,
  sessionStats,
  onRestart,
  onHome,
}) {
  const winRate =
    sessionStats.rounds > 0
      ? Math.round((sessionStats.wins / sessionStats.rounds) * 100)
      : 0;

  return (
    <main className="app page-shell">
      <section className="end-screen">
        <div className="end-card">
          <p className="eyebrow">Game Finished</p>

          <h1>Your Results</h1>

          <p className="subtitle">
            You finished this session with <strong>{finalCoins}</strong> virtual
            coins after <strong>{roundsPlayed}</strong> round
            {roundsPlayed === 1 ? "" : "s"}.
          </p>

          <div className="result-grid">
            <div>
              <span>Final Coins</span>
              <strong>{finalCoins}</strong>
            </div>

            <div>
              <span>Best Score</span>
              <strong>{bestCoins}</strong>
            </div>

            <div>
              <span>Games Played</span>
              <strong>{gamesPlayed}</strong>
            </div>

            <div>
              <span>Wins</span>
              <strong>{sessionStats.wins}</strong>
            </div>

            <div>
              <span>Losses</span>
              <strong>{sessionStats.losses}</strong>
            </div>

            <div>
              <span>Win Rate</span>
              <strong>{winRate}%</strong>
            </div>
          </div>

          <div className="end-actions">
            <button
              className="primary-button large-button"
              type="button"
              onClick={onRestart}
            >
              Play Again
            </button>

            <button
              className="secondary-button large-button"
              type="button"
              onClick={onHome}
            >
              Back to Home
            </button>
          </div>

          <p className="small-note">
            Reminder: this is a free virtual game. Coins have no real-money
            value and cannot be exchanged for prizes.
          </p>
        </div>
      </section>
    </main>
  );
}

function InfoPage({ page, onBack }) {
  const content = {
    privacy: {
      title: "Privacy Policy",
      body: [
        `${SITE_NAME} is a simple free-to-play browser game.`,
        "At this stage, the game does not require registration, does not ask for personal information, and does not process payments.",
        "The game may store basic gameplay data locally in your browser, such as your best score and number of games played. This data stays on your device unless you clear your browser storage.",
        "If advertising, analytics, or cookies are added in the future, this policy should be updated before publication.",
      ],
    },
    terms: {
      title: "Terms of Use",
      body: [
        `${SITE_NAME} is provided for entertainment purposes only.`,
        "The game uses virtual coins only. Virtual coins have no real-world value and cannot be deposited, withdrawn, sold, redeemed, or exchanged for money or prizes.",
        "This website does not offer real-money gambling, financial rewards, betting services, or gambling-related transactions.",
        "By using the game, you understand that it is a free prediction game based on random card outcomes.",
      ],
    },
  };

  const selected = content[page];

  return (
    <main className="app page-shell">
      <section className="info-page">
        <button className="back-button" type="button" onClick={onBack}>
          ← Back
        </button>

        <p className="eyebrow">{SITE_NAME}</p>

        {page === "contact" ? (
          <>
            <h1>Contact</h1>

            <div className="info-card">
              <p>
                For questions, feedback, or business inquiries, you can contact
                me at:
              </p>

              <p>
                <a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </p>

              <p>I will do my best to reply as soon as possible.</p>
            </div>
          </>
        ) : (
          <>
            <h1>{selected.title}</h1>

            <div className="info-card">
              {selected.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function GameScreen({
  coins,
  bet,
  dealerCard,
  playerCard,
  message,
  roundResult,
  history,
  sessionStats,
  roundNumber,
  bestCoins,
  validBet,
  validationMessage,
  deckCount,
  onBetChange,
  onQuickBet,
  onMaxBet,
  onPlayRound,
  onNextRound,
  onRestart,
  onFinish,
  onResetBest,
}) {
  return (
    <main className="app page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Free Card Prediction Game</p>

          <h1>{SITE_NAME}</h1>

          <p className="subtitle">
            Predict whether your card will be higher or lower than the dealer's
            card. Play with virtual coins only. No real money, no deposits, no
            withdrawals, and no prizes.
          </p>

          <div className="disclaimer-box">
            <strong>Free-to-play disclaimer:</strong>
            <span>
              This game uses virtual coins only. It does not involve real-money
              gambling, deposits, withdrawals, cash prizes, or any form of
              financial reward.
            </span>
          </div>
        </div>

        <div className="stats-panel">
          <div>
            <span>Coins</span>
            <strong>{coins}</strong>
          </div>

          <div>
            <span>Best</span>
            <strong>{bestCoins}</strong>
          </div>

          <div>
            <span>Round</span>
            <strong>{roundNumber}</strong>
          </div>
        </div>
      </section>

      <section className="game-layout">
        <div className="game-board">
          <div className="cards-area">
            <Card card={dealerCard} label="Dealer Card" />
            <Card card={playerCard} hidden={!playerCard} label="Your Card" />
          </div>

          <div className={`message-box ${roundResult || ""}`}>
            <p>{message}</p>
          </div>

          <div className="controls">
            <div className="bet-panel">
              <label htmlFor="bet">Bet Amount</label>

              <input
                id="bet"
                type="number"
                min={MIN_BET}
                max={coins}
                value={bet}
                onChange={onBetChange}
                disabled={Boolean(playerCard)}
              />

              <div className="quick-bets">
                <button
                  type="button"
                  onClick={() => onQuickBet(10)}
                  disabled={Boolean(playerCard)}
                >
                  10
                </button>

                <button
                  type="button"
                  onClick={() => onQuickBet(25)}
                  disabled={Boolean(playerCard)}
                >
                  25
                </button>

                <button
                  type="button"
                  onClick={() => onQuickBet(50)}
                  disabled={Boolean(playerCard)}
                >
                  50
                </button>

                <button
                  type="button"
                  onClick={() => onQuickBet(100)}
                  disabled={Boolean(playerCard)}
                >
                  100
                </button>

                <button
                  type="button"
                  onClick={onMaxBet}
                  disabled={Boolean(playerCard)}
                >
                  Max
                </button>
              </div>

              {!validBet && (
                <p className="validation-text">
                  {validationMessage}
                </p>
              )}
            </div>

            <div className="choice-buttons">
              {!playerCard ? (
                <>
                  <button
                    className="primary-button choice-button"
                    type="button"
                    onClick={() => onPlayRound("higher")}
                    disabled={!validBet}
                  >
                    <span>Higher</span>
                    <small>Potential profit: +{bet}</small>
                  </button>

                  <button
                    className="secondary-button choice-button"
                    type="button"
                    onClick={() => onPlayRound("lower")}
                    disabled={!validBet}
                  >
                    <span>Lower</span>
                    <small>Potential profit: +{bet}</small>
                  </button>
                </>
              ) : (
                <button
                  className="primary-button wide"
                  type="button"
                  onClick={onNextRound}
                >
                  Next Round
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="side-panel">
          <div className="rules-card">
            <h2>Rules</h2>

            <ul>
              <li>This is a free prediction game with virtual coins only.</li>
              <li>You start with 500 virtual coins.</li>
              <li>Choose how many coins to play.</li>
              <li>
                Guess if your card will be higher or lower than the dealer's
                card.
              </li>
              <li>If you guess correctly, you win the amount you selected.</li>
              <li>If both cards have the same value, your coins are returned.</li>
              <li>If you reach 0 coins, the game ends.</li>
            </ul>
          </div>

          <div className="session-card">
            <h2>Session</h2>

            <div className="session-grid">
              <div>
                <span>Wins</span>
                <strong>{sessionStats.wins}</strong>
              </div>

              <div>
                <span>Losses</span>
                <strong>{sessionStats.losses}</strong>
              </div>

              <div>
                <span>Ties</span>
                <strong>{sessionStats.ties}</strong>
              </div>

              <div>
                <span>Peak</span>
                <strong>{sessionStats.peakCoins}</strong>
              </div>

              <div>
                <span>Best Win</span>
                <strong>+{sessionStats.biggestWin}</strong>
              </div>

              <div>
                <span>Deck</span>
                <strong>{deckCount}</strong>
              </div>
            </div>
          </div>

          <div className="history-card">
            <h2>Recent Rounds</h2>

            {history.length === 0 ? (
              <p className="empty-history">No rounds played yet.</p>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div className="history-item" key={item.round}>
                    <div>
                      <strong>Round {item.round}</strong>
                      <span>
                        {item.choice} · Coins {item.bet}
                      </span>
                    </div>

                    <div className="history-result">
                      <span>
                        {item.dealer} → {item.player}
                      </span>

                      <strong className={item.result.toLowerCase()}>
                        {item.result}
                        {item.change > 0 && ` +${item.change}`}
                        {item.change < 0 && ` ${item.change}`}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="ghost-button" type="button" onClick={onFinish}>
            Finish Game
          </button>

          <button className="ghost-button" type="button" onClick={onRestart}>
            Restart Game
          </button>

          <button className="text-button" type="button" onClick={onResetBest}>
            Reset Best Score
          </button>
        </aside>
      </section>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState("start");
  const [infoPage, setInfoPage] = useState(null);

  const [roundState, setRoundState] = useState(() => createInitialRound());
  const [coins, setCoins] = useState(STARTING_COINS);
  const [bet, setBet] = useState(50);
  const [playerCard, setPlayerCard] = useState(null);
  const [message, setMessage] = useState(
    "Choose your coins and predict Higher or Lower."
  );
  const [roundResult, setRoundResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [sessionStats, setSessionStats] = useState(() => createSessionStats());
  const [roundNumber, setRoundNumber] = useState(1);
  const [finalCoins, setFinalCoins] = useState(STARTING_COINS);
  const [finalRounds, setFinalRounds] = useState(0);
  const [finalStats, setFinalStats] = useState(() => createSessionStats());

  const deck = roundState.deck;
  const dealerCard = roundState.dealerCard;

  const [bestCoins, setBestCoins] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.bestCoins);
    return saved ? Number(saved) : STARTING_COINS;
  });

  const [gamesPlayed, setGamesPlayed] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.gamesPlayed);
    return saved ? Number(saved) : 0;
  });

  const validationResult = useMemo(() => {
    const amount = Number(bet);
    const validation = validateBet(amount, coins, MIN_BET);

    if (!validation.valid) {
      return validation;
    }

    return {
      valid: true,
      error: null,
    };
  }, [bet, coins]);

  const validBet = validationResult.valid;

  useEffect(() => {
    document.title = SITE_NAME;
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [screen, infoPage]);

  useEffect(() => {
    window.render_game_to_text = () =>
      JSON.stringify({
        screen: infoPage ?? screen,
        coins,
        bet,
        validBet,
        roundNumber,
        dealerCard: formatCard(dealerCard),
        playerCard: formatCard(playerCard),
        message,
        roundResult,
        sessionStats,
        deckCount: deck.length,
      });

    window.advanceTime = () => {};

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [
    bet,
    coins,
    dealerCard,
    deck.length,
    infoPage,
    message,
    playerCard,
    roundNumber,
    roundResult,
    screen,
    sessionStats,
    validBet,
  ]);

  function resetGameState() {
    setRoundState(createInitialRound());
    setCoins(STARTING_COINS);
    setBet(50);
    setPlayerCard(null);
    setMessage("Choose your coins and predict Higher or Lower.");
    setRoundResult(null);
    setHistory([]);
    setSessionStats(createSessionStats());
    setRoundNumber(1);
    setFinalCoins(STARTING_COINS);
    setFinalRounds(0);
    setFinalStats(createSessionStats());
  }

  function startGame() {
    resetGameState();
    setInfoPage(null);
    setScreen("game");
  }

  function restartGame() {
    resetGameState();
    setInfoPage(null);
    setScreen("game");
  }

  function finishGame(
    coinsAtFinish = coins,
    roundsAtFinish = roundNumber - 1,
    statsAtFinish = sessionStats
  ) {
    const updatedGamesPlayed = gamesPlayed + 1;

    setGamesPlayed(updatedGamesPlayed);
    localStorage.setItem(STORAGE_KEYS.gamesPlayed, String(updatedGamesPlayed));

    setFinalCoins(coinsAtFinish);
    setFinalRounds(Math.max(roundsAtFinish, 0));
    setFinalStats(statsAtFinish);
    setInfoPage(null);
    setScreen("end");
  }

  function goHome() {
    setInfoPage(null);
    setScreen("start");
  }

  function openInfoPage(page) {
    setInfoPage(page);
  }

  function closeInfoPage() {
    setInfoPage(null);
  }

  function handleBetChange(event) {
    const value = Number(event.target.value);
    setBet(value);
  }

  function quickBet(value) {
    setBet(Math.min(value, coins));
  }

  function maxBet() {
    setBet(coins);
  }

  function playRound(choice) {
    if (playerCard) return;

    if (!validBet) {
      setMessage(validationResult.error);
      setRoundResult("warning");
      return;
    }

    const drawn = drawFromDeck(deck);
    const drawnCard = drawn.card;
    const outcome = resolveOutcome(dealerCard, drawnCard, choice);

    let result;
    let coinsChange;
    let resultMessage;

    if (outcome === OUTCOMES.TIE) {
      result = "Tie";
      coinsChange = 0;
      resultMessage = "Tie. Your coins have been returned.";
    } else if (outcome === OUTCOMES.WIN) {
      result = "Win";
      coinsChange = Number(bet);
      resultMessage = `You won ${bet} virtual coins.`;
    } else {
      result = "Loss";
      coinsChange = -Number(bet);
      resultMessage = `You lost ${bet} virtual coins.`;
    }

    const updatedCoins = Math.max(coins + coinsChange, 0);
    const updatedStats = {
      rounds: sessionStats.rounds + 1,
      wins: sessionStats.wins + (outcome === OUTCOMES.WIN ? 1 : 0),
      losses: sessionStats.losses + (outcome === OUTCOMES.LOSS ? 1 : 0),
      ties: sessionStats.ties + (outcome === OUTCOMES.TIE ? 1 : 0),
      peakCoins: Math.max(sessionStats.peakCoins, updatedCoins),
      biggestWin: Math.max(sessionStats.biggestWin, coinsChange),
      biggestLoss: Math.min(sessionStats.biggestLoss, coinsChange),
    };

    setPlayerCard(drawnCard);
    setRoundState((current) => ({
      ...current,
      deck: drawn.deck,
    }));
    setCoins(updatedCoins);
    setSessionStats(updatedStats);
    setRoundResult(result.toLowerCase());
    setMessage(resultMessage);

    if (updatedCoins > bestCoins) {
      setBestCoins(updatedCoins);
      localStorage.setItem(STORAGE_KEYS.bestCoins, String(updatedCoins));
    }

    setHistory((previousHistory) => [
      {
        round: roundNumber,
        choice: choice === "higher" ? "Higher" : "Lower",
        bet,
        dealer: formatCard(dealerCard),
        player: formatCard(drawnCard),
        result,
        change: coinsChange,
      },
      ...previousHistory.slice(0, 5),
    ]);

    if (updatedCoins <= 0) {
      setTimeout(() => {
        finishGame(0, roundNumber, updatedStats);
      }, 900);
    }
  }

  function nextRound() {
    const drawn = drawFromDeck(deck);

    setRoundState({
      deck: drawn.deck,
      dealerCard: drawn.card,
    });
    setPlayerCard(null);
    setRoundResult(null);
    setRoundNumber((current) => current + 1);
    setMessage("Choose your coins and predict Higher or Lower.");
    setBet((currentBet) => Math.min(currentBet, coins));
  }

  function resetBestScore() {
    setBestCoins(STARTING_COINS);
    localStorage.setItem(STORAGE_KEYS.bestCoins, String(STARTING_COINS));
  }

  return (
    <>
      <TopNav onGoHome={goHome} onOpenPage={openInfoPage} />

      {infoPage ? (
        <InfoPage page={infoPage} onBack={closeInfoPage} />
      ) : screen === "start" ? (
        <StartScreen
          bestCoins={bestCoins}
          gamesPlayed={gamesPlayed}
          onStart={startGame}
          onOpenPage={openInfoPage}
        />
      ) : screen === "end" ? (
        <EndScreen
          finalCoins={finalCoins}
          roundsPlayed={finalRounds}
          bestCoins={bestCoins}
          gamesPlayed={gamesPlayed}
          sessionStats={finalStats}
          onRestart={restartGame}
          onHome={goHome}
        />
      ) : (
        <GameScreen
          coins={coins}
          bet={bet}
          dealerCard={dealerCard}
          playerCard={playerCard}
          message={message}
          roundResult={roundResult}
          history={history}
          sessionStats={sessionStats}
          roundNumber={roundNumber}
          bestCoins={bestCoins}
          validBet={validBet}
          validationMessage={validationResult.error}
          deckCount={deck.length}
          onBetChange={handleBetChange}
          onQuickBet={quickBet}
          onMaxBet={maxBet}
          onPlayRound={playRound}
          onNextRound={nextRound}
          onRestart={restartGame}
          onFinish={() => finishGame(coins, sessionStats.rounds, sessionStats)}
          onResetBest={resetBestScore}
        />
      )}

      <div className="app footer-container">
        <Footer />
      </div>
    </>
  );
}
