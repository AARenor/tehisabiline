// Keeps JSON-LD FAQPage answers identical to the answer text readers see.
//
// Source of truth: the visible FAQ disclosure.
//   <details><summary><h3>Question</h3>…</summary><div class="answer">Answer…</div></details>
// The question text must already match; this script rewrites only `acceptedAnswer.text`,
// taking the stripped text of the visible answer (inline markup removed, entities decoded,
// whitespace collapsed). A question with no visible counterpart is reported, never invented.
//
//   node tools/sync-faq.mjs            rewrite JSON-LD in place
//   node tools/sync-faq.mjs --check    list drift and exit 1 (no writes)
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SKIP = new Set(["node_modules", ".git", ".vercel", ".opencode", ".impeccable", "output", ".playwright-cli", "docs", "tools", "assets"]);
const check = process.argv.includes("--check");

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…", euro: "€", times: "×", copy: "©", reg: "®" };
const decode = (text) =>
    text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (all, body) => {
        if (body[0] === "#") {
            const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
            return Number.isFinite(code) ? String.fromCodePoint(code) : all;
        }
        return Object.prototype.hasOwnProperty.call(NAMED, body) ? NAMED[body] : all;
    });
const plain = (html) => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

function* pages(dir) {
    for (const name of readdirSync(dir)) {
        if (SKIP.has(name) || name.startsWith(".")) continue;
        const full = join(dir, name);
        if (statSync(full).isDirectory()) yield* pages(full);
        else if (name.endsWith(".html")) yield full;
    }
}

// Visible question -> answer text, in document order.
function visibleFaq(html) {
    const pairs = new Map();
    const details = html.matchAll(/<details\b[\s\S]*?<\/details>/g);
    for (const block of details) {
        const question = block[0].match(/<summary\b[\s\S]*?<h3\b[^>]*>([\s\S]*?)<\/h3>/)?.[1];
        const answer = block[0].match(/<div class="answer"[^>]*>([\s\S]*?)<\/details>/)?.[1] ?? block[0].match(/<p class="answer"[^>]*>([\s\S]*?)<\/details>/)?.[1];
        if (!question || !answer) continue;
        const key = plain(question);
        if (!pairs.has(key)) pairs.set(key, plain(answer));
    }
    return pairs;
}

// JSON string literal starting at index of the opening quote.
function readLiteral(text, start) {
    let i = start + 1;
    while (i < text.length) {
        const ch = text[i];
        if (ch === "\\") { i += 2; continue; }
        if (ch === '"') return { raw: text.slice(start, i + 1), end: i + 1 };
        i += 1;
    }
    return null;
}

let files = 0, rewritten = 0;
const orphans = [];
for (const file of pages(root)) {
    const html = readFileSync(file, "utf8");
    if (!html.includes("FAQPage")) continue;
    const pairs = visibleFaq(html);
    if (!pairs.size) continue;
    const rel = relative(root, file);
    const blockRe = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g;
    let out = "", last = 0, touched = 0, m;
    while ((m = blockRe.exec(html))) {
        let body = m[2];
        let parsed;
        try { parsed = JSON.parse(body); } catch { continue; }
        const nodes = parsed["@graph"] || (Array.isArray(parsed) ? parsed : [parsed]);
        const faqPage = nodes.find((node) => {
            const t = node && node["@type"];
            return (Array.isArray(t) ? t : [t]).includes("FAQPage");
        });
        if (!faqPage) continue;
        let cursor = 0;
        for (const entity of faqPage.mainEntity || []) {
            const question = plain(String(entity.name || ""));
            const answer = pairs.get(question);
            if (!answer) { orphans.push(`${rel}: no visible answer for "${question}"`); continue; }
            const old = entity.acceptedAnswer?.text;
            if (typeof old === "string" && old.replace(/\s+/g, " ").trim() === answer) continue;
            const nameAt = body.indexOf(JSON.stringify(question).slice(0, 12), cursor);
            const textAt = nameAt < 0 ? body.indexOf('"text":', cursor) : body.indexOf('"text":', nameAt);
            if (textAt < 0) { orphans.push(`${rel}: no "text" property for "${question}"`); continue; }
            const quoteAt = body.indexOf('"', textAt + 7);
            const literal = quoteAt < 0 ? null : readLiteral(body, quoteAt);
            if (!literal) { orphans.push(`${rel}: unreadable literal for "${question}"`); continue; }
            body = body.slice(0, quoteAt) + JSON.stringify(answer) + body.slice(literal.end);
            cursor = quoteAt + JSON.stringify(answer).length;
            touched += 1;
        }
        try {
            JSON.parse(body);
        } catch (error) {
            console.error(`SKIP ${rel}: edit would break JSON (${error.message})`);
            touched = 0;
            continue;
        }
        out += html.slice(last, m.index) + m[1] + body + m[3];
        last = m.index + m[0].length;
    }
    if (!touched) continue;
    rewritten += touched;
    files += 1;
    if (!check) writeFileSync(file, out + html.slice(last));
}

for (const line of orphans) console.log(line);
if (check) {
    console.log(`faq parity: ${rewritten} answer(s) differ in ${files} file(s).`);
    process.exit(rewritten ? 1 : 0);
}
console.log(`faq parity: ${rewritten} answer(s) rewritten in ${files} file(s).`);
