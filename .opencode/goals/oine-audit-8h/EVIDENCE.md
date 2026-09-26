# Evidence: oine-audit-8h

## 1. Täisaudit: kood / disain / SEO / backend / sitemap

- commands: researcher subagent (9 Exa + SearXNG, 7 checkable items); explore subagent (full code audit); Playwright screenshots (6 pages + 404 + mobile); live curl table (10 URLs + headers)
- files: sessions ses_f252f7237ffezuFRoQmbyZBM0L, ses_f252f7233ffeLyO5OBgUzu2sYH
- result: researcher: INP/fetchpriority/AVIF/FAQ-rich-results/AI-crawlers/Estonian-NAP/font-budget items with URLs+dates. explore: P0x2 (focus outline killed, placeholder 1.2:1), P1x11 (fetch timeout, null-guards, stacked boxes, icon toggle, SR icons, live regions, 24px targets, muted contrast, no-JS blank, dual design systems, Escape focus), P2x12. Live baseline: all pages 200 (16-59KB, 0.3-0.6s TTFB), 404 correct, HSTS on, no CSP/X-Content-Type headers.

## 2. P0/P1 parandused + verifitseerimine

- commands: `node --check` ×4 JS files OK; `npm run test:seo` → "SEO check passed for 9 indexable pages."; `node tools/seo-loop.mjs` → "CLEAN — 0 failure(s), 0 warning(s)"; Playwright: focus ring visible, placeholder rgb(91,107,123) ≈5.4:1, 0 console errors, noscript hero opacity 1, webhook-abort → error shown + button re-enabled, honeypot → fake success + 0 network calls, threshold-90 run flags avif+jpg (scan proven)
- files: homepage.css (outline:none eemaldatud ×2, nav min-height taastatud, gradient fallback, surnud .orb/.glass-float/.reveal-stagger/.hero-reveal-0/.hero-word-13 eemaldatud); index.css (placeholder #5b6b7b, ~3.4KB surnud reegleid kustutatud: service-*, check-list, answer-box, mini-card, cta-glow, contact-*, form-*); homepage.js + index.js (15s AbortController, honeypot, trim/maxlength, null-guards, opposite-box reset, Escape-guard); index.html (honeypot väli, autocomplete/maxlength, aria-hidden ×37, role=status/alert, noscript, teal/indigo-700 eyebrowd, AVIF picture, dead lg:text-8xl eemaldatud); mudelid/index.html (AVIF picture); 404.html (+kasutusjuhud link); vercel.json (images cache); roi-calculator.js (clamps); seo-check.mjs (source+srcset); seo-loop.mjs (srcset, run-wide dedupe, source-weight scan)
- result: kõik P0/P1 + odavad P2 parandatud; teadlikult edasi lükatud: kahe disainisüsteemi ühendamine (regressioonirisk), sticky-TOC overflow (risk), resize-handler, PWA-ikoonide laiendus.

## 3. Review loop + unhappy path'id

- commands: reviewer round 1 (ses_f251d9821ffe3rFH1bjCGdblyM) → 2 P1 + P2-d, kõik parandatud; reviewer round 2 (ses_f2514379affegxIyz02Cp2hm5J) → ROUND 2 CLEAN, 0 P0/P1
- files: PLAN.md review log
- result: unhappy paths verified live in browser: noscript opacity 1; webhook abort → error + re-enabled button; honeypot → success + 0 calls; whitespace submit → error shown; threshold-90 → WARN lists avif+jpg once each; broken-title injection → FAIL exit 1 (varasemast).

## 4. Ööraport

- files: ÖÖRAPORT.md (samas kaustas)
- result: kirjutatud; hommikune kokkuvõte all.
