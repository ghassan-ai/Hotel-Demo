/* ══════════════════════════════════════
   Hotel Demo — Main JavaScript
   ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // ─── DOM Elements ───
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialDots = document.getElementById('testimonialDots');

    // ═══════════════════════════════════
    // NAVBAR — Scroll Effect
    // ═══════════════════════════════════
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        // Add/remove scrolled class
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ═══════════════════════════════════
    // NAVBAR — Mobile Toggle
    // ═══════════════════════════════════
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ═══════════════════════════════════
    // HERO — Auto-Sliding Background
    // ═══════════════════════════════════
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentHeroSlide = 0;
        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }, 4000);
    }

    // ═══════════════════════════════════
    // SMOOTH SCROLL — All anchor links
    // ═══════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;
            e.preventDefault();
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80; // navbar height
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════
    // FADE IN — Intersection Observer
    // ═══════════════════════════════════
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for sibling elements
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ═══════════════════════════════════
    // GALLERY — Lightbox
    // ═══════════════════════════════════
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryImages = [];
    const galleryCaptions = [];
    let currentImageIndex = 0;

    // Collect gallery data
    galleryItems.forEach((item, i) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay span');
        galleryImages.push(img.src.replace('w=600', 'w=1200'));
        galleryCaptions.push(caption ? caption.textContent : '');

        item.addEventListener('click', () => {
            currentImageIndex = i;
            openLightbox(i);
        });
    });

    function openLightbox(index) {
        lightboxImg.src = galleryImages[index];
        lightboxCaption.textContent = galleryCaptions[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImageIndex];
        lightboxCaption.textContent = galleryCaptions[currentImageIndex];
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImageIndex];
        lightboxCaption.textContent = galleryCaptions[currentImageIndex];
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') prevImage();
        if (e.key === 'ArrowLeft') nextImage();
    });

    // ═══════════════════════════════════
    // TESTIMONIALS — Slider
    // ═══════════════════════════════════
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-card').length;
    const dots = testimonialDots.querySelectorAll('.dot');
    let autoSlideInterval;

    function goToSlide(index) {
        currentSlide = index;
        // RTL: slide to the right
        testimonialTrack.style.transform = `translateX(${index * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
    }

    // Dot clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.dataset.slide);
            goToSlide(slideIndex);
            resetAutoSlide();
        });
    });

    // Auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const next = (currentSlide + 1) % totalSlides;
            goToSlide(next);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    startAutoSlide();

    // Touch/swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;
    const slider = document.getElementById('testimonialSlider');

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
            resetAutoSlide();
        }
    }, { passive: true });


    // ACTIVE NAV LINK — on scroll
    // ═══════════════════════════════════
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = navLinks.querySelector(`a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = 'var(--primary)';
                } else {
                    link.style.color = '';
                }
            }
        });
    });

    // ═══════════════════════════════════
    // HIGH-IMPACT INTERACTIVE PARTICLES
    // ═══════════════════════════════════
    if (document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": window.innerWidth < 768 ? 40 : 100,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": "#C9A84C" }, // Golden color
                "shape": { "type": "circle" },
                "opacity": {
                    "value": 0.6,
                    "random": true,
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": { "enable": true, "speed": 2, "size_min": 1, "sync": false }
                },
                "line_linked": {
                    "enable": true, // Connect lines for more impact!
                    "distance": 150,
                    "color": "#C9A84C",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
                }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" }, // Lines attach to mouse
                    "onclick": { "enable": true, "mode": "push" }, // Click creates more
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 200, "line_linked": { "opacity": 0.8 } },
                    "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                    "repulse": { "distance": 200, "duration": 0.4 },
                    "push": { "particles_nb": 4 },
                    "remove": { "particles_nb": 2 }
                }
            },
            "retina_detect": true
        });
    }
});
