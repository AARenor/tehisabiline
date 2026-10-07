import {existsSync, readFileSync} from "node:fs";
import {dirname, extname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://tehisabiline.ee";
const today = new Date().toISOString().slice(0, 10);
const expectedPages = [
    {
        file: "index.html",
        canonical: `${origin}/`,
        schemaTypes: ["Organization", "WebSite", "WebPage", "Service"],
        dateType: "WebPage",
        requiresOrganization: true
    },
    {
        file: "ai-automatiseerimine/index.html",
        canonical: `${origin}/ai-automatiseerimine/`,
        noindex: true,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "ai-chatbot/index.html",
        canonical: `${origin}/ai-chatbot/`,
        noindex: true,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "hinnajalgimine/index.html",
        canonical: `${origin}/hinnajalgimine/`,
        noindex: true,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "kasutusjuhud/index.html",
        canonical: `${origin}/kasutusjuhud/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "ItemList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "meist/index.html",
        canonical: `${origin}/meist/`,
        schemaTypes: ["Organization", "AboutPage", "BreadcrumbList"],
        dateType: "AboutPage",
        requiresOrganization: true,
        requiresPublishedDate: true
    },
    {
        file: "mudelid/index.html",
        canonical: `${origin}/mudelid/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "ai/index.html",
        canonical: `${origin}/ai/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "idufirmadele/index.html",
        canonical: `${origin}/idufirmadele/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "ai/seo/index.html",
        canonical: `${origin}/ai/seo/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "kuberaudit/index.html",
        canonical: `${origin}/kuberaudit/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "nis2/index.html",
        canonical: `${origin}/nis2/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "privaatsus/index.html",
        canonical: `${origin}/privaatsus/`,
        schemaTypes: ["WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    }
];
const expectedUrls = expectedPages.filter((page) => !page.noindex).map((page) => page.canonical);
const noindexUrls = expectedPages.filter((page) => page.noindex).map((page) => page.canonical);
const failures = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
const pageModifiedDates = new Map();

function assert(condition, message) {
    if (!condition) failures.push(message);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^$()|[\]{}\\]/g, "\\$&");
}

function tagWithAttr(html, tagName, attr, value) {
    const pattern = new RegExp(`<${tagName}\\s+[^>]*\\b${attr}=["']${escapeRegExp(value)}["'][^>]*>`, "i");
    return html.match(pattern)?.[0] || "";
}

function attrValue(tag, attr) {
    return tag.match(new RegExp(`\\b${attr}=["']([^"']+)["']`, "i"))?.[1] || "";
}

function metaValue(html, key) {
    const tag = tagWithAttr(html, "meta", "name", key) || tagWithAttr(html, "meta", "property", key);
    return attrValue(tag, "content");
}

function stripHtml(html) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&[a-z0-9#]+;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function detailsNesting(html) {
    let depth = 0;
    let maxDepth = 0;
    let minDepth = 0;
    for (const match of html.matchAll(/<\/?details\b[^>]*>/gi)) {
        if (match[0].startsWith("</")) depth--;
        else {
            depth++;
            maxDepth = Math.max(maxDepth, depth);
        }
        minDepth = Math.min(minDepth, depth);
    }
    return {depth, maxDepth, minDepth};
}

function resolveLocalPath(pathname) {
    const clean = decodeURIComponent(pathname.split("#")[0].split("?")[0]).replace(/^\//, "");
    if (!clean) return join(root, "index.html");
    const direct = join(root, clean);
    if (existsSync(direct) && extname(direct)) return direct;
    if (existsSync(direct) && !extname(direct)) return join(direct, "index.html");
    if (clean.endsWith("/")) return join(root, clean, "index.html");
    return direct;
}

function localTargetExists(value) {
    if (!value || value.startsWith("#") || /^(mailto:|tel:|data:|javascript:)/i.test(value)) return true;
    if (/^https?:\/\//i.test(value)) {
        const url = new URL(value);
        if (url.origin !== origin) return true;
        return existsSync(resolveLocalPath(url.pathname));
    }
    return existsSync(resolveLocalPath(value));
}

function validateLocalReferences(html, label) {
    const refs = [...html.matchAll(/<(?:a|img|script|link|source)\b[^>]*\b(?:href|src)=["']([^"']+)["'][^>]*>/gi)]
        .map((match) => match[1]);
    for (const tag of [...html.matchAll(/<source\b[^>]*\bsrcset=["']([^"']+)["'][^>]*>/gi)]) {
        for (const entry of tag[1].split(",")) {
            const url = entry.trim().split(/\s+/)[0];
            if (url) refs.push(url);
        }
    }
    for (const ref of refs) {
        assert(localTargetExists(ref), `${label}: local reference does not resolve: ${ref}`);
    }

    const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
    const fragmentLinks = [...html.matchAll(/<a\b[^>]*\bhref=["']#([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
    for (const fragment of fragmentLinks) {
        assert(ids.has(fragment), `${label}: fragment link has no target: #${fragment}`);
    }
}

function validateFontPreloads(html, label) {
    const tags = html.match(/<link[^>]*preload[^>]*>/gi) || [];
    const fonts = [];
    for (const tag of tags) {
        const href = attrValue(tag, "href");
        if (href.endsWith(".woff2")) fonts.push(href);
    }
    if (!fonts.length) return;
    const cssTags = html.match(/<link[^>]*stylesheet[^>]*>/gi) || [];
    let cssText = "";
    for (const tag of cssTags) {
        try {
            const u = new URL(attrValue(tag, "href"), origin);
            if (u.origin !== origin) continue;
            cssText += readFileSync(resolveLocalPath(u.pathname), "utf8");
        } catch {
            continue;
        }
    }
    for (const font of fonts) {
        const base = font.split("/").pop().split("?")[0];
        assert(cssText.includes(base), label + ": preloaded font is not used by any stylesheet: " + base);
    }
}

// Ligatures present in assets/fonts/material-symbols-outlined.woff2 (subset of
// Google's Material Symbols Outlined). Any icon name used in HTML must be in
// this list, otherwise it renders as raw text. Regenerate the subset if a new
// icon is needed.
const COVERED_ICONS = new Set([
    "add", "arrow_forward", "bolt", "business_center", "check_circle",
    "check_circle_filled", "check_circle_outline", "clear", "close", "database",
    "email", "fact_check", "fmd_good", "forum", "language", "library_books",
    "location_on", "location_pin", "mail", "mail_outline", "markunread", "menu",
    "new_releases", "place", "question_answer", "rocket_launch", "room",
    "search", "speed", "task_alt", "verified",
]);
function validateMaterialIcons(html, label) {
    const names = [...html.matchAll(/material-symbols-outlined[^>]*>([^<]+)</gi)]
        .map((m) => m[1].trim())
        .filter(Boolean);
    for (const name of names) {
        assert(COVERED_ICONS.has(name), `${label}: icon "${name}" is not in the icon font subset and would render as raw text.`);
    }
}

for (const page of expectedPages) {
    const label = page.file;
    const filePath = join(root, page.file);
    assert(existsSync(filePath), `${label}: page file is missing.`);
    if (!existsSync(filePath)) continue;

    const html = readFileSync(filePath, "utf8");
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || "";
    const description = metaValue(html, "description");
    const canonical = attrValue(tagWithAttr(html, "link", "rel", "canonical"), "href");
    const h1s = [...html.matchAll(/<h1\b[^>]*>/gi)];
    const lang = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1] || "";

    assert(lang === "et", `${label}: html lang must be et.`);
    assert(Boolean(title), `${label}: title is missing.`);
    assert(Boolean(description), `${label}: meta description is missing.`);
    assert(canonical === page.canonical, `${label}: canonical must be ${page.canonical}.`);
    assert(h1s.length === 1, `${label}: expected exactly one H1, found ${h1s.length}.`);
    assert(!/<meta\s+[^>]*name=["']keywords["']/i.test(html), `${label}: obsolete meta keywords tag should not be present.`);
    assert(!html.includes("cdn.tailwindcss.com"), `${label}: Tailwind runtime CDN must not be used.`);
    assert(!html.includes("hero-gradient.js") && !html.includes("hero-canvas"), `${label}: CPU-heavy canvas hero must not be loaded.`);
    assert(!/(80% vähem|-80%|säästab kuni 80%|98\/100)/i.test(stripHtml(html)), `${label}: contains an unsupported performance claim.`);
    assert(metaValue(html, "robots").includes("max-image-preview:large"), `${label}: robots meta should permit large image previews.`);
    const robotsParts = metaValue(html, "robots").split(/\s*,\s*/);
    if (page.noindex) assert(robotsParts.includes("noindex"), `${label}: retired page must use noindex.`);
    else assert(!robotsParts.includes("noindex"), `${label}: indexable page must not use noindex.`);

    for (const key of ["og:type", "og:locale", "og:site_name", "og:title", "og:description", "og:url", "og:image", "og:image:alt"]) {
        assert(Boolean(metaValue(html, key)), `${label}: ${key} metadata is missing.`);
    }
    assert(metaValue(html, "og:url") === page.canonical, `${label}: og:url must match canonical.`);
    assert(metaValue(html, "og:image") === `${origin}/assets/brand/tehisabiline-og.png`, `${label}: expected the 1200×630 social image.`);
    assert(metaValue(html, "twitter:card") === "summary_large_image", `${label}: Twitter card must use summary_large_image.`);
    assert(Boolean(metaValue(html, "twitter:title")) && Boolean(metaValue(html, "twitter:description")) && Boolean(metaValue(html, "twitter:image")), `${label}: Twitter metadata is incomplete.`);

    assert(!seenTitles.has(title), `${label}: title duplicates ${seenTitles.get(title)}.`);
    assert(!seenDescriptions.has(description), `${label}: meta description duplicates ${seenDescriptions.get(description)}.`);
    seenTitles.set(title, label);
    seenDescriptions.set(description, label);

    const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    assert(duplicateIds.length === 0, `${label}: duplicate HTML IDs: ${[...new Set(duplicateIds)].join(", ")}.`);

    for (const img of [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0])) {
        assert(/\balt=["'][^"']*["']/i.test(img), `${label}: image is missing alt text.`);
        assert(Boolean(attrValue(img, "width")) && Boolean(attrValue(img, "height")), `${label}: image should have width and height to prevent layout shift.`);
    }

    const jsonLdBlocks = [...html.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
        .map((match) => match[1].trim());
    assert(jsonLdBlocks.length > 0, `${label}: JSON-LD is missing.`);
    for (const block of jsonLdBlocks) {
        try {
            const data = JSON.parse(block);
            const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
            const types = graph.flatMap((item) => Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]]);
            for (const requiredType of page.schemaTypes) {
                assert(types.includes(requiredType), `${label}: ${requiredType} schema is missing.`);
            }

            if (page.requiresOrganization) {
                const organization = graph.find((item) => item["@type"] === "Organization");
                const organizationLogo = typeof organization?.logo === "string" ? organization.logo : organization?.logo?.url;
                assert(organizationLogo === `${origin}/assets/brand/logo-512.png`, `${label}: Organization logo must use the 512×512 asset.`);
                assert(organization?.name === "Tehisabiline OÜ", `${label}: Organization name must be Tehisabiline OÜ.`);
                assert(organization?.url === `${origin}/`, `${label}: Organization URL must use the canonical homepage.`);
                assert(Array.isArray(organization?.sameAs) && organization.sameAs.length > 0, label + ": Organization must list sameAs profiles.");
            }

            const article = graph.find((item) => item["@type"] === "Article" || (Array.isArray(item["@type"]) && item["@type"].includes("Article")));
            if (article) {
                const articleImage = typeof article.image === "string" ? article.image : article.image?.url;
                assert(articleImage === origin + "/assets/brand/tehisabiline-og.png", label + ": Article image must use the 1200x630 social asset.");
                for (const role of ["author", "publisher"]) {
                    if (article[role]) assert(article[role]["@type"] === "Organization", label + ": Article role must be typed.");
                }
                assert(metaValue(html, "og:type") === "article", label + ": Article pages must declare og:type article.");
                assert(html.includes("article:published_time") && html.includes("article:modified_time"), label + ": Article pages must expose publish dates.");
                assert(metaValue(html, "article:modified_time") === article.dateModified, label + ": social modified date must match schema.");
                assert(metaValue(html, "article:published_time") === article.datePublished, label + ": social publish date must match schema.");
            }

            const faqPage = graph.find((item) => item["@type"] === "FAQPage" || (Array.isArray(item["@type"]) && item["@type"].includes("FAQPage")));
            if (faqPage) {
                const visibleText = stripHtml(html);
                for (const q of faqPage.mainEntity || []) {
                    assert(q.name && visibleText.includes(q.name), label + ": FAQ question missing from visible content.");
                }
            }
            const schemaUrls = [];
            for (const raw of block.match(/https?:\/\/[^\s"'<>]+/g) || []) schemaUrls.push(raw);
            for (const ref of schemaUrls) {
                try {
                    const u = new URL(ref);
                    if (u.origin !== origin) continue;
                    assert(localTargetExists(u.pathname), label + ": schema URL does not resolve: " + u.pathname);
                } catch {
                    continue;
                }
            }
            const datedEntity = graph.find((item) => item["@type"] === page.dateType);
            const dateModified = datedEntity?.dateModified || "";
            assert(/^\d{4}-\d{2}-\d{2}$/.test(dateModified), `${label}: ${page.dateType} dateModified must use YYYY-MM-DD.`);
            assert(!dateModified || dateModified <= today, `${label}: WebPage dateModified cannot be in the future: ${dateModified}.`);
            assert(!dateModified || html.includes(`<time datetime="${dateModified}">`), `${label}: visible update date must match structured data.`);
            if (page.requiresPublishedDate) {
                const datePublished = datedEntity?.datePublished || "";
                assert(/^\d{4}-\d{2}-\d{2}$/.test(datePublished), `${label}: ${page.dateType} datePublished must use YYYY-MM-DD.`);
                assert(!datePublished || datePublished <= dateModified, `${label}: datePublished cannot be later than dateModified.`);
            }
            pageModifiedDates.set(page.canonical, dateModified);
        } catch (error) {
            failures.push(`${label}: JSON-LD is invalid: ${error.message}`);
        }
    }

    validateLocalReferences(html, label);
    validateFontPreloads(html, label);
    validateMaterialIcons(html, label);
    assert(html.includes("mailto:tehisabiline@gmail.com"), label + ": contact email must be present.");
    assert(html.includes("/privaatsus/"), label + ": privacy link must be present.");
    assert(!html.includes("http://"), label + ": insecure http reference found.");
    assert(canonical.endsWith("/"), label + ": canonical must end with trailing slash.");
    assert(metaValue(html, "og:url") === canonical, label + ": og:url must match canonical.");
    assert(metaValue(html, "twitter:title") === metaValue(html, "og:title"), label + ": twitter:title must match og:title.");
    assert(title.length <= 60, label + ": title exceeds 60 characters.");
    assert(description.length >= 50 && description.length <= 160, label + ": meta description must be 50-160 characters.");
    const details = detailsNesting(html);
    assert(details.maxDepth <= 1, `${label}: FAQ disclosures must not be nested.`);
    assert(details.depth === 0 && details.minDepth === 0, `${label}: FAQ disclosure tags must be balanced.`);
    assert(!/api\.tehisabiline\.ee/i.test(html), `${label}: must not present the unavailable API hostname as live.`);
}

const homeHtml = readFileSync(join(root, "index.html"), "utf8");
const homeH1 = stripHtml(homeHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
assert(homeH1.includes("Küberaudit") && homeH1.includes("küber-AI"), "Homepage H1 must name both küberaudit and küber-AI.");
assert(homeHtml.includes("API pole veel avalik"), "Homepage API example must say that the API is not yet public.");
for (const serviceUrl of expectedUrls.slice(1)) {
    const pathname = new URL(serviceUrl).pathname;
    assert(new RegExp(`<a\\b[^>]*href=["']${escapeRegExp(pathname)}["']`, "i").test(homeHtml), `Homepage must link directly to ${pathname}.`);
}

for (const page of expectedPages) {
    const html = readFileSync(join(root, page.file), "utf8");
    if (page.canonical !== `${origin}/meist/`) {
        assert(/<a\b[^>]*href=["']\/meist\/["']/i.test(html), `${page.file}: must link to the organization and editorial page.`);
    }
    if (page.canonical !== `${origin}/kasutusjuhud/`) {
        assert(/<a\b[^>]*href=["']\/kasutusjuhud\/["']/i.test(html), `${page.file}: must link to the cyber-AI use-cases guide.`);
    }
}

const guideHtml = readFileSync(join(root, "kasutusjuhud/index.html"), "utf8");
for (const source of [
    "https://attack.mitre.org/",
    "https://genai.owasp.org/llm-top-10/",
    "https://www.ncsc.gov.uk/blogs/managing-the-cyber-risk-of-agentic-ai"
]) {
    assert(guideHtml.includes(`href="${source}"`), `Use-cases guide must retain its primary source link: ${source}`);
}

const aboutHtml = readFileSync(join(root, "meist/index.html"), "utf8");
const aboutH1 = stripHtml(aboutHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
assert(aboutH1.includes("AI konsultatsioon") && aboutH1.includes("küberaudit") && /\bTallinnas\b/.test(aboutH1), "Meist H1 must align with its Tallinn AI-consultation and küberaudit title intent.");

const modelsHtml = readFileSync(join(root, "mudelid/index.html"), "utf8");
assert(modelsHtml.includes("API pole veel avalik"), "Models API example must say that the API is not yet public.");

for (const file of ["index.html", "mudelid/index.html", "kasutusjuhud/index.html"]) {
    const html = readFileSync(join(root, file), "utf8");
    assert(html.includes("Qwen3.8-27B"), `${file}: must use the verified Qwen3.8-27B model name.`);
    assert(!/Qwen 27B tsenseerimata lineup/i.test(html), `${file}: must not use the stale vague Qwen 27B lineup wording.`);
}

const auditHtml = readFileSync(join(root, "kuberaudit/index.html"), "utf8");
assert(/<body\b[^>]*class=["'][^"']*\baudit-page\b/i.test(auditHtml), "Küberaudit must use its report-style page design.");
assert(auditHtml.includes('href="/kuberaudit/kuberaudit.css'), "Küberaudit must load its page-specific stylesheet.");
for (const genericClass of ["eyebrow", "content-grid", "info-card", "step-grid", "number-card", "faq-card", "related-card", "service-cta"]) {
    assert(!new RegExp(`class=["'][^"']*\\b${genericClass}\\b`, "i").test(auditHtml), `Küberaudit must not use the generic ${genericClass} pattern.`);
}

for (const requiredFile of [
    "robots.txt",
    "sitemap.xml",
    "site.webmanifest",
    "vercel.json",
    "404.html",
    "llms.txt",
    "llms-full.txt",
    "5f126675c51465984e48a3d63ec60940.txt",
    ".well-known/security.txt",
    "assets/brand/tehisabiline-og.png",
    "assets/brand/logo-512.png",
    "assets/css/tailwind.min.css",
    ".nojekyll"
]) {
    assert(existsSync(join(root, requiredFile)), `${requiredFile} is missing.`);
}

const robots = readFileSync(join(root, "robots.txt"), "utf8");
for (const crawler of ["OAI-SearchBot", "GPTBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User", "ClaudeBot", "Google-Extended"]) {
    assert(new RegExp(`User-agent:\\s*${escapeRegExp(crawler)}[\\s\\S]*?Allow:\\s*/(?:\\s|$)`, "i").test(robots), `robots.txt should explicitly allow ${crawler}.`);
}
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), "robots.txt must point to the canonical sitemap.");

const securityTxt = readFileSync(join(root, ".well-known/security.txt"), "utf8");
const securityExpires = (securityTxt.match(/^Expires:\s*(\S+)/m) || [])[1] || "";
assert(securityExpires > today, "security.txt Expires must be a future date.");

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => ({
    loc: match[1].match(/<loc>([^<]+)<\/loc>/)?.[1] || "",
    lastmod: match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || ""
}));
const sitemapUrls = sitemapEntries.map((entry) => entry.loc);
assert(JSON.stringify(sitemapUrls) === JSON.stringify(expectedUrls), `Sitemap URLs differ from expected canonical URLs: ${sitemapUrls.join(", ")}.`);
for (const noindexed of noindexUrls) assert(!sitemapUrls.includes(noindexed), `Sitemap must not list noindexed URL: ${noindexed}.`);
const retiredHardRedirect = [
    {path: "ai-automatiseerimise-naited", successor: "/kasutusjuhud/"},
    {path: "privaat-ai", successor: "/mudelid/"}
];
for (const retired of retiredHardRedirect) {
    assert(!existsSync(join(root, retired.path, "index.html")), `${retired.path}/index.html must not exist: a static file at that path shadows the Vercel redirect and turns the permanent redirect back into a noindex HTML page.`);
    assert(!existsSync(join(root, `${retired.path}.html`)), `${retired.path}.html must not exist: it would shadow the Vercel redirect.`);
    assert(!sitemapUrls.includes(`${origin}/${retired.path}/`), `Sitemap must not list redirected URL: ${origin}/${retired.path}/.`);
}
for (const {loc, lastmod} of sitemapEntries) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(lastmod), `Sitemap lastmod must use YYYY-MM-DD for ${loc}.`);
    assert(!lastmod || lastmod <= today, `Sitemap lastmod cannot be in the future: ${lastmod}.`);
    assert(pageModifiedDates.get(loc) === lastmod, `Sitemap lastmod must match WebPage dateModified for ${loc}.`);
}

const llms = readFileSync(join(root, "llms.txt"), "utf8");
for (const url of expectedUrls) {
    assert(llms.includes(url), `llms.txt should link to ${url}.`);
}
assert(llms.includes(`${origin}/llms-full.txt`), "llms.txt should link to llms-full.txt.");

const llmsFull = readFileSync(join(root, "llms-full.txt"), "utf8");
const canonicalSection = llmsFull.split("## Canonical links")[1]?.split("\n## ")[0] || "";
const canonicalLinks = [...canonicalSection.matchAll(/^\s*-\s+(https:\/\/tehisabiline\.ee\/[^\s]*)$/gm)].map((match) => match[1]);
assert(canonicalLinks.length === new Set(canonicalLinks).size, "llms-full.txt canonical links must be unique.");
assert(canonicalLinks.length === expectedUrls.length && expectedUrls.every((url) => canonicalLinks.includes(url)), "llms-full.txt canonical links must list exactly the indexable sitemap URLs.");
const llmsReviewed = llmsFull.match(/^Last materially reviewed:\s*(\S+)/m)?.[1] || "";
const newestPageDate = [...pageModifiedDates.values()].sort().at(-1) || "";
assert(/^\d{4}-\d{2}-\d{2}$/.test(llmsReviewed) && llmsReviewed <= today, "llms-full.txt review date must be a valid non-future YYYY-MM-DD date.");
assert(llmsReviewed >= newestPageDate, "llms-full.txt review date must cover the newest indexable page update.");

const homepageCss = readFileSync(join(root, "homepage.css"), "utf8");
assert(!homepageCss.includes("api.tehisabiline.ee"), "homepage.css must not preserve the unavailable API hostname, even in comments.");

const indexNowKey = readFileSync(join(root, "5f126675c51465984e48a3d63ec60940.txt"), "utf8").trim();
assert(indexNowKey === "5f126675c51465984e48a3d63ec60940", "IndexNow key file content must match its filename.");

const notFoundHtml = readFileSync(join(root, "404.html"), "utf8");
assert(metaValue(notFoundHtml, "robots").split(/\s*,\s*/).includes("noindex"), "404.html must use noindex.");
assert([...notFoundHtml.matchAll(/<h1\b[^>]*>/gi)].length === 1, "404.html must contain exactly one H1.");
validateLocalReferences(notFoundHtml, "404.html");

try {
    const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
    assert(vercel.trailingSlash === true, "Vercel must normalize directory URLs to the trailing-slash canonicals.");
    for (const retired of retiredHardRedirect) {
        const rules = (vercel.redirects || []).filter((rule) => rule.source === `/${retired.path}/`);
        assert(rules.some((rule) => rule.destination === retired.successor && rule.permanent === true), `vercel.json must permanently redirect /${retired.path}/ to ${retired.successor}.`);
        // A bare "/:path*" source never matches once trailingSlash has normalized the
        // path; the source has to be written "/:path*/". Verified against Vercel: the
        // bare form 404s nested legacy URLs, the trailing-slash form redirects them.
        assert((vercel.redirects || []).some((rule) => rule.source === `/${retired.path}/:path*/` && rule.destination === retired.successor), `vercel.json must redirect nested legacy URLs via "/${retired.path}/:path*/" (note the trailing slash after *); the bare "/:path*" form silently 404s.`);
    }
} catch (error) {
    failures.push(`vercel.json is invalid JSON: ${error.message}`);
}

try {
    const manifest = JSON.parse(readFileSync(join(root, "site.webmanifest"), "utf8"));
    assert(manifest.name === "Tehisabiline OÜ", "Manifest should use the full organization name.");
    assert(manifest.lang === "et", "Manifest language should be Estonian.");
    assert(manifest.start_url === "/", "Manifest start_url should be the canonical root.");
    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, "Manifest should define all favicon sizes.");
    for (const icon of manifest.icons || []) {
        assert(localTargetExists(icon.src), `Manifest icon does not exist: ${icon.src}`);
    }
} catch (error) {
    failures.push(`site.webmanifest is invalid JSON: ${error.message}`);
}

if (failures.length) {
    console.error(`SEO check failed with ${failures.length} issue(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
}

console.log(`SEO check passed for ${expectedUrls.length} indexable and ${noindexUrls.length} noindex pages.`);
