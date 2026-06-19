// Download Report 2026 Page JavaScript

import { FormHandler } from '../components/forms.js';
import { WEBHOOK_URL } from '../config/webhooks.js';

export function initDownloadReport() {
    // ==================== DYNAMIC URGENCY DATE ====================
    const urgencyDate = document.getElementById('urgency-date');
    if (urgencyDate) {
        const now = new Date();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const month = lastDay.toLocaleString('en-US', { month: 'short' });
        const day = lastDay.getDate();
        urgencyDate.textContent = `${month} ${day}`;
    }

    // ==================== URGENCY BANNER + NAV OFFSET ====================
    const nav = document.querySelector('nav');
    const banner = document.querySelector('.urgency-banner');

    if (banner && nav) {
        nav.classList.add('with-banner');
    }

    // ==================== LIVE DOWNLOAD COUNTER ====================
    // Live counter (fluctuates between 30-80)
    function updateLiveCounter() {
        const counter = document.getElementById('liveCounter');
        if (counter) {
            const current = parseInt(counter.textContent) || 47;
            const newValue = Math.max(30, Math.min(80, current + Math.floor(Math.random() * 5) - 2));
            counter.textContent = newValue;
        }
    }

    // Total download count (increments gradually)
    function updateDownloadCount() {
        const counter = document.getElementById('downloadCount');
        if (counter) {
            const current = parseInt(counter.textContent.replace(',', ''));
            counter.textContent = (current + Math.floor(Math.random() * 3) + 1).toLocaleString();
        }
    }

    // Initialize counters
    const liveCounter = document.getElementById('liveCounter');
    const downloadCount = document.getElementById('downloadCount');

    if (liveCounter) {
        setInterval(updateLiveCounter, 8000);
    }

    if (downloadCount) {
        setInterval(updateDownloadCount, 15000);
    }

    // ==================== SMOOTH SCROLL TO FORM ====================
    const formAnchors = document.querySelectorAll('a[href="#download"]');

    formAnchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const formSection = document.getElementById('download');
            if (formSection) {
                const offset = 100; // Account for sticky nav
                const elementPosition = formSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== SCROLL-TRIGGERED ANIMATIONS ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe stat cards in sneak peek section
    const statCards = document.querySelectorAll('.stat-reveal');
    statCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe chapter cards
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe insight cards
    const insightCards = document.querySelectorAll('.insight-card');
    insightCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // ==================== FORM HANDLER INTEGRATION ====================
    const downloadForm = document.getElementById('downloadForm');
    const formSuccess = document.getElementById('formSuccess');
    const downloadAgainBtn = document.getElementById('downloadAgain');

    if (downloadForm && formSuccess) {
        // Get PDF configuration from form data attributes
        const pdfUrl = downloadForm.dataset.pdfUrl || '/assets/pdfs/2026-gtm-report.pdf';
        const pdfFilename = downloadForm.dataset.pdfFilename || '2026-GTM-Report-SlashExperts-Heinz.pdf';

        // Initialize FormHandler with N8N webhook
        const formHandler = new FormHandler('downloadForm', 'formSuccess', {
            webhookUrl: WEBHOOK_URL,
            pdfUrl: pdfUrl,
            pdfFilename: pdfFilename,
            validateEmail: true,
            scrollOnSuccess: false, // We handle scroll in success state
            downloadOnSuccess: true,
            metadata: {
                leadSource: '2026 GTM Report',
                reportType: 'Proof-to-Performance Gap',
                partnershipBadge: 'SlashExperts × Heinz Marketing'
            },
            customerio: {
                enabled: true,
                formName: 'download_report_2026'
            }
        });

        // Download Again button handler
        if (downloadAgainBtn) {
            downloadAgainBtn.addEventListener('click', () => {
                // Trigger PDF download
                if (pdfUrl) {
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.download = pdfFilename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        }

        // Close success overlay handlers
        const closeSuccessOverlay = () => {
            formSuccess.classList.remove('active');
        };

        // Close button handler
        const closeBtn = formSuccess.querySelector('.success-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSuccessOverlay);
        }

        // Click outside to close (click on backdrop)
        formSuccess.addEventListener('click', (e) => {
            // Only close if clicking the backdrop itself, not the content
            if (e.target === formSuccess) {
                closeSuccessOverlay();
            }
        });

        // Prevent clicks inside the content from closing the overlay
        const successContent = formSuccess.querySelector('.success-content');
        if (successContent) {
            successContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && formSuccess.classList.contains('active')) {
                closeSuccessOverlay();
            }
        });
    }

    // ==================== NAVIGATION SCROLL BEHAVIOR ====================
    let lastScrollY = window.pageYOffset;

    function handleNavScroll() {
        const currentScrollY = window.pageYOffset;

        if (nav && banner) {
            // Toggle banner visibility and nav offset based on scroll position
            if (currentScrollY > 50) {
                // Scrolled down - hide banner and remove nav offset
                nav.classList.remove('with-banner');
                nav.classList.add('scrolled');
                banner.style.transform = 'translateY(-100%)';
            } else {
                // At top - show banner and add nav offset
                nav.classList.add('with-banner');
                nav.classList.remove('scrolled');
                banner.style.transform = 'translateY(0)';
            }
        } else if (nav) {
            // Fallback if banner doesn't exist
            if (currentScrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Initial check

    // ==================== REPORT COVER PARALLAX (SUBTLE) ====================
    const reportCover = document.querySelector('.report-cover');

    if (reportCover) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

            if (scrolled < heroHeight) {
                const parallaxAmount = scrolled * 0.3;
                reportCover.style.transform = `rotateY(-5deg) rotateX(2deg) translateY(${parallaxAmount}px)`;
            }
        }, { passive: true });
    }

    // ==================== CHAPTER PREVIEW CLICK TRACKING ====================
    const chapterLinks = document.querySelectorAll('.chapter-link');

    chapterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Track which chapter was clicked (optional analytics)
            const chapterCard = link.closest('.chapter-card');
            const chapterNumber = chapterCard?.querySelector('.chapter-number')?.textContent;
            const chapterTitle = chapterCard?.querySelector('.chapter-title')?.textContent;

            console.log(`Chapter clicked: ${chapterNumber} - ${chapterTitle}`);

            // Scroll to form
            const formSection = document.getElementById('download');
            if (formSection) {
                const offset = 100;
                const elementPosition = formSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== CONSOLE LOG FOR DEBUGGING ====================
    console.log('Download Report 2026 page initialized');
    console.log('Live counter:', liveCounter ? 'Active' : 'Not found');
    console.log('Form handler:', downloadForm ? 'Active' : 'Not found');
    console.log('Urgency banner:', banner ? 'Active' : 'Not found');
}
