# Tehisabiline backlink playbook

Status: prepared 2026-10-24, baseline measured 2026-10-28. No outreach has been sent. Sending is owner-gated.

Goal: 10–20 relevant referring domains in 90 days, with at least 5 links to commercial or resource pages. Quality, relevance and referral traffic matter more than a third-party authority score.

## Measured baseline (2026-10-28)

Sources that answered: Brave SERP, Sourcegraph, HN Algolia, GitHub API, Common Crawl index, Wayback CDX, F6S, RIK. No Moz/Bing/DataForSEO credentials exist on this host, so no authority metric and no referring-domain count from a link database is available — only what an index proves.

| Exists today | Proof | Value |
| --- | --- | --- |
| `github.com/AARenor/tehisabiline` → homepage field plus 4 URLs in the README | repo API `homepage`, README fetched | **nofollow**, self-published |
| `f6s.com/company/tehisabiline` with the anchor `tehisabiline.ee` | page fetched | profile citation |

Everything else is a negative result, and the negatives are the finding:

- `"tehisabiline.ee"` in Brave → "Too few matches were found"; `"Tehisabiline OÜ"` → only the site's own dependabot PRs. No unlinked mention exists to convert.
- HN Algolia `tehisabiline` → `nbHits: 0`. Sourcegraph keyword → `matchCount: 0`. Common Crawl `CC-MAIN-2026-43` and `-34` domain query → no captures.
- **Bing `site:tehisabiline.ee` returns nothing: the domain is not indexed by Bing at all**, so Bing/Copilot citations are structurally impossible until it is. IndexNow is submitted on every deploy for exactly this reason.
- `ariregister.rik.ee` holds the company record with no website link; `inforegister.ee` holds only the email.
- No ENISA, EU, Estonian public-body, university, conference or awesome-list citation found in any index that responded.

Consequence for the plan: this is a cold-start link problem with no mentions to reclaim. The winning move is an artefact that a maintainer accepts as reference material, not a pitch to a portal that does not link out.

## Start with the baseline

1. Export Search Console → Links: top linking sites, top linked pages and anchor text.
2. Search `"Tehisabiline"` and `"tehisabiline.ee"` for unlinked mentions.
3. Record existing citations (GitHub, F6S, business registry) separately from editorial links.
4. Do not disavow anything unless there is clear spam or a manual action.

## Asset → audience map

| Asset | Best audience | Why it is linkable |
| --- | --- | --- |
| `/nis2/kontrollnimekiri/` + PDF | accountants, lawyers, IT providers, compliance consultants, startup hubs | free practical checklist with evidence prompts |
| `/dora/` + register CSV | finance, insurance, legal and compliance teams | timely DORA register template and guide |
| `/pentestimine/naidisraport/` + PDF | CTOs, developers, accelerators, tech media | rare synthetic sample of a real report structure |
| `/e-its/` | auditors, public-sector suppliers, consultants | evergreen Estonian standard guidance |
| `/sonastik/` | journalists, students, educators | reference definitions in Estonian |
| `/artiklid/` | industry newsletters, associations, blogs | practical 30/60/90 plans and evidence |

Send people to the most specific asset, not the homepage. Internal links then carry authority to `/nis2/`, `/kuberaudit/` and `/pentestimine/`.

## Target list (30)

Priority A = direct audience fit; B = broader reach; C = entity/citation profile.

| # | Target | Type | Priority | Asset / angle |
| --- | --- | --- | --- | --- |
| 1 | [ITL CyberTech](https://itl.ee/cybertech) | industry cluster | A | NIS2 checklist for member resource page |
| 2 | [Startup Estonia](https://startupestonia.ee/) | startup ecosystem | A | NIS2/DORA starter resources for founders |
| 3 | [Tehnopol](https://tehnopol.ee/) | startup hub | A | practical checklist for portfolio companies |
| 4 | [Latitude59](https://latitude59.ee/) | tech event | B | speaker/resource listing and founder guide |
| 5 | [Garage48](https://garage48.org/) | startup community | B | security baseline for early-stage teams |
| 6 | [Finance Estonia](https://financeestonia.ee/) | finance association | A | DORA register template and guide |
| 7 | [Eesti Kindlustusseltside Liit](https://www.lkf.ee/) | insurance association | A | DORA and third-party risk resources |
| 8 | [Eesti Pangaliit](https://www.pangaliit.ee/) | banking association | A | DORA/TLPT explainer |
| 9 | [Eesti Advokatuur](https://www.advokatuur.ee/) | legal profession | A | NIS2 evidence checklist for clients |
| 10 | [Audiitorkogu](https://www.audiitorkogu.ee/) | auditors | A | NIS2 evidence and audit preparation |
| 11 | [Eesti Kaubandus-Tööstuskoda](https://www.koda.ee/) | business chamber | A | SME NIS2 applicability and checklist |
| 12 | [Eesti Tööandjate Keskliit](https://www.tooandjad.ee/) | employers | B | board duties and NIS2 governance |
| 13 | [Geenius](https://geenius.ee/) | tech media | A | expert comment / resource mention |
| 14 | ~~ITuudised~~ | IT media | — | **dead target:** 301s to `aritehnoloogia.ee`; measured 2026-10-28, its NIS2 article links 54 external URLs and every one is Äripäev-owned |
| 15 | [Äripäev](https://www.aripaev.ee/) | business media | A | NIS2 deadline / board brief |
| 16 | [Delfi](https://www.delfi.ee/) | general media | B | expert quote on incidents or regulation |
| 17 | [Postimees](https://www.postimees.ee/) | general media | B | expert quote on incidents or regulation |
| 18 | TalTech | university | D | **dropped:** its cyber MSc page has 16 external links, all `taltech.ee` or social — no reading lists exist to be added to |
| 19 | EBS | business school | D | dropped: no public external resource lists |
| 20 | Tallinna Ülikool | university | D | dropped: no public external resource lists |
| 21 | Tartu Ülikool | university | D | dropped: no public external resource lists |
| 22 | [F6S](https://www.f6s.com/company/tehisabiline) | startup profile | C | keep profile complete; current citation |
| 23 | [GitHub repository](https://github.com/AARenor/tehisabiline) | code/profile | C | README links to the relevant guides |
| 24 | [LinkedIn](https://www.linkedin.com/in/arlearonreidma/) | professional profile | C | founder profile and company page |
| 25 | [Crunchbase](https://www.crunchbase.com/) | company database | C | complete company profile |
| 26 | ~~EISA~~ | cyber community | — | **dead target:** `eisa.ee` 301s to `kindlustus.info/eisa/` (insurance brokers); MTÜ Eesti Infoturbe Assotsiatsioon (reg. 80441379) has no live site |
| 27 | [RIA](https://www.ria.ee/) | regulator | C | do not pitch for links; cite official guidance |
| 28 | [Finantsinspektsioon](https://www.fi.ee/) | regulator | C | do not pitch for links; cite official guidance |
| 29 | [Eesti Ettevõtluskõrgkool Mainor](https://www.eek.ee/) | education | C | guest lecture / reading list |
| 30 | [Eesti Disainikeskus](https://www.disainikeskus.ee/) | creative/business network | C | not a priority; only if a real collaboration exists |

Verified-receptive targets measured 2026-10-28 (replaces guesswork above):

| Target | Asset that earns it | Proof of receptivity |
| --- | --- | --- |
| `geeniusdigipro.delfi.ee/blogi/` | `/nis2/kontrollnimekiri/` + `nis2-auditi-toendite-mall.xlsx` | a published post there links three third-party Estonian cyber sites, including a competitor |
| `github.com/awesomeSBOM/awesome-sbom` (602★) | `/sbom/` + `cra-sbom-mall.csv` | has Tools and Community Repositories sections; a template is in scope |
| `github.com/cra-compliance-lab/awesome-cra-compliance` | `cra-sbom-mall.csv` | "PRs Welcome" badge and CONTRIBUTING.md; SBOM is the CRA weak spot |
| `github.com/cyber-albsecop/Awesome-NIS2` | `nis2-kontrollnimekiri.pdf` | README: "We welcome contributions from anyone"; exact topic |
| `github.com/bureado/awesome-software-supply-chain-security` (381★) | SBOM template | a compilation, not tools-only |
| `koda.ee/et/liikmed/liikmelt-liikmemele-pakkumised/` | NIS2 checklist for SME clients | page type confirmed live; **requires chamber membership — a business cost, not a link purchase** |
| `itl.ee/cybertech/` | `/pentestimine/naidisraport/` | member listing per service verified; **cluster membership fee** |
| `financeestonia.eu/member/<slug>` | `dora-register-of-information-template.csv` | member directory confirmed; finance-sector fit is the gate |
| `eisay.ee` | ISO 27001 / NIS2 evidence workbook | exact auditor audience; 15 KB site with no resource list, so one email, low odds |
| `startupestonia.ee/organisations-ecosystem/` | NIS2 starter for founders | page invites support organisations to showcase services; expect a mention, not a guaranteed link |

Media correction: Estonian tech media do not link out as a rule. Measured on `aritehnoloogia.ee`
(the redirect target of the old ITuudised) and on Telia's Digitark E-ITS article: zero external
editorial links. Treat an expert article as brand exposure, not as a link.

Artifact gap worth closing first: a field-level CSV mapping SBOM columns to the prEN 40000-1-3
requirement IDs (`PRE-7-RQ-01…07`, `PRE-8-RQ-02`) and to CycloneDX/SPDX equivalents. The
CRA awesome-list paraphrases those IDs and tells readers to consult their national standards
body; no public field mapping exists. That artefact converts three of the targets above from
"please list my template" into "here is the missing reference".

Notes:
- Regulators are sources, not outreach targets. Link to their guidance in content; do not ask them for a vendor link.
- Directory/profile links are often nofollow. Treat them as entity and referral signals, not as ranking links.
- Do not add targets that have no genuine audience overlap just to increase the count.

## Outreach templates

Personalize the first sentence with a real page or programme. Keep it under 150 words. One follow-up after 5–7 working days, then stop.

### 1. NIS2 checklist to a business adviser

Subject: Tasuta NIS2 kontrollnimekiri teie klientidele

Tere [nimi],

nägin, et [lehe/programmi nimi] käsitleb NIS2-te. Tehisabiline avaldas tasuta kontrollnimekirja, mis seob kümme meedet tõenditega, mida auditor küsib: https://tehisabiline.ee/nis2/kontrollnimekiri/

Kui see sobib teie lugejatele või klientidele, võite sellele viidata. Ma ei küsi vastulinki ega tasu. Soovi korral saadan ka lühikese taustamemo või PDF-i.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

### 2. DORA register template to a finance/compliance audience

Subject: DORA teaberegistri mall ja lühijuhend

Tere [nimi],

[organisatsioon] tegeleb finantssektori nõuete või koolitustega. Koostasime DORA teaberegistri CSV-malli ja juhendi, mis selgitab, kuidas registrit üles ehitada: https://tehisabiline.ee/dora/

Kui see on teie lugejatele kasulik, võite sellele viidata. Mall on tasuta ja ei nõua registreerimist. Saan vajadusel anda ka lühikese kommentaari DORA teaberegistri praktiliste küsimuste kohta.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

### 3. Sample pentest report to a technical audience

Subject: Pentesti raporti näidis arendajatele ja CTO-dele

Tere [nimi],

[organisatsioon] jagab arendajatele turvateadmisi. Avaldasime sünteetilise pentesti raporti näidise, mis näitab ulatust, metoodikat, tõendatud leide ja parandusplaani: https://tehisabiline.ee/pentestimine/naidisraport/

Kui see sobib teie ressursilehele või uudiskirja, võite sellele viidata. See ei ole kliendi raport ega sisalda päris andmeid.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

### 4. Unlinked mention

Subject: Tehisabilise mainimine ilma lingita

Tere [nimi],

aitäh, et mainisite Tehisabilist artiklis [pealkiri]. Märkasin, et nimi on tekstis, kuid linki saidile ei ole. Kui see sobib, oleks allikaviide siin: https://tehisabiline.ee/viitamine/

See aitab lugejal allika ja uuenduskuupäeva leida. Kui linki ei soovi lisada, mõistan.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

### 5. Expert comment for a journalist

Subject: Kommentaar: NIS2 / DORA tähtaeg ja praktiline mõju

Tere [nimi],

kirjutan seoses [teema/päevauudis]. Saan pakkuda lühikest ekspertkommentaari järgmistes punktides:
- mida NIS2/DORA nõue praktikas muudab;
- milliseid tõendeid ettevõttelt küsitakse;
- millised on levinud vead ja mida esimese 30 päevaga teha.

Taust: https://tehisabiline.ee/meist/ ja allikad: https://tehisabiline.ee/viitamine/. Kui sobib, saadan 3–4 lauset valmis kujul.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

## Qualification rules

- The page must be relevant to Estonian business, technology, finance, law, education or cybersecurity.
- Prefer editorial pages, resource lists, event pages and partner pages over generic directories.
- Check that the page is indexed and maintained; a dead or abandoned page is not a target.
- Do not pay for a link. If a placement is paid, it must use `rel="sponsored"` or `rel="nofollow"`.
- Do not offer a reciprocal link as the reason for the placement.
- Do not use exact-match commercial anchors in every request. Natural brand and URL links are fine.
- No mass mail, scraped contact lists, fake personalization or automated follow-ups.

## Tracking

Track in a simple sheet:

| Field | Example |
| --- | --- |
| Target | ITL CyberTech |
| Page URL | https://itl.ee/cybertech |
| Contact | name / role / public email |
| Asset | NIS2 checklist |
| First contact | 2026-10-27 |
| Follow-up | 2026-11-03 |
| Status | sent / replied / linked / declined |
| Link URL | exact URL if published |
| Rel | none / nofollow / sponsored |
| Referral traffic | sessions/month |

Review monthly. A link that sends no traffic can still be valuable, but it must be relevant and editorial.

## 90-day cadence

- Week 1: baseline, target list, citation page, pitch templates.
- Weeks 2–4: 10 personalized pitches; publish one expert article; one follow-up per target.
- Weeks 5–8: 10 more pitches for DORA and the sample report; one webinar or co-branded checklist.
- Weeks 9–12: unlinked mentions, partner/resource pages, measure referring domains and referral traffic.
- Stop after one follow-up. Do not repeatedly email the same target.
