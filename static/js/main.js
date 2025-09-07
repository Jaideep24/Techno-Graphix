// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.documentElement.classList.add('dark');
}

// Navigation
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('nav--hidden');
        return;
    }

    if (currentScroll > lastScroll && !nav.classList.contains('nav--hidden')) {
        nav.classList.add('nav--hidden');
    } else if (currentScroll < lastScroll && nav.classList.contains('nav--hidden')) {
        nav.classList.remove('nav--hidden');
    }
    
    lastScroll = currentScroll;
});

// Mobile Navigation
const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');

if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
        mobileNav.classList.toggle('is-active');
        menuButton.setAttribute('aria-expanded', 
            menuButton.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile nav if open
            if (mobileNav && mobileNav.classList.contains('is-active')) {
                mobileNav.classList.remove('is-active');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Form Validation and Submission
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Basic form validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!isValid) {
            return;
        }
        
        // Form submission
        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            
            if (response.ok) {
                form.reset();
                showMessage('success', 'Message sent successfully!');
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            showMessage('error', 'Failed to send message. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
});

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Message Display
function showMessage(type, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message message--${type}`;
    messageElement.textContent = message;
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.classList.add('message--visible');
    }, 100);
    
    setTimeout(() => {
        messageElement.classList.remove('message--visible');
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 3000);
}

// Animation on Scroll
const animatedElements = document.querySelectorAll('.animate');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

animatedElements.forEach(element => {
    observer.observe(element);
});

// Portfolio Filters
const filterButtons = document.querySelectorAll('.portfolio__filter');
const portfolioItems = document.querySelectorAll('.portfolio__item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        filterButtons.forEach(btn => btn.classList.remove('is-active'));
        button.classList.add('is-active');
        
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                setTimeout(() => item.classList.remove('hidden'), 10);
            } else {
                item.classList.add('hidden');
                setTimeout(() => item.style.display = 'none', 300);
            }
        });
    });
});

// Initialize Lottie Animations
if (typeof lottie !== 'undefined') {
    const lottieElements = document.querySelectorAll('.lottie-animation');
    lottieElements.forEach(element => {
        lottie.loadAnimation({
            container: element,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: element.dataset.animation
        });
    });
}
