// NIS2 reporting deadline calculator: local-only, no network calls.
(() => {
  const form = document.querySelector("[data-nis2-deadline]");
  const out = document.querySelector("[data-nis2-deadline-result]");
  if (!form || !out) return;

  const fmt = new Intl.DateTimeFormat("et-EE", { dateStyle: "medium", timeStyle: "short" });
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
      out.innerHTML = "<p><strong>Sisesta intsidendist teada saamise kuupäev ja kellaaeg.</strong></p>";
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
      ? "Lõpparuanne hiljemalt"
      : "Lõpparuanne hiljemalt (provisoorne; kui 72 tunni teade esitatakse viimase võimaliku hetkel)";

    out.innerHTML = `<p><strong>Teadasaamine:</strong> ${format(awareness)}</p><ul><li><strong>Varajane teade (24 h):</strong> ${format(earlyNotice)}</li><li><strong>Intsidenditeade (72 h):</strong> ${format(notificationDeadline)}</li><li><strong>${finalLabel}:</strong> ${format(finalDeadline)}</li></ul><p>KüTS § 8 lõike 7 järgi algab ühe kuu tähtaeg 72 tunni intsidenditeate tegelikust esitamisest. Üks kuu tähendab sama kalendripäeva ja kellaaega järgmisel kuul või selle kuu viimast päeva, kui sama kuupäeva ei ole.</p>${unresolved ? "<p><strong>Intsident ei ole veel lahendatud:</strong> tähtajaks esitatud lõppraportit käsitatakse vahearuandena; uus lõppraport tuleb esitada ühe kuu jooksul pärast intsidendi lahendamist. RIA võib varem küsida vahearuannet.</p>" : ""}<p class="nis2-check__note">Arvutus toimub selles brauseris ega kasuta võrguühendust. Kontrolli RIA kehtivat kanalit ja nõudeid. Kalkulaator ei asenda intsidendiprotseduuri.</p>`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
