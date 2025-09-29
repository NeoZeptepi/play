export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Play @ garrett.org</h1>
      <p>Choose a game:</p>
      <ul>
        <li><a href="/the-hiding-game">The Hiding Game</a></li>
        <li><a href="/match-ten">Match Ten</a></li>
      </ul>
    </main>
  );
}