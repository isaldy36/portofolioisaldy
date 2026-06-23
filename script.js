/**
 * ============================================================
 *  SCRIPT — Portfolio Isal + Recruiter Mode
 *  Fitur: loader, navigasi, spotlight, particles, typing,
 *  counter, skill bar, scroll reveal, recruiter modal.
 * ============================================================
 */

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================================
    // 1. LOADER
    // ============================================================
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 2400);
        });
    }

    // ============================================================
    // 2. NAVIGASI
    // ============================================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', open);
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('.section');
    const navAnchors = document.querySelectorAll('.nav-links a');
    let activeId = 'hero';

    const updateActiveLink = () => {
        let current = 'hero';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150) current = section.id;
        });
        if (current !== activeId) {
            activeId = current;
            navAnchors.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + current);
            });
        }
    };
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ============================================================
    // 3. BACKGROUND DINAMIS
    // ============================================================
    const bgMap = {};
    sections.forEach(s => {
        const bg = s.dataset.bg;
        if (bg) bgMap[s.id] = bg;
    });
    const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bg = bgMap[entry.target.id];
                if (bg) document.body.style.background = bg;
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => bgObserver.observe(s));

    // ============================================================
    // 4. SPOTLIGHT
    // ============================================================
    const spotlight = document.getElementById('spotlight');
    if (spotlight && !reduceMotion) {
        let rafId = 0;
        let tx = 50,
            ty = 20;
        const update = () => {
            rafId = 0;
            document.documentElement.style.setProperty('--spot-x', tx + '%');
            document.documentElement.style.setProperty('--spot-y', ty + '%');
            spotlight.style.opacity = '1';
        };
        window.addEventListener('pointermove', (e) => {
            tx = (e.clientX / window.innerWidth) * 100;
            ty = (e.clientY / window.innerHeight) * 100 * 0.7;
            if (!rafId) rafId = requestAnimationFrame(update);
        });
        window.addEventListener('pointerleave', () => { spotlight.style.opacity = '0'; });
    }

    // ============================================================
    // 5. PARTICLES
    // ============================================================
    const canvas = document.getElementById('particles');
    if (canvas && !reduceMotion) {
        const ctx = canvas.getContext('2d');
        let w, h, particles = [];
        const dpr = Math.min(2, window.devicePixelRatio || 1);

        const resize = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.max(20, Math.min(60, Math.floor((w * h) / 35000)));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: 1 + Math.random() * 2,
                a: 0.3 + Math.random() * 0.4,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(7,11,20,0.06)';
            ctx.fillRect(0, 0, w, h);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -20) p.x = w + 20;
                if (p.x > w + 20) p.x = -20;
                if (p.y < -20) p.y = h + 20;
                if (p.y > h + 20) p.y = -20;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99,102,241,${p.a})`;
                ctx.fill();
            }
            const maxD = 120;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < maxD * maxD) {
                        const d = Math.sqrt(d2);
                        const alpha = (1 - d / maxD) * 0.12;
                        ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize, { passive: true });
        resize();
        draw();
    }

    // ============================================================
    // 6. TYPING EFFECT
    // ============================================================
    const typingEl = document.getElementById('roleTyping');
    if (typingEl && !reduceMotion) {
        const roles = ['Audio Video Engineer', 'Web Developer', 'Electronics Enthusiast'];
        let i = 0,
            j = 0,
            deleting = false;
        const speed = 55,
            deleteSpeed = 25,
            pause = 1100;

        const type = () => {
            const current = roles[i];
            if (!deleting) {
                j++;
                typingEl.textContent = current.slice(0, j);
                if (j === current.length) { deleting = true;
                    setTimeout(type, pause); return; }
                setTimeout(type, speed);
            } else {
                j--;
                typingEl.textContent = current.slice(0, Math.max(0, j));
                if (j === 0) { deleting = false;
                    i = (i + 1) % roles.length;
                    setTimeout(type, 300); return; }
                setTimeout(type, deleteSpeed);
            }
        };
        type();
    }

    // ============================================================
    // 7. COUNTER
    // ============================================================
    const counters = document.querySelectorAll('.stat-number[data-target]');
    let counterRun = false;

    const runCounters = () => {
        counters.forEach(c => {
            const target = parseInt(c.dataset.target, 10);
            if (isNaN(target)) return;
            let cur = 0;
            const step = Math.ceil(target / 55);
            const update = () => {
                cur += step;
                if (cur >= target) { c.textContent = target; return; }
                c.textContent = cur;
                requestAnimationFrame(update);
            };
            update();
        });
    };

    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !counterRun) { counterRun = true;
                runCounters(); }
        });
    }, { threshold: 0.3 });
    const statsContainer = document.querySelector('.about-stats');
    if (statsContainer) counterObs.observe(statsContainer);

    // ============================================================
    // 8. SKILL BAR ANIMASI (hover)
    // ============================================================
    document.querySelectorAll('.skill-card').forEach(card => {
        const fill = card.querySelector('.skill-fill');
        if (fill) {
            const w = fill.style.width;
            fill.style.width = '0%';
            card.addEventListener('mouseenter', () => { fill.style.width = w; });
            card.addEventListener('mouseleave', () => { fill.style.width = '0%'; });
        }
    });

    // ============================================================
    // 9. SCROLL REVEAL (fade-up)
    // ============================================================
    const revealItems = document.querySelectorAll(
        '.about-card, .skill-card, .project-card, .contact-btn'
    );
    if (!reduceMotion) {
        const revObs = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = (idx % 6) * 60;
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(24px)';
                    el.style.transition =
                        `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
                    requestAnimationFrame(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                    revObs.unobserve(el);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(el => revObs.observe(el));
    } else {
        revealItems.forEach(el => { el.style.opacity = '1';
            el.style.transform = 'none'; });
    }

    // ============================================================
    // 10. RECRUITER MODE
    // ============================================================
    const recruiterBtn = document.getElementById('recruiterBtn');
    const recruiterModal = document.getElementById('recruiterModal');
    const recruiterOverlay = document.getElementById('recruiterOverlay');
    const recruiterClose = document.getElementById('recruiterClose');
    const recruiterContact = document.getElementById('recruiterContact');

    const openRecruiter = () => {
        recruiterModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        // Focus trap inside modal
        setTimeout(() => {
            const firstFocus = recruiterModal.querySelector('a, button');
            if (firstFocus) firstFocus.focus();
        }, 100);
    };

    const closeRecruiter = () => {
        recruiterModal.classList.remove('is-open');
        document.body.style.overflow = '';
        recruiterBtn.focus();
    };

    if (recruiterBtn && recruiterModal) {
        recruiterBtn.addEventListener('click', openRecruiter);
        recruiterOverlay.addEventListener('click', closeRecruiter);
        recruiterClose.addEventListener('click', closeRecruiter);

        // Tombol "Hubungi Sekarang" di modal
        if (recruiterContact) {
            recruiterContact.addEventListener('click', (e) => {
                e.preventDefault();
                closeRecruiter();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && recruiterModal.classList.contains('is-open')) {
                closeRecruiter();
            }
        });

        // Focus trap inside modal
        const focusableElements = recruiterModal.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length) {
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];
            recruiterModal.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            });
        }
    }
// ============================================================
// 11. PREMIUM SLIDER PROYEK
// ============================================================
(function() {
    // --- Data Proyek ---
    const projectsData = [
        {
            id: 1,
            title: 'Bot Telegram Manajemen Keuangan',
            category: 'Bot & AI',
            description: 'Bot Telegram berbasis AI untuk mencatat dan mengelola keuangan pribadi, terintegrasi dengan Google Apps Script dan spreadsheet.',
            tech: ['Telegram Bot', 'AI', 'Google Apps Script'],
            image: 'assets/projek/Aplikasi Finance Keuangan Telegram.png',
            featured: true,
            type: 'software',
            caseStudy: {
                overview: 'Bot Telegram yang membantu pengguna mencatat pemasukan dan pengeluaran secara otomatis dengan bantuan AI.',
                problem: 'Banyak orang kesulitan mencatat keuangan secara konsisten dan terstruktur.',
                solution: 'Bot Telegram dengan fitur pencatatan lewat foto ataupun teks, diklasifikasi menggunakan AI, dan tersimpan di spreadsheet.',
                features: ['Pencatatan gambar', 'Klasifikasi AI', 'Laporan bulanan', 'Export CSV'],
                tech: ['Telegram Bot API', 'Google Apps Script', 'Natural Language Processing', 'Spreadsheet API'],
                architecture: ['User', 'Telegram Bot', 'Google Apps Script', 'Spreadsheet', 'AI Engine'],
                challenges: 'Mengintegrasikan AI dengan latency rendah dan akurasi klasifikasi yang baik.',
                results: 'Digunakan oleh beberapa pengguna dengan kepuasan 70%.',
                screenshot: 'assets/projek/Aplikasi Finance Keuangan Telegram.png'
            }
        },
        {
            id: 2,
            title: 'Aplikasi Rental Manager',
            category: 'AppSheet',
            description: 'Sistem manajemen rental berbasis AppSheet untuk mengelola inventaris, penyewaan, dan laporan transaksi real-time.',
            tech: ['AppSheet', 'Database', 'Mobile App'],
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            featured: false,
            type: 'software',
            caseStudy: {
                overview: 'Aplikasi manajemen rental yang memudahkan pemilik usaha menyewa peralatan.',
                problem: 'Pencatatan manual menyebabkan data hilang dan kesulitan dalam pelacakan.',
                solution: 'Aplikasi mobile berbasis AppSheet dengan database terintegrasi, real-time update.',
                features: ['Inventaris', 'Penyewaan', 'Laporan', 'Notifikasi', 'Dashboard'],
                tech: ['AppSheet', 'Cloud Database', 'Mobile App'],
                architecture: ['User', 'AppSheet App', 'Cloud Database', 'Real-time Sync'],
                challenges: 'Merancang UI yang intuitif untuk pengguna non-teknis.',
                results: 'Meningkatkan efisiensi operasional hingga 70%.',
                screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
            }
        },
        {
            id: 3,
            title: 'Audio Amplifier TDA2030',
            category: 'Elektronika',
            description: 'Merancang dan merakit amplifier audio menggunakan IC TDA2030 sebagai proyek Uji Kompetensi Keahlian.',
            tech: ['TDA2030', 'Proteus', 'PCB Design'],
            image: 'assets/projek/Hasil Power TDA 2030.jpeg',
            featured: false,
            type: 'hardware',
            caseStudy: {
                overview: 'Amplifier audio berbasis IC TDA2030 dengan output 20W dan THD rendah.',
                problem: 'Membutuhkan amplifier berkualitas dengan biaya efisien untuk proyek UKK.',
                solution: 'Merancang rangkaian PCB, memilih komponen berkualitas, dan melakukan pengujian menyeluruh.',
                components: ['IC TDA2030', 'Resistor', 'Kapasitor', 'Dioda', 'Heat sink', 'PCB'],
                workflow: ['Input Audio', 'Pre-amp', 'Power Amp TDA2030', 'Output Speaker'],
                testing: 'Pengujian dengan osiloskop dan speaker, mengukur THD dan respons frekuensi.',
                results: 'Output 20W, THD < 0.5%, respons frekuensi 20Hz-20kHz.',
                schematic: 'assets/projek/Hasil Power TDA 2030.jpeg'
            }
        },
        {
            id: 4,
            title: 'Portfolio Website Interaktif',
            category: 'Front-End',
            description: 'Website portfolio modern dengan animasi interaktif, glassmorphism, dan sistem slider premium.',
            tech: ['HTML', 'CSS', 'JavaScript'],
            image: 'assets/projek/Gambar Ngoding.jpeg',
            featured: false,
            type: 'software',
            caseStudy: {
                overview: 'Portfolio personal yang menampilkan kemampuan teknis dan desain.',
                problem: 'Membutuhkan tampilan yang profesional dan interaktif untuk menarik recruiter.',
                solution: 'Membangun website single-page dengan animasi halus, slider, dan glassmorphism.',
                features: ['Slider proyek', 'Modal studi kasus', 'Recruiter mode', 'Responsif'],
                tech: ['HTML5', 'CSS3', 'Vanilla JS', 'Intersection Observer'],
                architecture: ['User', 'Frontend', 'Animations', 'Interactions'],
                challenges: 'Mengoptimalkan performa dengan banyak animasi dan interaksi.',
                results: 'Lighthouse performance 95+, 100% responsive.',
                screenshot: 'assets/projek/Gambar Ngoding.jpeg'
            }
        }
    ];

    // --- DOM Elements ---
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const indicators = document.getElementById('sliderIndicators');
    const autoplayFill = document.getElementById('autoplayFill');

    let currentIndex = 0;
    let slidesPerView = 3;
    let totalSlides = projectsData.length;
    let isDragging = false;
    let startX = 0;
    let currentTranslateX = 0;
    let autoPlayInterval = null;
    let autoPlayTimeout = null;
    let isPaused = false;
    let autoplayProgress = 0;
    let animationFrame = null;

    // --- Render Cards ---
    function renderCards() {
        track.innerHTML = '';
        projectsData.forEach((project, idx) => {
            const slide = document.createElement('div');
            slide.className = 'project-slide' + (project.featured ? ' featured' : '');
            slide.dataset.index = idx;
            slide.style.setProperty('--rx', '0deg');
            slide.style.setProperty('--ry', '0deg');

            slide.innerHTML = `
                <div class="project-slide-thumb">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" />
                    <span class="badge">${project.category}</span>
                    ${project.featured ? '<span class="badge featured-badge">★ Featured</span>' : ''}
                    <div class="overlay-hint">Lihat Detail</div>
                </div>
                <div class="project-slide-body">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-stack">
                        ${project.tech.map(t => `<span>${t}</span>`).join('')}
                    </div>
                    <button class="case-btn" data-id="${project.id}">Lihat Studi Kasus →</button>
                </div>
            `;
            track.appendChild(slide);
        });

        // 3D tilt effect per card (hanya desktop)
        if (!('ontouchstart' in window) && !reduceMotion) {
            document.querySelectorAll('.project-slide').forEach(card => {
                card.addEventListener('pointermove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    card.style.setProperty('--rx', (-y * 12) + 'deg');
                    card.style.setProperty('--ry', (x * 14) + 'deg');
                });
                card.addEventListener('pointerleave', () => {
                    card.style.setProperty('--rx', '0deg');
                    card.style.setProperty('--ry', '0deg');
                });
            });
        }

        // Event listener untuk tombol case study
        document.querySelectorAll('.case-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id, 10);
                openCaseStudy(id);
            });
        });

        // Click pada card juga membuka modal
        document.querySelectorAll('.project-slide').forEach(card => {
            card.addEventListener('click', (e) => {
                // Hindari jika klik tombol atau link di dalam
                if (e.target.closest('.case-btn')) return;
                const idx = parseInt(card.dataset.index, 10);
                if (!isNaN(idx)) {
                    openCaseStudy(projectsData[idx].id);
                }
            });
        });

        updateIndicators();
        updateButtons();
        updateSlidePosition();
    }

    // --- Slide Position ---
    function getSlideWidth() {
        const trackWidth = track.offsetWidth || 1000;
        const gap = 30;
        if (window.innerWidth <= 768) slidesPerView = 1;
        else if (window.innerWidth <= 1024) slidesPerView = 2;
        else slidesPerView = 3;
        return (trackWidth - gap * (slidesPerView - 1)) / slidesPerView;
    }

    function updateSlidePosition() {
        const slideWidth = getSlideWidth();
        const gap = 30;
        const offset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        updateButtons();
        updateIndicators();
    }

    // --- Navigation ---
    function goTo(index) {
        const maxIndex = Math.max(0, totalSlides - slidesPerView);
        currentIndex = Math.min(maxIndex, Math.max(0, index));
        updateSlidePosition();
        resetAutoplay();
    }

    function nextSlide() {
        const maxIndex = Math.max(0, totalSlides - slidesPerView);
        if (currentIndex < maxIndex) {
            goTo(currentIndex + 1);
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            goTo(currentIndex - 1);
        }
    }

    function updateButtons() {
        const maxIndex = Math.max(0, totalSlides - slidesPerView);
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    // --- Indicators ---
    function updateIndicators() {
        const total = Math.max(1, totalSlides - slidesPerView + 1);
        indicators.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', `Slide ${i+1}`);
            dot.addEventListener('click', () => goTo(i));
            indicators.appendChild(dot);
        }
    }

    // --- Autoplay ---
    function startAutoplay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        if (autoPlayTimeout) clearTimeout(autoPlayTimeout);
        autoplayProgress = 0;
        updateAutoplayBar();

        let startTime = Date.now();
        const duration = 5000; // 5 detik

        function tick() {
            if (isPaused) {
                autoPlayTimeout = setTimeout(tick, 100);
                return;
            }
            const elapsed = Date.now() - startTime;
            autoplayProgress = Math.min(1, elapsed / duration);
            updateAutoplayBar();

            if (autoplayProgress >= 1) {
                nextSlide();
                startAutoplay(); // reset
                return;
            }
            autoPlayTimeout = setTimeout(tick, 50);
        }
        autoPlayTimeout = setTimeout(tick, 50);
    }

    function resetAutoplay() {
        if (autoPlayTimeout) clearTimeout(autoPlayTimeout);
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        startAutoplay();
    }

    function updateAutoplayBar() {
        if (autoplayFill) {
            autoplayFill.style.width = (autoplayProgress * 100) + '%';
        }
    }

    function pauseAutoplay() {
        isPaused = true;
    }

    function resumeAutoplay() {
        isPaused = false;
    }

    // --- Mouse Drag ---
    let dragStartX = 0;
    let dragStartTranslate = 0;
    let isDraggingSlide = false;

    function initDrag(e) {
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        isDraggingSlide = true;
        dragStartX = clientX;
        const slideWidth = getSlideWidth();
        const gap = 30;
        dragStartTranslate = currentIndex * (slideWidth + gap);
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    }

    function moveDrag(e) {
        if (!isDraggingSlide) return;
        e.preventDefault();
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const diff = clientX - dragStartX;
        const slideWidth = getSlideWidth();
        const gap = 30;
        const newTranslate = dragStartTranslate - diff;
        const maxTranslate = Math.max(0, (totalSlides - slidesPerView) * (slideWidth + gap));
        const clamped = Math.min(maxTranslate, Math.max(0, newTranslate));
        track.style.transform = `translateX(-${clamped}px)`;
    }

    function endDrag(e) {
        if (!isDraggingSlide) return;
        isDraggingSlide = false;
        track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.cursor = 'grab';
        document.body.style.userSelect = '';

        const slideWidth = getSlideWidth();
        const gap = 30;
        const currentTranslate = parseFloat(track.style.transform.replace(/[^0-9\-.]/g, '')) || 0;
        const index = Math.round(currentTranslate / (slideWidth + gap));
        goTo(index);
    }

    // --- Keyboard Navigation ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
            resetAutoplay();
        }
    });

    // --- Resize Handler ---
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlidePosition();
            updateButtons();
            updateIndicators();
        }, 200);
    });

    // --- Hover pause autoplay ---
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', pauseAutoplay);
        sliderWrapper.addEventListener('mouseleave', resumeAutoplay);
        // Touch devices
        sliderWrapper.addEventListener('touchstart', pauseAutoplay);
        sliderWrapper.addEventListener('touchend', resumeAutoplay);
    }

    // --- Init Slider ---
    renderCards();
    startAutoplay();

    // Event listeners tombol
    prevBtn.addEventListener('click', () => { prevSlide();
        resetAutoplay(); });
    nextBtn.addEventListener('click', () => { nextSlide();
        resetAutoplay(); });

    // Drag events (mouse)
    track.addEventListener('mousedown', initDrag);
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('mouseup', endDrag);
    // Touch events
    track.addEventListener('touchstart', initDrag, { passive: true });
    document.addEventListener('touchmove', moveDrag, { passive: false });
    document.addEventListener('touchend', endDrag);

    // ============================================================
    // 12. CASE STUDY MODAL
    // ============================================================
    const caseModal = document.getElementById('caseModal');
    const caseBody = document.getElementById('caseModalBody');
    const caseClose = document.getElementById('caseClose');
    const caseOverlay = document.getElementById('caseOverlay');

    function openCaseStudy(id) {
        const project = projectsData.find(p => p.id === id);
        if (!project) return;

        const isSoftware = project.type === 'software';
        const data = project.caseStudy;

        let archHtml = '';
        if (isSoftware && data.architecture) {
            archHtml = `
                <div class="case-arch">
                    ${data.architecture.map((item, idx) => `
                        <div class="case-arch-item">
                            <span class="node-icon">${idx === 0 ? '👤' : idx === data.architecture.length-1 ? '✅' : '⚙️'}</span>
                            <span class="arrow">${idx < data.architecture.length-1 ? '↓' : ''}</span>
                            <span class="node-label">${item}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (!isSoftware && data.workflow) {
            archHtml = `
                <div class="case-arch">
                    ${data.workflow.map((item, idx) => `
                        <div class="case-arch-item">
                            <span class="node-icon">${idx === 0 ? '🎵' : idx === data.workflow.length-1 ? '🔊' : '🔌'}</span>
                            <span class="arrow">${idx < data.workflow.length-1 ? '↓' : ''}</span>
                            <span class="node-label">${item}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        let techList = '';
        if (isSoftware && data.tech) {
            techList = `<ul>${data.tech.map(t => `<li>${t}</li>`).join('')}</ul>`;
        } else if (!isSoftware && data.components) {
            techList = `<ul>${data.components.map(c => `<li>${c}</li>`).join('')}</ul>`;
        }

        let featuresHtml = '';
        if (isSoftware && data.features) {
            featuresHtml = `
                <div class="case-section">
                    <h4>✨ Fitur Utama</h4>
                    <ul>${data.features.map(f => `<li>${f}</li>`).join('')}</ul>
                </div>
            `;
        }

        let testingHtml = '';
        if (!isSoftware && data.testing) {
            testingHtml = `
                <div class="case-section">
                    <h4>🔬 Dokumentasi Pengujian</h4>
                    <p>${data.testing}</p>
                </div>
            `;
        }

        caseBody.innerHTML = `
            <h2>${project.title}</h2>
            <div class="case-meta">${project.category} • ${project.featured ? '⭐ Featured Project' : ''}</div>

            <div class="case-section">
                <h4>📖 Gambaran Umum</h4>
                <p>${data.overview}</p>
            </div>

            ${data.problem ? `
            <div class="case-section">
                <h4>⚠️ Permasalahan</h4>
                <p>${data.problem}</p>
            </div>
            ` : ''}

            ${data.solution ? `
            <div class="case-section">
                <h4>💡 Solusi</h4>
                <p>${data.solution}</p>
            </div>
            ` : ''}

            ${featuresHtml}

            ${techList ? `
            <div class="case-section">
                <h4>🛠 ${isSoftware ? 'Teknologi yang Digunakan' : 'Komponen yang Digunakan'}</h4>
                ${techList}
            </div>
            ` : ''}

            ${archHtml ? `
            <div class="case-section">
                <h4>${isSoftware ? '🏗 Diagram Arsitektur Sistem' : '📊 Alur Kerja Sistem'}</h4>
                ${archHtml}
            </div>
            ` : ''}

            ${isSoftware && data.challenges ? `
            <div class="case-section">
                <h4>⚡ Tantangan Pengembangan</h4>
                <p>${data.challenges}</p>
            </div>
            ` : ''}

            ${testingHtml}

            ${data.results ? `
            <div class="case-section">
                <h4>📊 ${isSoftware ? 'Hasil Akhir' : 'Hasil Pengujian'}</h4>
                <p>${data.results}</p>
            </div>
            ` : ''}

            ${data.screenshot || data.schematic ? `
            <div class="case-section">
                <h4>📸 ${isSoftware ? 'Screenshot' : 'Skematik'}</h4>
                <div class="case-screenshot">
                    <img src="${isSoftware ? data.screenshot : data.schematic}" alt="Preview" />
                </div>
            </div>
            ` : ''}
        `;

        caseModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        // Focus trap
        setTimeout(() => {
            const firstFocus = caseModal.querySelector('a, button');
            if (firstFocus) firstFocus.focus();
        }, 100);
    }

    function closeCaseStudy() {
        caseModal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    caseClose.addEventListener('click', closeCaseStudy);
    caseOverlay.addEventListener('click', closeCaseStudy);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && caseModal.classList.contains('is-open')) {
            closeCaseStudy();
        }
    });

    // ============================================================
    // 13. SLIDER REVEAL ANIMATION (Intersection Observer)
    // ============================================================
    const projectsSection = document.getElementById('projects');
    if (projectsSection && !reduceMotion) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.project-slide');
                    cards.forEach((card, idx) => {
                        const delay = idx * 120;
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px) scale(0.96)';
                        card.style.transition =
                            `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`;
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        });
                    });
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealObs.observe(projectsSection);
    } else if (projectsSection) {
        // Jika reduce motion, langsung tampilkan
        projectsSection.querySelectorAll('.project-slide').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }





    
// ============================================================
// 14. ACCORDION / EXPANDABLE (Magang & Pendidikan)
// ============================================================
(function() {
    const toggles = document.querySelectorAll('.expand-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const isOpen = this.getAttribute('aria-expanded') === 'true';
            const content = this.nextElementSibling;

            // Tutup yang lain (opsional, agar hanya satu yang terbuka)
            // Jika ingin hanya satu terbuka, aktifkan kode di bawah:
            // toggles.forEach(t => {
            //     if (t !== toggle && t.getAttribute('aria-expanded') === 'true') {
            //         t.setAttribute('aria-expanded', 'false');
            //         t.nextElementSibling.classList.remove('open');
            //     }
            // });

            if (isOpen) {
                this.setAttribute('aria-expanded', 'false');
                content.classList.remove('open');
            } else {
                this.setAttribute('aria-expanded', 'true');
                content.classList.add('open');
            }
        });
    });

    // Inisialisasi: pastikan semua content tertutup
    document.querySelectorAll('.expand-content').forEach(el => {
        el.classList.remove('open');
    });
    document.querySelectorAll('.expand-toggle').forEach(el => {
        el.setAttribute('aria-expanded', 'false');
    });

    console.log('✅ Accordion siap digunakan');
})();

    console.log('✅ Premium Project Slider aktif!');
})();
    console.log('✅ Portfolio Isal + Recruiter Mode siap digunakan!');
})();