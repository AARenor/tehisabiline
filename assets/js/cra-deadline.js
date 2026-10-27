// CRA reporting deadline helper: local-only, no network calls.
(() => {
  const form = document.querySelector("[data-cra-deadline]");
  const out = document.querySelector("[data-cra-deadline-result]");
  if (!form || !out) return;

  const fmt = new Intl.DateTimeFormat("et-EE", { dateStyle: "medium", timeStyle: "short" });
  const addHours = (date, hours) => new Date(date.getTime() + hours * 60 * 60 * 1000);
  const addDays = (date, days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  };
  // Calendar-month addition with end-of-month clamping: 31 Jan + 1 month = 28/29 Feb, not 2/3 Mar.
  const addMonth = (date) => {
    const next = new Date(date);
    const day = next.getDate();
    next.setDate(1);
    next.setMonth(next.getMonth() + 1);
    const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(day, lastDay));
    return next;
  };
  const typeSelect = form.querySelector("[name=cra-type]");
  const fixWrap = form.querySelector("[data-cra-fix-wrap]");

  const sync = () => {
    if (fixWrap) fixWrap.hidden = typeSelect.value !== "vulnerability";
  };
  typeSelect.addEventListener("change", sync); sync();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const detected = data.get("detected") ? new Date(data.get("detected")) : null;
    if (!detected || Number.isNaN(detected.getTime())) {
      out.innerHTML = "<p><strong>Sisesta avastamise kuupäev ja kellaaeg.</strong></p>";
      out.hidden = false;
      return;
    }
    const warning = addHours(detected, 24);
    const notification = addHours(detected, 72);
    let final;
    let finalLabel;
    if (data.get("cra-type") === "vulnerability") {
      const fix = data.get("fix") ? new Date(data.get("fix")) : null;
      if (fix && !Number.isNaN(fix.getTime())) {
        final = addDays(fix, 14); finalLabel = "14 päeva pärast parandusmeetme kättesaadavust";
      } else {
        final = null; finalLabel = "14 päeva pärast parandusmeetme kättesaadavust (sisesta paranduse kuupäev)";
      }
    } else {
      final = addMonth(notification); finalLabel = "1 kuu pärast põhiteavitust";
    }
    out.innerHTML = `<p><strong>Avastamine:</strong> ${fmt.format(detected)}</p><ul><li><strong>Varajane hoiatus (24 h):</strong> ${fmt.format(warning)}</li><li><strong>Põhiteavitus (72 h):</strong> ${fmt.format(notification)}</li><li><strong>Lõpparuanne:</strong> ${final ? fmt.format(final) : finalLabel}${final ? ` — ${finalLabel}` : ""}</li></ul><p class="nis2-check__note">Kontrolli ENISA SRP-d, pädeva CSIRTi juhist ja CRA artiklit 14. „Üks kuu“ tähendab kalendrikuud: kui sama päev puudub, on tähtaeg kuu viimasel päeval. Suveaja üleminekul võib kohalik kellaaeg nihkuda. See ei asenda teatamisprotsessi.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => { out.hidden = true; out.innerHTML = ""; setTimeout(sync, 0); });
})();
