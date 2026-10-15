document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("navbar");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("mobile-menu");

    // .is-top lets the header go transparent over the ribbon; without JS it stays opaque.
    const updateHeader = () => {
        const scrolled = window.scrollY > 8;
        header?.classList.toggle("scrolled", scrolled);
        header?.classList.toggle("is-top", !scrolled);
    };
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
        document.addEventListener("pointerdown", (event) => {
            if (!header?.contains(event.target)) setMenu(false);
        });
        header?.addEventListener("focusout", () => {
            queueMicrotask(() => {
                if (!header.contains(document.activeElement)) setMenu(false);
            });
        });
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
});
