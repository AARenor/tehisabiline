# Outreach drafts — 2026-10-28

Prepared, **not sent**. Sending stays owner-gated (`AGENTS.md`): each message below goes out from Arle's own mailbox, one at a time, after a look at the live page it references.

Targets and their receptivity proof come from `backlink-playbook.md`; two URLs there had moved and are corrected here (verified 2026-10-28):

- `geeniusdigipro.delfi.ee/blogi/` → **404**; the live publication is `https://digipro.geenius.ee/blogi/` (200).
- `koda.ee/et/liikmed/liikmelt-liikmemele-pakkumised/` → **404**; live path is `https://www.koda.ee/et/liikmed/liikmelt-liikmele-pakkumised` (200).

Rules from the playbook that apply to every draft: under 150 words, one real first sentence about their page, no reciprocal-link offer, no exact-match commercial anchor in every request, one follow-up after 5–7 working days, then stop. Do not pay for placement; if a placement is paid it must carry `rel="sponsored"` or `rel="nofollow"`.

---

## 1. digipro.geenius.ee — blog post resource mention

Channel: email to the editorial contact on the blog. Asset: `/nis2/kontrollnimekiri/` + `nis2-auditi-toendite-mall.xlsx`.
Proof: a published post there already links three third-party Estonian cyber sites, one of them a competitor.

Subject: Tasuta NIS2 kontrollnimekiri teie lugejatele

Tere [nimi],

lugesin teie [artikli pealkiri] ja nägin, et viitate seal teistele Eesti küberturbeallikatele. Tehisabiline pani kokku tasuta NIS2 kontrollnimekirja, mis seob kümme art&nbsp;21 meedet tõenditega, mida audit päriselt küsib, ja tõendite Exceli-malli: https://tehisabiline.ee/nis2/kontrollnimekiri/

Kui see sobib teie lugejatele, võite sellele viidata. Ma ei küsi vastulinki ega tasu, sisu on tasuta ja ilma registreerimiseta.

Kui vaja, saadan ka kolm-neli lauset valmis kujul, mida saaks artiklisse lisada.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

---

## 2. github.com/cyber-albsecop/Awesome-NIS2 — pull request

Channel: PR against the README. Asset: `nis2-kontrollnimekiri.pdf` + `/nis2/kontrollnimekiri/`.
Proof: README says "We welcome contributions from anyone"; exact topic.

Title: Add a free Estonian NIS2 checklist (Article 21 measures mapped to evidence)

Body:

> Adds one entry under checklists: a free 10-measure NIS2 checklist that maps Article 21(2) to the evidence an auditor or supervisor asks for, with a downloadable PDF and an XLSX evidence file.
>
> - Page: https://tehisabiline.ee/nis2/kontrollnimekiri/
> - Language: Estonian (Estonia transposed NIS2 through the Cybersecurity Act, KüTS)
> - Licence: free, no registration, no email capture
>
> Reason for inclusion: the existing entries are English-language checklists; this is the Estonian-law variant, useful for entities registering with RIA.
> Maintainer is the author (Tehisabiline OÜ), so I will keep the entry current. Happy to adjust the placement or wording.

---

## 3. github.com/awesomeSBOM/awesome-sbom — pull request

Channel: PR. Asset: `cra-sbom-mall.csv` + `/sbom/`.
Proof: repo has Tools and Community Repositories sections, 602★.

Title: Add a CRA-oriented SBOM template (CSV) under Templates

Body:

> Adds an SBOM template aimed at the EU Cyber Resilience Act: the columns are the fields a manufacturer actually has to hand a customer or market-surveillance authority, plus a vulnerability-matching sheet.
>
> - Template: https://tehisabiline.ee/assets/downloads/cra-sbom-mall.csv
> - Explainer: https://tehisabiline.ee/sbom/
> - Format: plain CSV, no vendor lock-in; it imports into CycloneDX/SPDX tooling
>
> It is not a tool, so if Templates is the wrong section, tell me where it belongs and I will move it.

---

## 4. github.com/cra-compliance-lab/awesome-cra-compliance — pull request

Channel: PR. Asset: `cra-sbom-mall.csv`.
Proof: "PRs Welcome" badge and CONTRIBUTING.md; SBOM is the CRA weak spot.

Title: docs: add a CRA SBOM field template (CSV)

Body:

> The SBOM section lists formats but no field-level template for the CRA obligations. This adds a CSV whose columns map to the manufacturer duties: component identification, version, supplier, vulnerability status, and the point of contact for coordinated disclosure.
>
> - https://tehisabiline.ee/assets/downloads/cra-sbom-mall.csv
> - Context: https://tehisabiline.ee/cra/
>
> No tracking, no signup. If the list prefers a link to a hosted template over a raw file, I will send that instead.

---

## 5. github.com/bureado/awesome-software-supply-chain-security — pull request

Channel: PR. Asset: SBOM template + CRA explainer.
Proof: 381★, a compilation rather than tools-only.

Title: Add a CRA-oriented SBOM template

Body:

> One line in the templates/compliance area: a CSV SBOM template whose fields follow the EU Cyber Resilience Act requirements a manufacturer must document.
>
> - https://tehisabiline.ee/assets/downloads/cra-sbom-mall.csv
> - Practical explainer, including what market surveillance asks for: https://tehisabiline.ee/cra/
>
> Written by a cybersecurity auditor; free to use, no attribution required.

---

## 6. Eesti Kaubandus-Tööstuskoda — member resource offer

Channel: email only after deciding on chamber membership; the offer is a resource for member companies, not a link request. Asset: SME NIS2 applicability + checklist.
Live page: `https://www.koda.ee/et/liikmed/liikmelt-liikmele-pakkumised`

Subject: NIS2 materjal koja liikmetele

Tere [nimi],

[eesnimi perekonnanimi] soovitas pöörduda teie poole. Koja liikmete hulgas on palju väikeettevõtteid, kelle jaoks NIS2 kohaldumine on esimene küsimus: kas seadus puudutab neid üldse.

Tegin tasuta kontrollnimekirja, mis vastab sellele enne nõuete juurde liikumist, ja lühikese ülevaate Eesti suuruspiiridest: https://tehisabiline.ee/nis2/kontrollnimekiri/

Kui see sobib liikmetele mõeldud materjalide hulka, võite sellele viidata. Kui koja formaat eeldab liikmelisust, öelge, millised on tingimused — ma ei küsi tasuta kohta, mida liikmetele ei pakuta.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

---

## 7. ITL CyberTech — cluster member listing

Channel: email, tied to membership. Asset: `/pentestimine/naidisraport/`.
Proof: member listing per service verified; cluster membership is a fee, not a link purchase.

Subject: Pentesti näidisraport CyberTechi liikmete jaoks

Tere [nimi],

CyberTechi profiilides on teenuse kaupa kirjeldatud, mida liige teeb. Avaldasin sünteetilise läbistustestimise raporti näidise, mis näitab ulatust, metoodikat, tõendatud leide ja parandusplaani — see on mõeldud tellijale, kes ei tea, mida raportist otsida: https://tehisabiline.ee/pentestimine/naidisraport/

Küsimus: millised on liikmelisuse tingimused ja kas teenuseprofiili juurde saab sellise avaliku materjali lisada? Kui see eeldab liikmeks astumist, siis ütlege hind ja tingimused ning ma otsustan.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

---

## 8. Finance Estonia — member directory entry

Channel: email / membership route. Asset: `dora-register-of-information-template.csv`.
Proof: member directory confirmed; finance-sector fit is the gate.

Subject: DORA teaberegistri mall finantssektori ettevõtetele

Tere [nimi],

Finance Estonia liikmete jaoks on DORA teaberegister üks konkreetsemaid töid, mis 2026. aastal teha tuleb. Koostasin CSV-malli, mis järgib rakendusmääruse (EL) 2024/2956 välju, ja lühijuhendi, kuidas registrit lepingutega siduda: https://tehisabiline.ee/dora/

Kui see sobib liikmetele mõeldud materjalide hulka, võite sellele viidata. Mall on tasuta ja ilma registreerimiseta. Kui liikmelisus on eeltingimus, saatke palun tingimused.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

---

## 9. eisay.ee — auditor resource suggestion

Channel: single email, low odds as the playbook notes (15 KB site, no resource list). Asset: ISO 27001 / NIS2 evidence workbook.
Expectation: one email, no follow-up beyond the standard single chase.

Subject: Tõendite töövihik ISO 27001 ja NIS2 audititeks

Tere [nimi],

nägin, et teie leht keskendub audititele. Koostasin töövihiku, mis seob ISO 27001 kontrollid ja NIS2 art&nbsp;21 meetmed tõenditega, mida auditil valimisse võetakse: https://tehisabiline.ee/iso-27001/

Kui see on teie klientidele või kolleegidele kasulik, võite sellele viidata. Kui teie lehel pole linke välja, ei ole see probleem — siis jätan selle lihtsalt teadmiseks.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

---

## 10. Startup Estonia — ecosystem page mention

Channel: email to the ecosystem contact. Asset: NIS2 starter for founders.
Proof: page invites support organisations to showcase services; expect a mention, not a guaranteed link.

Subject: NIS2 algmaterjal asutajatele

Tere [nimi],

teie ökosüsteemi lehel on tugiorganisatsioonide jaoks mõeldud osa. Paljud varajase faasi tiimid puutuvad NIS2-ga kokku esimest korda siis, kui klient või investor seda küsib, ja esimene küsimus on alati „kas see puudutab meid üldse“.

Tegin selleks tasuta algmaterjali: enesekontroll, Eesti suuruspiirid ja kümme meedet tõenditega: https://tehisabiline.ee/nis2/

Kui see sobib teie lehele, võite selle ära märkida. Kui formaat on teistsugune (lühikirjeldus, logo, link), öelge, milline, ja ma kohandan.

Parimate soovidega
Arle Aron Reidma
Tehisabiline OÜ

---

## Tracking

Log every send in the sheet described in `backlink-playbook.md` (target, page URL, contact, asset, first contact, follow-up, status, link URL, rel, referral traffic). One follow-up only, 5–7 working days later, then stop.

## Order to send in

1. The three GitHub PRs (2, 3, 4) — no relationship needed, reviewable in public, and they double as the SBOM/CRA reference the playbook calls the missing artefact.
2. digipro Geenius (1) and Startup Estonia (10) — editorial audiences, highest realistic chance of a followed link.
3. Membership-gated offers (6, 7, 8) — only if membership is a cost Arle is willing to pay; the email asks for the price rather than assuming it.
4. eisay.ee (9) — one email, low odds, do not chase.
