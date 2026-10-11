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
    // RANDOM CAT ANIMATIONS
    // ========================================
    function initRandomCats() {
        const catEmojis = ['🐱', '🐈', '😺', '😸', '😻', '🙀', '😽', '🐾'];
        const catCount = 3; // Number of cats visible at once
        let activeCats = [];
        let animationId = null;

        function createCat() {
            const cat = document.createElement('div');
            cat.className = 'scroll-cat';
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
            const duration = Math.random() * 8000 + 5000; // 5-13 seconds
            const delay = Math.random() * 2000;
            const rotation = Math.random() * 360;

            cat.style.left = `${startX}px`;
            cat.style.top = `${window.innerHeight + 50}px`;

            // Trigger reflow
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
            // Keep a maximum number of cats
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
            // Initial spawn
            for (let i = 0; i < catCount; i++) {
                setTimeout(spawnCats, i * 1500);
            }

            // Continue spawning
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

        // Start when page loads
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startCatAnimation);
        } else {
            startCatAnimation();
        }

        // Pause when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopCatAnimation();
            } else {
                startCatAnimation();
            }
        });

        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return; // Don't start animation
        }

        // Expose for debugging
        window.CatAnimation = { start: startCatAnimation, stop: stopCatAnimation };
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
        initRandomCats();

        // Log initialization
        console.log('🚀 Portfolio initialized successfully');
        console.log('💡 Tip: Personalizza i dati in script.js > CONFIG.skills');
    }

    // Start initialization
    init();

    // ========================================
    // EXPOSE PUBLIC API (for debugging)
    // ========================================
    window.Portfolio = {
        config: CONFIG,
        showToast,
        renderSkills
    };

})();