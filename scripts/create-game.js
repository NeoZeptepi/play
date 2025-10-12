#!/usr/bin/env node
/*
Scaffold a new game page and add a nav link.
Usage: npm run scaffold:game -- <slug> "Title Here"
*/
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const slug = args[0];
const title = args[1] || 'New Game';

if (!slug) {
  console.error('Usage: npm run scaffold:game -- <slug> "Title"');
  process.exit(1);
}

const appDir = path.join(__dirname, '..', 'src', 'app');
const pageDir = path.join(appDir, slug);
const pageFile = path.join(pageDir, 'page.tsx');

const pageContent = `"use client";
export default function Page(){
  return (
    <main style={{ maxWidth: 980, margin: '0 auto 1.75rem', paddingTop: '.25rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginTop: 0 }}>${title}</h1>
      <p>Describe the rules or objective here.</p>
    </main>
  );
}
`;

// ensure directory
fs.mkdirSync(pageDir, { recursive: true });
// write file only if not exists
if (fs.existsSync(pageFile)) {
  console.error(`File already exists: ${pageFile}`);
  process.exit(1);
}
fs.writeFileSync(pageFile, pageContent, 'utf8');

// Try to update layout.tsx nav
const layoutPath = path.join(appDir, 'layout.tsx');
try {
  let layout = fs.readFileSync(layoutPath, 'utf8');
  const marker = '</ul>';
  const linkLine = `              <li><a href="/${slug}">${title}</a></li>\n`;
  if (layout.includes(linkLine)) {
    // already added
  } else if (layout.includes(marker)) {
    layout = layout.replace(marker, `${linkLine}            ${marker}`);
    fs.writeFileSync(layoutPath, layout, 'utf8');
  }
  console.log(`Added nav link to layout.tsx for /${slug}`);
} catch (e) {
  console.warn('Could not update layout.tsx automatically. Please add the nav link manually.');
}

console.log(`Scaffolded src/app/${slug}/page.tsx`);
