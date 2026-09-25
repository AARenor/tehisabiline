# Goal: tehisabiline-ou-staatus

## Objective

Viia tehisabiline.ee veebileht ja sisemine teabefail täielikku vastavusse Tehisabiline OÜ tegeliku ärimudeli ja positsioneeringuga: tsenseerimata küber-AI, mis on hostitud Eestis; arendajatele piiranguteta OpenAI-ühilduv API; agendipõhised küberauditid. Kajastada avalikult: positsioneering, probleem (filtreeritud mudelid blokeerivad legitiimseid turvateste), API, mudelid (Qwen 27B tsenseerimata lineup, avatud kaalud), auditi kontrollvaldkonnad (süstiründed, API auth, rate limits, HTTP päised, andmeleke), andmete käsitlus (ei kogu/treeni/leki), AI Act GPAI, sihtrühm, aus staatus. Mitte kajastada: ärimudeli detaile, marginaale, konkurentide halvustust, riistvara tellimuse olekut, finantsprognoose.

## Done when

- Teabefail notes-tehisabiline-overview.md sisaldab kogu ettevõtteinfot ja selget jaotust avalik vs sisemine
- Avaleht, /mudelid/ ja /kuberaudit/ kajastavad kõiki avalikke punkte (andmed, AI Act, auditivaldkonnad, mudelid, sihtrühm)
- npm run test:seo + seo-loop läbivad; live-kontrollid tehisabiline.ee-l kinnitavad muudatused
- Reviewer subagent kinnitab: sisemised asjad ei lekkinud veebilehele, avalikud punktid on kajastatud
