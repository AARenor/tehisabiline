# What Google's documentation says as of 2026-10-28, and what it changes here

Source: `developers.google.com/search/docs` and `developers.google.com/search/updates`, read
directly on 2026-10-28. Every statement below is quoted from or attributed to a Google page; site
state was measured, not assumed.

## The AI-features guide (published May 2026, updated 2026-07-10)

`/search/docs/fundamentals/ai-optimization-guide`. Google's own words on what does **not** matter:

- **`llms.txt` and "special" AI markup**: *"You don't need to create new machine readable files,
  AI text files, markup, or Markdown to appear in Google Search (including its generative AI
  capabilities), as Google Search itself doesn't use them."* The June 15, 2026 changelog adds that
  keeping such files *"won't negatively or positively impact your visibility or rankings"*.
  → This site publishes `llms.txt` and `llms-full.txt`. Keep them for other agents and for the
  site's own index, but treat them as **zero** Google value. Both are `noindex` via `_headers`.
- **Chunking for AI**: no requirement. No page-length target. → Do not restructure pages into
  fragments or chase a word count.
- **Rewriting for AI / long-tail coverage**: *"you don't have to worry that you don't have enough
  'long-tail' keywords"*. → The next content batch does not need more phrase variants.
- **Inauthentic mentions**: not a shortcut. → No link-building theatre.
- **Structured data**: *"Structured data isn't required for generative AI search, and there's no
  special schema.org markup you need to add."* → Keep the existing graph; stop adding types that
  have no rich result.
- **What does matter**: pages must be *indexed and eligible for a snippet*; content must be
  non-commodity with a first-hand point of view; clear headings; real images and video.

**Eligibility setting, checked in the Search Console UI on this property:** Settings → Search
generative AI shows `Include my site's links and content in Search generative AI features` with the
`Default` badge — i.e. the site is included in AI Overviews, AI Mode and Discover AI features.
Nothing to change. Rolled out worldwide on 2026-08-31.

## Dead features this site still emits (harmless, but no longer worth investment)

| Feature | Status per Google docs | Site position |
| --- | --- | --- |
| FAQ rich result (`FAQPage`) | *"Removed documentation for the FAQ rich result feature … no longer shown in Google Search results"* (deprecation announced May 2026, in effect since 2026-05-07) | 61 pages carry `FAQPage`. Keep the **visible** FAQ (readers and passage selection use it); the JSON-LD earns nothing but costs nothing. Do not build new pages around FAQ rich results. |
| `HowTo` | Rich result retired earlier; no documentation left | 4 pages. Leave. |
| `WebApplication` | No Google rich result | 4 pages. Leave. |

The repo invariant that keeps JSON-LD FAQ answers byte-identical to the visible ones stays: it
protects the visible copy, which is what readers and answer engines actually read.

## What the Search Console reports say (read 2026-10-28)

| Report | Reading | Meaning |
| --- | --- | --- |
| Enhancements → Breadcrumbs | 49 valid, **0 invalid**, "no issues detected in the last 90 days" | the BreadcrumbList markup parses and is used; the 2026-10-28 rewrite of `/mudelid/` cannot regress it silently |
| Experience → Core Web Vitals | *"Not enough usage data in the last 90 days"* for mobile and desktop | CrUX has no field data at this traffic level, so **lab data is the only honest measure** (Lighthouse 100s). Nobody should report a field CWV score for this site. |
| Page indexing | 26 not indexed / 11 indexed, **last update 10/23/26**; 18 "Crawled – currently not indexed", 4 redirect, 3 404, 1 noindex | stale snapshot; URL Inspection of all 66 sitemap URLs returns 58 `Submitted and indexed`. Recheck after 29 Oct. |
| Insights (28 d) | 18 clicks (+200%), 460 impressions (+76%) | the trend is up from a tiny base; page titles shown are pre-deploy |

### The three 404s are real and one of them is not in this repo

Drilled from the Pages report: `https://api.tehisabiline.ee/v1` and
`https://api.tehisabiline.ee/v1/chat/completions` return 404 from a Cloudflare-proxied record that
still points at a removed Vercel deployment. Everything else Google listed is a working redirect
(`/ai-automatiseerimine/` → arle.top, `/en/ai-consulting/` → `/en/`, `www.` → apex, all verified
with `curl -o /dev/null -w '%{http_code} %{redirect_url}'`).

The fix is DNS, not markup: point `api.tehisabiline.ee` at the Pages project (or remove the
record, or add a Cloudflare Bulk Redirect for `/v1*` and `/v1/chat/completions*`). It cannot be
done from this repo, and the Cloudflare credential on this host is invalid.

## Changed on the strength of this reading

1. **Internal links, actually added** (the previous batch claimed this and did not do it):
   `/nis2/audit/` → `/nis2/toetus/` (EIS funds an audit up to €20 000, verified on that page),
   `/kuberaudit/` → `/nis2/toetus/`, `/artiklid/varunduse-taastetest/` → both sector pages
   (continuity differs by sector), `/artiklid/mfa-juurutamine/` → `/sektorid/energeetika/`
   (OT and maintainer access), `/meist/` → `/en/press/`. Editorial inbound: `/nis2/toetus/` 2 → 4,
   `/sektorid/energeetika/` 2 → 4, `/sektorid/tervishoid/` 1 → 2, `/en/press/` 2 → 3.
2. **Two original diagrams**, because Google asks for real images and the regulation pages had
   none: `assets/images/nis2-teavitus-ajajoon.svg` (24 h / 72 h / one month, on
   `/nis2/intsidendist-teatamine/`) and `assets/images/nis2-kohaldumine.svg` (the three-step scope
   decision, on `/nis2/`). Both are `<figure class="diagram">` with descriptive `alt`, intrinsic
   `width`/`height`, lazy loading and a caption; `.diagram` CSS keeps them inside the column at
   390 px (verified: `scrollWidth == innerWidth`).
3. No new FAQ-heavy spokes. The 2026 guidance on scaled content abuse and the FAQ deprecation both
   point away from that, and this site's own autocomplete evidence already showed the Estonian
   long tail is empty.

## Left alone deliberately

- `llms.txt` / `llms-full.txt`: no Google value, real value for other agents; already `noindex`.
- `FAQPage` / `HowTo` / `WebApplication` JSON-LD: no rich result, no penalty, zero maintenance cost
  to keep, churn to remove.
- `X-Robots-Tag: noindex` on feeds, sitemap and `entitymap.json`: keeps machine files out of the
  index without a robots.txt `Disallow`, which the repo test forbids because it would break asset
  fetching.
