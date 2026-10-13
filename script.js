/**
 * Portfolio Website - Deborah Servidio
 * Main JavaScript file for interactivity
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    const CONFIG = {
        // Skills data - PERSONALIZZA QUESTI VALORI
        skills: {
            technical: [
                { name: 'Pacchetto Office (Word, Excel, PowerPoint)', level: 'Buono' },
                { name: 'Posta Elettronica (Outlook, Gmail)', level: 'Buono' },
                { name: 'Android / iOS (utilizzo smartphone/tablet)', level: 'Buono' },
                { name: 'Adobe Photoshop (base)', level: 'Base' },
                { name: 'Gestionale DMS (Studio Odontoiatrico)', level: 'Buono' },
                { name: 'Palmari/Scanner per inventario e prezzi', level: 'Buono' },
                { name: 'Transpallet manuale ed elettrico', level: 'Buono' },
                { name: 'Sterilizzazione strumenti odontoiatrici', level: 'Buono' }
            ],
            soft: [
                'Comunicazione efficace',
                'Teamworking e Collaborazione',
                'Time Management',
                'Adattabilità',
                'Problem Solving',
                'Orientamento al Cliente',
                'Affidabilità e Precisione',
                'Empatia e Ascolto Attivo',
                'Gestione dello Stress',
                'Apprendimento Rapido'
            ],
            languages: [
                { name: 'Italiano', level: 'Madrelingua' }
            ]
        },

        // Animation settings
        animation: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

    const createElement = (tag, className = '', content = '') => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (content) el.innerHTML = content;
        return el;
    };

    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(null, args), delay);
        };
    };

    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    function initMobileNav() {
        const toggle = $('.nav__toggle');
        const menu = $('.nav__menu');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('nav__menu--open');
            toggle.setAttribute('aria-expanded', isOpen);
            toggle.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when clicking a link
        $$('.nav__link', menu).forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('nav__menu--open');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('nav__menu--open')) {
                menu.classList.remove('nav__menu--open');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                toggle.focus();
            }
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = $(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = $('.header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without scrolling
                    history.pushState(null, '', targetId);
                }
            });
        });
    }

    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    function initActiveNav() {
        const sections = $$('section[id]');
        const navLinks = $$('.nav__link');

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: `-${$('.header')?.offsetHeight || 72}px 0px -60% 0px`
        });

        sections.forEach(section => observer.observe(section));
    }

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    function initHeaderScroll() {
        const header = $('.header');
        if (!header) return;

        const handleScroll = debounce(() => {
            if (window.scrollY > 50) {
                header.style.boxShadow = 'var(--shadow-md)';
                header.style.backgroundColor = 'rgba(250, 250, 250, 0.95)';
            } else {
                header.style.boxShadow = 'none';
                header.style.backgroundColor = 'rgba(250, 250, 250, 0.9)';
            }

            // Dark mode support
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                if (window.scrollY > 50) {
                    header.style.backgroundColor = 'rgba(15, 15, 26, 0.95)';
                } else {
                    header.style.backgroundColor = 'rgba(15, 15, 26, 0.9)';
                }
            }
        }, 10);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ========================================
    function initScrollAnimations() {
        const animatedElements = $$(
            '.timeline__item, .education__card, .skills__category, .project__card, .stat, .about__text > *'
        );

        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, CONFIG.animation);

        // Set initial state
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // ========================================
    // SKILLS RENDERING
    // ========================================
    function renderSkills() {
        const { technical, soft, languages } = CONFIG.skills;

        // Technical skills
        const techContainer = $('#technical-skills');
        if (techContainer) {
            techContainer.innerHTML = technical.map(skill => `
                <span class="skill-tag">
                    ${skill.name}
                    <span class="skill-tag__level">${skill.level}</span>
                </span>
            `).join('');
        }

        // Soft skills
        const softContainer = $('#soft-skills');
        if (softContainer) {
            softContainer.innerHTML = soft.map(skill => `
                <span class="skill-tag">${skill}</span>
            `).join('');
        }

        // Languages
        const langContainer = $('#languages');
        if (langContainer) {
            langContainer.innerHTML = languages.map(lang => `
                <span class="skill-tag">
                    ${lang.name}
                    <span class="skill-tag__level">${lang.level}</span>
                </span>
            `).join('');
        }
    }

    // ========================================
    // TYPING ANIMATION FOR HERO
    // ========================================
    function initTypingAnimation() {
        const titleElement = $('.hero__title .highlight');
        if (!titleElement) return;

        const roles = [
            'Assistente alle vendite',
            'Assistente studio odontoiatrico',
            'Esperta retail & sanitario',
            'Precisione e cortesia',
            'Pronta per nuove sfide'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                titleElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                titleElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500; // Pause before next
            }

            setTimeout(type, typingSpeed);
        }

        // Start after a short delay
        setTimeout(type, 1000);
    }

    // ========================================
    // RISING EMOJI CATS (original animation)
    // ========================================
    function initRisingEmojiCats() {
        const catEmojis = ['🐱', '🐈', '😺', '😸', '😻', '🙀', '😽', '🐾'];
        const catCount = 3;
        let activeCats = [];
        let animationId = null;

        function createCat() {
            const cat = document.createElement('div');
            cat.className = 'scroll-cat-emoji';
            cat.textContent = catEmojis[Math.floor(Math.random() * catEmojis.length)];
            cat.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 20 + 20}px;
                pointer-events: none;
                user-select: none;
                z-index: 9999;
                opacity: 0;
                transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                transition: opacity 0.3s ease, transform 0.3s ease;
                will-change: transform, opacity;
            `;
            document.body.appendChild(cat);
            return cat;
        }

        function animateCat(cat) {
            const startX = Math.random() * window.innerWidth;
            const endX = Math.random() * window.innerWidth;
            const duration = Math.random() * 8000 + 5000;
            const rotation = Math.random() * 360;

            cat.style.left = `${startX}px`;
            cat.style.top = `${window.innerHeight + 50}px`;

            cat.offsetHeight;

            cat.style.opacity = '0.7';
            cat.style.transition = `transform ${duration}ms linear, opacity 0.5s ease`;
            cat.style.transform = `translate(${endX - startX}px, -${window.innerHeight + 100}px) rotate(${rotation}deg)`;

            setTimeout(() => {
                cat.style.opacity = '0';
                setTimeout(() => cat.remove(), 500);
            }, duration);
        }

        function spawnCats() {
            if (activeCats.length >= catCount) {
                const oldCat = activeCats.shift();
                oldCat.style.opacity = '0';
                setTimeout(() => oldCat.remove(), 500);
            }

            const cat = createCat();
            activeCats.push(cat);
            animateCat(cat);
        }

        function startCatAnimation() {
            for (let i = 0; i < catCount; i++) {
                setTimeout(spawnCats, i * 1500);
            }
            animationId = setInterval(spawnCats, 4000);
        }

        function stopCatAnimation() {
            if (animationId) {
                clearInterval(animationId);
                animationId = null;
            }
            activeCats.forEach(cat => {
                cat.style.opacity = '0';
                setTimeout(() => cat.remove(), 500);
            });
            activeCats = [];
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startCatAnimation);
        } else {
            startCatAnimation();
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopCatAnimation();
            } else {
                startCatAnimation();
            }
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        window.CatAnimation = { start: startCatAnimation, stop: stopCatAnimation };
    }

    // ========================================
    // GIF CAT ADS (static scattered ads)
    // ========================================
    function initGifCatAds() {
        // Local cat GIFs from the Giff folder
        const catGifs = [
            'Giff/44a8dabf0e4bf6e2616cd0f6d0ce5912.gif',
            'Giff/795fe5ccdb8b3652a44ad25cd9a9ef6f.gif',
            'Giff/3910a613a164909809dc9c67237c4a1d.gif',
            'Giff/tumblr_f00b8b6b9cf56804a514b61b13ee1e92_9a7b5894_500.gif',
            'Giff/1715b1a55f902ed9bdc4df3b5cad5f7b.gif'
        ];

        // Find all sections and add a cat ad to some of them
        const sections = document.querySelectorAll('section:not(.hero)');
        const adCount = Math.min(4, sections.length); // Max 4 ads
        const shuffledSections = Array.from(sections).sort(() => 0.5 - Math.random());

        for (let i = 0; i < adCount; i++) {
            const section = shuffledSections[i];
            const container = section.querySelector('.container') || section;

            const adWrapper = document.createElement('div');
            adWrapper.className = 'cat-ad-wrapper';
            adWrapper.style.cssText = `
                position: relative;
                margin: var(--space-xl) 0;
                text-align: center;
            `;

            const catImg = document.createElement('img');
            catImg.className = 'cat-ad-gif';
            catImg.src = catGifs[Math.floor(Math.random() * catGifs.length)];
            catImg.alt = 'Simpatico gattino pubblicitario';
            catImg.loading = 'lazy';
            catImg.style.cssText = `
                max-width: 180px;
                width: 100%;
                height: auto;
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-lg);
                border: 3px solid var(--color-primary-light);
                transition: transform var(--transition-base), box-shadow var(--transition-base);
                cursor: pointer;
            `;

            catImg.onerror = () => {
                catImg.src = catGifs[Math.floor(Math.random() * catGifs.length)];
            };

            // Add hover effect
            catImg.addEventListener('mouseenter', () => {
                catImg.style.transform = 'scale(1.05) rotate(-2deg)';
                catImg.style.boxShadow = 'var(--shadow-kitten)';
            });
            catImg.addEventListener('mouseleave', () => {
                catImg.style.transform = 'scale(1) rotate(0deg)';
                catImg.style.boxShadow = 'var(--shadow-lg)';
            });

            // Add a cute label
            const label = document.createElement('p');
            label.className = 'cat-ad-label';
            label.textContent = '🐱 Pubblicità gattona 🐱';
            label.style.cssText = `
                margin-top: var(--space-xs);
                font-family: var(--font-family-heading);
                font-size: var(--font-size-xs);
                font-weight: 600;
                color: var(--color-primary);
                opacity: 0.8;
            `;

            adWrapper.appendChild(catImg);
            adWrapper.appendChild(label);

            // Insert at a random position within the container
            const children = container.children;
            if (children.length > 1) {
                const insertIndex = Math.floor(Math.random() * (children.length - 1)) + 1;
                container.insertBefore(adWrapper, children[insertIndex]);
            } else {
                container.appendChild(adWrapper);
            }
        }
    }

    // ========================================
    // PROJECT CARD HOVER EFFECT
    // ========================================
    function initProjectCards() {
        $$('.project__card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // ========================================
    // COPY EMAIL TO CLIPBOARD
    // ========================================
    function initCopyEmail() {
        const emailLinks = $$('a[href^="mailto:"]');

        emailLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                // Only copy on modifier key (Ctrl/Cmd + click)
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    const email = link.href.replace('mailto:', '');

                    try {
                        await navigator.clipboard.writeText(email);
                        showToast('Email copiata negli appunti!');
                    } catch (err) {
                        console.warn('Could not copy email:', err);
                    }
                }
            });
        });
    }

    // ========================================
    // TOAST NOTIFICATIONS
    // ========================================
    function showToast(message) {
        // Remove existing toast
        const existing = $('.toast');
        if (existing) existing.remove();

        const toast = createElement('div', 'toast', message);
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: var(--color-text);
            color: var(--color-bg);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        // Add animation keyframes if not exists
        if (!$('#toast-styles')) {
            const style = createElement('style', '', `
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(20px); }
                }
            `);
            style.id = 'toast-styles';
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ========================================
    // LAZY LOADING IMAGES
    // ========================================
    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;

        const images = $$('img[data-src]');

        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imgObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imgObserver.observe(img));
    }

    // ========================================
    // CURRENT YEAR IN FOOTER
    // ========================================
    function updateFooterYear() {
        const yearEl = $('.footer__year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    // ========================================
    // PERFORMANCE: PRELOAD CRITICAL RESOURCES
    // ========================================
    function preloadCriticalResources() {
        // Preload the CV PDF for faster download
        const cvLink = $('a[href$=".pdf"]');
        if (cvLink) {
            const link = createElement('link');
            link.rel = 'preload';
            link.href = cvLink.href;
            link.as = 'document';
            document.head.appendChild(link);
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize all modules
        initMobileNav();
        initSmoothScroll();
        initActiveNav();
        initHeaderScroll();
        initScrollAnimations();
        renderSkills();
        initTypingAnimation();
        initProjectCards();
        initCopyEmail();
        initLazyLoading();
        updateFooterYear();
        preloadCriticalResources();
        initRisingEmojiCats();
        initGifCatAds();
        initPdfGeneration();

        // Log initialization
        console.log('🚀 Portfolio initialized successfully');
        console.log('💡 Tip: Personalizza i dati in script.js > CONFIG.skills');
    }

    // Start initialization
    init();

    // ========================================
    // PDF GENERATION
    // ========================================
    function initPdfGeneration() {
        const pdfBtn = $('#generate-pdf-btn');
        if (!pdfBtn || typeof html2pdf === 'undefined') {
            if (pdfBtn) pdfBtn.style.display = 'none';
            return;
        }

        pdfBtn.addEventListener('click', async () => {
            const originalText = pdfBtn.textContent;
            pdfBtn.textContent = 'Generazione...';
            pdfBtn.disabled = true;

            try {
                // Clone the main content for PDF
                const mainContent = document.querySelector('main').cloneNode(true);

                // Remove elements we don't want in PDF
                const elementsToRemove = mainContent.querySelectorAll('.hero__actions, .hero__social, .contact__methods a[href^="mailto:"], .contact__methods a[href^="tel:"], .contact__methods a[href^="https://linkedin"]');
                elementsToRemove.forEach(el => el.remove());

                // Add print-specific styles
                const style = document.createElement('style');
                style.textContent = `
                    @page { margin: 20mm; size: A4; }
                    body { background: white !important; color: #1a1a2e !important; }
                    .hero { min-height: auto !important; padding-top: 0 !important; background: none !important; text-align: center; }
                    .hero::before, .hero::after { display: none !important; }
                    .section__title::after { content: '' !important; }
                    .btn, .hero__actions, .hero__social { display: none !important; }
                    .nav, .header, .footer { display: none !important; }
                    .timeline::before, .timeline::after { display: none !important; }
                    .timeline__marker { display: none !important; }
                    .stat::before, .education__card::before, .skills__category::before, .timeline__content::before { display: none !important; }
                    .skills__category-title::after { display: none !important; }
                    .contact__method::before { display: none !important; }
                    .footer::before { display: none !important; }
                    .about::before, .about::after, .education::before, .education::after, .skills::before, .skills::after, .contact::before, .contact::after, .experience::before { display: none !important; }
                    .stat:hover, .education__card:hover, .skills__category:hover, .timeline__content:hover, .contact__method:hover { transform: none !important; box-shadow: none !important; }
                    .skill-tag:hover { transform: none !important; }
                    * { animation: none !important; transition: none !important; }
                    .scroll-cat { display: none !important; }
                `;
                mainContent.appendChild(style);

                const opt = {
                    margin: [15, 15, 15, 15],
                    filename: 'CV-Deborah-Servidio.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        logging: false
                    },
                    jsPDF: {
                        unit: 'mm',
                        format: 'a4',
                        orientation: 'portrait'
                    },
                    pagebreak: { mode: 'avoid-all', avoid: ['.timeline__content', '.education__card', '.skills__category', '.stat', '.contact__method'] }
                };

                await html2pdf().set(opt).from(mainContent).save();
                showToast('PDF generato con successo! 🐱');
            } catch (error) {
                console.error('Errore generazione PDF:', error);
                showToast('Errore durante la generazione del PDF');
            } finally {
                pdfBtn.textContent = originalText;
                pdfBtn.disabled = false;
            }
        });
    }

})();