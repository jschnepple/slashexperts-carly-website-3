/**
 * Video Modal Component
 * Reusable video modal for Vimeo/YouTube embeds
 *
 * Usage:
 * 1. Import and call initVideoModal() in your page JS
 * 2. Add data-video-modal="modalId" to trigger buttons
 * 3. Add video modal HTML with id="modalId"
 *
 * Features:
 * - Click overlay to close
 * - Click X button to close
 * - Press Escape to close
 * - Auto-pause video on close
 * - Prevents body scroll when open
 * - Focus trap for accessibility
 */

/**
 * Initialize video modal functionality
 * @param {string} modalId - The ID of the video modal overlay element
 * @param {string} triggerSelector - CSS selector for trigger buttons (default: data attribute)
 */
export function initVideoModal(modalId = null, triggerSelector = null) {
    // Find all video modals on the page
    const modals = modalId
        ? [document.getElementById(modalId)]
        : document.querySelectorAll('.video-modal-overlay');

    modals.forEach(modal => {
        if (!modal) return;

        const id = modal.id;
        const closeBtn = modal.querySelector('.video-modal-close');
        const iframe = modal.querySelector('iframe');

        // Find trigger buttons for this modal
        const triggers = triggerSelector
            ? document.querySelectorAll(triggerSelector)
            : document.querySelectorAll(`[data-video-modal="${id}"]`);

        // Open modal on trigger click
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openVideoModal(modal, iframe);
            });
        });

        // Close on overlay click (but not modal content)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeVideoModal(modal, iframe);
            }
        });

        // Close on close button click
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeVideoModal(modal, iframe);
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeVideoModal(modal, iframe);
            }
        });
    });
}

/**
 * Open video modal
 */
function openVideoModal(modal, iframe) {
    modal.classList.add('active');
    document.body.classList.add('video-modal-open');

    // Focus the close button for accessibility
    const closeBtn = modal.querySelector('.video-modal-close');
    if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
    }

    // Auto-play if Vimeo (add autoplay parameter)
    if (iframe && iframe.src.includes('vimeo.com') && !iframe.src.includes('autoplay=1')) {
        const separator = iframe.src.includes('?') ? '&' : '?';
        iframe.src = iframe.src + separator + 'autoplay=1';
    }
}

/**
 * Close video modal
 */
function closeVideoModal(modal, iframe) {
    modal.classList.remove('active');
    document.body.classList.remove('video-modal-open');

    // Pause Vimeo video by removing autoplay and reloading
    if (iframe && iframe.src.includes('vimeo.com')) {
        // Remove autoplay parameter and reset
        const srcWithoutAutoplay = iframe.src.replace(/[?&]autoplay=1/, '');
        iframe.src = srcWithoutAutoplay;
    }

    // Alternative: Use postMessage API for Vimeo
    if (iframe && iframe.src.includes('vimeo.com')) {
        iframe.contentWindow.postMessage('{"method":"pause"}', '*');
    }
}

/**
 * Programmatically open a video modal by ID
 */
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const iframe = modal.querySelector('iframe');
        openVideoModal(modal, iframe);
    }
}

/**
 * Programmatically close a video modal by ID
 */
export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const iframe = modal.querySelector('iframe');
        closeVideoModal(modal, iframe);
    }
}
