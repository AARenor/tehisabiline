// NIS2 registration deadline helper (EN): local-only, no network calls.
(() => {
  const form = document.querySelector("[data-nis2-reg-deadline-en]");
  const out = document.querySelector("[data-nis2-reg-deadline-en-result]");
  if (!form || !out) return;

  const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });
  const parse = (value) => {
    if (!value) return null;
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return Number.isNaN(date.getTime()) ? null : date;
  };
  const addMonthsClamped = (date, months) => {
    const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    return new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(date.getUTCDate(), lastDay)));
  };
  const addDays = (date, days) => new Date(date.getTime() + days * 86400000);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const start = parse(data.get("start"));
    const change = parse(data.get("change"));
    if (!start && !change) {
      out.innerHTML = "<p><strong>Enter at least one date.</strong></p>";
      out.hidden = false;
      return;
    }
    const parts = [];
    if (start) parts.push(`<li><strong>Registration:</strong> ${fmt.format(addMonthsClamped(start, 3))} — within three months of starting the activity.</li>`);
    if (change) parts.push(`<li><strong>Change notification:</strong> ${fmt.format(addDays(change, 14))} — within two weeks of the change.</li>`);
    out.innerHTML = `<ul>${parts.join("")}</ul><p class="nis2-check__note">Check the RIA registration form and the current KüTS text. The calculator returns calendar deadlines, not acceptance or processing time.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => { out.hidden = true; out.innerHTML = ""; });
})();
