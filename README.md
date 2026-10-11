# Tehisabiline

Live: https://tehisabiline.ee/

Company website of Tehisabiline OÜ (Tallinn, Estonia): agent-driven cybersecurity audits and a private cyber-AI API for developers. Static HTML/CSS/JS, no backend.

AI-teemaline staatiline veebisait HTML-i, CSS-i ja JavaScriptiga. Projekt ei vaja backend'i ega rakenduse runtime-sõltuvusi.

## Arendus

Sõltuvusi pole (puhas HTML/CSS/JS). Pärast päise/jaluse (`tools/chrome.mjs`) või CSS/JS muutmist:

```bash
npm run build:assets   # laiendab jagatud päise/jaluse ja lisab varadele sisuräsi (?v=…)
```

SEO kontroll:

```bash
npm run test:seo
```

IndexNow teavitus pärast muudatusi (kõik või valitud URL-id):

```bash
npm run submit:indexnow
npm run submit:indexnow https://tehisabiline.ee/nis2/
```

Peamised failid:

- `index.html` — avaleht; `site.css`, `site.js` — ühine disainisüsteem ja skript (Host Grotesk + Hanken Grotesk + JetBrains Mono, iseseisvalt majutatud)
- `assets/js/hero-demo.js` — avalehe demo (pilve-AI keeldub, Tehisabiline vastab, leiud ilmuvad üks kord); ilma JS-ita on kõik kohe nähtav
- `assets/plates/ribbon.*` — sinine valguslint (PNG originaal + AVIF/WebP 900/1500 px); kasutavad hero, alamlehtede päis ja kontaktiriba
- `assets/icons.svg` — SVG ikoonide sprite (Lucide); `assets/css/pages/*.css` — lehespetsiifilised lisareeglid
- `tools/og-card.html` — `assets/brand/tehisabiline-og.png` allikas (renderda 1200×630 ja salvesta selle faili peale)
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/` — toote- ja disainiotsused arendajatele (ei lähe Vercelisse, vt `.vercelignore`)
- `tools/chrome.mjs` — ainus allikas jagatud päisele ja jalusele (`<!-- chrome:header -->` / `<!-- chrome:footer -->` markerid lehtedes)
- alamkataloogid — staatilised sisulehed
- `tools/seo-check.mjs` — indexeeritavate lehtede kontroll
- `vercel.json` — Vercel deploy seadistus

Kohalikuks eelvaateks võib kasutada näiteks `python3 -m http.server 4173` projekti juurkaustas.
