#!/usr/bin/env python3
"""Build the AI Act high-risk worksheets served by /ai-act/korge-riskiga-susteemid/ and /en/ai-act/high-risk/.

Two workbooks from one source of truth:
  assets/downloads/ai-act-korge-risk-too-leht.xlsx   (Estonian)
  assets/downloads/ai-act-high-risk-worksheet.xlsx   (English)

Sheets in both files: Classification, Requirements and evidence, Roles, plus a short Guide.
Rows follow Regulation (EU) 2024/1689: art 6(1)-(4), Annex III (eight areas), art 8-15,
art 16-17 and 23-27, art 49. Wording is a working paraphrase, not the legal text.

Run from the repo root:  python3 tools/build_ai_act_worksheet_xlsx.py
Requires openpyxl (system python3-openpyxl).
"""

from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

DOWNLOADS = Path(__file__).resolve().parent.parent / "assets" / "downloads"
INK = "FF1F3B4D"
MUTED = "FF5A6B75"
BAND = "FFF2F6F8"
LINE = Side(style="thin", color="FFD3DDE3")
LAST_ROW = 120

# --- shared wording -------------------------------------------------------------------------

EXCEPTION_HINT = {
    "et": "Kontrolli art 6(3) punkte (a)–(d). Kui süsteem profileerib füüsilisi isikuid, on see alati suur risk.",
    "en": "Test Article 6(3) points (a)–(d). If the system profiles natural persons, it is always high-risk.",
}
AREA_LAW_HINT = {
    "et": "III lisa kohaldub ainult niivõrd, kuivõrd kasutus on liidu või riigi õiguse järgi lubatud.",
    "en": "Annex III applies only in so far as the use is permitted under Union or national law.",
}

CLASSIFICATION_HEADERS = {
    "et": ["Valdkond (III lisa)", "Punkt", "Kasutus III lisa sõnastuses", "Küsimus oma süsteemi kohta",
           "Vastus", "Art 6(3) erandi test", "Põhjendus", "Tõendi viide"],
    "en": ["Annex III area", "Point", "Use as listed in Annex III", "Question about your system",
           "Answer", "Article 6(3) exception test", "Rationale", "Evidence ref"],
}
CLASSIFICATION_WIDTHS = [30, 8, 56, 58, 14, 56, 44, 16]
ANSWERS = {"et": ["Jah", "Ei", "Ei ole kindel"], "en": ["Yes", "No", "Not sure"]}

# (area, point, use paraphrase, question, extra hint)
CLASSIFICATION_ROWS = {
    "et": [
        ("Biomeetria", "1(a)", "Kaug-biomeetriline tuvastamine. Ei hõlma biomeetrilist verifitseerimist, mille ainus eesmärk on kinnitada, et isik on see, keda ta väidab olevat.",
         "Kas süsteem tuvastab inimesi kaugelt näo, kõne või muu biomeetrilise tunnuse järgi?", AREA_LAW_HINT["et"]),
        ("Biomeetria", "1(b)", "Biomeetriline kategoriseerimine tundlike või kaitstud tunnuste või omaduste alusel, kui need tunnused on tuletatud.",
         "Kas süsteem tuletab inimestest tundlikke tunnuseid (nt vanus, sugu, rahvus) või liigitab neid nende alusel?", ""),
        ("Biomeetria", "1(c)", "Emotsioonituvastus.",
         "Kas süsteem tuletab inimeste emotsioone näost, hääletoonist või muust käitumisest?", ""),
        ("Kriitiline taristu", "2", "Ohutuskomponendina kasutatavad süsteemid kriitilise digitaristu, liikluse või vee, gaasi, kütte või elektri varustuse juhtimisel ja käitamisel.",
         "Kas süsteem on ohutuskomponent kriitilise taristu juhtimises või käitamises?", "Kui jah, kontrolli ka art 6(1) I lisa teed."),
        ("Haridus ja kutseõpe", "3(a)", "Juurdepääsu või vastuvõtu otsustamine või isikute paigutamine õppe- ja kutseõppeasutustesse kõigil tasanditel.",
         "Kas süsteem otsustab, kes pääseb õppima või kuhu isik paigutatakse?", ""),
        ("Haridus ja kutseõpe", "3(b)", "Õpitulemuste hindamine, sealhulgas siis, kui tulemust kasutatakse isiku õppeprotsessi suunamiseks.",
         "Kas süsteem hindab õpitulemusi või suunab nende alusel õppeprotsessi?", ""),
        ("Haridus ja kutseõpe", "3(c)", "Hindamine, millise haridustaseme isik saab või millele tal on juurdepääs.",
         "Kas süsteem otsustab, millisele haridustasemele isik kvalifitseerub?", ""),
        ("Haridus ja kutseõpe", "3(d)", "Õpilaste keelatud käitumise jälgimine ja tuvastamine testide ajal.",
         "Kas süsteem jälgib või tuvastab keelatud käitumist eksamitel või testidel?", ""),
        ("Töölevõtmine ja töötajate juhtimine", "4(a)", "Värbamine või valik: sihitud töökuulutuste paigutamine, tööavalduste analüüs ja filtreerimine, kandidaatide hindamine.",
         "Kas süsteem paigutab töökuulutusi, filtreerib avaldusi või hindab kandidaate?", "Profiilimine välistab art 6(3) erandi."),
        ("Töölevõtmine ja töötajate juhtimine", "4(b)", "Töösuhet mõjutavad otsused: edutamine või lõpetamine, ülesannete jaotamine isiku käitumise või omaduste alusel, tulemuslikkuse ja käitumise jälgimine ning hindamine.",
         "Kas süsteem mõjutab töösuhet, jaotab ülesandeid või hindab töötaja tulemuslikkust?", "Profiilimine välistab art 6(3) erandi."),
        ("Olulised teenused ja hüved", "5(a)", "Avaliku võimu kasutatav või nimel tegutsev süsteem oluliste avalike hüvitiste ja teenuste (sh tervishoiuteenuste) abikõlblikkuse hindamiseks ning nende andmiseks, vähendamiseks, tühistamiseks või tagasinõudmiseks.",
         "Kas süsteem hindab abikõlblikkust avalikele hüvedele või teenustele?", ""),
        ("Olulised teenused ja hüved", "5(b)", "Krediidivõimelisuse või krediidiskoori hindamine. Erand: süsteemid, mida kasutatakse finantspettuse tuvastamiseks.",
         "Kas süsteem hindab isiku krediidivõimelisust või krediidiskoori?", "Pettuse tuvastamiseks kasutatav süsteem on erand."),
        ("Olulised teenused ja hüved", "5(c)", "Riskihindamine ja hinnastamine elu- ja tervisekindlustuses füüsiliste isikute puhul.",
         "Kas süsteem hindab riski või määrab hinda elu- või tervisekindlustuses?", ""),
        ("Olulised teenused ja hüved", "5(d)", "Hädaabikõnede hindamine ja liigitamine, päästeüksuste suunamine või prioriteedi määramine, sealhulgas haigla triaaž.",
         "Kas süsteem liigitab hädaabikõnesid, suunab päästjaid või teeb triaaži?", ""),
        ("Õiguskaitse", "6(a)", "Riskihindamine, kas füüsiline isik võib langeda kuriteoohvriks.",
         "Kas süsteem hindab ohvriks langemise riski õiguskaitse tarbeks?", AREA_LAW_HINT["et"]),
        ("Õiguskaitse", "6(b)", "Polügraafid ja sarnased vahendid.",
         "Kas süsteemi kasutatakse polügraafi või sarnase vahendina?", AREA_LAW_HINT["et"]),
        ("Õiguskaitse", "6(c)", "Tõendite usaldusväärsuse hindamine kriminaalasja uurimises või süüdistuses.",
         "Kas süsteem hindab tõendite usaldusväärsust?", AREA_LAW_HINT["et"]),
        ("Õiguskaitse", "6(d)", "Riski hindamine, et isik paneb toime kuriteo või kordab seda, mitte ainult direktiivi (EL) 2016/680 art 3(4) mõttes profileerimise alusel, ning isikuomaduste või varasema käitumise hindamine.",
         "Kas süsteem hindab, kas isik paneb toime kuriteo või kordab seda?", AREA_LAW_HINT["et"]),
        ("Õiguskaitse", "6(e)", "Direktiivi (EL) 2016/680 art 3(4) mõttes profileerimine kuritegude avastamisel, uurimisel või süüdistuse esitamisel.",
         "Kas süsteem profileerib isikuid kriminaalmenetluses?", AREA_LAW_HINT["et"]),
        ("Migratsioon ja piirikontroll", "7(a)", "Polügraafid ja sarnased vahendid pädevate asutuste või liidu organite tarbeks.",
         "Kas süsteemi kasutatakse migratsiooni-, varjupaiga- või piirikontrolli kontekstis polügraafina?", AREA_LAW_HINT["et"]),
        ("Migratsioon ja piirikontroll", "7(b)", "Riski hindamine, sealhulgas julgeoleku-, ebaregulaarse migratsiooni- või terviserisk, isiku puhul, kes kavatseb siseneda liikmesriigi territooriumile või on sinna sisenenud.",
         "Kas süsteem hindab sellist riski siseneja või sisenenud isiku kohta?", AREA_LAW_HINT["et"]),
        ("Migratsioon ja piirikontroll", "7(c)", "Varjupaiga-, viisa- või elamisloataotluste (ja nendega seotud kaebuste) läbivaatamise abistamine, sealhulgas tõendite usaldusväärsuse hindamine.",
         "Kas süsteem abistab taotluse läbivaatamisel või hindab taotleja staatust?", AREA_LAW_HINT["et"]),
        ("Migratsioon ja piirikontroll", "7(d)", "Isikute tuvastamine, äratundmine või identifitseerimine migratsiooni, varjupaiga või piirikontrolli kontekstis. Erand: reisidokumentide kontroll.",
         "Kas süsteem tuvastab isikuid piiril? (reisidokumendi kontroll on erand)", AREA_LAW_HINT["et"]),
        ("Õigusemõistmine ja demokraatia", "8(a)", "Kohtuasutuse abistamine faktide ja õiguse uurimisel ning õiguse kohaldamisel konkreetsetele asjaoludele, samuti alternatiivses vaidluste lahendamises.",
         "Kas süsteem abistab kohtunikku või vaidluste lahendajat õiguse kohaldamisel?", ""),
        ("Õigusemõistmine ja demokraatia", "8(b)", "Valimiste või rahvahääletuse tulemuse või hääletuskäitumise mõjutamine. Erand: tööriistad, mille väljundile isikud otseselt ei ole avatud (nt kampaania halduslik korraldamine).",
         "Kas süsteem mõjutab valimistulemust või hääletuskäitumist?", ""),
    ],
    "en": [
        ("Biometrics", "1(a)", "Remote biometric identification. Excludes biometric verification whose sole purpose is to confirm that a person is who they claim to be.",
         "Does the system identify people remotely by face, voice or another biometric trait?", AREA_LAW_HINT["en"]),
        ("Biometrics", "1(b)", "Biometric categorisation according to sensitive or protected attributes, based on inferring those attributes.",
         "Does the system infer sensitive attributes (for example age, sex, ethnicity) or sort people by them?", ""),
        ("Biometrics", "1(c)", "Emotion recognition.",
         "Does the system infer emotions from faces, voice or other behaviour?", ""),
        ("Critical infrastructure", "2", "Systems used as safety components in the management and operation of critical digital infrastructure, road traffic, or the supply of water, gas, heating or electricity.",
         "Is the system a safety component in the management or operation of critical infrastructure?", "If yes, also test the Article 6(1) Annex I route."),
        ("Education and vocational training", "3(a)", "Determining access, admission or assignment of persons to education and vocational training institutions at all levels.",
         "Does the system decide who is admitted or where a person is placed?", ""),
        ("Education and vocational training", "3(b)", "Evaluating learning outcomes, including where those outcomes steer the learning process.",
         "Does the system grade outcomes or steer the learning process from them?", ""),
        ("Education and vocational training", "3(c)", "Assessing the level of education a person will receive or can access.",
         "Does the system decide which level of education a person qualifies for?", ""),
        ("Education and vocational training", "3(d)", "Monitoring and detecting prohibited behaviour of students during tests.",
         "Does the system monitor or detect prohibited behaviour in exams?", ""),
        ("Employment and workers", "4(a)", "Recruitment or selection: targeted job advertisements, analysing and filtering applications, evaluating candidates.",
         "Does the system place job ads, filter applications or evaluate candidates?", "Profiling removes the Article 6(3) exception."),
        ("Employment and workers", "4(b)", "Decisions affecting terms of work: promotion or termination, allocating tasks based on behaviour or traits, monitoring and evaluating performance.",
         "Does the system affect a working relationship, allocate tasks or evaluate performance?", "Profiling removes the Article 6(3) exception."),
        ("Essential services and benefits", "5(a)", "Used by or on behalf of public authorities to evaluate eligibility for essential public assistance benefits and services, including healthcare, and to grant, reduce, revoke or reclaim them.",
         "Does the system assess eligibility for public benefits or services?", ""),
        ("Essential services and benefits", "5(b)", "Evaluating creditworthiness or establishing a credit score. Exception: systems used to detect financial fraud.",
         "Does the system assess creditworthiness or a credit score?", "Fraud detection is the stated exception."),
        ("Essential services and benefits", "5(c)", "Risk assessment and pricing for natural persons in life and health insurance.",
         "Does the system assess risk or set prices in life or health insurance?", ""),
        ("Essential services and benefits", "5(d)", "Evaluating and classifying emergency calls, dispatching or prioritising first responders, including emergency healthcare triage.",
         "Does the system classify emergency calls, dispatch responders or triage patients?", ""),
        ("Law enforcement", "6(a)", "Assessing the risk of a person becoming a victim of criminal offences.",
         "Does the system assess victimisation risk for law enforcement?", AREA_LAW_HINT["en"]),
        ("Law enforcement", "6(b)", "Polygraphs or similar tools.",
         "Is the system used as a polygraph or similar tool?", AREA_LAW_HINT["en"]),
        ("Law enforcement", "6(c)", "Evaluating the reliability of evidence during investigation or prosecution.",
         "Does the system evaluate the reliability of evidence?", AREA_LAW_HINT["en"]),
        ("Law enforcement", "6(d)", "Assessing the risk of offending or re-offending, not solely on the basis of profiling under Article 3(4) of Directive (EU) 2016/680, or assessing personality traits and past criminal behaviour.",
         "Does the system assess the risk that a person offends or re-offends?", AREA_LAW_HINT["en"]),
        ("Law enforcement", "6(e)", "Profiling under Article 3(4) of Directive (EU) 2016/680 in the detection, investigation or prosecution of criminal offences.",
         "Does the system profile people in a criminal investigation?", AREA_LAW_HINT["en"]),
        ("Migration and border control", "7(a)", "Polygraphs or similar tools for competent authorities or Union bodies.",
         "Is the system used as a polygraph in migration, asylum or border control?", AREA_LAW_HINT["en"]),
        ("Migration and border control", "7(b)", "Assessing a risk, including security, irregular migration or health risk, posed by a person intending to enter or having entered a Member State.",
         "Does the system assess such a risk for a person entering or who has entered?", AREA_LAW_HINT["en"]),
        ("Migration and border control", "7(c)", "Assisting the examination of asylum, visa or residence-permit applications and associated complaints, including assessments of the reliability of evidence.",
         "Does the system assist the examination of an application or assess the applicant's status?", AREA_LAW_HINT["en"]),
        ("Migration and border control", "7(d)", "Detecting, recognising or identifying persons in migration, asylum or border control. Exception: verification of travel documents.",
         "Does the system identify people at the border? (travel-document verification is excepted)", AREA_LAW_HINT["en"]),
        ("Justice and democratic processes", "8(a)", "Assisting a judicial authority in researching and interpreting facts and the law and in applying the law to a concrete set of facts, or used similarly in alternative dispute resolution.",
         "Does the system assist a judge or an alternative dispute resolver?", ""),
        ("Justice and democratic processes", "8(b)", "Influencing the outcome of an election or referendum or the voting behaviour of natural persons. Exception: tools whose output people are not directly exposed to, such as campaign administration.",
         "Does the system influence an election result or voting behaviour?", ""),
    ],
}

REQUIREMENTS_HEADERS = {
    "et": ["Säte", "Nõue lühidalt", "Mida testida ja millist tõendit hoida", "Omanik", "Staatus", "Kuupäev", "Tõendi asukoht"],
    "en": ["Article", "Requirement in short", "What to test and which evidence to keep", "Owner", "Status", "Date",
           "Evidence location"],
}
REQUIREMENTS_WIDTHS = [10, 46, 74, 18, 16, 12, 30]
STATUSES = {"et": ["Pole alustatud", "Töös", "Valmis", "Edasi lükatud"],
            "en": ["Not started", "In progress", "Done", "Postponed"]}
STATUS_FILLS = {
    0: ("FFEDF1F4", "FF5A6B75"),
    1: ("FFE4EDF7", "FF1B4E7A"),
    2: ("FFE3F5E9", "FF1E6B3A"),
    3: ("FFFFF2D0", "FF7A5300"),
}

REQUIREMENTS_ROWS = {
    "et": [
        ("Art 9", "Riskijuhtimissüsteem on loodud, rakendatud, dokumenteeritud ja hooldatud kogu elutsükli jooksul; hõlmab ohtude tuvastamist, hindamist, kaalumist ja leevendamist.",
         "Riskiregister ohtude, tõenäosuse ja mõjuga; iga leevenduse kohta test ja tulemus; seos post-turu seire andmetega (art 72); korduste logi."),
        ("Art 10", "Andmete juhtimine: treening-, valideerimis- ja testandmete asjakohasus, päritolu, kvaliteet ja erapooletuse kontroll.",
         "Andmekaart (allikas, kogumise eesmärk, periood, siltide kvaliteet); duplikaatide ja lekke test; eelarvamuste mõõtmine rühmade kaupa; andmete puudujääkide loend."),
        ("Art 11", "Tehniline dokumentatsioon enne turule laskmist ja pidevalt ajakohane; sisaldab vähemalt IV lisas loetletud elemente.",
         "Dokumendiregister versioonidega; vastendus iga art 9–15 nõude ja tõendi vahel; muudatuste logi koos kinnitajaga."),
        ("Art 12", "Süsteem peab tehniliselt võimaldama sündmuste automaatset salvestamist (logimist) kogu eluea jooksul.",
         "Logiskeem ja väljade loend; näidised päris sündmustest enne ja pärast parandust; kellaaja allikas ja ajatemplite järjepidevus."),
        ("Art 12", "Logimine peab võimaldama tuvastada riskiolukordi ja olulisi muudatusi, toetada post-turu seiret ning jälgida kasutaja järelevalvekohustust (art 26(5)).",
         "Kolm stsenaariumit: riskiolukord, oluline muudatus ja tavakasutus – iga stsenaariumi kohta logikirje, millest uurija saab aru ilma arendaja abita."),
        ("Art 12", "III lisa punkti 1(a) süsteemide puhul logitakse vähemalt kasutusperiood (algus ja lõpp), viiteandmebaas, kokkulangevuse andnud sisendandmed ja tulemust kontrollinud isikud.",
         "Näidislogi kõigi nelja väljaga; viiteandmebaasi versiooni jälgitavus; juurdepääsuõigused logidele."),
        ("Art 13", "Läbipaistvus ja kasutusjuhend: süsteemi omadused, võimekus ja piirangud, sealhulgas deklareeritud täpsus, vastupidavus ja küberturvalisus.",
         "Kasutusjuhendi tekstiversioon; deklareeritud täpsusmõõdikute mõõtmise protokoll; piirangute ja teadaolevate nõrkuste loetelu."),
        ("Art 14", "Tõhus inimjärelevalve kasutuse ajal, kas süsteemi sisse ehitatud või kasutaja rakendatavate meetmetena, proportsionaalselt riski ja autonoomiaga.",
         "Ülevaataja roll ja volitus; peatamise test; kinnitusnõude test (kas otsus läheb läbi ilma inimeseta); koolituse ja kompetentsi tõend."),
        ("Art 15", "Täpsus: sobiv täpsustase ja selle mõõdikud, mis tuleb deklareerida kasutusjuhendis (art 15(3)).",
         "Testandmestik ja selle representatiivsus; mõõdikud (nt täpsus, saagikus, veamäär) koos arvutusviisiga; kordustesti tulemus samal andmestikul."),
        ("Art 15", "Vastupidavus: süsteem talub võimalikult hästi vigu, tõrkeid ja ebajärjekindlust süsteemis ja keskkonnas, sealhulgas suhtluses inimestega; tehniline redundants või fail-safe plaan.",
         "Rikke-süstimise testid (katkine või tühi sisend, mudeli tõrge, võrgu katkestus); taastumise aeg; fail-safe plaani test ja tulemus."),
        ("Art 15", "Küberturvalisus: vastupidavus kolmandate osapoolte katsetele muuta süsteemi kasutust, väljundit või toimivust haavatavusi ära kasutades.",
         "Autoriseeritud läbistustesti raport koos ulatusega; haavatavuste loend ja paranduste tõendid; juurdepääsukontrolli ja saladuste kaitse test."),
        ("Art 15", "AI-spetsiifilised haavatavused: andmemürgitus, eeltreenitud komponentide mürgitamine, adversariaalsed sisendid ehk mudeli vältimine, konfidentsiaalsusarünnakud ja mudeli vead.",
         "Prompt injection'i ja adversariaalsete sisendite testid; mürgituse stsenaarium treeningandmetes; mudeli ekstraheerimise katse; iga katse kohta tulemus ja leevendus."),
    ],
    "en": [
        ("Art 9", "A risk-management system established, implemented, documented and maintained across the lifecycle: identification, estimation, evaluation and mitigation of risks.",
         "Risk register with likelihood and impact; a test and result for each mitigation; the feedback loop from post-market monitoring (Article 72); review log."),
        ("Art 10", "Data governance: suitability, origin, quality and bias examination of training, validation and testing data.",
         "Data map (source, collection purpose, period, label quality); duplicate and leakage tests; bias measurement by group; a list of known data gaps."),
        ("Art 11", "Technical documentation drawn up before placing on the market and kept up to date, containing at least the Annex IV elements.",
         "Document register with versions; a mapping from every Article 9–15 requirement to its evidence; change log with approver."),
        ("Art 12", "The system must technically allow automatic recording of events (logs) over its lifetime.",
         "Log schema and field list; real event samples before and after a fix; clock source and timestamp consistency."),
        ("Art 12", "Logging must allow identification of risk situations and substantial modifications, support post-market monitoring and allow monitoring of the deployer's oversight duty (Article 26(5)).",
         "Three scenarios: risk situation, substantial modification, normal use — for each, a log record an investigator can read without the developer."),
        ("Art 12", "For Annex III point 1(a) systems, logging covers at least the period of each use (start and end), the reference database, the input data that produced a match, and the persons who verified the results.",
         "Sample log with all four fields; traceability of the reference-database version; access rights to the logs."),
        ("Art 13", "Transparency and instructions for use: characteristics, capabilities and limitations, including declared accuracy, robustness and cybersecurity.",
         "The instructions text; the measurement protocol behind the declared accuracy metrics; a list of limitations and known weaknesses."),
        ("Art 14", "Effective human oversight during use, either built into the system or implemented by the deployer, proportionate to risk and autonomy.",
         "Oversight role and authority; a stop test; an approval test (does a decision pass without a person?); training and competence evidence."),
        ("Art 15", "Accuracy: an appropriate level and its metrics, declared in the instructions for use (Article 15(3)).",
         "Test dataset and its representativeness; metrics (accuracy, recall, error rate) with the calculation method; a repeat run on the same dataset."),
        ("Art 15", "Robustness: resilience to errors, faults and inconsistencies in the system and its environment, including interaction with people; technical redundancy or a fail-safe plan.",
         "Fault-injection tests (malformed or empty input, model failure, network loss); recovery time; fail-safe plan test and result."),
        ("Art 15", "Cybersecurity: resilience against third parties attempting to alter use, outputs or performance by exploiting vulnerabilities.",
         "Authorised penetration-test report with scope; vulnerability list and fix evidence; access-control and secret-handling tests."),
        ("Art 15", "AI-specific vulnerabilities: data poisoning, poisoning of pre-trained components, adversarial examples (model evasion), confidentiality attacks and model flaws.",
         "Prompt-injection and adversarial-input tests; a training-data poisoning scenario; a model-extraction attempt; a result and mitigation for each."),
    ],
}

ROLES_HEADERS = {
    "et": ["Roll", "Testküsimus", "Kui vastus on jah", "Tõend"],
    "en": ["Role", "Test question", "If the answer is yes", "Evidence"],
}
ROLES_WIDTHS = [30, 58, 82, 34]
ROLES_ROWS = {
    "et": [
        ("Pakkuja (art 16, 17)", "Kas lased süsteemi turule või kasutusse oma nime või kaubamärgi all?",
         "Art 16 kohustused: vastavus II jao nõuetele, kvaliteedijuhtimissüsteem (art 17), dokumentatsioon (art 18), logid sinu kontrolli all (art 19), vastavushindamine (art 43), ELi vastavusdeklaratsioon (art 47), CE-märgis (art 48).",
         "Kvaliteedijuhtimissüsteemi käsiraamat, vastavusdeklaratsioon, CE-märgise foto"),
        ("Kasutaja (art 26)", "Kas kasutad süsteemi oma tegevuses, laskmata seda ise turule?",
         "Art 26: kasuta kasutusjuhendi järgi, määra pädev inimjärelevalve, taga sisendandmete asjakohasus, jälgi toimimist ja peata riski korral, teata tõsisest intsidendist, hoia logisid vähemalt kuus kuud, teavita töötajaid ja nende esindajaid.",
         "Kasutusjuhend, ülevaataja määramine, logide hoidmise tõend"),
        ("Importija (art 23)", "Kas viid kolmanda riigi pakkuja süsteemi liidu turule?",
         "Kontrolli enne turule laskmist, et vastavushindamine on tehtud, tehniline dokumentatsioon olemas ning süsteemil on CE-märgis ja ELi vastavusdeklaratsioon.",
         "Kontrolli protokoll"),
        ("Levitaja (art 24)", "Kas teed süsteemi turul kättesaadavaks?",
         "Kontrolli CE-märgist, vastavusdeklaratsiooni koopiat ja kasutusjuhendit ning seda, et pakkuja ja importija on oma kohustused täitnud.",
         "Kontrollnimekiri tarnija kohta"),
        ("Rolli muutus (art 25)", "Kas paned süsteemile oma nime või kaubamärgi või teed sellele olulise muudatuse?",
         "Sind käsitletakse pakkujana ja kehtivad art 16 kohustused.",
         "Muudatuse kirjeldus, versioonihaldus"),
        ("Avaliku sektori kasutaja (art 26(8), 49)", "Kas oled avaliku võimu asutus või kasutad süsteemi nende nimel?",
         "Registreeri end ja süsteem ELi andmebaasis; kui süsteem ei ole registreeritud, ära kasuta seda ja teata pakkujale või levitajale.",
         "Registreeringu väljavõte"),
        ("Põhiõiguste mõju hindamine (art 27)", "Kas oled avalik-õiguslik asutus, avalikku teenust osutav eraõiguslik isik või kasutad III lisa punkti 5(b) või (c) süsteemi?",
         "Tee põhiõiguste mõju hindamine enne esmakordset kasutust: protsessid, kasutuse kestus ja sagedus, mõjutatud isikute rühmad, ohud, inimjärelevalve ja kaebuste kord. III lisa punkt 2 (kriitiline taristu) on välja arvatud.",
         "Hindamise dokument koos kuupäeva ja ülevaatamise korraga"),
    ],
    "en": [
        ("Provider (Art 16, 17)", "Do you place the system on the market or put it into service under your own name or trademark?",
         "Article 16 duties: comply with Section 2 requirements, quality-management system (Article 17), documentation (Article 18), logs under your control (Article 19), conformity assessment (Article 43), EU declaration of conformity (Article 47), CE marking (Article 48).",
         "QMS manual, declaration of conformity, photo of the CE marking"),
        ("Deployer (Art 26)", "Do you use the system in your own operations without placing it on the market?",
         "Article 26: use per the instructions, assign competent human oversight, ensure input data is relevant, monitor operation and suspend use on risk, report serious incidents, keep logs at least six months, inform workers and their representatives.",
         "Instructions for use, oversight appointment, log retention evidence"),
        ("Importer (Art 23)", "Do you bring a third-country provider's system onto the Union market?",
         "Before placing it on the market, verify that the conformity assessment was carried out, the technical documentation exists, and the system carries the CE marking and the EU declaration of conformity.",
         "Verification record"),
        ("Distributor (Art 24)", "Do you make the system available on the market?",
         "Verify the CE marking, a copy of the declaration of conformity and the instructions for use, and that the provider and importer met their duties.",
         "Supplier checklist"),
        ("Change of role (Art 25)", "Do you put your name or trademark on the system, or make a substantial modification?",
         "You are treated as a provider and Article 16 duties apply.",
         "Modification description, version control"),
        ("Public-authority deployer (Art 26(8), 49)", "Are you a public authority or do you use the system on its behalf?",
         "Register yourself and the system in the EU database; if the system is not registered, do not use it and inform the provider or distributor.",
         "Registration extract"),
        ("Fundamental rights impact assessment (Art 27)", "Are you a body governed by public law, a private entity providing public services, or do you deploy an Annex III point 5(b) or (c) system?",
         "Assess the impact on fundamental rights before first use: processes, duration and frequency, affected groups, specific risks, human oversight and the complaint mechanism. Annex III point 2 (critical infrastructure) is excluded.",
         "Assessment document with date and review cycle"),
    ],
}

GUIDE_TEXT = {
    "et": {
        "title": "AI Acti suure riskiga süsteemide tööleht",
        "intro": "Kolm lehte: „Classification“ aitab otsustada, kas süsteem on määruse (EL) 2024/1689 mõttes suure riskiga (art 6, III lisa), „Requirements and evidence“ seob artiklite 9–15 nõuded tõenditega ja „Roles“ aitab määrata rolli. Sõnastus on töine parafraas, mitte õiguslik tekst – kontrolli otsust alati määruse enda järgi.",
        "steps": [
            "Täida leht „Classification“ ühe süsteemi kohta korraga. Kirjuta „Vastus“ veergu jah, ei või ei ole kindel; ilma vastuseta rida on lahtine otsus, mitte „ei“.",
            "Kui vastus on „jah“, testi art 6(3) nelja tingimust. Kui süsteem profileerib füüsilisi isikuid, ei saa erandit kasutada ja süsteem on alati suur risk.",
            "Kirjuta „Põhjendus“ nii, et teine inimene saab sama otsuse teha sinu märkmete põhjal. Art 6(4) nõuab, et pakkuja dokumenteeriks otsuse enne turule laskmist.",
            "Lehel „Requirements and evidence“ kirjuta iga nõude juurde, mida saab tegelikult testida ja millist dokumenti hoiad. Kui tõendit ei ole, on staatus „Pole alustatud“, mitte „Valmis“.",
            "Lehel „Roles“ märgi iga roll, mis sinu kohta kehtib. Üks ettevõte võib olla korraga pakkuja ja kasutaja; rollide kattumine on tavaline.",
        ],
        "legend": [
            ("Vastus / Staatus", "Rippmenüüd, et tabel jääks filtreeritavaks."),
            ("Põhjendus", "Miks otsustasid nii – viita kasutusele, otstarbele ja tõendile."),
            ("Tõendi viide", "Failinimi, pileti number või kausta tee. Ilma asukohata ei ole tõend kontrollitav."),
        ],
        "caveat": "See on töövahend, mitte vastavusdeklaratsioon, sertifikaat ega õigusnõuanne. Täidetud tööleht ei tõenda vastavust: vastavushindamine (art 43) ja tehniline dokumentatsioon (art 11) on eraldi protsessid. Kuupäevad ja nõuded muutuvad – kontrolli määruse kehtivat konsolideeritud versiooni.",
        "source": "Allikas: määrus (EL) 2024/1689, art 6, III lisa, art 8–15, art 16–17, 23–27 ja 49 · tehisabiline.ee/ai-act/korge-riskiga-susteemid/",
        "steps_title": "Kuidas täita",
        "legend_title": "Veergude tähendus",
        "caveat_title": "Mida see fail ei ole",
    },
    "en": {
        "title": "AI Act high-risk worksheet",
        "intro": "Three sheets: \"Classification\" helps decide whether a system is high-risk under Regulation (EU) 2024/1689 (Article 6, Annex III), \"Requirements and evidence\" maps Articles 9–15 to evidence, and \"Roles\" helps fix your role. The wording is a working paraphrase, not the legal text — always check the decision against the regulation itself.",
        "steps": [
            "Fill \"Classification\" for one system at a time. Answer yes, no or not sure; a blank row is an open decision, not a \"no\".",
            "If the answer is yes, test the four Article 6(3) conditions. If the system profiles natural persons, the exception cannot apply and the system is always high-risk.",
            "Write \"Rationale\" so another person could reach the same decision from your notes. Article 6(4) requires the provider to document the assessment before placing the system on the market.",
            "On \"Requirements and evidence\", state what can actually be tested and which document you keep. If there is no evidence, the status is \"Not started\", not \"Done\".",
            "On \"Roles\", mark every role that applies. One company can be provider and deployer at the same time; overlapping roles are normal.",
        ],
        "legend": [
            ("Answer / Status", "Drop-down lists so the table stays sortable."),
            ("Rationale", "Why you decided that way — point to the use, the intended purpose and the evidence."),
            ("Evidence ref", "File name, ticket number or folder path. Without a location the evidence cannot be checked."),
        ],
        "caveat": "This is a working tool, not a declaration of conformity, a certificate or legal advice. A completed worksheet does not prove compliance: conformity assessment (Article 43) and technical documentation (Article 11) remain separate processes. Dates and requirements change — check the current consolidated version of the regulation.",
        "source": "Source: Regulation (EU) 2024/1689, art 6, Annex III, art 8–15, art 16–17, 23–27 and 49 · tehisabiline.ee/en/ai-act/high-risk/",
        "steps_title": "How to fill it in",
        "legend_title": "What the columns mean",
        "caveat_title": "What this file is not",
    },
}

# --- helpers --------------------------------------------------------------------------------


def text_lines(text, width):
    """Estimate wrapped line count so row heights fit the text."""
    per_line = max(8, int(width * 1.05))
    return sum(max(1, (len(part) + per_line - 1) // per_line) for part in str(text).split("\n"))


def header_row(ws, headers, widths, centre=()):
    for col, (name, width) in enumerate(zip(headers, widths), start=1):
        cell = ws.cell(row=1, column=col, value=name)
        cell.font = Font(bold=True, color="FFFFFFFF", size=11)
        cell.fill = PatternFill("solid", fgColor=INK)
        cell.alignment = Alignment(vertical="center", wrap_text=True,
                                   horizontal="center" if col in centre else "left")
        ws.column_dimensions[get_column_letter(col)].width = width
    ws.row_dimensions[1].height = 34


def write_row(ws, row, values, widths, centre=(), band=False):
    for col, (value, width) in enumerate(zip(values, widths), start=1):
        cell = ws.cell(row=row, column=col, value=value)
        cell.alignment = Alignment(vertical="top", wrap_text=True,
                                   horizontal="center" if col in centre else "left")
        cell.border = Border(bottom=LINE)
        if band:
            cell.fill = PatternFill("solid", fgColor=BAND)
        if col == 6 and cell.number_format == "General" and value is None:
            cell.number_format = "DD.MM.YYYY"
    ws.row_dimensions[row].height = max(30, 14.5 * max(text_lines(v, w) for v, w in zip(values, widths)) + 4)


def add_list(ws, options, column, prompt, error):
    dv = DataValidation(type="list", formula1='"' + ",".join(options) + '"', allow_blank=True,
                        showDropDown=False)
    dv.promptTitle = prompt
    dv.prompt = ", ".join(options)
    dv.errorTitle = prompt
    dv.error = error
    ws.add_data_validation(dv)
    dv.add(f"{column}2:{column}{LAST_ROW}")


def add_status_fills(ws, lang, column):
    for index, (bg, fg) in STATUS_FILLS.items():
        value = STATUSES[lang][index]
        ws.conditional_formatting.add(
            f"{column}2:{column}{LAST_ROW}",
            FormulaRule(formula=[f'${column}2="{value}"'],
                        fill=PatternFill("solid", fgColor=bg), font=Font(color=fg)),
        )


def build_sheet_classification(wb, lang):
    ws = wb.create_sheet("Classification")
    ws.sheet_properties.tabColor = INK[2:]
    header_row(ws, CLASSIFICATION_HEADERS[lang], CLASSIFICATION_WIDTHS, centre=(2, 5, 8))
    for row, (area, point, use, question, hint) in enumerate(CLASSIFICATION_ROWS[lang], start=2):
        exception = EXCEPTION_HINT[lang] + (f" {hint}" if hint else "")
        write_row(ws, row, [area, point, use, question, None, exception, None, None],
                  CLASSIFICATION_WIDTHS, centre=(2, 5, 8), band=row % 2 == 1)
    add_list(ws, ANSWERS[lang], "E", "Vastus" if lang == "et" else "Answer",
             "Kasuta ühte lubatud väärtust." if lang == "et" else "Use one of the allowed values.")
    ws.freeze_panes = "C2"
    ws.auto_filter.ref = f"A1:H{len(CLASSIFICATION_ROWS[lang]) + 1}"
    ws.print_title_rows = "1:1"
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    return ws


def build_sheet_requirements(wb, lang):
    ws = wb.create_sheet("Requirements and evidence")
    ws.sheet_properties.tabColor = "FF1B4E7A"
    header_row(ws, REQUIREMENTS_HEADERS[lang], REQUIREMENTS_WIDTHS, centre=(1, 5, 6))
    for row, (article, requirement, evidence) in enumerate(REQUIREMENTS_ROWS[lang], start=2):
        write_row(ws, row, [article, requirement, evidence, None, STATUSES[lang][0], None, None],
                  REQUIREMENTS_WIDTHS, centre=(1, 5, 6), band=row % 2 == 1)
    add_list(ws, STATUSES[lang], "E", "Staatus" if lang == "et" else "Status",
             "Kasuta ühte lubatud väärtust." if lang == "et" else "Use one of the allowed values.")
    add_status_fills(ws, lang, "E")
    ws.freeze_panes = "B2"
    ws.auto_filter.ref = f"A1:G{len(REQUIREMENTS_ROWS[lang]) + 1}"
    ws.print_title_rows = "1:1"
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    return ws


def build_sheet_roles(wb, lang):
    ws = wb.create_sheet("Roles")
    ws.sheet_properties.tabColor = MUTED[2:]
    header_row(ws, ROLES_HEADERS[lang], ROLES_WIDTHS)
    for row, values in enumerate(ROLES_ROWS[lang], start=2):
        write_row(ws, row, list(values), ROLES_WIDTHS, band=row % 2 == 1)
    ws.freeze_panes = "A2"
    ws.print_title_rows = "1:1"
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    return ws


def build_sheet_guide(wb, lang):
    guide = wb.create_sheet("Guide" if lang == "en" else "Juhend")
    guide.sheet_properties.tabColor = "FFD3DDE3"
    guide.column_dimensions["A"].width = 12
    guide.column_dimensions["B"].width = 96
    copy = GUIDE_TEXT[lang]

    def block(row, text, column=1, size=11, bold=False, color="FF000000", italic=False):
        cell = guide.cell(row=row, column=column, value=text)
        cell.font = Font(size=size, bold=bold, color=color, italic=italic)
        cell.alignment = Alignment(vertical="top", wrap_text=True)
        return cell

    block(1, copy["title"], size=16, bold=True, color=INK)
    guide.merge_cells("A1:B1")
    block(2, copy["intro"], color=MUTED)
    guide.merge_cells("A2:B2")
    guide.row_dimensions[2].height = 62

    block(4, copy["steps_title"], size=12, bold=True, color=INK)
    for index, text in enumerate(copy["steps"], start=5):
        block(index, f"{index - 4}.", bold=True)
        guide.cell(row=index, column=2, value=text).alignment = Alignment(vertical="top", wrap_text=True)
        guide.row_dimensions[index].height = 32

    legend_start = 5 + len(copy["steps"]) + 1
    block(legend_start, copy["legend_title"], size=12, bold=True, color=INK)
    for index, (label, text) in enumerate(copy["legend"], start=legend_start + 1):
        cell = guide.cell(row=index, column=1, value=label)
        cell.font = Font(bold=True, size=11)
        cell.alignment = Alignment(vertical="top", wrap_text=True)
        guide.cell(row=index, column=2, value=text).alignment = Alignment(vertical="top", wrap_text=True)
        guide.row_dimensions[index].height = 26

    caveat_row = legend_start + len(copy["legend"]) + 2
    block(caveat_row, copy["caveat_title"], size=12, bold=True, color=INK)
    caveat = block(caveat_row + 1, copy["caveat"])
    guide.merge_cells(f"A{caveat_row + 1}:B{caveat_row + 1}")
    guide.row_dimensions[caveat_row + 1].height = 72
    block(caveat_row + 3, copy["source"], size=9, color=MUTED, italic=True)
    guide.merge_cells(f"A{caveat_row + 3}:B{caveat_row + 3}")
    return guide


def build(lang, filename):
    wb = Workbook()
    wb.remove(wb.active)
    build_sheet_classification(wb, lang)
    build_sheet_requirements(wb, lang)
    build_sheet_roles(wb, lang)
    build_sheet_guide(wb, lang)
    wb.active = 0
    out = DOWNLOADS / filename
    wb.save(out)
    print(f"wrote {out.relative_to(out.parent.parent.parent)} ({out.stat().st_size} bytes)")


def main():
    build("et", "ai-act-korge-risk-too-leht.xlsx")
    build("en", "ai-act-high-risk-worksheet.xlsx")


if __name__ == "__main__":
    main()
