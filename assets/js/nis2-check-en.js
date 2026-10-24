// NIS2 applicability self-check: local-only, no network calls, no legal determination.
(() => {
  const form = document.querySelector("[data-nis2-check-en]");
  const out = document.querySelector("[data-nis2-result-en]");
  if (!form || !out) return;

  const link = (href, text) => `<a href="${href}">${text}</a>`;
  const actions = `<p class="nis2-check__actions">${link("/en/nis2/", "NIS2 guide")} · ${link("/en/nis2/#registration", "Registration")} · ${link("/en/nis2/#reporting", "Incident reporting")}</p>`;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const missing = ["public", "sector", "size", "special"].filter((key) => !data[key]);
    if (missing.length) {
      out.innerHTML = `<p><strong>${missing.length} question${missing.length > 1 ? "s are" : " is"} unanswered.</strong> Answer all four for a meaningful result.</p>`;
      out.hidden = false;
      return;
    }

    let title;
    let body;
    if (data.public === "yes") {
      title = "NIS2 may apply because of a public-sector role.";
      body = "Check the RIA guidance to confirm whether your body or task is covered and whether you must register as a service provider.";
    } else if (data.special === "yes") {
      title = "This service may be covered even below the size threshold.";
      body = "DNS, domain registration, electronic communications, cloud, managed ICT services and trust services can be covered regardless of size. Check the exact service definition in the NIS2 annexes.";
    } else if (data.sector === "yes" && data.size === "yes") {
      title = "NIS2 probably applies.";
      body = "The sector and size point to an entity in scope. Next steps are registration, risk assessment and evidence for the ten duties.";
    } else if (data.sector === "unsure" || data.special === "unsure") {
      title = "The answer is unclear — check the sector and exceptions.";
      body = "Review the NIS2 annexes and RIA guidance. If the activity is borderline, treat it as in scope until the opposite is confirmed.";
    } else if (data.sector === "yes" && data.size === "no") {
      title = "A small entity is usually out of scope, but exceptions may apply.";
      body = "Check group size, public-sector roles and special services. If the obligation does not apply, basic security measures are still sensible.";
    } else if (data.sector === "no" && data.size === "yes") {
      title = "NIS2 may not apply based on the sector.";
      body = "Still check whether another activity is in an annex or whether you provide a special service. Size alone does not make you an entity in scope.";
    } else {
      title = "Based on these answers, NIS2 probably does not apply.";
      body = "Reassess if your sector, services or group structure changes. Basic security measures remain sensible without a legal obligation.";
    }

    out.innerHTML = `<p><strong>${title}</strong></p><p>${body}</p><p class="nis2-check__note">This is an indicative self-check, not a legal opinion. The final scope is determined by the RIA guidance and applicable law.</p>${actions}`;
    out.hidden = false;
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
