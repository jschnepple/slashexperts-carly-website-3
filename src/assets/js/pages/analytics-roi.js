import { FormHandler } from '../components/forms.js';
import { WEBHOOK_URL } from '../config/webhooks.js';

// Dashboard tab switching
export function initAnalyticsroi() {
    const tabs = document.querySelectorAll('.dashboard-tab');
    const views = document.querySelectorAll('.dashboard-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const viewId = tab.dataset.view + '-view';
            
            tabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(viewId).classList.add('active');
        });
    });

    // Counter Animation Function
    function animateCounter(element, target, decimals = 0, suffix = '', duration = 2000) {
        const startTime = performance.now();
        const startValue = 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = startValue + (target - startValue) * easeOut;
            
            if (decimals > 0) {
                element.textContent = currentValue.toFixed(decimals) + suffix;
            } else {
                element.textContent = Math.round(currentValue) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // Hero counters - animate immediately
    const heroCounters = document.querySelectorAll('.hero-counter');
    heroCounters.forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const decimals = parseInt(counter.dataset.decimals) || 0;
        const suffix = counter.dataset.suffix || '';
        
        // Small delay for visual effect
        setTimeout(() => {
            animateCounter(counter, target, decimals, suffix, 2000);
        }, 500);
    });

    // Stats counters - animate when in view
    const statCounters = document.querySelectorAll('.stat-counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.dataset.target);
                const decimals = parseInt(counter.dataset.decimals) || 0;
                const suffix = counter.dataset.suffix || '';
                
                animateCounter(counter, target, decimals, suffix, 2000);
                statsObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    statCounters.forEach(counter => {
        statsObserver.observe(counter);
    });

    // ROI Calculator
    const teamSlider = document.getElementById('team-size');
    const dealSlider = document.getElementById('deal-size');
    const oppsSlider = document.getElementById('opps');
    
    const teamValue = document.getElementById('team-value');
    const dealValue = document.getElementById('deal-value');
    const oppsValue = document.getElementById('opps-value');
    const roiValue = document.getElementById('roi-value');

    function calculateROI() {
        const team = parseInt(teamSlider.value);
        const deal = parseInt(dealSlider.value);
        const opps = parseInt(oppsSlider.value);
        
        // Base calculation: 35% conversion lift on monthly opps * deal size * 12 months
        const baseRevenue = opps * deal * 12 * 0.35;
        
        // Additional impact from 29% faster cycles (more capacity)
        const cycleBonus = baseRevenue * 0.29;
        
        // Adjust for team size (larger teams = more leverage)
        const teamMultiplier = 1 + (team / 100) * 0.5;
        
        const totalROI = (baseRevenue + cycleBonus) * teamMultiplier;
        
        teamValue.textContent = team;
        dealValue.textContent = deal.toLocaleString();
        oppsValue.textContent = opps;
        
        if (totalROI >= 1000000) {
            roiValue.textContent = (totalROI / 1000000).toFixed(1) + 'M';
        } else {
            roiValue.textContent = (totalROI / 1000).toFixed(0) + 'K';
        }
    }

    teamSlider.addEventListener('input', calculateROI);
    dealSlider.addEventListener('input', calculateROI);
    oppsSlider.addEventListener('input', calculateROI);
    
    // Initialize calculator
    calculateROI();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Report Download Form Handler
    const reportForm = document.getElementById('reportDownloadForm');
    if (reportForm) {
        const pdfUrl = reportForm.dataset.pdfUrl || '/assets/pdfs/2026-GTM-Report-SlashExperts-Heinz.pdf';
        const pdfFilename = reportForm.dataset.pdfFilename || '2026-GTM-Report-SlashExperts-Heinz.pdf';

        const formHandler = new FormHandler('reportDownloadForm', 'formSuccess', {
            webhookUrl: WEBHOOK_URL,
            pdfUrl: pdfUrl,
            pdfFilename: pdfFilename,
            validateEmail: true,
            scrollOnSuccess: false,
            downloadOnSuccess: true,
            metadata: {
                leadSource: '2026 GTM Report - Analytics ROI',
                reportType: 'Proof-to-Performance Gap',
                partnershipBadge: 'SlashExperts × Heinz Marketing'
            },
            customerio: {
                enabled: true,
                formName: 'analytics_roi'
            }
        });
    }
}
