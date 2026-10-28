// NIS2 scope assessment (English): local-only verdict, no network requests.
// Implements the Estonian statutory test in KüTS § 3(2)(8) and § 3(3) — at least 50
// (essential: 250) annual work units AND a balance sheet total or turnover above the
// ceiling — and reports where the and/or reading of Annex Article 2(1)-(2) to
// Recommendation 2003/361/EC would give the other answer. Indicative only.
(() => {
    const form = document.querySelector("[data-nis2-scope-en]");
    const out = document.querySelector("[data-nis2-scope-result]");
    if (!form || !out) return;

    const keys = ["annex1", "annex2", "staff50", "turnover10", "balance10", "group", "special", "publicbody", "staff250", "turnover50", "balance43"];
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
        const turnover10 = yes("turnover10");
        const balance10 = yes("balance10");
        const group = yes("group");
        const special = yes("special");
        const publicbody = yes("publicbody");
        const staff250 = yes("staff250");
        const turnover50 = yes("turnover50");
        const balance43 = yes("balance43");

        // Estonian statute, KüTS § 3(2)(8) and § 3(4)(8): headcount AND at least one
        // financial ceiling exceeded.
        const sizeFloorMet = staff50 && (turnover10 || balance10);
        // Annex Article 2(2) to Recommendation 2003/361/EC reads "and/or", so an
        // enterprise leaves the small band only when both figures exceed the ceiling
        // (recital 4: "with the possibility of either of these two criteria being exceeded").
        const notSmallUnderRecommendation = staff50 || (turnover10 && balance10);
        // Essential entity, KüTS § 3(3): 250+ staff AND one of the two higher ceilings.
        const essentialByKuts = staff250 && (balance43 || turnover50);
        // Annex Article 2(1) to the same Recommendation: exceeding the medium-sized
        // ceilings means 250+ staff OR both higher ceilings.
        const essentialUnderRecommendation = staff250 || (turnover50 && balance43);

        const category = annex1 || annex2 || special || publicbody;
        const covered = sizeFloorMet || group;
        const split = sizeFloorMet !== notSmallUnderRecommendation
            ? `<p class="nis2-check__note"><strong>Readings diverge on your figures.</strong> Estonia's Cybersecurity Act (<span lang="et">KüTS</span> §&nbsp;3) requires at least 50 annual work units <em>and</em> a turnover or balance sheet total above €10 million: on the statute, ${sizeFloorMet ? "the size floor is met" : "the size floor is not met"}. Annex Article 2(2) to Recommendation 2003/361/EC is written “and/or”, so on that reading ${notSmallUnderRecommendation ? "you are not a small enterprise" : "you remain a small enterprise"}. RIA applies the statute; write down both conclusions and which one you registered under.</p>`
            : "";

        let title;
        let body;

        if (!category) {
            title = "Out of scope on these answers";
            body = "No Annex I or Annex II type of activity, no size-independent service and no public administration role was selected. An entity that is not of a listed type is not brought into scope by size alone. Write the reasoning down with the date and the financial year used, revisit it when your services change, and note that customers who are in scope will still pass security requirements down through contracts under Article 21(2)(d).";
        } else if (special) {
            title = "In scope regardless of size";
            body = "One of the services covered by Article 2(2) was selected, so the size test does not decide coverage. The entity level depends on which one: qualified trust service providers, top-level domain name registries and DNS service providers are essential entities regardless of size (Article 3(1)(b)); providers of public electronic communications networks or publicly available electronic communications services are in scope regardless of size and become essential when they meet the size test in <span lang=\"et\">KüTS</span> §&nbsp;3(2)(8) (Article 3(1)(c)); critical entities identified under Directive (EU) 2022/2557 are essential (Article 3(1)(f)); other national designations under Article 2(2)(b) to (e) are essential or important as the Member State decides (Article 3(1)(e) and 3(2)). Confirm which list your service is on before registering.";
        } else if (publicbody) {
            title = "In scope as a public administration entity";
            body = "Public administration entities of central government are in scope regardless of size and are essential entities (Article 2(2)(f)(i) and Article 3(1)(d)). Regional-level entities are covered where they provide services whose disruption could have a significant impact on critical societal or economic activities (Article 2(2)(f)(ii)); local-level entities and education institutions are covered only if the Member State so provides (Article 2(5)). In Estonia the Cybersecurity Act (KüTS) treats central and local government units as essential entities and public-law legal persons as important entities, so confirm the category before you register.";
        } else if (!covered) {
            title = "Out of scope on these answers";
            body = "The activity is of a listed type but the size floor is not met: fewer than 50 annual work units, or neither the turnover nor the balance sheet total above €10 million. Estonia's statute needs both the headcount and one of the two financial figures; Article 2(1) of the directive only reaches entities that are medium-sized or larger. Record the staff figures as annual work units, the financial year used and the group treatment, because a subsidiary that later grows or is consolidated differently can cross the threshold. If you have partner or linked enterprises, answer the group question again rather than relying on standalone accounts.";
        } else if (!sizeFloorMet && group) {
            title = "Likely in scope — the group test decides";
            body = "Your own figures stay below the size floor but aggregation with partner and linked enterprises takes you over it. Under the Annex to Recommendation 2003/361/EC, partner enterprise data are added in proportion to the capital or voting interest and linked enterprise data in full. Estonia qualifies this: KüTS section 3(7) disregards partner and linked-enterprise data where the entity is independent of them in the systems used to provide its services. Document which reading applies to you before registering or deciding you are out of scope.";
        } else if (annex1 && essentialByKuts) {
            title = "In scope — likely an essential entity";
            body = "An Annex I type of activity plus the higher ceilings means an essential entity. Estonia's test in KüTS §&nbsp;3(3) is 250 or more annual work units <em>and</em> either a balance sheet total above €43 million or a turnover above €50 million. Annex Article 2(1) to Recommendation 2003/361/EC is looser — 250 or more staff alone, or both higher ceilings — so if the statute's two limbs are not both met the entity is important, not essential. Essential entities face the same Article 21 measures as important entities but a different supervisory regime: RIA can supervise and inspect on its own initiative rather than only after evidence of a breach, and the maximum fine is higher.";
        } else if (annex2) {
            title = "In scope — likely an important entity";
            body = "Annex II types of activity do not become essential by size alone. Above the size floor they are important entities under Article 3(2), unless the Member State identifies them as essential under Article 2(2)(b) to (e). The duties are the same ten measures of Article 21(2) and the same reporting clock; supervision is triggered ex post, after evidence of a breach, and the maximum fine is lower than for essential entities.";
        } else {
            title = "In scope — likely an important entity";
            body = `An Annex I type of activity within the size band is an important entity under Article 3(2): the higher ceilings are not met, so the entity cannot be essential under Article 3(1)(a).${essentialUnderRecommendation && !essentialByKuts ? " Note that Annex Article 2(1) to Recommendation 2003/361/EC would treat 250 or more staff, or both higher financial ceilings, as exceeding the medium-sized ceilings; confirm the entity level with RIA rather than assuming important." : ""} The next steps are the same as for an essential entity — notify RIA, apply the ten Article 21(2) measures, designate the accountable board member — but the supervisory posture is ex post.`;
        }

        out.innerHTML = `<p><strong>${title}.</strong></p><p>${body}</p>${split}<p><strong>Next step:</strong> notify RIA within three months of becoming a service provider in scope (KüTS section 4<sup>1</sup>(1)) and report any change in the submitted data within two weeks. Registration is a notification, not a certificate of compliance.</p>${note}${actions}`;
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
