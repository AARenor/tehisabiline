/* ====================================================
   Tehisabiline V3 — Interactions Engine
   Scroll reveal, counters, chat demo, price bars,
   form handling, sticky CTA, magnetic buttons
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- 1. Scroll Reveal (IntersectionObserver) ---- */
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ---- 2. Navbar Scroll State ---- */
    const navbar = document.getElementById('navbar');

    const handleNavbar = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    handleNavbar();
    window.addEventListener('scroll', handleNavbar, { passive: true });

    /* ---- 3. Mobile Nav Toggle ---- */
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navToggle && mobileMenu) {
        let menuOpen = false;

        navToggle.addEventListener('click', () => {
            menuOpen = !menuOpen;
            navToggle.setAttribute('aria-expanded', String(menuOpen));
            navToggle.setAttribute('aria-label', menuOpen ? 'Sulge menüü' : 'Ava menüü');
            if (menuOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
                navToggle.querySelector('.material-symbols-outlined').textContent = 'close';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                navToggle.querySelector('.material-symbols-outlined').textContent = 'menu';
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Ava menüü');
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                navToggle.querySelector('.material-symbols-outlined').textContent = 'menu';
            });
        });
    }

    /* ---- 4. Smooth Scroll with Offset ---- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight + 20 : 90;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    });

    /* ---- 5. Animated Counters ---- */
    const counters = document.querySelectorAll('[data-count]');

    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const target = Number(el.dataset.count || 0);
                const duration = 1200;
                const startTime = performance.now();

                const tick = (currentTime) => {
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = Math.round(target * eased);
                    el.textContent = String(value);

                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = String(target);
                    }
                };

                if (prefersReducedMotion) {
                    el.textContent = String(target);
                } else {
                    requestAnimationFrame(tick);
                }

                observer.unobserve(el);
            });
        }, { threshold: 0.7 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    /* ---- 6. Price Bars Animation ---- */
    const priceBars = document.querySelectorAll('.price-bar');

    if (priceBars.length) {
        const barsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                priceBars.forEach((bar, i) => {
                    setTimeout(() => {
                        bar.classList.add('animate');
                    }, i * 100);
                });

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        const barsContainer = document.getElementById('price-bars');
        if (barsContainer) barsObserver.observe(barsContainer);
    }

    /* ---- 7. Chat Demo Typing Animation ---- */
    const typingIndicator = document.getElementById('typing-indicator');

    if (typingIndicator && !prefersReducedMotion) {
        const chatDemo = document.getElementById('chat-demo');

        const chatObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                setTimeout(() => {
                    typingIndicator.style.transition = 'opacity 0.5s ease';
                    typingIndicator.style.opacity = '1';

                    setTimeout(() => {
                        typingIndicator.style.opacity = '0';
                    }, 3000);
                }, 1500);

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        if (chatDemo) chatObserver.observe(chatDemo);
    }

    /* ---- 8. Sticky CTA ---- */
    const stickyCta = document.getElementById('sticky-cta');
    const contactSection = document.getElementById('contact');

    if (stickyCta && contactSection) {
        const updateStickyCta = () => {
            const scrollTrigger = window.scrollY > window.innerHeight * 0.6;
            const contactTop = contactSection.getBoundingClientRect().top;
            const isContactVisible = contactTop < window.innerHeight * 0.75;

            if (scrollTrigger && !isContactVisible) {
                stickyCta.classList.add('visible');
                stickyCta.style.display = '';
            } else {
                stickyCta.classList.remove('visible');
            }
        };

        updateStickyCta();
        window.addEventListener('scroll', updateStickyCta, { passive: true });
    }

    /* ---- 9. Magnetic Buttons ---- */
    const magneticButtons = document.querySelectorAll('.magnetic');

    if (!prefersReducedMotion) {
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px) scale(1.01)`;
            });

            btn.addEventListener('mouseleave', function () {
                this.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
    }

    /* ---- 10. Contact Form with n8n Webhook ---- */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const successEl = document.getElementById('form-success');
            const errorEl = document.getElementById('form-error');

            // Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saadan...';
            submitBtn.style.opacity = '0.7';

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company').value || '',
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            try {
                const WEBHOOK_URL = 'https://n8n.arleserver.cfd/webhook/1e82c9b9-6dd7-4d57-b2b7-e0187587e8eb';

                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Server error');

                contactForm.reset();
                if (successEl) {
                    successEl.classList.remove('hidden');
                    setTimeout(() => successEl.classList.add('hidden'), 5000);
                }

            } catch (error) {
                console.error('Viga sõnumi saatmisel:', error);
                if (errorEl) {
                    errorEl.classList.remove('hidden');
                    setTimeout(() => errorEl.classList.add('hidden'), 5000);
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
            }
        });
    }
});
