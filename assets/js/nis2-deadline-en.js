// NIS2 reporting deadline calculator (EN): local-only, no network calls.
(() => {
  const form = document.querySelector("[data-nis2-deadline-en]");
  const out = document.querySelector("[data-nis2-deadline-en-result]");
  if (!form || !out) return;

  const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });
  const addHours = (date, hours) => new Date(date.getTime() + hours * 60 * 60 * 1000);
  const addCalendarMonth = (date) => {
    const next = new Date(date);
    const day = next.getDate();
    next.setDate(1);
    next.setMonth(next.getMonth() + 1);
    const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(day, lastDay));
    return next;
  };
  const format = (date) => fmt.format(date);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const awarenessValue = data.get("awareness");
    const awareness = awarenessValue ? new Date(awarenessValue) : null;
    if (!awareness || Number.isNaN(awareness.getTime())) {
      out.innerHTML = "<p><strong>Enter the date and time the entity became aware of the incident.</strong></p>";
      out.hidden = false;
      return;
    }

    const earlyNotice = addHours(awareness, 24);
    const notificationDeadline = addHours(awareness, 72);
    const filingValue = data.get("filing");
    const filing = filingValue ? new Date(filingValue) : null;
    const hasFiling = filing && !Number.isNaN(filing.getTime());
    const unresolved = data.has("unresolved");
    const finalDeadline = hasFiling ? addCalendarMonth(filing) : addCalendarMonth(notificationDeadline);
    const finalLabel = hasFiling
      ? "Final report due by"
      : "Provisional latest possible final-report date (if the 72-hour notification is filed at the last moment)";

    out.innerHTML = `<p><strong>Awareness:</strong> ${format(awareness)}</p><ul><li><strong>Early warning (24 h):</strong> ${format(earlyNotice)}</li><li><strong>Incident notification (72 h):</strong> ${format(notificationDeadline)}</li><li><strong>${finalLabel}:</strong> ${format(finalDeadline)}</li></ul><p>Under KüTS § 8(7), the one-month period starts when the 72-hour incident notification is actually filed. One month means the same calendar date and time in the following month, or that month’s last day if the date does not exist.</p>${unresolved ? "<p><strong>The incident is not yet resolved:</strong> a final report filed by the deadline is treated as a progress report; a new final report is due within one month after the incident is resolved. RIA may request a progress report earlier.</p>" : ""}<p class="nis2-check__note">This calculation runs in your browser and makes no network calls. Check RIA’s current channel and requirements. This calculator is not a substitute for your incident process.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
