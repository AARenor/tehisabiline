// NIS2 kontrollnimekiri: local-only progress, no network requests.
(() => {
    const root = document.getElementById("nis2-checklist");
    if (!root) return;

    const key = root.dataset.storageKey || "tehisabiline-nis2-checklist-v2";
    const checks = [...root.querySelectorAll("input[data-check]")];
    const bar = root.querySelector(".checklist__bar");
    const fill = root.querySelector("[data-progress-fill]");
    const count = root.querySelector("[data-progress-count]");
    const reset = root.querySelector("[data-progress-reset]");
    if (!checks.length) return;

    const read = () => {
        try {
            return new Set(JSON.parse(localStorage.getItem(key) || "[]"));
        } catch {
            return new Set();
        }
    };

    const write = (done) => {
        try {
            localStorage.setItem(key, JSON.stringify([...done]));
        } catch {
            // Storage may be unavailable (private mode); the checklist still works.
        }
    };

    const render = () => {
        const done = new Set(checks.filter((input) => input.checked).map((input) => input.dataset.check));
        const total = checks.length;
        const value = done.size;
        if (count) count.textContent = String(value);
        if (fill) fill.style.width = `${Math.round((value / total) * 100)}%`;
        const hint = root.querySelector("[data-progress-hint]");
        if (hint) {
            hint.textContent = value <= 3
                ? "Soovitus: alusta varunduse taastetestist (c), MFA-st (j) ja ligipääsude ülevaatusest (i)."
                : value <= 7
                    ? "Põhi on paigas. Järgmiseks kinnita tõendid ja juhtorgani ülevaatus (art 20)."
                    : "Tugev baas. Kontrolli, et tõendid oleksid ajakohased ja testitud.";
        }
        if (bar) bar.hidden = false;
        write(done);
    };

    const saved = read();
    checks.forEach((input) => {
        input.checked = saved.has(input.dataset.check);
        input.addEventListener("change", render);
    });
    root.querySelector("[data-progress-print]")?.addEventListener("click", () => window.print());
    reset?.addEventListener("click", () => {
        checks.forEach((input) => {
            input.checked = false;
        });
        render();
    });
    render();
})();
