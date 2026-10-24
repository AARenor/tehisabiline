// NIS2 reporting deadline calculator (EN): local-only, no network calls.
(() => {
  const form = document.querySelector("[data-nis2-deadline-en]");
  const out = document.querySelector("[data-nis2-deadline-en-result]");
  if (!form || !out) return;

  const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });
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
      out.innerHTML = "<p><strong>Enter the date and time the incident was detected.</strong></p>";
      out.hidden = false;
      return;
    }

    out.innerHTML = `<p><strong>Detected:</strong> ${fmt.format(detected)}</p><ul><li><strong>Early warning (24 h):</strong> ${fmt.format(addHours(detected, 24))}</li><li><strong>Notification (72 h):</strong> ${fmt.format(addHours(detected, 72))}</li><li><strong>Final report (1 month):</strong> ${fmt.format(addMonth(detected))}</li></ul><p class="nis2-check__note">Check RIA's current channel and requirements. The calculation uses absolute hours; local clock time can shift at a daylight-saving transition. This is not a substitute for the incident process.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
