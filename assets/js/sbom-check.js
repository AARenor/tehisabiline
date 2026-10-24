(() => {
  const form = document.querySelector("[data-sbom-check]");
  if (!form) return;
  const input = form.querySelector("[data-sbom-file]");
  const result = form.querySelector("[data-sbom-result]");
  if (!input || !result) return;
  const lang = (document.documentElement.lang || "et").toLowerCase().startsWith("en") ? "en" : "et";
  const copy = lang === "en" ? {
    choose: "Choose a CSV file first",
    chooseBody: "Use the downloadable template or a file with the same headers.",
    empty: "The file is empty or has only a header",
    emptyBody: "Add at least one component row.",
    header: "The CSV header does not match the template",
    missingCols: "Missing columns",
    pass: "Basic check passed",
    fix: "The file needs corrections",
    rows: "data rows",
    components: "components",
    missing: "empty required fields",
    duplicates: "duplicate component versions",
    placeholders: "placeholder values",
    note: "The check runs only in your browser. The file is not uploaded or stored.",
    cta: "CRA guide",
    cta2: "Request a review",
    row: "Row",
    emptyField: "empty field",
    duplicate: "duplicate component",
    idPrefix: "identifier does not start with pkg: or cpe:.",
    placeholder: "placeholder value must be replaced with real data."
  } : {
    choose: "Vali enne CSV-fail",
    chooseBody: "Kasuta allalaaditavat töömalli või sama veerustruktuuriga faili.",
    empty: "Fail on tühi või ainult päisega",
    emptyBody: "Lisa vähemalt üks komponendi rida.",
    header: "CSV päis ei vasta töömallile",
    missingCols: "Puuduvad veerud",
    pass: "Põhikontroll läbitud",
    fix: "Fail vajab parandusi",
    rows: "andmerida",
    components: "komponenti",
    missing: "tühja kohustuslikku välja",
    duplicates: "korduvat komponendi versiooni",
    placeholders: "näidis- või asendusväärtust",
    note: "Kontroll toimub ainult sinu brauseris. Faili ei saadeta serverisse ega salvestata.",
    cta: "CRA juhend",
    cta2: "Küsi ülevaatust",
    row: "Rida",
    emptyField: "tühi väli",
    duplicate: "korduv komponent",
    idPrefix: "identifikaator ei alga prefiksiga pkg: või cpe:.",
    placeholder: "näidis- või asendusväärtus tuleb päris andmetega asendada."
  };

  const aliases = {
    name: ["komponendi nimi", "component name", "name", "package"],
    version: ["versioon", "version"],
    supplier: ["tarnija", "supplier", "vendor"],
    id: ["identifikaator (purl/cpe)", "identifier (purl/cpe)", "identifier", "purl", "cpe", "package url"],
    license: ["litsents", "license"],
    relationship: ["otsene või kaudne", "direct or indirect", "relationship", "dependency"]
  };
  const required = ["name", "version", "supplier", "id"];
  const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

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
    result.dataset.ok = ok ? "true" : "false";
    result.innerHTML = `<p><strong>${esc(title)}</strong></p>${lines.length ? `<ul>${lines.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>` : ""}<p class="nis2-check__actions"><a href="${lang === "en" ? "/en/cra/" : "/cra/"}">${esc(copy.cta)}</a> · <a href="/#contact">${esc(copy.cta2)}</a></p><p class="nis2-check__note">${esc(copy.note)}</p>`;
    requestAnimationFrame(() => result.focus());
  };

  const check = async () => {
    const file = input.files?.[0];
    if (!file) {
      render(copy.choose, [copy.chooseBody], false);
      return;
    }
    const text = (await file.text()).replace(/^\uFEFF/, "");
    const first = text.split(/\r?\n/, 1)[0] || "";
    const delimiter = (first.match(/;/g) || []).length >= (first.match(/,/g) || []).length ? ";" : ",";
    const rows = parse(text, delimiter);
    if (rows.length < 2) {
      render(copy.empty, [copy.emptyBody], false);
      return;
    }
    const header = rows[0].map((value) => value.trim().toLowerCase());
    const index = {};
    Object.entries(aliases).forEach(([field, names]) => {
      const found = names.map((name) => header.indexOf(name)).find((position) => position >= 0);
      if (found !== undefined) index[field] = found;
    });
    const missingColumns = required.filter((field) => index[field] === undefined);
    if (missingColumns.length) {
      render(copy.header, [`${copy.missingCols}: ${missingColumns.join(", ")}.`], false);
      return;
    }
    const issues = [];
    const seen = new Set();
    let missingValues = 0, duplicates = 0, placeholders = 0;
    rows.slice(1).forEach((row, offset) => {
      const line = offset + 2;
      const get = (field) => (index[field] === undefined ? "" : (row[index[field]] || "").trim());
      required.forEach((field) => {
        if (!get(field)) {
          missingValues += 1;
          if (issues.length < 8) issues.push(`${copy.row} ${line}: ${copy.emptyField} „${field}“.`);
        }
      });
      const name = get("name"), version = get("version"), identifier = get("id");
      if (name && version) {
        const key = `${name}\u0000${version}`.toLowerCase();
        if (seen.has(key)) {
          duplicates += 1;
          if (issues.length < 8) issues.push(`${copy.row} ${line}: ${copy.duplicate} „${name} ${version}“.`);
        }
        seen.add(key);
      }
      if (identifier && !/^(pkg:|cpe:)/i.test(identifier)) {
        if (issues.length < 8) issues.push(`${copy.row} ${line}: ${copy.idPrefix}`);
      }
      if (/näidis|example|asenda|replace|todo|tbd/i.test([name, version, identifier, get("supplier")].join(" "))) {
        placeholders += 1;
        if (issues.length < 8) issues.push(`${copy.row} ${line}: ${copy.placeholder}`);
      }
    });
    const dataRows = rows.length - 1;
    const summary = [`${dataRows} ${copy.rows}, ${dataRows} ${copy.components}.`];
    if (missingValues) summary.push(`${missingValues} ${copy.missing}.`);
    if (duplicates) summary.push(`${duplicates} ${copy.duplicates}.`);
    if (placeholders) summary.push(`${placeholders} ${copy.placeholders}.`);
    render(issues.length ? copy.fix : copy.pass, summary.concat(issues), !issues.length);
  };

  form.addEventListener("submit", (event) => { event.preventDefault(); check(); });
  input.addEventListener("change", () => { result.hidden = true; result.innerHTML = ""; });
})();
