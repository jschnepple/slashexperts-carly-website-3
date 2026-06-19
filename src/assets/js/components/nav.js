/**
 * Navigation scroll behavior and mobile menu
 * - Adds 'scrolled' class to nav when page is scrolled
 * - Handles mobile menu toggle, close, and accordion functionality
 */
export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Initialize scroll behavior
  initScrollBehavior(nav);

  // Initialize mobile menu
  initMobileMenu();
}

/**
 * Scroll behavior - adds/removes 'scrolled' class based on scroll position
 */
function initScrollBehavior(nav) {
  let ticking = false;

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  });

  // Initial check
  updateNav();
}

/**
 * Mobile menu functionality
 * - Toggle open/close
 * - Close on overlay click, escape key, link click
 * - Accordion navigation
 * - Focus trapping
 * - Body scroll lock
 */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const accordionTriggers = document.querySelectorAll('.mobile-nav-accordion-trigger');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-accordion-panel a');

  if (!toggle || !overlay) return;

  // Store last focused element for focus restoration
  let lastFocusedElement = null;
  let scrollPosition = 0;

  /**
   * Open mobile menu
   */
  function openMenu() {
    // Store current focus and scroll position
    lastFocusedElement = document.activeElement;
    scrollPosition = window.scrollY;

    // Update states
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');

    // Lock body scroll
    document.body.classList.add('mobile-menu-open');
    document.body.style.top = `-${scrollPosition}px`;

    // Focus close button for accessibility
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 100);
    }

    // Add event listeners
    document.addEventListener('keydown', handleEscapeKey);
    overlay.addEventListener('keydown', trapFocus);
  }

  /**
   * Close mobile menu
   */
  function closeMenu() {
    // Update states
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.classList.remove('mobile-menu-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);

    // Close all accordions
    accordionTriggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (panel) panel.classList.remove('open');
    });

    // Remove event listeners
    document.removeEventListener('keydown', handleEscapeKey);
    overlay.removeEventListener('keydown', trapFocus);

    // Restore focus
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  /**
   * Handle Escape key to close menu
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  }

  /**
   * Trap focus within mobile menu
   */
  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusableElements = overlay.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab - going backwards
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab - going forward
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  // Toggle button click
  toggle.addEventListener('click', () => {
    if (overlay.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close on overlay backdrop click (outside panel)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeMenu();
    }
  });

  // Close on nav link click (after navigation)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Small delay to allow navigation to start
      setTimeout(closeMenu, 100);
    });
  });

  // Accordion functionality
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      // Close other accordions (single-open behavior)
      accordionTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) {
            otherPanel.classList.remove('open');
          }
        }
      });

      // Toggle current accordion
      trigger.setAttribute('aria-expanded', !isExpanded);
      if (panel) {
        panel.classList.toggle('open', !isExpanded);
      }
    });
  });

  // Auto-close menu on window resize above breakpoint
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 992 && overlay.classList.contains('open')) {
        closeMenu();
      }
    }, 100);
  });
}
