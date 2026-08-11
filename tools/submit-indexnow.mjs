import {readFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const key = "5f126675c51465984e48a3d63ec60940";
const site = new URL(process.env.SITE_URL || "https://tehisabiline.ee/");
const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map((match) => match[1]);

if (!urlList.length) {
    throw new Error("Sitemap does not contain any HTTPS URLs.");
}

for (const url of urlList) {
    if (new URL(url).host !== site.host) {
        throw new Error(`Refusing to submit a URL outside ${site.host}: ${url}`);
    }
}

const payload = {
    host: site.host,
    key,
    keyLocation: `${site.origin}/${key}.txt`,
    urlList
};

if (process.argv.includes("--dry-run")) {
    console.log(JSON.stringify(payload, null, 2));
    process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {"Content-Type": "application/json; charset=utf-8"},
    body: JSON.stringify(payload)
});

const body = await response.text();
if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow returned ${response.status}: ${body || response.statusText}`);
}

console.log(`IndexNow accepted ${urlList.length} URLs with status ${response.status}.`);
