import assert from "node:assert/strict";
import {afterEach, test} from "node:test";
import {
    existsSync,
    lstatSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    realpathSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, join, relative, sep} from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const fixtureRoots = new Set();
const generatedStart = "<!-- entitymap:generated:start -->";
const generatedEnd = "<!-- entitymap:generated:end -->";
const htmlRelativePath = join("entitymap", "index.html");

function writeFixtureFile(root, path, content) {
    const target = join(root, path);
    mkdirSync(dirname(target), {recursive: true});
    writeFileSync(target, content);
}

function sourcePagePath(route) {
    const relativeRoute = route.replace(/^\//, "");
    const candidates = relativeRoute
        ? [join(relativeRoute, "index.html"), relativeRoute.endsWith(".html") ? relativeRoute : `${relativeRoute}.html`]
        : ["index.html"];
    const match = candidates.find((candidate) => existsSync(join(repoRoot, candidate)));
    assert.ok(match, `canonical source page exists for ${route}`);
    return match;
}

function createFixture() {
    const root = mkdtempSync(join(tmpdir(), "tehis_entity_test_"));
    fixtureRoots.add(root);

    const map = JSON.parse(readFileSync(join(repoRoot, "entitymap.json"), "utf8"));
    writeFixtureFile(root, "entitymap.json", JSON.stringify(map, null, 2));
    writeFixtureFile(root, "sitemap.xml", readFileSync(join(repoRoot, "sitemap.xml"), "utf8"));
    writeFixtureFile(root, "tools/entitymap.mjs", readFileSync(join(repoRoot, "tools/entitymap.mjs"), "utf8"));

    const routes = new Set(["/", ...Object.keys(map.pages)]);
    for (const route of routes) {
        const sourcePath = sourcePagePath(route);
        writeFixtureFile(root, sourcePath, readFileSync(join(repoRoot, sourcePath)));
    }
    // The public map page is separately validated as a mapped page, and is also the renderer's target.
    writeFixtureFile(root, htmlRelativePath, readFileSync(join(repoRoot, htmlRelativePath)));

    const target = join(root, htmlRelativePath);
    const realRoot = realpathSync(root);
    const realTarget = realpathSync(target);
    assert.equal(lstatSync(target).isSymbolicLink(), false, "writable fixture target is not a symlink");
    assert.ok(relative(realRoot, realTarget).split(sep)[0] !== "..", "writable target is inside the disposable fixture");
    return {root, target, map};
}

function runEntitymap(root, ...args) {
    return spawnSync(process.execPath, [join(root, "tools/entitymap.mjs"), ...args], {
        cwd: root,
        encoding: "utf8",
    });
}

function assertSuccessful(result, message) {
    assert.equal(result.error, undefined, `${message}: ${result.error?.message ?? "child process started"}`);
    assert.equal(result.status, 0, `${message}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
}

function generatedRegion(html) {
    const start = html.indexOf(generatedStart);
    const end = html.indexOf(generatedEnd);
    assert.notEqual(start, -1, "start marker is present");
    assert.ok(end > start, "end marker follows start marker");
    return html.slice(start + generatedStart.length, end);
}

afterEach(() => {
    for (const root of fixtureRoots) rmSync(root, {recursive: true, force: true});
    fixtureRoots.clear();
});

test("default validation accepts a current map and leaves its HTML byte-for-byte unchanged", () => {
    const {root, target} = createFixture();
    assertSuccessful(runEntitymap(root, "--render"), "prepare a current fixture using the real renderer");
    const before = readFileSync(target);

    const result = runEntitymap(root);

    assertSuccessful(result, "read-only default validation");
    assert.match(result.stdout, /entitymap OK: .*HTML map parity verified/);
    assert.deepEqual(readFileSync(target), before, "default validation does not write the HTML target");
});

test("default validation rejects a stale generated region without changing HTML", () => {
    const {root, target} = createFixture();
    assertSuccessful(runEntitymap(root, "--render"), "prepare a current fixture using the real renderer");
    const before = readFileSync(target, "utf8").replace("<div class=\"entity-map\">", "<div class=\"entity-map\">stale");
    writeFileSync(target, before);

    const result = runEntitymap(root);

    assert.equal(result.status, 1, `stale check should fail\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
    assert.match(result.stderr, /generated region is stale or empty/);
    assert.equal(readFileSync(target, "utf8"), before, "failed validation leaves stale HTML untouched");
});

test("--render repairs a stale region and preserves all authored HTML around its markers", () => {
    const {root, target} = createFixture();
    const authored = readFileSync(target, "utf8");
    const start = authored.indexOf(generatedStart);
    const end = authored.indexOf(generatedEnd);
    assert.ok(start >= 0 && end > start, "canonical page has ordered generated-region markers");
    const prefix = authored.slice(0, start + generatedStart.length);
    const suffix = authored.slice(end);
    const stale = `${prefix}\n<p>stale fixture content</p>\n${suffix}`;
    writeFileSync(target, stale);

    const result = runEntitymap(root, "--render");
    const rendered = readFileSync(target, "utf8");

    assertSuccessful(result, "render stale generated region");
    assert.match(result.stdout, /HTML map rendered and parity verified/);
    assert.ok(rendered.startsWith(prefix), "authored content before the generated region is unchanged");
    assert.ok(rendered.endsWith(suffix), "authored content after the generated region is unchanged");
    assert.match(generatedRegion(rendered), /<div class=\"entity-map\">/);
    assert.match(generatedRegion(rendered), /Tehisabiline OÜ/);
    assert.doesNotMatch(generatedRegion(rendered), /stale fixture content/);
    assertSuccessful(runEntitymap(root), "validate the repaired output");
});

test("--render fills an empty generated region with canonical entity-map content", () => {
    const {root, target} = createFixture();

    const result = runEntitymap(root, "--render");
    const rendered = readFileSync(target, "utf8");

    assertSuccessful(result, "render an empty generated region");
    assert.match(generatedRegion(rendered), /<div class=\"entity-map\">/);
    assert.match(generatedRegion(rendered), /Teenusesõlmed/);
    assertSuccessful(runEntitymap(root), "validate the newly rendered output");
});

test("a second --render is byte-for-byte idempotent", () => {
    const {root, target} = createFixture();
    assertSuccessful(runEntitymap(root, "--render"), "first render");
    const firstRender = readFileSync(target);

    const result = runEntitymap(root, "--render");

    assertSuccessful(result, "second render");
    assert.deepEqual(readFileSync(target), firstRender, "second render leaves the complete HTML file unchanged");
});

test("missing or duplicate markers fail without modifying the HTML target", () => {
    for (const [caseName, mutate] of [
        ["missing end marker", (html) => html.replace(generatedEnd, "")],
        ["duplicate start marker", (html) => html.replace(generatedStart, `${generatedStart}${generatedStart}`)],
    ]) {
        const {root, target} = createFixture();
        const original = readFileSync(target, "utf8");
        const modified = mutate(original);
        writeFileSync(target, modified);

        const result = runEntitymap(root, "--render");

        assert.equal(result.status, 1, `${caseName} should fail\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
        assert.match(result.stderr, /exactly one/);
        assert.equal(readFileSync(target, "utf8"), modified, `${caseName} must not modify HTML`);
    }
});

test("invalid canonical graph data fails before --render writes HTML", () => {
    const {root, target, map} = createFixture();
    assertSuccessful(runEntitymap(root, "--render"), "prepare a current fixture using the real renderer");
    const before = readFileSync(target);
    map.origin = "https://wrong.example";
    writeFixtureFile(root, "entitymap.json", JSON.stringify(map, null, 2));

    const result = runEntitymap(root, "--render");

    assert.equal(result.status, 1, `invalid graph should fail\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
    assert.match(result.stderr, /origin must be https:\/\/tehisabiline\.ee/);
    assert.deepEqual(readFileSync(target), before, "graph validation failure occurs before HTML writes");
});

