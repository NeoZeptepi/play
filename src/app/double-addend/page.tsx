"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Valid even targets must be double of an available addend (addends are 2..20 => targets 4..40 even)
const EVEN_TARGETS = Array.from({ length: ((40 - 4) / 2) + 1 }, (_, i) => 4 + i * 2); // 4,6,...,40
const ADDENDS = Array.from({ length: 19 }, (_, i) => i + 2); // 2..20
const BALLOON_COLORS = [
  '#FF6B6B', '#FFB347', '#FFD93D', '#6BCB77', '#4D96FF', '#C084FC', '#FF8FAB', '#8EC5FF'
];

interface BalloonData {
  id: number;
  value: number;
  x: number; // percentage
  y: number; // percentage
  driftPhase: number;
  color: string;
}

function randomBetween(min: number, max: number) { return Math.random() * (max - min) + min; }

function makeBalloons(target: number): BalloonData[] {
  // We use a simple rejection sampling to avoid overlapping balloons and the center target.
  // Coordinate system: percent (0..100). We'll approximate distance in this normalized space.
  const TARGET_CENTER = { x: 50, y: 50 };
  const TARGET_RADIUS_PCT = 18; // ~ target diameter (180px) relative to 520px height ≈ 34% -> radius ≈ 17%. Add a buffer.
  const BALLOON_RADIUS_PCT = 8.5; // 82px / 520px ≈ 15.8% -> radius ~7.9%, add margin.
  const MIN_DIST_BETWEEN = BALLOON_RADIUS_PCT * 2 + 1.5; // little gap between balloons
  const MIN_DIST_TARGET = TARGET_RADIUS_PCT + BALLOON_RADIUS_PCT + 4; // gap from target

  const placed: BalloonData[] = [];

  function isFree(x: number, y: number): boolean {
    // Keep inside safe bounding box
    if (x < 8 || x > 92 || y < 8 || y > 92) return false;
    const dxT = x - TARGET_CENTER.x;
    const dyT = y - TARGET_CENTER.y;
    const distT = Math.hypot(dxT, dyT);
    if (distT < MIN_DIST_TARGET) return false;
    for (const b of placed) {
      const dx = x - b.x;
      const dy = y - b.y;
      const d = Math.hypot(dx, dy);
      if (d < MIN_DIST_BETWEEN) return false;
    }
    return true;
  }

  ADDENDS.forEach((val, idx) => {
    let attempts = 0;
    let x = 0, y = 0;
    let found = false;
    while (attempts < 800 && !found) {
      // sample on annulus around center to distribute more evenly
      const angle = Math.random() * Math.PI * 2;
      const rMin = MIN_DIST_TARGET + 2;
      const rMax = 40; // keep within play field
      const r = rMin + Math.random() * (rMax - rMin);
      x = TARGET_CENTER.x + Math.cos(angle) * r;
      y = TARGET_CENTER.y + Math.sin(angle) * r;
      if (isFree(x, y)) {
        found = true;
        break;
      }
      attempts++;
    }
    // Fallback grid if not found
    if (!found) {
      outer: for (let ring = 0; ring < 5 && !found; ring++) {
        const count = 12;
        const rr = MIN_DIST_TARGET + 4 + ring * 6;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          x = TARGET_CENTER.x + Math.cos(a) * rr;
          y = TARGET_CENTER.y + Math.sin(a) * rr;
            if (isFree(x, y)) { found = true; break outer; }
        }
      }
    }
    if (!found) {
      // last resort random placement ignoring collision except target
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
      driftPhase: Math.random() * Math.PI * 2,
      color: BALLOON_COLORS[idx % BALLOON_COLORS.length],
    });
  });

  return placed;
}

export default function DoubleAddend() {
  const [target, setTarget] = useState(() => EVEN_TARGETS[Math.floor(Math.random() * EVEN_TARGETS.length)]);
  const correctAddend = target / 2;
  const [balloons, setBalloons] = useState(() => makeBalloons(target));
  const [status, setStatus] = useState<'idle'|'correct'|'wrong'>('idle');
  const baseMessage = 'Find the number that when doubled equals the sum.';
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
    setTarget(prev => {
      let next = prev;
      if (EVEN_TARGETS.length === 1) return next;
      while (next === prev) {
        next = EVEN_TARGETS[Math.floor(Math.random() * EVEN_TARGETS.length)];
      }
      return next;
    });
    setStatus('idle');
  setMessage(baseMessage);
    setPopped({ target: false, addendIds: new Set() });
    // balloons will be regenerated in effect when target updates
  }, []);

  // When target changes, regenerate balloon positions
  useEffect(() => {
    setBalloons(makeBalloons(target));
  }, [target]);

  function handleAddendClick(b: BalloonData) {
    if (status === 'correct') return;
    if (popped.addendIds.has(b.id)) return;
    if (b.value === correctAddend) {
      // correct
      const newSet = new Set(popped.addendIds);
      newSet.add(b.id);
      setPopped({ target: true, addendIds: newSet });
      setStatus('correct');
      setMessage(`Yes! ${b.value} + ${b.value} = ${target}.`);
      if (advanceTimeoutRef.current) window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = window.setTimeout(() => {
        reset();
      }, 1600);
    } else {
      setStatus('wrong');
      setMessage('Not that one — try again.');
      // brief fizzle then revert status
      if (wrongTimeoutRef.current) window.clearTimeout(wrongTimeoutRef.current);
      wrongTimeoutRef.current = window.setTimeout(() => {
        setStatus('idle');
    setMessage(baseMessage);
      }, 1800);
    }
  }

  // Confetti pieces when correct
  const confetti = useMemo(() => {
    if (status !== 'correct') return [] as Array<{ left: number; delay: number; color: string; duration: number }>;
    const colors = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#C084FC'];
    return Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.2 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random()*colors.length)]
    }));
  }, [status]);

  return (
  <main style={{ maxWidth: 1100, margin: '0 auto 2rem', paddingTop: '.25rem', fontFamily: 'system-ui, sans-serif', minHeight: '70vh', position: 'relative' }}>
      <h1 style={{ marginTop: 0 }}>Double Addend</h1>
      <p style={{ marginTop: 4, fontSize: 16 }}>{message}</p>
      <div style={{ margin: '1rem 0 1.25rem', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={reset} style={{ padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>New Target</button>
        <span style={{ fontSize: 14, color: '#555' }}>Auto-advance after correct answer.</span>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 520, border: '1px solid #eee', borderRadius: 12, background: 'linear-gradient(#fdfdfd,#f7f7f7)' }}>
        {/* Target Balloon */}
        <div
          className={`target-balloon ${popped.target ? 'pop' : ''}`}
          style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
            width: 180, height: 180, borderRadius: '50%', background: '#ff9d2e',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 48, fontWeight: 700, letterSpacing: 1,
            boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
            transition: 'transform 320ms ease, opacity 320ms ease'
          }}
          aria-label={`Target value ${target}`}
        >
          {target}
          <span style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>Target</span>
        </div>

        {/* Addend balloons */}
        {balloons.map(b => {
          const isPopped = popped.addendIds.has(b.id);
          const baseSize = 82;
          return (
            <button
              key={b.id}
              onClick={() => handleAddendClick(b)}
              disabled={isPopped || status==='correct'}
              className={`addend-balloon ${isPopped ? 'pop' : ''} ${status==='wrong' && !isPopped ? 'fizzle' : ''}`}
              aria-label={`Addend ${b.value}`}
              style={{
                position: 'absolute',
                left: `${b.x}%`,
                top: `${b.y}%`,
                transform: 'translate(-50%,-50%)',
                width: baseSize,
                height: baseSize,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.85), rgba(255,255,255,0) 60%), ${b.color}`,
                color: '#fff',
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isPopped ? 'default' : 'pointer',
                border: '2px solid rgba(255,255,255,0.55)',
                boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
                transition: 'transform 260ms ease, opacity 300ms ease',
                opacity: isPopped ? 0 : 1,
                animation: `floatY 6s ease-in-out ${b.driftPhase}s infinite`,
              }}
            >
              {b.value}
            </button>
          );
        })}

        {status === 'correct' && (
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }} aria-hidden>
            {confetti.map((c,i)=> (
              <div key={i} style={{ position:'absolute', top:'-5%', left:`${c.left}%`, width:10, height:14, background:c.color, borderRadius:3, opacity:.95, animation:`confettiFall ${c.duration}s linear ${c.delay}s forwards` }} />
            ))}
          </div>
        )}

        <style>{`
          @keyframes floatY { 0% { transform: translate(-50%,-50%) translateY(-12px);} 50% { transform: translate(-50%,-50%) translateY(14px);} 100% { transform: translate(-50%,-50%) translateY(-12px);} }
          @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(120vh) rotate(460deg); opacity:0; } }
          .addend-balloon:focus { outline: 3px solid #222; outline-offset: 3px; }
          .addend-balloon.pop { animation: popScale 380ms ease forwards; }
          .target-balloon.pop { animation: popScale 420ms ease forwards; }
          @keyframes popScale { 0% { transform: translate(-50%,-50%) scale(1); } 45% { transform: translate(-50%,-50%) scale(1.25); } 100% { transform: translate(-50%,-50%) scale(0); opacity:0; } }
          .addend-balloon.fizzle { animation: fizzle 1500ms ease forwards; }
          @keyframes fizzle { 0% { filter:brightness(1); opacity:1; } 70% { filter:brightness(.8); opacity:.4; } 100% { filter:brightness(.5); opacity:0; } }
          .addend-balloon::after { content:""; position:absolute; bottom:-26px; left:50%; transform:translateX(-50%); width:2px; height:30px; background:rgba(0,0,0,0.12); }
          .addend-balloon::before { content:""; position:absolute; bottom:-6px; left:50%; transform:translateX(-50%) rotate(10deg); width:12px; height:20px; background:linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0)); border-radius:50% 50% 55% 55%; opacity:.7; }
        `}</style>
      </div>

    </main>
  );
}
