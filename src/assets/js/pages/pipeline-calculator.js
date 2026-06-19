/**
 * Pipeline Calculator Page JavaScript
 * Invisible Pipeline Score Calculator functionality
 */

import { identifyUser, trackEvent } from '../components/customerio.js';
import { getUtmData, flattenUtmForPayload } from '../components/utm.js';
import { WEBHOOK_URL } from '../config/webhooks.js';
const PDF_URL = '/assets/pdfs/2026-GTM-Report-SlashExperts-Heinz.pdf';
const PDF_FILENAME = '2026-GTM-Report-SlashExperts-Heinz.pdf';

// Score calculation state
let answers = {
    responseTime: 0,
    tracking: 0,
    matching: 0,
    scale: 0,
    integration: 0,
    channels: 0
};

// Store calculated score for modal
let calculatedScore = 0;

// Step navigation state
let currentStep = 0; // 0 = start screen, 1-6 = questions
const totalSteps = 6;

// DOM elements (initialized in init)
let progressSteps = {};
let scoreModalOverlay = null;
let scoreModalClose = null;
let modalLeadForm = null;
let modalLeadSuccess = null;
let quizStartScreen = null;
let quizStepsContainer = null;

// Question to step mapping
const questionOrder = ['responseTime', 'tracking', 'matching', 'scale', 'integration', 'channels'];

/**
 * Initialize progress step elements
 */
function initProgressSteps() {
    progressSteps = {
        responseTime: document.getElementById('step1'),
        tracking: document.getElementById('step2'),
        matching: document.getElementById('step3'),
        scale: document.getElementById('step4'),
        integration: document.getElementById('step5'),
        channels: document.getElementById('step6')
    };
}

/**
 * Initialize modal elements
 */
function initModalElements() {
    scoreModalOverlay = document.getElementById('scoreModalOverlay');
    scoreModalClose = document.getElementById('scoreModalClose');
    modalLeadForm = document.getElementById('modalLeadForm');
    modalLeadSuccess = document.getElementById('modalLeadSuccess');
    quizStartScreen = document.getElementById('quizStartScreen');
    quizStepsContainer = document.getElementById('quizStepsContainer');
}

/**
 * Initialize quiz start button
 */
function initQuizStart() {
    const startBtn = document.getElementById('startQuizBtn');
    if (!startBtn || !quizStartScreen || !quizStepsContainer) return;

    startBtn.addEventListener('click', () => {
        quizStartScreen.classList.add('hidden');
        quizStepsContainer.classList.add('active');
        showStep(1);
    });
}

/**
 * Show a specific quiz step
 */
function showStep(stepNum) {
    const steps = document.querySelectorAll('.quiz-step');

    steps.forEach((step, i) => {
        const stepIndex = i + 1;
        if (stepIndex === stepNum) {
            // Small delay for smooth transition
            setTimeout(() => {
                step.classList.add('active');
                step.classList.remove('exit-left');
            }, 50);
        } else if (stepIndex < stepNum) {
            step.classList.remove('active');
            step.classList.add('exit-left');
        } else {
            step.classList.remove('active', 'exit-left');
        }
    });

    currentStep = stepNum;
    updateStepProgress();
}

/**
 * Go back to previous step
 */
function goBack() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

/**
 * Update progress indicators based on current step
 */
function updateStepProgress() {
    const stepEls = document.querySelectorAll('.progress-step');
    stepEls.forEach((step, i) => {
        const stepIndex = i + 1;
        step.classList.remove('active', 'complete');

        if (stepIndex < currentStep) {
            step.classList.add('complete');
        } else if (stepIndex === currentStep) {
            step.classList.add('active');
        }
    });
}

/**
 * Initialize back buttons
 */
function initBackButtons() {
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!btn.disabled) {
                goBack();
            }
        });
    });
}

/**
 * Handle option button clicks with auto-advance
 */
function initOptionButtons() {
    document.querySelectorAll('.option-grid').forEach(grid => {
        const question = grid.dataset.question;
        grid.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove selected from siblings
                grid.querySelectorAll('.option-btn').forEach(b => {
                    b.classList.remove('selected', 'warning-state', 'danger-state', 'success-state');
                });

                // Add selected and state class
                this.classList.add('selected');
                const state = this.dataset.state;
                this.classList.add(`${state}-state`);

                // Store answer
                answers[question] = parseInt(this.dataset.value);

                // Update progress
                updateProgress();

                // Auto-advance to next step after brief delay
                if (currentStep > 0 && currentStep < totalSteps) {
                    setTimeout(() => {
                        showStep(currentStep + 1);
                    }, 400);
                } else if (currentStep === totalSteps) {
                    // Last question - show calculate button
                    const calcBtn = document.getElementById('calculateBtn');
                    if (calcBtn) {
                        calcBtn.classList.add('visible');
                    }
                }
            });
        });
    });
}

/**
 * Update progress indicators
 */
function updateProgress() {
    questionOrder.forEach((q, i) => {
        const step = progressSteps[q];
        if (!step) return;

        if (answers[q] > 0) {
            step.classList.add('complete');
            step.classList.remove('active');
        } else if (i === 0 || answers[questionOrder[i-1]] > 0) {
            step.classList.add('active');
            step.classList.remove('complete');
        } else {
            step.classList.remove('active', 'complete');
        }
    });
}

/**
 * Initialize calculate button
 */
function initCalculateButton() {
    const calculateBtn = document.getElementById('calculateBtn');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', function() {
        const allAnswered = Object.values(answers).every(v => v > 0);
        if (!allAnswered) {
            // Highlight unanswered questions
            questionOrder.forEach(q => {
                const grid = document.querySelector(`[data-question="${q}"]`);
                if (!grid) return;
                const group = grid.parentElement;
                if (answers[q] === 0) {
                    group.style.animation = 'shake 0.5s ease';
                    setTimeout(() => group.style.animation = '', 500);
                }
            });
            return;
        }

        // Calculate scores
        const speedScore = (answers.responseTime / 4) * 25;
        const visibilityScore = ((answers.tracking + answers.channels) / 8) * 25;
        const matchingScore = (answers.matching / 4) * 25;
        const scaleScore = ((answers.scale + answers.integration) / 8) * 25;
        const totalScore = Math.round(speedScore + visibilityScore + matchingScore + scaleScore);

        // Store for form submission
        calculatedScore = totalScore;

        // Update main results panel immediately
        animateScore(totalScore);
        updateDimensionBar('speed', speedScore, 25);
        updateDimensionBar('visibility', visibilityScore, 25);
        updateDimensionBar('matching', matchingScore, 25);
        updateDimensionBar('scale', scaleScore, 25);
        updateScoreRating(totalScore);

        // Show modal with loading state
        const loadingState = document.getElementById('modalLoadingState');
        const resultsContent = document.getElementById('modalResultsContent');

        if (loadingState) loadingState.classList.remove('hidden');
        if (resultsContent) resultsContent.classList.remove('visible');

        // Open modal
        if (scoreModalOverlay) {
            scoreModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // After loading animation, show results
        setTimeout(() => {
            if (loadingState) loadingState.classList.add('hidden');
            if (resultsContent) resultsContent.classList.add('visible');

            // Animate modal score
            animateModalScore(totalScore);
            updateModalPosition(totalScore);
            updateModalRating(totalScore);
            updateImpactText(totalScore);
        }, 2200);
    });
}

/**
 * Animate main score circle
 */
function animateScore(target) {
    const scoreEl = document.getElementById('mainScore');
    const circleEl = document.getElementById('scoreCircle');
    if (!scoreEl || !circleEl) return;

    const circumference = 2 * Math.PI * 78; // 490

    let current = 0;
    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);

        current = Math.round(target * easeOut);
        scoreEl.textContent = current;

        // Update circle
        const offset = circumference - (circumference * (current / 100));
        circleEl.style.strokeDashoffset = offset;

        // Update circle color based on score
        if (current < 30) {
            circleEl.style.stroke = '#ef4444';
        } else if (current < 55) {
            circleEl.style.stroke = '#f59e0b';
        } else if (current < 75) {
            circleEl.style.stroke = '#22c55e';
        } else {
            circleEl.style.stroke = '#10b981';
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

/**
 * Update dimension bar
 */
function updateDimensionBar(dimension, score, max) {
    const bar = document.getElementById(`${dimension}Bar`);
    const scoreEl = document.getElementById(`${dimension}Score`);
    if (!bar || !scoreEl) return;

    const percentage = (score / max) * 100;

    setTimeout(() => {
        bar.style.width = `${percentage}%`;
        scoreEl.textContent = Math.round(score);

        // Update bar color
        bar.classList.remove('critical', 'warning', 'good', 'excellent');
        if (percentage < 30) {
            bar.classList.add('critical');
        } else if (percentage < 55) {
            bar.classList.add('warning');
        } else if (percentage < 75) {
            bar.classList.add('good');
        } else {
            bar.classList.add('excellent');
        }
    }, 200);
}

/**
 * Update score rating text
 */
function updateScoreRating(score) {
    const ratingEl = document.getElementById('scoreRating');
    if (!ratingEl) return;

    ratingEl.classList.remove('critical', 'warning', 'good', 'excellent');
    ratingEl.classList.add('visible'); // Show the rating element

    if (score < 30) {
        ratingEl.textContent = 'Critical Blind Spots';
        ratingEl.classList.add('critical');
    } else if (score < 55) {
        ratingEl.textContent = 'Significant Gaps';
        ratingEl.classList.add('warning');
    } else if (score < 75) {
        ratingEl.textContent = 'Above Average';
        ratingEl.classList.add('good');
    } else {
        ratingEl.textContent = 'Industry Leader';
        ratingEl.classList.add('excellent');
    }
}

/**
 * Close score modal
 */
function closeScoreModal() {
    if (scoreModalOverlay) {
        scoreModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize modal event handlers
 */
function initModalHandlers() {
    if (scoreModalClose) {
        scoreModalClose.addEventListener('click', closeScoreModal);
    }

    if (scoreModalOverlay) {
        scoreModalOverlay.addEventListener('click', function(e) {
            if (e.target === scoreModalOverlay) {
                closeScoreModal();
            }
        });
    }

    // Escape key closes modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && scoreModalOverlay && scoreModalOverlay.classList.contains('active')) {
            closeScoreModal();
        }
    });
}

/**
 * Animate modal score circle
 */
function animateModalScore(target) {
    const scoreEl = document.getElementById('modalScoreValue');
    const circleEl = document.getElementById('modalScoreCircle');
    if (!scoreEl || !circleEl) return;

    const circumference = 2 * Math.PI * 50; // 314

    let current = 0;
    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        current = Math.round(target * easeOut);
        scoreEl.textContent = current;

        const offset = circumference - (circumference * (current / 100));
        circleEl.style.strokeDashoffset = offset;

        if (current < 30) {
            circleEl.style.stroke = '#ef4444';
        } else if (current < 55) {
            circleEl.style.stroke = '#f59e0b';
        } else if (current < 75) {
            circleEl.style.stroke = '#22c55e';
        } else {
            circleEl.style.stroke = '#10b981';
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

/**
 * Update modal position indicator
 */
function updateModalPosition(score) {
    const positionEl = document.getElementById('modalPosition');
    if (!positionEl) return;

    const position = Math.max(8, Math.min(92, score));
    setTimeout(() => {
        positionEl.style.left = `${position}%`;
    }, 500);
}

/**
 * Update modal rating text
 */
function updateModalRating(score) {
    const ratingEl = document.getElementById('modalScoreRating');
    if (!ratingEl) return;

    ratingEl.classList.remove('critical', 'warning', 'good', 'excellent');

    if (score < 30) {
        ratingEl.textContent = 'Critical Blind Spots';
        ratingEl.classList.add('critical');
    } else if (score < 55) {
        ratingEl.textContent = 'Significant Gaps';
        ratingEl.classList.add('warning');
    } else if (score < 75) {
        ratingEl.textContent = 'Above Average';
        ratingEl.classList.add('good');
    } else {
        ratingEl.textContent = 'Industry Leader';
        ratingEl.classList.add('excellent');
    }
}

/**
 * Update impact text based on score
 */
function updateImpactText(score) {
    const impactEl = document.getElementById('modalImpactText');
    if (!impactEl) return;

    if (score < 30) {
        impactEl.textContent = "Critical blind spots detected. Companies in this range lose 60%+ more deals to unseen competitors.";
    } else if (score < 55) {
        impactEl.textContent = "Significant visibility gaps are likely costing you deals. You're missing 40-50% of buying signals.";
    } else if (score < 75) {
        impactEl.textContent = "Ahead of most, but room to improve. Closing the gap to 'leader' status means 20-30% more wins.";
    } else {
        impactEl.textContent = "Top performer status. Your challenge: maintaining this edge as competitors catch up.";
    }
}

/**
 * Initialize lead form handler
 */
function initLeadForm() {
    if (!modalLeadForm) return;

    modalLeadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            firstName: document.getElementById('modalFirstName')?.value || '',
            lastName: document.getElementById('modalLastName')?.value || '',
            email: document.getElementById('modalEmail')?.value || '',
            company: document.getElementById('modalCompany')?.value || '',
            score: calculatedScore,
            answers: { ...answers }
        };

        // Get submit button for loading state
        const submitBtn = modalLeadForm.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
        }

        try {
            // Get UTM data for attribution
            const utmData = flattenUtmForPayload(getUtmData());

            // 1. Submit to n8n webhook
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    timestamp: new Date().toISOString(),
                    page: window.location.pathname,
                    referrer: document.referrer,
                    leadSource: 'Pipeline Calculator Quiz',
                    quizType: 'Invisible Pipeline Score',
                    // UTM parameters
                    ...utmData
                })
            });

            // 2. Send to Customer.io
            identifyUser({
                email: formData.email,
                formName: 'pipeline_calculator',
                attributes: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    company: formData.company,
                    pipeline_score: formData.score,
                    quiz_response_time: formData.answers.responseTime,
                    quiz_tracking: formData.answers.tracking,
                    quiz_matching: formData.answers.matching,
                    quiz_scale: formData.answers.scale,
                    quiz_integration: formData.answers.integration,
                    quiz_channels: formData.answers.channels
                }
            });

            // 3. Track quiz completion event
            trackEvent('quiz_completed', {
                quiz_name: 'pipeline_calculator',
                score: formData.score
            });

            // 4. Download PDF
            const link = document.createElement('a');
            link.href = PDF_URL;
            link.download = PDF_FILENAME;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 5. Track PDF download
            trackEvent('pdf_downloaded', {
                form_name: 'pipeline_calculator',
                pdf_filename: PDF_FILENAME
            });

        } catch (error) {
            console.error('Form submission error:', error);
            // Continue to show success even if webhook fails
            // Customer.io may have succeeded
        }

        // Show success state (regardless of webhook result)
        modalLeadForm.classList.add('hidden');
        if (modalLeadSuccess) {
            modalLeadSuccess.classList.add('active');
        }

        // Hide benefits too
        const benefits = document.querySelector('.modal-lead-benefits');
        if (benefits) benefits.style.display = 'none';

        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });
}

/**
 * Reset calculator state (for testing/reuse)
 */
export function resetCalculator() {
    answers = {
        responseTime: 0,
        tracking: 0,
        matching: 0,
        scale: 0,
        integration: 0,
        channels: 0
    };
    calculatedScore = 0;

    // Reset UI
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected', 'warning-state', 'danger-state', 'success-state');
    });

    updateProgress();

    // Reset score display
    const mainScore = document.getElementById('mainScore');
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreRating = document.getElementById('scoreRating');

    if (mainScore) mainScore.textContent = '0';
    if (scoreCircle) {
        scoreCircle.style.strokeDashoffset = 2 * Math.PI * 78;
        scoreCircle.style.stroke = '#374151';
    }
    if (scoreRating) {
        scoreRating.textContent = 'Complete assessment to see your score';
        scoreRating.classList.remove('critical', 'warning', 'good', 'excellent', 'visible');
    }

    // Reset dimension bars
    ['speed', 'visibility', 'matching', 'scale'].forEach(dim => {
        const bar = document.getElementById(`${dim}Bar`);
        const score = document.getElementById(`${dim}Score`);
        if (bar) {
            bar.style.width = '0%';
            bar.classList.remove('critical', 'warning', 'good', 'excellent');
        }
        if (score) score.textContent = '0';
    });
}

/**
 * Main initialization function
 */
export function initPipelineCalculator() {
    // Initialize DOM references
    initProgressSteps();
    initModalElements();

    // Initialize step-by-step quiz functionality
    initQuizStart();
    initBackButtons();

    // Initialize functionality
    initOptionButtons();
    initCalculateButton();
    initModalHandlers();
    initLeadForm();

    // Initialize progress state
    updateProgress();

    console.log('Pipeline Calculator initialized');
}

// Auto-initialize if not using module system
if (typeof window !== 'undefined' && !window.pipelineCalculatorInitialized) {
    window.pipelineCalculatorInitialized = true;
}
