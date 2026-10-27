# NIS2 competitive set — 2026-10-28

Goal under test: rank on page 1 of Google (Estonia) for the bare query **`nis2`**, and stay there for `nis2 eesti`.

## Our starting point (Search Console API, real data)

Property `sc-domain:tehisabiline.ee`, pulled 2026-10-28.

| Query | Window | Impressions | Position | Page |
| --- | --- | --- | --- | --- |
| `nis2` (bare) | 28 d | **0** | — | — |
| `nis2 eesti` | 28 d | 8 | 10–52 (last 17) | `/nis2/` |
| `nis2 eesti` | 7 d | 3 | 19 | `/nis2/` |
| `nis2 audit` | 7 d | 10 | 16.6 | `/en/nis2/audit/` (wrong language) |
| `nis2 nõuded` | 7 d | 2 | 16–38 | `/nis2/` |
| site total | 28 d | 80 | — | 2 clicks |

URL Inspection: `/nis2/` indexed, canonical correct, **last crawl 2026-10-24** — before the 27.10 rewrite. So no position number yet describes the current page.

Bare `nis2` producing zero impressions in 28 days means the page is outside the top ~100 for that token, not "just off page 1".

## What ranks (fetched and measured, 2026-10-28)

| Site | URL | Words | H2s | Internal links | Schema types | hreflang | NIS2 mentions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **tehisabiline** | `/nis2/` | **3 374** | 18 | 86 | 12+ (Article, FAQPage, WebPage, Breadcrumb, Service…) | et, en, x-default | 82 |
| nis2.ee | `/` | 682 | 7 | 3 | Organization, WebSite, SearchAction | none | 19 |
| nis2europe.eu | `/` | 303 | 4 | 32 | Organization, ContactPoint | none | 11 |
| digikontroll.ee | `/` | 2 407 | 10 | 84 | FAQPage, Offer, Organization | et, x-default | 16 |
| klarunova.ee | `/` | 3 851 | 23 | 94 | FAQPage, Offer, OfferCatalog | et, en, x-default | 24 |

Global `nis2` SERP (web_search, 2026-10-28): ncsc.gov.ie, ncsc.gov.ie PDF, nimblrsecurity.com, dts.de (PDF), ictlab.io, cisco.com, access.redhat.com, bitwarden.com, iso2700x.com. That is a regulator + enterprise-vendor wall.

Estonian-market competitors from the 27.10 audit: nis2.ee (exact-match domain), nis2europe.eu (vendor with public price list), eis.ee (state agency), legiscope.com, digikontroll.ee, eskom.ai, visioline.ee, klarunova.ee.

## Reading

1. **Content is not the deficit.** Our hub is 5× the words of nis2.ee and the deepest NIS2 page in the Estonian set, with primary-source citations and dated change log. nis2.ee ranks on an exact-match domain and crawl age, not depth.
2. **Authority is the deficit.** Zero editorial backlinks (off-site audit): the link graph is GitHub + F6S + own arle.top. RIA/eis.ee are `.gov`/state. Cisco/Red Hat/Bitwarden are global brands.
3. **Bare `nis2` in Estonia is unwinnable organically in the short term** — it mixes .gov, .eu official text, enterprise vendors and one exact-match domain. Realistic page-1 entries for us are the Estonian long tail (`nis2 eesti`, `nis2 nõuded`, `nis2 dokumentatsioon`, `nis2 audit`, `küberauditi hind`), not the 4-letter token.
4. **Recrawl is the first gate**, and it has not happened since the rewrite.

## Deltas applied on 28.10

- `/nis2/`: new `#mis-on-nis2` definition section ("Mis on NIS2?", directive (EL) 2022/2555, in force 16.01.2023, transposition deadline 17.10.2024, 18 sectors) + matching FAQ question in visible markup and JSON-LD. This is the intent the bare query carries and the one heading the page lacked.
- Visible/`dateModified`/sitemap date moved to 2026-10-28 via `tools/stamp-modified.mjs`.

## Levers that actually decide it

| Lever | Who | Effect |
| --- | --- | --- |
| Link acquisition (ITL CyberTech, RIA/EIS route, partner pages) | owner | the only organic path to page 1 for a head term |
| Google Ads on `nis2` / `nis2 eesti` | owner (budget) | immediate page-1 presence, no organic credit |
| Recrawl after the rewrite | happens by itself | must precede any position reading |

Measurement command:

```bash
cd ~/tmp/gsc && python3 gsc.py query --site sc-domain:tehisabiline.ee --days 7 --dims query,page --json
```
