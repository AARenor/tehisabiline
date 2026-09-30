# Tehisabiline SEO and accuracy repair

Date: 2026-09-30

## Objective

Improve Tehisabiline's search clarity and credibility by fixing verified factual, structural, and intent-alignment problems without adding speculative landing pages, invented business details, or ranking-oriented filler.

## Evidence

- A live crawl of all 7 sitemap pages returned HTTP 200, unique titles and descriptions, matching canonicals, valid JSON-LD, and no broken internal links.
- Mobile Lighthouse scores were 100 for SEO, accessibility, and best practices on every sitemap page. Performance was 100 except the homepage at 97 (LCP 2434 ms, CLS 0, TBT 73 ms).
- Sampled SearXNG/Bing and keyed searches returned no Tehisabiline results. This is a limited visibility signal, not proof of deindexing; repository history shows Search Console impressions on at least one query.
- Google Search Central says title links use both the `<title>` and the main visual heading. The homepage and `meist/` currently send mixed primary-title signals.
- Google retired FAQ rich results in May 2026 and removed their documentation in June 2026. It also states that `llms.txt` neither helps nor hurts Google visibility.
- `https://api.tehisabiline.ee/v1/chat/completions` currently returns HTTP 404, while the homepage presents it as a copyable API example.
- The homepage FAQ markup nests one `<details>` disclosure inside another, making one question depend on opening the previous question.
- The official Qwen sources confirm **Qwen3.8-27B**: the QwenLM repository records its 2026-08-14 release and the official Hugging Face card lists a 27B Apache-2.0 open-weight model. The site's vague “Qwen 27B” wording should become the exact current name, not be removed.
- `llms-full.txt` contains the `/kuberaudit/` canonical twice and has a stale review date.

## Design decisions

### 1. Align primary page intent

- Homepage: keep both core offers in the hero, but make the H1 explicitly cover “küberaudit” and “tsenseerimata küber-AI” so it agrees with the title and visible services.
- `meist/`: align title, Open Graph/Twitter title, structured-data name, and H1 around “AI konsultatsioon ja küberauditid Tallinnas”. Preserve the organization/about content and the private-AI explanation.
- Do not create new keyword landing pages in this change. The current constraint is credibility and external authority, not a lack of indexable HTML pages.

### 2. Correct Qwen wording with first-party evidence

- Replace “Qwen 27B tsenseerimata lineup” with the exact **Qwen3.8-27B** name on the homepage, model page, and use-case cross-link.
- Describe Qwen3.8-27B as the open-weight base model. Attribute Tehisabiline's planned refusal-free cybersecurity behavior to its own tuning and deployment policy, not to the upstream model.
- Replace unsupported broad “frontier-level” language with a restrained capability statement and a link to the official Qwen model card where appropriate.

### 3. Stop presenting a dead API as live

- Keep the integration example because it explains the intended OpenAI-compatible interface.
- Label it “planned interface example; API is not yet public”.
- Replace the dead Tehisabiline hostname and concrete model ID with explicit pilot placeholders. The actual endpoint and model name will be supplied with pilot access.
- Add a regression assertion so a copyable production endpoint cannot reappear before it is live.

### 4. Repair homepage FAQ structure

- Close every FAQ disclosure before opening the next one.
- Restore the missing visual expand indicator on the final FAQ item.
- Add a repository check that rejects nested `<details>` elements on every page.

### 5. Modernize SEO checks without deleting useful content

- Visible FAQ and process content stays because it helps users.
- `FAQPage` and `HowTo` may remain valid Schema.org data, but the test suite will stop requiring them as Google search features.
- Existing JSON-LD will still be parsed and checked for required core types, visible-question parity when present, valid dates, and resolvable local URLs.
- Add checks for nested disclosures, duplicate canonical entries in `llms-full.txt`, the exact Qwen name, and the absence of the currently dead API endpoint.

### 6. Repair machine-readable summaries

- Remove the duplicated `/kuberaudit/` entry from `llms-full.txt` and update its review date.
- Keep `llms.txt` files because other agents may use them, while making no ranking claim for them.
- Synchronize visible review dates, JSON-LD dates, article/social dates, and sitemap `lastmod` for every materially changed page.

## Files in scope

- `index.html`
- `meist/index.html`
- `mudelid/index.html`
- `kasutusjuhud/index.html`
- `llms-full.txt`
- `sitemap.xml`
- `tools/seo-check.mjs`
- Asset hashes only if a generated stylesheet changes

## Explicit non-goals

- No backlinks, outreach, paid actions, Google Business Profile, or Search Console actions.
- No changes to the contact-form relay.
- No invented registration data, staff biographies, customer claims, testimonials, benchmarks, or URLs.
- No redirects for the retained noindex service pages.
- No new service or English-language landing page in this repair.

## Verification and release

1. Add failing checks for nested FAQ markup, machine-summary duplication, exact model naming, and the dead API example.
2. Apply the minimum HTML and copy repairs.
3. Run `npm run test:seo`, JSON/config parse checks, and `git diff --check`.
4. Run desktop and 360 px Playwright checks for homepage FAQ behavior, title/H1 visibility, mobile navigation, overflow, console errors, and contact-form structure without submitting the form.
5. Run Lighthouse on changed public pages and require SEO/accessibility/best-practices 100 with no material performance regression.
6. Adversarial diff review; fix all P0/P1 findings.
7. Commit and push `master`, then verify changed HTML and assets on production.
8. Submit only changed sitemap URLs through the repository's IndexNow script after production verification.

## Done when

- Qwen references use the verified `Qwen3.8-27B` name and do not misattribute Tehisabiline-specific tuning to upstream Qwen.
- No copyable dead API hostname remains.
- No nested FAQ disclosure remains and the FAQ works by keyboard and pointer.
- Homepage and `meist/` primary title signals agree.
- Machine-readable summaries contain no duplicate canonical URLs and all modified dates agree.
- All repository, browser, Lighthouse, review, push, and live-production checks pass.
