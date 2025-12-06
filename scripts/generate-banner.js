// scripts/generate-banner.js
// Simple banner generator using node-canvas

const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const width = 1200;
const height = 300;

// Optional: register a custom font (if you add one in ./fonts folder)
// registerFont(path.join(__dirname, 'fonts', 'FiraCode-Regular.ttf'), { family: 'Fira Code' });

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background - dark, subtle gradient-ish
ctx.fillStyle = '#1a1b26'; // Tokyo Night base
ctx.fillRect(0, 0, width, height);

// Accent rectangle (simple shape)
ctx.fillStyle = '#7aa2f7'; // Tokyo Night blue
ctx.fillRect(0, height - 40, width, 40);

// Title text
ctx.fillStyle = '#c0caf5';
ctx.font = 'bold 52px sans-serif';
ctx.textAlign = 'left';
ctx.textBaseline = 'middle';

const title = 'Saumil — Experienced professional';
ctx.fillText(title, 60, 120);

// Subtitle
ctx.fillStyle = '#a9b1d6';
ctx.font = '28px sans-serif';
const subtitle = 'Cloud • Backend • Web Dev';
ctx.fillText(subtitle, 60, 180);

// Small tagline bottom-right
ctx.font = '18px monospace';
ctx.fillStyle = '#9ece6a';
const tagline = 'Building tools that help engineers work smarter';
ctx.textAlign = 'right';
ctx.fillText(tagline, width - 40, height - 60);

// Save to file
const outputPath = path.join(__dirname, '..', 'assets', 'profile-banner.png');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const out = fs.createWriteStream(outputPath);
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('Banner generated:', outputPath));
