// Privacy Hub Page JavaScript

export function initPrivacyhub() {
    // Accordion functionality
    // Make toggle function available globally for onclick handlers
    window.toggleAccordion = function(header) {
        const item = header.parentElement;
        const wasActive = item.classList.contains('active');

        // Close all items
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!wasActive) {
            item.classList.add('active');
        }
    };

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.compliance-card, .document-card, .accordion-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Stagger animation delays
    document.querySelectorAll('.compliance-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}
