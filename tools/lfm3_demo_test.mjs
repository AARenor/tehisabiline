import test from "node:test";
import assert from "node:assert/strict";
import { createSseDecoder } from "../assets/js/lfm3_demo.mjs";

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
