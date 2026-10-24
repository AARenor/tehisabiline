(() => {
  const input = document.querySelector("[data-dora-file]");
  const button = document.querySelector("[data-dora-check]");
  const result = document.querySelector("[data-dora-result]");
  if (!input || !button || !result) return;

  const expected = [
    "Kirje ID", "IKT-teenus", "Teenuse tüüp", "Teenuseosutaja", "Registrikood või LEI",
    "Alltöövõtja", "Toetatav funktsioon", "Kriitiline või oluline", "Andmete asukoht",
    "Lepingu algus", "Lepingu lõpp", "Väljumisplaan", "Riskitase", "Omanik", "Tõend", "Märkused"
  ];
  const optional = new Set(["Alltöövõtja", "Märkused"]);
  const dateFields = new Set(["Lepingu algus", "Lepingu lõpp"]);

  const parse = (text, delimiter) => {
    const rows = [];
    let row = [], field = "", quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (ch === '"') {
        if (quoted && text[i + 1] === '"') { field += '"'; i += 1; }
        else quoted = !quoted;
      } else if (ch === delimiter && !quoted) {
        row.push(field); field = "";
      } else if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && text[i + 1] === "\n") i += 1;
        row.push(field); field = "";
        if (row.some((value) => value.trim() !== "")) rows.push(row);
        row = [];
      } else {
        field += ch;
      }
    }
    row.push(field);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    return rows;
  };

  const render = (title, lines, ok) => {
    result.hidden = false;
    result.innerHTML = `<p><strong>${title}</strong></p>${lines.length ? `<ul>${lines.map((line) => `<li>${line}</li>`).join("")}</ul>` : ""}<p class="nis2-check__note">Kontroll toimub ainult sinu brauseris. Faili ei saadeta serverisse ega salvestata.</p>`;
    result.dataset.ok = ok ? "true" : "false";
    requestAnimationFrame(() => result.focus());
  };

  const check = async () => {
    const file = input.files?.[0];
    if (!file) {
      render("Vali enne CSV-fail", ["Kasuta allalaaditavat töömalli või sama veerustruktuuriga faili."], false);
      return;
    }
    const text = (await file.text()).replace(/^\uFEFF/, "");
    const first = text.split(/\r?\n/, 1)[0] || "";
    const delimiter = (first.match(/;/g) || []).length >= (first.match(/,/g) || []).length ? ";" : ",";
    const rows = parse(text, delimiter);
    if (rows.length < 2) {
      render("Fail on tühi või ainult päisega", ["Lisa vähemalt üks andmerida."], false);
      return;
    }
    const header = rows[0].map((value) => value.trim());
    const missingColumns = expected.filter((name) => !header.includes(name));
    if (missingColumns.length) {
      render("CSV päis ei vasta töömallile", [`Puuduvad veerud: ${missingColumns.join(", ")}.`], false);
      return;
    }
    const index = Object.fromEntries(expected.map((name) => [name, header.indexOf(name)]));
    const issues = [];
    const ids = new Set();
    let missingValues = 0, badDates = 0, duplicates = 0;
    rows.slice(1).forEach((row, offset) => {
      const line = offset + 2;
      const get = (name) => (row[index[name]] || "").trim();
      expected.forEach((name) => {
        if (!optional.has(name) && !get(name)) {
          missingValues += 1;
          if (issues.length < 8) issues.push(`Rida ${line}: tühi väli „${name}“.`);
        }
      });
      const validDate = (value) => {
        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) return false;
        const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
        return date.getUTCFullYear() === Number(match[1]) && date.getUTCMonth() === Number(match[2]) - 1 && date.getUTCDate() === Number(match[3]);
      };
      expected.filter((name) => dateFields.has(name)).forEach((name) => {
        const value = get(name);
        if (value && !validDate(value)) {
          badDates += 1;
          if (issues.length < 8) issues.push(`Rida ${line}: kuupäev „${name}“ ei ole kujul AAAA-KK-PP või on vigane.`);
        }
      });
      const start = get("Lepingu algus"), end = get("Lepingu lõpp");
      if (validDate(start) && validDate(end) && end < start) {
        badDates += 1;
        if (issues.length < 8) issues.push(`Rida ${line}: lepingu lõpp on enne algust.`);
      }
      const id = get("Kirje ID");
      if (id && ids.has(id)) {
        duplicates += 1;
        if (issues.length < 8) issues.push(`Rida ${line}: korduv Kirje ID „${id}“.`);
      }
      if (id) ids.add(id);
    });
    const dataRows = rows.length - 1;
    const summary = [`${dataRows} andmerida, ${missingColumns.length} puuduvat veergu.`];
    if (missingValues) summary.push(`${missingValues} tühja kohustuslikku välja.`);
    if (badDates) summary.push(`${badDates} kuupäeva vales vormingus.`);
    if (duplicates) summary.push(`${duplicates} korduvat Kirje ID-d.`);
    render(issues.length ? "Fail vajab parandusi" : "Põhikontroll läbitud", summary.concat(issues), !issues.length);
  };

  button.addEventListener("click", check);
  input.addEventListener("change", () => {
    result.hidden = true;
    result.innerHTML = "";
  });
})();
