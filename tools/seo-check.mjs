import {existsSync, readdirSync, readFileSync} from "node:fs";
import {dirname, extname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://tehisabiline.ee";
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Tallinn", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const contactEmail = "tehisabiline@gmail.com";
const homepageNodeIds = [`${origin}/#organization`, `${origin}/#website`];
const MIN_MAIN_INTERNAL_LINKS = 3;
// Search engines and AI answer/assistant agents robots.txt must name with an explicit Allow.
const allowedCrawlers = [
    "Googlebot", "Bingbot", "Applebot", "DuckDuckBot",
    "OAI-SearchBot", "GPTBot", "ChatGPT-User",
    "PerplexityBot", "Perplexity-User",
    "Claude-SearchBot", "Claude-User", "ClaudeBot",
    "Google-Extended", "Applebot-Extended", "Amazonbot", "DuckAssistBot",
    "Meta-ExternalAgent", "Meta-ExternalFetcher", "MistralAI-User", "YouBot"
];
const expectedPages = [
    {
        file: "index.html",
        canonical: `${origin}/`,
        schemaTypes: ["Organization", "WebSite", "WebPage", "Service"],
        dateType: "WebPage",
        requiresOrganization: true
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
        file: "saidikaart/index.html",
        canonical: `${origin}/saidikaart/`,
        schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
        dateType: "CollectionPage",
        requiresPublishedDate: true
    },
    {
        file: "viitamine/index.html",
        canonical: `${origin}/viitamine/`,
        schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
        dateType: "CollectionPage",
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
        file: "kuberaudit/index.html",
        canonical: `${origin}/kuberaudit/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "pentestimine/index.html",
        canonical: `${origin}/pentestimine/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "tlpt/index.html",
        canonical: `${origin}/tlpt/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "dora/index.html",
        canonical: `${origin}/dora/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "regulatsioonid/index.html",
        canonical: `${origin}/regulatsioonid/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "en/index.html",
        canonical: `${origin}/en/`,
        lang: "en",
        schemaTypes: ["Service", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresOrganization: true
    },
    {
        file: "en/regulations/index.html",
        canonical: `${origin}/en/regulations/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/nis2/registration/index.html",
        canonical: `${origin}/en/nis2/registration/`,
        lang: "en",
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "en/nis2/fines/index.html",
        canonical: `${origin}/en/nis2/fines/`,
        lang: "en",
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "en/nis2/incident-reporting/index.html",
        canonical: `${origin}/en/nis2/incident-reporting/`,
        lang: "en",
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "en/nis2/audit/index.html",
        canonical: `${origin}/en/nis2/audit/`,
        lang: "en",
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "en/nis2/index.html",
        canonical: `${origin}/en/nis2/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage", "Service"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/cra/index.html",
        canonical: `${origin}/en/cra/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage", "Service"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/dora/audit/index.html",
        canonical: `${origin}/en/dora/audit/`,
        lang: "en",
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "en/dora/register/index.html",
        canonical: `${origin}/en/dora/register/`,
        lang: "en",
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "en/dora/index.html",
        canonical: `${origin}/en/dora/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage", "Service"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/ai-act/index.html",
        canonical: `${origin}/en/ai-act/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage", "Service"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/sbom/index.html",
        canonical: `${origin}/en/sbom/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/e-its/index.html",
        canonical: `${origin}/en/e-its/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/pentesting/index.html",
        canonical: `${origin}/en/pentesting/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/security-audit/index.html",
        canonical: `${origin}/en/security-audit/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/iso-27001/index.html",
        canonical: `${origin}/en/iso-27001/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "en/press/index.html",
        canonical: `${origin}/en/press/`,
        schemaTypes: ["Organization", "Person", "WebSite", "AboutPage", "BreadcrumbList"],
        dateType: "AboutPage",
        lang: "en",
        requiresPublishedDate: true
    },
    {
        file: "ai-act/index.html",
        canonical: `${origin}/ai-act/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "sbom/index.html",
        canonical: `${origin}/sbom/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "cra/index.html",
        canonical: `${origin}/cra/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "iso-27001/index.html",
        canonical: `${origin}/iso-27001/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "dora/audit/index.html",
        canonical: `${origin}/dora/audit/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "dora/teaberegister/index.html",
        canonical: `${origin}/dora/teaberegister/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "artiklid/index.html",
        canonical: `${origin}/artiklid/`,
        schemaTypes: ["CollectionPage", "BreadcrumbList", "ItemList"],
        dateType: "CollectionPage",
        requiresPublishedDate: true
    },
    {
        file: "artiklid/varunduse-taastetest/index.html",
        canonical: `${origin}/artiklid/varunduse-taastetest/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "artiklid/nis2-tarneahel/index.html",
        canonical: `${origin}/artiklid/nis2-tarneahel/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "artiklid/mfa-juurutamine/index.html",
        canonical: `${origin}/artiklid/mfa-juurutamine/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "artiklid/nis2-juhatus/index.html",
        canonical: `${origin}/artiklid/nis2-juhatus/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "artiklid/kuberriskide-register/index.html",
        canonical: `${origin}/artiklid/kuberriskide-register/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "e-its/index.html",
        canonical: `${origin}/e-its/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "ai-turvatestimine/index.html",
        canonical: `${origin}/ai-turvatestimine/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "pentestimine/naidisraport/index.html",
        canonical: `${origin}/pentestimine/naidisraport/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "api-turvatestimine/index.html",
        canonical: `${origin}/api-turvatestimine/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "api-turvatestimine/kontrollnimekiri/index.html",
        canonical: `${origin}/api-turvatestimine/kontrollnimekiri/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "veebirakenduse-turvatestimine/index.html",
        canonical: `${origin}/veebirakenduse-turvatestimine/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList"],
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
        file: "koolitus/index.html",
        canonical: `${origin}/koolitus/`,
        schemaTypes: ["Service", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresOrganization: true
    },
    {
        file: "nis2/kontrollnimekiri/index.html",
        canonical: `${origin}/nis2/kontrollnimekiri/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "nis2/intsidendist-teatamine/index.html",
        canonical: `${origin}/nis2/intsidendist-teatamine/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "nis2/toetus/index.html",
        canonical: `${origin}/nis2/toetus/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "nis2/trahvid/index.html",
        canonical: `${origin}/nis2/trahvid/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        lang: "et",
        requiresPublishedDate: true
    },
    {
        file: "nis2/registreerimine/index.html",
        canonical: `${origin}/nis2/registreerimine/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        lang: "et",
        requiresPublishedDate: true
    },
    {
        file: "sektorid/finants/index.html",
        canonical: `${origin}/sektorid/finants/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "sektorid/tervishoid/index.html",
        canonical: `${origin}/sektorid/tervishoid/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "sektorid/index.html",
        canonical: `${origin}/sektorid/`,
        schemaTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
        dateType: "CollectionPage",
        requiresPublishedDate: true
    },
    {
        file: "sektorid/energeetika/index.html",
        canonical: `${origin}/sektorid/energeetika/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        requiresPublishedDate: true
    },
    {
        file: "nis2/audit/index.html",
        canonical: `${origin}/nis2/audit/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "FAQPage"],
        dateType: "WebPage",
        lang: "et",
        requiresPublishedDate: true
    },
    {
        file: "sonastik/index.html",
        canonical: `${origin}/sonastik/`,
        schemaTypes: ["Article", "WebPage", "BreadcrumbList", "DefinedTermSet"],
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

function validateBrandImage(value, label, width, height) {
    try {
        const url = new URL(value);
        assert(url.origin === origin, `${label}: brand image must be hosted on the canonical origin.`);
        if (url.origin !== origin) return;
        const file = resolveLocalPath(url.pathname);
        assert(existsSync(file), `${label}: brand image file is missing.`);
        if (!existsSync(file)) return;
        const bytes = readFileSync(file);
        const png = bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
        assert(png, `${label}: brand image must be a PNG readable by sharing clients.`);
        if (png) assert(bytes.readUInt32BE(16) === width && bytes.readUInt32BE(20) === height, `${label}: expected ${width}×${height} pixels.`);
    } catch (error) {
        assert(false, `${label}: invalid brand image URL or file: ${error.message}`);
    }
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

// Every inline icon must point at a symbol that exists in the SVG sprite.
const spriteIds = new Set([...readFileSync(join(root, "assets/icons.svg"), "utf8").matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]));
function validateIconSprite(html, label) {
    for (const m of html.matchAll(/<use\s+href="\/assets\/icons\.svg(?:\?v=[a-f0-9]{8})?#([^"]+)"/g)) {
        assert(spriteIds.has(m[1]), `${label}: icon "${m[1]}" is missing from assets/icons.svg.`);
    }
}

// Files Vercel serves (mirrors .vercelignore/.gitignore: dot-dirs, node_modules, tools, output are not deployed).
const UNSERVED_DIRS = new Set(["node_modules", "tools", "output"]);
function servedFiles(dir = root, out = []) {
    for (const entry of readdirSync(dir, {withFileTypes: true})) {
        if (entry.isDirectory()) {
            if (entry.name.startsWith(".") || UNSERVED_DIRS.has(entry.name)) continue;
            servedFiles(join(dir, entry.name), out);
        } else {
            out.push(join(dir, entry.name));
        }
    }
    return out;
}

// Node ids a page's JSON-LD defines (objects with properties) and references (bare {"@id": ...}).
function jsonLdIds(blocks) {
    const defined = new Set();
    const referenced = new Set();
    const visit = (node) => {
        if (Array.isArray(node)) return node.forEach(visit);
        if (!node || typeof node !== "object") return;
        const keys = Object.keys(node);
        if (typeof node["@id"] === "string") (keys.length === 1 ? referenced : defined).add(node["@id"]);
        for (const key of keys) if (key !== "@id") visit(node[key]);
    };
    for (const block of blocks) {
        try {
            visit(JSON.parse(block));
        } catch {
            // invalid JSON-LD is reported by the main schema loop
        }
    }
    return {defined, referenced};
}

// Every {"@id": ...} reference must point at a node defined in the same page graph
// or at the homepage Organization/WebSite nodes every page shares.
function validateJsonLdReferences(blocks, label) {
    const {defined, referenced} = jsonLdIds(blocks);
    for (const id of referenced) {
        assert(defined.has(id) || homepageNodeIds.includes(id), `${label}: JSON-LD reference {"@id": "${id}"} is not defined in this page graph and is not a shared homepage node (${homepageNodeIds.join(", ")}).`);
    }
}

// Distinct other-page targets linked from inside <main>.
function mainInternalLinkTargets(mainHtml, ownPath) {
    const targets = new Set();
    for (const match of mainHtml.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
        const href = match[1];
        if (!(href.startsWith("/") && !href.startsWith("//")) && !href.startsWith(`${origin}/`)) continue;
        const pathname = new URL(href, origin).pathname;
        if (pathname !== ownPath) targets.add(pathname);
    }
    return targets;
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

    assert(lang === (page.lang || "et"), `${label}: html lang must be ${page.lang || "et"}.`);
    assert(Boolean(title), `${label}: title is missing.`);
    assert(Boolean(description), `${label}: meta description is missing.`);
    assert(canonical === page.canonical, `${label}: canonical must be ${page.canonical}.`);
    assert(h1s.length === 1, `${label}: expected exactly one H1, found ${h1s.length}.`);
    assert(!/<meta\s+[^>]*name=["']keywords["']/i.test(html), `${label}: obsolete meta keywords tag should not be present.`);
    assert(!html.includes("cdn.tailwindcss.com"), `${label}: Tailwind runtime CDN must not be used.`);
    assert(!html.includes("hero-gradient.js") && !html.includes("hero-canvas"), `${label}: CPU-heavy canvas hero must not be loaded.`);
    assert(metaValue(html, "robots").includes("max-image-preview:large"), `${label}: robots meta should permit large image previews.`);
    const robotsParts = metaValue(html, "robots").split(/\s*,\s*/);
    if (page.noindex) assert(robotsParts.includes("noindex"), `${label}: retired page must use noindex.`);
    else assert(!robotsParts.includes("noindex"), `${label}: indexable page must not use noindex.`);

    for (const key of ["og:type", "og:locale", "og:site_name", "og:title", "og:description", "og:url", "og:image", "og:image:alt"]) {
        assert(Boolean(metaValue(html, key)), `${label}: ${key} metadata is missing.`);
    }
    assert(metaValue(html, "og:url") === page.canonical, `${label}: og:url must match canonical.`);
    validateBrandImage(metaValue(html, "og:image"), `${label}: Open Graph image`, 1200, 630);
    validateBrandImage(metaValue(html, "twitter:image"), `${label}: Twitter image`, 1200, 630);
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
                validateBrandImage(organizationLogo, `${label}: Organization logo`, 512, 512);
                assert(organization?.name === "Tehisabiline OÜ", `${label}: Organization name must be Tehisabiline OÜ.`);
                assert(organization?.url === `${origin}/`, `${label}: Organization URL must use the canonical homepage.`);
                assert(Array.isArray(organization?.sameAs) && organization.sameAs.length > 0, label + ": Organization must list sameAs profiles.");
            }

            const article = graph.find((item) => item["@type"] === "Article" || (Array.isArray(item["@type"]) && item["@type"].includes("Article")));
            if (article) {
                const articleImage = typeof article.image === "string" ? article.image : article.image?.url;
                validateBrandImage(articleImage, `${label}: Article image`, 1200, 630);
                if (article.author) {
                    assert(["Person", "Organization"].includes(article.author["@type"]), label + ": Article author must be a typed Person or Organization.");
                    if (article.author["@type"] === "Person") {
                        assert(article.author.name === "Arle Aron Reidma", label + ": Article Person author must be named.");
                        assert(article.author.url === `${origin}/meist/#autor`, label + ": Article Person author must link to the author profile.");
                    }
                }
                if (article.publisher) assert(article.publisher["@type"] === "Organization", label + ": Article publisher must be a typed Organization.");
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
    validateIconSprite(html, label);
    assert(!/material-symbols-outlined|cdn\.tailwindcss|tailwind\.min\.css/i.test(html), label + ": legacy icon font or Tailwind reference found.");
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

    if (!page.noindex) {
        const mains = [...html.matchAll(/<main\b[^>]*>/gi)].map((match) => match[0]);
        assert(mains.length === 1 && attrValue(mains[0], "id") === "main-content", `${label}: expected exactly one <main id="main-content">, found ${mains.length} <main> element(s).`);
        const mainHtml = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
        assert(mainHtml !== undefined, `${label}: <main id="main-content"> is never closed with </main>; the footer and everything after it are inside the main landmark.`);
        const skipLink = [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0]).find((tag) => attrValue(tag, "href") === "#main-content");
        assert(Boolean(skipLink) && /\bskip-link\b/.test(attrValue(skipLink, "class")), `${label}: skip link <a class="skip-link" href="#main-content"> is missing.`);
        if (mainHtml !== undefined) {
            const targets = mainInternalLinkTargets(mainHtml, new URL(page.canonical).pathname);
            assert(targets.size >= MIN_MAIN_INTERNAL_LINKS, `${label}: <main> links to only ${targets.size} other internal page(s) (${[...targets].join(", ") || "none"}); at least ${MIN_MAIN_INTERNAL_LINKS} are required for crawl paths and topical context.`);
        }
        validateJsonLdReferences(jsonLdBlocks, label);
    }
}

const homeHtml = readFileSync(join(root, "index.html"), "utf8");
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

const modelsHtml = readFileSync(join(root, "mudelid/index.html"), "utf8");
assert(modelsHtml.includes("API pole veel avalik"), "Models API example must say that the API is not yet public.");


const auditHtml = readFileSync(join(root, "kuberaudit/index.html"), "utf8");
assert(auditHtml.includes('href="/assets/css/pages/kuberaudit.css'), "Küberaudit must load its page-specific stylesheet.");

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
    "site.css",
    "site.js",
    "assets/icons.svg",
    ".nojekyll",
    "humans.txt"
]) {
    assert(existsSync(join(root, requiredFile)), `${requiredFile} is missing.`);
}

const robots = readFileSync(join(root, "robots.txt"), "utf8");
// Parse robots.txt into groups: consecutive User-agent lines followed by their rules.
const robotsGroups = [];
let robotsGroup = null;
for (const rawLine of robots.split("\n")) {
    const line = rawLine.replace(/#.*$/, "").trim();
    const field = line.match(/^([A-Za-z-]+):\s*(.*)$/);
    if (!field) continue;
    const [, name, value] = field;
    if (/^user-agent$/i.test(name)) {
        if (!robotsGroup || robotsGroup.rules.length) robotsGroups.push(robotsGroup = {agents: [], rules: []});
        robotsGroup.agents.push(value.toLowerCase());
    } else if (/^(allow|disallow)$/i.test(name) && robotsGroup) {
        robotsGroup.rules.push({type: name.toLowerCase(), value});
    }
}
for (const crawler of allowedCrawlers) {
    const group = robotsGroups.find((candidate) => candidate.agents.includes(crawler.toLowerCase()));
    assert(Boolean(group?.rules.some((rule) => rule.type === "allow" && rule.value === "/")), `robots.txt should explicitly allow ${crawler} with its own "User-agent: ${crawler}" group and "Allow: /".`);
}
for (const group of robotsGroups) {
    for (const rule of group.rules.filter((candidate) => candidate.type === "disallow" && candidate.value)) {
        assert(false, `robots.txt must not disallow anything (found "Disallow: ${rule.value}" for ${group.agents.join(", ")}): blocked /assets/ breaks rendering, and retired pages rely on noindex, which crawlers only see when allowed to fetch.`);
    }
}
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), "robots.txt must point to the canonical sitemap.");

const securityTxt = readFileSync(join(root, ".well-known/security.txt"), "utf8");
const securityExpires = (securityTxt.match(/^Expires:\s*(\S+)/m) || [])[1] || "";
assert(securityExpires > today, "security.txt Expires must be a future date.");
const oneYearAhead = new Date(Date.now() + 366 * 86400000).toISOString();
assert(!securityExpires || securityExpires <= oneYearAhead, `security.txt Expires (${securityExpires}) should be less than a year ahead (RFC 9116 §2.5.5).`);
assert(new RegExp(`^Contact:\\s*mailto:${escapeRegExp(contactEmail)}\\s*$`, "m").test(securityTxt), `security.txt Contact must be mailto:${contactEmail}.`);
assert(new RegExp(`^Canonical:\\s*${escapeRegExp(origin)}/\\.well-known/security\\.txt\\s*$`, "m").test(securityTxt), "security.txt Canonical must be its own https URL.");

// Contact is email-only: no form markup or webhook endpoints may ship, and every mailto targets the public inbox.
for (const file of servedFiles().filter((path) => /\.(html|js)$/i.test(path))) {
    const label = file.slice(root.length + 1);
    const text = readFileSync(file, "utf8");
    const formTags = [...text.matchAll(/<form\b[^>]*>/gi)].map((match) => match[0]);
    const contactForm = formTags.some((tag) => !/\bdata-local-check\b/i.test(tag) || /\baction=/i.test(tag));
    assert(!contactForm, `${label}: contains a contact <form>; contact is email-only (mailto:${contactEmail}). Local-only forms must be marked data-local-check and have no action.`);
    assert(!/n8n/i.test(text), `${label}: references n8n; the contact-form webhook was removed and must not ship.`);
    if (!label.endsWith(".html")) continue;
    for (const match of text.matchAll(/mailto:([^"'?\s>]*)/gi)) {
        assert(decodeURIComponent(match[1]).toLowerCase() === contactEmail, `${label}: mailto link targets "${match[1]}"; every mailto must be ${contactEmail}.`);
    }
}

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => ({
    loc: match[1].match(/<loc>([^<]+)<\/loc>/)?.[1] || "",
    lastmod: match[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || ""
}));
const sitemapUrls = sitemapEntries.map((entry) => entry.loc);
assert(sitemapUrls.length === new Set(sitemapUrls).size, "Sitemap canonical URLs must be unique.");
assert(sitemapUrls.length === expectedUrls.length && expectedUrls.every((url) => sitemapUrls.includes(url)), `Sitemap must list exactly the indexable canonical URLs: ${sitemapUrls.join(", ")}.`);
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
assert(/^\uFEFF?# \S/.test(llms), "llms.txt must start with an H1 naming the site (llmstxt.org).");
assert(/^> \S/m.test(llms.split(/^## /m)[0]), "llms.txt must have a blockquote summary before the first H2 section (llmstxt.org).");
const llmsLinks = [...llms.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((match) => match[1]);
for (const url of expectedUrls) {
    assert(llmsLinks.includes(url), `llms.txt should link to ${url} as a markdown link [name](${url}).`);
}
for (const url of new Set((llms.match(/https:\/\/tehisabiline\.ee\/[^\s)]*/g) || []).map((raw) => raw.replace(/[.,;:]+$/, "")))) {
    const pathname = new URL(url).pathname;
    const known = expectedUrls.includes(url) || noindexUrls.includes(url) || pathname === "/llms-full.txt";
    assert(known, `llms.txt mentions ${url}, which is neither an indexable sitemap URL, a known noindex page, nor llms-full.txt.`);
    assert(localTargetExists(pathname), `llms.txt mentions ${url}, which does not resolve to a file in the repo.`);
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

// "Facts to quote" in llms.txt / llms-full.txt must stay verifiable: every cited page still links the named source.
const pageFileByUrl = new Map(expectedPages.map((page) => [page.canonical, page.file]));
for (const [name, text] of [["llms.txt", llms], ["llms-full.txt", llmsFull]]) {
    const factsSection = text.split(/^## Facts to quote\s*$/m)[1]?.split(/^## /m)[0];
    assert(factsSection !== undefined, `${name} must keep its "## Facts to quote" section.`);
    const factItems = (factsSection || "").split("\n").filter((line) => /^\s*-\s+/.test(line));
    assert(factsSection === undefined || factItems.length > 0, `${name}: "## Facts to quote" has no list items.`);
    for (const item of factItems) {
        const urls = (item.match(/https:\/\/[^\s)]+/g) || []).map((raw) => raw.replace(/[.,;:]+$/, ""));
        const source = urls.find((url) => !url.startsWith(`${origin}/`));
        const citedOn = (item.split(/cited on/i)[1]?.match(/https:\/\/tehisabiline\.ee\/[^\s)]*/g) || []).map((raw) => raw.replace(/[.,;:]+$/, ""));
        assert(Boolean(source) && citedOn.length > 0, `${name}: fact needs an external source URL and "cited on <page URL>": ${item.trim().slice(0, 90)}…`);
        for (const pageUrl of citedOn) {
            const file = pageFileByUrl.get(pageUrl);
            assert(Boolean(file) && expectedUrls.includes(pageUrl), `${name}: fact is "cited on" ${pageUrl}, which is not an indexable page.`);
            if (!file || !source) continue;
            const html = readFileSync(join(root, file), "utf8");
            assert(html.includes(`href="${source}"`), `${name}: fact source ${source} is no longer linked on ${pageUrl} (${file}); update the fact or restore the citation.`);
        }
    }
}

// Pages may reference the homepage Organization/WebSite nodes only while the homepage defines them.
const homeDefinedIds = jsonLdIds(
    [...homeHtml.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1])
).defined;
for (const id of homepageNodeIds) assert(homeDefinedIds.has(id), `index.html must define the shared JSON-LD node ${id} that other pages reference.`);

const siteCss = readFileSync(join(root, "site.css"), "utf8");
assert(!siteCss.includes("api.tehisabiline.ee"), "site.css must not preserve the unavailable API hostname, even in comments.");

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
    for (const page of expectedPages) {
        const themeColor = metaValue(readFileSync(join(root, page.file), "utf8"), "theme-color");
        assert(!themeColor || themeColor.toLowerCase() === manifest.theme_color, `${page.file}: meta theme-color ${themeColor} differs from manifest theme_color ${manifest.theme_color}.`);
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
