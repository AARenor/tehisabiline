// security.txt builder (EN): local-only, no network calls.
// Field rules come from RFC 9116: Contact and Expires are the only mandatory
// fields, every web URI must use https, Expires must be an RFC 3339 timestamp
// less than a year ahead.
(() => {
  const form = document.querySelector("[data-cra-securitytxt]");
  const out = document.querySelector("[data-cra-securitytxt-output]");
  if (!form || !out) return;

  const status = document.querySelector("[data-cra-securitytxt-status]");
  const copyBtn = document.querySelector("[data-cra-securitytxt-copy]");
  const downloadBtn = document.querySelector("[data-cra-securitytxt-download]");
  const field = (name) => form.querySelector(`[name="${name}"]`);
  const Rfc3339 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(Z|[+-]\d{2}:\d{2})$/i;
  const LangTag = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*(?:\s*,\s*[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*)*$/;
  const year = 366 * 24 * 60 * 60 * 1000;
  let current = "";

  const say = (text, kind) => {
    if (!status) return;
    status.textContent = text;
    status.dataset.kind = kind || "";
  };

  const decode = (value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  // Contact: RFC 9116 section 2.5.3 — a URI. Email uses the mailto scheme,
  // phone numbers the tel scheme, anything web must be https.
  const contactProblem = (value) => {
    if (!value) return "Contact is required: give the address researchers should write to.";
    const lower = value.toLowerCase();
    if (lower.startsWith("mailto:")) {
      const address = decode(value.slice(7));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) {
        return "Contact: the mailto URI needs a full address after the prefix, for example a name, an at sign and a domain.";
      }
      return "";
    }
    if (lower.startsWith("tel:")) {
      if (!/^\+?[0-9().\-\s]{5,}$/.test(value.slice(4))) {
        return "Contact: the tel URI needs a reachable number, for example a country code and the digits.";
      }
      return "";
    }
    if (lower.startsWith("https://")) {
      try {
        const url = new URL(value);
        if (!url.hostname.includes(".")) return "Contact: the web address has no domain.";
        return "";
      } catch {
        return "Contact: the web address is not a valid URL.";
      }
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return "Contact: write a plain address as a URI with the mailto scheme in front, otherwise researchers cannot parse it.";
    }
    return "Contact must be a mailto URI, a tel URI or an https page. Plain text and insecure http values are rejected.";
  };

  // Expires: RFC 9116 section 2.5.5 — RFC 3339 timestamp, one occurrence,
  // recommended to stay less than a year ahead.
  const expiresProblem = (value) => {
    if (!value) return "Expires is required: RFC 9116 needs an end date for the file.";
    const match = value.match(Rfc3339);
    if (!match) return "Expires must look like 2027-10-01T00:00:00Z: date, T, time and time zone.";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Expires is not a valid date.";
    if (parsed.getTime() <= Date.now()) return "Expires is in the past: the file would be stale the moment you publish it.";
    return "";
  };

  const webProblem = (label, value, extraSchemes) => {
    if (!value) return "";
    const lower = value.toLowerCase();
    if (lower.startsWith("https://")) return "";
    if (extraSchemes && extraSchemes.some((scheme) => lower.startsWith(scheme))) return "";
    return `${label} must be an https URI${extraSchemes ? " or one of the key schemes RFC 9116 allows" : ""}.`;
  };

  const build = () => {
    const contact = field("contact").value.trim();
    const expires = field("expires").value.trim();
    const encryption = field("encryption").value.trim();
    const acknowledgments = field("acknowledgments").value.trim();
    const languages = field("languages").value.trim();
    const canonical = field("canonical").value.trim();
    const policy = field("policy").value.trim();
    const hiring = field("hiring").value.trim();

    const errors = [contactProblem(contact), expiresProblem(expires)].filter(Boolean);
    for (const [label, value] of [["Acknowledgments", acknowledgments], ["Canonical", canonical], ["Policy", policy], ["Hiring", hiring]]) {
      const problem = webProblem(label, value);
      if (problem) errors.push(problem);
    }
    const encryptionProblem = webProblem("Encryption", encryption, ["dns:", "openpgp4fpr:"]);
    if (encryptionProblem) errors.push(encryptionProblem);
    if (languages && !LangTag.test(languages)) {
      errors.push("Preferred-Languages takes comma-separated language tags such as en, et.");
    }
    if (errors.length) {
      out.textContent = errors.map((error) => `- ${error}`).join("\n");
      out.hidden = false;
      current = "";
      say("Not built: fix the fields above.", "error");
      return;
    }

    const lines = [
      "# security.txt for our product. Generated in the browser, RFC 9116.",
      `Contact: ${contact}`,
      `Expires: ${expires}`,
      ""
    ];
    for (const [name, value] of [
      ["Encryption", encryption],
      ["Acknowledgments", acknowledgments],
      ["Preferred-Languages", languages],
      ["Canonical", canonical],
      ["Policy", policy],
      ["Hiring", hiring]
    ]) {
      if (value) lines.push(`${name}: ${value}`);
    }
    while (lines[lines.length - 1] === "") lines.pop();
    current = `${lines.join("\n")}\n`;
    out.textContent = current;
    out.hidden = false;

    const warnings = [];
    const expiresDate = new Date(expires);
    if (expiresDate.getTime() - Date.now() > year) {
      warnings.push("Expires is more than a year ahead; RFC 9116 recommends a shorter lifetime to avoid stale files.");
    }
    if (!canonical) warnings.push("Add Canonical once you know the URL, so a signature and the retrieval URL can be matched.");
    say(warnings.length ? `File built. ${warnings.join(" ")}` : "File built. Copy it or download it, then publish it at the well-known path.", warnings.length ? "warn" : "ok");
    return current;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    build();
    if (current) out.focus();
  });

  form.addEventListener("reset", () => {
    current = "";
    out.textContent = "";
    out.hidden = true;
    say("");
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      if (!current) {
        say("Build the file first.", "error");
        return;
      }
      try {
        await navigator.clipboard.writeText(current);
        say("Copied to the clipboard.", "ok");
      } catch {
        const range = document.createRange();
        range.selectNodeContents(out);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        say("Clipboard blocked by the browser: the text is selected, copy it by hand.", "warn");
      }
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (!current) {
        say("Build the file first.", "error");
        return;
      }
      const blob = new Blob([current], {type: "text/plain;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "security.txt";
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      say("Downloaded as security.txt.", "ok");
    });
  }
})();
