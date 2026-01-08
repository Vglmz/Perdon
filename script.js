// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // heart hover behavior removed (animation disabled in CSS)
    const heartIcon = document.querySelector('.heart-icon');
    const heartContainer = document.querySelector('.heart-container');

    // Add click effect to sections
    sections.forEach(section => {
        section.addEventListener('click', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Dynamic sparkle generation
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        
        if (heartContainer) {
            heartContainer.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                sparkle.remove();
            }, 2000);
        }
    }

    // Generate sparkles periodically
    setInterval(createSparkle, 3000);

    // Smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for decorative circles
    window.addEventListener('scroll', function() {
        const circles = document.querySelectorAll('.decorative-circle');
        const scrolled = window.pageYOffset;
        
        circles.forEach((circle, index) => {
            const speed = 0.5 + (index * 0.2);
            circle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Add random floating animation to quote on scroll
    const quote = document.querySelector('.quote');
    if (quote) {
        const quoteObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    quote.style.animation = 'popIn 0.6s ease-out forwards, float 6s ease-in-out infinite';
                }
            });
        }, { threshold: 0.5 });
        
        quoteObserver.observe(quote);
    }

    // Image viewer (carousel) functionality
    const viewer = document.querySelector('.image-viewer');
    if (viewer) {
        const slides = Array.from(viewer.querySelectorAll('.iv-slide'));
        const prevBtn = viewer.querySelector('.iv-prev');
        const nextBtn = viewer.querySelector('.iv-next');
        const dotsContainer = viewer.querySelector('.iv-dots');
        let current = 0;
        let autoplayId = null;

        function showSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            slides.forEach((s, i) => {
                s.style.display = (i === index) ? 'block' : 'none';
            });
            // update dots
            Array.from(dotsContainer.children).forEach((btn, i) => {
                btn.classList.toggle('active', i === index);
            });
            current = index;
            // ensure container height matches image (in case image hasn't loaded yet)
            const img = slides[current].querySelector('img');
            if (img && !img.complete) {
                img.addEventListener('load', () => {
                    // no-op; layout will naturally update as images are height:auto
                }, { once: true });
            }
        }

        // create dots
        slides.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.setAttribute('aria-label', `Ir a imagen ${i+1}`);
            btn.addEventListener('click', () => {
                showSlide(i);
                resetAutoplay();
            });
            dotsContainer.appendChild(btn);
        });

        prevBtn.addEventListener('click', () => { showSlide(current - 1); resetAutoplay(); });
        nextBtn.addEventListener('click', () => { showSlide(current + 1); resetAutoplay(); });

        // keyboard support
        document.addEventListener('keydown', (e) => {
            if (!viewer.matches(':hover') && document.activeElement.tagName === 'INPUT') return;
            if (e.key === 'ArrowLeft') { showSlide(current - 1); resetAutoplay(); }
            if (e.key === 'ArrowRight') { showSlide(current + 1); resetAutoplay(); }
        });

        // autoplay disabled: functions are no-ops so slides won't advance automatically
        function startAutoplay() {
            // autoplay intentionally disabled
        }
        function stopAutoplay() { if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } }
        function resetAutoplay() { /* no-op since autoplay disabled */ }

        viewer.addEventListener('mouseenter', stopAutoplay);

        // initial state
        showSlide(0);
    }

    // Console message
    console.log('💜 Apology page loaded with love');
});