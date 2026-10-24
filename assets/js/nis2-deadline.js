// NIS2 reporting deadline calculator: local-only, no network calls.
(() => {
  const form = document.querySelector("[data-nis2-deadline]");
  const out = document.querySelector("[data-nis2-deadline-result]");
  if (!form || !out) return;

  const fmt = new Intl.DateTimeFormat("et-EE", { dateStyle: "medium", timeStyle: "short" });
  const addHours = (date, hours) => new Date(date.getTime() + hours * 60 * 60 * 1000);
  const addMonth = (date) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + 1);
    return next;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = new FormData(form).get("detected");
    const detected = value ? new Date(value) : null;
    if (!detected || Number.isNaN(detected.getTime())) {
      out.innerHTML = "<p><strong>Sisesta intsidendi avastamise kuupäev ja kellaaeg.</strong></p>";
      out.hidden = false;
      return;
    }

    out.innerHTML = `<p><strong>Avastamine:</strong> ${fmt.format(detected)}</p><ul><li><strong>Varajane hoiatus (24 h):</strong> ${fmt.format(addHours(detected, 24))}</li><li><strong>Teade (72 h):</strong> ${fmt.format(addHours(detected, 72))}</li><li><strong>Lõpparuanne (1 kuu):</strong> ${fmt.format(addMonth(detected))}</li></ul><p class="nis2-check__note">Kontrolli RIA kehtivat kanalit ja nõudeid. Kalkulaator arvutab kohalikus ajavööndis ega asenda intsidendiprotseduuri.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
