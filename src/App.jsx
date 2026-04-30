import { useEffect, useMemo, useState } from "react";
import { OUTCOMES, resolveOutcome, STARTING_BALANCE, validateBet } from "./logic/gameLogic";
import { createShuffledDeck, drawCard, ensurePlayableDeck } from "./logic/deck";
import "./styles/main.css";

const SITE_NAME = "Topdeck Arena";
const CONTACT_EMAIL = "michelepezza99@gmail.com";

const STARTING_COINS = STARTING_BALANCE;
const MIN_BET = 1;
const SITE_TAGLINE =
  "A refined high-low card table for fast prediction rounds with virtual coins only.";
const SAFETY_TITLE = "Entertainment-only play";
const SAFETY_COPY =
  "Topdeck Arena uses virtual coins only. It does not accept deposits, process withdrawals, award prizes, or offer anything with real-money value.";

const START_HIGHLIGHTS = [
  {
    label: "Starting Stack",
    value: STARTING_COINS,
    detail: "virtual coins",
  },
  {
    label: "Round Format",
    value: "High-Low",
    detail: "one clean call",
  },
  {
    label: "Real-Money Risk",
    value: "None",
    detail: "no deposits or prizes",
  },
];

const TABLE_RULES = [
  "Start each session with 500 virtual coins.",
  "Choose a virtual stake before each reveal.",
  "Call whether your card will be higher or lower than the dealer's exposed card.",
  "Correct calls add your stake; missed calls deduct it.",
  "Matching card values are a push, so your stake is returned.",
  "Finish whenever you want, or continue until your virtual stack reaches zero.",
];

const INFO_CONTENT = {
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    lead:
      "Topdeck Arena is designed as a lightweight browser game with minimal data handling.",
    sections: [
      {
        title: "Information We Do Not Collect",
        body: [
          "The game does not require an account, personal profile, payment details, or identity verification.",
          "It does not collect deposits, process withdrawals, or request financial information.",
        ],
      },
      {
        title: "Local Gameplay Data",
        body: [
          "Your best score and total sessions can be saved in your browser's local storage so the interface can remember your progress on this device.",
          "That local data remains on your device unless you clear browser storage or reset it inside the game.",
        ],
      },
      {
        title: "Future Services",
        body: [
          "If analytics, advertising, cookies, accounts, or server-side features are added later, this policy should be updated before those services go live.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Terms",
    title: "Terms of Use",
    lead:
      "Please use Topdeck Arena as a free entertainment experience, not as a gambling or financial product.",
    sections: [
      {
        title: "Virtual Coins Only",
        body: [
          "Virtual coins have no cash value and cannot be purchased, sold, withdrawn, redeemed, transferred, or exchanged for money, goods, services, or prizes.",
        ],
      },
      {
        title: "No Real-Money Gambling",
        body: [
          "Topdeck Arena does not offer betting services, casino services, financial rewards, paid entry, deposits, withdrawals, or prize distribution.",
          "Outcomes are generated for entertainment inside a free prediction game.",
        ],
      },
      {
        title: "Player Responsibility",
        body: [
          "By using the site, you understand that the game is a no-stakes experience and that virtual results do not represent financial performance or skill certification.",
        ],
      },
    ],
  },
};

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

function formatSignedCoins(amount) {
  if (amount > 0) return `+${amount}`;
  if (amount < 0) return String(amount);
  return "0";
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
          aria-label="Go to Topdeck Arena start screen"
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
            Play
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
          Free virtual high-low card game. No accounts, deposits, withdrawals,
          prizes, or real-money value.
        </p>
      </div>

      <span className="footer-copy">&copy; {year} {SITE_NAME}</span>
    </footer>
  );
}

function SafetyNotice({ compact = false }) {
  return (
    <div className={`disclaimer-box ${compact ? "compact" : ""}`}>
      <strong>{SAFETY_TITLE}</strong>
      <span>{SAFETY_COPY}</span>
    </div>
  );
}

function TablePreview() {
  return (
    <div className="table-preview" aria-hidden="true">
      <div className="preview-felt">
        <div className="preview-deck">
          <span>A</span>
          <span>&spades;</span>
        </div>

        <div className="preview-card red">
          <span>Q</span>
          <span>&hearts;</span>
        </div>

        <div className="chip-stack">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

function StartScreen({ bestCoins, gamesPlayed, onStart, onOpenPage }) {
  return (
    <main className="app page-shell">
      <section className="start-screen">
        <div className="start-content">
          <p className="eyebrow">No-Stakes Card Arena</p>

          <h1>{SITE_NAME}</h1>

          <p className="subtitle">
            {SITE_TAGLINE} Read the dealer's card, choose your stake, and make
            a sharp call without any real-money risk.
          </p>

          <div className="start-highlights" aria-label="Game summary">
            {START_HIGHLIGHTS.map((item) => (
              <div className="highlight-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </div>
            ))}
          </div>

          <SafetyNotice />

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
              View Rules
            </button>
          </div>
        </div>

        <div className="start-side">
          <TablePreview />

          <div className="start-card">
            <h2>Table Rules</h2>

            <ol>
              {TABLE_RULES.slice(0, 5).map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
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

            <p className="start-note">
              Scores are stored locally in this browser unless you clear site
              data or reset your best score.
            </p>
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
  sessionStats,
  onRestart,
  onHome,
}) {
  const winRate =
    sessionStats.rounds > 0
      ? Math.round((sessionStats.wins / sessionStats.rounds) * 100)
      : 0;
  const netCoins = finalCoins - STARTING_COINS;
  const resultTone =
    netCoins > 0 ? "You closed ahead." : netCoins < 0 ? "You closed down." : "You closed even.";

  return (
    <main className="app page-shell">
      <section className="end-screen">
        <div className="end-card">
          <p className="eyebrow">Session Complete</p>

          <h1>Session Summary</h1>

          <p className="subtitle">
            {resultTone} Final stack: <strong>{finalCoins}</strong> virtual
            coins across <strong>{roundsPlayed}</strong> round
            {roundsPlayed === 1 ? "" : "s"}.
          </p>

          <div className="result-grid">
            <div>
              <span>Final Stack</span>
              <strong>{finalCoins}</strong>
            </div>

            <div>
              <span>Net Result</span>
              <strong>{formatSignedCoins(netCoins)}</strong>
            </div>

            <div>
              <span>Best Score</span>
              <strong>{bestCoins}</strong>
            </div>

            <div>
              <span>Rounds</span>
              <strong>{roundsPlayed}</strong>
            </div>

            <div>
              <span>Wins</span>
              <strong>{sessionStats.wins}</strong>
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
            Results are for entertainment only. Virtual coins cannot be
            exchanged for cash, prizes, goods, or services.
          </p>
        </div>
      </section>
    </main>
  );
}

function InfoPage({ page, onBack }) {
  const selected = INFO_CONTENT[page];

  return (
    <main className="app page-shell">
      <section className="info-page">
        <button className="back-button" type="button" onClick={onBack}>
          Back to Play
        </button>

        {page === "contact" ? (
          <>
            <p className="eyebrow">Contact</p>

            <h1>Contact Topdeck Arena</h1>

            <p className="info-lead">
              Questions, feedback, corrections, and business inquiries can be
              sent directly by email.
            </p>

            <div className="info-card contact-card">
              <div className="contact-row">
                <span>Email</span>
                <a className="contact-link" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </div>

              <div className="contact-grid">
                <div>
                  <span>Best For</span>
                  <strong>Support and feedback</strong>
                </div>

                <div>
                  <span>Scope</span>
                  <strong>Free virtual gameplay only</strong>
                </div>
              </div>

              <p>
                Please do not send financial information. Topdeck Arena does
                not handle deposits, withdrawals, or real-money transactions.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow">{selected.eyebrow}</p>

            <h1>{selected.title}</h1>

            <p className="info-lead">{selected.lead}</p>

            <div className="info-card info-sections">
              {selected.sections.map((section) => (
                <section className="policy-section" key={section.title}>
                  <h2>{section.title}</h2>

                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
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
  const sessionWinRate =
    sessionStats.rounds > 0
      ? Math.round((sessionStats.wins / sessionStats.rounds) * 100)
      : 0;
  const netCoins = coins - STARTING_COINS;

  return (
    <main className="app page-shell">
      <section className="hero game-hero">
        <div>
          <p className="eyebrow">Current Table</p>

          <h1>{SITE_NAME}</h1>

          <p className="subtitle">
            Read the dealer's exposed card, set a virtual stake, and call the
            next card higher or lower. Every session stays strictly no-stakes.
          </p>

          <SafetyNotice compact />
        </div>

        <div className="stats-panel">
          <div>
            <span>Stack</span>
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
          <div className="table-badge">
            <span>Dealer card exposed</span>
            <strong>Make the call</strong>
          </div>

          <div className="cards-area">
            <Card card={dealerCard} label="Dealer Card" />
            <Card card={playerCard} hidden={!playerCard} label="Your Card" />
          </div>

          <div className={`message-box ${roundResult || ""}`}>
            <p>{message}</p>
          </div>

          <div className="controls">
            <div className="bet-panel">
              <label htmlFor="bet">Virtual Stake</label>

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
                    <small>Win +{bet} coins</small>
                  </button>

                  <button
                    className="secondary-button choice-button"
                    type="button"
                    onClick={() => onPlayRound("lower")}
                    disabled={!validBet}
                  >
                    <span>Lower</span>
                    <small>Win +{bet} coins</small>
                  </button>
                </>
              ) : (
                <button
                  className="primary-button wide"
                  type="button"
                  onClick={onNextRound}
                >
                  Deal Next Round
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="side-panel">
          <div className="rules-card">
            <h2>Table Rules</h2>

            <ul>
              {TABLE_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="session-card">
            <h2>Session Dashboard</h2>

            <div className="session-grid">
              <div>
                <span>Win Rate</span>
                <strong>{sessionWinRate}%</strong>
              </div>

              <div>
                <span>Net</span>
                <strong>{formatSignedCoins(netCoins)}</strong>
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
            <h2>Round Log</h2>

            {history.length === 0 ? (
              <p className="empty-history">
                No completed rounds yet. Your latest calls will appear here.
              </p>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div className="history-item" key={item.round}>
                    <div>
                      <strong>Round {item.round}</strong>
                      <span>
                        {item.choice} call / {item.bet} coins
                      </span>
                    </div>

                    <div className="history-result">
                      <span>
                        {item.dealer} vs {item.player}
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
            End Session
          </button>

          <button className="ghost-button" type="button" onClick={onRestart}>
            Restart Session
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
    "Set your virtual stake, then call Higher or Lower."
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
    setMessage("Set your virtual stake, then call Higher or Lower.");
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
      resultMessage = "Push. The card values matched, so your stake is returned.";
    } else if (outcome === OUTCOMES.WIN) {
      result = "Win";
      coinsChange = Number(bet);
      resultMessage = `Correct call. You gained ${bet} virtual coins.`;
    } else {
      result = "Loss";
      coinsChange = -Number(bet);
      resultMessage = `Missed call. ${bet} virtual coins were deducted.`;
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
    setMessage("Set your virtual stake, then call Higher or Lower.");
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
