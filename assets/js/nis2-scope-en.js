// NIS2 scope assessment (English): local-only verdict, no network requests.
// Mirrors Directive (EU) 2022/2555 Articles 2 and 3 and the SME Annex to
// Recommendation 2003/361/EC. Indicative only, never a legal determination.
(() => {
    const form = document.querySelector("[data-nis2-scope-en]");
    const out = document.querySelector("[data-nis2-scope-result]");
    if (!form || !out) return;

    const keys = ["annex1", "annex2", "staff50", "money10", "group", "special", "publicbody", "ceilings"];
    const link = (href, text) => `<a href="${href}">${text}</a>`;
    const actions = `<p class="nis2-check__actions">${link("/en/nis2/registration/", "Registration with RIA")} · ${link("/en/nis2/checklist/", "Article 21 checklist")} · ${link("/en/nis2/fines/", "Fines and liability")}</p>`;
    const note = `<p class="nis2-check__note">This is a screening result, not a legal opinion. The conclusion depends on the exact subsector definition, the financial year you measure and the group treatment; record all three and confirm the reading with RIA.</p>`;

    const render = () => {
        const data = Object.fromEntries(new FormData(form));
        const missing = keys.filter((key) => !data[key]);
        if (missing.length) {
            out.hidden = true;
            out.innerHTML = "";
            return;
        }

        const yes = (key) => data[key] === "yes";
        const annex1 = yes("annex1");
        const annex2 = yes("annex2");
        const staff50 = yes("staff50");
        const money10 = yes("money10");
        const group = yes("group");
        const special = yes("special");
        const publicbody = yes("publicbody");
        const ceilings = yes("ceilings");

        const category = annex1 || annex2 || special || publicbody;
        const ownSize = staff50 || money10;
        const covered = ownSize || group;

        let title;
        let body;

        if (!category) {
            title = "Out of scope on these answers";
            body = "No Annex I or Annex II type of activity, no size-independent service and no public administration role was selected. An entity that is not of a listed type is not brought into scope by size alone. Write the reasoning down with the date and the financial year used, revisit it when your services change, and note that customers who are in scope will still pass security requirements down through contracts under Article 21(2)(d).";
        } else if (special) {
            title = "In scope regardless of size";
            body = "One of the services covered by Article 2(2) was selected, so the size test does not decide coverage. The entity level depends on which one: qualified trust service providers, top-level domain name registries and DNS service providers are essential entities regardless of size (Article 3(1)(b)); providers of public electronic communications networks or publicly available electronic communications services are in scope regardless of size and become essential when they qualify as medium-sized enterprises (Article 3(1)(c)); critical entities identified under Directive (EU) 2022/2557 are essential (Article 3(1)(f)); other national designations under Article 2(2)(b) to (e) are essential or important as the Member State decides (Article 3(1)(e) and 3(2)).";
        } else if (publicbody) {
            title = "In scope as a public administration entity";
            body = "Public administration entities of central government are in scope regardless of size and are essential entities (Article 2(2)(f)(i) and Article 3(1)(d)). Regional-level entities are covered where they provide services whose disruption could have a significant impact on critical societal or economic activities (Article 2(2)(f)(ii)); local-level entities and education institutions are covered only if the Member State so provides (Article 2(5)). In Estonia the Cybersecurity Act (KüTS) treats central and local government units as essential entities and public-law legal persons as important entities, so confirm the category before you register.";
        } else if (!covered) {
            title = "Out of scope on these answers";
            body = "The activity is of a listed type but the size floor is not met: fewer than 50 employees and neither turnover nor the balance sheet total above €10 million. Under Article 2(1) the directive only reaches entities that qualify as medium-sized enterprises or exceed the medium-sized ceilings. Record the staff figures as annual work units, the financial year used and the group treatment, because a subsidiary that later grows or is consolidated differently can cross the threshold. If you have partner or linked enterprises, answer the group question again rather than relying on standalone accounts.";
        } else if (!ownSize && group) {
            title = "Likely in scope — the group test decides";
            body = "Your own figures stay in the small band but aggregation with partner and linked enterprises takes you over the threshold. Under the Annex to Recommendation 2003/361/EC, partner enterprise data are added in proportion to the capital or voting interest and linked enterprise data in full. Estonia qualifies this: KüTS section 3(7) disregards partner and linked-enterprise data where the entity is independent of them in the systems used to provide its services. Document which reading applies to you before registering or deciding you are out of scope.";
        } else if (annex1 && ceilings) {
            title = "In scope — likely an essential entity";
            body = "An Annex I type of activity plus figures above the medium-sized ceilings means an essential entity under Article 3(1)(a): 250 or more employees, or turnover above €50 million, or a balance sheet total above €43 million. Essential entities face the same Article 21 measures as important entities but a different supervisory regime: RIA can supervise and inspect on its own initiative rather than only after evidence of a breach, and the maximum fine is higher.";
        } else if (annex2) {
            title = "In scope — likely an important entity";
            body = "Annex II types of activity do not become essential by size alone. Above the size floor they are important entities under Article 3(2), unless the Member State identifies them as essential under Article 2(2)(b) to (e). The duties are the same ten measures of Article 21(2) and the same reporting clock; supervision is triggered ex post, after evidence of a breach, and the maximum fine is lower than for essential entities.";
        } else {
            title = "In scope — likely an important entity";
            body = "An Annex I type of activity within the size band is an important entity under Article 3(2): the medium-sized ceilings are not exceeded, so the entity cannot be essential under Article 3(1)(a). The next steps are the same as for an essential entity — notify RIA, apply the ten Article 21(2) measures, designate the accountable board member — but the supervisory posture is ex post.";
        }

        out.innerHTML = `<p><strong>${title}.</strong></p><p>${body}</p><p><strong>Next step:</strong> notify RIA within three months of becoming a service provider in scope (KüTS section 4<sup>1</sup>(1)) and report any change in the submitted data within two weeks. Registration is a notification, not a certificate of compliance.</p>${note}${actions}`;
        out.hidden = false;
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        render();
        out.focus();
    });
    form.addEventListener("change", render);
    form.addEventListener("reset", () => {
        out.hidden = true;
        out.innerHTML = "";
    });
})();
