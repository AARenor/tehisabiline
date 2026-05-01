/* ====================================================
   Tehisabiline V3 — Hero Animated "Neural Flow"
   AI/Future aesthetic: neural network nodes & connections,
   flowing data streams, geometric pulse rings,
   deep blue atmosphere on light base
   ==================================================== */

(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0, height = 0;
    let animationId = null;
    let time = 0;

    /* --- Neural Node --- */
    class Node {
        constructor() {
            this.x = Math.random();
            this.y = Math.random();
            this.vx = (Math.random() - 0.5) * 0.0008;
            this.vy = (Math.random() - 0.5) * 0.0008;
            this.radius = 2 + Math.random() * 3;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.5 + Math.random() * 1.5;
            this.baseOpacity = 0.4 + Math.random() * 0.4;
        }
        update(dt) {
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            // Bounce off edges
            if (this.x < 0.02 || this.x > 0.98) this.vx *= -1;
            if (this.y < 0.02 || this.y > 0.98) this.vy *= -1;
            this.x = Math.max(0.02, Math.min(0.98, this.x));
            this.y = Math.max(0.02, Math.min(0.98, this.y));
        }
        draw(ctx, w, h, t) {
            const pulse = 0.6 + 0.4 * Math.sin(t * this.pulseSpeed + this.pulsePhase);
            const alpha = this.baseOpacity * pulse;
            const px = this.x * w;
            const py = this.y * h;

            // Glow
            ctx.save();
            ctx.globalAlpha = alpha * 0.3;
            const glow = ctx.createRadialGradient(px, py, 0, px, py, this.radius * 6);
            glow.addColorStop(0, '#00aeef');
            glow.addColorStop(1, 'rgba(0, 174, 239, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(px, py, this.radius * 6, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#00658d';
            ctx.beginPath();
            ctx.arc(px, py, this.radius * pulse, 0, Math.PI * 2);
            ctx.fill();

            // Bright center
            ctx.globalAlpha = alpha * 0.8;
            ctx.fillStyle = '#00aeef';
            ctx.beginPath();
            ctx.arc(px, py, this.radius * 0.5 * pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    /* --- Pulse Ring --- */
    class PulseRing {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = 0.1 + Math.random() * 0.8;
            this.y = 0.1 + Math.random() * 0.8;
            this.radius = 0;
            this.maxRadius = 80 + Math.random() * 120;
            this.speed = 30 + Math.random() * 40;
            this.opacity = 0.3 + Math.random() * 0.2;
            this.lineWidth = 1 + Math.random() * 1.5;
        }
        update(dt) {
            this.radius += this.speed * (dt / 60);
            if (this.radius > this.maxRadius) {
                this.reset();
            }
        }
        draw(ctx, w, h) {
            const progress = this.radius / this.maxRadius;
            const alpha = this.opacity * (1 - progress);
            if (alpha <= 0.01) return;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#00aeef';
            ctx.lineWidth = this.lineWidth * (1 - progress * 0.5);
            ctx.beginPath();
            ctx.arc(this.x * w, this.y * h, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    /* --- Data Stream (flowing line of light) --- */
    class DataStream {
        constructor(index) {
            this.index = index;
            this.reset();
        }
        reset() {
            // Start from left or right edge
            this.fromLeft = Math.random() > 0.5;
            this.x = this.fromLeft ? -0.05 : 1.05;
            this.y = 0.1 + Math.random() * 0.8;
            this.speed = (0.002 + Math.random() * 0.004) * (this.fromLeft ? 1 : -1);
            this.length = 0.05 + Math.random() * 0.15;
            this.opacity = 0.08 + Math.random() * 0.12;
            this.curveAmp = (Math.random() - 0.5) * 0.08;
            this.curveFreq = 0.01 + Math.random() * 0.02;
            this.yBase = this.y;
        }
        update(dt) {
            this.x += this.speed * dt;
            if (this.fromLeft && this.x > 1.2) this.reset();
            if (!this.fromLeft && this.x < -0.2) this.reset();
        }
        draw(ctx, w, h, t) {
            ctx.save();

            const startX = this.x * w;
            const endX = (this.x - this.length * (this.fromLeft ? 1 : -1)) * w;

            // Curved path
            const points = [];
            const steps = 20;
            for (let i = 0; i <= steps; i++) {
                const frac = i / steps;
                const px = startX + (endX - startX) * frac;
                const py = this.yBase * h + Math.sin(px * this.curveFreq + t * 0.5) * this.curveAmp * h;
                points.push({ x: px, y: py });
            }

            // Gradient along stream
            const grad = ctx.createLinearGradient(startX, 0, endX, 0);
            grad.addColorStop(0, `rgba(0, 101, 141, 0)`);
            grad.addColorStop(0.3, `rgba(0, 174, 239, ${this.opacity})`);
            grad.addColorStop(0.7, `rgba(0, 174, 239, ${this.opacity * 0.6})`);
            grad.addColorStop(1, `rgba(0, 101, 141, 0)`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            ctx.restore();
        }
    }

    /* --- Gradient Blob (atmospheric) --- */
    class AtmoBlob {
        constructor(index) {
            const colors = [
                { r: 0, g: 101, b: 141 },
                { r: 0, g: 140, b: 210 },
                { r: 0, g: 174, b: 239 },
                { r: 19, g: 80, b: 140 },
            ];
            this.color = colors[index % colors.length];
            this.x = 0.15 + Math.random() * 0.7;
            this.y = 0.15 + Math.random() * 0.7;
            this.baseRadius = 0.25 + Math.random() * 0.3;
            this.freqX = 0.08 + Math.random() * 0.15;
            this.freqY = 0.06 + Math.random() * 0.12;
            this.ampX = 0.04 + Math.random() * 0.08;
            this.ampY = 0.03 + Math.random() * 0.06;
            this.phaseX = Math.random() * Math.PI * 2;
            this.phaseY = Math.random() * Math.PI * 2;
            this.opacity = 0.06 + Math.random() * 0.06;
        }
        draw(ctx, w, h, t) {
            const px = (this.x + Math.sin(t * this.freqX + this.phaseX) * this.ampX) * w;
            const py = (this.y + Math.cos(t * this.freqY + this.phaseY) * this.ampY) * h;
            const radius = Math.max(50, this.baseRadius * Math.min(w, h));

            if (!isFinite(px) || !isFinite(py) || !isFinite(radius)) return;

            const { r, g, b } = this.color;
            const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
            grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
            grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.5})`);
            grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.15})`);
            grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /* --- Sparkle Particle --- */
    class Sparkle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random();
            this.y = Math.random();
            this.size = 1 + Math.random() * 2;
            this.life = 0;
            this.maxLife = 120 + Math.random() * 200;
            this.speed = 0.2 + Math.random() * 0.5;
            this.opacity = 0;
            this.twinkleSpeed = 2 + Math.random() * 3;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }
        update(dt) {
            this.life += dt;
            if (this.life > this.maxLife) this.reset();
            // Fade in, sustain, fade out
            const progress = this.life / this.maxLife;
            if (progress < 0.15) this.opacity = progress / 0.15;
            else if (progress > 0.75) this.opacity = (1 - progress) / 0.25;
            else this.opacity = 1;
        }
        draw(ctx, w, h, t) {
            if (this.opacity <= 0.01) return;
            const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * this.twinkleSpeed + this.twinklePhase));
            const alpha = this.opacity * twinkle * 0.7;
            const px = this.x * w;
            const py = this.y * h;

            // Cross sparkle shape
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#00aeef';
            ctx.lineWidth = 0.8;
            const s = this.size;

            ctx.beginPath();
            ctx.moveTo(px - s * 2, py);
            ctx.lineTo(px + s * 2, py);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(px, py - s * 2);
            ctx.lineTo(px, py + s * 2);
            ctx.stroke();

            // Center dot
            ctx.globalAlpha = alpha * 0.9;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(px, py, s * 0.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    const NODE_COUNT = 30;
    const RING_COUNT = 4;
    const STREAM_COUNT = 8;
    const BLOB_COUNT = 5;
    const SPARKLE_COUNT = 25;
    const CONNECTION_DIST = 0.18; // fraction of min dimension

    let nodes = [];
    let rings = [];
    let streams = [];
    let blobs = [];
    let sparkles = [];

    /* --- Mouse tracking for parallax glow --- */
    let mouseX = 0.5, mouseY = 0.5;
    let targetMouseX = 0.5, targetMouseY = 0.5;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX / window.innerWidth;
        targetMouseY = e.clientY / window.innerHeight;
    }, { passive: true });

    function init() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push(new Node());
        }
        rings = [];
        for (let i = 0; i < RING_COUNT; i++) {
            const r = new PulseRing();
            r.radius = Math.random() * r.maxRadius; // Stagger start
            rings.push(r);
        }
        streams = [];
        for (let i = 0; i < STREAM_COUNT; i++) {
            const s = new DataStream(i);
            s.x = Math.random(); // Start at random positions
            streams.push(s);
        }
        blobs = [];
        for (let i = 0; i < BLOB_COUNT; i++) {
            blobs.push(new AtmoBlob(i));
        }
        sparkles = [];
        for (let i = 0; i < SPARKLE_COUNT; i++) {
            const s = new Sparkle();
            s.life = Math.random() * s.maxLife; // Stagger start
            sparkles.push(s);
        }
    }

    function resize() {
        if (!canvas.parentElement) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.parentElement.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* --- Drawing --- */

    function drawConnections(t) {
        const minDim = Math.min(width, height);
        const maxDist = CONNECTION_DIST * minDim;

        ctx.save();
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const ax = nodes[i].x * width;
                const ay = nodes[i].y * height;
                const bx = nodes[j].x * width;
                const by = nodes[j].y * height;
                const dist = Math.hypot(ax - bx, ay - by);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.15;
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = '#00658d';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    }

    function drawDataStreams(t, dt) {
        for (const stream of streams) {
            stream.update(dt);
            stream.draw(ctx, width, height, t);
        }
    }

    function drawPulseRings(dt) {
        for (const ring of rings) {
            ring.update(dt);
            ring.draw(ctx, width, height);
        }
    }

    function drawNodes(t, dt) {
        for (const node of nodes) {
            node.update(dt);
            node.draw(ctx, width, height, t);
        }
    }

    function drawAtmoBlobs(t) {
        for (const blob of blobs) {
            blob.draw(ctx, width, height, t);
        }
    }

    function drawBlueWash() {
        // Subtle blue gradient wash from bottom-left to top-right
        const grad = ctx.createLinearGradient(0, height, width, 0);
        grad.addColorStop(0, 'rgba(0, 30, 60, 0.03)');
        grad.addColorStop(0.3, 'rgba(0, 60, 110, 0.02)');
        grad.addColorStop(0.7, 'rgba(0, 100, 170, 0.02)');
        grad.addColorStop(1, 'rgba(0, 30, 60, 0.03)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }

    function drawHexGrid(t) {
        // Faint hexagonal grid pattern — futuristic vibe
        ctx.save();
        const hexSize = 40;
        const hexH = hexSize * Math.sqrt(3);
        const cols = Math.ceil(width / (hexSize * 1.5)) + 2;
        const rows = Math.ceil(height / hexH) + 2;

        ctx.strokeStyle = '#00658d';
        ctx.lineWidth = 0.3;

        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
                const cx = col * hexSize * 1.5;
                const cy = row * hexH + (col % 2 ? hexH / 2 : 0);

                // Distance from center for fade
                const dx = cx / width - 0.5;
                const dy = cy / height - 0.5;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const alpha = Math.max(0, 0.04 - dist * 0.06);

                if (alpha < 0.005) continue;

                // Animate subtle position shift
                const shift = Math.sin(t * 0.15 + cx * 0.01 + cy * 0.01) * 2;

                ctx.globalAlpha = alpha;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 6;
                    const hx = cx + hexSize * Math.cos(angle) + shift;
                    const hy = cy + hexSize * Math.sin(angle) + shift;
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    function drawMouseGlow(t) {
        // Smooth mouse tracking
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        const px = mouseX * width;
        const py = mouseY * height;
        const radius = Math.max(100, Math.min(width, height) * 0.25);

        ctx.save();
        const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
        grad.addColorStop(0, 'rgba(0, 174, 239, 0.06)');
        grad.addColorStop(0.3, 'rgba(0, 101, 141, 0.04)');
        grad.addColorStop(0.7, 'rgba(0, 101, 141, 0.01)');
        grad.addColorStop(1, 'rgba(0, 30, 45, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawSparkles(t, dt) {
        for (const sparkle of sparkles) {
            sparkle.update(dt);
            sparkle.draw(ctx, width, height, t);
        }
    }

    function draw(t) {
        if (width < 1 || height < 1) return;

        // White base
        ctx.fillStyle = '#f8fafb';
        ctx.fillRect(0, 0, width, height);

        // Blue wash atmosphere
        drawBlueWash();

        // Atmospheric gradient blobs
        drawAtmoBlobs(t);

        // Mouse-follow glow
        drawMouseGlow(t);

        // Hex grid
        drawHexGrid(t);

        // Neural connections
        drawConnections(t);

        // Data streams
        const dt = 1;
        drawDataStreams(t, dt);

        // Sparkle particles
        drawSparkles(t, dt);

        // Pulse rings
        drawPulseRings(dt);

        // Neural nodes
        drawNodes(t, dt);
    }

    function animate(timestamp) {
        time = (timestamp || 0) / 1000;
        draw(time);
        animationId = requestAnimationFrame(animate);
    }

    /* --- Intersection Observer: pause when not visible --- */
    let isVisible = true;
    const heroEl = document.getElementById('hero');

    if (heroEl && !prefersReducedMotion) {
        const visObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    if (!animationId) animate();
                } else {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        }, { threshold: 0.05 });
        visObserver.observe(heroEl);
    }

    /* --- Initialize --- */
    function start() {
        init();
        resize();
        if (prefersReducedMotion) {
            draw(2);
        } else {
            animate();
        }
    }

    /* --- Resize --- */
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            if (prefersReducedMotion) draw(time);
        }, 150);
    }, { passive: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
