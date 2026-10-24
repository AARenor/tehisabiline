// NIS2 maximum fine calculator: local-only, no network calls, no legal determination.
(() => {
  const form = document.querySelector("[data-nis2-fine]");
  const out = document.querySelector("[data-nis2-fine-result]");
  if (!form || !out) return;

  const eur = new Intl.NumberFormat("et-EE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const type = data.get("type");
    const turnover = Number(data.get("turnover"));
    if (!type || !Number.isFinite(turnover) || turnover < 0) {
      out.innerHTML = "<p><strong>Sisesta üksuse liik ja positiivne aastakäive.</strong></p>";
      out.hidden = false;
      return;
    }

    const fixed = type === "essential" ? 10000000 : 7000000;
    const rate = type === "essential" ? 0.02 : 0.014;
    const turnoverPart = turnover * rate;
    const maxFine = Math.max(fixed, turnoverPart);
    const basis = turnoverPart > fixed ? "käibepõhine osa" : "fikseeritud ülempiir";

    out.innerHTML = `<p><strong>Maksimaalne rahatrahv: ${eur.format(maxFine)}</strong></p><p>Arvutus: ${type === "essential" ? "ülioluline" : "oluline"} üksus, ${eur.format(fixed)} või ${(rate * 100).toLocaleString("et-EE")}% käibest. Määrav on ${basis}.</p><p class="nis2-check__note">See on matemaatiline ülempiir, mitte hinnang tegelikule trahvile. Järelevalve hindab rikkumise raskust, kestust, mõju ja koostööd. Kontrolli kehtivat KüTS-i ja RIA juhist.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
