"use client";

import React, { useEffect, useRef, useState } from "react";

// Dice values 1..6; NEW goal: select 2, 3, or 4 dice whose total adds to 10.
// 6x6 grid (36 cells) like original variant.

interface DieCell {
  id: number;
  value: number; // 1-6
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeBoard(): DieCell[] {
  // Just fill with random 1..6 values for now (uniform). 36 dice.
  const values: number[] = [];
  for (let i = 0; i < 36; i++) {
    values.push(1 + Math.floor(Math.random() * 6));
  }
  return values.map((v, idx) => ({ id: idx, value: v, matched: false }));
}

// Stable 2D SVG dice (replacing experimental 3D)
function DiceSVG({ value }: { value: number }) {
  const pipSets: Record<number, Array<[number, number]>> = {
    1: [[24,24]],
    2: [[12,12],[36,36]],
    3: [[12,12],[24,24],[36,36]],
    4: [[12,12],[12,36],[36,12],[36,36]],
    5: [[12,12],[12,36],[24,24],[36,12],[36,36]],
    6: [[12,12],[12,24],[12,36],[36,12],[36,24],[36,36]],
  };
  return (
    <svg viewBox="0 0 48 48" width={48} height={48} aria-hidden style={{ display:'block' }}>
      <rect x={1.5} y={1.5} width={45} height={45} rx={10} ry={10} fill="#fff" stroke="#222" strokeWidth={2.5} />
      {pipSets[value].map((p,i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={4.2} fill="#111" />
      ))}
    </svg>
  );
}

export default function MakeTenDice() {
  const [cells, setCells] = useState<DieCell[]>(() => makeBoard());
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0); // number of successful sets found
  const [blocked, setBlocked] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // For entry animation state
  const [entered, setEntered] = useState(false);
  const [rolling, setRolling] = useState(false); // reroll animation state
  useEffect(() => { const id = window.setTimeout(() => setEntered(true), 30); return () => window.clearTimeout(id); }, []);

  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);

  function reset() {
    if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    setCells(makeBoard());
    setSelected([]);
    setMatches(0);
    setBlocked(false);
    setCelebrating(false);
    setEntered(false);
    setRolling(false);
    requestAnimationFrame(() => setEntered(true));
  }

  function rerollRemaining() {
    if (blocked) return;
    setBlocked(true);
    setSelected([]);
    setRolling(true);
    // Re-randomize only unmatched dice
    setCells(prev => prev.map(c => c.matched ? c : { ...c, value: 1 + Math.floor(Math.random() * 6) }));
    // Let animation play
    window.setTimeout(() => {
      setRolling(false);
      setBlocked(false);
    }, 650);
  }

  function handleClick(i: number) {
    if (blocked) return;
    const cell = cells[i];
    if (cell.matched) return;

    // Toggle off if already selected
    if (selected.includes(i)) {
      setSelected(s => s.filter(x => x !== i));
      return;
    }

    // Add selection (limit 4 at a time)
    if (selected.length < 4) {
      const newSel = [...selected, i];
      setSelected(newSel);
      const sum = newSel.reduce((acc, idx) => acc + cells[idx].value, 0);
      const count = newSel.length;

      if (sum === 10 && count >= 2 && count <= 4) {
        // Successful match set
        setBlocked(true);
        timeoutRef.current = window.setTimeout(() => {
          setCells(prev => prev.map(c => newSel.includes(c.id) ? { ...c, matched: true } : c));
          setSelected([]);
          setBlocked(false);
          setMatches(m => m + 1);
        }, 400);
      } else if (sum > 10 || (count === 4 && sum !== 10)) {
        // Bust -> clear after brief feedback delay
        setBlocked(true);
        timeoutRef.current = window.setTimeout(() => {
          setSelected([]);
          setBlocked(false);
        }, 650);
      }
    }
  }

  const diceRemaining = cells.filter(c => !c.matched).length;

  useEffect(() => {
    if (diceRemaining === 0 && cells.length) {
      setCelebrating(true);
      const id = window.setTimeout(() => setCelebrating(false), 5500);
      return () => window.clearTimeout(id);
    }
  }, [diceRemaining, cells]);

  return (
  <main style={{ maxWidth: 980, margin: '0 auto 1.75rem', paddingTop: '.25rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 12 }}>
          <h1 style={{ margin: 0 }}>Make 10 Dice</h1>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', fontSize: 14, flexWrap: 'wrap' }}>
            <div style={{ color: '#222', fontWeight: 600 }}>Sets: <span style={{ fontWeight: 700 }}>{matches}</span></div>
            <div style={{ color: '#222', fontWeight: 600 }}>Dice left: <span style={{ fontWeight: 700 }}>{diceRemaining}</span></div>
          </div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={rerollRemaining}
            disabled={blocked || diceRemaining === 0}
            style={{
              padding: '10px 16px',
              cursor: blocked || diceRemaining === 0 ? 'not-allowed' : 'pointer',
              background: blocked || diceRemaining === 0 ? '#ddd' : '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '.5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
              transition: 'background 160ms ease'
            }}
            aria-label="Roll all remaining unmatched dice"
          >
            Roll Remaining
          </button>
          <button
            onClick={reset}
            style={{
              padding: '10px 16px',
              cursor: 'pointer',
              background: '#555',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '.5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
              transition: 'background 160ms ease'
            }}
            aria-label="Reset the entire board"
          >
            Reset
          </button>
        </div>
      </div>
      <div style={{ marginBottom: 12, color: '#333', fontSize: 14 }}>Select 2, 3, or 4 dice to make the sum of <strong>ten</strong>. Use <em>Roll Remaining</em> anytime for fresh combinations. Correct sets roll out!</div>

  <div role="grid" aria-label="Make 10 Dice grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, maxWidth: 720, margin: '0 auto' }}>
        {cells.map((cell, idx) => {
          const isSelected = selected.includes(idx);
          const isMatched = cell.matched;
          const entering = !entered;
          const classes = [entering ? 'die-enter' : '', isMatched ? 'die-out' : '', isSelected ? 'die-selected' : '', (!isMatched && rolling) ? 'die-reroll' : ''].filter(Boolean).join(' ');
          const row = Math.floor(idx / 6);
          const col = idx % 6;
          const delayMs = row * 140 + col * 55; // wave timing
          return (
            <button
              key={cell.id}
              onClick={() => handleClick(idx)}
              aria-pressed={isSelected}
              disabled={isMatched || rolling}
              className={classes}
              style={{
                height: 72,
                borderRadius: 10,
                border: isSelected ? '2px solid #0070f3' : '1px solid #ccc',
                background: isMatched ? 'transparent' : '#fff',
                boxShadow: isMatched ? 'none' : '0 1px 3px rgba(0,0,0,0.18)',
                cursor: isMatched || rolling ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'border 160ms ease, background 160ms ease',
                padding: 0,
                ['--enter-delay' as any]: `${delayMs}ms`
              }}
              aria-label={`Die showing ${cell.value}${isMatched ? ' (matched)' : ''}`}
            >
              {!isMatched && <DiceSVG value={cell.value} />}
            </button>
          );
        })}
      </div>

      {celebrating && (
        <div role="dialog" aria-label="Celebration" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', zIndex: 9999 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.7))', backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'relative', zIndex: 10000, textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 42, lineHeight: 1 }}>🎲 Board Cleared! 🎲</div>
            <div style={{ marginTop: 8, fontSize: 18, color: '#333' }}>Great job forming sets that add to ten.</div>
            <div style={{ marginTop: 14 }}><button onClick={reset} style={{ padding: '10px 14px', fontSize: 16, cursor: 'pointer', borderRadius: 8 }}>Play again</button></div>
          </div>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {Array.from({ length: 34 }).map((_, i) => {
              const left = Math.random() * 100;
              const delay = Math.random() * 0.9;
              const duration = 2 + Math.random() * 2.2;
              const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C084FC'];
              const bg = colors[Math.floor(Math.random() * colors.length)];
              const rotate = Math.random() * 360;
              return (
                <div key={i} style={{ position: 'absolute', left: `${left}%`, top: '-10%', width: 10 + Math.random() * 10, height: 8 + Math.random() * 12, background: bg, transform: `rotate(${rotate}deg)`, borderRadius: 3, opacity: 0.95, animation: `dice-fall ${duration}s linear ${delay}s forwards` }} />
              );
            })}
          </div>
          <style>{`@keyframes dice-fall {0%{transform:translateY(-10vh) rotate(0deg);opacity:1;}70%{opacity:1;}100%{transform:translateY(110vh) rotate(360deg);opacity:0;}}`}</style>
          <div aria-live="polite" style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>Congratulations! You cleared the board by making sums of ten.</div>
        </div>
      )}
      <style>{`
  .die-enter { animation: rollIn 640ms cubic-bezier(.5,.9,.25,1.15) forwards; animation-delay: var(--enter-delay,0ms); opacity:0; }
  .die-selected { outline: 2px solid #0070f3; outline-offset: 2px; }
  .die-out { animation: rollOut 520ms cubic-bezier(.55,.1,.9,.55) forwards; }
  .die-reroll { animation: rollReroll 520ms cubic-bezier(.55,.1,.9,.55); }
  @keyframes rollIn { 0% { transform: translateY(-28px) rotate(-270deg) scale(.35); opacity:0;} 55% { transform: translateY(6px) rotate(380deg) scale(1.05); opacity:1;} 75% { transform: translateY(-4px) rotate(350deg) scale(.97);} 100% { transform: translateY(0) rotate(360deg) scale(1); opacity:1;} }
  @keyframes rollOut { 0% { transform: rotate(0deg) scale(1); opacity:1;} 35% { transform: rotate(250deg) scale(1.15); opacity:1;} 100% { transform: rotate(540deg) scale(.2); opacity:0;} }
  @keyframes rollReroll { 0% { transform: rotate(0deg) scale(1);} 40% { transform: rotate(420deg) scale(.7);} 70% { transform: rotate(600deg) scale(1.08);} 100% { transform: rotate(720deg) scale(1);} }
  @media (prefers-reduced-motion: reduce) { .die-enter, .die-reroll, .die-out { animation:none !important; opacity:1 !important; transform:none !important; } }
      `}</style>
    </main>
  );
}
