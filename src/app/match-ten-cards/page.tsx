"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type Card = {
  id: number;
  value: number;
};

type CardStyle = {
  top: number;
  left: number;
  rotation: number;
};

type FireworkPattern = "burst" | "ring" | "spray" | "spark";

type Firework = {
  id: number;
  x: number;
  hue: number;
  delay: number;
  origin: "top" | "bottom";
  pattern: FireworkPattern;
  burstSize: number;
  travelMultiplier: number;
  burstShadow: string;
};

const TOTAL_TIME_MS = 2 * 60 * 1000; // two minutes
const DEAL_INTERVAL_MS = 5000;
const MAX_VISIBLE = 10;
const INITIAL_VISIBLE = MAX_VISIBLE;
const FIREWORK_DURATION_MS = 2200;

const FIREWORK_PATTERNS: FireworkPattern[] = ["burst", "ring", "spray", "spark"];

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const toShadow = (x: number, y: number, blur = 0, spread = -3) =>
  `${x.toFixed(1)}px ${y.toFixed(1)}px ${blur}px ${spread}px currentColor`;

const buildFireworkShadow = (pattern: FireworkPattern, size: number) => {
  const entries: string[] = ["0 0 22px currentColor", "0 0 38px rgba(255,255,255,0.3)"];

  if (pattern === "burst") {
    const rays = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 * i) / rays;
      const radius = randomBetween(26, 48) * size;
      entries.push(toShadow(Math.cos(angle) * radius, Math.sin(angle) * radius, 0, -3));
    }
  } else if (pattern === "ring") {
    const dots = 12 + Math.floor(Math.random() * 4);
    const outer = randomBetween(32, 54) * size;
    for (let i = 0; i < dots; i++) {
      const angle = (Math.PI * 2 * i) / dots;
      entries.push(toShadow(Math.cos(angle) * outer, Math.sin(angle) * outer, 0, -4));
    }
    const inner = outer * randomBetween(0.45, 0.7);
    entries.push(toShadow(0, 0, Math.max(8, inner * 0.6), -6));
  } else if (pattern === "spray") {
    const sparks = 10 + Math.floor(Math.random() * 6);
    for (let i = 0; i < sparks; i++) {
      const radius = randomBetween(20, 60) * size;
      const angle = randomBetween(-Math.PI / 1.8, Math.PI / 1.8);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius + randomBetween(4, 20) * size;
      entries.push(toShadow(x, y, 0, -2));
    }
  } else {
    const cross = randomBetween(20, 36) * size;
    entries.push(
      toShadow(cross, 0, 0, -3),
      toShadow(-cross, 0, 0, -3),
      toShadow(0, cross, 0, -3),
      toShadow(0, -cross, 0, -3)
    );
    const diagonals = cross * 0.7;
    entries.push(
      toShadow(diagonals, diagonals, 0, -3),
      toShadow(-diagonals, diagonals, 0, -3),
      toShadow(diagonals, -diagonals, 0, -3),
      toShadow(-diagonals, -diagonals, 0, -3)
    );
  }

  return entries.join(", ");
};

const CARD_POSITIONS = [
  { top: 22, left: 18 },
  { top: 22, left: 34 },
  { top: 22, left: 50 },
  { top: 22, left: 66 },
  { top: 22, left: 82 },
  { top: 55, left: 18 },
  { top: 55, left: 34 },
  { top: 55, left: 50 },
  { top: 55, left: 66 },
  { top: 55, left: 82 },
] as const;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function MatchTenCards() {
  const [activeCards, setActiveCards] = useState<Card[]>([]);
  const [cardStyles, setCardStyles] = useState<Record<number, CardStyle>>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_MS);
  const [gameState, setGameState] = useState<"idle" | "running" | "finished">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  const timerRef = useRef<number | null>(null);
  const dealerRef = useRef<number | null>(null);
  const activeCountRef = useRef(0);
  const nextCardIdRef = useRef(0);
  const fireworkIdRef = useRef(0);
  const slotAssignmentsRef = useRef<Record<number, number>>({});
  const deckRef = useRef<Card[]>([]);

  useEffect(() => {
    activeCountRef.current = activeCards.length;
  }, [activeCards.length]);

  const timeDisplay = useMemo(() => {
    const seconds = Math.max(0, Math.floor(timeLeft / 1000));
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }, [timeLeft]);

  const getAvailableSlotIndex = useCallback(() => {
    const used = new Set(Object.values(slotAssignmentsRef.current));
    const available = CARD_POSITIONS.map((_, idx) => idx).filter((idx) => !used.has(idx));
    if (!available.length) {
      return Math.floor(Math.random() * CARD_POSITIONS.length);
    }
    const picked = available[Math.floor(Math.random() * available.length)];
    return picked;
  }, []);

  const assignStyleToCard = useCallback(
    (styles: Record<number, CardStyle>, cardId: number) => {
      const slotIndex = getAvailableSlotIndex();
      slotAssignmentsRef.current[cardId] = slotIndex;
      const slot = CARD_POSITIONS[slotIndex];
      const jitter = 2.4;
      styles[cardId] = {
        top: slot.top + (Math.random() - 0.5) * jitter,
        left: slot.left + (Math.random() - 0.5) * jitter,
        rotation: -8 + Math.random() * 16,
      };
    },
    [getAvailableSlotIndex]
  );

  const releaseSlot = useCallback((cardId: number) => {
    delete slotAssignmentsRef.current[cardId];
  }, []);

  const buildDeck = useCallback((): Card[] => {
    const cards: Card[] = [];
    for (let suit = 0; suit < 4; suit++) {
      for (let value = 1; value <= 9; value++) {
        cards.push({ id: nextCardIdRef.current++, value });
      }
    }
    return shuffle(cards);
  }, []);

  const replenishDeck = useCallback(() => {
    if (deckRef.current.length >= MAX_VISIBLE * 5) {
      return;
    }
    const working = [...deckRef.current];
    while (working.length < MAX_VISIBLE * 5) {
      working.push(...buildDeck());
    }
    deckRef.current = working;
  }, [buildDeck]);

  const drawCards = useCallback(
    (count: number) => {
      if (count <= 0) return [] as Card[];
      replenishDeck();
      const availableSlots = Math.max(0, MAX_VISIBLE - activeCountRef.current);
      const toDraw = Math.min(count, availableSlots);
      if (toDraw <= 0) {
        return [];
      }
      const drawn = deckRef.current.slice(0, toDraw);
      deckRef.current = deckRef.current.slice(toDraw);
      activeCountRef.current += toDraw;
      return drawn;
    },
    [replenishDeck]
  );

  const returnCardToDeck = useCallback((card: Card) => {
    deckRef.current = [...deckRef.current, card];
  }, []);

  const scheduleFinaleFireworks = useCallback((count: number) => {
    const total = Math.max(0, count) * 3;
    if (total <= 0) {
      setFireworks([]);
      return;
    }
    const rockets: Firework[] = Array.from({ length: total }).map((_, idx) => {
      const pattern = FIREWORK_PATTERNS[Math.floor(Math.random() * FIREWORK_PATTERNS.length)];
      const burstSize = 1.15 + Math.random() * 1.35;
      const travelMultiplier = 0.85 + Math.random() * 1.15;
      return {
        id: fireworkIdRef.current++,
        x: 8 + Math.random() * 84,
        hue: 180 + Math.random() * 120,
        delay: idx * 140 + Math.random() * 160,
        origin: Math.random() > 0.5 ? "bottom" : "top",
        pattern,
        burstSize,
        travelMultiplier,
        burstShadow: buildFireworkShadow(pattern, burstSize),
      };
    });
    setFireworks(rockets);
  }, []);

  const addCardsToBoard = useCallback(
    (count: number) => {
      const drawn = drawCards(count);
      if (!drawn.length) return;
      setActiveCards((prev) => [...prev, ...drawn]);
      setCardStyles((prev) => {
        const next = { ...prev };
        drawn.forEach((card) => {
          assignStyleToCard(next, card.id);
        });
        return next;
      });
    },
    [assignStyleToCard, drawCards]
  );

  const hasPlayablePair = useCallback((cards: Card[]) => {
    if (cards.length < 2) return true;
    const counts = new Map<number, number>();
    for (const card of cards) {
      const complement = 10 - card.value;
      if ((counts.get(complement) ?? 0) > 0) {
        return true;
      }
      counts.set(card.value, (counts.get(card.value) ?? 0) + 1);
    }
    return false;
  }, []);

  const findComplementMatch = useCallback(
    (board: Card[]) => {
      replenishDeck();
      for (const boardCard of board) {
        const complementValue = 10 - boardCard.value;
        const index = deckRef.current.findIndex((card) => card.value === complementValue);
        if (index !== -1) {
          const [replacement] = deckRef.current.splice(index, 1);
          return { boardCardId: boardCard.id, replacement } as const;
        }
      }
      return null;
    },
    [replenishDeck]
  );

  const ensurePairExists = useCallback(() => {
    let removedId: number | null = null;
    let replacement: Card | null = null;
    setActiveCards((prevCards) => {
      if (prevCards.length < 2 || hasPlayablePair(prevCards)) {
        return prevCards;
      }

      const match = findComplementMatch(prevCards);
      if (!match) {
        return prevCards;
      }

      const cardToSwapOut = prevCards.find((card) => card.id !== match.boardCardId) ?? prevCards[0];
      removedId = cardToSwapOut.id;
      replacement = match.replacement;
      returnCardToDeck(cardToSwapOut);
      return prevCards.map((card) => (card.id === cardToSwapOut.id ? match.replacement : card));
    });

    if (removedId === null || replacement === null) return;

    releaseSlot(removedId);
    setCardStyles((prevStyles) => {
      const next = { ...prevStyles };
      delete next[removedId!];
      assignStyleToCard(next, replacement!.id);
      return next;
    });
    setSelectedIds((prev) => prev.filter((id) => id !== removedId));
  }, [assignStyleToCard, findComplementMatch, hasPlayablePair, releaseSlot, returnCardToDeck]);

  const endGame = useCallback(
    (finalMatches?: number) => {
      setGameState("finished");
      setMessage(`Great work! You matched ${finalMatches ?? matches} pairs in two minutes.`);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (dealerRef.current) {
        window.clearInterval(dealerRef.current);
        dealerRef.current = null;
      }
    },
    [matches]
  );

  const reset = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (dealerRef.current) {
      window.clearInterval(dealerRef.current);
      dealerRef.current = null;
    }

    deckRef.current = [];
    replenishDeck();
    activeCountRef.current = 0;
    slotAssignmentsRef.current = {};
    const initialCards = drawCards(INITIAL_VISIBLE);
    setActiveCards(initialCards);
    setCardStyles(() => {
      const styles: Record<number, CardStyle> = {};
      initialCards.forEach((card) => {
        assignStyleToCard(styles, card.id);
      });
      return styles;
    });
    setSelectedIds([]);
    setMatches(0);
    setFireworks([]);
    fireworkIdRef.current = 0;
    setTimeLeft(TOTAL_TIME_MS);
    setMessage(null);
    setGameState("running");
  }, [assignStyleToCard, drawCards, replenishDeck]);

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

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [endGame, gameState]);

  useEffect(() => {
    if (dealerRef.current) {
      window.clearInterval(dealerRef.current);
      dealerRef.current = null;
    }
    if (gameState !== "running") return;
    dealerRef.current = window.setInterval(() => {
      addCardsToBoard(1);
    }, DEAL_INTERVAL_MS);

    return () => {
      if (dealerRef.current) {
        window.clearInterval(dealerRef.current);
        dealerRef.current = null;
      }
    };
  }, [addCardsToBoard, gameState]);

  useEffect(() => {
    if (gameState === "idle") {
      reset();
    }
  }, [gameState, reset]);

  useEffect(() => {
    if (gameState !== "running") return;
    const deficit = MAX_VISIBLE - activeCards.length;
    if (deficit > 0) {
      addCardsToBoard(deficit);
    }
  }, [activeCards.length, addCardsToBoard, gameState]);

  useEffect(() => {
    if (gameState !== "running") return;
    ensurePairExists();
  }, [activeCards, ensurePairExists, gameState]);

  useEffect(() => {
    if (gameState === "finished") {
      scheduleFinaleFireworks(matches);
      return;
    }
    setFireworks([]);
    fireworkIdRef.current = 0;
  }, [gameState, matches, scheduleFinaleFireworks]);

  const handleSelect = (cardId: number) => {
    if (gameState !== "running") return;
    const card = activeCards.find((c) => c.id === cardId);
    if (!card) return;

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
          activeCountRef.current = Math.max(0, activeCountRef.current - newSelection.length);
          const replacements = drawCards(newSelection.length);

          setActiveCards((prev) => {
            const remaining = prev.filter((c) => !newSelection.includes(c.id));
            return replacements.length ? [...remaining, ...replacements] : remaining;
          });

          setCardStyles((prev) => {
            const next = { ...prev };
            newSelection.forEach((id) => {
              delete next[id];
              releaseSlot(id);
            });
            replacements.forEach((card) => {
              assignStyleToCard(next, card.id);
            });
            return next;
          });

          setMatches((m) => m + 1);
          setSelectedIds([]);
        }, 300);
      } else {
        window.setTimeout(() => setSelectedIds([]), 600);
      }
    }
  };

  return (
    <>
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
            Tap two cards that add to ten. The table keeps dealing fresh cards for the full two minutes.
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
          <div>
            Time left: <span style={{ fontVariantNumeric: "tabular-nums" }}>{timeDisplay}</span>
          </div>
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

      <div
        role="grid"
        aria-label="Match Ten Cards"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1000,
          minHeight: 520,
          margin: "0 auto",
          background: "radial-gradient(circle at top, rgba(255,255,255,0.9), rgba(248,250,252,0.95))",
          borderRadius: 30,
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 25px 60px rgba(15,23,42,0.08)",
          overflow: "hidden",
        }}
      >
        {activeCards.map((card) => {
          const isSelected = selectedIds.includes(card.id);
          const style = cardStyles[card.id];
          const top = style?.top ?? 50;
          const left = style?.left ?? 50;
          const rotation = style?.rotation ?? 0;
          return (
            <button
              key={card.id}
              onClick={() => handleSelect(card.id)}
              aria-pressed={isSelected}
              disabled={gameState === "finished"}
              style={{
                position: "absolute",
                top: `${top}%`,
                left: `${left}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg) ${isSelected ? "scale(1.05)" : "scale(1)"}`,
                transformOrigin: "center",
                width: 132,
                aspectRatio: "3 / 4",
                borderRadius: 18,
                border: isSelected ? "3px solid #10b981" : "2px solid rgba(15,23,42,0.12)",
                background: "#fff",
                boxShadow: "0 18px 40px rgba(15,23,42,0.2)",
                cursor: gameState === "finished" ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Fira Sans', system-ui, sans-serif",
                fontSize: 52,
                fontWeight: 700,
                color: "#0f172a",
                transition: "transform 220ms ease, border 160ms ease",
              }}
            >
              {card.value}
            </button>
          );
        })}
        <div className="match-ten-fireworks-layer" aria-hidden="true">
          {fireworks.map((fw) => {
            const fireworkStyle: CSSProperties & {
              ["--match-ten-delay"]?: string;
              ["--match-ten-direction"]?: string;
              ["--match-ten-travel"]?: string;
              ["--match-ten-burst-size"]?: string;
              ["--match-ten-burst-shadow"]?: string;
            } = {
              left: `${fw.x}%`,
              color: `hsl(${fw.hue}deg 85% 68%)`,
            };
            fireworkStyle["--match-ten-delay"] = `${fw.delay}ms`;
            fireworkStyle["--match-ten-direction"] = fw.origin === "top" ? "-1" : "1";
            fireworkStyle["--match-ten-travel"] = fw.travelMultiplier.toFixed(2);
            fireworkStyle["--match-ten-burst-size"] = fw.burstSize.toFixed(2);
            fireworkStyle["--match-ten-burst-shadow"] = fw.burstShadow;
            if (fw.origin === "top") {
              fireworkStyle.top = "-28px";
            } else {
              fireworkStyle.bottom = "-28px";
            }
            return (
              <span
                key={fw.id}
                className="match-ten-firework"
                data-origin={fw.origin}
                data-pattern={fw.pattern}
                style={fireworkStyle}
              />
            );
          })}
        </div>
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

    <style>{`
      .match-ten-fireworks-layer {
        pointer-events: none;
        position: absolute;
        inset: 0;
        overflow: visible;
      }
      .match-ten-firework {
        --match-ten-direction: 1;
        --match-ten-travel: 1;
        --match-ten-burst-size: 1;
        position: absolute;
        width: 8px;
        height: 24px;
        margin-left: -4px;
        border-radius: 999px;
        background: currentColor;
        box-shadow: 0 0 18px currentColor;
        transform: translate(-50%, calc(32px * var(--match-ten-direction))) scale(0.6);
        opacity: 0;
        animation: match-ten-rocket ${FIREWORK_DURATION_MS}ms cubic-bezier(0.16, 0.7, 0.34, 0.99) forwards;
        animation-delay: var(--match-ten-delay, 0ms);
      }
      .match-ten-firework[data-origin="bottom"] {
        bottom: -28px;
      }
      .match-ten-firework[data-origin="top"] {
        --match-ten-direction: -1;
        top: -28px;
      }
      .match-ten-firework::before {
        content: "";
        position: absolute;
        left: 50%;
        width: 3px;
        height: 12px;
        background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.1));
        box-shadow: 0 0 12px rgba(255,255,255,0.7);
        opacity: 0;
        animation: match-ten-trail ${FIREWORK_DURATION_MS}ms linear forwards;
        animation-delay: var(--match-ten-delay, 0ms);
      }
      .match-ten-firework[data-origin="bottom"]::before {
        top: 100%;
        transform: translate(-50%, -4px);
      }
      .match-ten-firework[data-origin="top"]::before {
        bottom: 100%;
        transform: translate(-50%, 4px) rotate(180deg);
      }
      .match-ten-firework::after {
        content: "";
        position: absolute;
        left: 50%;
        width: calc(12px * var(--match-ten-burst-size, 1));
        height: calc(12px * var(--match-ten-burst-size, 1));
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0));
        box-shadow: var(--match-ten-burst-shadow, 0 0 16px currentColor);
        opacity: 0;
        animation: match-ten-burst ${FIREWORK_DURATION_MS}ms ease-out forwards;
        animation-delay: calc(var(--match-ten-delay, 0ms) + 700ms);
        filter: drop-shadow(0 0 18px currentColor);
      }
      .match-ten-firework[data-origin="bottom"]::after {
        top: -12px;
      }
      .match-ten-firework[data-origin="top"]::after {
        bottom: -12px;
      }
      .match-ten-firework[data-pattern="ring"]::after {
        mix-blend-mode: screen;
      }
      .match-ten-firework[data-pattern="spray"]::after {
        filter: drop-shadow(0 0 24px rgba(255,255,255,0.6));
      }
      @keyframes match-ten-rocket {
        0% { transform: translate(-50%, calc(40px * var(--match-ten-direction))) scale(0.5); opacity: 0; }
        18% { opacity: 1; }
        55% { transform: translate(-50%, calc(-320px * var(--match-ten-direction) * var(--match-ten-travel, 1))) scale(0.92); opacity: 1; }
        70% { opacity: 0.35; }
        100% { opacity: 0; }
      }
      @keyframes match-ten-trail {
        0% { height: 16px; opacity: 0; }
        20% { height: 40px; opacity: 1; }
        50% { height: 64px; opacity: 0.85; }
        80% { height: 18px; opacity: 0.35; }
        100% { height: 0; opacity: 0; }
      }
      @keyframes match-ten-burst {
        0% { opacity: 0; transform: translate(-50%, calc(-12px * var(--match-ten-direction))) scale(0.4); }
        20% { opacity: 1; transform: translate(-50%, calc(-18px * var(--match-ten-direction))) scale(1.4); }
        40% { transform: translate(-50%, calc(-24px * var(--match-ten-direction))) scale(2.2); }
        75% { opacity: 0.8; transform: translate(-20px, 90px) scale(0.6); }
        100% { opacity: 0; transform: translate(16px, 210px) scale(0.4); }
      }
    `}</style>
    </>
  );
}
