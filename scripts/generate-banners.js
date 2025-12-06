// scripts/generate-banners.js
// Generates light + dark profile banners using node-canvas

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 300;

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function saveCanvas(canvas, filePath) {
  ensureDir(path.dirname(filePath));
  const out = fs.createWriteStream(filePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('Generated:', filePath));
}

// Tokyo Night inspired
const darkTheme = {
  bg: '#1a1b26',
  accent: '#7aa2f7',
  accent2: '#9ece6a',
  title: '#c0caf5',
  subtitle: '#a9b1d6'
};

// Light theme variant
const lightTheme = {
  bg: '#f5f5f7',
  accent: '#2d63c8',
  accent2: '#1a7f37',
  title: '#111827',
  subtitle: '#4b5563'
};

function drawBanner(theme, variantLabel) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Accent strip
  ctx.fillStyle = theme.accent;
  ctx.fillRect(0, HEIGHT - 40, WIDTH, 40);

  // Title
  ctx.fillStyle = theme.title;
  ctx.font = 'bold 52px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Saumil — An experienced professional', 60, 115);

  // Subtitle
  ctx.fillStyle = theme.subtitle;
  ctx.font = '28px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Cloud · Backend · Web Dev', 60, 165);

  // Tagline bottom-right
  ctx.fillStyle = theme.accent2;
  ctx.font = '18px "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('Building tools/apps that help engineers work smarter', WIDTH - 60, HEIGHT - 70);

  // Variant label (tiny, bottom-left – optional)
  ctx.textAlign = 'left';
  ctx.font = '14px system-ui';
  ctx.fillStyle = theme.subtitle;
  ctx.fillText(variantLabel, 20, HEIGHT - 15);

  return canvas;
}

function main() {
  const darkCanvas = drawBanner(darkTheme, 'dark');
  const lightCanvas = drawBanner(lightTheme, 'light');

  const assetsDir = path.join(__dirname, '..', 'assets');
  saveCanvas(darkCanvas, path.join(assetsDir, 'profile-banner-dark.png'));
  saveCanvas(lightCanvas, path.join(assetsDir, 'profile-banner-light.png'));
}

main();
