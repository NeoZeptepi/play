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
  const [celebrating, setCelebrating] = useState(false);

  // Trigger celebration when the last pair is matched
  useEffect(() => {
    if (remainingPairs === 0) {
      setCelebrating(true);
      // stop celebration after 6s
      const id = window.setTimeout(() => setCelebrating(false), 6000);
      return () => window.clearTimeout(id);
    }
  }, [remainingPairs]);

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

      {/* Celebration overlay (kid-friendly) */}
      {celebrating && (
        <div
          role="dialog"
          aria-label="Celebration"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(255,255,255,0.0), rgba(255,255,255,0.6))",
              backdropFilter: "blur(2px)",
            }}
          />

          <div style={{ position: "relative", zIndex: 10000, textAlign: "center", padding: 20 }}>
            <div aria-hidden style={{ fontSize: 46, lineHeight: 1 }}>
              🎉🎈 Great job! 🎈🎉
            </div>
            <div style={{ marginTop: 8, fontSize: 20, color: "#333" }}>
              You matched all the numbers! You're a Match Ten Champion! 🌟
            </div>

            <div style={{ marginTop: 14 }}>
              <button
                onClick={reset}
                style={{ padding: "10px 14px", fontSize: 16, cursor: "pointer", borderRadius: 8 }}
              >
                Play again
              </button>
            </div>
          </div>

          {/* simple confetti pieces */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const left = Math.random() * 100;
              const delay = Math.random() * 0.8;
              const duration = 2 + Math.random() * 2;
              const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C084FC"];
              const bg = colors[Math.floor(Math.random() * colors.length)];
              const rotate = Math.random() * 360;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    top: `-10%`,
                    width: 10 + Math.random() * 10,
                    height: 8 + Math.random() * 12,
                    background: bg,
                    transform: `rotate(${rotate}deg)`,
                    borderRadius: 3,
                    opacity: 0.95,
                    animation: `matchten-fall ${duration}s linear ${delay}s forwards`,
                  }}
                />
              );
            })}
          </div>

          <style>{`
            @keyframes matchten-fall {
              0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
              70% { opacity: 1; }
              100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
            }
          `}</style>

          {/* ARIA live region for screen readers */}
          <div aria-live="polite" style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
            Congratulations! You matched all the numbers in {moves} moves.
          </div>
        </div>
      )}
    </main>
  );
}