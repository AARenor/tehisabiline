// Appends content-hash queries to local CSS, JS and brand asset references,
// including social-image metadata, JSON-LD and manifest icons.
// Run after asset changes: npm run build:assets (or build:brand for brand sources).
// Local reference validation strips query strings before resolving.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

// Source asset files whose content is hashed (paths as referenced from site root).
const assets = [
    "/site.css",
    "/site.js",
    "/assets/js/roi-calculator.js",
    "/assets/js/hero-demo.js",
    "/assets/icons.svg",
    ...readdirSync(join(root, "assets/brand"))
        .filter((name) => /\.(png|svg)$/.test(name))
        .map((name) => `/assets/brand/${name}`),
    ...readdirSync(join(root, "assets/css/pages"), { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".css"))
        .map((entry) => `/assets/css/pages/${entry.name}`),
];

function hashOf(relativePath) {
    const content = readFileSync(join(root, relativePath));
    return createHash("sha256").update(content).digest("hex").slice(0, 8);
}

const versions = new Map(assets.map((path) => [path, hashOf(path)]));

function collectHtml(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        if (entry === "node_modules" || entry === ".git" || entry === ".vercel" || entry === ".opencode" || entry === ".impeccable" || entry === "docs" || entry === "output" || entry === ".playwright-cli") continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) collectHtml(full, out);
        else if (extname(entry) === ".html") out.push(full);
    }
    return out;
}

let changed = 0;
for (const file of [...collectHtml(root), join(root, "site.webmanifest")]) {
    let html = readFileSync(file, "utf8");
    let fileChanged = false;
    for (const [path, hash] of versions) {
        const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // Include absolute social-image URLs and JSON-LD/manifest references.
        // Preserve SVG symbol fragments while replacing the content-hash query.
        const pattern = new RegExp(`((?:href|src|content)=["']|"(?:url|image|src)"\\s*:\\s*")((?:https://tehisabiline\\.ee)?${escaped})(?:\\?v=[a-f0-9]{8})?(#[^"']*)?(["'])`, "g");
        const next = html.replace(pattern, `$1$2?v=${hash}$3$4`);
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
console.log(`Updated ${changed} HTML/manifest file(s).`);
