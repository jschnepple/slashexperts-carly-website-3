/**
 * Form — Become an Expert Page
 * Handles tag input for software expertise and form submission
 */

import { identifyUser } from '../components/customerio.js';
import { WEBHOOK_URL } from '../config/webhooks.js';
import { getUtmData, flattenUtmForPayload } from '../components/utm.js';

export function initFormBecomeAnExpert() {
    initTagInput();
    initFormSubmission();
}

// ==================== TAG INPUT ====================

let tags = [];

function initTagInput() {
    const tagWrapper = document.getElementById('tagWrapper');
    const tagInput = document.getElementById('tagInput');
    const expertiseHidden = document.getElementById('expertiseHidden');

    if (!tagWrapper || !tagInput || !expertiseHidden) return;

    function renderTags() {
        tagWrapper.querySelectorAll('.tag').forEach(t => t.remove());
        tags.forEach((text, i) => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${escapeHtml(text)}<button type="button" class="tag-remove" data-index="${i}" aria-label="Remove ${escapeHtml(text)}">&times;</button>`;
            tagWrapper.insertBefore(tag, tagInput);
        });
        expertiseHidden.value = tags.join(', ');
    }

    function addTag(text) {
        const clean = text.trim();
        if (clean && !tags.includes(clean)) {
            tags.push(clean);
            renderTags();
        }
        tagInput.value = '';
    }

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput.value);
        }
        if (e.key === 'Backspace' && tagInput.value === '' && tags.length > 0) {
            tags.pop();
            renderTags();
        }
    });

    tagWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-remove')) {
            const idx = parseInt(e.target.dataset.index, 10);
            tags.splice(idx, 1);
            renderTags();
        }
        tagInput.focus();
    });
}

// ==================== FORM SUBMISSION ====================

function initFormSubmission() {
    const form = document.getElementById('expertForm');
    const formContent = document.getElementById('formContent');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const formError = document.getElementById('formError');
    const tagWrapper = document.getElementById('tagWrapper');
    const tagInput = document.getElementById('tagInput');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        // Validate expertise tags
        if (tags.length === 0) {
            tagWrapper.classList.add('error');
            tagInput.placeholder = 'Please add at least one product...';
            tagInput.focus();
            setTimeout(() => {
                tagWrapper.classList.remove('error');
                tagInput.placeholder = "Type a product name & press Enter (e.g. Salesforce)";
            }, 3000);
            return;
        }

        // Validate required fields
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const data = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            company: document.getElementById('company').value.trim(),
            role: document.getElementById('role').value.trim(),
            linkedin: document.getElementById('linkedin').value.trim(),
            expertise: tags
        };

        // Set loading state
        setLoading(true);

        try {
            // Build webhook payload
            const utmData = flattenUtmForPayload(getUtmData());
            const payload = {
                ...data,
                leadSource: 'expert_application',
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                referrer: document.referrer || '',
                ...utmData
            };

            // Send to n8n webhook
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Webhook responded with ${response.status}`);
            }

            // Send to Customer.io
            identifyUser({
                email: data.email,
                formName: 'expert_application',
                attributes: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    company: data.company,
                    job_title: data.role,
                    linkedin_url: data.linkedin,
                    expertise: tags.join(', ')
                }
            });

            // Show success
            formContent.style.display = 'none';
            formSuccess.classList.add('show');

        } catch (error) {
            console.error('Form submission failed:', error);
            showError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(loading) {
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Submitting... <span class="spinner"></span>';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Submit Application
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                </svg>`;
        }
    }

    function showError(message) {
        formError.textContent = message;
        formError.classList.add('show');
    }

    function hideError() {
        formError.textContent = '';
        formError.classList.remove('show');
    }
}

// ==================== UTILITIES ====================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
