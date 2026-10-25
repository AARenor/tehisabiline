// Canonical entity map enforcement for tehisabiline.ee.
//
// entitymap.json is the single source of truth for the Organization, Person,
// Service and Topic nodes the site publishes. This module checks that:
//   1. the map itself is internally consistent;
//   2. the sitemap and the map describe exactly the same page set;
//   3. every JSON-LD node on every page agrees with the map (no drift, no
//      second Organization with a different name, URL, logo or profile set);
//   4. the homepage publishes the full canonical Organization.
//
// Run standalone: `node tools/entitymap.mjs`
// Or via `npm run test:seo`, which imports validateEntityMap().
import {existsSync, readFileSync, readdirSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const toolRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

// Asset URLs carry a content-hash cache buster (?v=...) that changes on rebuild.
// The map stores them without the hash, so comparisons strip it.
const stripVersion = (value) =>
    typeof value === "string" ? value.replace(/([?&])v=[^&#]*/g, "").replace(/[?&]$/, "") : value;

function normalize(value) {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === "object") {
        const out = {};
        for (const key of Object.keys(value).sort()) out[key] = normalize(value[key]);
        return out;
    }
    return stripVersion(value);
}

const stable = (value) => JSON.stringify(normalize(value));

const urlPath = (value) => {
    if (typeof value !== "string") return null;
    try {
        return new URL(value, "https://tehisabiline.ee").pathname;
    } catch {
        return null;
    }
};

export function pageFile(urlPathname, root = toolRoot) {
    const relative = urlPathname.replace(/^\//, "");
    if (!relative) return "index.html";
    const candidate = join(root, relative.endsWith("/") ? `${relative}index.html` : relative);
    if (existsSync(candidate)) return candidate;
    if (existsSync(join(root, `${relative}/index.html`))) return join(root, `${relative}/index.html`);
    return candidate;
}

function sitemapPaths(root) {
    const xml = readFileSync(join(root, "sitemap.xml"), "utf8");
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => urlPath(match[1].trim()));
}

function pageJsonLd(html) {
    const blocks = [...html.matchAll(/<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
        .map((match) => match[1].trim());
    const nodes = [];
    for (const block of blocks) {
        let data;
        try {
            data = JSON.parse(block);
        } catch {
            continue; // seo-check reports JSON errors with page context.
        }
        nodes.push(...(Array.isArray(data["@graph"]) ? data["@graph"] : [data]));
    }
    return nodes;
}

const typesOf = (node) => (Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]]);

export function validateEntityMap(root = toolRoot) {
    const problems = [];
    const mapPath = join(root, "entitymap.json");
    if (!existsSync(mapPath)) return ["entitymap.json is missing."];

    let map;
    try {
        map = JSON.parse(readFileSync(mapPath, "utf8"));
    } catch (error) {
        return [`entitymap.json is invalid JSON: ${error.message}`];
    }

    const origin = "https://tehisabiline.ee";
    const fail = (message) => problems.push(`entitymap: ${message}`);

    if (map.version !== 1) fail(`version must be 1, found ${JSON.stringify(map.version)}.`);
    if (map.origin !== origin) fail(`origin must be ${origin}.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(map.updated))) fail("updated must be an ISO date.");

    for (const key of ["organization", "person", "services", "topics", "clusters", "pages"]) {
        if (!map[key]) fail(`missing required key "${key}".`);
    }
    if (problems.length) return problems;

    const {organization: org, person, services, topics, clusters, pages} = map;

    if (org["@id"] !== `${origin}/#organization`) fail(`organization @id must be ${origin}/#organization.`);
    if (person["@id"] !== `${origin}/#founder`) fail(`person @id must be ${origin}/#founder.`);
    if (stripVersion(person.worksFor?.["@id"]) !== stripVersion(org["@id"])) fail("person.worksFor must reference the organization @id.");

    for (const [label, node] of [["organization", org], ["person", person]]) {
        if (!Array.isArray(node.sameAs) || node.sameAs.length === 0) fail(`${label}.sameAs must list public profiles.`);
        for (const url of node.sameAs || []) {
            if (!/^https:\/\//.test(url)) fail(`${label}.sameAs has a non-https URL: ${url}`);
        }
        if (!Array.isArray(node.knowsAbout) || node.knowsAbout.length === 0) fail(`${label}.knowsAbout must list topics.`);
        const duplicates = (node.knowsAbout || []).filter((term, index, all) => all.indexOf(term) !== index);
        if (duplicates.length) fail(`${label}.knowsAbout repeats: ${[...new Set(duplicates)].join(", ")}.`);
    }

    // Pages <-> sitemap must match exactly.
    const sitemap = sitemapPaths(root);
    const mapped = Object.keys(pages);
    const missing = sitemap.filter((url) => !(url in pages));
    const extra = mapped.filter((url) => !sitemap.includes(url));
    if (missing.length) fail(`pages are missing sitemap URLs: ${missing.join(", ")}.`);
    if (extra.length) fail(`pages list URLs that are not in sitemap.xml: ${extra.join(", ")}.`);

    // Clusters must be bidirectionally consistent with pages.
    const clusterIds = new Set();
    for (const cluster of clusters) {
        if (clusterIds.has(cluster.id)) fail(`duplicate cluster id "${cluster.id}".`);
        clusterIds.add(cluster.id);
        if (!cluster.pages?.includes(cluster.hub)) fail(`cluster "${cluster.id}" hub ${cluster.hub} is not one of its pages.`);
        for (const url of cluster.pages || []) {
            if (pages[url] !== cluster.id) fail(`cluster "${cluster.id}" lists ${url}, but pages maps it to ${pages[url] ?? "nothing"}.`);
        }
    }
    for (const [url, clusterId] of Object.entries(pages)) {
        if (!clusterIds.has(clusterId)) fail(`${url} points at unknown cluster "${clusterId}".`);
    }

    // Topics: hubs exist and every canonical knowsAbout term is covered exactly once.
    const covered = new Map();
    const topicIds = new Set();
    for (const topic of topics) {
        if (topicIds.has(topic.id)) fail(`duplicate topic id "${topic.id}".`);
        topicIds.add(topic.id);
        if (topic.hub && !(topic.hub in pages)) fail(`topic "${topic.id}" hub ${topic.hub} is not a mapped page.`);
        for (const url of topic.sameAs || []) {
            if (!/^https:\/\//.test(url)) fail(`topic "${topic.id}" sameAs has a non-https URL: ${url}`);
        }
        for (const term of topic.knowsAbout || []) {
            if (!org.knowsAbout.includes(term)) fail(`topic "${topic.id}" claims knowsAbout "${term}" that the organization does not list.`);
            if (covered.has(term)) fail(`knowsAbout "${term}" is covered by both "${covered.get(term)}" and "${topic.id}".`);
            covered.set(term, topic.id);
        }
    }
    for (const term of org.knowsAbout) {
        if (!covered.has(term)) fail(`knowsAbout "${term}" is not assigned to any topic in the map.`);
    }

    // Services: pages and names must resolve.
    for (const service of services) {
        if (!(service.url in pages)) fail(`service "${service.id}" points at unmapped page ${service.url}.`);
        if (!service.name || !service.serviceType) fail(`service "${service.id}" needs name and serviceType.`);
    }
    const serviceUrls = new Set(services.map((service) => service.url));

    // Page-by-page drift check against the canonical nodes.
    // Identity fields are strict; descriptive fields may be narrowed or translated,
    // but never widened beyond the canonical vocabulary.
    const contactPoints = [org.contactPoint, ...(org.contactPointVariants || [])];
    const personUrls = [person.url, ...(person.urlAliases || [])];
    const personTitles = [person.jobTitle, ...(person.jobTitleAliases || [])];
    const orgStrictKeys = ["legalName", "identifier", "foundingDate", "alternateName", "image", "email", "founder", "address", "areaServed"];

    for (const [url, clusterId] of Object.entries(pages)) {
        const file = pageFile(url);
        if (!existsSync(file)) {
            fail(`no file for ${url} (expected ${file}).`);
            continue;
        }
        const nodes = pageJsonLd(readFileSync(file, "utf8"));
        for (const node of nodes) {
            const types = typesOf(node);
            if (types.includes("Organization")) {
                if (stripVersion(node["@id"]) !== stripVersion(org["@id"])) {
                    fail(`${url}: Organization must use @id ${org["@id"]} (found ${node["@id"] ?? "none"}).`);
                }
                if (node.name !== org.name) fail(`${url}: Organization name "${node.name}" differs from "${org.name}".`);
                if (node.url && stripVersion(node.url) !== stripVersion(org.url)) fail(`${url}: Organization.url must be ${org.url}.`);
                if (node.logo && stable(node.logo) !== stable(org.logo)) fail(`${url}: Organization.logo differs from the canonical logo.`);
                for (const profile of node.sameAs || []) {
                    if (!org.sameAs.includes(profile)) fail(`${url}: Organization.sameAs lists ${profile}, which is not in the canonical map.`);
                }
                for (const term of node.knowsAbout || []) {
                    if (!org.knowsAbout.includes(term)) fail(`${url}: Organization.knowsAbout lists "${term}", which is not in the canonical vocabulary.`);
                }
                if (node.contactPoint && !contactPoints.some((candidate) => stable(candidate) === stable(node.contactPoint))) {
                    fail(`${url}: Organization.contactPoint is neither the canonical contact nor a declared variant.`);
                }
                for (const key of orgStrictKeys) {
                    if (key in node && stable(node[key]) !== stable(org[key])) {
                        fail(`${url}: Organization.${key} differs from the canonical value.`);
                    }
                }
                for (const key of Object.keys(node)) {
                    if (key === "description" || key === "contactPoint") continue;
                    if (!(key in org)) fail(`${url}: Organization publishes "${key}", which is not in the canonical map.`);
                }
            }
            if (types.includes("Person") && stripVersion(node["@id"]) === stripVersion(person["@id"])) {
                if (node.name !== person.name) fail(`${url}: Person name "${node.name}" differs from "${person.name}".`);
                if (node.url && !personUrls.includes(node.url)) fail(`${url}: Person.url ${node.url} is not a declared author URL.`);
                if (node.jobTitle && !personTitles.includes(node.jobTitle)) fail(`${url}: Person.jobTitle "${node.jobTitle}" is not a declared title.`);
                if (node.worksFor && stripVersion(node.worksFor["@id"]) !== stripVersion(org["@id"])) fail(`${url}: Person.worksFor must reference the canonical organization.`);
                for (const profile of node.sameAs || []) {
                    if (!person.sameAs.includes(profile)) fail(`${url}: Person.sameAs lists ${profile}, which is not in the canonical map.`);
                }
                for (const term of node.knowsAbout || []) {
                    if (!person.knowsAbout.includes(term)) fail(`${url}: Person.knowsAbout lists "${term}", which is not in the canonical vocabulary.`);
                }
                for (const key of Object.keys(node)) {
                    if (["description", "url", "jobTitle", "sameAs", "knowsAbout", "worksFor"].includes(key)) continue;
                    if (key === "image" && stable(node.image) === stable(person.image)) continue;
                    if (!(key in person)) fail(`${url}: Person publishes "${key}", which is not in the canonical map.`);
                    else if (stable(node[key]) !== stable(person[key])) fail(`${url}: Person.${key} differs from the canonical value.`);
                }
            }
            if (types.includes("Service") && node.url) {
                const path = urlPath(node.url);
                if (path && !pages[path]) fail(`${url}: Service.url ${node.url} is not a mapped page.`);
            }
        }
    }

    // The homepage must publish the full canonical Organization, not a thin copy.
    const homeFile = pageFile("/");
    if (existsSync(homeFile)) {
        const homeOrg = pageJsonLd(readFileSync(homeFile, "utf8"))
            .find((node) => typesOf(node).includes("Organization") && stripVersion(node["@id"]) === stripVersion(org["@id"]));
        if (!homeOrg) fail("index.html must publish the canonical Organization node.");
        else {
            const metaKeys = new Set(["$comment", "contactPointVariants", "urlAliases", "jobTitleAliases", "knowsLanguage"]);
            const compare = (node) => Object.fromEntries(Object.entries(node).filter(([key]) => !metaKeys.has(key)));
            const differing = [...new Set([...Object.keys(homeOrg), ...Object.keys(compare(org))])]
                .filter((key) => stable(homeOrg[key]) !== stable(compare(org)[key]));
            if (differing.length) fail(`index.html Organization differs from the canonical map in: ${differing.join(", ")}.`);
        }
    }

    return problems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    const problems = validateEntityMap();
    if (problems.length) {
        console.error(`entitymap check failed with ${problems.length} issue(s):`);
        for (const problem of problems) console.error(`- ${problem}`);
        process.exit(1);
    }
    const map = JSON.parse(readFileSync(join(toolRoot, "entitymap.json"), "utf8"));
    console.log(`entitymap OK: ${Object.keys(map.pages).length} pages, ${map.clusters.length} clusters, ${map.topics.length} topics, ${map.services.length} services.`);
}
