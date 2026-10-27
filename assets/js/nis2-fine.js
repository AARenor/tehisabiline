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

    out.innerHTML = `<p><strong>Maksimaalne rahatrahv: ${eur.format(maxFine)}</strong></p><p>Arvutus: ${type === "essential" ? "ülioluline" : "oluline"} üksus; max(${eur.format(fixed)}; ${(rate * 100).toLocaleString("et-EE")}% eelmise majandusaasta ülemaailmsest aastakäibest ${eur.format(turnoverPart)}) = ${eur.format(maxFine)}. Määrav on ${basis}.</p><p class="nis2-check__note">See on ülempiir, mitte oodatav trahv. Järelevalve hindab rikkumise raskust, kestust, varasemaid rikkumisi, mõju, tahtlust või hooletust, leevendamist ja koostööd (KüTS&nbsp;§&nbsp;14 lg&nbsp;7). See ei ole õiguslik hinnang.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
