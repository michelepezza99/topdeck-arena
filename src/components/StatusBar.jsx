function StatusBar({ game }) {
  return (
    <section className="status-bar">
      <div className="status-item status-balance">
        <span className="status-label">Saldo</span>
        <span className="status-value">
          {game.balance}
          <span className="coin-icon"></span>
        </span>
      </div>

      <div className="status-item">
        <span className="status-label">Turni</span>
        <span className="status-value">{game.stats.rounds}</span>
      </div>

      <div className="status-item">
        <span className="status-label">Vittorie</span>
        <span className="status-value">{game.stats.wins}</span>
      </div>

      <div className="status-item">
        <span className="status-label">Record</span>
        <span className="status-value">{game.stats.peakBalance}</span>
      </div>
    </section>
  );
}

export default StatusBar;