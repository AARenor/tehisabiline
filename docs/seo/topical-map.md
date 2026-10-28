# Tehisabiline topical map — 2026-10-27

Status: canonical cluster map. Derived from `sitemap.xml` (58 URLs), `entitymap.json`
(10 clusters) and `docs/seo/keyword-map.md` (target terms). Keep in sync when a page is
added or retired; `tools/entitymap.mjs` fails the build if the page set and cluster map
disagree.

Method: every cluster owns one hub URL that receives the internal links, and spokes that
answer a single question. Target terms come from the keyword map (GSC + autocomplete
evidence, no paid volume tool). "Gap" means a spoke that the cluster needs and does not
have; it is not a promise to publish.

## 1. audit — Audit ja pentest (commercial core)

Hub: `/pentestimine/`. Inbound to hub: 200 main-content links.

| Spoke | Target term | Unique asset | Status |
| --- | --- | --- | --- |
| `/pentestimine/` | pentest, läbistustestimine | scope/price factors | live |
| `/pentestimine/naidisraport/` | pentesti raport | sample PDF | live, weakly linked (5) |
| `/kuberaudit/` | turvaaudit, IT turvaaudit | cited IBM/Verizon baseline; sole audit-vs-pentest explanation | live |
| `/api-turvatestimine/` | API pentest | — | live, no asset |
| `/api-turvatestimine/kontrollnimekiri/` | API pentesti checklist | OWASP API Top 10 evidence table | live (role split from the parent guide) |
| `/veebirakenduse-turvatestimine/` | veebirakenduse pentest | — | live, no asset |
| `/ai-turvatestimine/` | AI turvatestimine, prompt injection | — | live, no asset |

Gaps: audit-vs-pentest comparison stays a section on `/kuberaudit/` (no separate URL);
"pentesti hind" as its own page (currently a section); no checklist asset for web
application testing. Every audit spoke except the sample report lacks a unique asset.

## 2. nis2 — NIS2 / KüTS

Hub: `/nis2/`. Inbound: 249 (rewritten 2026-10-27 for "nis2 eesti").

| Spoke | Target term | Unique asset | Status |
| --- | --- | --- | --- |
| `/nis2/` | NIS2 Eestis, KüTS | applicability self-check + memo DOCX | live |
| `/nis2/kontrollnimekiri/` | NIS2 kontrollnimekiri | PDF + evidence CSV | live |
| `/nis2/registreerimine/` | NIS2 registreerimine RIA | deadline calculator | live, 6 inbound |
| `/nis2/trahvid/` | NIS2 trahvid | fine-ceiling calculator | live, 8 inbound |
| `/nis2/intsidendist-teatamine/` | NIS2 intsidendist teatamine | 24/72h deadline calculator | live |
| `/nis2/audit/` | NIS2 audit | evidence-table CSV | live |
| `/nis2/toetus/` | NIS2 toetus, EIS | EIS terms table, status checked 27.10.2026 | live (no calculator on the page) |

Gaps: no standalone applicability test URL (the four-question check lives inline on the
hub; `nis2europe.eu` ranks with a dedicated one); no spoke for NIS2 supplier contracts as
a service (covered only by an article); no standalone applicability test URL repeated in EN (the EN calculator set covers it).

## 3. dora — DORA ja finantssektori TLPT

Hub: `/dora/`. Inbound: 71.

| Spoke | Target term | Unique asset | Status |
| --- | --- | --- | --- |
| `/dora/` | DORA Eestis | register CSV | live |
| `/dora/teaberegister/` | DORA teaberegister | browser CSV checker + template | live |
| `/dora/audit/` | DORA audit | evidence CSV | live |
| `/tlpt/` | TLPT, TIBER-EE | — | live, no asset |

Gaps: no dedicated DORA contract-clause page (Art. 30 obligations are covered inside `/dora/`);
TLPT has no asset (checklist or preparation template).

## 4. frameworks — Standardid ja tootenõuded

Hub: `/regulatsioonid/` (regulations map + comparison CSV). Inbound: 67.

| Spoke | Target term | Unique asset | Status |
| --- | --- | --- | --- |
| `/regulatsioonid/` | küberturvalisuse regulatsioonid | comparison CSV (verified 27.10.2026) + deadline ICS | live |
| `/e-its/` | E-ITS audit | — | live, no asset |
| `/iso-27001/` | ISO 27001 audit | — | live, no asset |
| `/sbom/` | SBOM nõue | SBOM checker + CSV template | live |
| `/cra/` | CRA nõuded | scope self-check + reporting dates | live |
| `/ai-act/` | AI Act Eestis | risk-class self-check | live |

Gaps: E-ITS and ISO 27001 are the two highest-intent compliance pages without an asset.
They stay separate pages: RIA's current position does not claim ISO alignment, so a
mutual-recognition spoke would invent a relationship (corrected 2026-10-27).

## 5. sectors — Sektorivaated

Hub: `/sektorid/`. Inbound: 48, mostly the footer; the hub now carries the transport and post section itself.

Live: energeetika, tervishoid. `/sektorid/finants/` 301s to `/dora/` and `/sektorid/logistika/` to `/sektorid/` since 2026-10-27.

Gaps: KüTS/NIS2 Annex I–II sectors without a page: vesi, digitaristu, avalik haldus, post
ja kullerteenused, jäätmekäitlus, tootmine, toiduainete tootmine. Each is a low-volume but
high-intent query with an obvious compliance audience.

## 6. articles — Artiklid ja juhendid

Hub: `/artiklid/`. Inbound per article: 11–15.

Live: varunduse-taastetest, nis2-tarneahel, mfa-juurutamine, nis2-juhatus,
kuberriskide-register.

Gaps: no editorial page for DORA, CRA, AI Act, ISO 27001, E-ITS, TLPT or "how to read a
pentest report" — the clusters with the strongest commercial intent. Article inbound is
the weakest link in the internal graph; hub-to-article links are the cheapest fix.

## 7. en — English

Hub: `/en/`. 19 pages, 16 inbound for the hub.

| Spoke | Target term | Unique asset | Status |
| --- | --- | --- | --- |
| `/en/nis2/checklist/` | nis2 compliance checklist, nis2 requirements checklist | interactive ten-measure checklist (EN) | live 2026-10-28 |

Gaps: zero English editorial. The EN tree is guide-only, so it cannot rank for
English-language long-tail and cannot earn links the way `/artiklid/` can. English
autocomplete demand is real (`nis2 audit checklist`, `nis2 requirements for suppliers`,
`dora register of information template`), so English spokes are the higher-value
investment than the demand-free Estonian sector pages listed under 5.

## 8. trust, product, home

`/meist/`, `/viitamine/`, `/sonastik/`, `/kasutusjuhud/`, `/privaatsus/`, `/mudelid/`, `/`. (`/saidikaart/`
is `noindex, follow` since 2026-10-27: Google ranked the HTML sitemap for "nis2 eesti" instead of `/nis2/`.)
These carry entity and citation weight, not keyword targets. `/viitamine/`
is the citation hub for AI answer engines and press; keep it current with every new asset.

## How this map is used

1. New page → add to `entitymap.json` (`pages` + the cluster's `pages`) and to this table.
2. New article → link it from its cluster hub in the same commit; the article ring alone is
   not sufficient internal linking.
3. Cluster without an asset → the next content investment is an asset, not another article.
4. Gap rows are a backlog, not commitments. Do not publish a spoke to fill a table row.
