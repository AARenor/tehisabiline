# Tehisabiline

Live: https://tehisabiline.ee/

Company website of Tehisabiline OÜ (Tallinn, Estonia): cybersecurity audits (including penetration testing with written authorization) and a cyber-AI API for security tooling. Static HTML/CSS/JS, no backend.

AI-teemaline staatiline veebisait HTML-i, CSS-i ja JavaScriptiga. Avalikud teenused on küberauditid ja kübertööriistade API; üldised hallatud AI-teenused ning SEO/GEO teenused ei kuulu enam veebisaidi pakkumisse.

## Public resources

- [NIS2 nõuded Eestis](https://tehisabiline.ee/nis2/)
- [NIS2 kontrollnimekiri](https://tehisabiline.ee/nis2/kontrollnimekiri/)
- [NIS2 intsidendist teatamine](https://tehisabiline.ee/nis2/intsidendist-teatamine/)
- [Pentestimine Eestis](https://tehisabiline.ee/pentestimine/)
- [API pentesti kontrollnimekiri](https://tehisabiline.ee/api-turvatestimine/kontrollnimekiri/)
- [Küberturbe sõnastik](https://tehisabiline.ee/sonastik/)

## Arendus

Sõltuvusi pole (puhas HTML/CSS/JS). Pärast päise/jaluse (`tools/chrome.mjs`) või CSS/JS muutmist:

```bash
npm run build:assets   # laiendab jagatud päise/jaluse ja lisab varadele sisuräsi (?v=…)
```

Brändivarade uuesti renderdamine (vajab kohalikku Chromiumit; vaikimisi `google-chrome`, vajadusel määra `CHROME_BIN`):

```bash
npm run build:brand
```

See genereerib SVG algallikatest favicon'id (16/32/64 px), Apple'i ikooni (180 px), rakenduse ikoonid (192/512 px), logo (512 px) ja OG-pildi (1200×630 px). Seejärel lisatakse brändivarade viidetele sisuräsi, sh jagamismetaandmetes, JSON-LD-s ja manifestis. Jagamisplatvormi enda lehe-eelvaate vahemälu võib siiski vajada värskendamist.

SEO struktuuri kontroll:

```bash
npm run test:seo
```

Põhjalikum avalike lehtede audit (sisaldab struktuurikontrolli; hoiatused on vead):

```bash
node tools/seo-loop.mjs --strict
```

Audit jätab privaatse `docs/` arhiivi välja, kuid leiab avaliku lehe ka siis, kui see on sitemap'ist puudu. Pildikontroll arvestab `<picture>` allikaid ja hero `fetchpriority="high"` märget, mitte ainult kasutamata originaali.

SEO/GEO sisupõhimõtted: vastus küsimusele on nähtavas HTML-is; teenuse ulatus, saadavus ja kontakt on selged; JSON-LD vastab lehe sisule. Avaleht ja teenuselehed kasutavad teenustele samu kanoonilisi `@id` väärtusi. `llms.txt` ja `llms-full.txt` on täiendavad kokkuvõtted, mitte indekseerimise või AI-tsitaatide garantii. Allikate arvud kirjeldavad nende uuringute valimit, mitte Eesti ettevõtte isiklikku riski.

Sisulise muudatuse korral uuenda lehe nähtavat kuupäeva, JSON-LD `dateModified` välja, artikli sotsiaalmetaandmeid ja sitemap'i `lastmod` välja koos. `llms-full.txt` ülevaatuse kuupäev peab katma viimase sisumuudatuse. Indekseerimist ja päringute tulemust mõõda Search Console'is ning Bing Webmaster Toolsis; Lighthouse'i SEO skoor ei mõõda positsioone ega AI-vastustes mainimist.

Pentestimise SEO/GEO fookus (2026-10-12):

| Kanooniline leht | Otsingu eesmärk ja teemad |
| --- | --- |
| `/pentestimine/` | Teenuse tellimine: pentestimine Eestis, pentesting, pentest, läbitungimistest, penetration testing; ulatus, raport, hind ja kordustest |
| `/api-turvatestimine/` | Arendaja ja ostja juhend: API pentest, API penetration testing, BOLA, IDOR, autentimine, autoriseerimine ja kliendipõhised õigused |
| `/veebirakenduse-turvatestimine/` | Veebilehe ja e-poe juhend: web application penetration testing, seansid, XSS, SQL-süst, CSRF, testkontod ja kasutusvood |
| `/kuberaudit/` | Laiem turvaseis ja prioriteetne parandusplaan; ei dubleeri pentesti tellimise lehte |
| `/mudelid/` | Arendatav turvatööriistade mudeli-API; mitte kliendi olemasoleva API turvatestimine |

Üks põhileht iga erineva kasutajaeesmärgi kohta; ära tekita sünonüümidele ega linnadele dubleerivaid ukslehti. Märksõnavalik tugineb terminitele, teenuse sisule ja kontrollitud OWASP/NIST allikatele, mitte mõõdetud otsingumahule või lubatud positsioonidele. Küsimuste vastused, näidisjuhtumid ja allikad peavad olema nähtavas HTML-is; metoodikaviide ei tähenda sertifikaati ega automaatset täielikku katvust.

Uue indekseeritava lehe puhul uuenda `tools/seo-check.mjs` lehtede loendit, sitemap'i, `llms.txt` ja `llms-full.txt` kokkuvõtteid ning lisa sisulised lingid olemasolevatelt lehtedelt. Kontrolli brauseris ka lehtedevaheliste `#ankur` linkide sihtmärke. Sitemap'i URL-ide järjekord ei ole SEO leping; tähtsad on täpne liikmesus, unikaalsus ja sisulise muudatuse kuupäevad.

IndexNow teavitus pärast muudatusi (kõik või valitud URL-id):

```bash
npm run submit:indexnow
npm run submit:indexnow https://tehisabiline.ee/nis2/
```

Deploy Cloudflare Pagesi (vajab `CLOUDFLARE_API_TOKEN` keskkonnamuutujat; avaldab ainult avalikud failid):

```bash
bash tools/deploy.sh
```

Peamised failid:

- `index.html` — avaleht; `site.css`, `site.js` — ühine disainisüsteem ja skript (Host Grotesk + Hanken Grotesk + JetBrains Mono, iseseisvalt majutatud)
- `assets/js/hero-demo.js` — avalehe demo; ilma JS-ita on kõik kohe nähtav
- `assets/plates/ribbon.*` — sinine valguslint (PNG originaal + AVIF/WebP 900/1500 px); kasutavad hero, alamlehtede päis ja kontaktiriba
- `assets/icons.svg` — SVG ikoonide sprite (Lucide); `assets/css/pages/*.css` — lehespetsiifilised lisareeglid
- `assets/brand/logo.svg`, `assets/brand/favicon.svg` — vektorlogo ja väikese ikooni pikslivõrgule joondatud algallikas
- `tools/logo-card.html`, `tools/og-card.html`, `tools/render-brand.mjs` — ikoonide ja lingi-eelvaate korratav renderdamine
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/` — toote- ja disainiotsused arendajatele (ei lähe avalikku deploy'sse)
- `tools/chrome.mjs` — ainus allikas jagatud päisele ja jalusele (`<!-- chrome:header -->` / `<!-- chrome:footer -->` markerid lehtedes)
- alamkataloogid — staatilised sisulehed
- `tools/seo-check.mjs` — indexeeritavate lehtede kontroll
- `tools/deploy.sh` — Cloudflare Pages'i deploy (avaldab ainult avalikud failid; nõuab `CLOUDFLARE_API_TOKEN` keskkonnamuutujat)
- `vercel.json`, `.vercelignore` — varasema Verceli seadistuse jäänuk, mida deploy ei kasuta

Varasem üldiste AI-teenuste ja SEO/GEO veebisisu algversioonid on privaatses arhiivis `docs/future-ai-site/`. `docs/` ja `tools/` ei lähe avalikku deploy'sse (`tools/deploy.sh`).

Kohalikuks eelvaateks võib kasutada näiteks `python3 -m http.server 4173` projekti juurkaustas.

## Mobiilipaigutus

Jagatud mobiilipäis on 77px (+ turvaala), logo 44px ja menüünupp 46px. Desktopi päiserida on 88px pluss piirjoon. Alla 980px avaneb menüü päise all sisu paigutust muutmata; sulgub lingi, Escape'i või välise puudutusega. Desktopi üleminek sulgeb menüü. Mobiili hero ja alamlehe päis kasutavad tavalist paigutusvoogu, mitte desktopi negatiivset ülaserva; alla 600px on põhitegevused täislaiused. Avalehe suur kaherealine pealkiri taastab esinduslikuma avavaate, säilitades konkreetse teenuse- ja väljundikirjelduse.

Kontrollitud Chromiumis 320/390/430px püstivaates, 844px rõhtvaates ning sünteesitud puutesisendiga. Päris iPhone'i/Safari ja Android-seadme kontroll jääb eraldi riistvarakontrolliks.

## Konkurentidest õpitud sisu- ja struktuurivõtted

2026-10-12: uuritud [OIXIO läbistustestimise lehte](https://oixio.eu/et/cyber/labistustestimine-teenusena/), [ProksiAbeli teenuse selgitust](https://proksiabel.ee/en/labistustestimine), [Clarified Security teenuse fookust](https://clarifiedsecurity.ee/penetration-testing/), [Astra rakenduste pentesti lehte](https://www.getastra.com/services/application-penetration-testing-services) ja [Lupine metoodikat](https://lupinesec.com/methodology).

Kohandatud võtted: konkreetne teenus kohe avavaates; sihtrühm ja ostja otsus; faas → tegevus → väljund; näidisraport; pakkumiseks vajalike sisendite kontrollnimekiri; piirid ja järeltesti tingimused. Tehisabilise eristus on agendipõhised abikontrollid koos oluliste leidude inimese kinnitamisega, mitte skannerihoiatuste esitlemine kinnitatud leidudena.

Konkurentide teksti, hindu, meeskonna suurust, kliendilogosid, sertifikaate ega teenuselubadusi ei kopeerita. Nende lehtede ülesehitust vaadeldi, mitte otsingupositsioone ega liiklusandmeid; ükski struktuurimuudatus ei tõenda paremaid positsioone. „Läbistustestimine” on lisatud olemasoleva `/pentestimine/` lehe nähtavasse teksti ja struktureeritud nimedesse, mitte dubleerivale märksõnalehele.

Avalehe interaktiivne demo (`#demo`) on hero esimeses vaates pealkirja kõrval; selle all jaotises `#teenused` on kaks pakkumiskaarti, API kaardil märge „API pole veel avalik”. Avaleht hoitakse lühikese ja konkreetsena (u 600 sõna): pikk selgitav tekst, uuringunumbrid ja võrdlused asuvad alamlehtedel.

Teenusehierarhia: avalehe pealkiri, kaks põhitegevust ning päise/jaluse teenuselingid peavad näitama kahte pakkumist: **küberaudit/pentestimine** ja **keeldudeta küber-AI API**. Pentestimise SEO rõhk ei tohi API pakkumist avavaatest eemaldada. API arendusstaatus peab jääma nähtavaks; olemasoleva kliendi API turvatestimine ei ole mudeli-API toode.
