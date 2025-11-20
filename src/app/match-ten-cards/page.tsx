"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Card = {
  id: number;
  value: number;
  isMatched: boolean;
};

const TOTAL_TIME_MS = 2 * 60 * 1000; // two minutes
const DEAL_INTERVAL_MS = 5000;
const MAX_VISIBLE = 8;

function buildDeck(): Card[] {
  const cards: Card[] = [];
  let id = 0;
  // Four suits worth of number cards 1-10 gives 40 total cards
  for (let suit = 0; suit < 4; suit++) {
    for (let value = 1; value <= 10; value++) {
      cards.push({ id: id++, value, isMatched: false });
    }
  }
  return shuffle(cards);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MatchTenCards() {
  const [queue, setQueue] = useState<Card[]>(() => buildDeck());
  const [activeCards, setActiveCards] = useState<Card[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_MS);
  const [gameState, setGameState] = useState<"running" | "finished">("running");
  const [message, setMessage] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const dealerRef = useRef<number | null>(null);

  const timeDisplay = useMemo(() => {
    const seconds = Math.max(0, Math.floor(timeLeft / 1000));
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }, [timeLeft]);

  const dealOne = useCallback(() => {
    setQueue((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;
      const [next, ...rest] = prevQueue;
      setActiveCards((prevActive) => {
        if (prevActive.length >= MAX_VISIBLE) {
          // put card back if board is full
          setQueue((requeue) => [next, ...requeue]);
          return prevActive;
        }
        return [...prevActive, next];
      });
      return rest;
    });
  }, []);

  const fillBoardInitially = useCallback(() => {
    setActiveCards([]);
    setQueue((prev) => {
      const working = [...prev];
      const newActive: Card[] = [];
      while (newActive.length < MAX_VISIBLE && working.length) {
        newActive.push(working.shift()!);
      }
      setActiveCards(newActive);
      return working;
    });
  }, []);

  const endGame = useCallback(
    (finalMatches?: number) => {
      setGameState("finished");
      setMessage(`Great work! You matched ${finalMatches ?? matches} pairs in two minutes.`);
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (dealerRef.current) window.clearInterval(dealerRef.current);
      timerRef.current = null;
      dealerRef.current = null;
    },
    [matches]
  );

  const reset = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (dealerRef.current) window.clearInterval(dealerRef.current);
    timerRef.current = null;
    dealerRef.current = null;
    const newDeck = buildDeck();
    setQueue(newDeck.slice(MAX_VISIBLE));
    setActiveCards(newDeck.slice(0, MAX_VISIBLE));
    setSelectedIds([]);
    setMatches(0);
    setTimeLeft(TOTAL_TIME_MS);
    setMessage(null);
    setGameState("running");
  }, []);

  // Start timer + dealer intervals
  useEffect(() => {
    if (gameState !== "running") return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          window.clearInterval(timerRef.current!);
          timerRef.current = null;
          endGame();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    dealerRef.current = window.setInterval(() => {
      setActiveCards((prev) => {
        if (prev.length >= MAX_VISIBLE || queue.length === 0 || gameState !== "running") {
          return prev;
        }
        dealOne();
        return prev;
      });
    }, DEAL_INTERVAL_MS);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (dealerRef.current) window.clearInterval(dealerRef.current);
    };
  }, [dealOne, endGame, gameState, queue.length]);

  // Ensure board starts populated on mount/reset
  useEffect(() => {
    fillBoardInitially();
  }, [fillBoardInitially]);

  const handleSelect = (cardId: number) => {
    if (gameState !== "running") return;
    const card = activeCards.find((c) => c.id === cardId);
    if (!card || card.isMatched) return;

    if (selectedIds.includes(cardId)) {
      setSelectedIds((prev) => prev.filter((id) => id !== cardId));
      return;
    }

    if (selectedIds.length === 0) {
      setSelectedIds([cardId]);
      return;
    }

    if (selectedIds.length === 1) {
      const firstCard = activeCards.find((c) => c.id === selectedIds[0]);
      if (!firstCard) return;

      const newSelection = [selectedIds[0], cardId];
      setSelectedIds(newSelection);

      if (firstCard.value + card.value === 10) {
        window.setTimeout(() => {
          setActiveCards((prev) => prev.filter((c) => !newSelection.includes(c.id)));
          setMatches((m) => m + 1);
          setSelectedIds([]);
          // Replace matched cards immediately
          dealOne();
          dealOne();
        }, 300);
      } else {
        window.setTimeout(() => setSelectedIds([]), 600);
      }
    }
  };

  const cardsRemaining = queue.length + activeCards.length;

  const board = (
    <div
      role="grid"
      aria-label="Match Ten Cards"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 16,
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {activeCards.map((card) => {
        const isSelected = selectedIds.includes(card.id);
        return (
          <button
            key={card.id}
            onClick={() => handleSelect(card.id)}
            aria-pressed={isSelected}
            disabled={gameState === "finished"}
            style={{
              aspectRatio: "3 / 4",
              borderRadius: 16,
              border: isSelected ? "3px solid #10b981" : "2px solid rgba(15,23,42,0.12)",
              background: "#fff",
              boxShadow: "0 12px 30px rgba(15,23,42,0.15)",
              cursor: gameState === "finished" ? "default" : "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              position: "relative",
              transition: "transform 160ms ease, border 160ms ease",
              transform: isSelected ? "translateY(-6px)" : "translateY(0)",
              fontFamily: "'Fira Sans', system-ui, sans-serif",
            }}
          >
            <span style={{ fontSize: 48, fontWeight: 700, color: "#0f172a" }}>{card.value}</span>
            <span style={{ fontSize: 14, letterSpacing: 2, color: "#475569" }}>CARD</span>
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 10,
                right: 14,
                fontSize: 16,
                color: "#cbd5f5",
                fontWeight: 600,
              }}
            >
              {card.value}
            </div>
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 10,
                left: 14,
                fontSize: 16,
                color: "#cbd5f5",
                fontWeight: 600,
                transform: "rotate(180deg)",
              }}
            >
              {card.value}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto 2rem",
        paddingTop: ".25rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Match Ten Cards</h1>
          <p style={{ marginTop: 4, color: "#475569" }}>
            Cards flip in every few seconds. Tap two that sum to ten before the two-minute timer ends.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
            fontSize: 15,
            color: "#0f172a",
            fontWeight: 600,
          }}
        >
          <div>Time left: <span style={{ fontVariantNumeric: "tabular-nums" }}>{timeDisplay}</span></div>
          <div>Pairs matched: {matches}</div>
          <button
            onClick={reset}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reset Game
          </button>
        </div>
      </div>

      {board}

      <div style={{ marginTop: 16, color: "#64748b", fontSize: 14 }}>
        Cards remaining in deck: {cardsRemaining}
      </div>

      {gameState === "finished" && message && (
        <div
          role="status"
          style={{
            marginTop: 24,
            padding: "16px 20px",
            borderRadius: 12,
            background: "#ecfccb",
            color: "#14532d",
            fontWeight: 600,
          }}
        >
          {message}
        </div>
      )}
    </main>
  );
}
