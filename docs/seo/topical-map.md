# Tehisabiline topical map — reviewed 2026-10-30

## Scope and evidence rules

This is the ICP-led map for the 72-route working inventory: the 70 URLs in the final
30 October GSC snapshot plus the two new Estonian references `/ai_info/` and `/entitymap/`.
The new routes have no GSC baseline. They are registered in `entitymap.json`,
the trust cluster, page registry and sitemap. The HTML map has been rendered from the
canonical JSON. `tools/entitymap.mjs` validates it by default; `--render` updates only its
bounded HTML region, not this document or JSON. Both routes use Estonian self-canonicals, with no EN mirror.

Owner-confirmed audiences in `PRODUCT.md` (private positioning reference; never a public
source):

- **B — primary service buyer:** Estonian company entrepreneurs and IT leads who need to
  understand risk in their website, app or AI system and may request an authorized cyber
  audit or pentest. Owner priority is pentesting; `/pentestimine/` is the commercial
  landing page.
- **D — developer/security-team audience:** teams building security tooling and seeking
  application-based pilot access to a cyber-tuned OpenAI-compatible API. It is in
  development; there is no public endpoint. Existing-system API testing is a different
  topic from the `/mudelid/` model API.
- **R — public/trust audience:** people checking what the company does and whether its
  claims can be verified.
- **F — funders/programmes:** investors, grant bodies and startup programmes reviewing
  the team, product maturity and evidence.

Regulated-entity operators, compliance advisers and journalists are **useful readers or
referrers**, but are not additional owner-confirmed ICPs. Regulatory pages serve their
information jobs without changing the service audience. Managed AI services, assistants,
knowledge bases and automation belong on arletop.com, not this site's keyword plan.
Testing an AI system here means authorized security testing within the confirmed cyber
audit capability; it does not imply AI consulting or AI product-development services.

**X** in the route matrix means an adjacent regulatory reader, not an additional owner-confirmed ICP.

Evidence labels: **G28** = exact-page Search Console impressions in 2026-10-01–28;
page metrics are not query metrics. **Q7** = visible query row in 2026-10-22–28,
all-country average, not an Estonia rank. **Z90** = exact URL filter found no recorded
impressions in the 90-day snapshot (and none in the latest 28 days); this is not position
zero or an index-state conclusion. **N** = new route absent from that snapshot.
**AC** = Google Autocomplete suggestion collected 2026-10-28, not volume. **SERP** =
public-result intent sample read 2026-10-30, not rank tracking. **H** = hypothesis only.
Query rows expose only 141/618 latest-seven-day impressions and 163/741 latest-28-day
impressions; missing query rows are not evidence of no demand.

Property context: final 2026-10-22–28 data is 618 impressions / 19 clicks / 7.86 average
position; final 2026-10-01–28 is 741 / 28 / 8.59. These are whole-property averages,
not fixed positions or a basis for volume, difficulty or forecast claims. Nineteen of
the 70 old routes are Z90. GSC and source paths are listed under Research notes below.

## Hub/spoke map: query → evidence → actual answer/asset → next step

The query family is a candidate page intent, not a claim that every phrase was observed.
Internal links listed as “added 30 Oct” are already implemented by the body-link pass in
the shared working tree; they are not a future recommendation.

Exact query observations are labelled Q7; AC applies only to variants recorded in the
dated suggestion files; SERP marks result intent. Any unobserved phrase is H even when
its page has G28 impressions. A page-level impression never proves that phrase triggered it.

### 1. Authorized audit and pentest — commercial hub `/pentestimine/`

| Canonical | Audience → job; query family → intent | Evidence | Existing answer/asset → next step |
| --- | --- | --- | --- |
| `/pentestimine/` | B: scope an authorized technical test; `pentestimine Eestis`, `pentestimine hind`, `penetration testing Estonia` → commercial | G28 26 impressions / 2 clicks / 3.65 page average; AC: `pen testid`, `pen testimine`, `pentesting eesti`; SERP commercial | Primary service page explains written scope, human review, limits and price factors; no published fixed price. Keep this as the only commercial pentest hub; link to `/pentestimine/naidisraport/`. |
| `/pentestimine/naidisraport/` | B: judge report evidence before choosing a provider; `pentesti raporti näidis` → commercial investigation | G28 1 / 0; page metric only | Synthetic PDF with fictional names, targets and findings; not a client case or proof of outcomes. Next: `/pentestimine/#tellimine`. |
| `/kuberaudit/` | B: decide whether a broader posture review fits; `küberaudit`, `IT turvaaudit`, `turvaaudit hind` → commercial/research | G28 23 / 1 / 4.91; SERP: audit terms can include non-cyber/security meanings | Current page explains scope, pricing factors and audit-versus-pentest distinction. Keep broad posture separate from active pentesting; link to `/pentestimine/`. |
| `/api-turvatestimine/` | B/D: assess an existing API; `API turvatestimine`, `API pentest` → service research | G28 2 / 0; H for query-level match | Educational existing-system API guide, not the model API offer. Use the real checklist spoke `/api-turvatestimine/kontrollnimekiri/`; do not create a second API service landing page. |
| `/api-turvatestimine/kontrollnimekiri/` | D: prepare an API test; `API pentesti kontrollnimekiri` → informational | Z90; H | Existing OWASP API Top 10 evidence table; no separate downloadable asset in the registry. Link back to the guide and keep the technical checklist distinct from the commercial hub. |
| `/veebirakenduse-turvatestimine/` | B/D: understand web-app test scope; `veebirakenduse pentest`, `web application penetration test` → service research | G28 2 / 0; H for query match | Existing educational guide; no unique tool/download. Route commercial requests to `/pentestimine/`, not a duplicate service page. |
| `/ai-turvatestimine/` | B/D: assess security of an owned AI feature; `AI süsteemi turvatest`, prompt-injection security → informational/service-fit | G28 3 / 0 (page only); old autocomplete pass found no LLM-security demand; H | Existing page only supports authorized security testing of a customer's own system. Do not target managed AI, chatbot, knowledge-base or AI-consulting terms; link to the authorized scope on `/pentestimine/`. |

### 2. NIS2 / KüTS — Estonian scope hub `/nis2/`

| Canonical | Audience → job; query family → intent | Evidence | Existing answer/asset → next step |
| --- | --- | --- | --- |
| `/nis2/` | B/X: decide whether the Estonian entity is in scope; `NIS2 Eestis`, `NIS2 ettevõttele` → informational/decision | G28 63 / 3 / 9.90; Q7 `nis2 eesti` 10 / 1 / 15.20; AC and SERP | Four-question browser check and memo; current KüTS/official citations. Continue to registration, measures or audit based on the decision. |
| `/nis2/kontrollnimekiri/` | B/X: turn ten measures into evidence owners; `NIS2 kontrollnimekiri`, `NIS2 nõuded` → informational/action | G28 3 / 0; AC family | Interactive ten-measure checklist with evidence prompts; the text separates law from recommendations/examples. Continue to `/nis2/audit/` or the relevant evidence guide. |
| `/nis2/registreerimine/` | B/X: understand RIA registration and changes; `NIS2 registreerimine`, RIA → transactional-information | G28 3 / 0; H for exact query | Registration/deadline calculator and RIA references; next: `/nis2/` scope decision and RIA's current instructions. |
| `/nis2/trahvid/` | B/X: understand statutory exposure; `NIS2 trahvid` → informational | Z90; H; no current query evidence | Existing fine-ceiling calculator; explain that a ceiling is not an expected fine or legal advice. Maintain as a spoke; do not add another fines URL. |
| `/nis2/intsidendist-teatamine/` | B/X: identify reporting steps and clocks; `NIS2 intsidendist teatamine` → urgent informational | G28 12 / 0; H for exact query | 24/72-hour calculator and official references; distinguish incident type, awareness time and applicable national process. Continue to `/nis2/kontrollnimekiri/`. |
| `/nis2/audit/` | B/X: collect measure evidence and choose review scope; `NIS2 audit`, `NIS2 auditi tõendid` → commercial investigation | G28 1 / 1; Q7 family `nis2 audit` is mainly visible on EN page | Excel evidence register; states NIS2 does not mandate one certificate or form and Tehisabiline does not issue legal opinions or official compliance audits. Next: `/kuberaudit/` or `/pentestimine/` for scoped technical evidence. |
| `/nis2/toetus/` | B/X: check whether an audit-support programme fits; `NIS2 toetus EIS` → transactional-information | G28 10 / 1 | EIS terms table last checked 2026-10-27; terms can change. Verify live EIS conditions before decisions; next: `/nis2/audit/`. |

### 3. DORA / TLPT — overview `/dora/`; English register spoke

| Canonical | Audience → job; query family → intent | Evidence | Existing answer/asset → next step |
| --- | --- | --- | --- |
| `/dora/` | B/X: understand the DORA workstreams; `DORA Eestis`, DORA requirements → informational | G28 9 / 0; SERP | DORA overview and register CSV shared with the register spoke; next: `/dora/teaberegister/`, `/dora/audit/`, `/tlpt/`. |
| `/dora/audit/` | B/X: prepare audit evidence; `DORA audit checklist`, evidence → informational/action | G28 1 / 0; H for query match | Existing evidence CSV; it is a working aid, not a regulatory audit or compliance result. Next: `/dora/`. |
| `/dora/teaberegister/` | B/X: assemble and check the register; `DORA teaberegister`, template → informational/action | G28 1 / 0; SERP | Browser-only CSV structure/date/duplicate-ID checker and internal work template. Distinguishes that file from the official ITS format; cites EBA and Finantsinspektsioon. Next: English detailed template or official FI instructions. |
| `/tlpt/` | B/X: determine TLPT/TIBER-EE applicability and preparation; `TLPT`, `TIBER-EE` → informational | G28 7 / 0; H | Existing explanation, no ET downloadable asset. Do not imply Tehisabiline is a regulated TLPT provider; route only to the official source or a qualified provider. |

### 4. Frameworks and product law — overview `/regulatsioonid/`

| Canonical | Audience → job; query family → intent | Evidence | Existing answer/asset → next step |
| --- | --- | --- | --- |
| `/regulatsioonid/` | B/X: identify which framework governs the decision; `küberturvalisuse regulatsioonid` → comparative-information | G28 23 / 0; SERP | Six-framework comparison CSV and deadline calendar; comparison is a navigation aid, not equivalence or legal advice. Continue to the controlling framework page. |
| `/e-its/` | B/X: understand Estonian E-ITS controls and audit timing; `E-ITS audit`, `E-ITS nõuded` → informational | G28 36 / 1; AC | RIA-linked guide; preserve the distinction between the audit-rule and regulation deadlines already documented on-page. Do not claim ISO equivalence. |
| `/iso-27001/` | B/X: distinguish standard, internal audit and certification; `ISO 27001 Eestis`, `ISO 27001 audit` → informational/commercial investigation | G28 24 / 0; AC | Current standard/certification guide; no certification service claim. Continue to `/iso-27001/auditeerimine/` or the actual security audit scope. |
| `/iso-27001/auditeerimine/` | B/X: perform an internal audit; `ISO 27001 auditeerimine`, internal audit checklist → informational/action | Z90; AC | Internal-audit workbook covers audit programme, clauses 4–10, findings and corrective action. Tehisabiline is not a certification body; next: `/iso-27001/`. |
| `/sbom/` | B/D/X: determine the applicable product/supplier evidence and check an inventory; `SBOM`, `CRA SBOM` → informational/action | Z90; older autocomplete family; no GSC query proof | CSV inventory worksheet plus browser-side structural check. CRA technical documentation requires a machine-readable component list with at least first-level dependencies; the Regulation does not prescribe one exact format or require public posting. This is not full SPDX/CycloneDX validation, vulnerability scanning, or proof of product security. NIS2 supply-chain risk management is not a universal SBOM mandate. Next: `/cra/`. |
| `/cra/` | B/D/X: determine whether a product is in scope and what deadline applies; `Cyber Resilience Act`, CRA requirements → informational/decision | G28 13 / 0; SERP | Scope self-check and reporting-deadline calculator; official Commission sources say reporting duties began 2026-09-11 and principal requirements apply 2027-12-11. Continue to `/sbom/` or `/en/cra/vulnerability-reporting/`. |
| `/ai-act/` | B/D: classify AI use and identify obligations; `AI Act Eestis`, AI Act risk class → informational | G28 8 / 1; AC | Risk-class self-check and cited Act text. It is not an AI-system compliance audit or a cyber-AI service page. Continue to high-risk worksheet only where the rule applies. |
| `/ai-act/korge-riskiga-susteemid/` | B/D/X: assess high-risk classification and evidence; `high-risk AI system`, Annex III → informational/action | Z90; AC from 2026-10-29 history | Article 6 / Annex III classification worksheet with Articles 9–15 evidence map; not a legal determination or certification. Next: `/ai-act/`. |

### 5. Sector context — index `/sektorid/`

| Canonical | Audience → job; query family → intent | Evidence | Existing answer/asset → next step |
| --- | --- | --- | --- |
| `/sektorid/` | B/X: find sector-specific NIS2 context; `NIS2 sektorid` → informational | Z90; the Oct-28 autocomplete pass had no retained `nis2 sektorid` suggestion | Existing sector index. Keep it as navigation; do not publish symmetrical thin sector spokes without new query evidence. |
| `/sektorid/energeetika/` | B/X: check energy-sector context; `NIS2 energy`, `NIS2 OT requirements` → informational | Z90; AC observed English `NIS2 requirements for OT` on 2026-10-28; no GSC query evidence | Existing energy-sector guide. OT is a query hypothesis, not proof every OT operator is in scope. Keep the legal entity/service test distinct from technical environment examples; no new OT landing page. |
| `/sektorid/tervishoid/` | B/X: check health-sector context; NIS2 health-sector applicability → informational | G28 1 / 1; H for query match | Existing sector guide; a single impression/click does not establish demand. Link to `/nis2/` for the actual scope test. |

### 6. Articles — editorial index `/artiklid/`

| Canonical | Audience → job; query family → intent | Evidence | Existing answer/asset → next step |
| --- | --- | --- | --- |
| `/artiklid/` | B/X: browse existing implementation guidance; cybersecurity guides → navigational | Z90 | Article index, not a standalone query landing page. Keep each article under its own intent; do not make tag/doorway pages. |
| `/artiklid/varunduse-taastetest/` | B/X: test recovery and record RPO/RTO; `RPO RTO näide`, backup restore test → informational/action | Z90; H | Worked 90-minute plan is expressly an illustrative example to adapt, not a customer result or a required cadence. It shows how to measure restore time and potential data loss. No standalone download; next: `/nis2/kontrollnimekiri/` and the continuity measure. |
| `/artiklid/nis2-tarneahel/` | B/X: assess direct supplier risk; NIS2 supply-chain security → informational/action | G28 1 / 0; SERP | Supplier CSV and risk-tier explanation; 30/60/90-day sequence is a recommendation, not a statutory deadline. English counterpart is `/en/nis2/suppliers/`; next: NIS2 checklist. |
| `/artiklid/mfa-juurutamine/` | B/X/D: plan MFA deployment; `MFA juurutamine` → informational | G28 1 / 0; H for query match | Existing implementation guide, no separate asset. Keep guidance practical and source-bounded; no new MFA URL. |
| `/artiklid/nis2-juhatus/` | B/X: understand management-body responsibility; NIS2 board duties → informational | G28 3 / 0; H | Existing board-focused guide. Link to `/nis2/audit/` and the measure checklist rather than repeating the whole NIS2 hub. |
| `/artiklid/kuberriskide-register/` | B/X: turn a risk scenario into an owned record; `riskianalüüsi juhend`, risk-register example → informational/action | G28 3 / 0; AC family in 2026-10-28 history | Risk-register CSV and a worked row; example is illustrative, not customer data or a measured risk score. Next: `/nis2/kontrollnimekiri/`. |

### 7. English navigation and regulatory/service tree

`/en/` is the language entry point, not a single English topic hub. Each subject below
keeps its own intent. EN routes remain self-canonical; they are not interchangeable
translations where the implementation has no matching ET spoke.

| Canonical | Audience → job; query family → intent | Evidence | Existing answer/asset → next step |
| --- | --- | --- | --- |
| `/en/` | B/D/X: choose an English guide; English cyber audit/NIS2 → navigational | G28 12 / 0 | English index; direct readers to the specific service or legal guide. |
| `/en/press/` | R/F: verify company/founder facts; Tehisabiline press/company → entity research | G28 9 / 1 | Published company facts and source links; do not infer client traction or investor endorsement. Next: `/meist/`. |
| `/en/regulations/` | B/X: compare relevant rules in English; cybersecurity regulations → informational | G28 22 / 1 | English framework overview and links to the English subject guides; not a substitute for the applicable law. |
| `/en/nis2/` | B/X: understand NIS2 as applied in Estonia; NIS2 Estonia, scope, requirements → informational/decision | G28 61 / 0; SERP | English overview with current Estonian law and scope context. **Added 30 Oct:** body links “NIS2 scope assessment and worksheet” → `/en/nis2/scope-assessment/`, “supplier requirements guide and questionnaire” → `/en/nis2/suppliers/`, “English NIS2 compliance checklist” → `/en/nis2/checklist/`, “NIS2 and ISO 27001 comparison” → `/en/nis2/vs-iso-27001/`. |
| `/en/nis2/registration/` | B/X: register with RIA; NIS2 registration in Estonia → informational/action | G28 7 / 0 | Registration/deadline guidance and calculator; verify current RIA route. Next: `/en/nis2/`. |
| `/en/nis2/fines/` | B/X: distinguish ceiling from actual penalty; NIS2 fines → informational | G28 21 / 0 | Fine-ceiling calculator; no prediction of an actual fine. Next: `/en/nis2/`. |
| `/en/nis2/incident-reporting/` | B/X: identify notification sequence; NIS2 incident reporting → urgent informational | G28 4 / 0 | Reporting guide/calculator and official references; next: `/en/nis2/`. |
| `/en/nis2/audit/` | B/X: decide what an NIS2 audit is and what evidence it needs; `nis2 audit` → informational/commercial investigation | G28 59 / 0 / 14.54 page average; Q7 query 33 / 1 / 15.15; 28-day query/page row: 32 / 0 / 15.59 | Explains audit scope and evidence, not a required certificate. Preserve this English query page; link to `/en/nis2/checklist/` and `/en/security-audit/` only where the reader's job changes. |
| `/en/nis2/checklist/` | B/X: map ten duties to evidence and owners; `NIS2 compliance checklist` → informational/action | Z90; AC | Interactive ten-measure checklist. **Added 30 Oct:** contextual link from `/en/nis2/`; use as an evidence step, not a promise of compliance. |
| `/en/nis2/suppliers/` | B/X: assess direct supplier risk and contract evidence; `NIS2 supplier requirements`, questionnaire → informational/action | Z90; AC | Fourteen-question CSV. The duty sits with the in-scope entity; NIS2 does not prescribe this questionnaire or a fixed clause list. **Added 30 Oct:** contextual link from `/en/nis2/`. |
| `/en/nis2/scope-assessment/` | B/X: screen sector, size, group and special cases; NIS2 scope assessment → decision | Z90; AC | Browser-only assessment plus decision worksheet. It is a structured screen, not a legal opinion. **Added 30 Oct:** contextual link from `/en/nis2/`. |
| `/en/nis2/vs-iso-27001/` | B/X: see overlap without confusing duties; NIS2 vs ISO 27001 → comparative-information | Z90; AC | Article 21(2) to Annex A mapping CSV, with gaps/evidence; no ISO certificate substitution claim. **Added 30 Oct:** contextual link from `/en/nis2/`. |
| `/en/cra/` | B/D/X: understand product scope and dates; Cyber Resilience Act → informational | G28 3 / 0; SERP | English CRA scope self-check and source links; next: `/en/cra/vulnerability-reporting/` or `/en/sbom/`. |
| `/en/cra/vulnerability-reporting/` | B/D/X: handle an actively exploited vulnerability/severe incident reporting workflow; CRA vulnerability reporting → urgent informational/action | Z90; AC from 2026-10-29 history | RFC 9116 security.txt builder and DOCX handling-policy outline. It supports preparation; ENISA/CSIRT requirements and the Regulation control. |
| `/en/dora/` | B/X: understand DORA in Estonia; DORA requirements → informational | G28 16 / 0; SERP | English overview; official sources; next: `/en/dora/register/`, `/en/dora/audit/` or `/en/tlpt/`. |
| `/en/dora/audit/` | B/X: assemble DORA audit evidence; DORA audit checklist → informational/action | G28 14 / 0 | DORA evidence CSV and guide; no official audit or attestation claim. |
| `/en/dora/register/` | B/X: map contracts to the official RoI submission format; DORA register of information template → informational/action | G28 23 / 0; SERP and EBA source | English CSV is an internal working file, not the official ITS deliverable. EBA identifies Commission ITS 2024/2956 and its fourteen linked templates. Next: the official FI submission instructions. |
| `/en/ai-act/` | B/D: classify AI use and understand the regulatory timeline; EU AI Act, AI Act risk categories → informational | G28 81 / 5 / 4.53 page average; AC | English risk-class self-check. This is regulatory intent, not evidence of demand for AI consulting. Use current Commission timeline and link to the high-risk worksheet. |
| `/en/ai-act/high-risk/` | B/D/X: assess Annex III/Article 6 status and evidence; high-risk AI system → informational/action | Z90; AC from 2026-10-29 history | English classification/evidence worksheet; not a legal determination or certification. Next: `/en/ai-act/`. |
| `/en/sbom/` | B/D/X: understand software-component inventory and limits; SBOM/CRA → informational | G28 14 / 0 | English guide and existing browser checker; same structural limitations and CRA-versus-NIS2 boundary as `/sbom/`. Next: `/en/cra/`. |
| `/en/e-its/` | B/X: understand the Estonian security standard and audit timing in English; E-ITS → informational | G28 14 / 0 | English E-ITS guide with RIA sources; not ISO equivalence or certification. |
| `/en/pentesting/` | B: scope an authorized penetration test; penetration testing Estonia → commercial | G28 5 / 0; H for query match | English service page. Keep written authorization and human-reviewed findings explicit; no fixed-price or guaranteed outcome claim. |
| `/en/security-audit/` | B: choose a broader cybersecurity audit; cybersecurity audit → commercial | G28 3 / 0; SERP | English service explanation. **Added 30 Oct:** “cybersecurity audit checklist and report template” → `/en/security-audit/checklist/`; the checklist is not an audit result. |
| `/en/iso-27001/` | B/X: understand ISO 27001 in Estonia and certification boundaries; ISO 27001 → informational/commercial investigation | G28 26 / 1; AC | English standard guide; Tehisabiline is not a certification body. **Added 30 Oct:** “ISO 27001 audit checklist” → `/en/iso-27001/audit-checklist/`. |
| `/en/iso-27001/audit-checklist/` | B/X: plan an internal audit and evidence sample; ISO 27001 audit checklist → informational/action | Z90; AC | 63-row CSV and clause 9.2 walkthrough; not a certificate or complete assessment. |
| `/en/security-audit/checklist/` | B/X: define audit sampling and report evidence; cybersecurity audit checklist/report template → informational/action | Z90; AC/SERP | 74-row, ten-domain checklist and report TXT. Sampling plan, not a compliance certificate or pentest; linked from `/en/security-audit/` on 30 Oct. |
| `/en/pentest-report/` | B: compare report quality and define scope; penetration testing report/scope template → commercial investigation | Z90; AC from 2026-10-28 history | Report TXT and rules-of-engagement worksheet; template is not a customer report. Next: `/en/pentesting/`. |
| `/en/tlpt/` | B/X: understand DORA TLPT readiness; TLPT vs TIBER, DORA TLPT → informational/action | Z90; AC | TIBER-EU/DORA readiness CSV; not evidence that Tehisabiline delivers a regulated TLPT. |

### 8. Company, trust, model and reference resources

| Canonical | Audience → job; query family → intent | Evidence | Existing answer/asset → next step |
| --- | --- | --- | --- |
| `/` | B/D: understand the two actual offers and choose a next step; Tehisabiline cyber audit/API → navigational/commercial | G28 65 / 2 / 3.62 | Homepage states authorized audit/pentesting and API development status; includes the regulatory-deadline ICS. Do not broaden it to managed AI services. |
| `/kasutusjuhud/` | D/F: see bounded examples of the API's intended use; cybersecurity AI use cases → informational/product discovery | G28 10 / 0 | Illustrative time/ROI calculator explicitly not a savings promise. API remains application-based pilot, not public self-serve access. |
| `/meist/` | R/F/B: verify the founder, company and actual offers; Tehisabiline OÜ/founder → entity research | G28 37 / 3 | Public identity, location, offer and operating limits. **Added 30 Oct:** “Tehisabilise faktilehte” → `/ai_info/` and “HTML-üksuste kaardilt” → `/entitymap/`; do not add claims absent from these sources. |
| `/viitamine/` | R/F: verify citations and reuse public references; Tehisabiline sources → reference/navigational | G28 7 / 0 | Public source and asset index; keep it synchronized with published resources, not promotional authority claims. |
| `/sonastik/` | B/D/R: understand cyber terms; Estonian cybersecurity glossary → informational | G28 12 / 0 | Existing definitions; no new glossary doorway pages. Link to the one substantive guide that answers the term. |
| `/privaatsus/` | R: understand data handling; privacy policy → navigational/legal | G28 5 / 0 | Legal/policy page, not a keyword expansion target. Keep statements aligned with actual data handling. |
| `/mudelid/` | D/F: assess API purpose, status and access constraints; cyber-tuned OpenAI-compatible model API → product discovery | G28 7 / 0 | Current model/API facts and application-based pilot status; no public endpoint, customer benchmarks or guaranteed capability. Don't confuse with `/api-turvatestimine/`. |
| `/ai_info/` | R/F: verify current public company/product facts; company facts → entity reference | N | Names Tehisabiline OÜ and registry code 17607255, links to the [Estonian Business Register](https://ariregister.rik.ee/est/company/17607255) for its legal name/location and 2026-09-24 establishment date, and states the listed services and their limits: client ownership/control, written permission, agreed scope, human review and no complete-coverage/security/outcome guarantee. The API is in development with no public endpoint or price; no good-standing/legal-status claim is made. Incoming anchor from `/meist/`: “Tehisabilise faktilehte”; source links back to `/meist/#autor`, `#principles` and `#content-policy`. |
| `/entitymap/` | R/F: inspect public page/entity relationships; HTML entity map → reference/navigation | N | Source is the updated `entitymap.json`; the authored HTML groups current routes into existing clusters, links canonical routes and displays IDs as code rather than guessed JSON-LD fragments. Its generated region still awaits the parent-owned `npm run render:entitymap` pass, so this note does not claim rendered output is complete. Incoming anchor from `/meist/`: “HTML-üksuste kaardilt”; no service or doorway intent. |

## Priorities and information-gain decisions

1. **Primary commercial intent:** protect `/pentestimine/` as the one pentest landing page; retain its scope, authorization, human-review and price-factor answers. Its 26/2 G28 page signal plus owner priority supports maintaining this page, not creating more synonyms. `/kuberaudit/` remains the broader posture-audit page.
2. **Highest supported regulatory information cluster:** keep `/nis2/` and its distinct spokes, and preserve `/en/nis2/audit/` for the observed English `nis2 audit` query. Use the implemented English contextual links above to move from scope → documented assessment, Article 21 → supplier evidence, checklist → measure owner, and comparison → remaining obligations. Don't claim the links guarantee ranking.
3. **Useful visible English non-service topic:** `/en/ai-act/` has 81 page impressions and 5 clicks in G28; this is AI Act research, not evidence for managed AI services or an AI consulting offer. Retain the risk worksheet as a distinct spoke.
4. **Other visible reference clusters:** E-ITS, ISO 27001, DORA register and regulatory overview already have dedicated pages and first-party worksheets. Keep official-vs-working-template distinctions visible; do not add duplicate comparison or checklist URLs.
5. **Maintain, do not expand, zero-observation pages:** Z90 pages have no recorded impressions, not a proven rank/index failure. Keep them when they answer a distinct existing job; only change content after new query/page evidence. Avoid building the missing sector pages symmetrically.
6. **New trust resources:** `/ai_info/` and `/entitymap/` support source verification and reader navigation. They are not keyword doorway pages and have no search demand evidence.

Information gain is the auditable page stack, not an originality score: **direct answer →
decision or worked example → existing tool/download → cited evidence and limitation →
relevant next step**. The registry's 40 assets are coverage checks, not a score of
competitive uniqueness. Priority stacks and source/limit notes live in
`docs/seo/info-gain.json`; the RPO/RTO and OT examples above remain clearly labelled as
illustrative and hypothesized, respectively.

## Research notes and source trail

Four complementary public-query groups were sampled on 2026-10-30 (Estonian/local
regulatory and audit terms; English DORA; English CRA/SBOM). Search results were used to
identify intent and source quality, not to claim a controlled Google Estonia rank:

- **NIS2/KüTS query:** “NIS2 KüTS Eesti ettevõtte kohaldamisala registreerimine RIA ametlik juhend.” Read [RIA business advice](https://www.ria.ee/kuberturvalisus/kuberruumi-analuus-ja-ennetus/nouanded-asutustele-ja-ettevotetele); cite the current [Riigi Teataja KüTS](https://www.riigiteataja.ee/akt/106102026002) and [NIS2 Directive 2022/2555](https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng) as primary law. The Riigi Teataja and EUR-Lex extraction returned only title/JS-shell text in this pass, so no new legal interpretation is claimed from that reader output.
- **Audit/pentest query:** “Eesti küberaudit turvaaudit pentest ettevõttele RIA infoturve juhend.” Read [RIA's business advice](https://www.ria.ee/kuberturvalisus/kuberruumi-analuus-ja-ennetus/nouanded-asutustele-ja-ettevotetele) and the live Tehisabiline service guides. The broad `turvaaudit` result family is ambiguous; the commercial page must say cyber/IT security and distinguish audit from pentest. The RIA page is guidance, not a commercial pentest comparison.
- **DORA query:** “DORA register of information template TLPT official EBA European Commission.” Read [EBA DORA preparation guidance](https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/preparation-dora-application). It identifies ITS (EU) 2024/2956 and the official RoI structure. The Tehisabiline CSV is a working file, not the regulator's format.
- **CRA/SBOM query:** “Cyber Resilience Act SBOM vulnerability reporting official European Commission regulation 2024/2847.” Read the [Commission reporting page](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting), [Commission CRA summary](https://digital-strategy.ec.europa.eu/en/policies/cra-summary), the linked [Regulation (EU) 2024/2847](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng) and [CISA SBOM guidance](https://www.cisa.gov/topics/information-communications-technology-supply-chain-security/sbom). Commission reporting guidance says the CRA reporting duties apply from 2026-09-11 and sets the 24/72-hour/final-report sequence. The Commission summary warns that it is not a comprehensive legal text; the Regulation controls. CISA's definition supports SBOM's inventory role, not EU legal interpretation.
- **AI Act primary source:** [European Commission regulatory framework](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai). Use the current Commission timeline and the Regulation's risk categories; recheck staged application dates before any future legal-date update.

Counterevidence: the [NIS2 Europe Estonia guide](https://nis2europe.eu/ee/et/juhend) shows a competitor page combining a scope check, obligations and a checklist, but its text says Estonia had not yet transposed NIS2, which conflicts with the current Estonian law and Tehisabiline's dated page. It is evidence of result-page intent, not an authority for current law. [Grant Thornton's standards overview](https://www.grantthornton.ee/insights-landing-page/luhijuhis-levinumad-standardid-ja-sertifikaadid-infoturbe-maailmas/) is an older, broad comparison result; it supports comparison intent but should not supply current deadlines.

First-party implementation/evidence sources:

- `PRODUCT.md` (private owner-confirmed audience, offers and constraints; do not cite publicly).
- `entitymap.json`, `sitemap.xml`, and `tools/entitymap.mjs` (70-route pre-resource snapshot; validator only).
- `docs/seo/icp-keywords.md` and `docs/seo/keyword-map.md` (current audience decisions and dated history).
- `docs/seo/info-gain.json` and `tools/info-gain.mjs` (40 actual proof-backed assets; validator does not score uniqueness).
- `/home/arle/tmp/tehisabiline_visibility_20261030/visibility_summary.json` and `visibility_inventory.json` (final URL visibility through 2026-10-28; exact-filtered zero routes).
- `/home/arle/tmp/tehisabiline_gsc_20261030/derived_summary.json` and query/page exports (final GSC dates, visible queries, incomplete query coverage).
- `docs/seo/suggest-et-2026-10-28.json` and `docs/seo/suggest-en-2026-10-28.json` (Autocomplete suggestions, not search volume).
- `local://contextual_link_changes.txt` (30 October implemented-body-link handoff; the four source pages and exact anchor-to-route pairs are recorded above).
- `artiklid/varunduse-taastetest/index.html` (90-minute illustrative RPO/RTO plan); `sbom/index.html` and `cra/index.html` (current SBOM/CRA limits and official sources).

## Historical correction

The 2026-10-28 map described a 66-URL sitemap and included old inbound-link counts, unsupported
asset uniqueness claims, and a false statement that the entity-map validator parses this
document. Those figures and assumptions are superseded. The 30 October GSC snapshot had 70
URLs; this map includes the two additional Estonian factual/reference routes without
inventing visibility data. Earlier dated GSC and autocomplete observations remain in
`docs/seo/keyword-map.md`.
