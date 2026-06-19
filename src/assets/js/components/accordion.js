/**
 * Accordion Component
 * Single-active accordion for FAQ sections
 */

export class Accordion {
    constructor(selector, options = {}) {
        this.items = document.querySelectorAll(selector);
        this.options = {
            singleActive: true,  // Only one open at a time
            animationDuration: 300,
            ...options
        };

        if (this.items.length > 0) {
            this.init();
        }
    }

    init() {
        this.items.forEach((item, index) => {
            const trigger = item.querySelector('.faq-question');
            const content = item.querySelector('.faq-answer');

            if (!trigger || !content) return;

            // Add ARIA attributes for accessibility
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', `accordion-content-${index}`);
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('tabindex', '0');

            content.setAttribute('id', `accordion-content-${index}`);
            content.setAttribute('role', 'region');
            content.setAttribute('aria-labelledby', `accordion-trigger-${index}`);

            trigger.setAttribute('id', `accordion-trigger-${index}`);

            // Set initial height
            if (!item.classList.contains('active')) {
                content.style.maxHeight = '0';
                content.style.overflow = 'hidden';
            }

            // Click handler
            trigger.addEventListener('click', () => this.toggle(item));

            // Keyboard handler (Enter and Space)
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle(item);
                }
            });
        });
    }

    toggle(item) {
        const isActive = item.classList.contains('active');
        const trigger = item.querySelector('.faq-question');
        const content = item.querySelector('.faq-answer');

        // Close all if single active mode
        if (this.options.singleActive && !isActive) {
            this.closeAll();
        }

        // Toggle current item
        if (isActive) {
            this.close(item);
        } else {
            this.open(item);
        }
    }

    open(item) {
        const trigger = item.querySelector('.faq-question');
        const content = item.querySelector('.faq-answer');

        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');

        // Animate opening
        content.style.maxHeight = content.scrollHeight + 'px';

        // After animation, remove max-height to allow dynamic content
        setTimeout(() => {
            if (item.classList.contains('active')) {
                content.style.maxHeight = 'none';
            }
        }, this.options.animationDuration);
    }

    close(item) {
        const trigger = item.querySelector('.faq-question');
        const content = item.querySelector('.faq-answer');

        // Set explicit height before animating
        content.style.maxHeight = content.scrollHeight + 'px';

        // Force reflow
        content.offsetHeight;

        // Animate closing
        content.style.maxHeight = '0';

        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
    }

    closeAll() {
        this.items.forEach(item => {
            if (item.classList.contains('active')) {
                this.close(item);
            }
        });
    }

    openAll() {
        this.items.forEach(item => {
            if (!item.classList.contains('active')) {
                this.open(item);
            }
        });
    }
}
