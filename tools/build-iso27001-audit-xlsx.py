#!/usr/bin/env python3
"""Build assets/downloads/iso-27001-siseauditi-toovihik.xlsx (ISO/IEC 27001:2022 internal audit workbook).

Source of truth for the downloadable workbook served by /iso-27001/auditeerimine/.
Sheets: audit programme (p 9.2.2), requirements of clauses 4-10, finding register, corrective
actions (p 10.2), plus a guide sheet. Annex A appears only as its four themes and control
counts: the control titles are copyright ISO/IEC text and are deliberately not reproduced.

Run from the repo root:  python3 tools/build-iso27001-audit-xlsx.py
Requires openpyxl (system python3-openpyxl).
"""

from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

OUT = Path(__file__).resolve().parent.parent / "assets" / "downloads" / "iso-27001-siseauditi-toovihik.xlsx"

INK = "FF1F3B4D"
MUTED = "FF5A6B75"
BAND = "FFF2F6F8"
LINE = Side(style="thin", color="FFD3DDE3")
LAST_ROW = 200  # validation/formatting reach further than the seeded rows

# ---------------------------------------------------------------- p 9.2.2 audit programme
PROGRAMME = [
    ("Auditi tsükkel / periood", "nt 2026 või 2026–2027",
     "P 9.2.2 nõuab programmi, mis määrab sageduse. Kirjuta konkreetne periood, mitte „vastavalt vajadusele“."),
    ("Programmi kinnitaja ja kuupäev", "nimi, roll, kuupäev",
     "Kinnitamata programm on mustand. Audiitor küsib, kes selle heaks kiitis."),
    ("ISMS-i ulatus (viide)", "ulatuse dokumendi nimi ja versioon",
     "Programm peab katma kogu ulatuse, sh väljajäetud osade põhjendused."),
    ("Auditi eesmärk", "nt hinnata vastavust ja toimivust enne sertifitseerimisauditit",
     "Eesmärk määrab küsimused. Sertifitseerimisauditi ettevalmistus ja tavaaudit ei ole sama töö."),
    ("Auditikriteeriumid", "ISO/IEC 27001:2022 p 4–10, oma poliitikad, SoA, kohaldatavad õigusaktid ja lepingud",
     "Iga leid peab viitama kriteeriumile. Kui kriteeriumi pole kirjas, on leid vaieldav."),
    ("Siseaudiitor(id) ja pädevus", "nimi, roll, kuidas pädevus tõendatud",
     "Standard ei nõua sertifikaati, aga nõuab, et audit oleks objektiivne ja pädev."),
    ("Sõltumatuse ja objektiivsuse kontroll", "kes auditeerib mida ja kelle tööd ta ise teinud ei ole",
     "P 9.2.2 nõuab, et audiitorid ei auditeeriks oma tööd. Kirjuta see lahti, ka välise audiitori korral."),
    ("Ajakava: kuupäevad ja valdkonnad", "nt 03.03 juhtimine, 10.03 riskid, 17.03 tehnilised meetmed",
     "Ajakava peab katma kogu ulatuse tsükli jooksul. Vaata katvus üle SoA vastu, mitte mälu järgi."),
    ("Aruandlus: kellele ja millal", "roll ja tähtaeg",
     "Tulemused tuleb viia asjaomase juhtkonnani (p 9.2.2) ja need on p 9.3 sisend."),
    ("Tõendite hoiukoht", "kausta tee, pileti süsteem või link",
     "Ilma asukohata ei ole tõend auditiks kasutatav, ka siis, kui see on olemas."),
    ("Juhtkonna ülevaatuse kuupäev (p 9.3)", "kuupäev",
     "Siseauditi tulemused peavad jõudma ülevaatusele enne, kui sertifitseerimisasutus neid küsib."),
    ("Eelmise tsükli lahtised leiud", "leiu ID-d ja staatus",
     "Korduv lahendamata leid on juhtimise probleem, mitte tehniline."),
]

# ---------------------------------------------------------------- clauses 4-10
# Wording is our own summary of the requirement; the standard text is not reproduced.
REQUIREMENTS = [
    ("4.1", "Organisatsiooni ja selle konteksti mõistmine",
     "Kirjelda väliseid ja sisemisi tegureid, mis mõjutavad ISMS-i eesmärke, ja hoia see ajakohane.",
     "Konteksti analüüs koos kuupäevaga; tõend, et seda on riskianalüüsis kasutatud."),
    ("4.2", "Huvitatud poolte vajaduste ja ootuste mõistmine",
     "Nimeta huvitatud pooled ja nende nõuded, sh õiguslikud ja lepingulised, ning märgi, millised neist ISMS katab.",
     "Huvitatud poolte register nõuete ja katvuse märkega; viited lepingutele ja õigusaktidele."),
    ("4.3", "Infoturbe juhtimissüsteemi ulatuse määramine",
     "Määra ISMS-i piirid ja kohaldatavus ning dokumenteeri ulatus.",
     "Ulatuse dokument: teenused, asukohad, süsteemid, väljajätmised ja põhjendus; võrdlus SoA-ga."),
    ("4.4", "Infoturbe juhtimissüsteem",
     "Loo, käita, hoia ja paranda ISMS-i koos vajalike protsesside ja nende seostega.",
     "Protsesside loetelu omanikega; tõend, et protsessid toimivad, mitte ainult ei ole kirjeldatud."),
    ("5.1", "Juhtimine ja pühendumus",
     "Tippjuhtkond peab pühendumust näitama: poliitika ja eesmärgid, ressursid, integreerimine, suunamine.",
     "Juhatuse protokollid, ressursside eraldamine, osalemine ülevaatustes; intervjuu tippjuhiga."),
    ("5.2", "Poliitika",
     "Infoturbepoliitika peab olema kehtestatud, asjakohane ja kõigile kättesaadav.",
     "Kinnitatud poliitika versioon, avaldamise kanal, kinnitamise kuupäev."),
    ("5.3", "Organisatsioonilised rollid, vastutused ja volitused",
     "Rollid ja vastutused infoturbe eest peavad olema määratud ja teada.",
     "Rollimaatriks, ametijuhendid, tõend teavitamisest."),
    ("6.1.1", "Riskide ja võimaluste käsitlemine: üldist",
     "Planeeri, kuidas riske ja võimalusi käsitleda, et ISMS saavutaks kavandatud tulemused.",
     "Riskijuhtimise kord ja selle seos infoturbe eesmärkidega."),
    ("6.1.2", "Infoturbe riskianalüüs",
     "Tee riskianalüüs korduskasutatavate kriteeriumide järgi: tuvasta risk, määra omanik, hinda ja jääkrisk.",
     "Riskiregister metoodika, hinnangute, omanike ja viimase ülevaatuse kuupäevaga."),
    ("6.1.3", "Infoturbe riskide käsitlemine",
     "Vali meetmed riskide põhjal, võrdle lisa A-ga ja dokumenteeri valikud ning põhjendused SoA-s.",
     "Riskikäsitlusplaan ja SoA: kohaldatavad meetmed, väljajätmised ja nende põhjendus."),
    ("6.2", "Infoturbe eesmärgid ja nende saavutamise planeerimine",
     "Sea mõõdetavad infoturbe eesmärgid ja kirjelda, mida, kellega, millal ja kuidas saavutatakse.",
     "Eesmärgid mõõdikute, vastutajate ja tähtaegadega; edenemise ülevaatus."),
    ("7.1", "Ressursid",
     "ISMS-ile vajalikud ressursid peavad olema määratud ja olemas.",
     "Eelarve, inimeste arvestus, töövahendid; võrdlus tegeliku töökoormusega."),
    ("7.2", "Pädevus",
     "Määra rollide pädevusnõuded, taga koolitus või värbamine ja säilita tõendid.",
     "Pädevusnõuded rollide kaupa, koolituste tõendid, pädevuse hindamise tulemused."),
    ("7.3", "Teadlikkus",
     "Töötajad teavad poliitikat, oma vastutust ja seda, kuidas intsidendist teatada.",
     "Koolitus- ja teavitustegevused, lühikesed intervjuud valimile."),
    ("7.4", "Kommunikatsioon",
     "Määra, millest, millal, kellega ja kuidas infoturbest räägitakse, sh intsidenditeavitused.",
     "Kommunikatsiooniplaan, kontaktide loetelu, teavituste logi."),
    ("7.5.1", "Dokumenteeritud teave: üldist",
     "ISMS-i dokumenteeritud teave katab standardi nõutud dokumendid ja selle, mida organisatsioon ise vajalikuks peab.",
     "Dokumendiregister: mis on olemas, kes haldab, kus asub."),
    ("7.5.2", "Dokumenteeritud teave: loomine ja uuendamine",
     "Dokumentidel peab olema identifitseerimine, versioon, kinnitaja ja kuupäev.",
     "Kolm dokumenti: versioon, kinnitaja, muudatuste ajalugu."),
    ("7.5.3", "Dokumenteeritud teave: haldamine",
     "Teave peab olema kättesaadav ja kaitstud; juurdepääsu ja muudatusi tuleb kontrollida.",
     "Õigused dokumendihoidlas, muudatuste logi, varukoopia olemasolu."),
    ("8.1", "Toimimise planeerimine ja juhtimine",
     "Protsessid viiakse ellu plaanipäraselt, et nõuded oleksid täidetud.",
     "Protseduurid ja nende täitmise tõendid valimis (mitte ainult protseduur ise)."),
    ("8.2", "Infoturbe riskianalüüs (toimimine)",
     "Tee riskianalüüs plaanitud aegadel ja oluliste muudatuste korral ning säilita tulemused.",
     "Analüüside kuupäevad, muudatustest tulenenud analüüsid, tulemused."),
    ("8.3", "Infoturbe riskide käsitlemine (toimimine)",
     "Viia riskikäsitlusplaan ellu ja hoida seda ajakohasena.",
     "Plaani täitmise jälgimine, lõpetatud meetmed, üle jäänud riskid."),
    ("9.1", "Seire, mõõtmine, analüüs ja hindamine",
     "Otsusta, mida ja kuidas mõõta ning millal; analüüsi tulemusi ja hinda infoturbe toimivust.",
     "Mõõdikute loetelu, mõõtmiste tulemused ja nende analüüs."),
    ("9.2.1", "Siseaudit: üldist",
     "Siseauditid toimuvad plaanitud aegadel; hinnatakse vastavust oma nõuetele ja standardile ning seda, kas ISMS on tõhusalt rakendatud ja hoitud.",
     "Auditiplaan, aruanded, leiud ja nende käsitlemine; intervjuu audiitoriga."),
    ("9.2.2", "Siseaudit: auditi programm",
     "Programm määrab sageduse, meetodid, vastutused, planeerimise ja aruandluse; iga auditi kohta kriteeriumid ja ulatus; audiitorid valitakse nii, et audit oleks objektiivne ja erapooletu; tulemused viiakse asjaomase juhtkonnani; tõendid säilitatakse.",
     "Programm, iga auditi kriteeriumid ja ulatus, audiitorite sõltumatuse kontroll, aruande kättetoimetamine, arhiiv."),
    ("9.3.1", "Juhtkonna ülevaatus: üldist",
     "Tippjuhtkond vaatab ISMS-i plaanitud aegadel üle, et hinnata selle jätkuvat sobivust, piisavust ja tõhusust.",
     "Ülevaatuse protokoll kuupäeva ja osalejatega."),
    ("9.3.2", "Juhtkonna ülevaatus: sisendid",
     "Ülevaatus arvestab muu hulgas varasemate otsuste seisu, muutusi, mõõtmistulemusi, auditi tulemusi, mittevastavusi ja riske.",
     "Sisendmaterjalid: mõõdikud, auditi kokkuvõte, riskiregistri muudatused, intsidendid."),
    ("9.3.3", "Juhtkonna ülevaatus: tulemused",
     "Ülevaatuse otsused käsitlevad parendusi ja ISMS-i muudatusi ning need viiakse ellu.",
     "Otsuste loetelu vastutajate ja tähtaegadega; täitmise jälgimine."),
    ("10.1", "Pidev parendamine",
     "ISMS-i sobivust, piisavust ja tõhusust parandatakse pidevalt.",
     "Parenduste register ja tõendid elluviimisest."),
    ("10.2", "Mittevastavus ja parandusmeede",
     "Mittevastavus käsitletakse: piiratakse mõju, leitakse juurpõhjus, tehakse parandusmeede, kontrollitakse selle tõhusust ja uuendatakse riske.",
     "Mittevastavuste register, juurpõhjuse analüüs, tõhususe kontrolli tõend."),
]
REQUIREMENT_HEADERS = [
    ("Punkt", 9),
    ("Pealkiri", 40),
    ("Nõue lühidalt (meie sõnadega)", 56),
    ("Tõend, mida küsida", 48),
    ("Tulemus", 18),
    ("Leiu ID", 10),
]
RESULTS = ["Vastab", "Osaliselt vastab", "Ei vasta", "Ei ole auditeeritud", "Ei kohaldu"]

# ---------------------------------------------------------------- findings
FINDING_HEADERS = [
    ("Leiu ID", 9),
    ("Punkt", 10),
    ("Tõend, mida nägin", 44),
    ("Liik", 20),
    ("Tõsidus", 12),
    ("Omanik", 14),
    ("Tähtaeg", 12),
    ("Staatus", 16),
    ("Märkused", 28),
]
FINDING_KINDS = ["Mittevastavus", "Vaatlus", "Parendusvõimalus"]
FINDING_SEVERITY = ["Suur", "Väike", "Pole veel hinnatud"]
FINDING_STATUS = ["Avatud", "Töös", "Kontrollimisel", "Suletud"]
FINDING_SEED = [
    ("L-01", "8.13", "Näide: viimane taastetest ebaõnnestus osaliselt ega tõenda kokkulepitud taastumisaega.",
     "Mittevastavus", "Suur", None, None, "Avatud", "Asenda näide päris leiuga"),
    ("L-02", "5.18", "Näide: kaks lahkunud töötaja kontot olid aktiivsed üle kuu.",
     "Mittevastavus", "Väike", None, None, "Töös", "Asenda näide päris leiuga"),
    ("L-03", "9.2.2", "Näide: programm ei kata lisa A tehnoloogilisi meetmeid.",
     "Vaatlus", "Väike", None, None, "Avatud", "Asenda näide päris leiuga"),
]

# ---------------------------------------------------------------- corrective actions
ACTION_HEADERS = [
    ("Leiu ID", 9),
    ("Juurpõhjus", 40),
    ("Kohene parandus", 32),
    ("Parandusmeede", 38),
    ("Vastutaja", 14),
    ("Tähtaeg", 12),
    ("Tõhususe kontroll: kuidas ja millal", 40),
    ("Kontrolli tulemus", 20),
    ("Staatus", 16),
]
ACTION_STATUS = ["Pole alustatud", "Töös", "Kontrollimisel", "Tõhusaks tunnistatud", "Edasi lükatud"]

ANNEX_A_THEMES = [
    ("5", "Organisatsioonilised meetmed", 37),
    ("6", "Inimestega seotud meetmed", 8),
    ("7", "Füüsilised meetmed", 14),
    ("8", "Tehnoloogilised meetmed", 34),
]


def _text_lines(text, width):
    """Estimate wrapped line count so row heights fit the text."""
    if not text:
        return 1
    per_line = max(1, int(width * 1.1))
    return sum(max(1, (len(part) + per_line - 1) // per_line) for part in str(text).split("\n"))


def _header_row(ws, headers, height=34):
    for col, (name, width) in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col, value=name)
        cell.font = Font(bold=True, color="FFFFFFFF", size=11)
        cell.fill = PatternFill("solid", fgColor=INK)
        cell.alignment = Alignment(vertical="center", wrap_text=True)
        ws.column_dimensions[get_column_letter(col)].width = width
    ws.row_dimensions[1].height = height


def _list_validation(ws, values, col_letter, prompt=""):
    dv = DataValidation(type="list", formula1='"' + ",".join(values) + '"',
                        allow_blank=True, showDropDown=False)
    dv.errorTitle = "Vali loendist"
    dv.error = "Kasuta ühte lubatud väärtust: " + ", ".join(values)
    dv.promptTitle = "Lubatud väärtused"
    dv.prompt = prompt or ", ".join(values)
    ws.add_data_validation(dv)
    dv.add(f"{col_letter}2:{col_letter}{LAST_ROW}")


def _paint(ws, col_letter, mapping):
    for value, (bg, fg) in mapping.items():
        ws.conditional_formatting.add(
            f"{col_letter}2:{col_letter}{LAST_ROW}",
            FormulaRule(formula=[f'${col_letter}2="{value}"'],
                        fill=PatternFill("solid", fgColor=bg), font=Font(color=fg)),
        )


def _fit(ws, values, widths, row, minimum=30):
    lines = max(_text_lines(v, w) for v, w in zip(values, widths))
    ws.row_dimensions[row].height = max(minimum, 15 * lines + 4)


def build() -> None:
    wb = Workbook()

    # 1. Audit programme -----------------------------------------------------
    ws = wb.active
    ws.title = "Auditi programm"
    ws.sheet_properties.tabColor = INK[2:]
    programme_headers = [("Väli", 34), ("Sisestus", 52), ("Mida audit küsib", 56)]
    _header_row(ws, programme_headers)
    for r, (field, placeholder, why) in enumerate(PROGRAMME, start=2):
        for c, value in enumerate((field, placeholder, why), start=1):
            cell = ws.cell(row=r, column=c, value=value)
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.border = Border(bottom=LINE)
            if c == 1:
                cell.font = Font(bold=True)
            if c == 2:
                cell.font = Font(color=MUTED, italic=True)
            if r % 2 == 1:
                cell.fill = PatternFill("solid", fgColor=BAND)
        _fit(ws, (field, placeholder, why), (34, 52, 56), r, minimum=28)

    # 2. Requirements 4-10 ---------------------------------------------------
    req = wb.create_sheet("Nouded 4-10")
    req.sheet_properties.tabColor = "FF2E5C8A"
    _header_row(req, REQUIREMENT_HEADERS)
    for r, (clause, title, requirement, evidence) in enumerate(REQUIREMENTS, start=2):
        values = (clause, title, requirement, evidence, "Ei ole auditeeritud", None)
        for c, value in enumerate(values, start=1):
            cell = req.cell(row=r, column=c, value=value)
            cell.alignment = Alignment(vertical="top", wrap_text=True,
                                       horizontal="center" if c in (1, 5, 6) else "left")
            cell.border = Border(bottom=LINE)
            if c == 1:
                cell.font = Font(bold=True)
            if r % 2 == 1:
                cell.fill = PatternFill("solid", fgColor=BAND)
        _fit(req, values, [w for _, w in REQUIREMENT_HEADERS], r, minimum=30)
    _list_validation(req, RESULTS, "E")
    _paint(req, "E", {
        "Vastab": ("FFE3F5E9", "FF1E6B3A"),
        "Osaliselt vastab": ("FFFFF2D0", "FF7A5300"),
        "Ei vasta": ("FFFCE4E4", "FF9B1C1C"),
        "Ei ole auditeeritud": ("FFEDF1F4", "FF5A6B75"),
        "Ei kohaldu": ("FFEDF1F4", "FF5A6B75"),
    })
    req.freeze_panes = "B2"
    req.auto_filter.ref = f"A1:F{len(REQUIREMENTS) + 1}"
    req.print_title_rows = "1:1"
    req.page_setup.orientation = "landscape"
    req.sheet_properties.pageSetUpPr.fitToPage = True
    req.page_setup.fitToWidth = 1

    # 3. Findings ------------------------------------------------------------
    find = wb.create_sheet("Leiud")
    find.sheet_properties.tabColor = "FF8A4B2E"
    _header_row(find, FINDING_HEADERS, height=44)
    for r, row in enumerate(FINDING_SEED, start=2):
        for c, value in enumerate(row, start=1):
            cell = find.cell(row=r, column=c, value=value)
            cell.alignment = Alignment(vertical="top", wrap_text=True,
                                       horizontal="center" if c in (1, 2, 4, 5, 7, 8) else "left")
            cell.border = Border(bottom=LINE)
            if c == 7:
                cell.number_format = "DD.MM.YYYY"
            if r % 2 == 1:
                cell.fill = PatternFill("solid", fgColor=BAND)
        _fit(find, row, [w for _, w in FINDING_HEADERS], r, minimum=30)
    _list_validation(find, FINDING_KINDS, "D")
    _list_validation(find, FINDING_SEVERITY, "E")
    _list_validation(find, FINDING_STATUS, "H")
    _paint(find, "E", {
        "Suur": ("FFFCE4E4", "FF9B1C1C"),
        "Väike": ("FFFFF2D0", "FF7A5300"),
        "Pole veel hinnatud": ("FFEDF1F4", "FF5A6B75"),
    })
    _paint(find, "H", {
        "Avatud": ("FFFCE4E4", "FF9B1C1C"),
        "Töös": ("FFE4EDF7", "FF1B4E7A"),
        "Kontrollimisel": ("FFFFF2D0", "FF7A5300"),
        "Suletud": ("FFE3F5E9", "FF1E6B3A"),
    })
    find.conditional_formatting.add(
        f"G2:G{LAST_ROW}",
        FormulaRule(formula=['AND($G2<>"",$H2<>"Suletud",ISNUMBER($G2),$G2<TODAY())'],
                    fill=PatternFill("solid", fgColor="FFFCE4E4"),
                    font=Font(color="FF9B1C1C", bold=True)),
    )
    find.freeze_panes = "A2"
    find.auto_filter.ref = f"A1:I{len(FINDING_SEED) + 1}"
    find.print_title_rows = "1:1"
    find.page_setup.orientation = "landscape"
    find.sheet_properties.pageSetUpPr.fitToPage = True
    find.page_setup.fitToWidth = 1

    # 4. Corrective actions --------------------------------------------------
    act = wb.create_sheet("Parandusmeetmed")
    act.sheet_properties.tabColor = "FF1E6B3A"
    _header_row(act, ACTION_HEADERS, height=44)
    for r, row in enumerate(FINDING_SEED, start=2):
        values = (row[0], None, None, None, row[5], None, None, None, "Pole alustatud")
        for c, value in enumerate(values, start=1):
            cell = act.cell(row=r, column=c, value=value)
            cell.alignment = Alignment(vertical="top", wrap_text=True,
                                       horizontal="center" if c in (1, 6, 9) else "left")
            cell.border = Border(bottom=LINE)
            if c == 6:
                cell.number_format = "DD.MM.YYYY"
            if r % 2 == 1:
                cell.fill = PatternFill("solid", fgColor=BAND)
        _fit(act, values, [w for _, w in ACTION_HEADERS], r, minimum=30)
    _list_validation(act, ACTION_STATUS, "I")
    _paint(act, "I", {
        "Pole alustatud": ("FFEDF1F4", "FF5A6B75"),
        "Töös": ("FFE4EDF7", "FF1B4E7A"),
        "Kontrollimisel": ("FFFFF2D0", "FF7A5300"),
        "Tõhusaks tunnistatud": ("FFE3F5E9", "FF1E6B3A"),
        "Edasi lükatud": ("FFFFF2D0", "FF7A5300"),
    })
    act.conditional_formatting.add(
        f"F2:F{LAST_ROW}",
        FormulaRule(formula=['AND($F2<>"",$I2<>"Tõhusaks tunnistatud",ISNUMBER($F2),$F2<TODAY())'],
                    fill=PatternFill("solid", fgColor="FFFCE4E4"),
                    font=Font(color="FF9B1C1C", bold=True)),
    )
    act.freeze_panes = "A2"
    act.auto_filter.ref = f"A1:I{len(FINDING_SEED) + 1}"
    act.print_title_rows = "1:1"
    act.page_setup.orientation = "landscape"
    act.sheet_properties.pageSetUpPr.fitToPage = True
    act.page_setup.fitToWidth = 1

    # 5. Guide ---------------------------------------------------------------
    guide = wb.create_sheet("Juhend")
    guide.sheet_properties.tabColor = MUTED[2:]
    guide.column_dimensions["A"].width = 34
    guide.column_dimensions["B"].width = 72
    guide.column_dimensions["C"].width = 14

    def block(row, text, size=11, bold=False, color="FF000000", italic=False):
        cell = guide.cell(row=row, column=1, value=text)
        cell.font = Font(size=size, bold=bold, color=color, italic=italic)
        cell.alignment = Alignment(vertical="top", wrap_text=True)
        return cell

    block(1, "ISO 27001 siseauditi töövihik", size=16, bold=True, color=INK)
    block(2, "Töövahend ISO/IEC 27001:2022 siseauditi läbiviimiseks punkti 9.2 järgi: programm, nõuded 4–10, leidude register ja parandusmeetmed punkti 10.2 järgi.", color=MUTED)
    guide.merge_cells("A2:C2")
    guide.row_dimensions[2].height = 32

    block(4, "Kuidas täita", size=12, bold=True, color=INK)
    steps = [
        "Täida leht „Auditi programm“ enne auditit: periood, ulatus, kriteeriumid, audiitorid ja sõltumatuse kontroll. Ilma kriteeriumideta ei ole leid hiljem kaitstav.",
        "Kontrolli sõltumatust kirjalikult: iga audiitori kohta märgi, millist protsessi ta ise haldab. Kui audiitor auditeerib oma tööd, ei ole punkt 9.2.2 täidetud.",
        "Lehel „Nouded 4-10“ käi punkt punkti haaval läbi. Tulemus pannakse alles siis, kui tõend on nähtud — mitte siis, kui vastus kõlab hästi.",
        "Iga puuduse kohta loo lehel „Leiud“ rida: punkt, nähtud tõend, liik ja tõsidus, omanik, tähtaeg.",
        "Lehel „Parandusmeetmed“ kirjuta juurpõhjus ja tõhususe kontroll. Parandus, mida ei ole uuesti testitud, ei ole tõendatud parandus.",
        "Enne sertifitseerimisauditit anna tulemused juhtkonna ülevaatusele (punkt 9.3) ja hoia tõendid ühes kohas.",
    ]
    for i, text in enumerate(steps, start=5):
        block(i, f"{i - 4}.", bold=True)
        cell = guide.cell(row=i, column=2, value=text)
        cell.alignment = Alignment(vertical="top", wrap_text=True)
        guide.row_dimensions[i].height = 30

    block(12, "Lisa A neli teemat (ilma meetmete loeteluta)", size=12, bold=True, color=INK)
    for col, (name, width) in enumerate((("Teema", 34), ("Nimetus", 40), ("Meetmeid", 12)), start=1):
        cell = guide.cell(row=13, column=col, value=name)
        cell.font = Font(bold=True, color="FFFFFFFF", size=11)
        cell.fill = PatternFill("solid", fgColor=INK)
        cell.alignment = Alignment(vertical="center")
        guide.column_dimensions[get_column_letter(col)].width = max(width, guide.column_dimensions[get_column_letter(col)].width or 0)
    for r, (theme, label, count) in enumerate(ANNEX_A_THEMES, start=14):
        for c, value in enumerate((theme, label, count), start=1):
            cell = guide.cell(row=r, column=c, value=value)
            cell.alignment = Alignment(vertical="top", horizontal="center" if c == 3 else "left", wrap_text=True)
        if r % 2 == 1:
            guide.cell(row=r, column=1).fill = PatternFill("solid", fgColor=BAND)
    total = guide.cell(row=18, column=1, value="Kokku")
    total.font = Font(bold=True)
    guide.cell(row=18, column=2, value="Meetmed kokku").font = Font(bold=True)
    sumcell = guide.cell(row=18, column=3, value=sum(count for _, _, count in ANNEX_A_THEMES))
    sumcell.font = Font(bold=True)
    guide.cell(row=18, column=3).alignment = Alignment(horizontal="center")
    note = guide.cell(row=19, column=1, value=(
        "Teemade kaupa on siin ainult arvud. Meetmete pealkirjad ja sisu on ISO/IEC autoriõigusega kaitstud tekst, "
        "mida siin ei korrata: ava need standardi ametlikust tekstist (EVS) või oma SoA-st."
    ))
    note.alignment = Alignment(vertical="top", wrap_text=True)
    note.font = Font(size=10, color=MUTED, italic=True)
    guide.merge_cells("A19:C19")
    guide.row_dimensions[19].height = 40

    block(21, "Veergude tähendus", size=12, bold=True, color=INK)
    legend = [
        ("Punkt", "Standardi punkt (4.1–10.2). Leid peab viitama punktile või mõnele oma kriteeriumile."),
        ("Tulemus", "Vastab / Osaliselt vastab / Ei vasta / Ei ole auditeeritud / Ei kohaldu."),
        ("Liik", "Mittevastavus (nõue täitmata), vaatlus (nõuet ei rikuta, aga lahendus on habras), parendusvõimalus."),
        ("Tõsidus", "Suur või väike on sinu enda skaala. Sertifitseerimisauditil on tähendus ISO/IEC 17021-1 mõistetel."),
        ("Juurpõhjus", "Miks nõue täitmata jäi. Ilma juurpõhjuseta kordub leid järgmisel tsüklil."),
        ("Tõhususe kontroll", "Kuidas ja millal tõendad, et parandus töötab — mitte ainult see, et dokument on uuendatud."),
    ]
    for i, (a, b) in enumerate(legend, start=22):
        cell = guide.cell(row=i, column=1, value=a)
        cell.font = Font(bold=True, size=11)
        cell.alignment = Alignment(vertical="top", wrap_text=True)
        cell2 = guide.cell(row=i, column=2, value=b)
        cell2.alignment = Alignment(vertical="top", wrap_text=True)
        guide.row_dimensions[i].height = 28

    block(29, "Mida see fail ei ole", size=12, bold=True, color=INK)
    caveat = guide.cell(row=30, column=1, value=(
        "See on töövahend, mitte auditiraport, sertifikaat ega vastavusdeklaratsioon. Täidetud tabel ilma tõendite "
        "asukohtade ja kuupäevadeta ei ole auditiks piisav. Siseaudit ei asenda sertifitseerimisauditit: sertifikaadi "
        "otsustab akrediteeritud sertifitseerimisasutus. Tehisabiline ei ole sertifitseerimisasutus."
    ))
    caveat.alignment = Alignment(vertical="top", wrap_text=True)
    guide.merge_cells("A30:C30")
    guide.row_dimensions[30].height = 56

    block(32, "Allikas: ISO/IEC 27001:2022 (p 4–10, lisa A) · ISO/IEC 17021-1:2015 (sertifitseerimistsükkel) · tehisabiline.ee/iso-27001/auditeerimine/", size=9, color=MUTED, italic=True)

    wb.properties.title = "ISO 27001 siseauditi töövihik"
    wb.properties.subject = "ISO/IEC 27001:2022 punkti 9.2 siseauditi töövahend"
    wb.properties.creator = "tehisabiline.ee"
    wb.properties.keywords = "ISO 27001, siseaudit, 9.2, auditi programm, parandusmeede"
    wb.properties.description = "Töövihik ISO/IEC 27001:2022 siseauditi läbiviimiseks. Allikas: https://tehisabiline.ee/iso-27001/auditeerimine/"

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"wrote {OUT.relative_to(OUT.parent.parent.parent)} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    build()
