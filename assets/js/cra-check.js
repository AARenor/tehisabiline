(() => {
  const form = document.querySelector("[data-cra-check]");
  if (!form) return;
  const result = form.querySelector("[data-cra-check-result]");
  if (!result) return;

  const render = (title, body) => {
    result.hidden = false;
    result.innerHTML = `<p><strong>${title}</strong></p><p>${body}</p><p class="nis2-check__note">See on orienteeruv kontroll, mitte õiguslik hinnang. Lõpliku kohaldumise ja erandite ulatuse kinnitab jurist või pädev asutus.</p>`;
    requestAnimationFrame(() => result.focus());
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);

    if (data.get("scope") === "ei") {
      render("Tõenäoliselt väljaspool CRA kohaldamisala", "Kui toodet ei pakuta ELi turul ärilise tegevuse käigus, ei pruugi CRA kohalduda. Hinda olukorda uuesti, kui hakkad toodet ELis müüma või tasu eest pakkuma.");
      return;
    }

    if (data.get("digital") === "ei") {
      render("Tõenäoliselt väljaspool CRA kohaldamisala", "CRA keskendub toodetele digielementidega, millel on otsene või kaudne ühendus seadme või võrguga. Kui tootel puudub digielement ja ühendus, kontrolli siiski, kas mõni komponent või kaugandmetöötlus kuulub eraldi CRA alla.");
      return;
    }

    if (data.get("excluded") === "jah") {
      render("Kontrolli sektorireeglit enne CRA kohaldamist", "CRA ei pruugi kohalduda, kui teine ELi sektorireegel katab samu riske vähemalt samal tasemel. See ei ole automaatne vabastus: võrdle konkreetse toote ja õigusliku alusega ning dokumenteeri järeldus.");
      return;
    }

    if (data.get("manufacturer") === "ei") {
      render("Sul võivad olla importija või distributsiooni kohustused", "Kui lased toote turule teise tootja nime all, ei ole sa CRA mõttes tõenäoliselt tootja. Kontrolli siiski CE-märgist, vastavusdeklaratsiooni, kasutusjuhendit ja tugiperioodi ning oma kohustusi importija või distributsioonina.");
      return;
    }

    render("Tõenäoliselt CRA kohaldub", "Alusta riskianalüüsist ja haavatavuste protsessist, seejärel hinda SBOM-i, tugiperioodi, tehnilise dokumentatsiooni ja vastavushindamise vajadust. Teatamiskohustus kehtib juba alates 11. septembrist 2026.");
  });

  form.addEventListener("reset", () => {
    result.hidden = true;
    result.innerHTML = "";
  });
})();
