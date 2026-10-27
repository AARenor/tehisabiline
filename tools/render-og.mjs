// Render a 1200×630 social card per published page and point each page's
// Open Graph, Twitter and JSON-LD image metadata at its own card.
//
// Why: one generic card for 62 pages makes every share and every AI-crawler
// preview identical; the card is the only image most shared links show.
//
// Requires Chromium. Run after content changes:
//   node tools/render-og.mjs            # render missing cards only
//   node tools/render-og.mjs --force    # re-render every card
// Then rebuild asset versions: npm run build:assets
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname;
const origin = "https://tehisabiline.ee";
const chrome = process.env.CHROME_BIN || "google-chrome";
const force = process.argv.includes("--force");
const SKIP = new Set(["node_modules", ".git", ".impeccable", "output", ".playwright-cli", "docs", ".github", "tools"]);

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function pages(dir, out = []) {
    for (const name of readdirSync(dir)) {
        if (SKIP.has(name)) continue;
        const full = join(dir, name);
        if (statSync(full).isDirectory()) pages(full, out);
        else if (name === "index.html") out.push(full);
    }
    return out.sort();
}

const slugOf = (urlPath) => {
    const slug = urlPath.replace(/^\/|\/$/g, "").replace(/\//g, "-") || "home";
    return `og-${slug}`;
};

const metaContent = (html, key) => {
    const property = html.match(new RegExp(`<meta\\s+property="${key}"\\s+content="([^"]*)"`, "i"));
    if (property) return property[1];
    const named = html.match(new RegExp(`<meta\\s+name="${key}"\\s+content="([^"]*)"`, "i"));
    return named ? named[1] : null;
};

function card({ kicker, title, lede, urlPath, lang }) {
    // Longer headlines need a smaller face to stay inside the copy column.
    const length = title.length;
    const size = length > 78 ? 44 : length > 58 ? 50 : length > 40 ? 56 : 62;
    return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<style>
@font-face { font-family: "Host Grotesk"; font-weight: 300 800; src: url("${pathToFileURL(join(root, "assets/fonts/host-grotesk-latin.woff2")).href}") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F, U+20AC; }
@font-face { font-family: "Host Grotesk"; font-weight: 300 800; src: url("${pathToFileURL(join(root, "assets/fonts/host-grotesk-latin-ext.woff2")).href}") format("woff2"); unicode-range: U+0100-02FF; }
@font-face { font-family: "Hanken Grotesk"; font-weight: 100 900; src: url("${pathToFileURL(join(root, "assets/fonts/hanken-latin.woff2")).href}") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F, U+20AC; }
@font-face { font-family: "Hanken Grotesk"; font-weight: 100 900; src: url("${pathToFileURL(join(root, "assets/fonts/hanken-latin-ext.woff2")).href}") format("woff2"); unicode-range: U+0100-02FF; }
* { box-sizing: border-box; }
html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
body { display: grid; grid-template-columns: 806px 394px; color: #090c24; font-family: "Hanken Grotesk", sans-serif; background: #fff; }
.copy { position: relative; height: 630px; padding: 58px 54px 82px 68px; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 15px; font: 800 30px/1 "Host Grotesk", sans-serif; letter-spacing: -.035em; }
.brand img { width: 52px; height: 52px; }
.kicker { margin: 54px 0 0; color: #0857f8; font: 700 21px/1.2 "Host Grotesk", sans-serif; letter-spacing: .06em; text-transform: uppercase; }
h1 { margin: 18px 0 0; font: 800 ${size}px/1.06 "Host Grotesk", sans-serif; letter-spacing: -.03em; }
.lede { margin: auto 0 0; max-width: 620px; color: #3c465f; font-size: 22px; line-height: 1.34; }
.url { position: absolute; left: 68px; bottom: 30px; color: #0857f8; font: 700 20px/1 "Hanken Grotesk", sans-serif; letter-spacing: -.01em; }
.mark-field { display: grid; place-items: center; height: 630px; background: #0857f8; }
.mark-field img { width: 292px; height: 292px; }
</style>
</head>
<body>
<main class="copy">
    <div class="brand"><img src="${pathToFileURL(join(root, "assets/brand/logo.svg")).href}" alt="">Tehisabiline</div>
    <p class="kicker">${escapeHtml(kicker)}</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="lede">${escapeHtml(lede)}</p>
    <div class="url">tehisabiline.ee${escapeHtml(urlPath === "/" ? "" : urlPath)}</div>
</main>
<div class="mark-field"><img src="${pathToFileURL(join(root, "assets/brand/logo.svg")).href}" alt=""></div>
</body>
</html>`;
}

const outDir = join(root, "assets/brand");
const work = mkdtempSync(join(tmpdir(), "og-cards-"));
const flags = [
    "--headless", "--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars",
    "--allow-file-access-from-files", "--force-device-scale-factor=1",
    "--window-size=1200,630", "--virtual-time-budget=4000",
];

const plan = [];
for (const file of pages(root)) {
    const html = readFileSync(file, "utf8");
    const urlPath = "/" + relative(root, file).replace(/index\.html$/, "");
    if (urlPath === "/404.html" || /name="robots"[^>]*noindex/.test(html)) continue;
    const title = (metaContent(html, "og:title") || html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "")
        .replace(/\s*\|\s*Tehisabiline\s*$/i, "").trim();
    const lede = (metaContent(html, "og:description") || metaContent(html, "description") || "").trim();
    const kicker = (html.match(/<p class="eyebrow">([^<]*)<\/p>/i)?.[1] || "Tehisabiline").trim();
    const lang = (html.match(/<html[^>]*\slang="([^"]*)"/i)?.[1] || "et").trim();
    if (!title) throw new Error(`${urlPath}: no title for an OG card`);
    plan.push({ file, urlPath, title, lede: lede.slice(0, 190), kicker, lang, slug: slugOf(urlPath) });
}

let rendered = 0, reused = 0;
for (const item of plan) {
    const png = join(outDir, `${item.slug}.png`);
    if (!force && existsSync(png)) { reused++; continue; }
    const source = join(work, `${item.slug}.html`);
    writeFileSync(source, card(item));
    execFileSync(chrome, [...flags, `--screenshot=${png}`, pathToFileURL(source).href], { stdio: ["ignore", "ignore", "pipe"] });
    const bytes = readFileSync(png);
    if (bytes.readUInt32BE(16) !== 1200 || bytes.readUInt32BE(20) !== 630) {
        throw new Error(`${item.slug}: card did not render at 1200×630`);
    }
    rendered++;
}
rmSync(work, { recursive: true, force: true });

// Point each page at its own card. Existing generic/brand cards stay in place for
// anything that still references them explicitly.
let rewired = 0;
for (const item of plan) {
    const png = join(outDir, `${item.slug}.png`);
    if (!existsSync(png)) continue;
    const absolute = `${origin}/assets/brand/${item.slug}.png`;
    let html = readFileSync(item.file, "utf8");
    const before = html;
    const ogAlt = `${item.kicker} — ${item.title}`.replace(/"/g, "&quot;");
    html = html
        .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/i, `$1${absolute}$2`)
        .replace(/(<meta\s+property="og:image:secure_url"\s+content=")[^"]*(")/i, `$1${absolute}$2`)
        .replace(/(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/i, `$1${ogAlt}$2`)
        .replace(/(<meta\s+name="twitter:image(?::src)?"\s+content=")[^"]*(")/i, `$1${absolute}$2`)
        .replace(/(<meta\s+name="twitter:image:alt"\s+content=")[^"]*(")/i, `$1${ogAlt}$2`);
    // JSON-LD image pointers: Article.image, WebPage.primaryImageOfPage, ImageObject.url.
    html = html.replace(/"(https:\/\/tehisabiline\.ee)?\/assets\/brand\/tehisabiline-og\.png(\?v=[a-f0-9]{8})?"/g, `"${absolute}"`);
    if (html !== before) { writeFileSync(item.file, html); rewired++; }
}

console.log(`og cards: ${rendered} rendered, ${reused} reused, ${rewired} pages rewired`);
