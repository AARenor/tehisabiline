// NIS2 registration deadline helper: local-only, no network calls.
(() => {
  const form = document.querySelector("[data-nis2-reg-deadline]");
  const out = document.querySelector("[data-nis2-reg-deadline-result]");
  if (!form || !out) return;

  const fmt = new Intl.DateTimeFormat("et-EE", { dateStyle: "long" });
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
      out.innerHTML = "<p><strong>Sisesta vähemalt üks kuupäev.</strong></p>";
      out.hidden = false;
      return;
    }
    const parts = [];
    if (start) parts.push(`<li><strong>RIA teavitus:</strong> ${fmt.format(addMonthsClamped(start, 3))} — hiljemalt kolme kuu jooksul pärast seda, kui muutusid KüTS&nbsp;§&nbsp;3 kohaseks teenuseosutajaks.</li>`);
    if (change) parts.push(`<li><strong>Muudatusest teatamine:</strong> ${fmt.format(addDays(change, 14))} — hiljemalt kaks nädalat pärast muudatuse tegemise kuupäeva.</li>`);
    out.innerHTML = `<ul>${parts.join("")}</ul><p class="nis2-check__note">Kolme kuu tähtaeg algab päevast, mil muutusid KüTS&nbsp;§&nbsp;3 kohaseks teenuseosutajaks, mitte ettevõtte asutamisest. Kontrolli eesti.ee teavituse vormi ja KüTS-i kehtivat teksti. Kalkulaator arvutab kalendritähtajad, mitte RIA menetlusaega. See ei ole õiguslik hinnang.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => { out.hidden = true; out.innerHTML = ""; });
})();
