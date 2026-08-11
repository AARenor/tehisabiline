document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const navToggle = document.getElementById("nav-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const stickyCta = document.getElementById("sticky-cta");
    const contactSection = document.getElementById("contact");

    const updateNavbar = () => {
        navbar?.classList.toggle("scrolled", window.scrollY > 24);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    if (navToggle && mobileMenu) {
        const icon = navToggle.querySelector(".nav-menu-icon");

        const setMenu = (open) => {
            mobileMenu.classList.toggle("hidden", !open);
            mobileMenu.classList.toggle("flex", open);
            navToggle.setAttribute("aria-expanded", String(open));
            navToggle.setAttribute("aria-label", open ? "Sulge menüü" : "Ava menüü");
            if (icon) icon.textContent = open ? "×" : "☰";
        };

        navToggle.addEventListener("click", () => {
            setMenu(navToggle.getAttribute("aria-expanded") !== "true");
        });

        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMenu(false));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenu(false);
                navToggle.focus();
            }
        });
    }

    if (stickyCta) {
        const updateStickyCta = () => {
            const farEnough = window.scrollY > window.innerHeight * 0.65;
            const contactIsNear = contactSection
                ? contactSection.getBoundingClientRect().top < window.innerHeight * 0.85
                : false;
            stickyCta.classList.toggle("visible", farEnough && !contactIsNear);
        };

        updateStickyCta();
        window.addEventListener("scroll", updateStickyCta, { passive: true });
    }

    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const successMessage = document.getElementById("form-success");
        const errorMessage = document.getElementById("form-error");
        const originalText = submitButton?.textContent || "Saada päring";
        const data = new FormData(contactForm);

        successMessage?.classList.add("hidden");
        errorMessage?.classList.add("hidden");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Saadan…";
        }
        contactForm.setAttribute("aria-busy", "true");

        try {
            const response = await fetch("https://n8n.arleserver.cfd/webhook/1e82c9b9-6dd7-4d57-b2b7-e0187587e8eb", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: String(data.get("name") || ""),
                    email: String(data.get("email") || ""),
                    company: String(data.get("company") || ""),
                    message: String(data.get("message") || ""),
                    source: window.location.href,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error(`Vormi vastus: ${response.status}`);

            contactForm.reset();
            successMessage?.classList.remove("hidden");
        } catch (error) {
            console.error("Vormi saatmine ebaõnnestus.", error);
            errorMessage?.classList.remove("hidden");
        } finally {
            contactForm.removeAttribute("aria-busy");
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    });
});
