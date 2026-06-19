// Expert Booking Page JavaScript
export function initExpertBooking() {
    // Use Case Tab Switching
    const usecaseTabs = document.querySelectorAll('.usecase-tab');
    const usecaseContents = document.querySelectorAll('.usecase-content');
    
    if (usecaseTabs.length > 0) {
        usecaseTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Remove active from all tabs
                usecaseTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Hide all content
                usecaseContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show target content
                const targetContent = document.querySelector(`.usecase-content[data-content="${targetTab}"]`);
                if (targetContent) {
                    setTimeout(() => {
                        targetContent.classList.add('active');
                    }, 50);
                }
            });
        });
    }

    // Demo Panel Tab Switching
    const demoTabs = document.querySelectorAll('.demo-tab');
    const demoPanels = document.querySelectorAll('.demo-panel');
    
    if (demoTabs.length > 0) {
        demoTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetDemo = tab.getAttribute('data-demo');
                
                // Remove active from all tabs
                demoTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Hide all panels
                demoPanels.forEach(panel => {
                    panel.classList.remove('active');
                });
                
                // Show target panel
                const targetPanel = document.querySelector(`.demo-panel[data-panel="${targetDemo}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // Interactive filter tags
    const filterTags = document.querySelectorAll('.criteria-tag, .filter-tag');
    if (filterTags.length > 0) {
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                this.classList.toggle('selected');
                this.classList.toggle('active');
            });
        });
    }

    // ROI Stats Counter Animation
    const roiSection = document.getElementById('roiStats');
    if (roiSection) {
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

        roiCounterObserver.observe(roiSection);
    }
}
