/**
 * Form Handler Component
 * Handles form submission to N8N webhook, validation, PDF downloads, and Customer.io
 */

import { identifyUser, trackEvent } from './customerio.js';
import { getUtmData, flattenUtmForPayload } from './utm.js';

export class FormHandler {
    constructor(formId, successId, options = {}) {
        this.form = document.getElementById(formId);
        this.success = document.getElementById(successId);
        this.options = {
            webhookUrl: options.webhookUrl || '',
            pdfUrl: options.pdfUrl || null,
            validateEmail: true,
            scrollOnSuccess: true,
            downloadOnSuccess: true,
            // Customer.io integration options
            customerio: {
                enabled: options.customerio?.enabled ?? true,  // Enabled by default
                formName: options.customerio?.formName || formId,
                additionalAttributes: options.customerio?.additionalAttributes || {}
            },
            ...options
        };

        if (this.form) {
            this.init();
        }
    }

    init() {
        // Bind submit handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Add input validation listeners
        this.addInputValidation();

        // Add real-time error clearing
        this.addErrorClearingListeners();
    }

    addInputValidation() {
        // Email validation
        const emailInput = this.form.querySelector('[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', (e) => this.validateEmail(e.target));
        }

        // Required fields validation
        const requiredInputs = this.form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateRequired(input));
        });
    }

    addErrorClearingListeners() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });
    }

    validateEmail(input) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = regex.test(input.value.trim());

        if (input.value && !isValid) {
            input.classList.add('error');
            return false;
        } else {
            input.classList.remove('error');
            return true;
        }
    }

    validateRequired(input) {
        if (!input.value.trim()) {
            input.classList.add('error');
            return false;
        } else {
            input.classList.remove('error');
            return true;
        }
    }

    validateForm() {
        let isValid = true;
        const errorMessage = this.form.querySelector('.form-error');

        // Clear previous errors
        if (errorMessage) {
            errorMessage.classList.remove('active');
        }

        // Validate required fields
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            }
        });

        // Validate email specifically
        const emailInput = this.form.querySelector('[type="email"]');
        if (emailInput && !this.validateEmail(emailInput)) {
            isValid = false;
        }

        // Show error message if validation failed
        if (!isValid && errorMessage) {
            errorMessage.textContent = 'Please fill in all required fields correctly.';
            errorMessage.classList.add('active');
        }

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Show loading state
        this.setLoading(true);

        // Collect form data
        const formData = this.collectFormData();

        try {
            // Submit to N8N webhook
            if (this.options.webhookUrl) {
                await this.submitToWebhook(formData);
            }

            // Send to Customer.io
            if (this.options.customerio.enabled && formData.email) {
                this.sendToCustomerIO(formData);
            }

            // Download PDF if configured
            if (this.options.downloadOnSuccess && this.options.pdfUrl) {
                this.downloadPDF();
            }

            // Show success state
            this.showSuccess();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Something went wrong. Please try again or contact support.');
        } finally {
            this.setLoading(false);
        }
    }

    collectFormData() {
        const formData = {};
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (input.checked) {
                    if (!formData[input.name]) {
                        formData[input.name] = [];
                    }
                    formData[input.name].push(input.value);
                }
            } else if (input.type === 'radio') {
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else if (input.name) {
                formData[input.name] = input.value;
            }
        });

        // Add metadata
        formData.timestamp = new Date().toISOString();
        formData.page = window.location.pathname;
        formData.referrer = document.referrer;

        // Add UTM parameters
        const utmData = flattenUtmForPayload(getUtmData());
        Object.assign(formData, utmData);

        return formData;
    }

    async submitToWebhook(formData) {
        const response = await fetch(this.options.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Webhook request failed: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Send form data to Customer.io
     * Identifies the user and tracks the form submission event
     */
    sendToCustomerIO(formData) {
        const { formName, additionalAttributes } = this.options.customerio;

        // Get UTM data for Customer.io
        const utmData = flattenUtmForPayload(getUtmData());

        // Extract standard fields from form data
        const attributes = {
            first_name: formData.firstName || formData.first_name || null,
            last_name: formData.lastName || formData.last_name || null,
            company: formData.company || null,
            job_title: formData.jobTitle || formData.job_title || formData.role || null,
            // Include UTM parameters
            ...utmData,
            // Include any metadata from options
            ...(this.options.metadata || {}),
            // Include additional attributes from customerio config
            ...additionalAttributes
        };

        // Remove null values
        Object.keys(attributes).forEach(key => {
            if (attributes[key] === null || attributes[key] === undefined) {
                delete attributes[key];
            }
        });

        // Identify user in Customer.io
        identifyUser({
            email: formData.email,
            formName: formName,
            attributes: attributes,
            trackEvent: true
        });

        // Track PDF download if applicable
        if (this.options.pdfUrl) {
            trackEvent('pdf_downloaded', {
                form_name: formName,
                pdf_filename: this.options.pdfFilename || 'download.pdf'
            });
        }
    }

    downloadPDF() {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = this.options.pdfUrl;
        link.download = this.options.pdfFilename || 'download.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    setLoading(loading) {
        const submitBtn = this.form.querySelector('[type="submit"]');
        if (!submitBtn) return;

        if (loading) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
        }
    }

    showSuccess() {
        // Hide form
        if (this.form.parentElement) {
            this.form.parentElement.style.display = 'none';
        }

        // Show success message
        if (this.success) {
            this.success.classList.add('active');

            // Scroll to success message on mobile
            if (this.options.scrollOnSuccess && window.innerWidth < 992) {
                setTimeout(() => {
                    this.success.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }
        }
    }

    showError(message) {
        const errorMessage = this.form.querySelector('.form-error');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('active');
        } else {
            alert(message);
        }
    }

    reset() {
        this.form.reset();
        const inputs = this.form.querySelectorAll('.error');
        inputs.forEach(input => input.classList.remove('error'));

        const errorMessage = this.form.querySelector('.form-error');
        if (errorMessage) {
            errorMessage.classList.remove('active');
        }
    }
}

/**
 * Revenue Hero Integration Helper
 * For Book A Demo page
 */
export function initRevenueHero(containerId, routerId) {
    // Check if Revenue Hero script is loaded
    if (typeof RevenueHero === 'undefined') {
        console.error('Revenue Hero script not loaded');
        return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    // Initialize Revenue Hero
    try {
        RevenueHero.init({
            routerId: routerId,
            targetElement: `#${containerId}`
        });
    } catch (error) {
        console.error('Revenue Hero initialization failed:', error);
    }
}
