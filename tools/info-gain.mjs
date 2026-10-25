// Information-gain manifest enforcement.
//
// docs/seo/info-gain.json declares, per page, the one thing that page has and a
// competitor page does not: a calculator, a template, a dataset or a sample report.
// The manifest is only useful if it cannot rot, so this module checks that
//   1. every declared page exists and is a mapped page,
//   2. every entry uses a known asset type,
//   3. the declared proof string still appears in the page HTML,
//   4. coverage does not regress below the declared floor.
import {existsSync, readFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import {pageFile} from "./entitymap.mjs";

const toolRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSET_TYPES = new Set(["calculator", "template", "dataset", "sample", "reference"]);

export function validateInfoGain(root = toolRoot) {
    const problems = [];
    const path = join(root, "docs/seo/info-gain.json");
    if (!existsSync(path)) return ["docs/seo/info-gain.json is missing."];

    let manifest;
    try {
        manifest = JSON.parse(readFileSync(path, "utf8"));
    } catch (error) {
        return [`docs/seo/info-gain.json is invalid JSON: ${error.message}`];
    }

    let pages = {};
    try {
        pages = JSON.parse(readFileSync(join(root, "entitymap.json"), "utf8")).pages || {};
    } catch {
        return ["info-gain: cannot read entitymap.json pages."];
    }

    const fail = (message) => problems.push(`info-gain: ${message}`);
    if (!manifest.pages || typeof manifest.pages !== "object") return ["info-gain: manifest has no pages object."];
    if (typeof manifest.requiredCoverage !== "number") fail("requiredCoverage must be a number.");

    const entries = Object.entries(manifest.pages);
    for (const [url, entry] of entries) {
        if (!(url in pages)) {
            fail(`${url} is not a page in entitymap.json.`);
            continue;
        }
        if (!entry.asset || typeof entry.asset !== "string") fail(`${url}: asset label is missing.`);
        if (!ASSET_TYPES.has(entry.type)) fail(`${url}: type "${entry.type}" is not one of ${[...ASSET_TYPES].join(", ")}.`);
        if (!entry.proof) {
            fail(`${url}: proof string is missing.`);
            continue;
        }
        const file = pageFile(url, root);
        if (!existsSync(file)) {
            fail(`${url}: page file is missing.`);
            continue;
        }
        const html = readFileSync(file, "utf8");
        if (!html.includes(entry.proof)) fail(`${url}: proof "${entry.proof}" no longer appears in the page.`);
    }

    if (typeof manifest.requiredCoverage === "number" && entries.length < manifest.requiredCoverage) {
        fail(`coverage dropped to ${entries.length} pages, below the floor of ${manifest.requiredCoverage}.`);
    }

    return problems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    const problems = validateInfoGain();
    if (problems.length) {
        console.error(`info-gain check failed with ${problems.length} issue(s):`);
        for (const problem of problems) console.error(`- ${problem}`);
        process.exit(1);
    }
    const manifest = JSON.parse(readFileSync(join(toolRoot, "docs/seo/info-gain.json"), "utf8"));
    const byType = {};
    for (const entry of Object.values(manifest.pages)) byType[entry.type] = (byType[entry.type] || 0) + 1;
    console.log(`info-gain OK: ${Object.keys(manifest.pages).length} pages with a unique asset (${Object.entries(byType).map(([k, v]) => `${k} ${v}`).join(", ")}).`);
}
