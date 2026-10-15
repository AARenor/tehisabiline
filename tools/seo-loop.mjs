// Continuous SEO loop for tehisabiline.ee
//
// What it does (one full cycle):
//   1. Runs tools/seo-check.mjs (hard gates: canonicals, meta, JSON-LD, sitemap sync)
//   2. Audits soft signals seo-check does NOT cover:
//      - title/description lengths (SERP truncation)
//      - image weights (>200KB flagged, vectors excluded)
//      - large content images (>=400px wide) missing loading="lazy"
//      - dead asset files (unreferenced files over DEAD_KB)
//      - internal-link equity (inbound counts, money-page minimums)
//      - content freshness (dateModified older than STALE_DAYS)
//      - orphan pages (indexable page files no other page links to, or missing from the sitemap)
//      - sitemap lastmod drift (page dateModified differs from its sitemap <lastmod>)
//      - deploy parity (.vercelignore must not exclude HTML-referenced assets)
//   3. Writes a dated report to output/seo-loop/YYYY-MM-DD-HHMMSS.{md,json}
//
// Usage:
//   node tools/seo-loop.mjs            # full cycle, exit 0 = clean, 1 = failures
//   node tools/seo-loop.mjs --strict   # warnings also fail (for CI)
//
// Schedule suggestion (cron, monthly; use absolute node path):
//   0 8 1 * * mkdir -p /home/arle/projects/tehisabiline/output/seo-loop && cd /home/arle/projects/tehisabiline && /usr/bin/node tools/seo-loop.mjs >> output/seo-loop/cron.log 2>&1
// (Rotate cron.log occasionally, e.g. yearly: tail -n 200 cron.log > cron.log.tmp && mv cron.log.tmp cron.log)

import {execFileSync} from "node:child_process";
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from "node:fs";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://tehisabiline.ee";
const STALE_DAYS = 180;
const HEAVY_IMG_KB = 200;
const DEAD_KB = 50;
const LAZY_MIN_WIDTH = 400;
const MONEY_PAGES = ["/pentestimine/", "/mudelid/", "/kuberaudit/"];
const MONEY_MIN_INBOUND = 5;
const SKIP_DIRS = new Set([".git", ".opencode", ".playwright-cli", ".vercel", "docs", "node_modules", "output", "tools"]);

const warnings = [];
const failures = [];
const facts = {};

function walk(dir, out = []) {
    for (const e of readdirSync(dir, {withFileTypes: true})) {
        if (e.isDirectory()) {
            if (SKIP_DIRS.has(e.name) || e.name.startsWith(".")) continue;
            walk(join(dir, e.name), out);
            continue;
        }
        out.push(join(dir, e.name));
    }
    return out;
}

function read(p) { return readFileSync(p, "utf8"); }
function rel(p) { return p.slice(root.length + 1); }

function meta(html, key) {
    const m = html.match(new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${key}["'][^>]*>`, "i"));
    return m?.[0].match(/content=["']([^"']*)["']/i)?.[1] ?? "";
}

let sitemap = "";
try {
    sitemap = read(join(root, "sitemap.xml"));
} catch (e) {
    failures.push(`cannot read sitemap.xml: ${e.message}`);
}
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
// Inspect published HTML independently of the sitemap so an omitted public page
// is still detected as an orphan. Private docs are excluded by walk().
const allFiles = walk(root);
const pageFiles = allFiles.filter((file) => file.endsWith("index.html") || file.endsWith("404.html"));

// --- 1. hard gates -----------------------------------------------------------
try {
    execFileSync("node", [join(root, "tools", "seo-check.mjs")], {stdio: "pipe"});
    facts.seoCheck = "PASS";
} catch (e) {
    facts.seoCheck = "FAIL";
    failures.push(`seo-check.mjs failed:\n${(e.stdout || "")}${(e.stderr || "")}`.trim());
}

// --- 2a. title/description lengths ------------------------------------------
let audited = 0;
for (const file of pageFiles) {
    const html = read(file);
    if (file.endsWith("404.html")) continue;
    audited++;
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
    const desc = meta(html, "description");
    if (title.length > 60) warnings.push(`${rel(file)}: title ${title.length} chars (SERP truncates ~60): "${title}"`);
    if (desc.length > 160) warnings.push(`${rel(file)}: meta description ${desc.length} chars (truncates ~155-160)`);
    if (desc.length > 0 && desc.length < 50) warnings.push(`${rel(file)}: meta description only ${desc.length} chars (thin)`);
}
facts.pagesAudited = audited;

// --- collect referenced local asset paths -----------------------------------
// occurrences[] keeps multiplicity (link-equity counting); refSet is for dead-file scan.
const occurrences = [];
const refSet = new Set();
function addRef(p) { occurrences.push(p); refSet.add(p); }
for (const file of pageFiles) {
    const html = read(file);
    for (const m of html.matchAll(/<(a|img|script|link|source)\b[^>]*>/gi)) {
        const tag = m[0];
        // canonical links are self-identifiers, not navigational votes
        if (/^<link\b/i.test(tag) && /\brel=["']canonical["']/i.test(tag)) continue;
        const v = tag.match(/(?:href|src)=["']([^"']+)["']/i)?.[1] ?? "";
        const srcset = tag.match(/srcset=["']([^"']+)["']/i)?.[1] ?? "";
        for (const raw of [v, ...srcset.split(",").map((s) => s.trim().split(/\s+/)[0]).filter(Boolean)]) {
            const u = raw;
            if (/^(#|mailto:|tel:|data:|javascript:|\/\/)/i.test(u) || u === "") continue;
            if (/^https?:\/\//i.test(u)) {
                try {
                    if (new URL(u).origin !== origin) continue;
                    addRef(new URL(u).pathname);
                } catch { continue; }
            } else {
                const base = dirname("/" + rel(file));
                addRef(resolve(base, u.split("#")[0].split("?")[0]));
            }
        }
    }
    // meta content URLs (og:image, twitter:image, ...) — skip og:url (self-identifier)
    for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
        const tag = m[0];
        if (/\bproperty=["']og:url["']/i.test(tag)) continue;
        const v = tag.match(/content=["']([^"']+)["']/i)?.[1] ?? "";
        if (/^https:\/\/tehisabiline\.ee\//i.test(v)) {
            try { addRef(new URL(v).pathname); } catch { /* ignore */ }
        } else if (v.startsWith("/")) {
            addRef(v.split("#")[0].split("?")[0]);
        }
    }
}
// CSS url(...) references (fonts, backgrounds). Known limitation: <video poster>
// and inline styles are not collected.
for (const f of allFiles.filter((p) => p.endsWith(".css"))) {
    const css = read(f);
    for (const m of css.matchAll(/url\(["']?([^)"']+)["']?\)/g)) {
        const v = m[1].trim();
        if (/^(#|data:)/i.test(v) || v === "") continue;
        if (/^https?:\/\//i.test(v)) {
            try {
                if (new URL(v).origin !== origin) continue;
                addRef(new URL(v).pathname);
            } catch { continue; }
        } else if (!v.startsWith("//")) {
            addRef(resolve(dirname("/" + rel(f)), v.split("#")[0].split("?")[0]));
        }
    }
}
const referenced = refSet;

// --- 2b. image weights + lazy -------------------------------------------------
const heavy = [];
const noLazy = [];
const weighed = new Set();
for (const file of pageFiles) {
    const html = read(file);
    const weigh = (src) => {
        if (!src.startsWith("/assets/") || weighed.has(src)) return;
        weighed.add(src);
        const disk = join(root, src);
        if (existsSync(disk) && !/\.svg$/i.test(src)) {
            const kb = Math.round(statSync(disk).size / 1024);
            if (kb > HEAVY_IMG_KB) heavy.push(`${src.slice(1)}: ${kb}KB`);
        }
    };
    for (const m of html.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>|<img\b[^>]*>/gi)) {
        const picture = m[0].startsWith("<picture");
        const markup = m[0];
        const img = picture ? markup.match(/<img\b[^>]*>/i)?.[0] ?? "" : markup;
        if (!img) continue;
        const sourceTags = picture ? [...markup.matchAll(/<source\b[^>]*>/gi)].map((match) => match[0]) : [];
        const sourceUrls = sourceTags.flatMap((tag) => {
            const srcset = tag.match(/\bsrcset=["']([^"']+)["']/i)?.[1] ?? "";
            return srcset.split(",").map((entry) => entry.trim().split(/\s+/)[0]).filter(Boolean);
        });
        const fallbackSrc = img.match(/\bsrc=["']([^"']+)["']/i)?.[1] ?? "";
        // Picture sources are candidates; the fallback is requested only if no source matches.
        for (const src of sourceUrls.length ? sourceUrls : [fallbackSrc]) weigh(src);
        const displayedSrc = sourceUrls[0] ?? fallbackSrc;
        if (!displayedSrc.startsWith("/assets/")) continue;
        const width = parseInt(img.match(/\bwidth=["'](\d+)["']/i)?.[1] ?? "0", 10);
        const isPriority = /\bfetchpriority=["']high["']/i.test(img) || /\bfetchpriority=["']high["']/i.test(markup);
        const isLazy = /\bloading=["']lazy["']/i.test(img);
        if (width >= LAZY_MIN_WIDTH && !isLazy && !isPriority) {
            noLazy.push(`${rel(file)}: large content img missing loading=lazy (${displayedSrc})`);
        }
    }
}
if (heavy.length) warnings.push(`Heavy images (>${HEAVY_IMG_KB}KB):\n- ` + heavy.join("\n- "));
if (noLazy.length) warnings.push(`Large content images without loading="lazy":\n- ` + noLazy.join("\n- "));
facts.heavyImages = heavy.length;

// --- 2c. dead asset files ------------------------------------------------------
const dead = [];
for (const f of allFiles) {
    if (!/\.(png|jpe?g|webp|gif|avif|svg|js|css|woff2?|woff|ico|mp4|json)$/i.test(f)) continue;
    if (rel(f).startsWith("output/")) continue; // loop's own reports are unreferenced by design
    const webPath = "/" + rel(f);
    const kb = Math.round(statSync(f).size / 1024);
    if (kb > DEAD_KB && !referenced.has(webPath)) dead.push(`${rel(f)}: ${kb}KB unreferenced`);
}
if (dead.length) warnings.push(`Dead asset files (>${DEAD_KB}KB, unreferenced):\n- ` + dead.join("\n- "));
facts.deadAssets = dead.length;

// --- 2d. internal-link equity ---------------------------------------------------
const inbound = new Map(sitemapUrls.map((u) => [u, 0]));
for (const p of occurrences) {
    const abs = p.startsWith("http") ? p : origin + p;
    const norm = abs.endsWith("/") ? abs : abs + "/";
    if (inbound.has(norm)) inbound.set(norm, inbound.get(norm) + 1);
    else if (inbound.has(abs)) inbound.set(abs, inbound.get(abs) + 1);
}
facts.inbound = Object.fromEntries([...inbound].map(([k, v]) => [k.replace(origin, "") || "/", v]));
for (const mp of MONEY_PAGES) {
    const n = inbound.get(origin + mp) ?? 0;
    if (n < MONEY_MIN_INBOUND) warnings.push(`Money page ${mp} has only ${n} inbound links (min ${MONEY_MIN_INBOUND})`);
}

// --- 2e. freshness --------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const stale = [];
for (const file of pageFiles) {
    if (file.endsWith("404.html")) continue;
    const html = read(file);
    for (const b of [...html.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]) {
        try {
            const data = JSON.parse(b[1]);
            const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
            for (const item of graph) {
                if (!item.dateModified) continue;
                const age = Math.floor((new Date(today) - new Date(item.dateModified)) / 86400000);
                if (age > STALE_DAYS) stale.push(`${rel(file)} (${item["@type"]}): dateModified ${item.dateModified} = ${age}d old`);
            }
        } catch { /* invalid JSON-LD is seo-check's job */ }
    }
}
if (stale.length) warnings.push(`Stale pages (>${STALE_DAYS}d without material update):\n- ` + [...new Set(stale)].join("\n- "));
facts.stalePages = new Set(stale).size;

// --- 2e2. orphan pages --------------------------------------------------------------
// A page is orphaned when no *other* page links to it with <a href>; header/footer links count.
function pageUrlForFile(file) {
    const r = rel(file);
    return origin + "/" + (r === "index.html" ? "" : r.replace(/index\.html$/, ""));
}
const anchorInbound = new Map();
for (const file of pageFiles) {
    if (file.endsWith("404.html")) continue;
    const self = pageUrlForFile(file);
    for (const m of read(file).matchAll(/<a\b[^>]*\bhref=["']([^"'#?]*)[^"']*["']/gi)) {
        const href = m[1];
        if (!href || /^(mailto:|tel:|javascript:|\/\/)/i.test(href)) continue;
        let target;
        try { target = new URL(href, self); } catch { continue; }
        if (target.origin !== origin) continue;
        const url = origin + (target.pathname.endsWith("/") ? target.pathname : target.pathname + "/");
        if (url === self) continue;
        if (!anchorInbound.has(url)) anchorInbound.set(url, new Set());
        anchorInbound.get(url).add(rel(file));
    }
}
const orphans = [];
for (const file of pageFiles) {
    if (file.endsWith("404.html")) continue;
    const html = read(file);
    if (/noindex/i.test(meta(html, "robots"))) continue; // retired pages are intentionally unlinked
    const url = pageUrlForFile(file);
    if (!anchorInbound.has(url)) orphans.push(`${rel(file)}: no other page links to ${url}`);
    if (!sitemapUrls.includes(url)) orphans.push(`${rel(file)}: indexable page missing from sitemap.xml (${url})`);
}
if (orphans.length) warnings.push(`Orphan pages:\n- ` + orphans.join("\n- "));
facts.orphanPages = orphans.length;

// --- 2e3. sitemap lastmod drift -------------------------------------------------------
const lastmods = new Map([...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => [
    m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] ?? "",
    m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? ""
]));
const drift = [];
for (const file of pageFiles) {
    const url = pageUrlForFile(file);
    if (!lastmods.has(url)) continue;
    let modified = "";
    for (const b of read(file).matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
        try {
            const data = JSON.parse(b[1]);
            const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
            const page = graph.find((item) => ["WebPage", "AboutPage"].includes(item["@type"]) && item.dateModified);
            if (page) modified = page.dateModified;
        } catch { /* invalid JSON-LD is seo-check's job */ }
    }
    const lastmod = lastmods.get(url);
    if (modified !== lastmod) {
        const days = modified && lastmod ? Math.round((new Date(lastmod) - new Date(modified)) / 86400000) : "?";
        drift.push(`${rel(file)}: dateModified ${modified || "(missing)"} vs sitemap lastmod ${lastmod || "(missing)"} (${days}d)`);
    }
}
if (drift.length) warnings.push(`Sitemap lastmod drift (dateModified ≠ <lastmod>):\n- ` + drift.join("\n- "));
facts.lastmodDrift = drift.length;

// --- 2f. deploy parity (.vercelignore) --------------------------------------------
let ignoreHits = [];
if (existsSync(join(root, ".vercelignore"))) {
    const patterns = read(join(root, ".vercelignore")).split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#") && !l.startsWith("!"))
        .map((l) => l.replace(/^\/+/, "").replace(/\/$/, ""));
    const matches = (clean, pat) => {
        if (!pat.includes("*")) return clean === pat || clean.startsWith(pat + "/");
        const rx = new RegExp("^" + pat.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$");
        return rx.test(clean);
    };
    for (const ref of referenced) {
        const clean = ref.replace(/^\//, "");
        if (patterns.some((pat) => matches(clean, pat))) ignoreHits.push(ref);
    }
}
if (ignoreHits.length) failures.push(`HTML references assets excluded by .vercelignore (404 in production):\n- ` + [...new Set(ignoreHits)].join("\n- "));
facts.vercelParity = ignoreHits.length ? "FAIL" : "PASS";

// --- 3. report ---------------------------------------------------------------------
const stamp = new Date().toISOString().slice(0, 19).replace("T", "-").replaceAll(":", "");
const outDir = join(root, "output", "seo-loop");
mkdirSync(outDir, {recursive: true});
const status = failures.length ? "FAIL" : warnings.length ? "WARN" : "CLEAN";
const md = `# SEO loop report — ${today} (${status})

Hard gates (seo-check.mjs): **${facts.seoCheck}** · Deploy parity: **${facts.vercelParity}**
Pages audited: ${facts.pagesAudited} · Heavy images: ${facts.heavyImages} · Dead assets: ${facts.deadAssets} · Stale pages: ${facts.stalePages} · Orphan pages: ${facts.orphanPages} · Lastmod drift: ${facts.lastmodDrift}

## Inbound internal links
${Object.entries(facts.inbound).map(([u, n]) => `- ${u}: ${n}`).join("\n")}

## Failures (${failures.length})
${failures.length ? failures.map((f) => `- ${f}`).join("\n") : "- none"}

## Warnings (${warnings.length})
${warnings.length ? warnings.map((w) => `- ${w}`).join("\n") : "- none"}

## Next loop
\`node tools/seo-loop.mjs\` (monthly cron suggested in script header).
`;
writeFileSync(join(outDir, `${stamp}.md`), md);
writeFileSync(join(outDir, `${stamp}.json`), JSON.stringify({stamp, status, facts, failures, warnings}, null, 2));
console.log(`SEO loop: ${status} — ${failures.length} failure(s), ${warnings.length} warning(s). Report: output/seo-loop/${stamp}.md`);
process.exit(failures.length || (process.argv.includes("--strict") && warnings.length) ? 1 : 0);
