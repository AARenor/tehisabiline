// NIS2 applicability self-check: local-only, no network calls, no legal determination.
(() => {
    const form = document.querySelector("[data-nis2-check]");
    const out = document.querySelector("[data-nis2-result]");
    if (!form || !out) return;

    const link = (href, text) => `<a href="${href}">${text}</a>`;
    const actions = `<p class="nis2-check__actions">${link("/nis2/kontrollnimekiri/", "NIS2 kontrollnimekiri")} · ${link("#registreerimine", "Registreerimine")} · ${link("/assets/downloads/nis2-kohaldamismemo-mall.docx", "Kohaldamismemo mall")}</p>`;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const missing = ["avalik", "sektor", "suurus", "eriline"].filter((key) => !data[key]);
        if (missing.length) {
            out.innerHTML = `<p><strong>Vastamata on ${missing.length} küsimus${missing.length > 1 ? "t" : ""}.</strong> Vasta kõigile neljale, et tulemus oleks usaldusväärne.</p>`;
            out.hidden = false;
            return;
        }

        let title;
        let body;
        if (data.avalik === "jah") {
            title = "NIS2 võib kohalduda avaliku sektori rolli tõttu.";
            body = "Kontrolli RIA juhisest, kas sinu asutus või ülesanne on hõlmatud ja kas pead end teenuseosutajana registreerima.";
        } else if (data.eriline === "jah") {
            title = "See teenus võib olla kohustuslane ka väiksema suurusega.";
            body = "DNS-i, domeeniregistri, sidevõrgu, pilve, andmevahetuse, IKT-halduse ja usaldusteenuste puhul ei pruugi suuruslävend otsustada. Kontrolli teenuse täpset määratlust NIS2 lisast.";
        } else if (data.sektor === "jah" && data.suurus === "jah") {
            title = "NIS2 kohaldub tõenäoliselt.";
            body = "Sektor ja suurus viitavad kohustuslasele. Järgmised sammud on registreerimine, riskianalüüs ja kümne meetme tõendid.";
        } else if (data.sektor === "ei tea" || data.eriline === "ei tea") {
            title = "Vastus on ebaselge – kontrolli sektorit ja erandeid.";
            body = "Vaata NIS2 lisa tegevusalasid ja RIA juhist. Kui tegevus jääb piiripeale, käsitle seda kohustuslasena kuni vastupidine on kinnitatud.";
        } else if (data.sektor === "jah" && data.suurus === "ei") {
            title = "Tavaliselt jääb väikeettevõte välja, kuid erandid võivad kohalduda.";
            body = "Kontrolli grupitasandit, avaliku sektori rolli ja eriteenuseid. Kui kohustus puudub, jäävad alles esmased turvameetmed.";
        } else if (data.sektor === "ei" && data.suurus === "jah") {
            title = "Sektori põhjal NIS2 ei pruugi kohalduda.";
            body = "Kontrolli siiski, kas mõni sinu tegevusala on NIS2 lisas või kas osutad eriteenust. Suurus üksi ei tee kohustuslaseks.";
        } else {
            title = "Praeguste vastuste põhjal NIS2 tõenäoliselt ei kohaldu.";
            body = "Kui tegevus, sektor või teenus muutub, hinda uuesti. Esmased turvameetmed on mõistlikud ka ilma kohustuseta.";
        }

        out.innerHTML = `<p><strong>${title}</strong></p><p>${body}</p><p class="nis2-check__note">See on orienteeruv enesekontroll, mitte õiguslik hinnang. Lõpliku kohaldumise otsustab RIA juhis ja kehtiv seadus.</p>${actions}`;
        out.hidden = false;
    });
})();
