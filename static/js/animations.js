// Animation System
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupScrollReveal();
        this.setupCounters();
        this.setupTiltEffect();
        this.setupParallax();
    }

    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once element is revealed
                    
                    // Handle stagger animations
                    if (entry.target.classList.contains('stagger-container')) {
                        this.animateStaggerItems(entry.target);
                    }
                }
            });
        }, this.observerOptions);

        // Observe elements with reveal classes
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .zoom-in, .rotate-in, .slide-in-bottom, .slide-in-top');
        revealElements.forEach(el => observer.observe(el));

        // Observe stagger containers
        const staggerContainers = document.querySelectorAll('.stagger-container');
        staggerContainers.forEach(container => observer.observe(container));
    }

    animateStaggerItems(container) {
        const items = container.querySelectorAll('.stagger-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, index * 100);
        });
    }

    setupCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        const counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        element.classList.add('counting');

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    setupTiltEffect() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.handleTilt(e, element);
            });

            element.addEventListener('mouseleave', () => {
                this.resetTilt(element);
            });
        });
    }

    handleTilt(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }

    resetTilt(element) {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Utility methods for manual animations
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let opacity = 0;
        const increment = 16 / duration;
        
        const timer = setInterval(() => {
            opacity += increment;
            if (opacity >= 1) {
                opacity = 1;
                clearInterval(timer);
            }
            element.style.opacity = opacity;
        }, 16);
    }

    fadeOut(element, duration = 300) {
        let opacity = 1;
        const increment = 16 / duration;
        
        const timer = setInterval(() => {
            opacity -= increment;
            if (opacity <= 0) {
                opacity = 0;
                element.style.display = 'none';
                clearInterval(timer);
            }
            element.style.opacity = opacity;
        }, 16);
    }

    slideDown(element, duration = 300) {
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        let height = 0;
        const increment = (targetHeight * 16) / duration;
        
        const timer = setInterval(() => {
            height += increment;
            if (height >= targetHeight) {
                height = targetHeight;
                element.style.height = 'auto';
                element.style.overflow = 'visible';
                clearInterval(timer);
            } else {
                element.style.height = height + 'px';
            }
        }, 16);
    }

    slideUp(element, duration = 300) {
        let height = element.offsetHeight;
        const increment = (height * 16) / duration;
        element.style.overflow = 'hidden';
        
        const timer = setInterval(() => {
            height -= increment;
            if (height <= 0) {
                height = 0;
                element.style.display = 'none';
                element.style.height = 'auto';
                element.style.overflow = 'visible';
                clearInterval(timer);
            } else {
                element.style.height = height + 'px';
            }
        }, 16);
    }
}

// Initialize animation manager
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});

// Add reveal classes to elements that should animate on scroll
document.addEventListener('DOMContentLoaded', () => {
    // Add reveal classes to section elements
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.classList.add('reveal');
    });

    // Add stagger animation to service cards
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
        servicesGrid.classList.add('stagger-container');
        const serviceCards = servicesGrid.querySelectorAll('.service-card');
        serviceCards.forEach(card => card.classList.add('stagger-item'));
    }

    // Add stagger animation to portfolio items
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid) {
        portfolioGrid.classList.add('stagger-container');
        const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => item.classList.add('stagger-item'));
    }

    // Add stagger animation to blog cards
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        blogGrid.classList.add('stagger-container');
        const blogCards = blogGrid.querySelectorAll('.blog-card');
        blogCards.forEach(card => card.classList.add('stagger-item'));
    }

    // Add stagger animation to team cards
    const teamGrid = document.querySelector('.team-grid');
    if (teamGrid) {
        teamGrid.classList.add('stagger-container');
        const teamCards = teamGrid.querySelectorAll('.team-card');
        teamCards.forEach(card => card.classList.add('stagger-item'));
    }
});