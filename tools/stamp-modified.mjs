// Keeps every "last modified" signal on a page identical.
//
// Source of truth: the visible date in the page head,
//   <p class="page-head__meta">… <time datetime="YYYY-MM-DD">…</time></p>
// Pages without one (home, /en/, /sektorid/) fall back to their first JSON-LD "dateModified".
// The date is copied to: every JSON-LD "dateModified", <meta name="article:modified_time">,
// the footer <time> (datetime attribute and label) and the matching <lastmod> in sitemap.xml.
// A shared header/footer rebuild is NOT a material update, so it never changes these dates:
// change the visible head date only when the page content changed, then run this script.
//
//   node tools/stamp-modified.mjs          rewrite files in place
//   node tools/stamp-modified.mjs --check  list drift and exit 1 (no writes)
import {readdirSync, readFileSync, statSync, writeFileSync} from "node:fs";
import {join, relative} from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SKIP = new Set(["node_modules", ".git", ".vercel", ".opencode", ".impeccable", "output", ".playwright-cli", "docs", "tools", "assets"]);
const check = process.argv.includes("--check");

const ET_MONTHS = ["jaanuaril", "veebruaril", "märtsil", "aprillil", "mail", "juunil", "juulil", "augustil", "septembril", "oktoobril", "novembril", "detsembril"];
const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// The footer label follows the footer's own language so chrome.mjs and this script agree.
function label(iso, english) {
    const [y, m, d] = iso.split("-").map(Number);
    return english ? `${d} ${EN_MONTHS[m - 1]} ${y}` : `${d}. ${ET_MONTHS[m - 1]} ${y}`;
}

function* pages(dir) {
    for (const name of readdirSync(dir)) {
        if (SKIP.has(name) || name.startsWith(".")) continue;
        const full = join(dir, name);
        if (statSync(full).isDirectory()) yield* pages(full);
        else if (name.endsWith(".html")) yield full;
    }
}

const HEAD_DATE = /class="page-head__meta"[^>]*>[\s\S]*?<time datetime="(\d{4}-\d{2}-\d{2})"/;
const LD_DATE = /"dateModified":\s*"(\d{4}-\d{2}-\d{2})"/;
const FOOTER = /(<!-- chrome:footer -->[\s\S]*?)<time datetime="(\d{4}-\d{2}-\d{2})">([^<]*)<\/time>/;

const dates = new Map(); // canonical path -> date
const drift = [];
let written = 0;

for (const file of pages(root)) {
    const html = readFileSync(file, "utf8");
    const date = html.match(HEAD_DATE)?.[1] ?? html.match(LD_DATE)?.[1];
    if (!date) continue;
    const path = "/" + relative(root, file).replace(/index\.html$/, "").replace(/\\/g, "/");
    dates.set(path, date);

    const english = /^\/en(\/|$)/.test(path);
    let next = html
        .replace(/("dateModified":\s*")\d{4}-\d{2}-\d{2}(")/g, `$1${date}$2`)
        .replace(/(<meta\s+name="article:modified_time"\s+content=")\d{4}-\d{2}-\d{2}(")/g, `$1${date}$2`)
        .replace(FOOTER, (_all, before) => `${before}<time datetime="${date}">${label(date, english)}</time>`);
    if (next !== html) {
        if (check) drift.push(relative(root, file));
        else {
            writeFileSync(file, next);
            written++;
        }
    }
}

const sitemapFile = join(root, "sitemap.xml");
const sitemap = readFileSync(sitemapFile, "utf8");
const nextSitemap = sitemap.replace(/<url>\s*<loc>https:\/\/tehisabiline\.ee([^<]*)<\/loc>\s*<lastmod>[^<]*<\/lastmod>/g, (block, path) => {
    const date = dates.get(path);
    return date ? block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${date}</lastmod>`) : block;
});
if (nextSitemap !== sitemap) {
    if (check) drift.push("sitemap.xml");
    else {
        writeFileSync(sitemapFile, nextSitemap);
        written++;
    }
}

if (check) {
    if (drift.length) {
        console.error(`date drift in ${drift.length} file(s):\n  ${drift.join("\n  ")}\nRun: node tools/stamp-modified.mjs`);
        process.exit(1);
    }
    console.log(`dates consistent across ${dates.size} pages and sitemap.xml`);
} else {
    console.log(`stamp-modified: ${written} file(s) updated, ${dates.size} pages read`);
}
