import {existsSync, readFileSync} from "node:fs";
import {dirname, extname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://tehisabiline.ee";
const today = new Date().toISOString().slice(0, 10);
const expectedPages = [
    {file: "index.html", canonical: `${origin}/`, breadcrumb: false},
    {file: "ai-automatiseerimine/index.html", canonical: `${origin}/ai-automatiseerimine/`, breadcrumb: true},
    {file: "ai-chatbot/index.html", canonical: `${origin}/ai-chatbot/`, breadcrumb: true},
    {file: "hinnajalgimine/index.html", canonical: `${origin}/hinnajalgimine/`, breadcrumb: true}
];
const expectedUrls = expectedPages.map((page) => page.canonical);
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
    const refs = [...html.matchAll(/<(?:a|img|script|link)\b[^>]*\b(?:href|src)=["']([^"']+)["'][^>]*>/gi)]
        .map((match) => match[1]);
    for (const ref of refs) {
        assert(localTargetExists(ref), `${label}: local reference does not resolve: ${ref}`);
    }

    const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
    const fragmentLinks = [...html.matchAll(/<a\b[^>]*\bhref=["']#([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
    for (const fragment of fragmentLinks) {
        assert(ids.has(fragment), `${label}: fragment link has no target: #${fragment}`);
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
            assert(types.includes("Organization"), `${label}: Organization schema is missing.`);
            assert(types.includes("WebSite"), `${label}: WebSite schema is missing.`);
            assert(types.includes("WebPage"), `${label}: WebPage schema is missing.`);
            assert(types.includes("Service"), `${label}: Service schema is missing.`);
            if (page.breadcrumb) assert(types.includes("BreadcrumbList"), `${label}: BreadcrumbList schema is missing.`);
            const organization = graph.find((item) => item["@type"] === "Organization");
            const organizationLogo = typeof organization?.logo === "string" ? organization.logo : organization?.logo?.url;
            assert(organizationLogo === `${origin}/assets/brand/logo-512.png`, `${label}: Organization logo must use the 512×512 asset.`);
            const webPage = graph.find((item) => item["@type"] === "WebPage");
            const dateModified = webPage?.dateModified || "";
            assert(/^\d{4}-\d{2}-\d{2}$/.test(dateModified), `${label}: WebPage dateModified must use YYYY-MM-DD.`);
            assert(!dateModified || dateModified <= today, `${label}: WebPage dateModified cannot be in the future: ${dateModified}.`);
            pageModifiedDates.set(page.canonical, dateModified);
        } catch (error) {
            failures.push(`${label}: JSON-LD is invalid: ${error.message}`);
        }
    }

    validateLocalReferences(html, label);
}

const homeHtml = readFileSync(join(root, "index.html"), "utf8");
for (const serviceUrl of expectedUrls.slice(1)) {
    const pathname = new URL(serviceUrl).pathname;
    assert(new RegExp(`<a\\b[^>]*href=["']${escapeRegExp(pathname)}["']`, "i").test(homeHtml), `Homepage must link directly to ${pathname}.`);
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
    "assets/brand/tehisabiline-og.png",
    "assets/brand/logo-512.png",
    "assets/css/tailwind.min.css",
    "vercel.json",
    ".nojekyll"
]) {
    assert(existsSync(join(root, requiredFile)), `${requiredFile} is missing.`);
}

const robots = readFileSync(join(root, "robots.txt"), "utf8");
for (const crawler of ["OAI-SearchBot", "GPTBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User", "ClaudeBot", "Google-Extended"]) {
    assert(new RegExp(`User-agent:\\s*${escapeRegExp(crawler)}[\\s\\S]*?Allow:\\s*/(?:\\s|$)`, "i").test(robots), `robots.txt should explicitly allow ${crawler}.`);
}
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), "robots.txt must point to the canonical sitemap.");

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => ({
    loc: match[1].match(/<loc>([^<]+)<\/loc>/)?.[1] || "",
    lastmod: match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || ""
}));
const sitemapUrls = sitemapEntries.map((entry) => entry.loc);
assert(JSON.stringify(sitemapUrls) === JSON.stringify(expectedUrls), `Sitemap URLs differ from expected canonical URLs: ${sitemapUrls.join(", ")}.`);
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

const indexNowKey = readFileSync(join(root, "5f126675c51465984e48a3d63ec60940.txt"), "utf8").trim();
assert(indexNowKey === "5f126675c51465984e48a3d63ec60940", "IndexNow key file content must match its filename.");

const notFoundHtml = readFileSync(join(root, "404.html"), "utf8");
assert(metaValue(notFoundHtml, "robots").split(/\s*,\s*/).includes("noindex"), "404.html must use noindex.");
assert([...notFoundHtml.matchAll(/<h1\b[^>]*>/gi)].length === 1, "404.html must contain exactly one H1.");
validateLocalReferences(notFoundHtml, "404.html");

try {
    const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
    assert(vercel.trailingSlash === true, "Vercel must normalize directory URLs to the trailing-slash canonicals.");
} catch (error) {
    failures.push(`vercel.json is invalid JSON: ${error.message}`);
}

try {
    const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
    assert(vercel.trailingSlash === true, "Vercel must redirect extensionless paths to trailing-slash canonicals.");
} catch (error) {
    failures.push(`vercel.json is invalid JSON: ${error.message}`);
}

try {
    const manifest = JSON.parse(readFileSync(join(root, "site.webmanifest"), "utf8"));
    assert(manifest.name === "Tehisabiline ÕF", "Manifest should use the full organization name.");
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

console.log(`SEO check passed for ${expectedPages.length} indexable pages.`);
