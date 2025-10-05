"use client";
import React from "react";
import styles from './page.module.css';

export default function HidingGame() {
  return (
    <div className={styles.container} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ width: 800, height: 600, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <iframe
          title="The Hiding Game"
          src="/the-hiding-game/game.html?v=20251005c"
          style={{ width: 800, height: 600, border: '0', display: 'block' }}
        />
      </div>
    </div>
  );
}