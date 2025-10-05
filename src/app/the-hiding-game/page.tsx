"use client";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import styles from './page.module.css';

export default function HidingGame() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [iframeHeight, setIframeHeight] = useState<string | undefined>(undefined);

  useEffect(() => {
    function updateHeight() {
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      const headerH = header ? (header as HTMLElement).offsetHeight : 0;
      const footerH = footer ? (footer as HTMLElement).offsetHeight : 0;
      const available = window.innerHeight - headerH - footerH - 32; // account for main padding
      if (available > 100) setIframeHeight(`${available}px`);
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  return (
    <>
      {/* The iframe hosts the legacy game; do not load its CSS/JS in the parent to avoid style/behavior bleed */}

      {/* Main game container — load original game in an iframe so it can rely on its original layout */}
      <div
        id="legacy-game"
        ref={containerRef}
        className={`container ${styles.container}`}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Use the game's native box size so legacy absolute positioning works as intended */}
        <div style={{ width: 800, height: 600, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <iframe
            title="The Hiding Game"
            src="/the-hiding-game/game.html"
            style={{ width: 800, height: 600, border: '0', display: 'block' }}
          />
        </div>
      </div>

      <div id="d_results">
        <div className="result_entry" style={{textDecoration: 'underline'}}>Results</div>
      </div>
      <div id="d_fx">LogoFX</div>
      <div id="d_copywrite">&copy; 2012 Patrick Garrett</div>
    </>
  );
}