/* Tehisabiline veebiassistent — /assistant.js
   RAG-vestlus (SSE voog) + kontaktipäring Twenty CRM-i. Ilma sõltuvusteta.
   Märkus: test:seo keeld ei luba HTML vormielementi ega automaatika-viiteid — seepärast div/button lahendus. */
(() => {
  "use strict";

  var API = "https://ai.tehisabiline.ee";
  var EMAIL = "tehisabiline@gmail.com";
  var EMAIL_RE = new RegExp(EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  var MAX_CHARS = 2000;
  var MAX_SEND_TURNS = 8;

  var ET = (navigator.language || "").toLowerCase().indexOf("et") === 0;
  var L = ET
    ? {
        open: "Ava AI-assistent",
        close: "Sulge vestlus",
        title: "Tehisabiline assistent",
        subtitle: "Küberturvalisus ja küber-AI · küsige julgelt",
        intro:
          "Tere! Olen Tehisabiline AI-assistent. Küsi küberauditi, pentestimise, NIS2 või küber-AI API kohta — või jäta kontakt ja vastame ise.",
        placeholder: "Kirjuta küsimus…",
        send: "Saada",
        leave: "Jäta kontakt",
        foot: "Vastab AI-assistent",
        typing: "Assistent kirjutab…",
        sources: "Allikad:",
        error:
          "Vabandust, assistent ei vasta hetkel. Kirjuta palun " + EMAIL + ".",
        rate:
          "Liiga palju sõnumeid. Proovi tunni pärast uuesti või kirjuta " +
          EMAIL +
          ".",
        leadTitle: "Jäta kontakt",
        leadName: "Nimi",
        leadEmail: "E-post",
        leadMsg: "Sõnum (valikuline — vestlus lisatakse automaatselt)",
        leadQuote: "Soovin hinnapakkumist või tasuta kaardistust",
        leadConsent:
          "Nõustun, et minu andmeid kasutatakse vastamiseks. Vaata /privaatsus/.",
        leadConsentLink: "privaatsus",
        leadSubmit: "Saada päring",
        leadBack: "← Tagasi vestlusesse",
        leadErrName: "Palun sisesta nimi.",
        leadErrEmail: "Palun sisesta korrektne e-post.",
        leadErrConsent: "Palun kinnita nõusolek.",
        leadErrMsg: "Kirjuta paar sõna või vestle enne assistendiga.",
        leadFail: "Saatmine ebaõnnestus. Kirjuta palun " + EMAIL + ".",
        leadRate: "Liiga palju päringuid. Proovi hiljem või kirjuta " + EMAIL + ".",
        okTitle: "Päring on kohal!",
        okBody: "Vastame esimesel võimalusel, tavaliselt ühe tööpäeva jooksul.",
        okBack: "Tagasi vestlusesse",
      }
    : {
        open: "Open AI assistant",
        close: "Close chat",
        title: "Tehisabiline assistant",
        subtitle: "Cybersecurity and cyber-AI · ask away",
        intro:
          "Hi! I'm the Tehisabiline AI assistant. Ask about cybersecurity audits, pentesting, NIS2 or the cyber-AI API — or leave your contact and we'll reply.",
        placeholder: "Type your question…",
        send: "Send",
        leave: "Leave contact",
        foot: "Answered by an AI assistant",
        typing: "Assistant is typing…",
        sources: "Sources:",
        error: "Sorry, the assistant is unavailable right now. Please email " + EMAIL + ".",
        rate: "Too many messages. Try again in an hour or email " + EMAIL + ".",
        leadTitle: "Leave your contact",
        leadName: "Name",
        leadEmail: "Email",
        leadMsg: "Message (optional — the chat is attached automatically)",
        leadQuote: "I'd like a quote or a free scoping call",
        leadConsent: "I agree my data is used to reply. See /privaatsus/.",
        leadConsentLink: "privacy",
        leadSubmit: "Send",
        leadBack: "← Back to chat",
        leadErrName: "Please enter your name.",
        leadErrEmail: "Please enter a valid email.",
        leadErrConsent: "Please confirm consent.",
        leadErrMsg: "Write a few words or chat with the assistant first.",
        leadFail: "Sending failed. Please email " + EMAIL + ".",
        leadRate: "Too many requests. Try later or email " + EMAIL + ".",
        okTitle: "Got it!",
        okBody: "We'll reply as soon as possible, usually within one business day.",
        okBack: "Back to chat",
      };

  var ICONS = {
    chat:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5c-1.4 0-2.8-.3-4-.9L4 20l1-3.7a8.5 8.5 0 1 1 16-4.8z"/><path d="M8.6 11.5h.01M12 11.5h.01M15.4 11.5h.01"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12h14"/><path d="M12.5 6l6 6-6 6"/></svg>',
    ok:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.4 4.5L19 7.5"/></svg>',
  };

  var HTML = [
    '<button class="ta-launcher" id="ta-launcher" type="button" aria-expanded="false" aria-controls="ta-panel" aria-label="' + L.open + '">',
    ICONS.chat,
    "</button>",
    '<section class="ta-panel" id="ta-panel" hidden aria-label="' + L.title + '">',
    '  <header class="ta-head">',
    '    <span class="ta-mark" aria-hidden="true">TA</span>',
    '    <div class="ta-title"><strong>' + L.title + "</strong><span>" + L.subtitle + "</span></div>",
    '    <button class="ta-close" id="ta-close" type="button" aria-label="' + L.close + '">' + ICONS.close + "</button>",
    "  </header>",
    '  <div class="ta-log" id="ta-log" role="log" aria-live="polite"></div>',
    '  <div class="ta-compose" id="ta-compose">',
    '    <div class="ta-inputrow">',
    '      <label class="ta-sr" for="ta-input">' + L.placeholder + "</label>",
    '      <textarea class="ta-input" id="ta-input" rows="1" maxlength="' + MAX_CHARS + '" placeholder="' + L.placeholder + '"></textarea>',
    '      <button class="ta-send" id="ta-send" type="button" aria-label="' + L.send + '">' + ICONS.send + "</button>",
    "    </div>",
    '    <div class="ta-foot">',
    '      <button type="button" id="ta-lead-open">' + L.leave + "</button>",
    '      <span id="ta-foot-note">' + L.foot + "</span>",
    "    </div>",
    "  </div>",
    '  <div class="ta-lead" id="ta-lead" hidden>',
    '    <label for="ta-name">' + L.leadName + '</label>',
    '    <input id="ta-name" type="text" autocomplete="name" maxlength="200">',
    '    <label for="ta-email">' + L.leadEmail + '</label>',
    '    <input id="ta-email" type="email" autocomplete="email" maxlength="200">',
    '    <label for="ta-msg">' + L.leadMsg + "</label>",
    '    <textarea id="ta-msg" rows="3" maxlength="2000"></textarea>',
    '    <label class="ta-consent"><input id="ta-quote" type="checkbox"><span>' + L.leadQuote + "</span></label>",
    '    <label class="ta-consent"><input id="ta-consent" type="checkbox"><span>' + L.leadConsent.replace("/privaatsus/", '<a href="/privaatsus/">' + L.leadConsentLink + "</a>") + "</span></label>",
    '    <p class="ta-err" id="ta-lead-err" hidden></p>',
    '    <button class="ta-submit" id="ta-lead-send" type="button">' + L.leadSubmit + "</button>",
    '    <button class="ta-back" id="ta-lead-back" type="button">' + L.leadBack + "</button>",
    "  </div>",
    '  <div class="ta-success" id="ta-success" hidden>',
    '    <span class="ta-ok">' + ICONS.ok + "</span>",
    "    <strong>" + L.okTitle + "</strong>",
    "    <p>" + L.okBody + "</p>",
    '    <button type="button" id="ta-ok-back">' + L.okBack + "</button>",
    "  </div>",
    "</section>",
  ].join("\n");

  var panel, log, input, sendBtn, launcher, compose, leadView, successView;
  var history = [];
  var transcript = [];
  var streaming = false;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Lubatud lingid: saidi sisemised teed, tehisabiline.ee ja kontakt-e-post.
  function safeUrl(u) {
    if (!u) return "";
    if (/^\/(?!\/)[A-Za-z0-9#?=._~%/-]*$/.test(u)) return u;
    if (/^https:\/\/tehisabiline\.ee(\/[^\s"']*)?$/.test(u)) return u;
    if (u === "mailto:" + EMAIL) return u;
    return "";
  }

  // Turvaline kerge markdown: **paks**, [tekst](url), paljas tehisabiline.ee link, e-post -> mailto.
  function fmt(raw) {
    var out = esc(raw);
    out = out.replace(EMAIL_RE, function (m, off) {
      // Jäta vahele, kui e-post on juba osa mailto-URL-ist (nt [Kirjuta](mailto:...)),
      // nii et markdown-lingi samm saab selle ise korrektselt linkida.
      if (out.slice(Math.max(0, off - 7), off).toLowerCase() === "mailto:") return m;
      return '<a href="mailto:' + m + '">' + m + "</a>";
    });
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, text, url) {
      var href = safeUrl(url.replace(/&amp;/g, "&"));
      return href ? '<a href="' + href + '">' + text + "</a>" : text;
    });
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(
      /(^|[\s(])(https:\/\/tehisabiline\.ee\/[A-Za-z0-9#?=._~%/-]+)/g,
      function (m, pre, url) {
        return pre + '<a href="' + url + '">' + url + "</a>";
      }
    );
    return out;
  }

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function scrollLog() {
    log.scrollTop = log.scrollHeight;
  }

  function addMsg(role, text, withTyping) {
    var node = el("div", "ta-msg ta-msg--" + role);
    if (withTyping) node.appendChild(el("span", "ta-typing", "<i></i><i></i><i></i>"));
    else node.innerHTML = fmt(text);
    log.appendChild(node);
    scrollLog();
    return node;
  }

  function addNotice(text) {
    log.appendChild(el("p", "ta-notice", fmt(text)));
    scrollLog();
  }

  function addSources(node, sources) {
    if (!sources || !sources.length) return;
    var wrap = el("div", "ta-src");
    var seen = {};
    sources.forEach(function (s) {
      var href = safeUrl(s && s.url);
      if (!href || seen[href]) return;
      seen[href] = true;
      var a = el("a", null, esc((s && s.title) || href));
      a.href = href;
      wrap.appendChild(a);
    });
    if (wrap.childNodes.length) node.appendChild(wrap);
  }

  function setStreaming(on) {
    streaming = on;
    sendBtn.disabled = on;
    input.disabled = on;
    if (!on) input.focus();
  }

  function failNotice(message) {
    addNotice(message);
  }

  function send() {
    var text = input.value.trim().slice(0, MAX_CHARS);
    if (!text || streaming) return;
    input.value = "";
    autoSize();

    history.push({ role: "user", content: text });
    transcript.push({ role: "user", content: text });
    addMsg("user", text);

    var bubble = addMsg("bot", "", true);
    setStreaming(true);

    var payload = {
      messages: history.slice(-MAX_SEND_TURNS),
      stream: true,
    };

    fetch(API + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (res.status === 429) {
          res.json().catch(function () {});
          throw { type: "rate" };
        }
        if (!res.ok || !res.body) throw { type: "down" };
        return readSSE(res.body, bubble);
      })
      .catch(function (err) {
        bubble.remove();
        if (streaming) setStreaming(false);
        if (err && err.type === "rate") failNotice(L.rate);
        else failNotice(L.error);
      });
  }

  function readSSE(body, bubble) {
    var reader = body.getReader();
    var dec = new TextDecoder();
    var buf = "";
    var raw = "";
    var sources = [];
    var firstDelta = false;

    function finalize() {
      bubble.innerHTML = fmt(raw);
      transcript.push({ role: "assistant", content: raw });
      history.push({ role: "assistant", content: raw });
      addSources(bubble, sources);
      scrollLog();
    }

    function handle(evt) {
      if (evt.delta) {
        if (!firstDelta) {
          firstDelta = true;
          bubble.innerHTML = "";
        }
        raw += evt.delta;
        bubble.textContent = raw;
        scrollLog();
      } else if (evt.sources) {
        sources = evt.sources;
      } else if (evt.error) {
        if (raw) finalize();
        else bubble.remove();
        failNotice(L.error);
        setStreaming(false);
      } else if (evt.done) {
        if (raw) {
          finalize();
        } else {
          bubble.remove();
          failNotice(L.error);
        }
        setStreaming(false);
      }
    }

    function pump() {
      return reader.read().then(function (r) {
        if (r.done) {
          if (streaming) {
            if (raw) finalize();
            else bubble.remove();
            failNotice(L.error);
            setStreaming(false);
          }
          return;
        }
        buf += dec.decode(r.value, { stream: true });
        var idx;
        while ((idx = buf.indexOf("\n\n")) >= 0) {
          var chunk = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          chunk.split("\n").forEach(function (line) {
            if (line.indexOf("data:") !== 0) return;
            var payload = line.slice(5).trim();
            if (!payload) return;
            try {
              handle(JSON.parse(payload));
            } catch (e) {
              /* ignore malformed frame */
            }
          });
        }
        return pump();
      });
    }

    return pump();
  }

  function autoSize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

  function openPanel() {
    panel.hidden = false;
    panel.classList.add("ta-enter");
    launcher.setAttribute("aria-expanded", "true");
    if (!history.length) addMsg("bot", L.intro);
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  function showLead() {
    compose.hidden = true;
    log.hidden = true;
    successView.hidden = true;
    leadView.hidden = false;
    document.getElementById("ta-name").focus();
  }

  function showChat() {
    leadView.hidden = true;
    successView.hidden = true;
    log.hidden = false;
    compose.hidden = false;
    input.focus();
    scrollLog();
  }

  function leadError(msg) {
    var err = document.getElementById("ta-lead-err");
    err.textContent = msg;
    err.hidden = false;
  }

  function submitLead() {
    var name = document.getElementById("ta-name").value.trim();
    var email = document.getElementById("ta-email").value.trim().toLowerCase();
    var message = document.getElementById("ta-msg").value.trim();
    var quote = document.getElementById("ta-quote").checked;
    var consent = document.getElementById("ta-consent").checked;
    var err = document.getElementById("ta-lead-err");

    err.hidden = true;
    if (!name) return leadError(L.leadErrName);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return leadError(L.leadErrEmail);
    if (!consent) return leadError(L.leadErrConsent);
    if (!message && !transcript.length) return leadError(L.leadErrMsg);

    var btn = document.getElementById("ta-lead-send");
    btn.disabled = true;

    fetch(API + "/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        page: location.href,
        quote_requested: quote,
        consent: consent,
        consent_at: new Date().toISOString(),
        transcript: transcript.slice(-20),
      }),
    })
      .then(function (res) {
        btn.disabled = false;
        if (res.status === 429) return leadError(L.leadRate);
        if (res.status === 400) return leadError(L.leadErrEmail);
        if (!res.ok) return leadError(L.leadFail);
        leadView.hidden = true;
        successView.hidden = false;
      })
      .catch(function () {
        btn.disabled = false;
        leadError(L.leadFail);
      });
  }

  function init() {
    document.body.insertAdjacentHTML("beforeend", HTML);
    launcher = document.getElementById("ta-launcher");
    panel = document.getElementById("ta-panel");
    log = document.getElementById("ta-log");
    input = document.getElementById("ta-input");
    sendBtn = document.getElementById("ta-send");
    compose = document.getElementById("ta-compose");
    leadView = document.getElementById("ta-lead");
    successView = document.getElementById("ta-success");

    launcher.addEventListener("click", function () {
      if (panel.hidden) openPanel();
      else closePanel();
    });
    document.getElementById("ta-close").addEventListener("click", closePanel);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) closePanel();
    });

    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
    input.addEventListener("input", autoSize);

    document.getElementById("ta-lead-open").addEventListener("click", showLead);
    document.getElementById("ta-lead-back").addEventListener("click", showChat);
    document.getElementById("ta-ok-back").addEventListener("click", showChat);
    document.getElementById("ta-lead-send").addEventListener("click", submitLead);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
