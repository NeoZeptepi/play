This directory contains the Next.js App Router route for The Hiding Game.

- `page.tsx` is a client-side page that renders the site chrome (header, left menu, footer) and embeds the standalone game at `/the-hiding-game/game.html` inside an iframe.
- `page.module.css` contains small route-specific styles.

Why this layout:
- The original game is legacy code that expects an older global CSS and JS environment. To avoid style/behavior conflicts we keep a canonical copy of the game under `public/the-hiding-game` and embed it via an iframe so the SA P chrome is preserved without leaking styles into the game.

If you prefer to serve the game directly as a static page (no SPA chrome), you can remove the route files — but doing so will remove the header/menu from the game view.
