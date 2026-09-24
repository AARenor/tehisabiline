# Evidence: seo-tipptase-loop

## 1. SEO uurimus valmis: tehniline/sisu/off-page praktikad allikate ja kuupäevadega dokumenteeritud

- commands: researcher subagent (9 Exa web_search_exa queries + 1 SearXNG corroboration query)
- files: this EVIDENCE.md section; full ranked list in session ses_f2cf472beffeCMImgaKNvmyNXt
- result: 12 ranked tactics with URLs + dates. Top: Core Web Vitals; sitemap/robots hygiene; AI-Overviews-via-classic-SEO (https://developers.google.com/search/docs/fundamentals/ai-optimization-guide); unique ET titles/metas; internal linking; E-E-A-T; JSON-LD; Google Business Profile; reviews/local links; IndexNow (Bing-only); llms.txt = experimental per Google June 2026 ("neither helps nor hurts"); gap: no analytics/Search Console.

## 2. tehisabiline.ee auditeeritud: puuduste nimekiri mõõtmistega (PageSpeed/SEO-check/katkised kohad)

- commands: explore subagent; `npm run test:seo` → "SEO check passed for 9 indexable pages" (baseline)
- files: session ses_f2cf472bbffekVa06ChtCvPvsq
- result: 10 gaps with file:line + numbers: homepage meta desc 210 chars (index.html:7); money pages 4 inbound each; dead 510KB team photo + 43KB logo + 19KB JS; OG image 460KB; 10 empty logo alts; 3 render-blocking CSS + 4 font preloads; thin manifest/404; meist title without suffix. Baseline page weight: critical path 135KB raw / 27KB gzip; first-view ~286KB.

## 3. Top-parandused teostatud ja verifitseeritud (npm run test:seo läbib, live-kontrollid)

- commands: `npm run test:seo` → "SEO check passed for 9 indexable pages"; grep counts (alts 10 fixed, footers 5+1 files, money inbound 18/19); Playwright screenshots (hero, teenused, faq, contact, privaat-ai, kuberaudit, privaatsus, footers, mobile); `file` on images (OG 1200x630 196KB, tesla 1024x536)
- files: index.html (desc 210→~115 chars, OG card regen, footer canonical links, apple-touch 180); meist/index.html (title suffix); 5 legacy footers (+Privaat-AI/Küberaudit links); 404.html (money links); site.webmanifest (180/192/512 icons); assets/brand/apple-touch-icon.png + icon-192.png (new); assets/brand/tehisabiline-og.png (460→196KB, new focus text); tools/og-card.html (new copy); deleted assets/brand/reaalkooli-logo.png, assets/js/hero-gradient.js, assets/images/tehisabiline-tiim.jpg (all zero-ref verified); homepage.css (dead #hero-canvas removed); tools/seo-check.mjs (dup assertion removed)
- result: all gaps closed except render-blocking-CSS merge (accepted: 27KB gzip, low risk/benefit) and off-site items (GBP/reviews/backlinks/Search Console — documented as next steps). Reviewer verified: no dup titles/descs, canonical↔sitemap↔og:url consistent, all imgs alt+width+height, no orphans.

## 4. Pidev SEO-loop olemas ja ühe täistsükli läbinud (skript + EVIDENCE)

- commands: `node tools/seo-loop.mjs` → "SEO loop: CLEAN — 0 failure(s), 0 warning(s). Report: output/seo-loop/2026-09-24-111547.md EXIT:0"; `node tools/seo-loop.mjs --strict` → EXIT:0; unhappy path: injected broken <title> → "SEO loop: FAIL — 1 failure(s)" EXIT:1, restored → CLEAN EXIT:0
- files: tools/seo-loop.mjs (262 lines: hard gates + title/desc lengths + image weight/lazy + dead assets + link equity + freshness + .vercelignore deploy parity + dated md/json reports); output/seo-loop/2026-09-24-111547.{md,json}; monthly cron line in script header
- result: full cycle green; failure path proven. 3 review rounds: R1 found P0 (.vercelignore excluded live assets/images) + 3×P1 + P2s — all fixed; R2 found phantom-inbound +1 dup — fixed; R3 clean except 2 doc nits — fixed. STATE round=3.
