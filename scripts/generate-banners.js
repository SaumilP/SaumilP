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

// Static version of the flagship architecture diagram. GitHub's mobile app does
// not render Mermaid, so the README uses this SVG instead. It is drawn narrow and
// top-to-bottom so the text stays readable when scaled to a phone screen.
function referenceArchitecture(t) {
  const W = 640;
  const H = 584;
  const edge = (d, dashed = false) =>
    `<path d="${d}" fill="none" stroke="${dashed ? t.accent2 : t.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" ${
      dashed ? 'stroke-dasharray="6 7" class="flow"' : ''
    } marker-end="url(#${dashed ? 'arrow-t' : 'arrow'})"/>`;
  const box = (cx, cy, w, label) => {
    const x = cx - w / 2;
    const y = cy - 24;
    return `<g>
      <rect x="${x}" y="${y}" width="${w}" height="48" rx="12" fill="${t.chipBg}" stroke="${t.chipBorder}" stroke-width="1.5"/>
      <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-family="${MONO}" font-size="16" font-weight="700" fill="${t.chipText}">${label}</text>
    </g>`;
  };
  const marker = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M1 1 L9 5 L1 9 z" fill="${color}"/>
    </marker>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">Reference platform architecture</title>
  <desc id="d">A client calls an API gateway. The gateway routes to Orders and Inventory modules, which share a PostgreSQL database. Orders publishes events through an outbox to a message broker, which feeds Notifications. Modules emit traces and metrics to OpenTelemetry, which feeds dashboards.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.bg0}"/>
      <stop offset="1" stop-color="${t.bg1}"/>
    </linearGradient>
    ${marker('arrow', t.accent)}
    ${marker('arrow-t', t.accent2)}
  </defs>
  <style>
    .flow { animation: flow 1.6s linear infinite; }
    @keyframes flow { to { stroke-dashoffset: -26; } }
    @media (prefers-reduced-motion: reduce) { .flow { animation: none; } }
  </style>
  <rect width="${W}" height="${H}" rx="16" fill="url(#bg)" stroke="${t.chipBorder}"/>

  ${edge('M320 68 V100')}
  ${edge('M320 148 V176 H190 V200')}
  ${edge('M320 148 V176 H450 V200')}
  ${edge('M190 248 V324 H245')}
  ${edge('M450 248 V324 H395')}
  ${edge('M105 224 H70 V404')}
  <text x="62" y="330" text-anchor="end" font-family="${MONO}" font-size="13" fill="${t.muted}">outbox</text>
  ${edge('M110 452 V484')}
  ${edge('M535 224 H592 V428 H575', true)}
  ${edge('M500 452 V484', true)}
  <text x="20" y="566" font-family="${MONO}" font-size="13" fill="${t.muted}">Solid: requests and events. Green: telemetry.</text>

  ${box(320, 44, 120, 'Client')}
  ${box(320, 124, 170, 'API Gateway')}
  ${box(190, 224, 170, 'Orders module')}
  ${box(450, 224, 170, 'Inventory module')}
  ${box(320, 324, 150, 'PostgreSQL')}
  ${box(110, 428, 150, 'Message broker')}
  ${box(110, 508, 150, 'Notifications')}
  ${box(500, 428, 150, 'OpenTelemetry')}
  ${box(500, 508, 150, 'Dashboards')}
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
    const diagramFile = path.join(assetsDir, `reference-architecture-${t.name}.svg`);
    fs.writeFileSync(diagramFile, referenceArchitecture(t), 'utf8');
    console.log('Generated:', diagramFile);
  }
}

main();
