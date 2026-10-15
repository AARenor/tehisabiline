# E-posti aktivatsiooni checklist (pärast Zone.ee tellimust)

Taust ja hinnad: `/home/arle/tehisabiline-mail-decision-2026-10-12.md` (Parts 1–22).
See fail = tegevuskava hetkest, mil Zone.ee konto on loodud.

## 1. Tellimus (kasutaja tegevus)

- Minu Zone → **Veebimajutus Starter 11,95 €/kuu** (kuuarveldus, sidumata) — 8 GB postkastide
  maht, piiramatu arv postkaste/domeene.
- Valikuline: **Premium 50 GB 5,30 €/kuu** põhipostkastile (individuaalne kvoot, leebemad limiidid).
- Allikad ja võrdlus: report Part 17 (hinnad 2026-06-02) + Part 18 (lõplik arhitektuur).

## 2. Domeeni lisamine (kasutaja tegevus, Minu Zone)

1. Veebimajutus → Domeenid → lisa **tehisabiline.ee** *välise* domeenina (registripidaja
   jääb Elkdata/Cloudflare NS — Zone FAQ kinnitab, et see töötab).
2. Loo postkastid: `arle@tehisabiline.ee`, `info@tehisabiline.ee` (piiramatu arv).
3. Vajadusel Postiloend uudiskirja jaoks (eelnev nõusolek kohustuslik, Zone KB).

## 3. DNS kirjed (Cloudflare, zone `f84d8a0695b9dff9e63052729b7a1faa`)

**Väärtused võta täpselt Minu Zone'st** (SPF/DKIM genereerib Zone domeeni kohta) — ära
kirjuta neid käsitsi ümber. Cache: DNS only (hall pilv) MX/TXT puhul.

| Tüüp | Nimi | Sisu | Märkus |
|---|---|---|---|
| MX | `@` | `zonemx.eu` priority **10** | ametlik (zone.ee KB mx-record) |
| TXT | `@` | Zone-issued SPF (nt `v=spf1 include:… ~all`) | kopeeri Minu Zone'st |
| TXT | DKIM selektor (Minu Zone'st) | Zone-issued DKIM võti | kopeeri Minu Zone'st |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:arle@tehisabiline.ee` | alusta `p=none`; pärast puhtaid raporteid `p=quarantine` |
| TXT | `@` | (olemas) `google-site-verification=…` | **jäta alles** |

Kontroll:

```bash
dig +short MX tehisabiline.ee        # ootus: 10 zonemx.eu.
dig +short TXT tehisabiline.ee       # ootus: SPF + google-site-verification
dig +short TXT _dmarc.tehisabiline.ee
dig +short TXT <dkim-selektor>._domainkey.tehisabiline.ee
```

+ mail-tester.com test kiri (eesmärk: SPF/DKIM/DMARC pass, 10/10).

## 4. Twenty CRM ühendamine (serveripoolne, kui postkast olemas)

Twenty → Settings → Accounts → Add account → **IMAP**:

- IMAP: `imap.zone.eu` port **993** SSL — sissetulev sünkroonimine
- SMTP: `smtp.zone.eu` port **465** SSL — saatmine Twenty'st
- Kasutajanimi = täisaadress (`arle@tehisabiline.ee`)
- Teadaolevad piirangud: sama domeeni sisekirju ei sünkroonita; Zone.ee-l pole CalDAV-i
  (kalender vajaks eraldi teenust); IMAP-kanal on tagasihoidlikum kui Gmail OAuth.

## 5. Külm-kampaania (eraldi domeenid, mitte brand)

- Kampaaniad **eraldi juurdomeenidelt** (~8–12 €/a tk), mitte tehisabiline.ee-lt.
- Sama postkast toidab nii Twenty't kui Mailmeteorit (SMTP).
- Piirangud: **1 kiri / 5 s** (ületamine = automaatne SMTP ACCESS DENIED), SMTP 2000
  saajat / 24 h; hoia throttle ≤ 1 kiri / 10 s; kaebused < 0,3 %; kohene opt-out.
- Uued domeenid: soojendus 5–10 kirja/päev 2–4 nädalat.
- Vt report Parts 10, 15, 16 (Zone AUP: tellimata reklaam = rämpspost — madal maht +
  puhas nimekiri + opt-out hoiab riski juhitavana).

## 6. Webmail (serveripoolne, valikuline)

Tunnel `home-apps` sisaldab juba hostname'e `mail.tehisabiline.ee` ja
`webmail.tehisabiline.ee` → suuna need lokaalsele Roundcube'ile, kui postkast on olemas
(report Part 19/20: oma klient, Zone'i transport).

## 7. Lõppkontroll

1. `dig` kirjed + mail-tester 10/10
2. Saada test-kiri `arle@` → `info@`, kontrolli päiseid (SPF/DKIM/DMARC pass)
3. Twenty → sissetulev kiri ilmub kontaktile (thread timeline)
4. Vasta Twenty'st → kiri jõuab kohale, logitakse
5. Postiloend: tellimis-/loobumislingid töötavad
