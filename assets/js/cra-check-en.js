(() => {
  const form = document.querySelector("[data-cra-check-en]");
  if (!form) return;
  const result = form.querySelector("[data-cra-check-en-result]");
  if (!result) return;

  const render = (title, body) => {
    result.hidden = false;
    result.innerHTML = `<p><strong>${title}</strong></p><p>${body}</p><p><a href="/#contact">Request a CRA scope review</a> · <a href="/en/sbom/">Read the SBOM guide</a></p><p class="nis2-check__note">This is an indicative check, not a legal opinion. The final scope and any exclusions need a lawyer or the competent authority.</p>`;
    requestAnimationFrame(() => result.focus());
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);

    if (data.get("scope") === "no") {
      render("Probably outside the CRA", "If the product is not made available on the EU market through a commercial activity, the CRA may not apply. Reassess when you start selling or supplying it in the EU.");
      return;
    }

    if (data.get("digital") === "no") {
      render("Probably outside the CRA", "The CRA focuses on products with digital elements that have a direct or indirect connection to a device or network. If the product has no digital element and no connection, check whether a component or remote processing is covered separately.");
      return;
    }

    if (data.get("excluded") === "yes") {
      render("Check the sector rule before applying the CRA", "The CRA may not apply if another EU sector rule covers the same risks at an equal or higher level. This is not an automatic exemption: compare the specific product and legal basis, and document the conclusion.");
      return;
    }

    if (data.get("manufacturer") === "no") {
      render("You may have importer or distributor duties", "If you place a product on the market under another manufacturer's name, you are probably not the manufacturer for CRA purposes. Check the CE marking, declaration of conformity, instructions and support period, and your own importer or distributor obligations.");
      return;
    }

    render("The CRA probably applies", "Start with the risk assessment and vulnerability process, then assess the SBOM, support period, technical documentation and conformity route. Reporting duties have applied since 11 September 2026.");
  });

  form.addEventListener("reset", () => {
    result.hidden = true;
    result.innerHTML = "";
  });
})();
