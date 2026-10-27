// NIS2 maximum fine calculator (EN): local-only, no network calls, no legal determination.
(() => {
  const form = document.querySelector("[data-nis2-fine-en]");
  const out = document.querySelector("[data-nis2-fine-en-result]");
  if (!form || !out) return;

  const eur = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const type = data.get("type");
    const turnover = Number(data.get("turnover"));
    if (!type || !Number.isFinite(turnover) || turnover < 0) {
      out.innerHTML = "<p><strong>Choose an entity type and enter a positive annual turnover.</strong></p>";
      out.hidden = false;
      return;
    }

    const fixed = type === "essential" ? 10000000 : 7000000;
    const rate = type === "essential" ? 0.02 : 0.014;
    const turnoverPart = turnover * rate;
    const maxFine = Math.max(fixed, turnoverPart);
    const basis = turnoverPart > fixed ? "turnover-based amount" : "fixed ceiling";

    out.innerHTML = `<p><strong>Maximum fine: ${eur.format(maxFine)}</strong></p><p>Calculation: ${type === "essential" ? "essential" : "important"} entity; max(${eur.format(fixed)}; ${(rate * 100).toLocaleString("en-GB")}% of previous-year worldwide turnover ${eur.format(turnoverPart)}) = ${eur.format(maxFine)}. The ${basis} applies.</p><p class="nis2-check__note">This is a ceiling, not a predicted fine. The supervisor weighs severity, duration, prior breaches, impact, intent or negligence, mitigation and cooperation (KüTS&nbsp;§&nbsp;14(7)). Not a legal determination.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
