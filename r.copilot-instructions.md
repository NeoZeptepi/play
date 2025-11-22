# Copilot Runbook Addendum

1. **Version bump is mandatory before any deployment.**
   - Run `npm run version:update`.
   - Commit the updated `version.json` as part of the change set.

2. **Always deploy via Cloudflare Pages after building.**
   - Run `npm run build` to confirm the project compiles.
   - Deploy with `npm run deploy:cf` and capture the resulting `pages.dev` URL.

3. **Verify the published serial.**
   - Load the deployed site (add `?v=1` to bypass cache) and ensure the footer serial matches the latest `version.json`.
   - If the serial lags, rerun the deploy until it matches.
