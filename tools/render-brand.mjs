// Render authored SVG icons and the HTML sharing card without runtime dependencies.
// Requires Chromium; override its executable with CHROME_BIN if needed.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const chrome = process.env.CHROME_BIN || "google-chrome";
const flags = [
    "--headless", "--no-sandbox", "--disable-dev-shm-usage",
    "--allow-file-access-from-files", "--hide-scrollbars",
    "--force-device-scale-factor=1", "--virtual-time-budget=5000",
];
const source = new URL("logo-card.html", import.meta.url);
const dom = execFileSync(chrome, [...flags, "--dump-dom", source.href], {
    encoding: "utf8", maxBuffer: 4 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"],
});
const payload = dom.match(/<pre id="exports"[^>]*>([\s\S]*?)<\/pre>/)?.[1];
if (!payload) throw new Error("Brand export did not finish; inspect tools/logo-card.html.");
const exports = JSON.parse(payload);
for (const { name, size, png } of exports) {
    const output = new URL(`../assets/brand/${name}`, import.meta.url);
    const bytes = Buffer.from(png, "base64");
    if (bytes.readUInt32BE(16) !== size || bytes.readUInt32BE(20) !== size) {
        throw new Error(`${name}: expected ${size}×${size} PNG.`);
    }
    writeFileSync(output, bytes);
    console.log(`brand: ${name} (${size}×${size})`);
}
const og = new URL("../assets/brand/tehisabiline-og.png", import.meta.url);
execFileSync(chrome, [
    ...flags, "--window-size=1200,630", `--screenshot=${fileURLToPath(og)}`,
    new URL("og-card.html", import.meta.url).href,
], { stdio: ["ignore", "pipe", "pipe"] });
const bytes = readFileSync(og);
if (bytes.readUInt32BE(16) !== 1200 || bytes.readUInt32BE(20) !== 630) {
    throw new Error("Sharing card must render at 1200×630.");
}
console.log("brand: tehisabiline-og.png (1200×630)");
