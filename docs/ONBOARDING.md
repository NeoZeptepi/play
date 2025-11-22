Onboarding Quick Guide (Teacher Edition)
========================================

Purpose: Fast reference for daily tasks. Keep this open the first few sessions.

Startup (First Time Only)
-------------------------
1. Install Node.js (LTS) from nodejs.org.
2. Install VS Code.
3. Clone repo (Terminal):
   git clone https://github.com/NeoZeptepi/play.git
   cd play
4. Install dependencies:
   npm install

Daily Start
-----------
1. Open Terminal → cd play
2. Start server:
   npm run dev
3. Open browser: http://localhost:3000

Make a Change
-------------
1. Create a branch:
   git checkout -b lesson-update
2. Edit a file in VS Code (example: change wording in src/app/match-ten/page.tsx).
3. Save. Browser refreshes.
4. Commit:
   git add .
   git commit -m "chore: wording tweak"
5. Push:
   git push origin lesson-update
6. In GitHub (web), open a Pull Request (PR). Click Create PR.
7. Wait for preview link (Cloudflare). Test it.
8. Before merging/publishing, bump the release stamp locally:
   npm run version:update
   git add version.json
   git commit -m "chore: bump version" (or add to your existing commit)
   Push the updated commit so the PR includes the new version.
9. Merge PR → site goes live shortly after.
10. Visit the deployed site (add ?v=1) and confirm the footer serial matches the new `version.json`. If not, rerun `npm run deploy:cf`.

Reusing a Branch
----------------
If not merged yet: keep committing and pushing. After merge: start a new branch for the next change.

Undo Last Change (Simple)
-------------------------
git checkout .    # throw away local unsaved edits
OR if committed:
git revert <commit-hash>

Add a New Simple Page
---------------------
1. Make folder: src/app/my-new-game/
2. Create page.tsx inside with:
   "use client";
   export default function Page(){ return <div>My New Game</div>; }
3. Add link in src/app/layout.tsx
4. Visit http://localhost:3000/my-new-game/

Common Issues
-------------
Port already in use → Close other dev servers or restart Terminal.
Build fails after pulling changes → Delete node_modules then npm install.
Stale preview → Hard refresh (Shift+Reload) or new PR.

Cheat Sheet
-----------
Branch + commit + push + PR + merge.

Ask for help if more than 10 minutes blocked.

You’ve got this.
