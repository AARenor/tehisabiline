# Tehisabiline keyword map — 2026-10-24

## Method

- Google Autocomplete with `hl=et`, `gl=ee` for seed terms.
- Google Search Console Performance (current property data: 3 clicks, 20 impressions).
- GSC URL Inspection: `/kuberaudit/` is indexed; Google-selected canonical matches the declared canonical.
- SERP inspection for `turvaaudit Eesti`.
- No paid keyword-volume tool was used. Exact Estonian search volume is not claimed.

## What the data says

- GSC currently shows queries around `tehisabiline` and `küberaudit`; there is no meaningful `turvaaudit` query data yet.
- `turvaaudit` autocomplete is sparse: `turvaaudit`, `turvatestimine`, `turvaauk`, `turvateadlikkus`.
- `turvaaudit` SERP contains physical-security and state-audit results, not only IT security. The page must qualify the intent with `IT turvaaudit`, `küberaudit`, `küberturbe audit` and `infoturbe audit`.
- `infoturbe audit` autocomplete includes `infoturbe audiitor`, `infoaudit`, `infoturbejuht`.
- `E-ITS audit` autocomplete includes `e-its auditeerimisjuhend`, `e-its auditeerimine`, `e-its auditeerimiseeskiri`, `e-its audiitor`.
- `turvakontroll` is dominated by airport/physical security intent. Do not target it as a primary commercial keyword.

## Keyword → page map

| Keyword / phrase | Intent | Target page | How it is used |
| --- | --- | --- | --- |
| turvaaudit | broad, ambiguous | `/kuberaudit/` | H1, intro definition, FAQ, title |
| IT turvaaudit | commercial, narrower | `/kuberaudit/` | intro and scope section |
| küberturbe audit | commercial | `/kuberaudit/` | scope section |
| infoturbe audit | commercial / compliance | `/kuberaudit/` | definition and standards section |
| küberaudit | commercial | `/kuberaudit/` | existing primary term |
| turvaaudit ettevõttele | commercial | `/kuberaudit/` | intro CTA language |
| turvaaudit hind | commercial investigation | `/kuberaudit/#hind` | pricing FAQ |
| NIS2 audit | compliance | `/nis2/` + `/kuberaudit/` | evidence/audit cross-link |
| E-ITS audit / auditeerimine | compliance | `/e-its/` + `/kuberaudit/` | standards section |
| ISO 27001 audit | compliance / international | `/kuberaudit/` + `/e-its/` | standards FAQ; no certification claim |
| penetratsioonitest / pentest | commercial | `/pentestimine/` | existing service page |
| läbistustestimine | commercial synonym | `/pentestimine/` | existing synonym |
| haavatavuste skaneerimine | informational | `/kuberaudit/` + `/sonastik/` | scanner vs audit explanation |
| andmeturbe audit | adjacent | `/kuberaudit/` | only where scope actually covers data security |
| turvakontroll | ambiguous/physical | none | do not target |

## GSC update 2026-10-27

Impressions moved from ~10/day to 154/day on 26 October when the English section was indexed (see `gsc-2026-10-27.md`). Observed query → page facts that override the map above:

| Keyword / phrase | Impressions (7 d) | Position | Page that ranked | Action taken |
| --- | --- | --- | --- | --- |
| nis2 audit / nis 2 audit / audit nis2 | 15 | 10–29 | `/en/nis2/audit/` | `/nis2/audit/` gained `#teenus` service section + price FAQ so the Estonian page matches vendor intent |
| nis2 eesti | 4 | 21–27 | `/nis2/` | hub unchanged; authority is the limit, not on-page |
| nis2 dokument | 1 | 1.0 | `/nis2/` (via `/koolitus/` 301) | `#dokumendid` document map added to `/nis2/` |
| dora register of information template | 1 | 57 | `/en/dora/register/` | English CSV template + Dataset markup |
| cyber security audit | 1 | 70 | `/en/security-audit/` | not targeted; supporting page only |

## Rules

- One page per intent. Do not create `/turvaaudit/` as a doorway duplicate of `/kuberaudit/`.
- Use synonyms naturally in headings, definitions, FAQs and internal links.
- Do not claim certification, complete coverage or guaranteed ranking.
- Recheck GSC Performance after 28 days; add queries only when they show impressions.
