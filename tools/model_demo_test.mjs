import test from "node:test";
import assert from "node:assert/strict";
import { createSseDecoder, parseMarkdown } from "../assets/js/model_demo.mjs";

function encodedChunks(text, splitAt) {
    const bytes = new TextEncoder().encode(text);
    return [bytes.slice(0, splitAt), bytes.slice(splitAt)];
}

test("SSE decoder handles split frames and split UTF-8 characters", () => {
    const events = [];
    const decoder = createSseDecoder((event) => events.push(event));
    const payload = 'data: {"delta":"Tere õ"}\n\ndata: {"done":true,"finish_reason":"stop"}\n\n';
    const split = payload.indexOf("õ") + 1;
    for (const chunk of encodedChunks(payload, split)) decoder.push(chunk);
    decoder.finish();

    assert.deepEqual(events, [
        { delta: "Tere õ" },
        { done: true, finish_reason: "stop" },
    ]);
});

test("SSE decoder ignores comments and malformed events", () => {
    const events = [];
    const decoder = createSseDecoder((event) => events.push(event));
    decoder.push(new TextEncoder().encode(": ping\n\ndata: not-json\n\ndata: {\"delta\":\"safe\"}\n\n"));
    decoder.finish();
    assert.deepEqual(events, [{ delta: "safe" }]);
});

test("Markdown turns headings, lists, bold, and inline code into semantic blocks", () => {
    assert.deepEqual(parseMarkdown(
        "### 3. Test for typical web vulnerabilities\n\n- **Validate** inputs\n- Keep `**literal**` unchanged\n\n1. First step\n2. Second step",
    ), [
        {
            type: "heading",
            level: 3,
            children: [{ type: "text", text: "3. Test for typical web vulnerabilities" }],
        },
        {
            type: "unordered-list",
            items: [
                [
                    { type: "strong", children: [{ type: "text", text: "Validate" }] },
                    { type: "text", text: " inputs" },
                ],
                [
                    { type: "text", text: "Keep " },
                    { type: "code", text: "**literal**" },
                    { type: "text", text: " unchanged" },
                ],
            ],
        },
        {
            type: "ordered-list",
            items: [
                [{ type: "text", text: "First step" }],
                [{ type: "text", text: "Second step" }],
            ],
        },
    ]);
});

test("Markdown keeps loose ordered items together and preserves their start", () => {
    assert.deepEqual(parseMarkdown("3. First step\n\n4. Second step"), [
        {
            type: "ordered-list",
            start: 3,
            items: [
                [{ type: "text", text: "First step" }],
                [{ type: "text", text: "Second step" }],
            ],
        },
    ]);
});

test("Markdown keeps raw HTML inert and rejects unsafe link protocols", () => {
    assert.deepEqual(parseMarkdown(
        '<img src=x onerror="alert(1)"> and [run](javascript:alert(1))',
    ), [
        {
            type: "paragraph",
            children: [{
                type: "text",
                text: '<img src=x onerror="alert(1)"> and [run](javascript:alert(1))',
            }],
        },
    ]);
});

test("Markdown fenced code preserves markup and Markdown punctuation verbatim", () => {
    assert.deepEqual(parseMarkdown(
        "```html\n### Heading **literal**\n<script>alert(1)</script>\n```",
    ), [
        {
            type: "code-block",
            text: "### Heading **literal**\n<script>alert(1)</script>",
        },
    ]);
});

test("Markdown accepts safe links as links", () => {
    assert.deepEqual(parseMarkdown("See [docs](https://example.com/guide) now."), [
        {
            type: "paragraph",
            children: [
                { type: "text", text: "See " },
                {
                    type: "link",
                    href: "https://example.com/guide",
                    children: [{ type: "text", text: "docs" }],
                },
                { type: "text", text: " now." },
            ],
        },
    ]);
});
