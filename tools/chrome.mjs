// Single source for the shared site header and footer.
// Pages mark their chrome with comment markers:
//   <!-- chrome:header --><!-- /chrome:header -->
//   <!-- chrome:footer --><!-- /chrome:footer -->
// Run `node tools/chrome.mjs` after editing this file; it rewrites every marked region in place.
// Pass page paths to limit the run: `node tools/chrome.mjs mudelid/index.html`.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SKIP = new Set(["node_modules", ".git", ".vercel", ".opencode", ".impeccable", "output", ".playwright-cli", "docs"]);

const MONTHS = {
    et: ["jaanuaril", "veebruaril", "märtsil", "aprillil", "mail", "juunil", "juulil", "augustil", "septembril", "oktoobril", "novembril", "detsembril"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
// Must match tools/stamp-modified.mjs, which rewrites the same label when a page date changes.
const longDate = (iso, lang = "et") => {
    const [y, m, d] = iso.split("-").map(Number);
    return lang === "en" ? `${d} ${MONTHS.en[m - 1]} ${y}` : `${d}. ${MONTHS.et[m - 1]} ${y}`;
};

const icon = (name, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="/assets/icons.svg#${name}"/></svg>`;

// English pages carry the same chrome in English: the nav labels and the contact
// call to action must not fall back to Estonian on /en/.
const LOCALE = {
    et: {
        nav: [
            ["/pentestimine/", "Küberaudit / pentest"],
            ["/mudelid/", "Küber-AI API"],
            ["/nis2/", "NIS2 Eestis"],
            ["/meist/", "Meist"],
        ],
        cta: ["/#contact", "Tasuta kaardistus"],
        contact: ["/#contact", "Tasuta kaardistus"],
        home: " – avaleht",
        navLabel: "Põhinavigatsioon",
        mobileLabel: "Mobiilimenüü",
        menuOpen: "Ava menüü",
    },
    en: {
        nav: [
            ["/en/pentesting/", "Audit / pentest"],
            ["/mudelid/", "Cyber-AI API"],
            ["/en/nis2/", "NIS2"],
            ["/meist/", "About"],
        ],
        cta: ["/en/#contact", "Free assessment"],
        contact: ["/en/#contact", "Free assessment"],
        home: " – home",
        navLabel: "Main navigation",
        mobileLabel: "Mobile menu",
        menuOpen: "Open menu",
    },
};
const localeOf = (path) => (path === "/en" || path.startsWith("/en/") ? LOCALE.en : LOCALE.et);

function header(path) {
    const { nav, cta, home, navLabel, mobileLabel, menuOpen } = localeOf(path);
    const link = ([href, label]) => `<a href="${href}"${path === href || path.startsWith(href) ? ' aria-current="page"' : ""}>${label}</a>`;
    return `<header class="site-header" id="navbar">
    <div class="wrap site-header__bar">
        <a class="brand" href="/"><img src="/assets/brand/logo.svg" width="64" height="64" alt=""><span translate="no">Tehisabiline</span><span class="visually-hidden">${home}</span></a>
        <nav class="site-nav" aria-label="${navLabel}">
            ${nav.map(link).join("\n            ")}
        </nav>
        <a class="btn btn--primary btn--sm site-header__cta" href="${cta[0]}">${cta[1]}${icon("arrow-right", "i i--go")}</a>
        <button class="nav-toggle" id="nav-toggle" type="button" aria-label="${menuOpen}" aria-expanded="false" aria-controls="mobile-menu">${icon("menu", "i i--open")}${icon("x", "i i--close")}</button>
    </div>
    <nav class="mobile-menu" id="mobile-menu" aria-label="${mobileLabel}" hidden>
        ${nav.map(link).join("\n        ")}
        <a class="btn btn--primary" href="${cta[0]}">${cta[1]}${icon("arrow-right", "i i--go")}</a>
    </nav>
</header>`;
}

// Footer links are grouped by topic. A flat list of every page put 53 links on every URL and
// spread internal link equity thin; the groups below keep the NIS2 cluster, the service pages and
// the regulation hubs one click away and leave deeper pages to their hubs and the sitemap page.
// Each entry: [href, label, language of the target when it differs from the page language].
const FOOTER = {
    et: {
        lang: "et",
        home: " – avaleht",
        about: "Pentestimine ja küberauditid kirjaliku loa alusel, inimese ülevaatusega. API turvatööriistadele.",
        groups: [
            {
                title: "Teenused",
                label: "Teenuste lingid",
                links: [
                    ["/pentestimine/", "Küberaudit ja pentestimine"],
                    ["/kuberaudit/", "IT turvaaudit"],
                    ["/mudelid/", "Keeldudeta küber-AI API"],
                    ["/kasutusjuhud/", "Küber-AI kasutusjuhud"],
                    ["/ai-turvatestimine/", "AI turvatestimine"],
                    ["/api-turvatestimine/", "API turvatestimise juhend"],
                    ["/veebirakenduse-turvatestimine/", "Veebirakenduse pentesti juhend"],
                ],
            },
            {
                title: "NIS2 Eestis",
                label: "NIS2 lingid",
                links: [
                    ["/nis2/", "NIS2 Eestis: ülevaade"],
                    ["/nis2/registreerimine/", "Registreerimine RIA-s"],
                    ["/nis2/intsidendist-teatamine/", "Intsidendist teatamine"],
                    ["/nis2/trahvid/", "Trahvid ja vastutus"],
                    ["/nis2/kontrollnimekiri/", "Kontrollnimekiri"],
                    ["/nis2/audit/", "NIS2 audit"],
                    ["/nis2/toetus/", "EIS-i NIS2 toetus"],
                    ["/sektorid/", "NIS2 sektorite kaupa"],
                ],
            },
            {
                title: "Regulatsioonid",
                label: "Regulatsioonide lingid",
                links: [
                    ["/regulatsioonid/", "Kõik regulatsioonid"],
                    ["/dora/", "DORA nõuded Eestis"],
                    ["/cra/", "Cyber Resilience Act"],
                    ["/ai-act/", "AI Act Eestis"],
                    ["/e-its/", "E-ITS ja audit"],
                    ["/iso-27001/", "ISO 27001 Eestis"],
                    ["/sbom/", "SBOM ja tarkvara koostis"],
                ],
            },
            {
                title: "Teave",
                label: "Ettevõtte lingid",
                links: [
                    ["/meist/", "Meist ja põhimõtted"],
                    ["/artiklid/", "Artiklid"],
                    ["/sonastik/", "Küberturbe sõnastik"],
                    ["/viitamine/", "Viitamine ja allikad"],
                    ["/saidikaart/", "Kõik lehed"],
                    ["/privaatsus/", "Privaatsus ja küpsised"],
                    ["/llms.txt", "AI-süsteemidele"],
                    ["/en/", "English", "en"],
                ],
            },
        ],
        contactTitle: "Kontakt",
        place: "Reg. kood 17607255 · Viimsi vald, Harju maakond",
        linkedin: "Asutaja LinkedIn",
        rights: "© 2026 Tehisabiline OÜ. Kõik õigused kaitstud.",
        updated: "Viimati sisuliselt uuendatud",
    },
    en: {
        lang: "en",
        home: " – home",
        about: "Penetration testing and cyber audits under written authorization, with human review. API for security tooling.",
        groups: [
            {
                title: "Services",
                label: "Service links",
                links: [
                    ["/en/pentesting/", "Penetration testing"],
                    ["/en/pentest-report/", "Pentest report template"],
                    ["/en/security-audit/", "Cybersecurity audit"],
                    ["/en/security-audit/checklist/", "Cybersecurity audit checklist"],
                    ["/mudelid/", "Cyber-AI API (Estonian)", "et"],
                    ["/kasutusjuhud/", "Cyber-AI use cases (Estonian)", "et"],
                ],
            },
            {
                title: "NIS2 in Estonia",
                label: "NIS2 links",
                links: [
                    ["/en/nis2/", "NIS2 in Estonia: overview"],
                    ["/en/nis2/registration/", "Registration with RIA"],
                    ["/en/nis2/incident-reporting/", "Incident reporting"],
                    ["/en/nis2/fines/", "Fines and liability"],
                    ["/en/nis2/audit/", "NIS2 audit"],
                    ["/en/nis2/checklist/", "NIS2 compliance checklist"],
                    ["/en/nis2/scope-assessment/", "NIS2 scope assessment"],
                    ["/en/nis2/vs-iso-27001/", "NIS2 vs ISO 27001"],
                    ["/en/nis2/suppliers/", "NIS2 supplier requirements"],
                ],
            },
            {
                title: "Regulations",
                label: "Regulation links",
                links: [
                    ["/en/regulations/", "Estonia regulations overview"],
                    ["/en/dora/", "DORA in Estonia"],
                    ["/en/dora/register/", "DORA register of information"],
                    ["/en/dora/audit/", "DORA audit"],
                    ["/en/cra/", "CRA in Estonia"],
                    ["/en/sbom/", "SBOM for the CRA"],
                    ["/en/ai-act/", "AI Act in Estonia"],
                    ["/en/e-its/", "E-ITS in Estonia"],
                    ["/en/iso-27001/", "ISO 27001 in Estonia"],
                ],
            },
            {
                title: "Company",
                label: "Company links",
                links: [
                    ["/en/", "Tehisabiline in English"],
                    ["/en/press/", "Press kit"],
                    ["/meist/", "About (Estonian)", "et"],
                    ["/privaatsus/", "Privacy (Estonian)", "et"],
                    ["/llms.txt", "For AI systems"],
                    ["/", "Eesti keeles", "et"],
                ],
            },
        ],
        contactTitle: "Contact",
        place: "Reg. no. 17607255 · Viimsi Parish, Harju County",
        linkedin: "Founder on LinkedIn",
        rights: "© 2026 Tehisabiline OÜ. All rights reserved.",
        updated: "Last materially updated",
    },
};

function footer(date, path = "/") {
    const locale = localeOf(path);
    const f = FOOTER[path === "/en" || path.startsWith("/en/") ? "en" : "et"];
    const link = ([href, label, lang]) => `<li><a href="${href}"${lang ? ` hreflang="${lang}" lang="${lang}"` : ""}>${label}</a></li>`;
    const group = (g) => `            <nav aria-label="${g.label}">
                <p class="site-footer__title">${g.title}</p>
                <ul>
                    ${g.links.map(link).join("\n                    ")}
                </ul>
            </nav>`;
    return `<footer class="site-footer">
    <div class="wrap">
        <div class="site-footer__grid">
            <div class="site-footer__about">
                <a class="brand" href="/"><img src="/assets/brand/logo.svg?v=85069ce5" width="64" height="64" alt=""><span translate="no">Tehisabiline OÜ</span><span class="visually-hidden">${f.home}</span></a>
                <p>${f.about}</p>
                <p class="site-footer__title">${f.contactTitle}</p>
                <ul>
                    <li><a href="mailto:tehisabiline@gmail.com">tehisabiline@gmail.com</a></li>
                    <li>${f.place}</li>
                    <li><a href="https://www.linkedin.com/in/arlearonreidma/" rel="me noopener" target="_blank">${f.linkedin}</a></li>
                    <li><a href="${locale.contact[0]}">${locale.contact[1]}</a></li>
                </ul>
            </div>
${f.groups.map(group).join("\n")}
        </div>
        <div class="site-footer__legal">
            <span>${f.rights}</span>
            <span>${f.updated} <time datetime="${date}">${longDate(date, f.lang)}</time></span>
        </div>
    </div>
</footer>`;
}

function collect(dir, out = []) {
    for (const entry of readdirSync(dir)) {
        if (SKIP.has(entry)) continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) collect(full, out);
        else if (extname(entry) === ".html") out.push(full);
    }
    return out;
}

const region = (name) => new RegExp(`<!-- chrome:${name} -->[\\s\\S]*?<!-- /chrome:${name} -->`);
const WIDGET = `<!-- chrome:widget -->
<link rel="stylesheet" href="/assistant.css">
<script src="/assistant.js" defer></script>
<!-- /chrome:widget -->`;

// Pages add their own calculator scripts inside the widget region; a blind re-render
// must never drop them.
function widgetFor(existing = "") {
    const scripts = existing.match(/[ \t]*<script src="\/assets\/js\/[^"]*"[^>]*><\/script>/g) || [];
    if (!scripts.length) return WIDGET;
    return WIDGET.replace(
        '<script src="/assistant.js" defer></script>',
        `${scripts.map((line) => line.trim()).join("\n")}\n<script src="/assistant.js" defer></script>`
    );
}

const only = process.argv.slice(2).map((p) => join(process.cwd(), p));
let touched = 0;
for (const file of only.length ? only : collect(root)) {
    const html = readFileSync(file, "utf8");
    if (!region("header").test(html) && !region("footer").test(html)) continue;

    const rel = "/" + relative(root, file).replace(/index\.html$/, "").replace(/\\/g, "/");
    const date =
        html.match(/<!-- chrome:footer -->[\s\S]*?<time datetime="(\d{4}-\d{2}-\d{2})"/)?.[1] ??
        html.match(/"dateModified":\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
    if (!date) throw new Error(`${file}: no footer date or dateModified found`);

    let next = html
        .replace(region("header"), () => `<!-- chrome:header -->\n${header(rel)}\n<!-- /chrome:header -->`)
        .replace(region("footer"), () => `<!-- chrome:footer -->\n${footer(date, rel)}\n<!-- /chrome:footer -->`);
    if (region("widget").test(next)) {
        next = next.replace(region("widget"), (existing) => widgetFor(existing));
    } else if (next.includes("</body>")) {
        next = next.replace("</body>", () => `${WIDGET}\n</body>`);
    }
    if (next !== html) {
        writeFileSync(file, next);
        touched++;
        console.log("chrome:", relative(root, file));
    }
}
console.log(`${touched} file(s) updated`);
