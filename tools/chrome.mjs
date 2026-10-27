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

const MONTHS = ["jaanuaril", "veebruaril", "märtsil", "aprillil", "mail", "juunil", "juulil", "augustil", "septembril", "oktoobril", "novembril", "detsembril"];
const longDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return `${d}. ${MONTHS[m - 1]} ${y}`;
};

const icon = (name, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="/assets/icons.svg#${name}"/></svg>`;

// English pages carry the same chrome in English: the nav labels and the contact
// call to action must not fall back to Estonian on /en/.
const LOCALE = {
    et: {
        nav: [
            ["/pentestimine/", "Küberaudit / pentest"],
            ["/mudelid/", "Küber-AI API"],
            ["/nis2/", "NIS2"],
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
            ["/pentestimine/", "Audit / pentest"],
            ["/mudelid/", "Cyber-AI API"],
            ["/nis2/", "NIS2"],
            ["/meist/", "About"],
        ],
        cta: ["/en/#contact", "Free assessment"],
        contact: ["/en/#contact", "Free assessment"],
        home: " – avaleht",
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

function footer(date, path = "/") {
    const { contact } = localeOf(path);
    return `<footer class="site-footer">
    <div class="wrap">
        <div class="site-footer__grid">
            <div>
                <a class="brand" href="/"><img src="/assets/brand/logo.svg?v=85069ce5" width="64" height="64" alt=""><span translate="no">Tehisabiline OÜ</span><span class="visually-hidden"> – avaleht</span></a>
                <p>Pentestimine ja küberauditid kirjaliku loa alusel, inimese ülevaatusega. API turvatööriistadele.</p>
            </div>
            <nav aria-label="Teenuste lingid">
                <p class="site-footer__title">Teenused</p>
                <ul>
                    <li><a href="/pentestimine/">Küberaudit ja pentestimine</a></li>
                    <li><a href="/mudelid/">Keeldudeta küber-AI API</a></li>
                </ul>
            </nav>
            <nav aria-label="Ettevõtte lingid">
                <p class="site-footer__title">Teave</p>
                <ul>
                    <li><a href="/meist/">Meist ja põhimõtted</a></li>
                    <li><a href="/en/press/" hreflang="en" lang="en">Press kit (EN)</a></li>
                    <li><a href="/viitamine/">Viitamine ja allikad</a></li>
                    <li><a href="/nis2/toetus/">NIS2 toetus</a></li>
                    <li><a href="/sektorid/energeetika/">NIS2 energeetikas</a></li>
                    <li><a href="/sektorid/tervishoid/">NIS2 tervishoius</a></li>
                    <li><a href="/sektorid/finants/">DORA finantssektoris</a></li>
                    <li><a href="/sektorid/">Sektorid</a></li>
                    <li><a href="/sektorid/logistika/">NIS2 logistikas</a></li>
                    <li><a href="/saidikaart/">Kõik lehed</a></li>
                    <li><a href="/koolitus/">Koolitus</a></li>
                    <li><a href="/kuberaudit/">Turvaaudit ja küberaudit</a></li>
                    <li><a href="/kasutusjuhud/">Küber-AI kasutusjuhud</a></li>
                    <li><a href="/api-turvatestimine/">API turvatestimise juhend</a></li>
                    <li><a href="/veebirakenduse-turvatestimine/">Veebirakenduse pentesti juhend</a></li>
                    <li><a href="/nis2/">NIS2 juhend</a></li>
                    <li><a href="/regulatsioonid/">Regulatsioonid ja AI Act</a></li>
                    <li><a href="/dora/">DORA nõuded Eestis</a></li>
                    <li><a href="/dora/teaberegister/">DORA teaberegister</a></li>
                    <li><a href="/dora/audit/">DORA audit</a></li>
                    <li><a href="/ai-act/">AI Act Eestis</a></li>
                    <li><a href="/iso-27001/">ISO 27001 Eestis</a></li>
                    <li><a href="/cra/">Cyber Resilience Act</a></li>
                    <li><a href="/sbom/">SBOM ja tarkvara koostis</a></li>
                    <li><a href="/en/" hreflang="en" lang="en">English</a></li>
                    <li><a href="/en/regulations/" hreflang="en" lang="en">Estonia regulations (EN)</a></li>
                    <li><a href="/en/nis2/" hreflang="en" lang="en">NIS2 in Estonia (EN)</a></li>
                    <li><a href="/en/nis2/audit/" hreflang="en" lang="en">NIS2 audit (EN)</a></li>
                    <li><a href="/en/nis2/incident-reporting/" hreflang="en" lang="en">Incident reporting (EN)</a></li>
                    <li><a href="/en/nis2/fines/" hreflang="en" lang="en">NIS2 fines (EN)</a></li>
                    <li><a href="/en/nis2/registration/" hreflang="en" lang="en">NIS2 registration (EN)</a></li>
                    <li><a href="/en/cra/" hreflang="en" lang="en">CRA in Estonia (EN)</a></li>
                    <li><a href="/en/dora/" hreflang="en" lang="en">DORA in Estonia (EN)</a></li>
                    <li><a href="/en/dora/audit/" lang="en" hreflang="en">DORA audit (EN)</a></li>
                    <li><a href="/en/dora/register/" hreflang="en" lang="en">DORA register (EN)</a></li>
                    <li><a href="/en/ai-act/" hreflang="en" lang="en">AI Act in Estonia (EN)</a></li>
                    <li><a href="/en/sbom/" hreflang="en" lang="en">SBOM for CRA (EN)</a></li>
                    <li><a href="/en/e-its/" hreflang="en" lang="en">E-ITS in Estonia (EN)</a></li>
                    <li><a href="/en/pentesting/" hreflang="en" lang="en">Penetration testing (EN)</a></li>
                    <li><a href="/en/security-audit/" hreflang="en" lang="en">Cybersecurity audit (EN)</a></li>
                    <li><a href="/en/iso-27001/" hreflang="en" lang="en">ISO 27001 in Estonia (EN)</a></li>
                    <li><a href="/e-its/">E-ITS ja audit</a></li>
                    <li><a href="/ai-turvatestimine/">AI turvatestimine</a></li>
                    <li><a href="/tlpt/">TLPT ja TIBER-EE</a></li>
                    <li><a href="/nis2/kontrollnimekiri/">NIS2 kontrollnimekiri</a></li>
                    <li><a href="/sonastik/">Küberturbe sõnastik</a></li>
                    <li><a href="/api-turvatestimine/kontrollnimekiri/">API pentesti kontrollnimekiri</a></li>
                    <li><a href="/privaatsus/">Privaatsus ja küpsised</a></li>
                    <li><a href="/llms.txt">AI-süsteemidele</a></li>
                </ul>
            </nav>
            <div>
                <p class="site-footer__title">Kontakt</p>
                <ul>
                    <li><a href="mailto:tehisabiline@gmail.com">tehisabiline@gmail.com</a></li>
                    <li>Tallinn, Eesti</li>
                    <li><a href="https://www.linkedin.com/in/arlearonreidma/" rel="me noopener" target="_blank">Asutaja LinkedIn</a></li>
                    <li><a href="${contact[0]}">${contact[1]}</a></li>
                </ul>
            </div>
        </div>
        <div class="site-footer__legal">
            <span>© 2026 Tehisabiline OÜ. Kõik õigused kaitstud.</span>
            <span>Viimati sisuliselt uuendatud <time datetime="${date}">${longDate(date)}</time></span>
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
