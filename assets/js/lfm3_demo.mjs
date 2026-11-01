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
    const answer = document.getElementById("lfm3-answer");
    let activeController = null;

    function setBusy(busy) {
        send.disabled = busy;
        stop.hidden = !busy;
        answer.setAttribute("aria-busy", String(busy));
    }

    function clearDemo() {
        if (activeController) activeController.abort();
        activeController = null;
        prompt.value = "";
        answer.textContent = "";
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
        status.textContent = "LFM3 koostab vastust…";
        setBusy(true);

        let terminal = false;
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
                if (event.delta) answer.textContent += event.delta;
                if (event.done) {
                    terminal = true;
                    status.textContent = event.finish_reason === "length"
                        ? "Vastus jõudis demo pikkuse piirini ja võib pooleli olla."
                        : "Vastus valmis. LFM3 võib eksida; kontrolli olulist infot.";
                } else if (event.error) {
                    terminal = true;
                    status.textContent = event.error === "timeout"
                        ? "Vastuse koostamine võttis liiga kaua. Esita uus küsimus."
                        : "Vastus katkes. Esita uus küsimus.";
                }
            });
            const reader = response.body.getReader();
            while (true) {
                const part = await reader.read();
                if (part.done) break;
                decoder.push(part.value);
            }
            decoder.finish();
            if (!terminal) status.textContent = "Vastus katkes. Esita uus küsimus.";
        } catch (error) {
            if (error.name === "AbortError") {
                if (activeController === controller) status.textContent = "Päring peatati.";
            } else if (activeController === controller) {
                status.textContent = error.message || "Demo ei vasta praegu. Proovi hiljem uuesti.";
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
