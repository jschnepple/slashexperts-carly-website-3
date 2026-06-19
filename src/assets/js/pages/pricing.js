/**
 * Pricing Page JavaScript Module
 * Handles billing toggle, FAQ accordion, sales modal, and RevenueHero integration
 */

import { identifyUser, trackEvent } from '../components/customerio.js';
import { getUtmData, flattenUtmForPayload } from '../components/utm.js';
import { WEBHOOK_URL } from '../config/webhooks.js';

// Revenue Hero Router ID (same as book-a-demo page)
const REVENUEHERO_ROUTER_ID = '4693';

// Store captured form data for Customer.io
let capturedFormData = null;

/**
 * Send form data to n8n webhook
 */
async function sendToWebhook(data) {
    try {
        const utmData = flattenUtmForPayload(getUtmData());
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                source: 'pricing_talk_to_sales',
                page_url: window.location.href,
                submitted_at: new Date().toISOString(),
                // UTM parameters
                ...utmData
            })
        });

        if (!response.ok) {
            console.error('Webhook response not OK:', response.status);
        } else {
            console.log('Form data sent to n8n webhook successfully');
        }
    } catch (error) {
        console.error('Error sending to webhook:', error);
    }
}

export function initPricing() {
    // Initialize all components
    initBillingToggle();
    initFAQAccordion();
    initSalesModal();
}

/**
 * Billing toggle functionality
 * Switches between monthly and annual pricing display
 * Note: Since prices are now hidden, this just toggles the visual state
 */
function initBillingToggle() {
    const billingButtons = document.querySelectorAll('.billing-option');

    billingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const billingType = this.dataset.billing;
            toggleBilling(billingType);
        });
    });
}

function toggleBilling(type) {
    // Update active button state
    const buttons = document.querySelectorAll('.billing-option');
    buttons.forEach(btn => {
        if (btn.dataset.billing === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Show/hide annual savings message
    const annualSavings = document.querySelectorAll('.annual-savings');
    annualSavings.forEach(el => {
        if (type === 'annual') {
            el.classList.add('visible');
        } else {
            el.classList.remove('visible');
        }
    });
}

/**
 * FAQ Accordion functionality
 * Expands/collapses FAQ items
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Sales Modal functionality
 * Opens modal, handles RevenueHero form integration
 */
function initSalesModal() {
    const modal = document.getElementById('salesModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.sales-modal-close');
    const form = document.getElementById('salesForm');

    // Find all trigger buttons
    const triggers = document.querySelectorAll('[data-sales-modal="salesModal"]');

    // Open modal on trigger click
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openSalesModal(modal);
        });
    });

    // Close on overlay click (but not modal content)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSalesModal(modal);
        }
    });

    // Close on close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeSalesModal(modal);
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeSalesModal(modal);
        }
    });

    // Capture form data before Revenue Hero processes it
    if (form) {
        form.addEventListener('submit', (e) => {
            // Capture the data before Revenue Hero processes it
            const formData = new FormData(form);
            capturedFormData = {
                firstName: formData.get('firstName') || '',
                lastName: formData.get('lastName') || '',
                email: formData.get('email') || '',
                company: formData.get('company') || '',
                jobTitle: formData.get('jobTitle') || '',
                companySize: formData.get('companySize') || ''
            };

            // Send to Customer.io immediately on form submit
            if (capturedFormData.email) {
                identifyUser({
                    email: capturedFormData.email,
                    formName: 'pricing_talk_to_sales',
                    attributes: {
                        first_name: capturedFormData.firstName,
                        last_name: capturedFormData.lastName,
                        company: capturedFormData.company,
                        job_title: capturedFormData.jobTitle,
                        company_size: capturedFormData.companySize,
                        pricing_inquiry: true,
                        demo_requested: true,
                        meeting_booked: false
                    }
                });

                // Send to n8n webhook
                sendToWebhook(capturedFormData);
            }
        }, { capture: true }); // Use capture to run before Revenue Hero
    }

    // Initialize Revenue Hero if available
    if (typeof RevenueHero !== 'undefined' && form) {
        const hero = new RevenueHero({ routerId: REVENUEHERO_ROUTER_ID });
        hero.schedule('#salesForm');
        console.log('Revenue Hero initialized for pricing sales modal');

        // Listen for MEETING_BOOKED event from Revenue Hero
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'MEETING_BOOKED') {
                console.log('Revenue Hero MEETING_BOOKED event received');
                handleMeetingBooked(form, modal);
            }
        });
    } else if (form) {
        // Fallback: Manual form handling if Revenue Hero not available
        console.warn('Revenue Hero not loaded, using fallback form handler');
        form.addEventListener('submit', handleFallbackSubmit);
    }
}

/**
 * Open sales modal
 */
function openSalesModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('sales-modal-open');

    // Focus the first input for accessibility
    const firstInput = modal.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }

    // Track modal open event
    trackEvent('pricing_modal_opened', {
        page_url: window.location.pathname
    });
}

/**
 * Close sales modal
 */
function closeSalesModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('sales-modal-open');
}

/**
 * Handle successful meeting booking
 */
function handleMeetingBooked(form, modal) {
    // Update Customer.io that meeting was successfully booked
    if (capturedFormData?.email) {
        identifyUser({
            email: capturedFormData.email,
            formName: 'pricing_talk_to_sales',
            attributes: {
                meeting_booked: true,
                meeting_booked_at: new Date().toISOString()
            },
            trackEvent: false
        });

        trackEvent('meeting_booked', {
            form_name: 'pricing_talk_to_sales',
            company: capturedFormData.company
        });
    }

    // Show success state
    if (form) {
        form.reset();

        const existingMessage = form.querySelector('.form-success-message');
        if (existingMessage) existingMessage.remove();

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.style.cssText = `
            padding: 24px;
            margin-top: 16px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 12px;
            text-align: center;
        `;
        successMessage.innerHTML = `
            <div style="font-size: 36px; margin-bottom: 12px;">🎉</div>
            <h3 style="color: #10b981; font-size: 18px; font-weight: 700; margin-bottom: 8px;">
                Demo Scheduled!
            </h3>
            <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; line-height: 1.5;">
                Check your email for the calendar invite.<br>
                We look forward to showing you SlashExperts!
            </p>
        `;
        form.appendChild(successMessage);

        // Update submit button
        const submitBtn = form.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.innerHTML = '✓ Demo Scheduled!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            submitBtn.disabled = true;
        }
    }

    // Close modal after delay
    setTimeout(() => {
        closeSalesModal(modal);
        // Reset form state after modal closes
        setTimeout(() => {
            if (form) {
                form.reset();
                const successMsg = form.querySelector('.form-success-message');
                if (successMsg) successMsg.remove();
                const submitBtn = form.querySelector('.btn-submit');
                if (submitBtn) {
                    submitBtn.innerHTML = `
                        Book My Demo
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14"/>
                            <path d="m12 5 7 7-7 7"/>
                        </svg>
                    `;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }
            }
        }, 500);
    }, 3000);
}

/**
 * Fallback form submission handler (when Revenue Hero is not available)
 */
async function handleFallbackSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        company: formData.get('company'),
        jobTitle: formData.get('jobTitle'),
        companySize: formData.get('companySize'),
        source: 'pricing_page'
    };

    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.company) {
        alert('Please fill in all required fields.');
        return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Submitting...';
    submitBtn.disabled = true;

    // Send to Customer.io
    identifyUser({
        email: data.email,
        formName: 'pricing_talk_to_sales',
        attributes: {
            first_name: data.firstName,
            last_name: data.lastName,
            company: data.company,
            job_title: data.jobTitle,
            company_size: data.companySize,
            pricing_inquiry: true,
            fallback_submission: true
        }
    });

    // Send to n8n webhook
    await sendToWebhook(data);

    // Show success
    submitBtn.innerHTML = '✓ Submitted!';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.style.cssText = `
        padding: 16px;
        margin-top: 16px;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 10px;
        color: #10b981;
        text-align: center;
        font-size: 14px;
    `;
    successMessage.innerHTML = `
        <strong>Thank you!</strong><br>
        We'll contact you at ${data.email} shortly.
    `;
    form.appendChild(successMessage);

    setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        successMessage.remove();
    }, 5000);
}
