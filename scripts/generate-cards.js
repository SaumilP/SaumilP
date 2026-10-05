// scripts/generate-cards.js
// Fetches gh-stats cards and re-publishes them as self-hosted, animated SVGs.
//
// GitHub strips CSS/JS from READMEs but plays CSS animations that live inside an
// <img> SVG. So each upstream card is inlined into a wrapper that adds:
//   - a staggered entrance (card rise + per-text fade)
//   - a slow light sweep and a travelling border glow (loops, so it is seen
//     even when the card is scrolled into view after load)
//   - column-by-column reveal of the contribution cells on the Impact Timeline
// All motion is disabled under prefers-reduced-motion.
//
// Output: assets/cards/<key>-<dark|light>.svg  (referenced from README.md)

const fs = require('fs');
const path = require('path');

const BASE = 'https://gh-stats-plum-five.vercel.app/api';
const USER = 'SaumilP';
const OUT_DIR = path.join(__dirname, '..', 'assets', 'cards');

const THEMES = {
  dark: { theme: 'tokyonight', accent: '#7aa2f7', accent2: '#bb9af7', sheen: '#ffffff', sheenOpacity: 0.07 },
  light: { theme: 'github', accent: '#2d63c8', accent2: '#8250df', sheen: '#2d63c8', sheenOpacity: 0.035 }
};

const PINS = [
  'design-patterns',
  'enterprise-spring-patterns-and-recipes',
  'spring-boot-starters',
  'drawio_libraries',
  'mastodon-toot-client',
  'gh-yule-gitlog-rs'
];

// `order` staggers cards on the same page so a grid cascades instead of landing at once.
const CARDS = [
  ...PINS.map((repo, i) => ({
    key: `pin-${repo}`,
    query: (t) => `pin?repo=${USER}/${repo}&theme=${t.theme}&hide_border=true`,
    order: i
  })),
  { key: 'stats', query: (t) => `stats?username=${USER}&theme=${t.theme}&hide_border=true`, order: 0 },
  { key: 'languages', query: (t) => `languages?username=${USER}&theme=${t.theme}&layout=compact&hide_border=true`, order: 1 },
  { key: 'impact', query: (t) => `impact?username=${USER}&theme=${t.theme}&hide_border=true`, order: 0, cells: true }
];

async function fetchSvg(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'card-generator-script' } });
      const type = res.headers.get('content-type') || '';
      const body = await res.text();
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
      if (!type.includes('image/svg') || !body.includes('<svg')) throw new Error(`not an SVG (${type})`);
      return body;
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 750 * attempt));
    }
  }
  throw lastError;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? m[1] : null;
}

function wrap(svg, card, t) {
  const open = svg.match(/<svg[^>]*>/)[0];
  const width = Math.round(parseFloat(attr(open, 'width')));
  const height = Math.round(parseFloat(attr(open, 'height')));
  const label = attr(open, 'aria-label') || card.key;
  const baseDelay = card.order * 160;

  let inner = svg.slice(svg.indexOf(open) + open.length, svg.lastIndexOf('</svg>'));
  inner = inner.replace(/<title>[\s\S]*?<\/title>/, '');

  // Stagger text: each <text> fades up a little after the previous one.
  let textIndex = 0;
  inner = inner.replace(/<text /g, () => {
    const delay = baseDelay + 250 + Math.min(textIndex++, 14) * 55;
    return `<text class="t" style="animation-delay:${delay}ms" `;
  });

  // Impact timeline: contribution cells pop in left to right. Cells are grouped by
  // column so ~50 elements animate instead of ~370 (hundreds of independent CSS
  // animations make the SVG very slow to load).
  if (card.cells) {
    const columns = new Map();
    inner = inner.replace(/<rect ([^>]*?)\/>/g, (match, attrs) => {
      if (/class=/.test(attrs)) return match;
      const w = parseFloat(attr(attrs, 'width'));
      const h = parseFloat(attr(attrs, 'height'));
      const x = parseFloat(attr(attrs, 'x'));
      if (!(w <= 14 && h <= 14) || Number.isNaN(x)) return match;
      if (!columns.has(x)) columns.set(x, []);
      columns.get(x).push(match);
      return '';
    });
    const groups = [...columns.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([x, rects]) => {
        const delay = baseDelay + 350 + Math.round(Math.max(0, x - 30) * 1.6);
        return `<g class="c" style="animation-delay:${delay}ms">${rects.join('')}</g>`;
      })
      .join('\n');
    inner += `\n${groups}`;
  }

  const perimeter = 2 * (width + height);
  const dash = 70;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">
  <title>${label}</title>
  <defs>
    <clipPath id="clip"><rect width="${width}" height="${height}" rx="14"/></clipPath>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.sheen}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="${t.sheen}" stop-opacity="${t.sheenOpacity}"/>
      <stop offset="1" stop-color="${t.sheen}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.accent}"/>
      <stop offset="1" stop-color="${t.accent2}"/>
    </linearGradient>
    <style>
      .card { animation: rise 600ms cubic-bezier(.2,.8,.2,1) ${baseDelay}ms both; }
      .t { animation: fade 500ms ease-out both; }
      .c { animation: colin 450ms cubic-bezier(.2,.8,.2,1) both; }
      .sweep { animation: sweep 7s ease-in-out ${baseDelay + 1500}ms infinite; }
      .trail { animation: trail 9s linear ${baseDelay}ms infinite; }
      @keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      @keyframes fade { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
      @keyframes colin { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      @keyframes sweep { 0% { transform: translateX(-${Math.round(width * 0.5)}px); } 35%, 100% { transform: translateX(${width}px); } }
      @keyframes trail { to { stroke-dashoffset: -${perimeter + dash}; } }
      @media (prefers-reduced-motion: reduce) {
        .card, .t, .c, .sweep, .trail { animation: none; }
        .trail { display: none; }
      }
    </style>
  </defs>
  <g class="card">
    <g clip-path="url(#clip)">
${inner}
      <rect class="sweep" x="0" y="0" width="${Math.round(width * 0.4)}" height="${height}" fill="url(#sheen)"/>
    </g>
    <rect class="trail" x="1" y="1" width="${width - 2}" height="${height - 2}" rx="13" fill="none" stroke="url(#glow)" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.85" stroke-dasharray="${dash} ${perimeter}"/>
  </g>
</svg>
`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const jobs = [];
  for (const card of CARDS) {
    for (const [mode, t] of Object.entries(THEMES)) {
      jobs.push({ card, mode, t, url: `${BASE}/${card.query(t)}` });
    }
  }

  const failures = [];
  await Promise.all(
    jobs.map(async ({ card, mode, t, url }) => {
      const file = path.join(OUT_DIR, `${card.key}-${mode}.svg`);
      try {
        fs.writeFileSync(file, wrap(await fetchSvg(url), card, t), 'utf8');
        console.log('ok  ', path.relative(process.cwd(), file));
      } catch (err) {
        failures.push(`${url} (${err.message})`);
        console.error('FAIL', url, err.message);
      }
    })
  );

  // Existing files are left in place for failures, so the profile keeps working.
  if (failures.length > 0) {
    console.error(`\n${failures.length}/${jobs.length} cards failed`);
    process.exit(1);
  }
  console.log(`\n${jobs.length}/${jobs.length} cards generated`);
}

main();
