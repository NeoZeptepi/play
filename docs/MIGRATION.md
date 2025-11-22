Migration: Replicating the Math Games Environment on a MacBook
================================================================

Audience: Non-technical collaborator (teacher) who wants to create, adjust, and deploy games just like the primary developer does here.
Goal: Be able to edit games locally, preview changes, and push live to Cloudflare Pages.

---
Quick Path (Minimal Steps)
--------------------------
1. Sign in (or create accounts):
   - GitHub (shared or personal — see Security Options below)
   - Cloudflare (only if using a separate account)
2. Install the following (one-time):
   - Node.js LTS (https://nodejs.org) – just download the macOS installer and run it.
   - VS Code (https://code.visualstudio.com) – code editor.
3. Get project code:
   - Open Terminal.
   - Clone the repository (replace ACCOUNT if forked):
     git clone https://github.com/NeoZeptepi/play.git
   - cd play
4. Install dependencies:
     npm install
5. Start local site:
     npm run dev
   Open http://localhost:3000 in a browser.
6. Edit a file (example):
   - Open VS Code (code . from inside the folder, or File > Open...).
   - Change text in src/app/page.tsx — site auto-refreshes.
7. Deploy (two options):
   Before either option, bump the release stamp so the footer reflects the new build:
     npm run version:update
     git add version.json
   A. Git Push (recommended):
      git checkout -b change-text
      git add .
      git commit -m "feat: update intro text"
      git push origin change-text
      (Open GitHub → create Pull Request → merge → Cloudflare auto-updates.)
   B. Manual Direct Deploy (advanced / only if allowed):
      npm run export:static
      npm run deploy:cf

That’s it — you can now change and ship games.

---
Repository Structure (Key Parts)
--------------------------------
public/the-hiding-game/        Legacy iframe game (do not rename internal files)
src/app/                      Next.js App Router pages
  match-ten/                  Number pair game
  match-ten-dice/             Dice game (sum to 10)
  double-addend/              Balloon addend game
docs/                         Documentation lives here

---
Daily Workflow (Recommended)
----------------------------
1. Create a new branch for a change.
2. Edit files; save.
3. Preview at http://localhost:3000.
4. Commit and push branch.
5. Open Pull Request (PR) on GitHub → review → merge.
6. Wait ~30–60s; production site updates automatically (Cloudflare Pages build triggers on merge to main).

---
Adding a New Simple Page/Game (Basic Template)
---------------------------------------------
1. Create folder: src/app/new-game-name/
2. Add page.tsx:
   "use client";
   export default function Page() {
     return <div style={{padding:20}}>New game here</div>;
   }
3. Add link in src/app/layout.tsx navigation.
4. Visit http://localhost:3000/new-game-name/.

---
Deployment Methods Explained
----------------------------
GitHub → Cloudflare (Preferred):
 - Cloudflare Pages is already connected to the repository.
 - Each push to main triggers production deploy.
 - Each PR branch gets a Preview URL automatically.
 - Always run `npm run version:update` and commit `version.json` before pushing final changes so the live footer stamp increments.
 - After the Pages build finishes, open the deployed URL with ?v=1 and confirm the footer serial matches `version.json`. Redeploy if it doesn’t.

Manual CLI Deploy (Fallback):
 - Runs static build then uploads with Wrangler (deploy script now builds first automatically).
   - Same rule: run `npm run version:update` beforehand so `version.json` reflects the new build.
 - Command:
    npm run deploy:cf
 - What it does:
    1) next build (writes fresh static output to out/)
    2) wrangler pages deploy out --commit-dirty=true
 - Requires Wrangler auth already set up (once):
    npx wrangler login
 - Tip: If you don’t see changes, append a query param (e.g., ?v=1) or Purge Everything in Cloudflare Pages → Settings → Cache. Also verify the footer serial updates.

---
Security / Account Options
--------------------------
Option 1: Shared Accounts (Fastest, least secure)
 - Use the same GitHub and Cloudflare login.
 - Simple, but no individual audit trail.

Option 2: Separate GitHub, Shared Cloudflare
 - Add her GitHub as a collaborator on the repo.
 - She still deploys via PR merges.
 - Cloudflare audit still tied to original account.

Option 3: Fully Separate (Most Secure)
 - Separate GitHub org or fork.
 - Cloudflare: Add her as a member with Pages permission.
 - Optional: Enable branch protection on main requiring PR reviews.

Optional Enhancements:
 - Enable 2FA on all accounts.
 - Use different SSH keys per machine (ssh-keygen, add public key to GitHub). See GitHub docs.

---
Troubleshooting Quick Table
---------------------------
Site not loading locally → Did you run npm install? Try deleting node_modules and re-running.
Changes not showing → Browser caching? Hard refresh or ensure you edited the correct file.
Deploy not updating → Was commit merged into main? Check Cloudflare Pages dashboard build logs.
Permission denied pushing → Add SSH key or use HTTPS clone with correct credentials.

---
Minimal Command Cheat Sheet
---------------------------
git checkout -b feature
git add .
git commit -m "feat: something"
git push origin feature
Open PR → Merge

npm run version:update  # bump YY.MM.DD.xx before publishing
npm run dev           # local development
npm run export:static # optional: static build only (writes to out/)
npm run deploy:cf     # build + deploy to Cloudflare (preferred)

---
When to Ask for Help
--------------------
If something feels “stuck” longer than 10 minutes (build fails, page blank, deploy stalled) — stop and ask. Common fix: delete .next and out directories then re-run npm run dev.

---
Future Ideas (Optional)
-----------------------
 - Add docs/ONBOARDING.md with annotated screenshots.
 - Add scripts/create-game.js to scaffold a new game folder.
 - Centralize adjustable game settings into a JSON config.

Enjoy building!
