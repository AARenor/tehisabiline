# Evidence: tehisabiline-ou-staatus

## 1. Teabefail notes-tehisabiline-overview.md sisaldab kogu ettevõtteinfot ja selget jaotust avalik vs sisemine

- commands: kirjutatud käsitsi kasutaja esitatud info põhjal (2026-09-25)
- files: notes-tehisabiline-overview.md (ärimudel, konkurents, riistvara, staatus, visioon = sisemine; 9 avalikku punkti = veebilehel)
- result: fail olemas, ~90 rida, selge "MIDA VEEBILEHEL KAJASTADA (ainult need)" jaotis ja muudatuste logi.

## 2. Avaleht, /mudelid/ ja /kuberaudit/ kajastavad kõiki avalikke punkte

- commands: grep-kontrollid + reviewer subagent (round 1 + round 2)
- files: index.html (hero "Tsenseerimata AI. Keeldudeta. Eestis hostitud.", andmeplokk "Ei koguta, ei treenita, ei lekita", sihtrühm, Qwen 27B, "(tulekul)" riistvara-alus); mudelid/index.html (avatud kaalud, Qwen 27B lineup, andmed+AI Act rubriik id=vastavus, "varajases etapis", FAQ "Miks pilv keeldub"); kuberaudit/index.html (tabel: API-loogika/rate limits, HTTP-turve, Süstiründed/prompt injection, Andmeleke/eksfiltreerimise vektorid; andmete kinnitus; koodianalüüs/payload/red-teaming lead-answers); privaatsus/index.html (AI Act GPAI rubriik + TOC, hosting-clarification); kasutusjuhud/index.html (uus 12-kasutusjuhu juhend MIRE ATT&CK/OWASP LLM/NCSC allikatel)
- result: reviewer round 2: 10/10 PASS, 0 P0/P1; round 1 leiud (Qwen nimi, konkreetsed nimisõnad, varajane etapp, GPAI paigutus, hosting selgitus) kõik parandatud.

## 3. npm run test:seo + seo-loop läbivad; live-kontrollid

- commands: `npm run test:seo` → "SEO check passed for 9 indexable pages."; `node tools/seo-loop.mjs` → "CLEAN — 0 failure(s), 0 warning(s)"; Playwright screenshot kasutusjuhud lehest (render ok); live curl-kontrollid allpool
- files: tools/seo-check.mjs (kasutusjuhud kirje + allika-assertid MITRE/OWASP/NCSC), sitemap.xml, llms.txt, llms-full.txt, vercel.json (redirect), ai-automatiseerimise-naited/index.html (redirect stub)
- result: kõik rohelised; redirect + uus leht olemas; live kontroll tehtud peale pushi.

## 4. Reviewer subagent kinnitab: sisemised asjad ei lekkinud, avalikud punktid kajastatud

- commands: reviewer subagent round 1 (ses_f25a17bf0ffe7CniQxTfPvHtbg) + round 2 (ses_f257086bcffeMOelXE5SBFF7f0)
- files: 5 avalikku HTML-faili + kasutusjuhud/index.html
- result: R1: 0 leket (margin/kasum/ettemaks/krediit/tellimusel/skaleer/prognoos/miljon/tulu = 0 tabamust), 4 P1 + 3 P2 leidu → parandatud. R2: 10/10 PASS, P2 soovitused (og:alt, nav-labelid, kuberauditi sõnavara) samuti rakendatud.
- P1-4 (n8n webhook abuse-control) on serveripoolne soovitus → kirjas teabefaili järgmiste sammudena, ei ole saidi-koodi muudatus.

## Live-kontrollid (peale pushi)

- commands: curl avaleht/mudelid/kuberaudit/kasutusjuhud + vana URL + sitemap; npm run submit:indexnow
- result: avaleht 200, kasutusjuhud 200, vana URL -> redirect leht ("Teisaldatud: Küber-AI kasutusjuhud"), Qwen 3.8 = 0, Qwen 27B = 1, varajases etapis = 1 (mudelid), GPAI = 1 (privaatsus), (tulekul) = 1 (avaleht), IndexNow 6 URL-i accepted.
