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

function mountDemo() {
    const prompt = document.getElementById("lfm3-prompt");
    if (!prompt) return;

    const send = document.getElementById("lfm3-send");
    const stop = document.getElementById("lfm3-stop");
    const clear = document.getElementById("lfm3-clear");
    const status = document.getElementById("lfm3-status");
    const reasoningDetails = document.getElementById("lfm3-reasoning-details");
    const reasoning = document.getElementById("lfm3-reasoning");
    const output = document.getElementById("lfm3-output");
    const answer = document.getElementById("lfm3-answer");
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
        try {
            const response = await fetch("https://ai.tehisabiline.ee/api/demo/lfm3", {
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
                        reasoningDetails.open = true;
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
                    answer.textContent += event.delta;
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
