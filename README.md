# Best Valuation — Website

A 13-page marketing site for **Best Valuation**, an asset valuation practice in Karachi, Pakistan.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step needed to deploy — the
generated `.html` files are the website. Node is used only to keep the 13 pages consistent.

---

## Quick start

```bash
node serve.js
```

Then open <http://localhost:4321>.

To change content, edit `src/data.js` and rebuild:

```bash
node build.js
```

To check the build for SEO and link problems:

```bash
node audit.js
```

---

## ⚠ Before you go live

These are structural placeholders. **Review every one — they are not verified facts.**
All of them live in `src/data.js`, near the top, marked `TODO:`.

| What | Where | Why it matters |
|---|---|---|
| **Domain** | `site.url` | Currently `https://bestvaluation.com.pk`. Used for canonical tags and `sitemap.xml`. Wrong domain = wrong SEO signals. |
| **Registration bodies** | `credentials` | The site currently claims SECP Registered, PBA Approved Panel and ICAP Compliant Format. **Delete any you are not actually registered with**, and add your registration numbers in the `ref` field. |
| **Statistics** | `stats` | 12,500+ reports, 3,400+ visa reports, etc. are placeholders. Replace with your real figures or remove the section. |
| **Testimonials** | `testimonials` | Five illustrative reviews. Replace with real, permission-granted client feedback before launch. |
| **Office address** | `site.address.street` | Only "Karachi, Pakistan" is set. Add the street/building so the address and Google Business listing match. |
| **Social links** | `site.social` | Facebook, LinkedIn and Instagram point at `#`. Add real URLs or delete those entries. |
| **Prices** | `services[].price` | Starting fees (Rs. 5,000 / 6,000 / 8,000 / 12,000 / 15,000). Confirm they are current. |

Contact details are configured throughout: **0300-6878765** and
**the.experts.ho@gmail.com** / **imran.the.experts.pk@gmail.com**.

---

## The contact form

There is no server, so the form validates in the browser and then hands the completed
enquiry to the visitor's own email client or WhatsApp, pre-filled. It works out of the box.

**To send enquiries to a real inbox instead**, sign up with a form backend
(Formspree, Basin, Web3Forms — all have free tiers), then add one attribute in
`src/pages.js`, on the `<form id="quote-form">` tag:

```html
<form class="cform" id="quote-form" data-endpoint="https://formspree.io/f/YOUR_ID" novalidate>
```

Rebuild, and the form POSTs JSON there instead. The fallback path is left untouched.

---

## Project structure

```
├── index.html … 404.html      ← generated — do not edit by hand
├── sitemap.xml, robots.txt    ← generated
├── build.js                   ← generates the pages
├── audit.js                   ← checks titles, links, JSON-LD
├── serve.js                   ← local preview server
├── src/
│   ├── data.js                ← ALL CONTENT LIVES HERE
│   ├── pages.js               ← page layouts
│   ├── layout.js              ← header, footer, <head>, schema
│   └── icons.js               ← inline SVG icon set
└── assets/
    ├── css/style.css          ← design system
    ├── js/main.js             ← interactions
    └── img/favicon.svg
```

**Edit `src/`, never the root `.html` files** — they are overwritten on every build.

### Adding a service

Add an object to the `services` array in `src/data.js` and run `node build.js`.
The page, the nav dropdown, the footer, the pricing table, the sitemap and the
JSON-LD all pick it up automatically.

---

## Design system

| | |
|---|---|
| **Ink** | `#071523` → `#2C526F` — headers, dark sections, primary buttons |
| **Gold** | `#A87724` → `#F6EBD5` — accents, seals, emphasis |
| **Paper** | `#FFFFFF` / `#F8F6F1` warm sand — page and muted sections |
| **Headings** | Source Serif 4 — institutional, document-like |
| **Body** | Inter |

The direction is deliberately unlike the typical orange WordPress valuation site: navy and
gold read as legal-document and assayed-metal, which is what the product actually is. The
hero shows a CSS mock of the valuation certificate itself rather than stock photography —
the deliverable is the thing worth showing.

## Built in

- **SEO** — unique title and meta description per page (all within SERP limits), canonical
  tags, Open Graph, `sitemap.xml`, `robots.txt`, and JSON-LD for `ProfessionalService`,
  `Service` and `FAQPage`.
- **Accessibility** — skip link, landmarks, one `<h1>` per page, visible focus rings,
  labelled form fields with inline errors, `aria-expanded` on menus, `prefers-reduced-motion`
  honoured, AA contrast.
- **Resilience** — scroll animations only engage when JavaScript runs, so nothing is ever
  invisible if a script fails, plus a scroll failsafe for slow devices.
- **Responsive** — 320px to ultrawide, with a print stylesheet.

---

## Deploying

Upload the whole folder to any static host — Netlify, Vercel, Cloudflare Pages, GitHub
Pages, or ordinary cPanel hosting. There is nothing to install and no server to run.
`src/`, `build.js`, `audit.js` and `serve.js` are harmless if uploaded, or you can
exclude them and upload only the `.html` files, `assets/`, `sitemap.xml` and `robots.txt`.

After going live: point `site.url` at the real domain, rebuild, and submit `sitemap.xml`
in Google Search Console.
"# valuation" 
"# valuation" 
