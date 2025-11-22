"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MAX_SUM = 20;
const EVEN_TARGETS = Array.from({ length: ((MAX_SUM - 4) / 2) + 1 }, (_, i) => 4 + i * 2); // 4..20 even
const ADDENDS = Array.from({ length: 9 }, (_, i) => i + 2); // 2..10 inclusive
const BALLOON_COLORS = [
  "#FF6B6B",
  "#FFB347",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#C084FC",
  "#FF8FAB",
  "#8EC5FF",
];

interface BalloonData {
  id: number;
  value: number;
  x: number;
  y: number;
  driftPhase: number;
  color: string;
}

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

function makeBalloons(target: number): BalloonData[] {
  const TARGET_CENTER = { x: 50, y: 50 };
  const TARGET_RADIUS_PCT = 18;
  const BALLOON_RADIUS_PCT = 8.5;
  const MIN_DIST_BETWEEN = BALLOON_RADIUS_PCT * 2 + 1.5;
  const MIN_DIST_TARGET = TARGET_RADIUS_PCT + BALLOON_RADIUS_PCT + 4;

  const placed: BalloonData[] = [];

  function isFree(x: number, y: number) {
    if (x < 8 || x > 92 || y < 8 || y > 92) return false;
    const dxT = x - TARGET_CENTER.x;
    const dyT = y - TARGET_CENTER.y;
    const distT = Math.hypot(dxT, dyT);
    if (distT < MIN_DIST_TARGET) return false;
    for (const b of placed) {
      const dx = x - b.x;
      const dy = y - b.y;
      if (Math.hypot(dx, dy) < MIN_DIST_BETWEEN) return false;
    }
    return true;
  }

  ADDENDS.forEach((val, idx) => {
    let attempts = 0;
    let x = 0;
    let y = 0;
    let found = false;
    while (attempts < 800 && !found) {
      const angle = Math.random() * Math.PI * 2;
      const rMin = MIN_DIST_TARGET + 2;
      const rMax = 42;
      const r = rMin + Math.random() * (rMax - rMin);
      x = TARGET_CENTER.x + Math.cos(angle) * r;
      y = TARGET_CENTER.y + Math.sin(angle) * r;
      if (isFree(x, y)) {
        found = true;
        break;
      }
      attempts++;
    }
    if (!found) {
      outer: for (let ring = 0; ring < 5 && !found; ring++) {
        const count = 12;
        const rr = MIN_DIST_TARGET + 4 + ring * 6;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          x = TARGET_CENTER.x + Math.cos(a) * rr;
          y = TARGET_CENTER.y + Math.sin(a) * rr;
          if (isFree(x, y)) {
            found = true;
            break outer;
          }
        }
      }
    }
    if (!found) {
      for (let j = 0; j < 400 && !found; j++) {
        x = 10 + Math.random() * 80;
        y = 10 + Math.random() * 80;
        if (isFree(x, y)) found = true;
      }
    }
    placed.push({
      id: idx,
      value: val,
      x: Math.min(92, Math.max(8, x)),
      y: Math.min(92, Math.max(8, y)),
      driftPhase: randomBetween(0, Math.PI * 2),
      color: BALLOON_COLORS[idx % BALLOON_COLORS.length],
    });
  });

  return placed;
}

export default function DoubleAddendSum20() {
  const [target, setTarget] = useState(() => EVEN_TARGETS[Math.floor(Math.random() * EVEN_TARGETS.length)]);
  const correctAddend = target / 2;
  const [balloons, setBalloons] = useState(() => makeBalloons(target));
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const baseMessage = "Find the number that when doubled equals the sum.";
  const [message, setMessage] = useState(baseMessage);
  const [popped, setPopped] = useState<{ target: boolean; addendIds: Set<number> }>({ target: false, addendIds: new Set() });
  const wrongTimeoutRef = useRef<number | null>(null);
  const advanceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (wrongTimeoutRef.current) window.clearTimeout(wrongTimeoutRef.current);
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    setTarget((prev) => {
      let next = prev;
      if (EVEN_TARGETS.length === 1) return next;
      while (next === prev) {
        next = EVEN_TARGETS[Math.floor(Math.random() * EVEN_TARGETS.length)];
      }
      return next;
    });
    setStatus("idle");
  setMessage(baseMessage);
    setPopped({ target: false, addendIds: new Set() });
  }, []);

  useEffect(() => {
    setBalloons(makeBalloons(target));
  }, [target]);

  const handleAddendClick = (balloon: BalloonData) => {
    if (status === "correct" || popped.addendIds.has(balloon.id)) return;
    if (balloon.value === correctAddend) {
      const addendIds = new Set(popped.addendIds);
      addendIds.add(balloon.id);
      setPopped({ target: true, addendIds });
      setStatus("correct");
      setMessage(`Yes! ${balloon.value} + ${balloon.value} = ${target} (≤ ${MAX_SUM}).`);
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = window.setTimeout(reset, 1600);
    } else {
      setStatus("wrong");
      setMessage("Nope — stay under 20 and try again.");
      if (wrongTimeoutRef.current) window.clearTimeout(wrongTimeoutRef.current);
      wrongTimeoutRef.current = window.setTimeout(() => {
        setStatus("idle");
  setMessage(baseMessage);
      }, 1800);
    }
  };

  const confetti = useMemo(() => {
    if (status !== "correct") return [] as Array<{ left: number; delay: number; color: string; duration: number }>;
    const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C084FC"];
    return Array.from({ length: 30 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2 + Math.random() * 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [status]);

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto 2rem",
        paddingTop: ".25rem",
        fontFamily: "system-ui, sans-serif",
        minHeight: "70vh",
        position: "relative",
      }}
    >
      <h1 style={{ marginTop: 0 }}>Double Addend – Sum 20</h1>
      <p style={{ marginTop: 4, fontSize: 16 }}>{message}</p>
      <div style={{ margin: "1rem 0 1.25rem", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={reset} style={{ padding: "8px 14px", borderRadius: 8, cursor: "pointer" }}>
          New Target
        </button>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: 520,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "linear-gradient(#fdfdfd,#f7f7f7)",
        }}
      >
        <div
          className={`target-balloon ${popped.target ? "pop" : ""}`}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "#f97316",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
            transition: "transform 320ms ease, opacity 320ms ease",
          }}
          aria-label={`Target value ${target}`}
        >
          {target}
        </div>

        {balloons.map((balloon) => {
          const isPopped = popped.addendIds.has(balloon.id);
          const baseSize = 82;
          return (
            <button
              key={balloon.id}
              onClick={() => handleAddendClick(balloon)}
              disabled={isPopped || status === "correct"}
              className={`addend-balloon ${isPopped ? "pop" : ""} ${status === "wrong" && !isPopped ? "fizzle" : ""}`}
              aria-label={`Addend ${balloon.value}`}
              style={{
                position: "absolute",
                left: `${balloon.x}%`,
                top: `${balloon.y}%`,
                transform: "translate(-50%,-50%)",
                width: baseSize,
                height: baseSize,
                borderRadius: "50%",
                background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%), ${balloon.color}`,
                color: "#fff",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: ".5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isPopped ? "default" : "pointer",
                border: "2px solid rgba(255,255,255,0.55)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
                transition: "transform 260ms ease, opacity 300ms ease",
                opacity: isPopped ? 0 : 1,
                animation: `floatY 6s ease-in-out ${balloon.driftPhase}s infinite`,
              }}
            >
              {balloon.value}
            </button>
          );
        })}

        {status === "correct" && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }} aria-hidden>
            {confetti.map((piece, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top: "-5%",
                  left: `${piece.left}%`,
                  width: 10,
                  height: 14,
                  background: piece.color,
                  borderRadius: 3,
                  opacity: 0.95,
                  animation: `confettiFall ${piece.duration}s linear ${piece.delay}s forwards`,
                }}
              />
            ))}
          </div>
        )}

        <style>{`
          @keyframes floatY {
            0% { transform: translate(-50%,-50%) translateY(-12px); }
            50% { transform: translate(-50%,-50%) translateY(14px); }
            100% { transform: translate(-50%,-50%) translateY(-12px); }
          }
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(120vh) rotate(460deg); opacity: 0; }
          }
          .addend-balloon:focus { outline: 3px solid #222; outline-offset: 3px; }
          .addend-balloon.pop { animation: popScale 380ms ease forwards; }
          .target-balloon.pop { animation: popScale 420ms ease forwards; }
          @keyframes popScale {
            0% { transform: translate(-50%,-50%) scale(1); }
            45% { transform: translate(-50%,-50%) scale(1.25); }
            100% { transform: translate(-50%,-50%) scale(0); opacity: 0; }
          }
          .addend-balloon.fizzle { animation: fizzle 1500ms ease forwards; }
          @keyframes fizzle {
            0% { filter: brightness(1); opacity: 1; }
            70% { filter: brightness(.8); opacity: .4; }
            100% { filter: brightness(.5); opacity: 0; }
          }
          .addend-balloon::after {
            content: "";
            position: absolute;
            bottom: -26px;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 30px;
            background: rgba(0,0,0,0.12);
          }
          .addend-balloon::before {
            content: "";
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%) rotate(10deg);
            width: 12px;
            height: 20px;
            background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0));
            border-radius: 50% 50% 55% 55%;
            opacity: .7;
          }
        `}</style>
      </div>
    </main>
  );
}
