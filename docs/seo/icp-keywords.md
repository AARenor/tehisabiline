# ICP → keyword → cluster map — 2026-10-25

Status: canonical audience map. ICPs are owner-confirmed in `PRODUCT.md` (2026-10-11),
not inferred. Queries are the ones the site can realistically win in Estonian: commercial
or compliance intent, low-to-mid volume, answerable with cited sources. Volume is not
claimed; `docs/seo/keyword-map.md` records the evidence method (GSC, autocomplete, SERP
inspection, no paid volume tool).

`arle.top` now serves managed AI services (assistants, knowledge bases, automation). Nothing
in this map targets that audience; do not re-add managed-AI queries to tehisabiline.ee.

## ICP 1 — Ettevõtja / IT-juht (Estonian SME, non-technical decision maker)

Job to be done: find out whether the company is in scope, what it must produce, and what an
audit costs.

| Question they type | Cluster | Page |
| --- | --- | --- |
| kas NIS2 puudutab minu ettevõtet | nis2 | `/nis2/` (self-check) |
| NIS2 registreerimine tähtaeg | nis2 | `/nis2/registreerimine/` |
| NIS2 trahv suurus | nis2 | `/nis2/trahvid/` |
| mis on turvaaudit / küberaudit | audit | `/kuberaudit/` |
| turvaaudit hind | audit | `/kuberaudit/` (#hind) |
| pentest vs audit | audit | `/kuberaudit/`, `/pentestimine/` |
| NIS2 toetus EIS | nis2 | `/nis2/toetus/` |
| mis on E-ITS / kas pean kasutama | frameworks | `/e-its/` |

Conversion path: self-check → checklist PDF → free mapping by email.

## ICP 2 — Arendaja / CTO (product team shipping APIs and AI features)

Job to be done: get a scoped test of an API or an LLM feature, and evidence for a customer
security review.

| Question they type | Cluster | Page |
| --- | --- | --- |
| API pentest / API turvatestimine | audit | `/api-turvatestimine/` |
| API pentesti checklist | audit | `/api-turvatestimine/kontrollnimekiri/` |
| prompt injection testimine | audit | `/ai-turvatestimine/` |
| RAG turvalisus | audit | `/ai-turvatestimine/` |
| pentesti raport näidis | audit | `/pentestimine/naidisraport/` |
| SBOM nõue / CRA | frameworks | `/sbom/`, `/cra/` |
| AI Act riskiklass | frameworks | `/ai-act/` (self-check) |

Conversion path: sample report PDF → scoped pilot → API key (pilot, by application).

## ICP 3 — Vastavusjuht / jurist / raamatupidaja (compliance adviser, often advising others)

Job to be done: a defensible answer and a template they can hand to a client, fast.

| Question they type | Cluster | Page |
| --- | --- | --- |
| DORA teaberegister mall | dora | `/dora/teaberegister/` |
| DORA audit tõendid | dora | `/dora/audit/` |
| TLPT / TIBER-EE kohustus | dora | `/tlpt/` |
| NIS2 audit tõendid | nis2 | `/nis2/audit/` |
| NIS2 kontrollnimekiri | nis2 | `/nis2/kontrollnimekiri/` |
| regulatsioonide võrdlus | frameworks | `/regulatsioonid/` |
| ISO 27001 vs E-ITS | frameworks | `/iso-27001/`, `/e-its/` |
| intsidendist teatamine tähtaeg | nis2 | `/nis2/intsidendist-teatamine/` |

Conversion path: CSV/PDF template → they forward the audit page → referral audit.

## ICP 4 — Ajakirjanik / õppejõud / fond (trust and citation, not purchase)

Job to be done: a quotable definition, a date, a number with a source.

| Question they type | Cluster | Page |
| --- | --- | --- |
| kes on Tehisabiline / tehisabiline OÜ | trust | `/meist/`, `/viitamine/` |
| NIS2 tähtaeg Eestis | nis2 | `/nis2/` |
| küberrünnakute statistika Eesti | audit | `/kuberaudit/` |
| küberturbe mõisted | trust | `/sonastik/` |
| pentesti näidisraport | audit | `/pentestimine/naidisraport/` |

Conversion path: `/viitamine/` citation formats → press mention → link.

## Rules

1. A new page must name its ICP and the question it answers in the commit message; the
   page otherwise belongs in no cluster and should not be published.
2. Do not create synonym pages for the same question. One question, one URL.
3. ICP 1 and ICP 3 queries convert; ICP 4 queries earn links. Both are wanted, but a page
   that serves neither is filler.
4. Every asset (calculator, CSV, PDF) belongs to an ICP and a cluster; an asset without a
   cluster page is unfinished work.
5. Re-derive this map from GSC queries every quarter; ICP labels are stable, queries are not.
