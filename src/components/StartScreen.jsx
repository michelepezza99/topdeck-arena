function StartScreen({ onStart }) {
  return (
    <main className="screen start-screen">
      <section className="start-card">
        <p className="eyebrow">Virtual coins card game</p>

        <h1 className="title-display">High or Low Cards</h1>

        <p className="subtitle">
          Punta coins virtuali, scopri la carta del banco e prova a indovinare
          se la tua carta sarà più alta o più bassa.
        </p>

        <div className="rules-box">
          <h2>Regole principali</h2>

          <ul>
            <li>Inizi ogni partita con <strong>500 coins virtuali</strong>.</li>
            <li>La puntata minima è <strong>1 coin</strong>.</li>
            <li>L’Asso è la carta più alta e vale <strong>14</strong>.</li>
            <li>Se indovini, vinci la puntata.</li>
            <li>Se sbagli, perdi la puntata.</li>
            <li>In caso di pareggio, il saldo resta invariato.</li>
          </ul>
        </div>

        <p className="disclaimer">
          Questo è un progetto educativo e ricreativo. Non usa soldi reali,
          non prevede pagamenti, premi, prelievi o conversioni in denaro.
        </p>

        <button type="button" className="btn-primary btn-large" onClick={onStart}>
          Inizia partita
        </button>
      </section>
    </main>
  );
}

export default StartScreen;