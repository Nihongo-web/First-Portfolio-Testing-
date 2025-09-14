// === ✅ ENHANCED: Gunakan IIFE + Strict Mode untuk isolasi & keamanan ===
(() => {
    'use strict';

    // === ✅ ROBUST: Tunggu DOM + pastikan semua elemen tersedia ===
    if (!document.body) return;

    document.addEventListener('DOMContentLoaded', function() {

        // === ✅ ENHANCED: Cache semua selector di awal ===
        const DOM = {
            hamburger: document.getElementById('hamburger'),
            navMenu: document.getElementById('navMenu'),
            anchors: document.querySelectorAll('a[href^="#"]'),
            hero: document.querySelector('.hero'),
            animatedElements: document.querySelectorAll('.content-grid, .projects-grid, .section-desc'),
            cards: document.querySelectorAll('.project-card, .image-card')
        };

        // === ✅ ROBUST: Validasi elemen penting ===
        if (!DOM.hamburger || !DOM.navMenu) {
            console.warn('Navbar elements not found. Skipping menu functionality.');
            return;
        }

        // === ✅ ADVANCED: Mobile Menu Toggle dengan ARIA ===
        const toggleMenu = () => {
            const isActive = DOM.navMenu.classList.toggle('active');
            DOM.hamburger.innerHTML = isActive 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            DOM.hamburger.setAttribute('aria-expanded', isActive);
        };

        DOM.hamburger.addEventListener('click', toggleMenu);

        // === ✅ ENHANCED: Close menu + ARIA update ===
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                DOM.navMenu.classList.remove('active');
                DOM.hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                DOM.hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // =========================================================================
        // === ✅ ADVANCED: Smooth Scroll dengan Fallback & Error Handling (Ini yang Anda cari!) ===
        // =========================================================================
        DOM.anchors.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault(); // Mencegah perilaku default (loncat instan)
                
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Mengurangi 80px untuk menyesuaikan dengan tinggi navbar yang fixed
                    const offsetTop = targetElement.offsetTop - 80; 
                    
                    // ✅ ROBUST: Gunakan scrollBehavior yang halus jika didukung browser
                    if ('scrollBehavior' in document.documentElement.style) {
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth' // Ini yang membuat scroll menjadi halus
                        });
                    } else {
                        // Fallback untuk browser yang lebih tua (scroll instan)
                        window.scrollTo(0, offsetTop);
                    }

                    // ✅ ENHANCED: Memicu event scroll setelah smooth scroll selesai.
                    // Ini berguna untuk animasi yang bergantung pada posisi scroll.
                    setTimeout(() => {
                        window.dispatchEvent(new Event('scroll'));
                    }, 600); // Sesuaikan durasi timeout dengan perkiraan durasi smooth scroll
                }
            });
        });
        // =========================================================================
        // === Akhir dari fitur Smooth Scroll ===
        // =========================================================================


        // === ✅ ADVANCED: Parallax Effect dengan Performance Optimization ===
        let ticking = false;
        const updateParallax = () => {
            const scrollY = window.scrollY;
            document.body.style.setProperty('--scroll', scrollY);
            document.body.classList.add('parallax');
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });

        // === ✅ ENHANCED: Scroll Animation dengan Intersection Observer (Modern) ===
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.js-animate, .content-grid, .projects-grid, .section-desc');
            
            elements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    el.classList.add('show');
                }
            });
        };

        // ✅ ROBUST: Gunakan Intersection Observer jika tersedia (lebih efisien)
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            });

            DOM.animatedElements.forEach(el => {
                el.classList.add('js-animate'); // ✅ Auto-add class
                observer.observe(el);
            });
        } else {
            // Fallback ke scroll event lama
            window.addEventListener('scroll', animateOnScroll);
            animateOnScroll();
        }

        // === ✅ ADVANCED: Micro-interactions dengan Passive Event & Performance ===
        const handleCardMouseMove = (e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        };

        const handleCardMouseLeave = (e) => {
            const card = e.currentTarget;
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        };

        // ✅ ENHANCED: Tambahkan event listener dengan passive: false (karena modifikasi)
        DOM.cards.forEach(card => {
            card.addEventListener('mousemove', handleCardMouseMove, { passive: false });
            card.addEventListener('mouseleave', handleCardMouseLeave, { passive: false });
        });

        // === ✅ ROBUST: Cleanup function (opsional untuk SPA) ===
        window.cleanupPortfolio = () => {
            DOM.hamburger?.removeEventListener('click', toggleMenu);
            DOM.anchors.forEach(anchor => {
                // Cleanup bisa ditambahkan jika perlu
            });
            window.removeEventListener('scroll', animateOnScroll);
        };

        // === ✅ ADVANCED: Log initialization success ===
        console.log('✅ Portfolio JS initialized successfully.');

    });

})();