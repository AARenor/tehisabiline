# English long-tail demand and the 2026-10-28 spokes

Method: Google Autocomplete (`suggestqueries.google.com/complete/search`, `client=firefox`) for
every candidate stem, run 2026-10-28. No paid volume tool, same approach as `keyword-map.md`.
A stem with no suggestion is demand-free at that phrasing and does not get a URL. The Estonian
pass was repeated too and came back empty again for every commercial stem, which is why this
batch is English-only.

## Evidence (dense = a suggestion list of 3 or more, all on the same intent)

| Cluster | Stems that returned suggestions | Decision |
| --- | --- | --- |
| NIS2 scope | `nis2 scope assessment tool`, `nis2 scope assessment`, `nis2 scope test tool`, `nis2 scope tool`, `nis2 directive scope`, `nis2 in scope entities` | new `/en/nis2/scope-assessment/` with a browser-only tool |
| NIS2 vs ISO 27001 | `nis2 vs iso 27001`, `nis2 vs iso 27001 mapping`, `nis2 directive vs iso 27001`, `nis2 compliance vs iso 27001` | new `/en/nis2/vs-iso-27001/` with a mapping CSV |
| ISO 27001 audit | `iso 27001 audit checklist` (+pdf/xls/questions/internal), `iso 27001 gap analysis` (+checklist/template/tool/report) | new `/en/iso-27001/audit-checklist/` with a 63-row CSV |
| Cyber audit | `cyber security audit checklist` (+pdf/xls), `it security audit checklist`, `network security audit checklist`, `security audit report template` (+word/sample/pdf) | new `/en/security-audit/checklist/` with checklist + report template |
| Pentest report | `penetration testing report template` (+word/pdf/example/sample/docx/github), `pen test scope document`, `penetration testing scope of work template` | new `/en/pentest-report/` with template + scope worksheet |
| TLPT | `tlpt tiber`, `tlpt vs tiber`, `dora tlpt tiber eu`, `threat led penetration testing`, `threat led penetration testing vs red teaming` | new `/en/tlpt/`, paired with `/tlpt/` |
| NIS2 self assessment | `nis2 self assessment tool`, `nis2 self assessment questionnaire` | **no new URL** — a second tool would cannibalise `/en/nis2/checklist/`; the phrase is served by a section there |
| NIS2 risk management | `nis2 risk assessment template`, `nis2 risk management measures`, `nis2 business continuity requirements`, `nis2 supply chain security requirements`, `nis2 article 21 requirements` | backlog (see below) |
| DORA audit | `dora audit checklist`, `dora audit plan`, `dora audit rights`, `dora auditor`, `dora third party register` | backlog: `/en/dora/audit/` exists, demand suggests a checklist URL and a third-party-register URL |
| CRA | `cra vulnerability reporting obligations`, `cra compliance checklist`, `cyber resilience act requirements list` | backlog: deepen `/en/cra/` + `/en/sbom/` |
| Estonian commercial stems | `nis2 nõuded` (1), `küberturvalisuse seadus` (6), `e-its` (9) | `küberturvalisuse seadus` and `e-its` are real but neither is a page gap: `/nis2/` and `/e-its/` serve them. No new ET URL shipped. |

Rejected on demand, not on taste: `nis2 audit report`, `nis2 audit cost`, `nis2 penalty fines`,
`nis2 applicable entity`, `iso 27001 certification estonia`, `cybersecurity audit estonia`,
`nis2 kohaldamine`, `nis2 sektorid`, `dora teaberegister`, `cra nõuded`, `iso 27001 nõuded`,
`haavatavuste skaneerimine`, `logi haldus`, `nist küberturvalisuse raamistik`, `cis kontrollid`
— all returned no suggestions on 2026-10-28.

Why template and tool intent first: every stem above ends in `checklist`, `template`,
`tool`, `worksheet`, `pdf` or `xls`. A page that only explains the topic loses to one that
hands over the artefact, and the artefact is what earns the link. Each new URL therefore
ships exactly one downloadable or interactive asset, declared in `docs/seo/info-gain.json`
and inventoried on `/viitamine/`.

## Shipped

| URL | Asset | Target stems |
| --- | --- | --- |
| `/en/nis2/scope-assessment/` | 8-question browser-only scope test + `nis2-scope-assessment-worksheet.csv` | scope assessment tool, scope test tool, in-scope entities |
| `/en/nis2/vs-iso-27001/` | `nis2-iso-27001-mapping.csv` (Article 21(2) a–j → Annex A) | nis2 vs iso 27001 mapping, compliance vs iso 27001 |
| `/en/iso-27001/audit-checklist/` | `iso-27001-audit-checklist.csv` (63 rows, four themes) | iso 27001 audit checklist, gap analysis |
| `/en/security-audit/checklist/` | `cybersecurity-audit-checklist.csv` (74 rows) + `security-audit-report-template.txt` | cyber security audit checklist, report template |
| `/en/pentest-report/` | `pentest-report-template.txt` + `pentest-scope-worksheet.csv` | penetration testing report template, scope template |
| `/en/tlpt/` | `tlpt-readiness-checklist.csv` | tlpt vs tiber, dora tlpt |

Wiring in the same commit: `entitymap.json`, `sitemap.xml`, `tools/seo-check.mjs`
`expectedPages`, `docs/seo/info-gain.json` (floor 28 → 36), `/viitamine/` rows,
`llms.txt`, `llms-full.txt`, the English footer template, the `/en/` hub and the four
cluster hubs, six per-page OG cards, and the `et`/`en`/`x-default` hreflang pair for TLPT.

Second fix in the same batch, found while checking the rendered pages: the English header
nav pointed `Audit / pentest` and `NIS2` at `/pentestimine/` and `/nis2/`, i.e. every one of
the 26 English pages spent two of its four nav links on Estonian pages. It now points at
`/en/pentesting/` and `/en/nis2/`.

## Verification run

```
node /tmp/tehisabiline/pagecheck.mjs <url>/index.html   # per-page contract mirror
node tools/render-og.mjs                               # 6 cards rendered
node tools/chrome.mjs                                  # header/footer/widget injection
node tools/version-assets.mjs
npm run test:seo                                       # 66 indexable + 1 noindex, pass
```

Browser checks on the six URLs at 1280 px and 390 px: one H1 each, chrome injected, EN nav
labels, 13–20 internal links in `<main>`, no horizontal overflow, fonts loaded. The scope
tool was driven through five answer sets and returned the five expected verdicts
(essential / important / out of scope on size / Article 2(2) override / public body).

## Next, in order

1. Deploy (blocked 2026-10-28: the Cloudflare Pages API token on this host is invalid and
   `wrangler whoami` reports "not authenticated"; the GitHub Pages action has failed since
   2026-10-24 on missing `CF_API_TOKEN`, so deploys are manual `tools/deploy.sh` runs).
2. Submit the six URLs with the IndexNow tool after the deploy.
3. Re-read GSC in 7 days against the one measurable question: do the six URLs collect
   impressions for template/tool phrasings, and does `/en/` hub depth move
   `nis2 audit` (pos ~15) at all.
4. Backlog by evidence: `nis2 risk management` cluster, `dora audit checklist` +
   third-party register, CRA depth, English editorial.
