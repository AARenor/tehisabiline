# Ööraport — tehisabiline.ee täisaudit (25.→26. sept 2026, öö)

## Mis leiti (olulisemad)

**P0 (katkised asjad):**
1. Klaviatuuriga vormi kasutada ei saanud — fookusrõngas oli CSS-iga maha võetud. PARANDATUD.
2. Vormi hallid vihad (placeholder) olid praktiliselt nähtamatud (kontrast 1.2:1). PARANDATUD (5.4:1).

**P1 (11 tk, kõik parandatud):** vorm jäi katkise ühenduse korral igaveseks "Saadan..."-olekusse (nüüd 15 s timeout); botikaitse puudus (nüüd honeypot); veateated ei teavitanud ekraanilugejat; navilingid alla puutepiiri; tuhmid väiketekstid liiga heledad; ilma JS-ita tühi leht (nüüd noscript-varu); Escape röövis fookuse; ikoonid segasid ekraanilugejat.

**Disain:** 7 lehekülge + mobiil üle vaadatud — struktuur terve, vigu ei leitud. Hero pealkirjal oli surnud CSS-klass (eemaldatud).

**SEO:** baas oli tugev; lisatud AVIF-pildid (~50% väiksemad), piltide vahemälu, 404-lehe lingid. test:seo 9/9, loop CLEAN.

**Backend:** kontaktivorm → n8n webhook töötab, aga ilma serveripoolse piiranguta (ainult sinu serveris parandatav — vt all).

## Mis ootab (sinu teha hommikul)

1. **Otsusta pushimine.** Kogu öötöö on *commitimata* lokaalselt (ohutusreegel). Kui tahad live'i: ütle "pushi" ja panen üles + teavitan otsingumootoreid.
2. **n8n webhook** (`n8n.arleserver.cfd`) — lisa serveris: throttling, päritolu-kontroll, sõnumi suuruse piir. Muidu saab vormi spämmida.
3. **Soovi korral hiljem:** Google Search Console + Business Profile (otsingu andmed), arvustused, tagasilingid — mina neid sinu eest teha ei saa.
4. **Teadlikult tegemata:** kahe CSS-süsteemi ühendamine ja kleepuva sisukorra parandus (katkestusoht öösel) — mõlemad on raportis kirjas, risk väike.

## Numbrid

- test:seo: 9/9 PASS · seo-loop: CLEAN (0 viga, 0 hoiatust) · --strict: exit 0
- Review: 2 ringi, teine CLEAN (0 P0/P1)
- Ebatavalised rajad: noscript ✓, katkestatud webhook ✓, honeypot ✓, tühik-sisestus ✓, vigane pealkiri → FAIL ✓
- Live baasliin (ööl vastu 26.09): kõik lehed 200, avaleht 59KB / 0.56s
