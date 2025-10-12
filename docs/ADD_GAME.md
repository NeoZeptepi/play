Add a New Game Page
====================

Two paths: quick scaffold (recommended) or manual steps.

Option A — Quick Scaffold
-------------------------
1) Create the page and nav link:
   npm run scaffold:game -- <slug> "<Title>"

   Examples:
   - npm run scaffold:game -- number-bonds "Number Bonds"
   - npm run scaffold:game -- find-the-sum "Find the Sum"

2) Start dev and open the route:
   npm run dev
   http://localhost:3000/<slug>

3) Edit the generated file at src/app/<slug>/page.tsx
   - Replace placeholder content with your game UI.
   - Keep the h1 as the game title for consistency.

4) Assets (optional)
   - Put images, SVGs, sounds in public/<slug>/ and reference them with /<slug>/filename.ext

5) Deploy
   - Commit changes, push, and either let Cloudflare build from Git or run:
     npm run deploy:cf

Option B — Manual Steps
-----------------------
1) Create folder: src/app/<slug>/
2) Add src/app/<slug>/page.tsx with:
   "use client";
   export default function Page(){
     return (
       <main style={{ maxWidth: 980, margin: '0 auto 1.75rem', paddingTop: '.25rem', fontFamily: 'system-ui, sans-serif' }}>
         <h1 style={{ marginTop: 0 }}>Your Title</h1>
         <p>Instructions…</p>
       </main>
     );
   }
3) Add a nav link in src/app/layout.tsx under <ul className="nav-list">:
   <li><a href="/<slug>">Your Title</a></li>
4) Test locally (npm run dev) and then deploy (npm run deploy:cf).

Guidelines
----------
- Keep titles brief and kid-friendly.
- Ensure the first h1 is present (consistency and accessibility).
- Use inline styles or a local CSS module; avoid global CSS unless necessary.
- Aim for responsive layout; don’t assume wide screens.
- Prefer static assets in public/ to keep export fully static.

Troubleshooting
---------------
- Route 404 locally? Check the folder name and that page.tsx exists.
- Nav link missing? Confirm layout.tsx has the new <li> and you saved the file.
- Changes not live after deploy? Add ?v=1 to the URL or Purge Everything in Cloudflare Pages cache.
