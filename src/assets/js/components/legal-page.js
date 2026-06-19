/**
 * Legal Pages Common JavaScript
 * Shared functionality for Privacy, Terms, DPA, GDPR, and CCPA pages
 */

/**
 * Initialize scroll progress bar
 */
function initScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * Initialize TOC scroll spy - highlights active section in sidebar
 */
function initTOCScrollSpy() {
    const sections = document.querySelectorAll('.legal-section');
    const tocLinks = document.querySelectorAll('.toc-list a');

    if (sections.length === 0 || tocLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-120px 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize smooth scroll for TOC links
 */
function initTOCSmoothScroll() {
    const tocLinks = document.querySelectorAll('.toc-list a');

    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Initialize print button functionality
 */
function initPrintButton() {
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

/**
 * Main initialization function for legal pages
 * Call this from page-specific JS files
 */
export function initLegalPage() {
    initScrollProgress();
    initTOCScrollSpy();
    initTOCSmoothScroll();
    initPrintButton();
}
