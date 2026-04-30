import { STARTING_BALANCE } from "../logic/gameLogic";

function EndScreen({ game, onNewGame, onBackHome }) {
  const profit = game.balance - STARTING_BALANCE;

  let moodClass = "mood-neutral";
  let title = "Partita conclusa";

  if (profit > 0) {
    moodClass = "mood-win";
    title = "Ottima partita";
  }

  if (profit < 0) {
    moodClass = "mood-loss";
    title = "Partita conclusa";
  }

  return (
    <main className="screen end-screen">
      <section className={`end-card ${moodClass}`}>
        <p className="eyebrow">Riepilogo finale</p>

        <h1 className="title-display">{title}</h1>

        <p className="subtitle">
          Hai iniziato con {STARTING_BALANCE} coins virtuali e hai concluso con{" "}
          {game.balance} coins.
        </p>

        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Saldo finale</span>
            <span className="summary-value">{game.balance}</span>
          </div>

          <div className="summary-item summary-highlight">
            <span className="summary-label">Risultato</span>
            <span className="summary-value">
              {profit > 0 ? "+" : ""}
              {profit}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Turni</span>
            <span className="summary-value">{game.stats.rounds}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Record saldo</span>
            <span className="summary-value">{game.stats.peakBalance}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Vittorie</span>
            <span className="summary-value">{game.stats.wins}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Sconfitte</span>
            <span className="summary-value">{game.stats.losses}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Pareggi</span>
            <span className="summary-value">{game.stats.ties}</span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Coins iniziali</span>
            <span className="summary-value">{STARTING_BALANCE}</span>
          </div>
        </div>

        <div className="end-actions">
          <button type="button" className="btn-primary" onClick={onNewGame}>
            Nuova partita
          </button>

          <button type="button" className="btn-secondary" onClick={onBackHome}>
            Torna alla home
          </button>
        </div>
      </section>
    </main>
  );
}

export default EndScreen;