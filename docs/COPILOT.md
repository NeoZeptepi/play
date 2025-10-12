Copilot Publishing Guide (Cloudflare Pages)
==========================================

Purpose: Make deployments reliable and visible when using Copilot to publish this site.

Key Rules
---------
1) Always build before deploying
- Use the single script: npm run deploy:cf
- What it does: runs next build (static export to out/) then wrangler pages deploy out

2) Verify the export before deploying (if changes seem missing)
- Check out/index.html for the expected change.
  - Example: grep -n "Welcome to the Garrett playground" out/index.html
  - Example: confirm the build stamp (data-build) appears in HTML.

3) Use cache-busting when validating
- Add a query param to the preview URL: ?v=1
- If production still shows old content, Purge Everything in Cloudflare Pages cache.

4) Prefer repo-connected deploys for production
- Push to main. Cloudflare Pages (repo integration) builds and deploys automatically.
- wrangler CLI is fine for previews or manual pushes.

5) If a deploy looks suspiciously fast
- It likely re-used previously uploaded files. Re-run npm run deploy:cf to force a fresh build+deploy.
- Optionally inspect wrangler output; low uploaded file counts often mean no change in out/.

Standard Steps Copilot Should Execute
------------------------------------
1) Stage and commit changes
   - git add <files>
   - git commit -m "<message>"
   - git push origin main (or branch)

2) Build + Deploy to Cloudflare Pages
   - npm run deploy:cf

3) Report back a preview URL
   - Wrangler prints a pages.dev URL; share it.

4) Validate live content
   - Open preview with ?v=1 and confirm:
     - Header/footer/layout tweaks visible
     - Home page heading without period
     - Footer build stamp appears after scroll to bottom (footer slides in) and on hover

5) If live site doesn’t update
   - Confirm out/index.html contains the expected changes
   - Re-run npm run deploy:cf
   - Use Cloudflare → Pages → Purge Cache, then reload with ?v=1

Reference Scripts
-----------------
- npm run export:static  # build only (writes to out/)
- npm run deploy:cf      # build + deploy (preferred)

Notes
-----
- next.config.ts uses `output: "export"`, so `next build` writes static assets suitable for Pages.
- We set `--commit-dirty=true` for wrangler so you can publish local changes without committing (for quick previews).
- For consistent production, prefer pushing to main and letting Cloudflare’s Git integration build.
