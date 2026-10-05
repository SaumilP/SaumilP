// scripts/check-cards.js
// Fails if README.md references a local asset that is missing or is not a valid SVG.
// (Upstream gh-stats health is checked by scripts/generate-cards.js, which fails
// the weekly workflow if any card cannot be fetched.)

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const README_PATH = path.join(ROOT, 'README.md');
const LOCAL_ASSET = /(?:src|srcset)="(assets\/[^"\s]+)"/g;

function main() {
  const readme = fs.readFileSync(README_PATH, 'utf8');
  const refs = [...new Set([...readme.matchAll(LOCAL_ASSET)].map((m) => m[1]))];

  if (refs.length === 0) {
    console.error('No local assets referenced in README.md');
    process.exit(1);
  }

  let failures = 0;
  for (const ref of refs) {
    const file = path.join(ROOT, ref);
    let error = null;
    if (!fs.existsSync(file)) {
      error = 'file not found';
    } else if (ref.endsWith('.svg')) {
      const body = fs.readFileSync(file, 'utf8');
      if (!body.includes('<svg') || !body.includes('</svg>')) error = 'not a complete SVG';
    }
    if (error) failures++;
    console.log(`${error ? 'FAIL' : 'ok  '} ${ref}${error ? `  (${error})` : ''}`);
  }

  console.log(`\n${refs.length - failures}/${refs.length} assets healthy`);
  if (failures > 0) process.exit(1);
}

main();
