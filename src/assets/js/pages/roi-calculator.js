import { FormHandler } from '../components/forms.js';
import { WEBHOOK_URL } from '../config/webhooks.js';

// Report Download Form Handler
const reportForm = document.getElementById('reportDownloadForm');
if (reportForm) {
    const pdfUrl = reportForm.dataset.pdfUrl || '/assets/pdfs/2026-gtm-report.pdf';
    const pdfFilename = reportForm.dataset.pdfFilename || '2026-GTM-Report-SlashExperts-Heinz.pdf';

    const formHandler = new FormHandler('reportDownloadForm', 'formSuccess', {
        webhookUrl: WEBHOOK_URL,
        pdfUrl: pdfUrl,
        pdfFilename: pdfFilename,
        validateEmail: true,
        scrollOnSuccess: false,
        downloadOnSuccess: true,
        metadata: {
            leadSource: '2026 GTM Report - ROI Calculator',
            reportType: 'Proof-to-Performance Gap',
            partnershipBadge: 'SlashExperts × Heinz Marketing'
        },
        customerio: {
            enabled: true,
            formName: 'roi_calculator'
        }
    });
}

// Calculator Elements
const opportunitiesSlider = document.getElementById('opportunities');
const opportunitiesDisplay = document.getElementById('opportunitiesDisplay');
const dealSizeInput = document.getElementById('dealSize');
const winRateSlider = document.getElementById('winRate');
const winRateDisplay = document.getElementById('winRateDisplay');
const salesCycleSlider = document.getElementById('salesCycle');
const cycleDisplay = document.getElementById('cycleDisplay');
const industrySelect = document.getElementById('industry');
const calculateBtn = document.getElementById('calculateBtn');
const calculatingOverlay = document.getElementById('calculatingOverlay');

// Results Elements
const totalROIEl = document.getElementById('totalROI');
const costOfInactionEl = document.getElementById('costOfInaction');
const winRateIncreaseEl = document.getElementById('winRateIncrease');
const cycleSavedEl = document.getElementById('cycleSaved');
const dealsWonEl = document.getElementById('dealsWon');
const hoursSavedEl = document.getElementById('hoursSaved');

// SlashExperts benchmark multipliers
const benchmarks = {
    winRateLift: 0.60,
    cycleReduction: 0.29,
    conversionLift: 0.35,
    adminReduction: 0.70,
    hoursPerOpp: 2.5
};

// Industry multipliers
const industryMultipliers = {
    saas: 1.0,
    fintech: 1.1,
    healthcare: 0.95,
    manufacturing: 0.85,
    professional: 0.9,
    other: 0.9
};

// Update slider displays
opportunitiesSlider.addEventListener('input', function() {
    opportunitiesDisplay.textContent = this.value;
});

winRateSlider.addEventListener('input', function() {
    winRateDisplay.textContent = this.value + '%';
});

salesCycleSlider.addEventListener('input', function() {
    cycleDisplay.textContent = this.value + ' days';
});

// Calculate button with animation
calculateBtn.addEventListener('click', function() {
    calculatingOverlay.classList.add('active');
    setTimeout(() => {
        calculateROI();
        calculatingOverlay.classList.remove('active');
    }, 1200);
});

// Auto-calculate on input changes
[opportunitiesSlider, dealSizeInput, winRateSlider, salesCycleSlider, industrySelect].forEach(input => {
    input.addEventListener('change', calculateROI);
});

function calculateROI() {
    const monthlyOpps = parseInt(opportunitiesSlider.value);
    const dealSize = parseInt(dealSizeInput.value) || 50000;
    const currentWinRate = parseInt(winRateSlider.value) / 100;
    const salesCycle = parseInt(salesCycleSlider.value);
    const industry = industrySelect.value;
    const multiplier = industryMultipliers[industry];

    const annualOpps = monthlyOpps * 12;
    const currentDealsWon = annualOpps * currentWinRate;
    const currentRevenue = currentDealsWon * dealSize;

    const newWinRate = Math.min(currentWinRate * (1 + benchmarks.winRateLift * multiplier), 0.95);
    const newDealsWon = annualOpps * newWinRate;
    const newRevenue = newDealsWon * dealSize;

    const revenueImpact = newRevenue - currentRevenue;
    const extraDeals = Math.round(newDealsWon - currentDealsWon);
    const daysSaved = Math.round(salesCycle * benchmarks.cycleReduction);
    const hoursSaved = Math.round(annualOpps * benchmarks.hoursPerOpp * benchmarks.adminReduction);
    const monthlyLoss = Math.round(revenueImpact / 12);

    totalROIEl.textContent = formatCurrency(revenueImpact);
    costOfInactionEl.textContent = '-' + formatCurrency(monthlyLoss);
    winRateIncreaseEl.textContent = '+' + Math.round(benchmarks.winRateLift * 100 * multiplier) + '%';
    cycleSavedEl.textContent = daysSaved + ' days';
    dealsWonEl.textContent = '+' + extraDeals;
    hoursSavedEl.textContent = hoursSaved.toLocaleString() + ' hrs';
}

function formatCurrency(amount) {
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return '$' + Math.round(amount / 1000) + 'K';
    }
    return '$' + amount.toLocaleString();
}

calculateROI();
