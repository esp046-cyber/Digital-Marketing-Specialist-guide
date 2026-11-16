/**
 * Automated Verification Suite for Digital Marketing Specialist Guide PWA
 * Run via: node tests/pwa-audit.test.js
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'service-worker.js',
  'offline.html',
  'favicon.ico',
  'icon-192.png',
  'icon-512.png',
  'README.md',
  '.gitignore',
  'package.json',
  '.env.example',
  'LICENSE',
  'robots.txt',
  'sitemap.xml',
  'browserconfig.xml',
  'assets/og-image.png',
  'api/tasks-catalog.json',
  'database/schema.json',
  'config/app.config.json'
];

for (const rel of requiredFiles) {
  const full = path.join(root, rel);
  assert.ok(fs.existsSync(full), `Missing required file: ${rel}`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.ok(html.includes('og:image'), 'index.html must include OpenGraph og:image meta tag');
assert.ok(html.includes('esp046-cyber.github.io/Digital-Marketing-Specialist-guide/'), 'index.html must reference target GitHub Pages URL');

console.log('ALL 21+ REQUIRED FILES AND PWA CHECKS PASSED SUCCESSFULLY.');
