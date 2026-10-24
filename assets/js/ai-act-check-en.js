// AI Act risk self-check (EN): local-only, no network calls, no legal determination.
(() => {
  const form = document.querySelector("[data-ai-act-check-en]");
  const out = document.querySelector("[data-ai-act-check-en-result]");
  if (!form || !out) return;

  const link = (href, text) => `<a href="${href}">${text}</a>`;
  const actions = `<p class="nis2-check__actions">${link("/en/ai-act/#high-risk", "High-risk duties")} · ${link("/en/ai-act/#evidence", "Evidence")} · ${link("/#contact", "Request a scoping call")}</p>`;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const missing = ["scope", "prohibited", "highrisk", "role"].filter((key) => !data[key]);
    if (missing.length) {
      out.innerHTML = `<p><strong>${missing.length} question${missing.length > 1 ? "s are" : " is"} unanswered.</strong> Answer all four for a meaningful result.</p>`;
      out.hidden = false;
      return;
    }

    let title;
    let body;
    if (data.scope === "no") {
      title = "The AI Act may not apply directly.";
      body = "If the system is not placed on the EU market and does not affect users in the EU, the Act may not apply. Reassess if you start serving EU users or deploy the output in the EU.";
    } else if (data.prohibited === "yes") {
      title = "Stop and get legal review.";
      body = "The described use may fall within a prohibited practice. Do not deploy or continue the use case until a lawyer has assessed the specific practice and any exceptions.";
    } else if (data.highrisk === "yes") {
      title = "High-risk duties are likely.";
      body = "High-risk systems require risk management, data governance, technical documentation, logging, human oversight, accuracy, robustness, cybersecurity and post-market monitoring. Obligations differ for providers and deployers.";
    } else if (data.highrisk === "unsure") {
      title = "Classify the system before deployment.";
      body = "Check Annex I and Annex III against the intended purpose, not the model name. If the system is borderline, document the reasoning and obtain legal review.";
    } else if (data.role === "provider") {
      title = "Check transparency and general-purpose AI duties.";
      body = "A limited-risk provider may have transparency duties; a general-purpose AI model has separate documentation, copyright and systemic-risk obligations. Keep the classification evidence.";
    } else if (data.role === "deployer") {
      title = "Deployer duties still apply.";
      body = "A deployer must use the system according to instructions, ensure human oversight and monitor for serious incidents. Check the provider's documentation and your own transparency duties.";
    } else {
      title = "The Act probably applies with limited or minimal-risk duties.";
      body = "Confirm the risk class and your role. Keep an inventory, intended purpose, provider documentation and a human-oversight decision even when obligations are light.";
    }

    out.innerHTML = `<p><strong>${title}</strong></p><p>${body}</p><p class="nis2-check__note">This is an indicative screen, not a legal opinion. The final classification depends on the intended purpose, role and applicable guidance.</p>${actions}`;
    out.hidden = false;
    requestAnimationFrame(() => out.focus());
  });

  form.addEventListener("reset", () => {
    out.hidden = true;
    out.innerHTML = "";
  });
})();
