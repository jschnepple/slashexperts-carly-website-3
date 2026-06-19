/**
 * Blog Post Page JavaScript
 * Handles post-specific interactions like copy link, smooth scrolling, and reading progress
 */

import { identifyUser } from '../components/customerio.js';

export function initBlogPost() {
    // Initialize copy link functionality
    initCopyLink();

    // Initialize reading progress indicator (optional)
    initReadingProgress();

    // Initialize smooth scroll for anchor links
    initSmoothScroll();

    // Initialize newsletter form
    initNewsletterForm();

    // Log initialization
    console.log('Blog post page initialized');
}

/**
 * Copy link button functionality
 */
function initCopyLink() {
    const copyButtons = document.querySelectorAll('.copy-link');

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                button.classList.add('copied');

                // Remove copied class after 2 seconds
                setTimeout(() => {
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        });
    });
}

/**
 * Reading progress indicator
 * Shows a progress bar at the top of the page as user scrolls
 */
function initReadingProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--violet) 0%, var(--accent-cyan) 100%);
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    // Calculate and update progress on scroll
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    const updateProgress = () => {
        const contentRect = postContent.getBoundingClientRect();
        const contentTop = contentRect.top + window.scrollY;
        const contentHeight = contentRect.height;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        // Calculate progress (0 to 100)
        const progress = Math.min(100, Math.max(0,
            ((scrollY - contentTop + windowHeight * 0.3) / contentHeight) * 100
        ));

        progressBar.style.width = `${progress}%`;
    };

    // Throttle scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial update
    updateProgress();
}

/**
 * Smooth scroll for anchor links within the post
 */
function initSmoothScroll() {
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    postContent.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);

        if (target) {
            e.preventDefault();
            const headerOffset = 100; // Account for fixed header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
}

/**
 * Newsletter form submission handler
 */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form-inline');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');
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
            let successMsg = form.parentElement.querySelector('.newsletter-success');
            if (!successMsg) {
                successMsg = document.createElement('div');
                successMsg.className = 'newsletter-success';
                successMsg.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.2"/><path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Success! You have been subscribed.</span>';
                form.parentElement.insertBefore(successMsg, form);
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
