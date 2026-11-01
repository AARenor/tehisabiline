# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Confirmed by the owner (2026-10-11): the site serves four audiences at once.

- **Entrepreneurs and IT leads** of Estonian companies who want to know whether their website, apps and AI systems hold up. Job: understand the risk in plain words and ask for a cyber audit (free initial mapping by email).
- **Developers and security teams** building security tooling. Job: explore the standalone public uncensored-model text demo; the separate cyber-tuned, OpenAI-compatible commercial API is still in development and pilot access is not public.
- **Ordinary people** curious about AI and cyber safety. Job: understand what the company does and whether it can be trusted.
- **Funders** (investors, grant bodies, startup programmes). Job: judge the team, the mechanism, honesty and momentum of an early-stage company.

## Product Purpose

Tehisabiline OÜ (Estonia) has two planned commercial service families and one standalone public demo:

- agent-driven cyber audits and pentesting ("küberaudit ja pentestimine") with written permission and human review of every significant finding;
- a cyber-tuned, OpenAI-compatible model API for legitimate security work. It is in development, not public, and has no production endpoint or published price. Qwen-based and Estonia-hosting plans describe the future API, not an operating service;
- the public uncensored-model text demo, a separate and limited technical demonstration, not the commercial API.

Managed AI services, assistants, knowledge bases, automation and startup packages now live on the separate site `https://arletop.com/` (launched 2026-10-24); SEO/GEO remains out of scope. Their source content is retained under `docs/future-ai-site/` and the public AI pages are maintained in the `arle-top` repository. On tehisabiline.ee, the old `/ai/`, `/ai-chatbot/` and `/ai-automatiseerimine/` URLs permanently redirect to the matching arletop.com pages.

Owner priority (2026-10-12): pentesting is the primary search and homepage emphasis. `/pentestimine/` is the commercial landing page; `/api-turvatestimine/` and `/veebirakenduse-turvatestimine/` are distinct educational guides. `/kuberaudit/` stays focused on broader security posture. The existing-system API testing guide is not the planned model API product at `/mudelid/`. Terminology includes pentestimine, pentest, läbitungimistest, pentesting and penetration testing, with substantive visible explanations rather than keyword stuffing or duplicate synonym pages.

Success: qualified email inquiries, API access requests, and credibility with funders.

## Positioning

"Keeldudeta, aga piirangutega": the planned commercial API is intended to support legitimate security work within agreed legal and authorization boundaries; it remains in development and is not public. The separate public demo is labeled “Tsenseerimata mudel” and is not that API. It sends one prompt to a fixed model and streams a limited output; when returned, generated reasoning and final-answer text are shown separately. Do not submit personal or confidential data. The demo route does not log prompt or generated-output content and uses no app-level conversation database, but Cloudflare, tunnel, model and runtime infrastructure logging and retention have not been verified. The configured output ceiling is 4,096 generated tokens total, including up to 1,024 reasoning tokens; the final answer may therefore be shorter. No claims are made here about server location, third-party non-processing, model accuracy or safety. Every significant audit finding is reviewed by a human before the report.

## Operating Context

- Audit path: free mapping ("Tasuta kaardistus") → scoped audit request; planned API access is discussed separately and is not public → handover with a prioritised fix plan (Kohe / 7 päeva / Plaani) and a re-check.
- Audit check areas: prompt-injection surfaces, API authentication logic, rate limits, HTTP security headers, data-exfiltration vectors.
- Contact is email only (tehisabiline@gmail.com); the public uncensored-model text demo is available, but the planned commercial cybersecurity API has no public endpoint.
- NIS2 guidance for Estonian companies is part of the site.

## Capabilities and Constraints

- Static HTML/CSS/JS, deployed to Vercel from the repository root with `vercel --prod`. Shared header and footer come from `tools/chrome.mjs`; `npm run build:assets` versions assets; `npm run test:seo` gates every change (H1 wording, JSON-LD, Open Graph, image width/height/alt, font-preload usage, manifest/theme-color parity, no canvas hero, local links).
- Self-hosted assets only (CSP: fonts and images from 'self').
- Early stage: the commercial cyber-AI API is planned, with hardware ordered and Estonia hosting forthcoming; neither API access nor Estonia-hosted API processing is live. The public uncensored-model demo is separate.
- Public demo contract (visible label: “Tsenseerimata mudel”): `POST https://ai.tehisabiline.ee/api/demo/lfm3` proxies to the same-host local LFM3 API at `127.0.0.1:8092`, fixed model `lfm3-1.7b-uncensored`, fixed server-side system prompt and only the current prompt (no history/RAG/CRM). It streams reasoning and final-answer text in separate SSE fields; the total generated-output cap is 4,096 tokens including up to 1,024 reasoning tokens. One generation at a time; prompt max 2,000 Unicode characters; per-IP 5/minute and 20/hour, global 100/hour. The route does not log prompt/generated-output content and does not use an app-level conversation database. Infrastructure logging/retention is unverified.
- Demo users must not submit personal or confidential data.
- Future commercial model base: Qwen-based open weights, fine-tuned for cybersecurity; not the demo model and not operational.
- EU AI Act: general-purpose AI category, not high-risk.
- Never published: business-model details (credits, margins), financial forecasts, competitor disparagement, hardware procurement status as a business plan.

## Brand Commitments

- Name: Tehisabiline / Tehisabiline OÜ. Logo: the "T" mark — keep (owner, 2026-10-11).
- Current homepage priority (owner, 2026-10-12): a larger, beautiful, prominent opening must name BOTH main offerings: cybersecurity audit/pentesting as one service family, and keeldudeta cyber-AI API as the other. Never substitute separate giant "Pentestimine" and "Küberaudit" labels for the two-offer headline or demote the API to a hidden note. Keep distinct calls to action, legal-use boundaries and explicit API development status. The interactive refusal-versus-answer demo belongs in the first viewport beside the headline; it plays once, can be replayed and respects reduced motion. Homepage copy must stay short and non-repetitive (owner, 2026-10-12): one clear two-offer message; long explanations, statistics and comparisons live on subpages. Preserve the blue/white identity and stable mobile navigation.
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
4. Do not frame Estonian hosting or data handling as current demo facts. Any hosting statement must distinguish the planned commercial API from the standalone uncensored-model demo and avoid unsupported server-location, logging, retention, or third-party processing claims.

## Accessibility & Inclusion

Estonian-language site (`lang="et"`) with long-form reading; WCAG AA contrast; keyboard navigation; reduced-motion, forced-colors and print support are already implemented and must be kept.
