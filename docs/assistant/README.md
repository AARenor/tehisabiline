# Tehisabiline veebiassistent — ops runbook

RAG-põhine AI-assistent tehisabiline.ee jaoks: vastab külastaja küsimustele Eesti/Inglise
keeles (lokaalne Ollama mudel + saidi sisu otsing) ja salvestab kontaktipäringud
**Twenty CRM-i** (Person + Note + vajadusel Opportunity).

## Arhitektuur

```
külastaja brauser (tehisabiline.ee, Cloudflare Pages)
  └── /assistant.js + /assistant.css  (widget, ET/EN, SSE voog)
        └── POST https://ai.tehisabiline.ee/api/chat   (SSE)
            └── Cloudflare tunnel "home-apps" (ee14ae85-c169-4bf1-87be-91ff10130cf9)
                └── FastAPI 127.0.0.1:8790  (käesolev kataloog, systemd)
                     ├── Ollama 127.0.0.1:11434  (chat: gemma3:4b, embeddings: bge-m3)
                     ├── RAG indeks  data/chunks.json + data/embeddings.npy  (121 chunk'i, 10 lk)
                     └── Twenty CRM  http://127.0.0.1:3010  (REST API, secrets/twenty_api_key)
        └── POST https://ai.tehisabiline.ee/api/lead    (kontaktivorm → Twenty)
```

- Widget on saidi repost (/home/arle/projects/tehisabiline/assistant.js + assistant.css),
  injekteeritud lehtedesse `tools/chrome.mjs` abil (plokk `<!-- chrome:widget -->`).
- `_headers` lubab `connect-src https://ai.tehisabiline.ee`; assistant.js/css cache 300 s.

## Failid

| Fail | Roll |
|---|---|
| `app.py` | FastAPI rakendus: /healthz, /api/chat (SSE), /api/lead |
| `build_index.py` | Ehitab RAG indeksi saidi HTML-ist + llms-full.txt-st (`SITE=/home/arle/projects/tehisabiline`) |
| `data/chunks.json`, `data/embeddings.npy` | Indeks (121 chunk'i, bge-m3, 1024-dim, L2-normaliseeritud) |
| `secrets/twenty_api_key` | Twenty API JWT (chmod 600; **mitte kunagi printida**) |
| `venv/` | Python 3.12 virtuaalkeskkond |
| `probe_twenty.py` | Twenty REST ühenduse kontroll |
| `tehisabiline-assistant.service` | Koopia systemd unit'ist (paigaldatud: /etc/systemd/system/) |

## Teenuse haldamine

```bash
systemctl status tehisabiline-assistant          # olek
sudo systemctl restart tehisabiline-assistant    # taaskäivitus (nt mudeli vahetusel)
journalctl -u tehisabiline-assistant -n 100 -f   # logid
curl -s http://127.0.0.1:8790/healthz            # kohalik tervis
curl -s https://ai.tehisabiline.ee/healthz       # läbi tunneli (sama vastus)
```

Oodatav `/healthz`: `{"ok":true,"chat_model":"gemma3:4b","embed_model":"bge-m3","chunks":121,"index":true,...}`

## Konfiguratsioon (env)

| Muutuja | Vaikeväärtus | Tähendus |
|---|---|---|
| `CHAT_MODEL` | `qwen2.5:7b` (koodis) / `gemma3:4b` (unit'is) | Ollama vestlusmudel |
| `EMBED_MODEL` | `bge-m3` | Embedding-mudel (peab klappima indeksiga) |
| `OLLAMA_URL` | `http://127.0.0.1:11434` | Ollama |
| `TWENTY_URL` | `http://127.0.0.1:3010` | Twenty REST (AINULT localhost; avalik crm.* blokeerib boti-UA) |
| `TWENTY_KEY_FILE` | `secrets/twenty_api_key` | API JWT fail |
| `DEV_ORIGINS` | tühi | Komaga eraldatud lisa-CORS originid (lokaalne test) |
| `PORT` | 8790 (unit) | Kuulatav port (ainult 127.0.0.1) |

Mudeli vahetus: `sudo systemctl edit tehisabiline-assistant` → `Environment=CHAT_MODEL=qwen2.5:7b`
→ restart. CPU-only (i5-10500T): gemma3:4b ≈ 8-9 tok/s (~45 s vastus), qwen2.5:7b ≈ 5 tok/s
(~85 s). Vastus voogetakse SSE-ga, seega kasutaja näeb teksti kohe.

## Indeksi uuendamine (kui saidi sisu muutub)

```bash
cd /home/arle/tehisabiline-assistant
venv/bin/python build_index.py          # loeb /home/arle/projects/tehisabiline lehti
sudo systemctl restart tehisabiline-assistant
curl -s http://127.0.0.1:8790/healthz   # kontrolli chunks arvu
```

Indeksisse lähevad: index, pentestimine, kuberaudit, mudelid, kasutusjuhud,
api-turvatestimine, veebirakenduse-turvatestimine, nis2, meist, privaatsus + llms-full.txt.

## API leping

**POST /api/chat** — `{"messages":[{"role":"user|assistant","content":"…"}],"stream":true}`
- piirangud: ≤8 sõnumit, ≤2000 tähemärki/sõnum; retrieval k=3, min score 0.25, chunk ≤550 ch
- SSE: `data: {"sources":[{title,url,score}]}` → `data: {"delta":"…"}`* → `data: {"done":true}`
- vead: `{"error":"model_unavailable"}` (Ollama maas), `429 {"error":"rate_limit"}` (30/h/IP)

**POST /api/lead** — `{"name","email","message","page","quote_requested","transcript":[…]}` → `{"ok":true,"personId":"…"}`
- dedupe: olemasolev Person leitakse `emails.primaryEmail` järgi; muidu luuakse uus
- alati: Note (`Veebivestluse päring — <nimi>`, sisu = aeg Europe/Tallinn, sõnum, leht, vestlus)
  + noteTarget → Person
- kui `quote_requested=true`: Opportunity `Veebipäring — <nimi>`, stage NEW, pointOfContact = Person
- piirang: 5/h/IP; consent-checkbox on kohustuslik (widget)

## Twenty kontroll (tõendid)

```bash
TOK=$(cat /home/arle/tehisabiline-assistant/secrets/twenty_api_key)   # ära prindi
curl -s -H "Authorization: Bearer $TOK" \
  "http://127.0.0.1:3010/rest/people?filter=emails.primaryEmail[eq]:kliient@example.com"
docker exec -i twenty-db-1 psql -U postgres -d default -c \
  "SELECT id,title FROM workspace_4x9kfohfwpthhvlaisxs5i7g2.\"note\" ORDER BY \"createdAt\" DESC LIMIT 5;"
```

API võti loodi commandiga (dev-override vajalik):
`docker exec -e NODE_ENV=development twenty-server-1 … node dist/command/command.js workspace:generate-api-key …`

## Widget (saidi pool)

- Failid: repo juur `assistant.js`, `assistant.css`; injektsioon `tools/chrome.mjs`
  (jooksuta `node tools/chrome.mjs` pärast lehtede muutmist).
- Test: `npm run test:seo` (keelab `<form>` elemendi ja "n8n" sõna **kõigis** .html/.js
  failides, sh kommentaarides — widget kasutab div/button lahendust).
- Deploy: `npx wrangler pages deploy` stagitud kataloogist (vt repo juurest
  `/tmp/opencode/deploy_pages.py` mustrit) — projekt `tehisabiline`, branch `main`.

## Veaotsing

| Sümptom | Põhjus / lahendus |
|---|---|
| `{"error":"model_unavailable"}` | Ollama maas või mudel puudub: `systemctl status ollama`, `ollama list` |
| 429 `rate_limit` | 30 chat / 5 lead tunnis IP kohta — oota või tõsta `CHAT_RATE`/`LEAD_RATE` app.py-s |
| Widget ei ilmu saidil | Kontrolli `curl -s https://tehisabiline.ee/ \| grep assistant.js`; `node tools/chrome.mjs` + deploy |
| CORS viga brauseris | `ALLOWED_ORIGINS` app.py-s peab sisaldama kasutatavat domeeni/pages.dev |
| `crm.tehisabiline.ee` → 403 error 1010 | CF blokeerib mitte-brauseri UA — kasuta `http://127.0.0.1:3010` |
| Tunnel 502 | `systemctl status cloudflared`, `curl 127.0.0.1:8790/healthz` |
| Aeglased vastused | CPU-only ~45 s gemma3:4b; `num_predict=220` piirab pikkust (app.py) |

## Turvalisus

- Teenus kuulab ainult 127.0.0.1; avalik ligipääs ainult läbi Cloudflare tunneli (ai.tehisabiline.ee).
- API JWT `secrets/twenty_api_key` (600) — ei tohi sattuda git'i, logidesse ega vestlusesse.
- Twenty REST on ligipääsetav ainult localhostist; avalik crm.* on brauseri-UA taga.
- Rate-limit on mälupõhine (kaob restardiga) — jätkusuutlik ühe serveri jaoks.
