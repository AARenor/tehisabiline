export function createSseDecoder(onEvent) {
    const textDecoder = new TextDecoder();
    let buffer = "";
    let data = [];

    function dispatch() {
        if (!data.length) return;
        try {
            onEvent(JSON.parse(data.join("\n")));
        } catch {
            // Ignore malformed or unrelated upstream events.
        }
        data = [];
    }

    function processLine(line) {
        if (line === "") {
            dispatch();
            return;
        }
        if (line.startsWith(":")) return;
        if (line.startsWith("data:")) {
            data.push(line.slice(5).replace(/^ /, ""));
        }
    }

    return {
        push(bytes) {
            buffer += textDecoder.decode(bytes, { stream: true });
            let newline;
            while ((newline = buffer.indexOf("\n")) !== -1) {
                processLine(buffer.slice(0, newline).replace(/\r$/, ""));
                buffer = buffer.slice(newline + 1);
            }
        },
        finish() {
            buffer += textDecoder.decode();
            if (buffer) processLine(buffer.replace(/\r$/, ""));
            dispatch();
            buffer = "";
        },
    };
}

function pushText(nodes, text) {
    if (!text) return;
    const previous = nodes[nodes.length - 1];
    if (previous?.type === "text") previous.text += text;
    else nodes.push({ type: "text", text });
}

function safeMarkdownHref(value) {
    if (!value || /[\u0000-\u0020\u007f]/.test(value)) return null;
    try {
        const url = new URL(value, "https://tehisabiline.ee");
        if (!["http:", "https:", "mailto:"].includes(url.protocol)) return null;
        if (url.protocol !== "mailto:" && (url.username || url.password)) return null;
        if (url.protocol === "mailto:" && !url.pathname) return null;
        return url.href;
    } catch {
        return null;
    }
}

function parseInline(text) {
    const nodes = [];
    let cursor = 0;
    let plainStart = 0;
    const flushText = (end) => pushText(nodes, text.slice(plainStart, end));

    while (cursor < text.length) {
        if (text[cursor] === "`") {
            const opening = /^`+/.exec(text.slice(cursor))[0];
            const closing = text.indexOf(opening, cursor + opening.length);
            if (closing !== -1) {
                flushText(cursor);
                nodes.push({ type: "code", text: text.slice(cursor + opening.length, closing) });
                cursor = closing + opening.length;
                plainStart = cursor;
                continue;
            }
        }

        const marker = text.startsWith("**", cursor)
            ? "**"
            : text.startsWith("__", cursor)
                ? "__"
                : null;
        if (marker) {
            const closing = text.indexOf(marker, cursor + marker.length);
            if (closing > cursor + marker.length) {
                flushText(cursor);
                nodes.push({
                    type: "strong",
                    children: [{ type: "text", text: text.slice(cursor + marker.length, closing) }],
                });
                cursor = closing + marker.length;
                plainStart = cursor;
                continue;
            }
        }

        if (text[cursor] === "[") {
            const link = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(text.slice(cursor));
            const href = link ? safeMarkdownHref(link[2]) : null;
            if (link && href) {
                flushText(cursor);
                nodes.push({
                    type: "link",
                    href,
                    children: [{ type: "text", text: link[1] }],
                });
                cursor += link[0].length;
                plainStart = cursor;
                continue;
            }
        }

        cursor++;
    }

    flushText(text.length);
    return nodes;
}

export function parseMarkdown(markdown) {
    const lines = String(markdown ?? "").replace(/\r\n?/g, "\n").split("\n");
    const blocks = [];
    let paragraph = [];
    let listType = null;
    let listStart = null;
    let listItems = [];
    let codeFence = null;
    let codeLines = [];

    function flushParagraph() {
        if (!paragraph.length) return;
        blocks.push({ type: "paragraph", children: parseInline(paragraph.join(" ")) });
        paragraph = [];
    }

    function flushList() {
        if (!listType) return;
        const block = { type: listType, items: listItems };
        if (listType === "ordered-list" && listStart !== 1) block.start = listStart;
        blocks.push(block);
        listType = null;
        listStart = null;
        listItems = [];
    }

    for (const line of lines) {
        if (codeFence) {
            if (codeFence.closing.test(line)) {
                blocks.push({ type: "code-block", text: codeLines.join("\n") });
                codeFence = null;
                codeLines = [];
            } else {
                codeLines.push(line);
            }
            continue;
        }

        const fence = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
        if (fence) {
            flushParagraph();
            flushList();
            codeFence = {
                closing: new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}[ \\t]*$`),
            };
            codeLines = [];
            continue;
        }

        const heading = /^ {0,3}(#{1,6})(?:[ \t]+|$)(.*)$/.exec(line);
        if (heading) {
            flushParagraph();
            flushList();
            const content = heading[2].replace(/[ \t]+#+[ \t]*$/, "");
            blocks.push({
                type: "heading",
                level: heading[1].length,
                children: parseInline(content),
            });
            continue;
        }

        if (!line.trim()) {
            flushParagraph();
            continue;
        }

        const unordered = /^ {0,3}[-+*][ \t]+(.+)$/.exec(line);
        const ordered = /^ {0,3}(\d{1,9})[.)][ \t]+(.+)$/.exec(line);
        if (unordered || ordered) {
            flushParagraph();
            const nextType = ordered ? "ordered-list" : "unordered-list";
            if (listType && listType !== nextType) flushList();
            if (!listType) {
                listType = nextType;
                listStart = ordered ? Number(ordered[1]) : null;
            }
            listItems.push(parseInline(unordered ? unordered[1] : ordered[2]));
            continue;
        }

        flushList();
        paragraph.push(line);
    }

    flushParagraph();
    flushList();
    if (codeFence) blocks.push({ type: "code-block", text: codeLines.join("\n") });
    return blocks;
}

function appendInline(parent, nodes, doc) {
    for (const inline of nodes) {
        if (inline.type === "text") {
            parent.appendChild(doc.createTextNode(inline.text));
            continue;
        }

        const element = doc.createElement(
            inline.type === "strong" ? "strong" : inline.type === "code" ? "code" : "a",
        );
        if (inline.type === "link") element.href = inline.href;
        if (inline.type === "code") element.textContent = inline.text;
        else appendInline(element, inline.children, doc);
        parent.appendChild(element);
    }
}

export function renderMarkdown(container, markdown) {
    const doc = container.ownerDocument;
    const fragment = doc.createDocumentFragment();

    for (const block of parseMarkdown(markdown)) {
        let element;
        if (block.type === "heading") {
            element = doc.createElement(`h${block.level}`);
            appendInline(element, block.children, doc);
        } else if (block.type === "paragraph") {
            element = doc.createElement("p");
            appendInline(element, block.children, doc);
        } else if (block.type === "unordered-list" || block.type === "ordered-list") {
            element = doc.createElement(block.type === "ordered-list" ? "ol" : "ul");
            if (block.type === "ordered-list" && block.start !== undefined) {
                element.start = block.start;
            }
            for (const item of block.items) {
                const listItem = doc.createElement("li");
                appendInline(listItem, item, doc);
                element.appendChild(listItem);
            }
        } else if (block.type === "code-block") {
            element = doc.createElement("pre");
            const code = doc.createElement("code");
            code.textContent = block.text;
            element.appendChild(code);
        }
        if (element) fragment.appendChild(element);
    }

    container.replaceChildren(fragment);
}

function mountDemo() {
    const prompt = document.getElementById("demo-prompt");
    if (!prompt) return;

    const send = document.getElementById("demo-send");
    const stop = document.getElementById("demo-stop");
    const clear = document.getElementById("demo-clear");
    const status = document.getElementById("demo-status");
    const reasoningDetails = document.getElementById("demo-thinking-details");
    const reasoning = document.getElementById("demo-thinking");
    const output = document.getElementById("demo-output");
    const answer = document.getElementById("demo-answer");
    let activeController = null;

    function setBusy(busy) {
        send.disabled = busy;
        stop.hidden = !busy;
        output.setAttribute("aria-busy", String(busy));
    }

    function clearDemo() {
        if (activeController) activeController.abort();
        activeController = null;
        prompt.value = "";
        answer.textContent = "";
        reasoning.textContent = "";
        reasoningDetails.open = false;
        reasoningDetails.hidden = true;
        status.textContent = "";
        setBusy(false);
        prompt.focus();
    }

    async function ask() {
        const text = prompt.value.trim();
        if (!text || activeController) return;

        const controller = new AbortController();
        activeController = controller;
        answer.textContent = "";
        status.textContent = "Päringu töötlemine…";
        reasoning.textContent = "";
        reasoningDetails.open = false;
        reasoningDetails.hidden = true;
        setBusy(true);

        let terminal = false;
        let phase = "waiting";
        let hasReasoning = false;
        let answerMarkdown = "";
        try {
            const response = await fetch("https://ai.tehisabiline.ee/api/demo/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text }),
                signal: controller.signal,
            });
            if (!response.ok || !response.body) {
                if (response.status === 429) throw new Error("Liiga palju päringuid. Proovi hiljem uuesti.");
                if (response.status === 503) throw new Error("Mudel on hõivatud. Proovi veidi hiljem.");
                throw new Error("Demo ei vasta praegu. Proovi hiljem uuesti.");
            }

            const decoder = createSseDecoder((event) => {
                if (typeof event.reasoning_delta === "string" && event.reasoning_delta.length > 0) {
                    if (!hasReasoning) {
                        hasReasoning = true;
                        reasoningDetails.hidden = false;
                    }
                    reasoning.textContent += event.reasoning_delta;
                    if (phase === "waiting") {
                        phase = "thinking";
                        status.textContent = "Mudel mõtleb…";
                    }
                }
                if (typeof event.delta === "string" && event.delta.length > 0) {
                    if (phase !== "answering") {
                        phase = "answering";
                        status.textContent = "Mudel koostab lõppvastust…";
                    }
                    answerMarkdown += event.delta;
                    renderMarkdown(answer, answerMarkdown);
                }
                if (event.done) {
                    terminal = true;
                    if (event.finish_reason === "length") {
                        status.textContent = "Mudel jõudis väljundi pikkuse piirini; lõppvastus või mõttekäik võib olla pooleli.";
                    } else if (answer.textContent) {
                        status.textContent = "Vastus valmis. Tsenseerimata mudel võib eksida; kontrolli olulist infot.";
                    } else if (reasoning.textContent) {
                        status.textContent = "Mõttekäik valmis, kuid mudel ei saatnud lõppvastust.";
                    } else {
                        status.textContent = "Mudel ei saatnud nähtavat vastust.";
                    }
                } else if (event.error) {
                    terminal = true;
                    const hasPartialOutput = reasoning.textContent.length > 0 || answer.textContent.length > 0;
                    if (event.error === "timeout") {
                        status.textContent = hasPartialOutput
                            ? "Päring aegus; seni saabunud tekst jäi alles. Proovi uuesti."
                            : "Päring aegus enne nähtava teksti saabumist. Proovi uuesti.";
                    } else {
                        status.textContent = hasPartialOutput
                            ? "Vastus katkes; seni saabunud tekst jäi alles. Proovi uuesti."
                            : "Vastus katkes enne nähtava teksti saabumist. Proovi uuesti.";
                    }
                }
            });
            const reader = response.body.getReader();
            while (true) {
                const part = await reader.read();
                if (part.done) break;
                decoder.push(part.value);
            }
            decoder.finish();
            if (!terminal) {
                const hasPartialOutput = reasoning.textContent.length > 0 || answer.textContent.length > 0;
                status.textContent = hasPartialOutput
                    ? "Vastuse voog katkes; seni saabunud tekst jäi alles. Proovi uuesti."
                    : "Vastuse voog katkes enne nähtava teksti saabumist. Proovi uuesti.";
            }
        } catch (error) {
            if (error.name === "AbortError") {
                if (activeController === controller) {
                    const hasPartialOutput = reasoning.textContent.length > 0 || answer.textContent.length > 0;
                    status.textContent = hasPartialOutput
                        ? "Päring peatati; seni saabunud tekst jäi alles."
                        : "Päring peatati enne nähtava teksti saabumist.";
                }
            } else if (activeController === controller) {
                const message = error.message || "Demo ei vasta praegu. Proovi hiljem uuesti.";
                const hasPartialOutput = reasoning.textContent.length > 0 || answer.textContent.length > 0;
                status.textContent = hasPartialOutput
                    ? `${message} Seni saabunud tekst jäi alles.`
                    : message;
            }
        } finally {
            if (activeController === controller) {
                activeController = null;
                setBusy(false);
            }
        }
    }

    send.addEventListener("click", ask);
    stop.addEventListener("click", () => {
        if (!activeController) return;
        status.textContent = "Peatan päringu…";
        activeController.abort();
    });
    clear.addEventListener("click", clearDemo);
    prompt.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            ask();
        }
    });
}

if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountDemo, { once: true });
    } else {
        mountDemo();
    }
}
