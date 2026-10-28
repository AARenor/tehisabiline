# SEO checklist audit — 2026-10-28

Every item on the checklist was measured against the built site (`/tmp/tehisabiline/audit.mjs`
walks all 67 HTML files, strips chrome, and computes the numbers below), not asserted. Search
Console and the URL Inspection API supplied the indexation facts. "Already correct" means the
measurement proved it and nothing was changed.

| Item | Measured state before | Action taken | Measured state after |
| --- | --- | --- | --- |
| Indexing issues | URL Inspection on all 66 sitemap URLs: 58 `PASS — Submitted and indexed`, 8 `NEUTRAL — URL is unknown to Google` (the two 2026-10-28 pages plus the six new ones) | nothing to fix in code: unknown-to-Google is crawl latency for URLs deployed hours ago, and the six are not deployed yet. Indexation request via API is blocked (`webmasters.readonly`); IndexNow is submitted per deploy | unchanged; needs the deploy, then a sitemap refetch |
| Breadcrumbs | all pages had visible + `BreadcrumbList`, except `/mudelid/` (an older `nav.breadcrumbs` pattern with no `<ol>`) and `/` (correctly none) | `/mudelid/` converted to the site-standard `<ol class="breadcrumbs">`, so CI now compares it to its JSON-LD | 66 of 66 non-home pages have visible breadcrumbs matching `BreadcrumbList` |
| Canonical tags | present, self-referencing and trailing-slashed on all pages; enforced by `seo-check` | none | 66/66 |
| Core Web Vitals (lab) | not previously measured site-wide | Lighthouse on the three heaviest pages | `/en/tlpt/` 100/100/100/100, `/en/iso-27001/audit-checklist/` 100/100/100, `/api-turvatestimine/kontrollnimekiri/` 100/100/100/100; LCP 1.1–1.2 s, CLS 0, TBT 0 ms |
| Orphan pages | 2 pages with zero editorial inbound links: `/saidikaart/` (noindex by design) and `/404.html` | none needed | 0 indexable orphans; median inbound 8, max 63 |
| Schema markup | every page carries a JSON-LD `@graph`; `entitymap.json` validates node identity against the canonical Organization/Person | fixed one real defect: `/en/dora/register/` FAQ answer text drifted from its `acceptedAnswer.text`; FAQ parity is now in `test:seo` and in CI | FAQ parity 0 diffs across 67 pages |
| H1/H2 structure | 0 pages with ≠1 H1, 0 heading-level skips, 0 empty headings | none | unchanged |
| Original content | no page duplicated another: highest pairwise Jaccard was 0.26 (`/sektorid/energeetika/` vs `/sektorid/tervishoid/`), and the overlap is shared KüTS §8 incident-notification wording, not copied structure | two thin pages were rewritten with original, source-grounded material (below) | max Jaccard 0.26, unchanged and accepted |
| Links | no broken internal links; `lychee` across six pages: 589 links OK, 0 real failures | none | — |
| Clean URLs | descriptive slugs, trailing slash, no query strings in canonicals | none | — |
| JavaScript crawlability | all body content is server-rendered HTML; the one JS tool has a `<noscript>` fallback with the same eight questions | none | verified in Chromium with JS enabled and disabled |
| Keyword cannibalisation | 5 title-phrase pairs shared two or more bigrams | 4 are legitimate (et/en hreflang pairs and genuinely distinct intents); 1 pair is the sector-page pair above | 4 remaining, all intentional |
| Mobile friendliness | viewport meta on every page; stacking tables | verified at 390 px on the four new pages | no horizontal overflow, `scrollWidth == innerWidth` |
| E-E-A-T | named author on every Article with a link to `/meist/#autor`; no visible editorial method | `/meist/` gained *Toimetamise kord* (five checkable process rules) and *Mida saad ise kontrollida* (where each claim can be verified) | author page is verifiable rather than declarative; no credentials invented |
| Titles 50–60 chars | 21 titles under 50 (min 34), 0 over 60 | 20 rewritten to 50–58 chars with a concrete value hook, `og:title`/`twitter:title`/image alt kept consistent, all 66 OG cards re-rendered | 1 remaining: `/saidikaart/` at 37 (noindex, deliberately terse) |
| Unique meta descriptions | all unique; 7 outside the 120–158 band | 7 rewritten (135–154 chars) | 0 outside the band; 0 duplicates |
| Thin / overlapping pages | 8 pages under 700 words of main content | `/api-turvatestimine/kontrollnimekiri/` 414 → 1,709 words; `/dora/audit/` 646 → 1,420; `/meist/` 612 → 673 | 5 remain, all intentional: two hubs (`/artiklid/`, `/en/`), one noindex sitemap page, the privacy notice and the press kit |
| Image alt text | 135 × `logo.svg`, 12 × favicon and 1 × plate carry `alt=""`; the two content images carry real alt text | none — empty alt on a decorative logo, next to a text wordmark, is correct WCAG practice | unchanged, correct |
| Search intent | the six new English pages each answer one template/tool intent under a page whose H1 matches it | see `docs/seo/demand-2026-10-28-en-spokes.md` | — |
| High-volume, low-competition keywords | Google Autocomplete swept in `et` and `en`; Estonian commercial stems returned no suggestions at all | shipped the six English spokes against the dense clusters; rejected the demand-free Estonian topics | documented in the demand note |
| Internal links to important pages | 4 pages had 1–2 editorial inbound links | `/en/` hub, four cluster hubs and the footer template now link the new spokes; `/meist/` links the citation and regulation pages | 5 pages with 1–2 inbound remain, all noindex or single-spoke by design |
| Backlinks | measured 2026-10-28: only a nofollow GitHub repo link and the F6S profile; not in Common Crawl; **Bing has not indexed the domain at all** | corrected the playbook's dead targets (EISA redirects to an insurance site, ITuudised redirects to Äripäev-owned aritehnoloogia.ee) and replaced guesses with nine verified-receptive targets | `docs/seo/backlink-playbook.md` |

## Defects found and fixed beyond the checklist

1. `/en/dora/audit/` stated *"Article 6(5) requires the ICT risk management framework to be reviewed by internal audit"* in the lead, the FAQ and its JSON-LD. Regulation (EU) 2022/2554 Article 6(6) is the internal-audit duty; 6(5) is the documented annual review. Corrected in all three places. The same sentence existed on `/en/tlpt/` and was corrected there too.
2. `node tools/sync-faq.mjs --check` reported drift that `seo-check` cannot see (it only checks that the visible text *contains* the schema text). FAQ parity and date consistency are now part of `npm run test:seo` and of `.github/workflows/seo.yml`.
3. The English header nav spent two of its four links on Estonian pages on all 26 English URLs.

## Deliberately not done

- No indexation requests or sitemap resubmission: the Search Console credential on this host is `webmasters.readonly`. After the deploy, the sitemap is refetched on Google's schedule; IndexNow covers Bing/Yandex/Seznam immediately.
- No Estonian sector pages and no standalone Estonian applicability URL: no autocomplete demand exists for them (re-checked 2026-10-28).
- No outreach, no link purchases, no guest-post or directory submissions: owner-gated, and several "obvious" targets turned out to be dead or to never link out.
- `/saidikaart/` title left at 37 characters on purpose: it is `noindex, follow`, so SERP width does not apply.

## Correction: the NIS2 size test (2026-10-28)

The scope tool computed the size floor as `staff50 || money10`. A 30-person company with a EUR 15m turnover and a EUR 5m balance sheet was therefore told it was in scope, which is wrong under both readings of the test. Fixed in `assets/js/nis2-scope-en.js`, the tool's questions, its no-JS fallback table, the worksheet CSV and the Estonian decision diagram.

Primary sources:
- Estonia, KüTS § 3(2)(8) and § 3(4)(8): "…majandusaasta jooksul 50 või rohkem töötajat **ja** kelle aastabilansimaht **või** aastakäive ületab 10 miljonit eurot" — https://www.riigiteataja.ee/akt/106102026002
- KüTS § 3(3), essential entities: "250 või rohkem töötajat ja kelle aastabilansimaht ületab 43 miljonit eurot või aastakäive ületab 50 miljonit eurot".
- Recommendation 2003/361/EC, Annex Article 2(1)-(2) — https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32003H0361 — Article 2(2) is written "and/or", and recital (4) speaks of "the possibility of either of these two criteria being exceeded", so that reading leaves the small band at 50+ staff **or** when both financial figures exceed EUR 10m.

The two readings differ only on borderline figures, so the tool now asks turnover and balance sheet separately, decides on the statute (which RIA applies) and prints the divergence paragraph only when the answer would change. Verified in the browser on eight scenarios, including the counter-example above (now "Out of scope").
