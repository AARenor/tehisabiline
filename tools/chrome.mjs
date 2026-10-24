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

const NAV = [
    ["/pentestimine/", "Küberaudit / pentest"],
    ["/mudelid/", "Küber-AI API"],
    ["/nis2/", "NIS2"],
    ["/meist/", "Meist"],
];

function header(path) {
    const link = ([href, label]) => `<a href="${href}"${path === href || path.startsWith(href) ? ' aria-current="page"' : ""}>${label}</a>`;
    return `<header class="site-header" id="navbar">
    <div class="wrap site-header__bar">
        <a class="brand" href="/"><img src="/assets/brand/logo.svg" width="64" height="64" alt=""><span translate="no">Tehisabiline</span><span class="visually-hidden"> – avaleht</span></a>
        <nav class="site-nav" aria-label="Põhinavigatsioon">
            ${NAV.map(link).join("\n            ")}
        </nav>
        <a class="btn btn--primary btn--sm site-header__cta" href="/#contact">Tasuta kaardistus${icon("arrow-right", "i i--go")}</a>
        <button class="nav-toggle" id="nav-toggle" type="button" aria-label="Ava menüü" aria-expanded="false" aria-controls="mobile-menu">${icon("menu", "i i--open")}${icon("x", "i i--close")}</button>
    </div>
    <nav class="mobile-menu" id="mobile-menu" aria-label="Mobiilimenüü" hidden>
        ${NAV.map(link).join("\n        ")}
        <a class="btn btn--primary" href="/#contact">Tasuta kaardistus${icon("arrow-right", "i i--go")}</a>
    </nav>
</header>`;
}

function footer(date) {
    return `<footer class="site-footer">
    <div class="wrap">
        <div class="site-footer__grid">
            <div>
                <a class="brand" href="/"><img src="/assets/brand/logo.svg" width="64" height="64" alt=""><span translate="no">Tehisabiline OÜ</span><span class="visually-hidden"> – avaleht</span></a>
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
                    <li><a href="/kuberaudit/">Küberauditi ulatus</a></li>
                    <li><a href="/kasutusjuhud/">Küber-AI kasutusjuhud</a></li>
                    <li><a href="/api-turvatestimine/">API turvatestimise juhend</a></li>
                    <li><a href="/veebirakenduse-turvatestimine/">Veebirakenduse pentesti juhend</a></li>
                    <li><a href="/nis2/">NIS2 juhend</a></li>
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
                    <li><a href="/#contact">Tasuta kaardistus</a></li>
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
        .replace(region("footer"), () => `<!-- chrome:footer -->\n${footer(date)}\n<!-- /chrome:footer -->`);
    if (region("widget").test(next)) {
        next = next.replace(region("widget"), () => WIDGET);
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
