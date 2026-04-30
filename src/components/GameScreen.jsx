import { PHASES, OUTCOMES } from "../logic/gameLogic";
import PlayingCard from "./PlayingCard";
import StatusBar from "./StatusBar";
import BetPanel from "./BetPanel";

function ResultBanner({ outcome, delta }) {
  if (!outcome) {
    return null;
  }

  const messages = {
    [OUTCOMES.WIN]: {
      title: "Hai indovinato",
      detail: `+${delta} coins`,
      className: "result-win",
    },
    [OUTCOMES.LOSS]: {
      title: "Sbagliato",
      detail: `${delta} coins`,
      className: "result-loss",
    },
    [OUTCOMES.TIE]: {
      title: "Pareggio",
      detail: "Puntata restituita",
      className: "result-tie",
    },
  };

  const message = messages[outcome];

  return (
    <section className={`result-banner ${message.className}`}>
      <span className="result-title">{message.title}</span>
      <span className="result-detail">{message.detail}</span>
    </section>
  );
}

function GameScreen({ game, onPlaceBet, onMakeChoice, onNextRound, onQuitGame }) {
  const isBetting = game.phase === PHASES.BETTING;
  const isChoosing = game.phase === PHASES.CHOOSING;
  const isReveal = game.phase === PHASES.REVEAL;

  return (
    <main className="screen game-screen">
      <div className="game-layout">
        <StatusBar game={game} />

        <section className="cards-area">
          <div className="card-slot">
            <span className="card-label">Banco</span>
            <PlayingCard card={game.bankerCard} hidden={isBetting} />
          </div>

          <div className="vs-divider">VS</div>

          <div className="card-slot">
            <span className="card-label">Tu</span>
            <PlayingCard card={game.playerCard} hidden={!isReveal} />
          </div>
        </section>

        {isReveal && (
          <ResultBanner outcome={game.lastOutcome} delta={game.lastDelta} />
        )}

        {(isBetting || isChoosing) && (
          <BetPanel
            game={game}
            onPlaceBet={onPlaceBet}
            onMakeChoice={onMakeChoice}
          />
        )}

        {isReveal && (
          <section className="reveal-actions">
            <button type="button" className="btn-primary" onClick={onNextRound}>
              {game.balance <= 0 ? "Vedi riepilogo" : "Prossimo turno"}
            </button>

            {game.balance > 0 && (
              <button type="button" className="btn-secondary" onClick={onQuitGame}>
                Termina partita
              </button>
            )}
          </section>
        )}

        {!isReveal && (
          <button type="button" className="btn-secondary btn-quit" onClick={onQuitGame}>
            Termina partita
          </button>
        )}
      </div>
    </main>
  );
}

export default GameScreen;