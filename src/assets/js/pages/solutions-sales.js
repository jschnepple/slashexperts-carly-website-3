/**
 * Solutions for Sales Teams Page JavaScript
 * Handles tab functionality and animations
 */

export function initSolutionsSales() {
    // Tab functionality for use cases
    initUseCaseTabs();

    // Filter tag toggle for technical mockup
    initFilterTags();

    // Animate sections on scroll
    initScrollAnimations();
}

/**
 * Initialize use case tabs functionality
 */
function initUseCaseTabs() {
    const tabs = document.querySelectorAll('.usecase-tab');
    const panels = document.querySelectorAll('.usecase-panel');

    if (!tabs.length || !panels.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.getAttribute('data-tab');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${targetPanel}`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/**
 * Initialize filter tag toggle for technical mockup
 */
function initFilterTags() {
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });
}

/**
 * Initialize scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once animated, no need to observe anymore
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
        '.pain-card, .solution-card, .how-step, .result-card, .story-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(el);
    });
}

// Add visible state styles
const style = document.createElement('style');
style.textContent = `
    .pain-card.visible,
    .solution-card.visible,
    .how-step.visible,
    .result-card.visible,
    .story-card.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
