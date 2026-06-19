// Asset Download Template Page JavaScript

import { FormHandler } from '../components/forms.js';
import { WEBHOOK_URL } from '../config/webhooks.js';

export function initDownloadAsset() {
    // ==================== FORM HANDLER INTEGRATION ====================
    const assetForm = document.getElementById('assetForm');
    const assetSuccess = document.getElementById('assetSuccess');
    const downloadAssetAgainBtn = document.getElementById('downloadAssetAgain');

    if (assetForm && assetSuccess) {
        // Get PDF configuration from form data attributes
        const pdfUrl = assetForm.dataset.pdfUrl || '/assets/pdfs/default-asset.pdf';
        const pdfFilename = assetForm.dataset.pdfFilename || 'Asset-Download.pdf';

        // Get resource type from page (for metadata)
        const resourceBadge = document.querySelector('.resource-badge span');
        const resourceTitle = document.querySelector('.asset-title');
        const resourceType = resourceBadge?.textContent.trim() || 'Asset';
        const assetTitle = resourceTitle?.textContent.trim() || 'Asset Download';

        // Initialize FormHandler with N8N webhook
        const formHandler = new FormHandler('assetForm', 'assetSuccess', {
            webhookUrl: WEBHOOK_URL,
            pdfUrl: pdfUrl,
            pdfFilename: pdfFilename,
            validateEmail: true,
            scrollOnSuccess: false, // We handle scroll in success state
            downloadOnSuccess: true,
            metadata: {
                leadSource: 'Asset Download Template',
                resourceType: resourceType,
                assetTitle: assetTitle
            },
            customerio: {
                enabled: true,
                formName: 'download_asset',
                additionalAttributes: {
                    asset_type: resourceType,
                    asset_title: assetTitle
                }
            }
        });

        // Download Again button handler
        if (downloadAssetAgainBtn) {
            downloadAssetAgainBtn.addEventListener('click', () => {
                // Trigger PDF download
                if (pdfUrl) {
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.download = pdfFilename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        }
    }

    // ==================== NAVIGATION SCROLL BEHAVIOR ====================
    const nav = document.querySelector('nav');
    let lastScrollY = window.pageYOffset;

    function handleNavScroll() {
        const currentScrollY = window.pageYOffset;

        if (nav) {
            if (currentScrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Initial check

    // ==================== PREVIEW MOCKUP PARALLAX (SUBTLE) ====================
    const previewMockup = document.querySelector('.preview-mockup');

    if (previewMockup) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.asset-hero')?.offsetHeight || 0;

            if (scrolled < heroHeight) {
                const parallaxAmount = scrolled * 0.2;
                previewMockup.style.transform = `perspective(1000px) rotateY(-3deg) rotateX(2deg) translateY(${parallaxAmount}px)`;
            }
        }, { passive: true });
    }

    // ==================== CONSOLE LOG FOR DEBUGGING ====================
    console.log('Asset Download Template page initialized');
    console.log('Form handler:', assetForm ? 'Active' : 'Not found');
    console.log('PDF URL:', assetForm?.dataset.pdfUrl || 'Not configured');
    console.log('PDF Filename:', assetForm?.dataset.pdfFilename || 'Not configured');
}
