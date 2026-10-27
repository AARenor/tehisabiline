// NIS2 applicability self-check: local-only, no network calls, no legal determination.
(() => {
    const form = document.querySelector("[data-nis2-check]");
    const out = document.querySelector("[data-nis2-result]");
    if (!form || !out) return;

    const link = (href, text) => `<a href="${href}">${text}</a>`;
    const actions = `<p class="nis2-check__actions">${link("/nis2/kontrollnimekiri/", "NIS2 kontrollnimekiri")} · ${link("#registreerimine", "Registreerimine")} · ${link("/assets/downloads/nis2-kohaldamismemo-mall.docx", "Kohaldamismemo mall")}</p>`;
    const keys = ["avalik", "sektor", "suurus", "eriline"];

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const missing = keys.filter((key) => !data[key]);
        if (missing.length) {
            out.innerHTML = `<p><strong>Vastamata on ${missing.length} küsimus${missing.length > 1 ? "t" : ""}.</strong> Vasta kõigile neljale, et tulemus oleks usaldusväärne.</p>`;
            out.hidden = false;
            return;
        }

        let title;
        let body;
        if (data.avalik === "jah") {
            title = "NIS2 võib kohalduda avaliku sektori rolli tõttu.";
            body = "Keskvalitsuse ja kohaliku omavalitsuse üksused kuuluvad KüTS &sect;&nbsp;3 alusel ülioluliste üksuste hulka ning avalik-õiguslikud juriidilised isikud oluliste üksuste hulka; mõlemal juhul suuruse nõuet ei ole. Kontrolli RIA juhisest oma asutuse või ülesande täpset staatust ja seda, kas pead end teavitama.";
        } else if (data.eriline === "jah") {
            title = "See teenus võib olla kohustuslane ka väiksema suurusega.";
            body = "DNS-teenuse osutajad, tippdomeeninimede registri pidajad, kvalifitseeritud usaldusteenuse osutajad, elutähtsa teenuse osutajad ning kriitilise tähtsusega side teenuse osutajad kuuluvad KüTS &sect;&nbsp;3 alusel kohustuslaste hulka ilma üldise suuruse nõudeta. Üldkasutatava elektroonilise side teenuse osutajad on kohustuslased sõltumata suurusest; suurus määrab vaid, kas nad on ülioluline või oluline üksus. Kontrolli teenuse täpset määratlust KüTS &sect;&nbsp;3 loetelust.";
        } else if (data.sektor === "jah" && data.suurus === "jah") {
            title = "NIS2 kohaldub tõenäoliselt.";
            body = "Tegevusala kuulub KüTS &sect;&nbsp;3 loetelusse ja suurus vastab selle kategooria nõudele. Järgmised sammud: kontrolli kategooria täpset suurusnõuet RIA juhisest, teavita end RIA-le, kui oled kohustuslane, tee riskianalüüs ja kogu tõendid kümne NIS2 artikli 21 meetme kohta.";
        } else if (keys.some((key) => data[key] === "ei tea")) {
            title = "Vastus on ebaselge – kontrolli sektorit, suurust ja erandeid.";
            body = "Vaata KüTS &sect;&nbsp;3 loetelu, oma töötajate arvu ja finantsnäitajaid ning RIA juhist. Kui tegevus jääb piiripeale, käsitle seda kohustuslasena, kuni vastupidine on kinnitatud.";
        } else if (data.sektor === "jah" && data.suurus === "ei") {
            title = "Tavaliselt jääb väikeettevõte välja, kuid erandid võivad kohalduda.";
            body = "Üldine suuruse nõue (vähemalt 50 töötajat JA aastakäive või bilansimaht üle 10 miljoni euro) ei ole täidetud. Kontrolli, kas kehtib suurusest sõltumatu teenus või avaliku sektori roll. Grupi andmeid ei lisata automaatselt; vaata KüTS &sect;&nbsp;3(7). Kui kohustus puudub, jäävad alles esmased turvameetmed.";
        } else if (data.sektor === "ei" && data.suurus === "jah") {
            title = "Sektori põhjal NIS2 ei pruugi kohalduda.";
            body = "Suurus üksi ei tee kohustuslaseks. Kontrolli siiski, kas mõni sinu tegevus kuulub KüTS &sect;&nbsp;3 loetellu või kas osutad suurusest sõltumatut teenust.";
        } else {
            title = "Praeguste vastuste põhjal NIS2 tõenäoliselt ei kohaldu.";
            body = "Kui tegevus, teenus või grupi struktuur muutub, hinda uuesti. Esmased turvameetmed on mõistlikud ka ilma kohustuseta.";
        }

        out.innerHTML = `<p><strong>${title}</strong></p><p>${body}</p><p class="nis2-check__note">See on orienteeruv enesekontroll, mitte õiguslik hinnang. Lõpliku kohaldumise otsustab RIA juhis ja kehtiv seadus.</p>${actions}`;
        out.hidden = false;
    });
})();
