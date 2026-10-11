---
name: Tehisabiline
description: Selge ja usaldusväärne küber-AI ning küberauditi veeb Eesti eri sihtrühmadele.
colors:
  primary: "#0857f8"
  primary-hover: "#0645d6"
  primary-pressed: "#0a2f8f"
  ink: "#090c24"
  text: "#2c3552"
  muted: "#56617f"
  paper: "#ffffff"
  mist: "#f5f8ff"
  mist-2: "#e9f0fe"
  line: "#e1e8f4"
  line-strong: "#c7d3e8"
  blue-wash: "#eef4ff"
  blue-soft: "#dce7ff"
  red: "#c21f31"
  red-bg: "#fdebed"
  amber: "#934700"
  amber-bg: "#fff1d6"
  green: "#0b6a49"
  green-bg: "#e3f5ec"
typography:
  display:
    fontFamily: '"Host Grotesk", "Host Fallback", system-ui, sans-serif'
    fontSize: "clamp(2.4rem, 1.3rem + 3.2vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Host Grotesk", "Host Fallback", system-ui, sans-serif'
    fontSize: "clamp(2rem, 1.3rem + 2.1vw, 3.25rem)"
    fontWeight: 750
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  title:
    fontFamily: '"Host Grotesk", "Host Fallback", system-ui, sans-serif'
    fontSize: "clamp(1.3rem, 1.15rem + .6vw, 1.7rem)"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: '"Hanken Grotesk", "Hanken Fallback", system-ui, sans-serif'
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: '"Hanken Grotesk", "Hanken Fallback", system-ui, sans-serif'
    fontSize: ".8125rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "22px"
spacing:
  sm: ".5rem"
  md: "1rem"
  lg: "1.5rem"
  section: "clamp(4.5rem, 3rem + 6vw, 8.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "10px"
    padding: ".8rem 1.5rem"
    height: "52px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    rounded: "10px"
    padding: ".8rem 1.5rem"
    height: "52px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    rounded: "16px"
    padding: "1.5rem"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "10px"
    padding: ".55rem .9rem"
  chip-priority:
    backgroundColor: "{colors.blue-soft}"
    textColor: "{colors.primary-pressed}"
    typography: "{typography.label}"
    rounded: "999px"
    padding: ".22rem .7rem"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    rounded: "10px"
    padding: ".75rem .9rem"
    height: "48px"
---
Sisu joondub kesksele, kuni 1296px laiusele raamile; külgvahe muutub `clamp(1.25rem, 4vw, 2.5rem)` järgi. Tavasektsioonide vertikaalvahe skaleerub 4.5rem-ist 8.5rem-ini. Kaheveeruline sisu algab 900px juures, päise desktop-olek 980px juures ja kolmeveerulised võrgud 1000px juures. Päis on kergelt läbikumav valge; desktopis muutub see läbipaistvaks lehe ülaservas. Väiksematel laiustel virnastuvad veerud; väiksel ekraanil säilivad tekstile valge pind ja selge rütm. Avalehe dekoratiivne ribbon jääb mobiilis demoakna taha, mitte päise ega pealkirja alla; alamlehtede päiseribbon peidetakse kuni 899px-ni.
# Design System: Tehisabiline

## Overview

**Creative North Star: "Selge sinine töölaud"**

Tehisabiline ühendab tuttava tänapäevase AI-teenuse veebilehe selge, rahuliku lugemiskeskkonnaga. Valge pind ja tume tekst hoiavad pika eestikeelse sisu loetavana; erk sinine märgib tegevusi ja olulisemaid seoseid. Host Grotesk annab pealkirjadele iseloomu, Hanken Grotesk hoiab põhiteksti avatud ja loetavana.

Ühine raamistik teenindab ettevõtteid, arendajaid, huvilisi ja rahastajaid: lihtne selgitus ees, tehniline tõendus järgmise sammuna. T-logo ja sinine on püsivad identiteedivalikud. **Key Characteristics:**
- Valge lugemispind ja selge sinine aktsent
- Suured tihedad pealkirjad, rahulik põhitekst
- Peened piirjooned ja mõõdukas pinnakõrgendus
- Liikumine on piiratud, kasutaja eelistust arvestav

## Colors

Palette on valdavalt valge ja sinakashall neutraalne; brändisinine on tegevuste ja fookuse jaoks, mitte kogu lehe taustaks.

### Primary
- **Erk brändisinine** (`{colors.primary}`): peamised nupud, lingid, ikoonid ja aktiivsed olekud.
- **Sügav sinine** (`{colors.primary-hover}`): hover-olek.
- **Sinine tint** (`{colors.primary-pressed}`): vajutatud olek ning tekst heledal sinisel pinnal.

### Neutral
- **Puhas valge** (`{colors.paper}`): lehe ja kaartide põhitaust.
- **Hele udu** (`{colors.mist}`): vahelduvad sektsioonid ja jalus.
- **Tintpind** (`{colors.mist-2}`, `{colors.blue-wash}`): õrnad sinised pinnad ja rõhutatud vastused.
- **Tume tint** (`{colors.ink}`): pealkirjad; **sügav tekst** (`{colors.text}`): põhitekst; **summutatud** (`{colors.muted}`): abitekst.
- **Piirjooned** (`{colors.line}`, `{colors.line-strong}`): eraldajad ja väljade servad.

### Named Rules
**The Blue-For-Action Rule.** Hoia tugev brändisinine tegevustel ja tähenduslikel esiletõstmistel; suurte lugemispindade taust jääb heledaks.

## Typography

**Display Font:** Host Grotesk (metric-matched fallback, system-ui, sans-serif)  
**Body Font:** Hanken Grotesk (metric-matched fallback, system-ui, sans-serif)  
**Label/Mono Font:** JetBrains Mono ainult koodile.

**Character:** Geomeetriline, tihke pealkiri annab selge hierarhia; Hanken Grotesk loeb pikemas tekstis loomulikult. Pealkirjad kasutavad tasakaalustatud reamurdmist ning mõõdukat negatiivset tähevahet.

### Hierarchy
- **Display** (800, `clamp(2.4rem, 1.3rem + 3.2vw, 4.25rem)`, 1.02): lehe peamine pealkiri.
- **Headline** (750, `clamp(2rem, 1.3rem + 2.1vw, 3.25rem)`, 1.04): sektsioonide pealkirjad.
- **Title** (700, `clamp(1.3rem, 1.15rem + .6vw, 1.7rem)`, 1.15): alapealkirjad ja komponendipealkirjad.
- **Body** (400, 1.0625rem, 1.6): põhitekst; artikli veerg on piiratud 44rem-iga.
- **Label** (600, .8125rem, 1.4): väikesed staatuse- ja metaelemendid.

### Named Rules
**The Two-Font Rule.** Kasuta Host Groteski pealkirjades ja Hanken Groteski tekstis; JetBrains Mono jääb koodinäidetele.

## Layout

Sisu joondub kesksele, kuni 1296px laiusele raamile; külgvahe muutub `clamp(1.25rem, 4vw, 2.5rem)` järgi. Tavasektsioonide vertikaalvahe skaleerub 4.5rem-ist 8.5rem-ini. Kaheveeruline sisu algab 900px juures, põhimenüü 980px juures, kolmeveerulised võrgud 1000px juures. Väiksematel laiustel virnastuvad veerud; väikesel ekraanil säilivad tekstile valge pind ja selge rütm. Avalehe dekoratiivne ribbon jääb mobiilis demoakna taha, mitte päise ega pealkirja alla; alamlehtede päiseribbon peidetään kuni 899px-ni.

## Elevation & Depth

Sügavus on hübriidne: peen piirjoon ja väga hele sinakas pind hoiavad enamiku kaarte tasasena; demo, esmane tegevus ja esile toodud komponendid saavad pehme sinise varju. Tume koodipind on sisuline koodiesitlus, mitte lehe üldine tumerežiim.

### Shadow Vocabulary
- **Sheet** (`0 1px 2px rgba(9, 12, 36, .05), 0 26px 52px -24px rgba(8, 52, 170, .26)`): suuremad hõljuvad pinnad.
- **Pop** (`0 1px 2px rgba(9, 12, 36, .06), 0 12px 28px -14px rgba(8, 52, 170, .3)`): väiksemad esiletõstetud pinnad.
- **CTA** (`0 1px 2px rgba(9, 12, 36, .14), 0 10px 24px -10px rgba(8, 87, 248, .62)`): sinine põhinupp.

## Shapes

Kuju on pehme, kuid mitte pillikujuline: korduvad raadiused 8, 12, 16 ja 22px; nupud kasutavad 10px, suurem demoaken 22px ning demo sisekaardid 14px. Õhukesed jahedad jooned eraldavad sektsioone ning paneele. Prioriteedisildid on erandina täis-pillid; vestlusmullidel võib olla väike suunatud nurk.

## Components

### Buttons
- **Shape:** õrnalt kumerad nurgad (10px).
- **Primary:** sinine pind, valge tekst; vähemalt 52px kõrge, `.8rem 1.5rem` padding.
- **Hover / Focus:** hover tumendab sinist; nähtav fookus on 2px sinine outline 3px nihkega.
- **Secondary:** valge pind, sinine tekst ja õrn sinine piir; hover lisab helesinise pinna.

### Chips
- **Style:** kompaktne pill (999px), sinine tähistus vaikimisi; staatusevärvid kasutavad eraldi punast, merevaigukollast ja rohelist.
- **State:** värv ja tekst märgivad prioriteeti või staatust.

### Cards / Containers
- **Corner Style:** vaikimisi 12–16px; hero demo aken 22px.
- **Background:** valge, mõnikord poolläbipaistev, või õrn sinakas udu.
- **Shadow Strategy:** pehme varju kasutus on piiratud demonstratsiooniaknale ja tegevustele.
- **Border:** õhuke jahe joon või sinine sisemine rõhutus.
- **Internal Padding:** valdavalt 1rem–1.5rem, skaleeritavates pindades clamp.

### Inputs / Fields
- **Style:** valge pind, 1px tugevam sinakashall piir, 10px radius, vähemalt 48px kõrgus.
- **Focus:** sinine piir ja 4px õrn sinine halo.

### Navigation
- **Style:** päis on kergelt läbikumav valge, sticky ning desktopis võib ainult avalehe ülaservas olla läbipaistev. T-logo ja nimi jäävad vasakule; praegune link saab sinise rõhu. Mobiilis muutub menüü avatavaks valgeks loendiks.

### Hero Demonstration
Avalehe demonstratsiooniaken on selle pinna erilahendus, mitte kõigi lehtede nõue: üks küsimus näitab pilve vastusest keeldumist, Tehisabilise vastust, leide ja inimese ülevaatust. Esitus käivitub ühe korra ning settib lõppseisu; kordusnupp käivitab selle uuesti. Vähendatud liikumise eelistusel jäetakse alguses kohe lõppseis nähtavale.

## Do's and Don'ts

### Do:
- **Do** hoia lugemispinnad heledad ning kasuta sinist selgelt eristatavate tegevuste ja fookuse jaoks.
- **Do** säilita Host Grotesk / Hanken Grotesk rollijaotus ning olemasolevad skaleeruvad suurused.
- **Do** järgi laiuseid 900/980/1000px vastavalt paigutuse, päise ja kolmeveerulise võrgu vajadusele.
- **Do** säilita klaviatuurifookus ja `prefers-reduced-motion` toetus.

### Don't:
- **Don't** kasuta süsteemi üldise alusena tumedat hacker-teemat, rohelist koodiekraani ega loetavust vähendavat tumedat pinda.
- **Don't** paiguta mobiilivaates dekoratiivset ribbonit päise või pealkirja taha.
- **Don't** pane hero-demo näidet lõputult korduma: see on ühekordne sissejuhatus, mille saab soovi korral uuesti käivitada.
