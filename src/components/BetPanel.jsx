import { useState } from "react";
import { CHOICES, PHASES, validateBet } from "../logic/gameLogic";

function BetPanel({ game, onPlaceBet, onMakeChoice }) {
  const [betInput, setBetInput] = useState("");
  const [error, setError] = useState("");

  function handlePlaceBet() {
    const amount = Number(betInput);
    const validation = validateBet(amount, game.balance);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError("");
    onPlaceBet(amount);
    setBetInput("");
  }

  function setShortcut(amount) {
    setBetInput(String(Math.min(amount, game.balance)));
    setError("");
  }

  if (game.phase === PHASES.CHOOSING) {
    return (
      <section className="bet-panel">
        <p className="bet-locked">
          Puntata confermata: <strong>{game.currentBet} coins</strong>
        </p>

        <div className="choice-buttons">
          <button
            type="button"
            className="btn-choice btn-higher"
            onClick={() => onMakeChoice(CHOICES.HIGHER)}
          >
            <span className="choice-arrow">↑</span>
            Più alta
          </button>

          <button
            type="button"
            className="btn-choice btn-lower"
            onClick={() => onMakeChoice(CHOICES.LOWER)}
          >
            <span className="choice-arrow">↓</span>
            Più bassa
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bet-panel">
      <label className="bet-label" htmlFor="bet-input">
        Quanto vuoi puntare?
      </label>

      <div className="bet-input-row">
        <input
          id="bet-input"
          className="bet-input"
          type="number"
          min="1"
          max={game.balance}
          step="1"
          value={betInput}
          onChange={(event) => setBetInput(event.target.value)}
          placeholder="50"
        />

        <span className="bet-input-suffix">coins</span>
      </div>

      <div className="bet-shortcuts">
        <button type="button" onClick={() => setShortcut(10)}>
          10
        </button>

        <button type="button" onClick={() => setShortcut(25)}>
          25
        </button>

        <button type="button" onClick={() => setShortcut(50)}>
          50
        </button>

        <button type="button" onClick={() => setShortcut(100)}>
          100
        </button>

        <button type="button" onClick={() => setShortcut(game.balance)}>
          All in
        </button>
      </div>

      {error && <p className="bet-error">{error}</p>}

      <button
        type="button"
        className="btn-primary btn-place-bet"
        onClick={handlePlaceBet}
      >
        Conferma puntata
      </button>
    </section>
  );
}

export default BetPanel;