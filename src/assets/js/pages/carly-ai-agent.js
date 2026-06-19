/**
 * Carly AI Agent Landing Page JavaScript
 * Handles scroll animations, FAQ accordion, tab switching, and hero signup
 */

import { identifyUser } from '../components/customerio.js';
import { WEBHOOK_URL } from '../config/webhooks.js';

export function initCarlyAiAgent() {
    initScrollAnimations();
    initFaqAccordion();
    initTabSwitching();
    initHeroSignup();
}

/**
 * Scroll-triggered fade-in animations using IntersectionObserver
 */
function initScrollAnimations() {
    const animEls = document.querySelectorAll('.animate-on-scroll');
    animEls.forEach(el => el.classList.add('pre-animate'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px' });

    animEls.forEach(el => observer.observe(el));
}

/**
 * FAQ accordion — single-open pattern
 */
function initFaqAccordion() {
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const answer = btn.nextElementSibling;
            const isOpen = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').classList.remove('open');
            });

            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('active');
                answer.classList.add('open');
            }
        });
    });
}

/**
 * Tab switching for Product Showcase section
 */
function initTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx);

            // Update buttons
            tabBtns.forEach(b => {
                b.classList.toggle('active', parseInt(b.dataset.idx) === idx);
            });

            // Update panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.toggle('active', parseInt(panel.dataset.panel) === idx);
            });
        });
    });
}

/**
 * Hero email signup form
 */
function initHeroSignup() {
    const form = document.getElementById('carlySignupForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('.hero-signup-input');
        const submitBtn = form.querySelector('.hero-signup-btn');
        const email = emailInput.value.trim();

        if (!email || !email.includes('@')) {
            emailInput.style.borderColor = '#ff6b6b';
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            // 1. Submit to n8n webhook
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    leadSource: 'Carly Early Access',
                    timestamp: new Date().toISOString(),
                    page: window.location.pathname,
                    referrer: document.referrer
                })
            });

            // 2. Send to Customer.io
            identifyUser({
                email: email,
                formName: 'carly_early_access',
                attributes: {
                    carly_early_access: true,
                    carly_signup_date: new Date().toISOString()
                }
            });

            // Show success
            let successMsg = form.parentElement.querySelector('.hero-signup-success');
            if (!successMsg) {
                successMsg = document.createElement('div');
                successMsg.className = 'hero-signup-success';
                successMsg.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.2"/><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>You\'re on the list! We\'ll be in touch soon.</span>';
                form.parentElement.insertBefore(successMsg, form);
            }
            successMsg.classList.add('show');

            emailInput.value = '';
            submitBtn.textContent = 'Submitted!';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        } catch (err) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
