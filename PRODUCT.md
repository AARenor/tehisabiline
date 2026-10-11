# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Confirmed by the owner (2026-10-11): the site serves four audiences at once.

- **Entrepreneurs and IT leads** of Estonian companies who want to know whether their website, apps and AI systems hold up. Job: understand the risk in plain words and ask for a cyber audit (free initial mapping by email).
- **Developers and security teams** building security tooling. Job: get access to a cyber-tuned, OpenAI-compatible model API that answers legitimate security work (pilot, access by application).
- **Ordinary people** curious about AI and cyber safety. Job: understand what the company does and whether it can be trusted.
- **Funders** (investors, grant bodies, startup programmes). Job: judge the team, the mechanism, honesty and momentum of an early-stage company.

## Product Purpose

Tehisabiline OÜ (Tallinn, Estonia) offers:

- agent-driven cyber audits ("agendipõhine küberaudit") with human review of every significant finding;
- a cyber-tuned AI model and API, "keeldudeta ja piirangutega küber-AI", for legitimate security work, to be hosted on its own hardware in Estonia (hardware ordered, hosting coming);
- managed AI services for companies (assistant on own documents, self-updating knowledge base, automation with human approval, AI SEO/GEO), including an offer for startups.

Success: qualified email inquiries, API access requests, and credibility with funders.

## Positioning

"Keeldudeta, aga piirangutega": legitimate security work gets an answer (code analysis, payloads, red-teaming of your own systems with written permission) where filtered cloud models refuse; illegal or unauthorised work never does. Models run in Estonia; customer input is not stored, not trained on and not shared. Every significant audit finding is reviewed by a human before the report.

## Operating Context

- Audit path: free mapping ("Tasuta kaardistus") → pilot audit or rate-limited API key → handover with a prioritised fix plan (Kohe / 7 päeva / Plaani) and a re-check.
- Audit check areas: prompt-injection surfaces, API authentication logic, rate limits, HTTP security headers, data-exfiltration vectors.
- Contact is email only (tehisabiline@gmail.com); no forms. No public API endpoint yet.
- NIS2 guidance for Estonian companies is part of the site.

## Capabilities and Constraints

- Static HTML/CSS/JS, deployed to Vercel from the repository root with `vercel --prod`. Shared header and footer come from `tools/chrome.mjs`; `npm run build:assets` versions assets; `npm run test:seo` gates every change (H1 wording, JSON-LD, Open Graph, image width/height/alt, font-preload usage, manifest/theme-color parity, no canvas hero, local links).
- Self-hosted assets only (CSP: fonts and images from 'self').
- Early stage, stated honestly: hardware ordered, Estonian hosting "tulekul", pilot phase.
- Model base: Qwen3.8-27B (open weights), fine-tuned for cyber security.
- EU AI Act: general-purpose AI category, not high-risk.
- Never published: business-model details (credits, margins), financial forecasts, competitor disparagement, hardware procurement status as a business plan.

## Brand Commitments

- Name: Tehisabiline / Tehisabiline OÜ. Logo: the "T" mark — keep (owner, 2026-10-11).
- Standing visual preference (owner, 2026-10-11): a familiar modern AI landing page, executed at Stripe's craft level, made "natuke huvitavam" through one move: a live demo in the hero (a cloud AI refuses, Tehisabiline answers, audit findings appear once and stop; never an endless loop). The owner rejected exotic metaphor worlds for this site.
- Blue stays the brand colour (owner, 2026-10-11).
- Voice: plain Estonian, honest about limits ("Ausad piirid"), no hype, no promise of 100% security.
- Must not feel like: hacker clichés (black screens, green code, hooded figures), dark or hard-to-read pages, excessive motion (owner, 2026-10-11).
- Copy is not frozen: it may be tightened for clarity, but factual claims and the statements SEO checks rely on stay.

## Evidence on Hand

- Example audit summary with prioritised findings (synthetic, labelled "Näidisandmed").
- Refusal-versus-answer examples (cloud AI refuses, Tehisabiline answers within permission).
- Server illustration photo (`assets/images/tehisabiline-setup*`, labelled as illustration).
- Cited statistics: IBM Cost of a Data Breach 2026 (4.99M USD), Verizon DBIR 2026 (62% human element, 31% vulnerability exploitation), OECD Estonia 2026 (23.4% of enterprises used AI), Eurostat 2025 (19.95%).
- Founder and company facts on `/meist/`.
- Absent, never fabricate: customer logos, testimonials, case studies, benchmarks, prices, uptime figures, a public API endpoint.

## Product Principles

1. Honesty over hype: limits are shown as prominently as capabilities.
2. Prove with concrete artifacts (findings, refusals versus answers, check areas), not adjectives.
3. Plain language first for non-experts; technical depth one step away for developers.
4. Estonian hosting and data handling are tangible facts, not slogans.

## Accessibility & Inclusion

Estonian-language site (`lang="et"`) with long-form reading; WCAG AA contrast; keyboard navigation; reduced-motion, forced-colors and print support are already implemented and must be kept.
