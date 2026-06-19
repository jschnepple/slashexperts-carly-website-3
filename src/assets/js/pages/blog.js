// Blog Page JavaScript

import { identifyUser } from '../components/customerio.js';

export function initBlog() {
    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        if (!revealElements || revealElements.length === 0) return;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);

    // Category pill interaction
    const categoryPills = document.querySelectorAll('.category-pill');
    if (categoryPills.length > 0) {
        categoryPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                categoryPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            });
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();

            // Basic validation
            if (!email || !email.includes('@')) {
                emailInput.style.borderColor = '#ff6b6b';
                return;
            }

            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            try {
                // Identify user in Customer.io with newsletter attribute
                identifyUser({
                    email: email,
                    formName: 'newsletter',
                    attributes: {
                        newsletter_subscriber: true,
                        newsletter_signup_date: new Date().toISOString()
                    }
                });

                // Show success message above form
                let successMsg = newsletterForm.parentElement.querySelector('.newsletter-success');
                if (!successMsg) {
                    successMsg = document.createElement('div');
                    successMsg.className = 'newsletter-success';
                    successMsg.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.2"/><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Success! You have been subscribed.</span>';
                    newsletterForm.parentElement.insertBefore(successMsg, newsletterForm);
                }
                successMsg.classList.add('show');

                // Reset form
                emailInput.value = '';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 5000);

            } catch (error) {
                console.error('Newsletter signup failed:', error);
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = '#ff6b6b';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
}
