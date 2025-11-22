# Copilot Instructions

## Session Checklist
- **Start every session by reading this file** to refresh the required workflow and constraints.
- Keep responses concise; highlight only deltas and the key files you touched.
- If asked to deploy, confirm build + deploy steps and always report the Cloudflare preview URL.

## Release & Verification Workflow
1. **Version bump is mandatory.**
   - Run `npm run version:update`.
   - Commit `version.json` with the new `YY.MM.DD.xx` serial before any publish.
2. **Build locally.**
   - Run `npm run build` (or the relevant test suite) to ensure the project compiles.
3. **Deploy via Cloudflare Pages.**
   - Use `npm run deploy:cf` (which rebuilds + runs Wrangler with `--commit-dirty=true`).
   - Capture the resulting `pages.dev` URL in your summary.
4. **Verify the live site.**
   - Open https://play.garrett.org (add `?v=1`) and confirm the footer serial/date matches the freshly updated `version.json`.
   - If the serial is stale, redeploy until it matches. All testing and QA should happen against the live site.

## Additional Preferences
- When integrating legacy content, prefer iframe isolation if CSS collisions are likely.
- Report only the commands you actually ran (no hypothetical commands).
- Document any manual cache-busting or validation performed after deployment.
