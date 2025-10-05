Play: Math & Logic Mini‑Games
==============================

Purpose: A static-exported Next.js playground containing legacy and newly built educational math games.

Key Games
---------
* The Hiding Game (legacy iframe, preserved)
* Match Ten (pair numbers to sum 10)
* Match Ten Dice (2–4 dice, select dice that sum to 10)
* Double Addend (find the addend that doubles to target)

Quick Start
-----------
```bash
git clone https://github.com/NeoZeptepi/play.git
cd play
npm install
npm run dev
```
Open http://localhost:3000

Static Export & Deploy (Cloudflare Pages)
----------------------------------------
```bash
npm run export:static   # static build (produces out/ because output: export)
npm run deploy:cf       # deploy the out/ directory with Wrangler
```

Navigation lives in `src/app/layout.tsx`.

Docs
----
See `docs/MIGRATION.md` (full environment replication) and `docs/ONBOARDING.md` (teacher quick guide).

Branch / PR Flow
----------------
1. git checkout -b feature-name
2. Make changes
3. git add . && git commit -m "feat: thing"
4. git push origin feature-name
5. Open Pull Request → review → merge (Cloudflare auto-deploys)

Tech Stack
----------
* Next.js (App Router, static export) `next.config.ts` sets `output: "export"` and `trailingSlash: true`.
* React 19
* No server runtime — all static + client interactivity.
* Deployed via Cloudflare Pages (Wrangler manual deploy optional).

Scripts
-------
See `package.json` for all scripts. Added convenience commands for export & deploy.

License
-------
Private educational use.

