#!/usr/bin/env node
/* ============================================================================
   BEST VALUATION — static site builder
   ----------------------------------------------------------------------------
   Usage:  node build.js
   Output: plain .html files in this folder, ready to upload anywhere.
           No runtime dependency — the built site is pure HTML/CSS/JS.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const { site, services } = require('./src/data');
const { page } = require('./src/layout');
const P = require('./src/pages');

const ROOT = __dirname;

/* --- assemble every page -------------------------------------------------- */
const built = [
  P.home(),
  P.servicesIndex(),
  ...services.map(s => P.serviceDetail(s)),
  P.pricing(),
  P.about(),
  P.faqPage(),
  P.contact(),
  P.notFound()
];

let bytes = 0;
for (const p of built) {
  const html = page(p);
  fs.writeFileSync(path.join(ROOT, p.file), html, 'utf8');
  bytes += Buffer.byteLength(html);
  console.log(`  ✓ ${p.file.padEnd(26)} ${(Buffer.byteLength(html) / 1024).toFixed(1).padStart(6)} KB`);
}

/* --- sitemap -------------------------------------------------------------- */
const today = new Date().toISOString().slice(0, 10);
const priority = f => (f === 'index.html' ? '1.0' : f === '404.html' ? null : f.includes('valuation') || f.includes('report') ? '0.9' : '0.8');

const urls = built
  .filter(p => priority(p.file))
  .map(p => `  <url>
    <loc>${site.url}/${p.file === 'index.html' ? '' : p.file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority(p.file)}</priority>
  </url>`).join('\n');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, 'utf8');
console.log('  ✓ sitemap.xml');

/* --- robots --------------------------------------------------------------- */
fs.writeFileSync(path.join(ROOT, 'robots.txt'),
`User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${site.url}/sitemap.xml
`, 'utf8');
console.log('  ✓ robots.txt');

console.log(`\nBuilt ${built.length} pages · ${(bytes / 1024).toFixed(0)} KB total HTML\n`);
