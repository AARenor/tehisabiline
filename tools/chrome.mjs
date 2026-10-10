// Single source for the shared site header and footer.
// Pages mark their chrome with comment markers:
//   <!-- chrome:header --><!-- /chrome:header -->
//   <!-- chrome:footer --><!-- /chrome:footer -->
// Run `node tools/chrome.mjs` after editing this file; it rewrites every marked region in place.
// Pass page paths to limit the run: `node tools/chrome.mjs mudelid/index.html`.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const SKIP = new Set(["node_modules", ".git", ".vercel", ".opencode", "output", ".playwright-cli", "docs"]);

const MONTHS = ["jaanuaril", "veebruaril", "märtsil", "aprillil", "mail", "juunil", "juulil", "augustil", "septembril", "oktoobril", "novembril", "detsembril"];
const longDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return `${d}. ${MONTHS[m - 1]} ${y}`;
};

const icon = (name, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="/assets/icons.svg#${name}"/></svg>`;

const NAV = [
    ["/kuberaudit/", "Küberaudit"],
    ["/mudelid/", "Mudelid ja API"],
    ["/ai/", "AI-teenused"],
    ["/nis2/", "NIS2"],
    ["/meist/", "Meist"],
];

function header(path) {
    const link = ([href, label]) => `<a href="${href}"${path === href ? ' aria-current="page"' : ""}>${label}</a>`;
    const mobile = ([href, label]) => `<a href="${href}"${path === href ? ' aria-current="page"' : ""}>${label}</a>`;
    return `<header class="site-header" id="navbar">
    <div class="wrap site-header__bar">
        <a class="brand" href="/" aria-label="Tehisabiline – avaleht"><img src="/assets/brand/favicon.png" width="64" height="64" alt=""><span translate="no">Tehisabiline</span></a>
        <nav class="site-nav" aria-label="Põhinavigatsioon">
            ${NAV.map(link).join("\n            ")}
        </nav>
        <a class="btn btn--primary btn--sm site-header__cta" href="/#contact">Tasuta kaardistus</a>
        <button class="nav-toggle" id="nav-toggle" type="button" aria-label="Ava menüü" aria-expanded="false" aria-controls="mobile-menu">${icon("menu", "i i--open")}${icon("x", "i i--close")}</button>
    </div>
    <nav class="mobile-menu" id="mobile-menu" aria-label="Mobiilimenüü" hidden>
        ${NAV.map(mobile).join("\n        ")}
        <a class="btn btn--primary" href="/#contact">Tasuta kaardistus</a>
    </nav>
</header>`;
}

function footer(date) {
    return `<footer class="site-footer">
    <div class="wrap">
        <div class="site-footer__grid">
            <div>
                <a class="brand" href="/" aria-label="Tehisabiline – avaleht"><img src="/assets/brand/favicon.png" width="64" height="64" alt=""><span translate="no">Tehisabiline OÜ</span></a>
                <p>Tsenseerimata küber-AI mudelid Eestisse tulekul. API turvatööriistadele. Agendipõhised auditid.</p>
            </div>
            <nav aria-label="Teenuste lingid">
                <p class="site-footer__title">Teenused</p>
                <ul>
                    <li><a href="/kuberaudit/">Agendipõhine küberaudit</a></li>
                    <li><a href="/mudelid/">Küber-AI mudelid ja API</a></li>
                    <li><a href="/ai/">AI-teenused ettevõtetele</a></li>
                    <li><a href="/idufirmadele/">AI idufirmale</a></li>
                    <li><a href="/ai/seo/">AI SEO teenus</a></li>
                </ul>
            </nav>
            <nav aria-label="Ettevõtte lingid">
                <p class="site-footer__title">Teave</p>
                <ul>
                    <li><a href="/meist/">Meist ja põhimõtted</a></li>
                    <li><a href="/kasutusjuhud/">Küber-AI kasutusjuhud</a></li>
                    <li><a href="/nis2/">NIS2 juhend</a></li>
                    <li><a href="/privaatsus/">Privaatsus ja küpsised</a></li>
                    <li><a href="/llms.txt">AI-süsteemidele</a></li>
                </ul>
            </nav>
            <div>
                <p class="site-footer__title">Kontakt</p>
                <ul>
                    <li><a href="mailto:tehisabiline@gmail.com">tehisabiline@gmail.com</a></li>
                    <li>Tallinn, Eesti</li>
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

    const next = html
        .replace(region("header"), () => `<!-- chrome:header -->\n${header(rel)}\n<!-- /chrome:header -->`)
        .replace(region("footer"), () => `<!-- chrome:footer -->\n${footer(date)}\n<!-- /chrome:footer -->`);
    if (next !== html) {
        writeFileSync(file, next);
        touched++;
        console.log("chrome:", relative(root, file));
    }
}
console.log(`${touched} file(s) updated`);
