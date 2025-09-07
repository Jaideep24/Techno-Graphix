// Enhanced Form Functionality
class FormEnhancer {
    constructor() {
        this.init();
        this.submitTimeout = null;
        this.submitAttempts = new Map();
    }

    init() {
        this.setupFormAnimations();
        this.setupFieldFocus();
        this.setupAutoResize();
        this.setupFormValidation();
        this.setupSubmitHandlers();
    }
    
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.validateField(input));
                input.addEventListener('blur', () => this.validateField(input));
            });
        });
    }

    setupFormAnimations() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add entrance animation
            form.classList.add('reveal');
            
            // Add floating label effect
            this.setupFloatingLabels(form);
        });
    }

    setupFloatingLabels(form) {
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        
        inputs.forEach(input => {
            // Create floating label if placeholder exists
            if (input.placeholder) {
                this.createFloatingLabel(input);
            }
        });
    }

    createFloatingLabel(input) {
        const wrapper = document.createElement('div');
        wrapper.className = 'floating-label-wrapper';
        
        const label = document.createElement('label');
        label.className = 'floating-label';
        label.textContent = input.placeholder;
        label.setAttribute('for', input.id || '');
        
        // Wrap input
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        
        // Clear placeholder
        input.placeholder = '';
        
        // Handle focus/blur events
        input.addEventListener('focus', () => {
            wrapper.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                wrapper.classList.remove('focused');
            }
        });
        
        // Check initial value
        if (input.value) {
            wrapper.classList.add('focused');
        }
    }

    setupFieldFocus() {
        const fields = document.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        fields.forEach(field => {
            field.addEventListener('focus', (e) => {
                this.handleFieldFocus(e.target);
            });
            
            field.addEventListener('blur', (e) => {
                this.handleFieldBlur(e.target);
            });
        });
    }

    handleFieldFocus(field) {
        // Add focus glow effect
        field.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1), 0 0 20px rgba(14, 165, 233, 0.1)';
        
        // Animate field
        field.style.transform = 'scale(1.02)';
        
        // Add ripple effect to form group
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('focused');
        }
    }

    handleFieldBlur(field) {
        // Remove focus effects
        field.style.boxShadow = '';
        field.style.transform = 'scale(1)';
        
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('focused');
        }
    }

    setupAutoResize() {
        const textareas = document.querySelectorAll('.form-textarea');
        
        textareas.forEach(textarea => {
            // Set initial height
            this.adjustTextareaHeight(textarea);
            
            textarea.addEventListener('input', () => {
                this.adjustTextareaHeight(textarea);
            });
        });
    }

    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(120, textarea.scrollHeight) + 'px';
    }

    validateForm(form) {
        const fields = form.querySelectorAll('.form-input[required], .form-select[required], .form-textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear existing errors
        this.clearFieldError(field);

        // Required validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required.';
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value && !this.validateEmail(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }

        // Custom validations
        if (field.name === 'name' && value && value.length < 2) {
            errorMessage = 'Name must be at least 2 characters long.';
            isValid = false;
        }

        if (field.name === 'message' && value && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long.';
            isValid = false;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        
        // Shake animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setButtonLoading(button, loading, originalText = '') {
        if (loading) {
            button.classList.add('loading');
            button.innerHTML = `
                <div class="spinner"></div>
                <span>Processing...</span>
            `;
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.innerHTML = originalText || button.innerHTML;
            button.disabled = false;
        }
    }

    showToast(type, message) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="toast-icon ${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentNode.parentNode.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    getCSRFToken() {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
        return csrfToken ? csrfToken.value : '';
    }
}

// Initialize form enhancer
document.addEventListener('DOMContentLoaded', () => {
    window.formEnhancer = new FormEnhancer();
});

// Add floating label styles
const style = document.createElement('style');
style.textContent = `
    .floating-label-wrapper {
        position: relative;
    }

    .floating-label {
        position: absolute;
        left: var(--space-4);
        top: 50%;
        transform: translateY(-50%);
        background: var(--bg-primary);
        padding: 0 var(--space-1);
        color: var(--text-secondary);
        font-size: 1rem;
        transition: all var(--transition-base);
        pointer-events: none;
        z-index: 1;
    }

    .floating-label-wrapper.focused .floating-label,
    .floating-label-wrapper:has(.form-input:not(:placeholder-shown)) .floating-label,
    .floating-label-wrapper:has(.form-textarea:not(:placeholder-shown)) .floating-label {
        top: 0;
        font-size: 0.75rem;
        color: var(--primary-500);
        font-weight: 600;
    }

    .floating-label-wrapper .form-textarea + .floating-label {
        top: var(--space-3);
        transform: translateY(0);
    }

    .floating-label-wrapper.focused .form-textarea + .floating-label,
    .floating-label-wrapper:has(.form-textarea:not(:placeholder-shown)) .floating-label {
        top: 0;
        transform: translateY(-50%);
    }

    .form-group.focused {
        transform: scale(1.01);
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);