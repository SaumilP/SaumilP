// scripts/generate-banners.js
// Generates light + dark profile banners as SVG (no native dependencies).
// GitHub renders SVG in <img>, so text stays crisp and the cursor can animate.

const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 320;

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

// Tokyo Night
const dark = {
  name: 'dark',
  bg0: '#1a1b26',
  bg1: '#16161e',
  glowA: '#7aa2f7',
  glowB: '#bb9af7',
  grid: '#7aa2f7',
  gridOpacity: 0.07,
  title: '#c0caf5',
  subtitle: '#a9b1d6',
  muted: '#7f88b5',
  accent: '#7aa2f7',
  accent2: '#9ece6a',
  chipBg: '#24283b',
  chipBorder: '#3b4261',
  chipText: '#c0caf5'
};

// GitHub light
const light = {
  name: 'light',
  bg0: '#ffffff',
  bg1: '#f1f4f9',
  glowA: '#2d63c8',
  glowB: '#8250df',
  grid: '#2d63c8',
  gridOpacity: 0.08,
  title: '#0f172a',
  subtitle: '#334155',
  muted: '#5b6676',
  accent: '#2d63c8',
  accent2: '#1a7f37',
  chipBg: '#ffffff',
  chipBorder: '#cfd7e3',
  chipText: '#1f2937'
};

const CHIPS = ['Architecture', 'Distributed Systems', 'DDD', 'Platform'];

function chips(t) {
  const h = 34;
  const gap = 12;
  const padX = 18;
  const charW = 9.2;
  let x = 0;
  return CHIPS.map((label) => {
    const w = Math.round(label.length * charW + padX * 2);
    const node = `<g transform="translate(${x} 0)">
      <rect width="${w}" height="${h}" rx="17" fill="${t.chipBg}" stroke="${t.chipBorder}"/>
      <text x="${w / 2}" y="22" text-anchor="middle" font-family="${MONO}" font-size="14" font-weight="600" fill="${t.chipText}">${label}</text>
    </g>`;
    x += w + gap;
    return node;
  }).join('\n');
}

function node(t, x, y, w, label) {
  return `<g>
      <rect x="${x}" y="${y}" width="${w}" height="44" rx="10" fill="${t.chipBg}" stroke="${t.chipBorder}"/>
      <text x="${x + w / 2}" y="${y + 27}" text-anchor="middle" font-family="${MONO}" font-size="14" font-weight="600" fill="${t.chipText}">${label}</text>
    </g>`;
}

// Gateway -> two services -> database. Dashes flow along the connectors.
function diagram(t) {
  const link = (d, delay) =>
    `<path d="${d}" fill="none" stroke="${t.accent}" stroke-opacity="0.8" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 8" class="flow" style="animation-delay:${delay}s"/>`;
  return `<g transform="translate(0 0)">
    ${link('M925 104 V127 H825 V150', 0)}
    ${link('M925 104 V127 H1025 V150', 0.3)}
    ${link('M825 194 V215 H900 V236', 0.6)}
    ${link('M1025 194 V215 H950 V236', 0.9)}
    ${node(t, 840, 60, 170, 'API Gateway')}
    ${node(t, 750, 150, 150, 'Orders')}
    ${node(t, 950, 150, 150, 'Billing')}
    ${node(t, 860, 236, 130, 'Postgres')}
  </g>`;
}

function banner(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="t d">
  <title id="t">Saumil — systems designer, hands-on</title>
  <desc id="d">Profile banner: Saumil, systems designer who stays hands-on. A small diagram shows a gateway, two services and a database.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg0}"/>
      <stop offset="1" stop-color="${t.bg1}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.12" cy="0.1" r="0.6">
      <stop offset="0" stop-color="${t.glowA}" stop-opacity="${t.name === 'dark' ? 0.28 : 0.16}"/>
      <stop offset="1" stop-color="${t.glowA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.95" cy="0.95" r="0.55">
      <stop offset="0" stop-color="${t.glowB}" stop-opacity="${t.name === 'dark' ? 0.24 : 0.14}"/>
      <stop offset="1" stop-color="${t.glowB}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.glowA}"/>
      <stop offset="1" stop-color="${t.glowB}"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="${t.grid}" stroke-opacity="${t.gridOpacity}" stroke-width="1"/>
    </pattern>
    <clipPath id="round"><rect width="${WIDTH}" height="${HEIGHT}" rx="16"/></clipPath>
  </defs>
  <style>
    .cursor { animation: blink 1.1s steps(1) infinite; }
    .flow { animation: flow 1.6s linear infinite; }
    @keyframes flow { to { stroke-dashoffset: -28; } }
    @keyframes blink { 50% { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .cursor, .flow { animation: none; } }
  </style>

  <g clip-path="url(#round)">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glowA)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glowB)"/>
    <rect y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="url(#bar)"/>

    <!-- prompt line -->
    <text x="72" y="82" font-family="${MONO}" font-size="18" fill="${t.muted}">
      <tspan fill="${t.accent2}">~/saumil</tspan> <tspan fill="${t.accent}">$</tspan> whoami
    </text>

    <!-- title -->
    <text x="72" y="162" font-family="${SANS}" font-size="76" font-weight="800" letter-spacing="-2" fill="${t.title}">Saumil</text>
    <rect class="cursor" x="318" y="108" width="10" height="64" rx="2" fill="${t.accent}"/>

    <!-- subtitle -->
    <text x="72" y="206" font-family="${SANS}" font-size="28" font-weight="500" fill="${t.subtitle}">Systems Designer · Hands-on</text>
    <text x="72" y="244" font-family="${MONO}" font-size="17" fill="${t.muted}">Designing systems that stay simple in production.</text>

    <!-- stack chips -->
    <g transform="translate(72 266)">${chips(t)}</g>

${diagram(t)}
  </g>
</svg>
`;
}

function main() {
  const assetsDir = path.join(__dirname, '..', 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });
  for (const t of [dark, light]) {
    const file = path.join(assetsDir, `profile-banner-${t.name}.svg`);
    fs.writeFileSync(file, banner(t), 'utf8');
    console.log('Generated:', file);
  }
}

main();
