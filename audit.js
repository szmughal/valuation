#!/usr/bin/env node
/* Build-integrity audit: run `node audit.js` after a build. */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const problems = [];
const titles = new Map(), descs = new Map();

for (const f of files) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');

  /* Measure what a search engine sees, i.e. after entity decoding. */
  const decode = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                       .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&middot;/g, '·')
                       .replace(/&nbsp;/g, ' ');

  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');

  if (!title) problems.push(`${f}: missing <title>`);
  if (title.length > 70) problems.push(`${f}: title ${title.length} chars (>70, will truncate in SERPs)`);
  if (!desc) problems.push(`${f}: missing meta description`);
  if (desc && (desc.length < 70 || desc.length > 165)) problems.push(`${f}: meta description ${desc.length} chars (aim 70–165)`);
  if (titles.has(title)) problems.push(`${f}: duplicate title with ${titles.get(title)}`);
  titles.set(title, f);
  if (descs.has(desc)) problems.push(`${f}: duplicate description with ${descs.get(desc)}`);
  descs.set(desc, f);

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) problems.push(`${f}: ${h1s.length} <h1> elements (expected exactly 1)`);

  /* unresolved template leftovers */
  if (/undefined|\[object Object\]|NaN/.test(html)) problems.push(`${f}: contains "undefined"/"[object Object]"/"NaN"`);

  /* internal links resolve */
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  hrefs.filter(h => !/^(https?:|mailto:|tel:|#|\/\/)/.test(h)).forEach(h => {
    const clean = h.split('#')[0].split('?')[0];
    if (!clean) return;
    if (!fs.existsSync(path.join(ROOT, clean))) problems.push(`${f}: broken link → ${h}`);
  });

  /* JSON-LD parses */
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].forEach((m, i) => {
    try { JSON.parse(m[1]); } catch (e) { problems.push(`${f}: JSON-LD block ${i + 1} is invalid — ${e.message}`); }
  });

  /* images have alt */
  [...html.matchAll(/<img\b[^>]*>/g)].forEach(tag => {
    if (!/\balt=/.test(tag[0])) problems.push(`${f}: <img> without alt — ${tag[0].slice(0, 60)}`);
  });

  /* canonical + viewport */
  if (!/rel="canonical"/.test(html)) problems.push(`${f}: missing canonical`);
  if (!/name="viewport"/.test(html)) problems.push(`${f}: missing viewport meta`);
}

console.log(`Audited ${files.length} pages.`);
if (problems.length) {
  console.log(`\n${problems.length} issue(s):`);
  problems.forEach(p => console.log('  ✗ ' + p));
  process.exitCode = 1;
} else {
  console.log('\n✓ No issues found — titles and descriptions unique, links resolve, JSON-LD valid.');
}
