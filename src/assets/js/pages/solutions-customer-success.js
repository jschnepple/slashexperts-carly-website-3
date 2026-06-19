export function initSolutionsCustomerSuccess() {
    // Workflow step sequential animation on scroll
    const workflowSteps = document.querySelectorAll('.workflow-step');
    const workflowContainer = document.querySelector('.workflow-steps');

    if (workflowSteps.length > 0 && workflowContainer) {
        let workflowAnimated = false;

        const workflowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !workflowAnimated) {
                    workflowAnimated = true;

                    // Animate steps sequentially with 400ms delay between each
                    workflowSteps.forEach((step, index) => {
                        setTimeout(() => {
                            step.classList.add('active');
                        }, index * 400);
                    });

                    // Stop observing after animation triggered
                    workflowObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        workflowObserver.observe(workflowContainer);
    }

    // Scroll animations with IntersectionObserver
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

    // Observe elements for scroll animations
    document.querySelectorAll('.pain-card, .usecase-card, .solution-feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for metrics
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + suffix;
        }, 30);
    }

    // Trigger counter animation when metrics banner is visible
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const metricValues = entry.target.querySelectorAll('.metric-value');
                // Animation triggered - implement counter if needed
                metricsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const metricsBanner = document.querySelector('.metrics-banner');
    if (metricsBanner) {
        metricsObserver.observe(metricsBanner);
    }

    // Reveal elements with scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        if (!revealElements) return;
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
}
