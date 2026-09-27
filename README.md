# Tehisabiline

Live: https://tehisabiline.ee/

Company website of Tehisabiline OÜ (Tallinn, Estonia): agent-driven cybersecurity audits and a private cyber-AI API for developers. Static HTML/CSS/JS, no backend.

AI-teemaline staatiline veebisait HTML-i, CSS-i ja JavaScriptiga. Projekt ei vaja backend'i ega rakenduse runtime-sõltuvusi.

## Arendus

Paigalda sõltuvused ja genereeri Tailwind CSS:

```bash
npm install
npm run build:css
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

- `index.html`, `index.js`, `index.css` — avaleht
- alamkataloogid — staatilised sisulehed
- `tailwind.config.js` — Tailwind konfiguratsioon
- `tools/seo-check.mjs` — indexeeritavate lehtede kontroll
- `vercel.json` — Vercel deploy seadistus

Kohalikuks eelvaateks võib kasutada näiteks `python3 -m http.server 4173` projekti juurkaustas.
