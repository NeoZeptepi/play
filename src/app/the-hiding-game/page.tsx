"use client";
import React from "react";
import styles from './page.module.css';

export default function HidingGame() {
  return (
    <div className={styles.container} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div className="hiding-game-frame">
        <div className="hiding-game-inner">
          <iframe
            title="The Hiding Game"
            src="/the-hiding-game/game.html?v=20251005c"
            className="hiding-game-iframe"
          />
        </div>
      </div>
      <style>{`
        .hiding-game-frame { width:800px; height:600px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08); }
        .hiding-game-iframe { width:800px; height:600px; border:0; display:block; }
        /* If viewport narrower than iframe + minimal margins, allow scale down to fit */
        @media (max-width: 860px) {
          .hiding-game-frame { transform-origin: top left; }
          /* scale proportionally so width fits minus small padding */
          .hiding-game-frame { width:800px; height:600px; }
          .hiding-game-inner { position:relative; width:800px; height:600px; }
        }
        /* True scaling approach below 820px - compute scale factor via CSS clamp using vw */
        @media (max-width: 820px) {
          .hiding-game-frame { position:relative; }
          .hiding-game-inner { width:800px; height:600px; transform-origin: top left; }
          /* scale: (availableWidth / 800). Using calc with 100vw minus small padding */
          .hiding-game-inner { transform: scale(calc((100vw - 12px) / 800)); }
          /* Reserve space so layout doesn't collapse */
          .hiding-game-frame { height: calc(600px * ((100vw - 12px) / 800)); width: calc(800px * ((100vw - 12px) / 800)); }
        }
      `}</style>
    </div>
  );
}