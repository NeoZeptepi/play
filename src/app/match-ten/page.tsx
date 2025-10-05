"use client";

import React, { useEffect, useRef, useState } from "react";

type Cell = {
  id: number;
  value: number;
  matched: boolean;
};

const PAIRS: Array<[number, number]> = [
  [0, 10],
  [1, 9],
  [2, 8],
  [3, 7],
  [4, 6],
  [5, 5],
];

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeBoard(): Cell[] {
  // Need 36 cells => 18 pairs. Choose 18 pairs randomly (with replacement) from PAIRS
  const pairs: number[] = [];
  for (let i = 0; i < 18; i++) {
    const p = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    pairs.push(p[0], p[1]);
  }
  const shuffled = shuffle(pairs).map((v, idx) => ({ id: idx, value: v, matched: false }));
  return shuffled;
}

export default function MatchTen() {
  const [cells, setCells] = useState<Cell[]>(() => makeBoard());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function reset() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCells(makeBoard());
    setSelected([]);
    setMoves(0);
    setBlocked(false);
  }

  function handleClick(i: number) {
    if (blocked) return;
    const cell = cells[i];
    if (cell.matched) return;
    if (selected.includes(i)) {
      // toggle off
      setSelected((s) => s.filter((x) => x !== i));
      return;
    }
    if (selected.length === 0) {
      setSelected([i]);
      return;
    }
    if (selected.length === 1) {
      const firstIdx = selected[0];
      const secondIdx = i;
      // prevent clicking the same cell twice
      if (firstIdx === secondIdx) return;
      const first = cells[firstIdx];
      const second = cells[secondIdx];
      setSelected([firstIdx, secondIdx]);
      setBlocked(true);
      setMoves((m) => m + 1);

      if (first.value + second.value === 10) {
        // match!
        timeoutRef.current = window.setTimeout(() => {
          setCells((prev) =>
            prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, matched: true } : c))
          );
          setSelected([]);
          setBlocked(false);
        }, 400);
      } else {
        // not a match — flip back
        timeoutRef.current = window.setTimeout(() => {
          setSelected([]);
          setBlocked(false);
        }, 700);
      }
    }
  }

  const remainingPairs = cells.filter((c) => !c.matched).length / 2;

  return (
    <main style={{ maxWidth: 980, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Match Ten</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ color: "#444" }}>Moves: {moves}</div>
          <div style={{ color: "#444" }}>Pairs left: {remainingPairs}</div>
          <button onClick={reset} style={{ padding: "8px 12px", cursor: "pointer" }}>
            Reset
          </button>
        </div>
      </div>

      <div
        role="grid"
        aria-label="Match Ten grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 10,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        {cells.map((cell, idx) => {
          const isSelected = selected.includes(idx);
          const isMatched = cell.matched;
          return (
            <button
              key={cell.id}
              onClick={() => handleClick(idx)}
              aria-pressed={isSelected}
              disabled={isMatched}
              style={{
                height: 72,
                borderRadius: 8,
                border: isSelected ? "2px solid #0070f3" : "1px solid #ddd",
                background: isMatched ? "transparent" : isSelected ? "#e6f0ff" : "#fafafa",
                boxShadow: isMatched ? "none" : "0 1px 2px rgba(0,0,0,0.03)",
                fontSize: 20,
                fontWeight: 700,
                color: isMatched ? "transparent" : "#111",
                cursor: isMatched ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 160ms ease",
              }}
            >
              {!isMatched ? cell.value : ""}
            </button>
          );
        })}
      </div>

      {remainingPairs === 0 && (
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <strong>Nice!</strong> You cleared the board in {moves} moves.
        </div>
      )}
    </main>
  );
}