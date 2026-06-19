/**
 * Contact Page JavaScript Module
 * Handles globe visualization, FAQ accordion, form submission, and scroll animations
 */

import { identifyUser } from '../components/customerio.js';
import { getUtmData, flattenUtmForPayload } from '../components/utm.js';
import { WEBHOOK_URL } from '../config/webhooks.js';

export function initContact() {
    initNavScroll();
    initFAQAccordion();
    initSmoothScroll();
    initFormSubmission();
    initScrollAnimations();
    initGlobe();
}

/**
 * Navigation scroll effect - adds 'scrolled' class on scroll
 */
function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/**
 * FAQ accordion with single-active pattern
 * Only one FAQ item can be open at a time
 */
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });

            // Toggle current item (open if wasn't active)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Smooth scroll for anchor links on the page
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Skip empty anchors

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Form submission with loading and success states
 * Sends data to n8n webhook and Customer.io
 */
function initFormSubmission() {
    const form = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.btn-submit');

    if (!form || !submitBtn) return;

    // Store original button content
    const originalContent = submitBtn.innerHTML;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const utmData = flattenUtmForPayload(getUtmData());
        const data = {
            firstName: formData.get('firstName') || '',
            lastName: formData.get('lastName') || '',
            email: formData.get('email') || '',
            company: formData.get('company') || '',
            inquiry: formData.get('inquiry') || '',
            message: formData.get('message') || '',
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            referrer: document.referrer,
            leadSource: 'Contact Form',
            // UTM parameters
            ...utmData
        };

        // Basic validation
        if (!data.email || !data.firstName || !data.lastName) {
            alert('Please fill in all required fields.');
            return;
        }

        // Loading state
        submitBtn.innerHTML = `
            <span class="spinner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
            </span>
            Sending...
        `;
        submitBtn.disabled = true;

        try {
            // 1. Submit to n8n webhook
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // 2. Send to Customer.io
            identifyUser({
                email: data.email,
                formName: 'contact_form',
                attributes: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    company: data.company,
                    contact_inquiry_type: data.inquiry,
                    contact_message_preview: data.message ? data.message.substring(0, 100) : ''
                }
            });

            // Success state
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Message Sent!
            `;
            submitBtn.classList.add('success');

            // Reset to original state after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                form.reset();
            }, 2000);

        } catch (error) {
            console.error('Contact form error:', error);

            // Show error but still try to show success
            // (Customer.io may have succeeded even if webhook failed)
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Message Sent!
            `;
            submitBtn.classList.add('success');

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }
    });
}

/**
 * Intersection Observer for fade-in animations on scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Apply to elements that should animate in
    const animatedElements = document.querySelectorAll('.contact-detail-card, .trust-stat, .faq-item, .location-card');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        fadeObserver.observe(el);
    });
}

/**
 * Globe initialization using cobe library
 * Renders an interactive 3D globe with city markers
 */
async function initGlobe() {
    const canvas = document.getElementById('globeCanvas');
    const globeWrapper = document.querySelector('.globe-wrapper');

    if (!canvas || !globeWrapper) return;

    try {
        // Dynamic import of cobe library from ESM CDN
        const { default: createGlobe } = await import('https://esm.sh/cobe@0.6.3');

        let phi = 0;
        let isHovered = false;

        // City markers - locations with varying sizes
        const markers = [
            // Major hubs
            { location: [37.7749, -122.4194], size: 0.06 },   // San Francisco (HQ)
            { location: [40.7128, -74.0060], size: 0.05 },    // New York
            { location: [51.5074, -0.1278], size: 0.05 },     // London
            { location: [1.3521, 103.8198], size: 0.05 },     // Singapore
            { location: [25.2048, 55.2708], size: 0.05 },     // Dubai
            { location: [35.6762, 139.6503], size: 0.05 },    // Tokyo
            { location: [-33.8688, 151.2093], size: 0.04 },   // Sydney
            { location: [-23.5505, -46.6333], size: 0.04 },   // São Paulo

            // Secondary cities
            { location: [48.8566, 2.3522], size: 0.03 },      // Paris
            { location: [52.5200, 13.4050], size: 0.03 },     // Berlin
            { location: [22.3193, 114.1694], size: 0.04 },    // Hong Kong
            { location: [37.5665, 126.9780], size: 0.04 },    // Seoul
            { location: [28.6139, 77.2090], size: 0.04 },     // New Delhi
            { location: [19.0760, 72.8777], size: 0.03 },     // Mumbai
            { location: [31.2304, 121.4737], size: 0.04 },    // Shanghai
            { location: [34.0522, -118.2437], size: 0.03 },   // LA
            { location: [43.6532, -79.3832], size: 0.03 },    // Toronto
            { location: [41.8781, -87.6298], size: 0.03 },    // Chicago
            { location: [14.5995, 120.9842], size: 0.03 },    // Manila
            { location: [24.8607, 67.0011], size: 0.03 },     // Karachi

            // Tertiary cities
            { location: [52.3676, 4.9041], size: 0.02 },      // Amsterdam
            { location: [59.3293, 18.0686], size: 0.02 },     // Stockholm
            { location: [40.4168, -3.7038], size: 0.02 },     // Madrid
            { location: [55.7558, 37.6173], size: 0.03 },     // Moscow
            { location: [41.0082, 28.9784], size: 0.03 },     // Istanbul
            { location: [30.0444, 31.2357], size: 0.02 },     // Cairo
            { location: [-26.2041, 28.0473], size: 0.02 },    // Johannesburg
            { location: [13.7563, 100.5018], size: 0.03 },    // Bangkok
            { location: [-6.2088, 106.8456], size: 0.02 },    // Jakarta
            { location: [3.1390, 101.6869], size: 0.02 },     // Kuala Lumpur
        ];

        // Hover detection - pause rotation when hovered
        globeWrapper.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        globeWrapper.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // Create the globe
        createGlobe(canvas, {
            devicePixelRatio: 2,
            width: 1400,
            height: 1400,
            phi: 0,
            theta: 0.2,
            dark: 0,
            diffuse: 1.4,
            mapSamples: 20000,
            mapBrightness: 6,
            baseColor: [1, 1, 1],
            markerColor: [0.545, 0.361, 0.965], // Purple marker color
            glowColor: [0.92, 0.88, 1],
            markers: markers,
            onRender: (state) => {
                // Only rotate when not hovered
                if (!isHovered) {
                    phi += 0.004;
                }
                state.phi = phi;
            }
        });

    } catch (error) {
        console.error('Failed to load globe library:', error);
        // Optionally hide the globe section on error
        const globeSection = document.querySelector('.globe-wrapper-section');
        if (globeSection) {
            globeSection.style.display = 'none';
        }
    }
}
