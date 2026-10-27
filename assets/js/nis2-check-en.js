// NIS2 applicability self-check: local-only, no network calls, no legal determination.
(() => {
  const form = document.querySelector("[data-nis2-check-en]");
  const out = document.querySelector("[data-nis2-result-en]");
  if (!form || !out) return;

  const link = (href, text) => `<a href="${href}">${text}</a>`;
  const actions = `<p class="nis2-check__actions">${link("/en/nis2/", "NIS2 guide")} · ${link("/en/nis2/#registration", "Registration")} · ${link("/en/nis2/#reporting", "Incident reporting")}</p>`;
  const keys = ["avalik", "sektor", "suurus", "eriline"];

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const missing = keys.filter((key) => !data[key]);
    if (missing.length) {
      out.innerHTML = `<p><strong>${missing.length} question${missing.length > 1 ? "s are" : " is"} unanswered.</strong> Answer all four for a meaningful result.</p>`;
      out.hidden = false;
      return;
    }

    let title;
    let body;
    if (data.avalik === "yes") {
      title = "NIS2 may apply because of a public-sector role.";
      body = "Central and local government units are essential entities under KüTS &sect;&nbsp;3, and public-law legal persons are important entities. Neither depends on the size test. Check the RIA guidance for your exact body or task and whether you must notify RIA.";
    } else if (data.eriline === "yes") {
      title = "This service may be covered regardless of size.";
      body = "DNS service providers, top-level domain registries, qualified trust service providers, vital-service providers and critical communications networks are covered under KüTS &sect;&nbsp;3 without the general size test. Public electronic communications providers are covered at either level; size decides only whether they are essential or important. Check the exact definition in KüTS &sect;&nbsp;3.";
    } else if (data.sektor === "yes" && data.suurus === "yes") {
      title = "NIS2 probably applies.";
      body = "Your activity is in a KüTS &sect;&nbsp;3 category and your size meets that category's test. Next steps: check the category's exact size threshold in the RIA guidance, notify RIA if you are a service provider in scope, carry out a risk assessment and keep evidence for the ten NIS2 Article 21 measures.";
    } else if (keys.some((key) => data[key] === "unsure")) {
      title = "The answer is unclear — check the sector, size and exceptions.";
      body = "Review the KüTS &sect;&nbsp;3 categories, your employee and financial figures, and the RIA guidance. If the activity is borderline, treat it as in scope until the opposite is confirmed.";
    } else if (data.sektor === "yes" && data.suurus === "no") {
      title = "A smaller entity is usually out of scope, but exceptions may apply.";
      body = "The general size test (at least 50 employees AND turnover or balance sheet above €10 million) is not met. Check whether a size-independent service applies (question 4) or whether a public-sector role applies (question 1). Partner and linked-enterprise figures are not automatically added (KüTS &sect;&nbsp;3(7)). If no obligation applies, basic security measures are still sensible.";
    } else if (data.sektor === "no" && data.suurus === "yes") {
      title = "NIS2 may not apply based on the sector.";
      body = "Size alone does not bring you into scope. Check whether another activity is in the KüTS &sect;&nbsp;3 list or whether you provide a size-independent service.";
    } else {
      title = "Based on these answers, NIS2 probably does not apply.";
      body = "Reassess if your activity, services or group structure changes. Basic security measures remain sensible without a legal obligation.";
    }

    out.innerHTML = `<p><strong>${title}</strong></p><p>${body}</p><p class="nis2-check__note">This is an indicative self-check, not a legal opinion. The final scope is determined by the RIA guidance and applicable law.</p>${actions}`;
    out.hidden = false;
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
