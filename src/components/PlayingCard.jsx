function PlayingCard({ card, hidden = false }) {
  if (hidden || !card) {
    return (
      <div className="playing-card">
        <div className="card-back">
          <span className="card-back-pattern">?</span>
        </div>
      </div>
    );
  }

  const colorClass = card.color === "red" ? "card-red" : "card-black";

  return (
    <div className="playing-card">
      <div className={`card-face ${colorClass}`}>
        <div className="card-corner top-left">
          <span className="card-rank">{card.label}</span>
          <span className="card-suit">{card.suit}</span>
        </div>

        <div className="card-center">{card.suit}</div>

        <div className="card-corner bottom-right">
          <span className="card-rank">{card.label}</span>
          <span className="card-suit">{card.suit}</span>
        </div>
      </div>
    </div>
  );
}

export default PlayingCard;