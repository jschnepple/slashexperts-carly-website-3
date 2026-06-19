// CRM Integration page JavaScript

export function initCrmintegration() {
    // Dashboard Tab Switching
    const tabs = document.querySelectorAll('.dashboard-tab');
    const showcases = document.querySelectorAll('.dashboard-showcase');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Hide all showcases
            showcases.forEach(showcase => {
                showcase.classList.remove('active');
            });
            
            // Show target showcase
            const targetShowcase = document.querySelector(`.dashboard-showcase[data-showcase="${targetTab}"]`);
            if (targetShowcase) {
                targetShowcase.classList.add('active');
            }
        });
    });

    // ROI Stats Counter Animation
    const roiCounterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const isDecimal = counter.getAttribute('data-decimal') === 'true';
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Easing function (ease-out cubic)
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = target * easeOut;
                        
                        if (isDecimal) {
                            counter.textContent = current.toFixed(1);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            if (isDecimal) {
                                counter.textContent = target.toFixed(1);
                            } else {
                                counter.textContent = target;
                            }
                        }
                    }
                    
                    requestAnimationFrame(updateCounter);
                });
                roiCounterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const roiSection = document.getElementById('roiStats');
    if (roiSection) {
        roiCounterObserver.observe(roiSection);
    }

    // Scroll-triggered animations for various elements
    const fadeInElements = document.querySelectorAll('.integration-card, .feature-card, .step, .section-badge, .section-title, .other-crms-card, .crm-option, .dashboard-showcase');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animations
                setTimeout(() => {
                    entry.target.classList.add('fade-in-visible');
                }, index * 100);
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeInElements.forEach(el => {
        el.classList.add('fade-in-element');
        fadeInObserver.observe(el);
    });

    // Parallax effect for floating badges
    document.addEventListener('mousemove', (e) => {
        const badges = document.querySelectorAll('.floating-badge');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        badges.forEach((badge, index) => {
            const speed = (index + 1) * 8;
            const x = mouseX * speed;
            const y = mouseY * speed;
            badge.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}
