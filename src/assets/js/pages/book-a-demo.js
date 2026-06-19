/**
 * Book A Demo Page JavaScript
 * Handles Revenue Hero integration, FAQ accordion, and Customer.io tracking
 */

import { Accordion } from '../components/accordion.js';
import { identifyUser, trackEvent } from '../components/customerio.js';
import { getUtmData, flattenUtmForPayload } from '../components/utm.js';
import { WEBHOOK_URL } from '../config/webhooks.js';

// Revenue Hero Router ID
const REVENUEHERO_ROUTER_ID = '4693';

// Store captured form data for Customer.io after meeting is booked
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
                source: 'book_a_demo',
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

export function initBookADemo() {
    // Initialize FAQ Accordion
    new Accordion('.faq-item', {
        singleActive: true,
        animationDuration: 300
    });

    // Initialize Revenue Hero with automatic form handling
    const form = document.getElementById('demoForm');

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
                companySize: formData.get('companySize') || '',
                salesTeamSize: formData.get('salesTeamSize') || '',
                productInterest: formData.get('productInterest') || '',
                challenges: formData.getAll('challenges'),
                notes: formData.get('notes') || ''
            };

            // Send to Customer.io immediately on form submit
            if (capturedFormData.email) {
                identifyUser({
                    email: capturedFormData.email,
                    formName: 'book_a_demo',
                    attributes: {
                        first_name: capturedFormData.firstName,
                        last_name: capturedFormData.lastName,
                        company: capturedFormData.company,
                        job_title: capturedFormData.jobTitle,
                        company_size: capturedFormData.companySize,
                        sales_team_size: capturedFormData.salesTeamSize,
                        product_interest: capturedFormData.productInterest,
                        demo_requested: true,
                        meeting_booked: false  // Will be updated when meeting is booked
                    }
                });

                // Send to n8n webhook
                sendToWebhook(capturedFormData);
            }
        }, { capture: true }); // Use capture to run before Revenue Hero
    }

    // Handle successful meeting booking
    function handleMeetingBooked() {
        if (!form) return;

        // Update Customer.io that meeting was successfully booked
        if (capturedFormData?.email) {
            identifyUser({
                email: capturedFormData.email,
                formName: 'book_a_demo',
                attributes: {
                    meeting_booked: true,
                    meeting_booked_at: new Date().toISOString()
                },
                trackEvent: false // Already tracked on form submit
            });

            // Track meeting booked event
            trackEvent('meeting_booked', {
                form_name: 'book_a_demo',
                company: capturedFormData.company
            });
        }

        // Clear the form
        form.reset();

        // Show success message
        const existingMessage = form.querySelector('.form-success-message');
        if (existingMessage) existingMessage.remove();

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.style.cssText = `
            padding: 24px;
            margin-top: 24px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 16px;
            text-align: center;
        `;
        successMessage.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
            <h3 style="color: #10b981; font-size: 20px; font-weight: 700; margin-bottom: 8px;">
                Demo Scheduled!
            </h3>
            <p style="color: #064e3b; font-size: 15px; line-height: 1.5;">
                You'll receive a calendar invite shortly.<br>
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

        console.log('Meeting booked successfully');
    }

    if (typeof RevenueHero !== 'undefined' && form) {
        // Use Revenue Hero's built-in form handler
        // This automatically listens to form submission and opens the scheduler
        const hero = new RevenueHero({ routerId: REVENUEHERO_ROUTER_ID });
        hero.schedule('#demoForm');

        console.log('Revenue Hero initialized with router ID:', REVENUEHERO_ROUTER_ID);

        // Listen for MEETING_BOOKED event from Revenue Hero via postMessage
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'MEETING_BOOKED') {
                console.log('Revenue Hero MEETING_BOOKED event received');
                handleMeetingBooked();
            }
        });

    } else if (form) {
        // Fallback: Manual form handling if Revenue Hero not available
        console.warn('Revenue Hero not loaded, using fallback form handler');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                company: formData.get('company'),
                jobTitle: formData.get('jobTitle'),
                companySize: formData.get('companySize'),
                salesTeamSize: formData.get('salesTeamSize'),
                productInterest: formData.get('productInterest'),
                challenges: formData.getAll('challenges'),
                notes: formData.get('notes')
            };

            // Basic validation
            if (!data.firstName || !data.lastName || !data.email || !data.company) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Submit button state
            const submitBtn = form.querySelector('.btn-submit');
            const originalHTML = submitBtn.innerHTML;

            // Send to Customer.io (fallback mode)
            identifyUser({
                email: data.email,
                formName: 'book_a_demo',
                attributes: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    company: data.company,
                    job_title: data.jobTitle,
                    company_size: data.companySize,
                    sales_team_size: data.salesTeamSize,
                    product_interest: data.productInterest,
                    demo_requested: true,
                    fallback_submission: true  // Revenue Hero wasn't available
                }
            });

            // Send to n8n webhook
            await sendToWebhook(data);

            console.log('Form data (fallback):', data);

            submitBtn.innerHTML = '✓ Submitted!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.style.cssText = `
                padding: 20px;
                margin-top: 20px;
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 12px;
                color: #10b981;
                text-align: center;
            `;
            successMessage.innerHTML = `
                <strong>Thank you!</strong><br>
                We'll contact you at ${data.email} to schedule your demo.
            `;
            form.appendChild(successMessage);

            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
                successMessage.remove();
            }, 5000);
        });
    }

    // Scroll to form CTA handler (if there are anchor links)
    const scrollLinks = document.querySelectorAll('a[href="#book-demo"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const formCard = document.querySelector('.form-card');
            if (formCard) {
                formCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });

    // Nav scroll behavior
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
    });
}
