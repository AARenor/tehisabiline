# Plan: tehisabiline-ou-staatus

## Phases

1. Recon — done (kasutaja andis ettevõtteinfo; repo audit)
2. Implement (coder / otse)
3. Review loop, max 3 rounds (reviewer)
4. Verify (success + failure case, repo checks + live)

## Lanes + verification contracts

- LANE D (teabefail): notes-tehisabiline-overview.md — kogu info + avalik/sisemine jaotus. CONTRACT: fail sisaldab kõiki 9 avalikku punkti ja selget "ei kajasta" nimekirja.
- LANE W (veebileht): avalike punktide kajastus index.html, /mudelid/, /kuberaudit/ — andmed (ei kogu/treeni/leki), AI Act GPAI, auditivaldkonnad (süstiründed, API auth, rate limits, HTTP päised, andmeleke), mudelid (Qwen 27B lineup, avatud kaalud), sihtrühm. CONTRACT: iga punkt leitav lehelt grepi/kuvatõmmisega.
- LANE V (verify): test:seo + seo-loop + live curl + screenshot. CONTRACT: kõik rohelised, live sisu kinnitatud.
- LANE R (reviewer): lekke- ja kajastusaudit. CONTRACT: 0 sisemist detaili veebilehel; kõik avalikud punktid olemas.

## Quality bar

Real evidence per task; no status-only turns; no commit/push; no secrets.

## Review rounds log

- Round 1: PASS (after fixes) — reviewer found 4 P1 (model name inconsistency, missing concrete nouns, missing early-stage honesty, webhook hardening note) + 3 P2 (GPAI single-homed, hosting clarification, wording). Fixed: Qwen name unified, nouns added to mudelid/kuberaudit, "varajases etapis" added, GPAI section on privaatsus + TOC, hosting clarified, webhook note recorded.
- Round 2: PASS — 10/10 items verified, 0 P0/P1. P2 polish applied: fresh og:image:alt on kasutusjuhud, nav labels aligned, kuberaudit lead-answer mirrors nouns.
