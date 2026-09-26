# Plan: oine-audit-8h (budget: 240 nudges, deadline 2026-09-26T07:03:14Z)

## Phases

1. Recon (parallel: researcher + explore + design review)
2. Implement (coder / direct, top findings only)
3. Review loop, max 3 rounds (reviewer)
4. Verify (success + failure case, repo checks + live baseline)

## Lanes + verification contracts

- LANE R (researcher, web): fresh 2026 angles not yet covered — Core Web Vitals field vs lab, INP on static forms, image AVIF/fetchpriority, hreflang-less single-lang correctness, AI-crawler monetization/block lists, Estonian directory citations, FAQ rich-result eligibility rules 2026. CONTRACT: ≥6 new checkable items with URLs+dates.
- LANE A (explore, codebase): full code audit — JS (homepage.js/index.js/roi-calculator) bugs, CSS dead/duplicate rules, HTML validity (duplicate ids, unclosed tags), a11y (labels, contrast, focus, details/summary), form backend path (n8n webhook error/timeout handling). CONTRACT: findings with file:line + severity.
- LANE D (design, screenshots): desktop+mobile screenshots of all 6 indexed pages + 404; visual/UX issues (overflow, overlap, tap targets, dark-on-dark, missing states). CONTRACT: issue list with section + viewport.
- LANE S (live baseline): curl every public URL (status, size, TTFB), headers (cache, HSTS, content-type), sitemap/robots/llms/IndexNow-key live, redirect stubs behavior. CONTRACT: table of live facts.
- LANE I (implement): fix P0/P1 only; no rebrands, no new pages. CONTRACT: test:seo + seo-loop green, screenshots re-taken.
- LANE V (reviewer): adversarial diff review ≤3 rounds. CONTRACT: 0 P0/P1 or fixed.

## Quality bar

Real evidence per task; no status-only turns; unhappy paths tested. No commit/push (safety). No secrets. Budget: no raises without PLAN.md reason.

## Review rounds log

- Round 1: PASS (after fixes) — 2 P1 (placeholder specificity loss, honeypot stacked state) + P2s (seo-check source/srcset, AVIF weight scan, docs). All fixed, re-verified with tests + screenshots.
- Round 2: PASS (CLEAN) — all 9 verification items pass, 0 P0/P1. One informational P2 (wording). No round 3 needed.
