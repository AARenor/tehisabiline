# Tehisabiline OÜ — sisemine teabefail

> **Sisemine dokument.** Ei lähe veebilehele tervikuna. Veebilehel kajastuvad ainult jaotises „MIDA VEEBILEHEL KAJASTADA" märgitud punktid. Ülejäänu on taustateadmine (ärimudel, konkurents, plaanid) — mitte avalik sisu.

Allikas: kasutaja ettevõtte-info (2026-09-25), sh ingliskeelne ja eestikeelne kirjeldus.

---

## 1. Positsioneering (lühidalt)

Eestis hostitud **tsenseerimata küber-AI**: arendajatele piiranguteta API + agendipõhised küberauditid.

- **Nõudlus:** turvalise, kiire AI-taristu ja API-teenuste järele kasvab kiiresti; regionaalsel turul on lünk suveräänsete, madala latentsusega ja piiranguteta inference-süsteemide järele.
- **Probleem:** suured kaubanduslikud mudelid blokeerivad filtreid kasutades legitiimseid küberkaitse päringuid (nt staatilise ekspluatiivkoodi analüüs, ründepayload'id, red-teaming). See takistab tarkvaraettevõtetel ja turvatiimidel realistlikke ründeteste teha.
- **Kohalik turg:** otsene konkurents hõre; olemasolevad kohalikud alternatiivid kasutavad vananenud, vähem intelligentseid mudeleid.

## 2. Tootepakkumine

- **OpenAI-ühilduv API** + arendajate tööriistad, hostitud 100% Eestis.
- **Mudelid:** tipptasemel avatud kaaludega mudelid, eelkõige **Qwen 27B tsenseerimata lineup** — läheneb frontier-tasemele, annab operatiivse paindlikkuse, kiiruse ja vabaduse pilve-keeldumiste filtreist.
- **Agendipõhised auditid:** kohandatud agent-orchestration harjused sihitud haavatavuste hindamiseks: prompt-injection pinnad, API autentimisloogika, rate limits, HTTP turvapäised, andmete eksfiltreerimise vektorid.
- **Arenduses:** API dev-tool sujuvamaks integreerimiseks kohalikele arendajatele.

## 3. Andmed ja vastavus

- Mudelid on **eeltreenitud avalikel andmestikel** (avatud kaalud).
- **Me ei kogu ega treeni mudeleid kasutajate eraandmetel.**
- API-s ja auditites töötleme ainult kliendi esitatud sisendit (koodilõigud, süsteemipäringud) reaalajas vastuse/raporti jaoks.
- Kliendi andmeid **ei salvestata, ei treenita edasi ega lekita kolmandatele osapooltele**.
- Kogu töötlus **Eestis** → vastavus EL andmekaitse- ja andmeisolatsiooni nõuetele.
- **EU AI Act:** GPAI (üldotstarbeline AI) kategooria, ei kuulu kõrge riskiga süsteemide hulka. Ollakse valmis: tehniline dokumentatsioon, teadaolevate riskide hindamine, kasutusläbipaistvus.

## 4. Ärimudel ja kliendid

- **Kliendid:** tarkvaraettevõtted (arendajad ja kübertiimid).
- **Tulu:** API krediidid (pay-as-you-go) + ettemakstud B2B mahud; küberauditid B2B projektilepingutega.
- **Turg:** kiiresti arenev, kohalik konkurents puudub, nõudlus tulevikus vältimatu.

## 5. Riistvara ja skaleerimine

- **Praegu:** Nvidia Tesla V100 GPU-d, mõeldud high-throughput, enterprise-grade kiirenduseks keskmise suurusega LLM inferencel. Riistvara on **tellimusel**.
- **Arhitektuuri eesmärk:** modulaarne skaleeritavus — on valmis vahetama järgmise põlvkonna GPU-node'ide vastu, kui API-liiklus kasvab.
- Lühiajalised B2B arendajakohordid teenindatakse kohe; selge kõrge marginaaliga skaleerimise tee.

## 6. Staatus (2026-09-25)

- **Varajane arenguetapp.** Tehtud: põhjalik tutvumine tsenseerimata mudelite võimekusega; katselised esmased küberauditid; agendisüsteemide testimine turvatestides; põhjalik turuanalüüs (kinnitab nõudlust).
- **Töös:** skaleeritava GPU-riistvara kokkupanek; API dev-tool liidese arendamine.

## 7. Visioon 2–3 aastat

- Kasvada regionaalseks juhtivaks tsenseerimata küber-AI pakkujaks.
- API-põhine mudel: kõrge cache hit rate + optimeeritud inference → madalad arvutuskulud, kõrge marginaal.
- Standardiseerida küberauditi agendid B2B pakettideks, eksporditavad välisturgudele.
- Laiendada taristut vastavalt nõudlusele (täiendav GPU-serverivõimsus) → turvalise ja piiranguteta AI standard.

---

## MIDA VEEBILEHEL KAJASTADA (ainult need)

Veebilehel ei mainita: ärimudeli detaile (krediidid/marginaalid/ettekasted), klientide sektoreid müügikeeles, konkurentide halvustamist, rahavooge ega tuleviku finantsprognoose, riistvara „tellimusel" olekut ega skaleerimise äriplaani.

Kajastada:

1. **Positsioneering:** tsenseerimata küber-AI, hostitud Eestis; arendajatele piiranguteta API + agendipõhised küberauditid. ✅ (juba avalehel)
2. **Miks oluline:** turvatöö jaoks on filtreeritud pilvemudelid takistuseks — legitiimsed turvatestid (koodianalüüs, payload'id, red-teaming) lükatakse tagasi. ✅ (avaleht + mudelid)
3. **API:** OpenAI-ühilduv, kiire, võtmepõhine, pay-as-you-go põhimõte (ilma summade/limiitideta). ✅
4. **Mudelid:** Qwen 27B tsenseerimata lineup, avatud kaalud, kvaliteet lähedal frontier-tasemele. ✅ (osaliselt — lisada "avatud kaalud / avalikud andmed")
5. **Agendipõhised auditid:** täpsed kontrollvaldkonnad — **süstiründed (prompt injection), API autentimine, rate limits, HTTP turvapäised, andmelekke vektorid**. ⚠️ OSAKEST — lisada see loetelu kuberauditi lehele.
6. **Andmete käsitlus:** ei koguta, ei treenita edasi, ei lekita; töötlemine Eestis; andmeisolatsioon. ✅ (osaliselt — tugevdada sõnastust)
7. **AI Act:** GPAI kategooria, ei ole kõrge riskiga; läbipaistvus ja tehniline dokumentatsioon. ⚠️ PUUDUB — lisada privaatsus- või mudelite lehele lühike lõik.
8. **Sihtrühm:** tarkvaraettevõtted, arendajad ja kübertiimid (ilma tulumudeli detailideta). ✅ (osaliselt)
9. **Staatus ausalt:** varajane etapp, pilootfaas — juba kasutusel olev sõnastus. ✅

## Muudatuste logi

- 2026-09-25: fail loodud; jagatud avalikuks sisuks (punktid 1–9) ja sisemiseks taustaks (ärimudel, konkurents, plaanid).
- 2026-09-25 (hiljem): veebilehele lisatud — andmete käsitlus ("ei koguta, ei treenita, ei lekita") API-kaardil ja kuberauditi KKK-s; AI Act GPAI osa (mudelite leht + number-card); mudelite sõnastus "avatud kaalud, Qwen 27B tsenseerimata lineup"; auditi kontrollvaldkonnad tabelis (API-loogika, HTTP-turve, Süstiründed, Andmeleke); sihtrühm ("arendajad ja kübertiimid") API-kaardil. Kõik 9 avalikku punkti on nüüd kajastatud.
