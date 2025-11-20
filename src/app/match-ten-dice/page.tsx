"use client";

import React, { useEffect, useRef, useState } from "react";

type Cell = {
  id: number;
  value: number;
  matched: boolean;
};

const PAIRS: Array<[number, number]> = [
  [1, 9],
  [2, 8],
  [3, 7],
  [4, 6],
  [5, 5],
];

const COLORS = [
  "#FDE68A",
  "#FBCFE8",
  "#C7D2FE",
  "#BFDBFE",
  "#FCD34D",
  "#FCA5A5",
  "#D9F99D",
  "#A5F3FC",
  "#F5D0FE",
];

const pipLayouts: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
  7: [0, 2, 3, 4, 5, 6, 8],
  8: [0, 2, 3, 4, 5, 6, 7, 8],
  9: [0, 1, 2, 3, 4, 5, 6, 7, 8],
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeBoard(): Cell[] {
  const values: number[] = [];
  for (let i = 0; i < 18; i++) {
    const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)];
    values.push(pair[0], pair[1]);
  }
  return shuffle(values).map((value, idx) => ({ id: idx, value, matched: false }));
}

function DiceFace({ value }: { value: number }) {
  const layout = pipLayouts[value] ?? [];
  return (
    <div
      aria-hidden
      style={{
        width: 56,
        height: 56,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: 3,
        padding: 6,
      }}
    >
      {Array.from({ length: 9 }).map((_, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {layout.includes(idx) ? (
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#0f172a",
                boxShadow: "0 1px 0 rgba(0,0,0,0.3)",
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function MatchTenDice() {
  const [cells, setCells] = useState<Cell[]>(() => makeBoard());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);

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
    setCelebrating(false);
  }

  function handleClick(index: number) {
    if (blocked) return;
    const cell = cells[index];
    if (cell.matched) return;
    if (selected.includes(index)) {
      setSelected((s) => s.filter((idx) => idx !== index));
      return;
    }
    if (selected.length === 0) {
      setSelected([index]);
      return;
    }
    if (selected.length === 1) {
      const otherIdx = selected[0];
      if (otherIdx === index) return;
      const first = cells[otherIdx];
      const second = cell;
      setSelected([otherIdx, index]);
      setBlocked(true);
      setMoves((m) => m + 1);

      if (first.value + second.value === 10) {
        timeoutRef.current = window.setTimeout(() => {
          setCells((prev) =>
            prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, matched: true } : c))
          );
          setSelected([]);
          setBlocked(false);
        }, 400);
      } else {
        timeoutRef.current = window.setTimeout(() => {
          setSelected([]);
          setBlocked(false);
        }, 650);
      }
    }
  }

  const remainingPairs = cells.filter((c) => !c.matched).length / 2;

  useEffect(() => {
    if (remainingPairs === 0 && moves > 0) {
      setCelebrating(true);
      const id = window.setTimeout(() => setCelebrating(false), 5000);
      return () => window.clearTimeout(id);
    }
  }, [remainingPairs, moves]);

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto 1.75rem",
        paddingTop: ".25rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Match Ten Dice</h1>
          <p style={{ margin: "4px 0 0", color: "#475569" }}>
            Tap two colorful dice whose dots add to ten.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ color: "#0f172a", fontWeight: 600 }}>Moves: {moves}</div>
          <div style={{ color: "#0f172a", fontWeight: 600 }}>Pairs left: {remainingPairs}</div>
          <button
            onClick={reset}
            style={{
              padding: "9px 16px",
              background: "#0ea5e9",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: "0 5px 18px rgba(14,165,233,0.32)",
            }}
          >
            Reset Board
          </button>
        </div>
      </div>

      <div
        role="grid"
        aria-label="Match Ten Dice grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 14,
          maxWidth: 860,
          margin: "0 auto",
        }}
      >
        {cells.map((cell, idx) => {
          const isSelected = selected.includes(idx);
          const isMatched = cell.matched;
          const color = COLORS[(cell.value - 1) % COLORS.length];
          return (
            <button
              key={cell.id}
              onClick={() => handleClick(idx)}
              aria-pressed={isSelected}
              disabled={isMatched}
              aria-label={`Die showing ${cell.value} dots${isMatched ? " (matched)" : ""}`}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 20,
                border: isSelected ? "3px solid #0ea5e9" : "2px solid rgba(15,23,42,0.1)",
                background: isMatched ? "transparent" : color,
                boxShadow: isMatched
                  ? "none"
                  : "0 8px 20px rgba(15,23,42,0.15), inset 0 0 0 1px rgba(255,255,255,0.5)",
                cursor: isMatched ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "transform 140ms ease, border 160ms ease",
                transform: isSelected ? "translateY(-4px)" : "translateY(0)",
              }}
            >
              {!isMatched && <DiceFace value={cell.value} />}
              {isMatched && (
                <span style={{ fontSize: 18, color: "#10b981", fontWeight: 700 }}>✔</span>
              )}
            </button>
          );
        })}
      </div>

      {celebrating && (
        <div
          role="dialog"
          aria-label="You cleared every pair"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15,23,42,0.65)",
              backdropFilter: "blur(3px)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1010,
              background: "white",
              padding: "24px 32px",
              borderRadius: 20,
              textAlign: "center",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ fontSize: 40 }}>🎲✨</div>
            <h2 style={{ margin: "12px 0 4px" }}>Ten out of Ten!</h2>
            <p style={{ margin: 0, color: "#475569" }}>Every pair of dice is matched. Fantastic focus!</p>
            <button
              onClick={reset}
              style={{
                marginTop: 16,
                padding: "10px 18px",
                borderRadius: 999,
                border: "none",
                background: "#10b981",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Play again
            </button>
          </div>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {Array.from({ length: 45 }).map((_, i) => {
              const left = Math.random() * 100;
              const delay = Math.random() * 1.2;
              const duration = 2 + Math.random() * 2.5;
              const colors = ["#0ea5e9", "#f97316", "#a855f7", "#22c55e", "#facc15"];
              const size = 6 + Math.random() * 10;
              return (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    top: "-10%",
                    width: size,
                    height: size,
                    borderRadius: 2,
                    background: colors[Math.floor(Math.random() * colors.length)],
                    opacity: 0.9,
                    animation: `dice-confetti ${duration}s linear ${delay}s forwards`,
                  }}
                />
              );
            })}
          </div>
          <style>{`
            @keyframes dice-confetti {
              0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
              70% { opacity: 1; }
              100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
            }
          `}</style>
          <div aria-live="polite" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
            Awesome! You matched every dice pair.
          </div>
        </div>
      )}
    </main>
  );
}
