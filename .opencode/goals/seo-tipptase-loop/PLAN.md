# Plan: seo-tipptase-loop

## Phases

1. Recon (parallel: researcher + explore)
2. Implement (coder)
3. Review loop, max 3 rounds (reviewer)
4. Verify (success + failure case, repo checks)

## Lanes + verification contracts

- LANE R (researcher, web): top technical/content/off-page SEO practices for small static Estonian sites in 2026. Sources + dates, corroborated. CONTRACT: returns ranked list of ≥10 actionable tactics with URLs + dates; stored in EVIDENCE.md.
- LANE A (explore, codebase): audit tehisabiline.ee repo – run test:seo, check sitemap/robots/meta/OG/JSON-LD/coverage, measure page weight, find broken/internal-link/dead-weight issues. CONTRACT: gap list with file:line + measurements.
- LANE I (coder): implement top fixes from R+A (bounded: no design overhaul, no new copy beyond SEO necessities). CONTRACT: test:seo passes, pages render (screenshot), no new console errors.
- LANE L (coder): build continuous SEO loop artifact: `tools/seo-loop.mjs` (runs checks, Lighthouse-ish weight audit, broken-link scan, sitemap-vs-files diff, writes dated report to output/seo-loop/) + cron/CD doc. CONTRACT: one full cycle runs green, report file exists.
- LANE V (reviewer): adversarial review of diff + loop script. CONTRACT: P0/P1 = 0 or fixed, rounds logged.

## Quality bar

Real evidence per task; no status-only turns; unhappy paths tested. No commit/push (safety: not asked). No invented facts/URLs/scores.

## Review rounds log

- Round 1: PASS (after fixes) — reviewer found P0 (.vercelignore excluded live assets/images/) + 3 P1 + P2s; all fixed and re-verified.
- Round 2: PASS (after fixes) — reviewer found phantom inbound (+2 self-links) + missed seo-check duplicate; both fixed, honest inbound 18/19 confirmed.
- Round 3: PASS — full re-review clean except 2 P2 doc nits, which were fixed. No P0/P1 outstanding.
