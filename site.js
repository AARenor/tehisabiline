document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("navbar");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("mobile-menu");

    const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 8);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (toggle && menu) {
        const setMenu = (open) => {
            menu.hidden = !open;
            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "Sulge menüü" : "Ava menüü");
        };

        toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
        menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
                setMenu(false);
                toggle.focus();
            }
        });
        window.matchMedia("(min-width: 980px)").addEventListener("change", (event) => {
            if (event.matches) setMenu(false);
        });
    }

    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const successMessage = document.getElementById("form-success");
        const errorMessage = document.getElementById("form-error");
        const originalText = submitButton?.textContent || "Saada päring";
        const data = new FormData(form);
        const show = (el, visible) => { if (el) el.hidden = !visible; };

        // Honeypot: bots fill this field, people never see it.
        if (String(data.get("website") || "")) {
            show(errorMessage, false);
            show(successMessage, true);
            return;
        }

        const trim = (v, n) => String(v || "").trim().slice(0, n);
        const email = trim(data.get("email"), 254);
        if (!trim(data.get("name"), 100) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !trim(data.get("message"), 5000)) {
            show(successMessage, false);
            show(errorMessage, true);
            return;
        }
        show(successMessage, false);
        show(errorMessage, false);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Saadan…";
        }
        form.setAttribute("aria-busy", "true");

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            const response = await fetch("https://n8n.arle.top/webhook/1e82c9b9-6dd7-4d57-b2b7-e0187587e8eb", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: trim(data.get("name"), 100),
                    email: email,
                    company: trim(data.get("company"), 100),
                    message: trim(data.get("message"), 5000),
                    source: window.location.href,
                    timestamp: new Date().toISOString()
                }),
                signal: controller.signal
            }).finally(() => clearTimeout(timeout));

            if (!response.ok) throw new Error(`Vormi vastus: ${response.status}`);

            form.reset();
            show(successMessage, true);
        } catch (error) {
            console.error("Vormi saatmine ebaõnnestus.", error);
            show(errorMessage, true);
        } finally {
            form.removeAttribute("aria-busy");
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    });
});
