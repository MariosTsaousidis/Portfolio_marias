/* ==========================================
   PORTFOLIO — Maria
   ========================================== */

document.addEventListener('DOMContentLoaded', initLoader);

/* ==========================================
   LOADER
   ========================================== */
function initLoader() {
    const loader    = document.getElementById('loader');
    const name      = loader.querySelector('.loader-name');
    const tagline   = loader.querySelector('.loader-tagline');
    const barFill   = document.getElementById('loaderBar');
    const lineLeft  = loader.querySelector('.loader-line-left');
    const lineRight = loader.querySelector('.loader-line-right');

    // Animate lines
    setTimeout(() => {
        lineLeft.style.transition  = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
        lineRight.style.transition = 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
        lineLeft.style.transform   = 'scaleX(1)';
        lineRight.style.transform  = 'scaleX(1)';
    }, 80);

    // Animate name reveal
    setTimeout(() => {
        name.style.transition  = 'clip-path 1s cubic-bezier(0.25,0.46,0.45,0.94)';
        name.style.clipPath    = 'inset(0 0% 0 0)';
    }, 300);

    setTimeout(() => {
        tagline.style.transition = 'opacity 0.6s';
        tagline.style.opacity    = '1';
    }, 800);

    // Progress bar
    let pct = 0;
    const prog = setInterval(() => {
        pct += Math.random() * 18;
        if (pct >= 100) { pct = 100; clearInterval(prog); }
        barFill.style.transition = 'width 0.08s linear';
        barFill.style.width = pct + '%';
        if (pct === 100) completeLoader();
    }, 90);

    function completeLoader() {
        setTimeout(() => {
            loader.style.transition = 'transform 0.85s cubic-bezier(0.77,0,0.175,1)';
            loader.style.transform  = 'translateY(-100%)';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.remove('loading');
                initAll();
            }, 860);
        }, 400);
    }
}

/* ==========================================
   INIT ALL
   ========================================== */
function initAll() {
    gsap.registerPlugin(ScrollTrigger);

    initParticles();
    initCursor();
    initNav();
    initScrollProgress();
    initHeroAnimations();
    initTypewriter();
    initCounters();
    initScrollAnimations();
    initWorkFilter();
    initMagneticButtons();
    initContactForm();
    initSmoothScroll();
}

/* ==========================================
   PARTICLES
   ========================================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const COUNT    = 90;
    const CONNECT  = 130;
    const particles = [];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x     = Math.random() * W;
            this.y     = Math.random() * H;
            this.vx    = (Math.random() - 0.5) * 0.38;
            this.vy    = (Math.random() - 0.5) * 0.38;
            this.size  = Math.random() * 1.8 + 0.4;
            this.isYellow = Math.random() > 0.45;
            this.alpha = Math.random() * 0.55 + 0.15;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -5 || this.x > W + 5 || this.y < -5 || this.y > H + 5) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.isYellow ? '#F7C948' : '#FF4D8D';
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function connect() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT) {
                    const a = (1 - dist / CONNECT) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(247,201,72,${a})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
}

/* ==========================================
   CUSTOM CURSOR
   ========================================== */
function initCursor() {
    const cursor    = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursorDot, {
            x: mouseX - 2.5, y: mouseY - 2.5,
            duration: 0.06, ease: 'none'
        });
    });

    (function loop() {
        cx += (mouseX - cx - 19) * 0.1;
        cy += (mouseY - cy - 19) * 0.1;
        cursor.style.transform = `translate(${cx}px,${cy}px)`;
        requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .filter-btn, .skill-tag, .tag').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursor.classList.remove('hover-pink'); });
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    document.querySelectorAll('.work-card').forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover-pink'); cursor.classList.remove('hover'); });
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover-pink'));
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity='0'; cursorDot.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity='1'; cursorDot.style.opacity='1'; });
}

/* ==========================================
   SCROLL PROGRESS BAR
   ========================================== */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = pct + '%';
    });
}

/* ==========================================
   NAVIGATION
   ========================================== */
function initNav() {
    const navbar     = document.getElementById('navbar');
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const sections   = document.querySelectorAll('section[id]');
    const navLinks   = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.45 });

    sections.forEach(s => obs.observe(s));
}

/* ==========================================
   HERO ANIMATIONS
   ========================================== */
function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.15 });

    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to('.hero-title', { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.out' }, '-=0.3')
      .to('.hero-title-outline', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.6')
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
      .to('.hero-description', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to('.hero-stats', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to('.hero-scroll', { opacity: 1, duration: 0.5 }, '-=0.2')
      .to('.hero-social', { opacity: 1, duration: 0.5 }, '-=0.5');

    // Parallax on shapes
    gsap.to('.shape-1', {
        scrollTrigger: { trigger: '#hero', scrub: 1 },
        y: 260, ease: 'none'
    });
    gsap.to('.shape-2', {
        scrollTrigger: { trigger: '#hero', scrub: 1 },
        y: -120, ease: 'none'
    });
}

/* ==========================================
   TYPEWRITER
   ========================================== */
function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Graphic Designer',
        'Motion Designer',
        'Brand Creator',
        '3D Animator',
        'Visual Storyteller',
        'Art Director'
    ];

    let pi = 0, ci = 0, deleting = false, speed = 110;

    function type() {
        const phrase = phrases[pi];

        if (deleting) {
            el.textContent = phrase.substring(0, ci - 1);
            ci--;
            speed = 55;
        } else {
            el.textContent = phrase.substring(0, ci + 1);
            ci++;
            speed = 110;
        }

        if (!deleting && ci === phrase.length)   { deleting = true; speed = 2200; }
        else if (deleting && ci === 0)           { deleting = false; pi = (pi + 1) % phrases.length; speed = 320; }

        setTimeout(type, speed);
    }

    setTimeout(type, 1600);
}

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
function initCounters() {
    document.querySelectorAll('.stat-num[data-count]').forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                const target = parseInt(counter.getAttribute('data-count'));
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 1.8,
                    snap: { innerHTML: 1 },
                    ease: 'power2.out'
                });
            }
        });
    });
}

/* ==========================================
   SCROLL ANIMATIONS
   ========================================== */
function initScrollAnimations() {
    // About image
    gsap.from('.about-image-wrap', {
        scrollTrigger: { trigger: '#about', start: 'top 78%' },
        opacity: 0, x: -70, duration: 1, ease: 'power3.out'
    });

    // About content
    gsap.from('.about-content', {
        scrollTrigger: { trigger: '#about', start: 'top 78%' },
        opacity: 0, x: 70, duration: 1, ease: 'power3.out', delay: 0.15
    });

    // About exp badge
    gsap.from('.about-exp-badge', {
        scrollTrigger: { trigger: '#about', start: 'top 70%' },
        opacity: 0, scale: 0.6, duration: 0.8, ease: 'back.out(1.7)', delay: 0.4
    });

    // Work cards
    document.querySelectorAll('.work-card').forEach((card, i) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1, y: 0,
                    duration: 0.7,
                    delay: (i % 3) * 0.1,
                    ease: 'power3.out'
                });
            }
        });
    });

    // Skill bars
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const w = bar.getAttribute('data-width');
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 88%',
            once: true,
            onEnter: () => gsap.to(bar, { width: w + '%', duration: 1.4, ease: 'power3.out' })
        });
    });

    // Skill tags stagger
    document.querySelectorAll('.skill-tag').forEach((tag, i) => {
        ScrollTrigger.create({
            trigger: tag,
            start: 'top 92%',
            once: true,
            onEnter: () => gsap.to(tag, {
                opacity: 1, y: 0,
                duration: 0.5,
                delay: i * 0.06,
                ease: 'back.out(1.4)'
            })
        });
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 88%',
            once: true,
            onEnter: () => gsap.to(item, {
                opacity: 1, y: 0,
                duration: 0.65,
                delay: i * 0.08,
                ease: 'power3.out'
            })
        });
    });

    // CV download box
    gsap.from('.cv-download', {
        scrollTrigger: { trigger: '.cv-download', start: 'top 85%' },
        opacity: 0, y: 44, duration: 0.8, ease: 'power3.out'
    });

    // Contact info
    gsap.from('.contact-info', {
        scrollTrigger: { trigger: '#contact', start: 'top 80%' },
        opacity: 0, x: -60, duration: 0.9, ease: 'power3.out'
    });

    gsap.from('.contact-form-wrap', {
        scrollTrigger: { trigger: '#contact', start: 'top 80%' },
        opacity: 0, x: 60, duration: 0.9, ease: 'power3.out', delay: 0.15
    });

    // Section titles reveal
    document.querySelectorAll('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: 'top 88%' },
            opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
        });
    });
}

/* ==========================================
   WORK FILTER
   ========================================== */
function initWorkFilter() {
    const btns  = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.work-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cat = card.getAttribute('data-category');
                const show = filter === 'all' || cat === filter;

                if (show) {
                    card.classList.remove('hidden');
                    gsap.to(card, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
                } else {
                    gsap.to(card, {
                        opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.in',
                        onComplete: () => card.classList.add('hidden')
                    });
                }
            });
        });
    });
}

/* ==========================================
   MAGNETIC BUTTONS
   ========================================== */
function initMagneticButtons() {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width  / 2;
            const y = e.clientY - r.top  - r.height / 2;
            gsap.to(btn, { x: x * 0.28, y: y * 0.28, duration: 0.35, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
        });
    });
}

/* ==========================================
   CONTACT FORM
   ========================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn  = form.querySelector('.form-submit');
        const span = btn.querySelector('span');
        const orig = span.textContent;

        span.textContent = 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.75';

        setTimeout(() => {
            span.textContent = 'Sent ✓';
            btn.style.background   = '#4ade80';
            btn.style.opacity      = '1';
            btn.style.color        = '#000';
            btn.style.borderColor  = '#4ade80';

            setTimeout(() => {
                span.textContent         = orig;
                btn.style.background     = '';
                btn.style.color          = '';
                btn.style.borderColor    = '';
                btn.disabled             = false;
                form.reset();
            }, 3200);
        }, 1600);
    });
}

/* ==========================================
   SMOOTH SCROLL
   ========================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}
