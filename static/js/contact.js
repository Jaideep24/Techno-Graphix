/**
 * Contact Form Handler
 * Handles the contact form submission and provides user feedback.
 */

// Add styles for form messages
const formStyles = `
    .form__success {
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 0.5rem;
        background-color: #059669;
        color: white;
    }
    .form__error {
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 0.5rem;
        background-color: #dc2626;
        color: white;
    }
    .form--loading button[type="submit"] {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

document.addEventListener('DOMContentLoaded', () => {
    // Add styles to document
    const style = document.createElement('style');
    style.textContent = formStyles;
    document.head.appendChild(style);

    // Set up contact form
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        // Show loading state
        const originalText = submitBtn.innerHTML;
        setLoading(true, submitBtn, contactForm);

        try {
            // Get form data
            const formData = new FormData(contactForm);
            
            // Try to get CSRF token from multiple sources
            let csrfToken = formData.get('csrfmiddlewaretoken');
            if (!csrfToken) {
                csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            }
            if (!csrfToken) {
                csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]')?.value;
            }
            
            if (!csrfToken) {
                console.error('CSRF token not found');
                showError(contactForm, 'Security token missing. Please refresh the page.');
                return;
            }
            
            console.log('CSRF token found:', csrfToken ? 'Yes' : 'No');  // Debug log

            // Prepare form data
            const data = {
                name: formData.get('name')?.trim(),
                email: formData.get('email')?.trim(),
                service: formData.get('service'),
                message: formData.get('message')?.trim()
            };

            console.log('Submitting data:', data);  // Debug log

            // Client-side validation
            const missingFields = Object.entries(data)
                .filter(([_, value]) => !value)
                .map(([key]) => key);

            if (missingFields.length > 0) {
                showError(contactForm, `Missing required fields: ${missingFields.join(', ')}`);
                return;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showError(contactForm, 'Invalid email address');
                return;
            }

            // Submit form
            const jsonData = JSON.stringify(data);
            console.log('Form action:', contactForm.action);
            console.log('Sending data:', jsonData);
            
            // Log headers before sending
            const headers = {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken,
                'Accept': 'application/json'
            };
            console.log('Sending headers:', headers);

            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: headers,
                credentials: 'include',
                mode: 'same-origin',
                body: jsonData
            });

            // Handle response
            const result = await response.json();
            if (response.ok && result.success) {
                showSuccess(contactForm, result.message);
                contactForm.reset();
            } else {
                showError(contactForm, result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            showError(contactForm, 'Network error. Please try again.');
            console.error('Contact form error:', error);
        }

        // Reset loading state
        setLoading(false, submitBtn, contactForm, originalText);
    });
});

// Helper functions
function setLoading(isLoading, button, form, originalText = '') {
    if (isLoading) {
        button.innerHTML = 'Sending...';
        button.disabled = true;
        form.classList.add('form--loading');
    } else {
        button.innerHTML = originalText;
        button.disabled = false;
        form.classList.remove('form--loading');
    }
}

function showSuccess(form, message) {
    removeMessages(form);
    const successEl = document.createElement('div');
    successEl.className = 'form__success';
    successEl.textContent = message;
    form.appendChild(successEl);
    setTimeout(() => successEl.remove(), 5000);
}

function showError(form, message) {
    removeMessages(form);
    const errorEl = document.createElement('div');
    errorEl.className = 'form__error';
    errorEl.textContent = message;
    form.appendChild(errorEl);
    setTimeout(() => errorEl.remove(), 5000);
}

function removeMessages(form) {
    form.querySelectorAll('.form__success, .form__error').forEach(el => el.remove());
}

