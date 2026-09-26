// Appends content-hash query (?v=xxxxxxxx) to local CSS/JS asset references
// in every HTML file, so returning visitors never get stale cached assets.
// Run after CSS rebuilds:  npm run build:css && node tools/version-assets.mjs
// Safe for seo-check: resolveLocalPath() strips query strings before resolving.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

// Source asset files whose content is hashed (paths as referenced from site root).
const assets = [
    "/assets/css/tailwind.min.css",
    "/index.css",
    "/homepage.css",
    "/index.js",
    "/homepage.js",
    "/assets/js/roi-calculator.js",
];

function hashOf(relativePath) {
    const content = readFileSync(join(root, relativePath));
    return createHash("sha256").update(content).digest("hex").slice(0, 8);
}

const versions = new Map(assets.map((path) => [path, hashOf(path)]));

function collectHtml(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        if (entry === "node_modules" || entry === ".git" || entry === ".vercel" || entry === ".opencode" || entry === "output" || entry === ".playwright-cli") continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) collectHtml(full, out);
        else if (extname(entry) === ".html") out.push(full);
    }
    return out;
}

let changed = 0;
for (const file of collectHtml(root)) {
    let html = readFileSync(file, "utf8");
    let fileChanged = false;
    for (const [path, hash] of versions) {
        const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Match href="/path" or href="/path?v=old" (same for src=), inside link/script tags only.
        const pattern = new RegExp(`((?:href|src)=["'])${escaped}(?:\\?v=[a-f0-9]{8})?(["'])`, "g");
        const next = html.replace(pattern, `$1${path}?v=${hash}$2`);
        if (next !== html) {
            html = next;
            fileChanged = true;
        }
    }
    if (fileChanged) {
        writeFileSync(file, html);
        changed++;
    }
}

console.log("Asset versions:");
for (const [path, hash] of versions) console.log(`  ${path}?v=${hash}`);
console.log(`Updated ${changed} HTML file(s).`);
