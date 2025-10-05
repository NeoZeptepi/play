This folder contains the canonical, standalone copy of The Hiding Game used at runtime.

- game.html is a self-contained page that loads its own CSS/JS and assets.
- The Next.js SPA embeds this page in an iframe (see `src/app/the-hiding-game/page.tsx`) so the site header/left menu remain visible.

Notes for maintainers:
- Keep this folder as the single source of truth for runtime assets. Do not recreate or edit copies elsewhere.
- If you need to update the game, edit files here and verify the SPA route still loads correctly.
