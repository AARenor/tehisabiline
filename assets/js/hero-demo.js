// Homepage hero demo: the question is sent, the cloud AI refuses, Tehisabiline answers and the
// findings land, once. Every step is visible without this script; with reduced motion it only
// replays on request (opacity only, see site.css). The send button replays the sequence.
document.addEventListener("DOMContentLoaded", () => {
    const demo = document.getElementById("demo");
    if (!demo) return;

    const send = demo.querySelector(".demo__send");
    const step = (name) => demo.querySelector(`[data-step="${name}"]`);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timers = [];

    const at = (ms, fn) => timers.push(window.setTimeout(fn, ms));
    const show = (name) => step(name)?.classList.add("is-on");
    const answer = (name, typingMs) => {
        const bubble = step(name);
        if (!bubble) return;
        bubble.classList.add("is-on", "is-typing");
        at(typingMs, () => bubble.classList.remove("is-typing"));
    };

    function play() {
        timers.forEach(window.clearTimeout);
        timers = [];
        demo.querySelectorAll("[data-step]").forEach((el) => el.classList.remove("is-on", "is-typing"));
        demo.classList.add("is-live", "is-armed");
        send?.classList.add("is-pressed");
        at(180, () => send?.classList.remove("is-pressed"));
        at(450, () => answer("cloud", 650));
        at(1350, () => answer("ours", 800));
        at(2350, () => show("f1"));
        at(2600, () => show("f2"));
        at(2850, () => show("f3"));
        at(3250, () => show("check"));
        // Settle into the same DOM state a visitor without JavaScript gets.
        at(4100, () => demo.classList.remove("is-armed"));
    }

    send?.addEventListener("click", play);

    if (reduceMotion.matches) return;
    // In view at load (the usual case): start now, before the fallback reveal can show the end state.
    const inView = demo.getBoundingClientRect().top < window.innerHeight * 0.9;
    if (inView || !("IntersectionObserver" in window)) {
        play();
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        play();
    }, { threshold: 0.35 });
    observer.observe(demo);
});
