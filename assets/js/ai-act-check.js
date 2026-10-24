(() => {
  const form = document.querySelector("[data-ai-check]");
  if (!form) return;

  const result = form.querySelector("[data-ai-check-result]");
  if (!result) return;

  const render = (title, body, tone) => {
    result.hidden = false;
    result.dataset.tone = tone;
    result.innerHTML = `<p><strong>${title}</strong></p><p>${body}</p><p class="nis2-check__note">See on orienteeruv kontroll, mitte õiguslik hinnang. Lõpliku riskiklassi ja kohustused kinnitab pädev asutus või jurist.</p>`;
    requestAnimationFrame(() => result.focus());
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);

    if (!data.get("scope")) {
      render("Vasta esimesele küsimusele", "Märgi, kas süsteem on ELi turul või mõjutab ELi kasutajaid. Ilma selle vastuseta ei saa kohaldumist hinnata.", "info");
      return;
    }

    if (data.get("scope") === "ei") {
      render("Tõenäoliselt väljaspool AI Acti kohaldamisala", "Kui süsteem ei ole ELi turul ega mõjuta ELi kasutajaid, ei pruugi määrus kohalduda. Kontrolli siiski, kas süsteemi väljundit kasutatakse ELis või kas oled ELi kasutajale teenust osutades pakkuja rollis.", "info");
      return;
    }

    if (data.get("prohibited") === "jah") {
      render("Tõenäoliselt keelatud kasutusjuht", "Kirjelda kasutusotstarve ja konsulteeri juristiga enne arenduse või kasutuse jätkamist. Keelatud praktika korral ei aita tavaline turvatestimine ega dokumentatsioon.", "error");
      return;
    }

    if (data.get("product") === "jah" || data.get("annex") === "jah") {
      render("Tõenäoliselt suur risk", "Süsteem võib kuuluda suure riskiga kategooriasse. Vaja on riskijuhtimist, tehnilist dokumentatsiooni, logimist, inimjärelevalvet ja vastavushindamist. Turvatestimine võib toetada tõendeid, kuid ei asenda vastavushindamist.", "warning");
      return;
    }

    if (data.get("transparency") === "jah") {
      render("Piiratud risk: läbipaistvuskohustused", "Kontrolli, kas kasutajat tuleb teavitada AI-ga suhtlemisest ja kas AI loodud sisu peab olema märgistatud. Täpne kohustus sõltub kasutusjuhust ja sisust.", "warning");
      return;
    }

    render("Minimaalne risk", "AI Acti erinõuded ei pruugi kohalduda, kuid kehtivad teised seadused ja tavapärased turvanõuded. Kui süsteem muutub või kasutusotstarve laieneb, hinda riskiklassi uuesti.", "success");
  });

  form.addEventListener("reset", () => {
    result.hidden = true;
    result.innerHTML = "";
  });
})();
