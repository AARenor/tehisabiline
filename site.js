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
});
