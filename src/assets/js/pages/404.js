/**
 * 404 Page JavaScript Module
 * Minimal functionality - primarily nav scroll handling
 */

export function init404() {
    initNavScroll();
}

/**
 * Navigation scroll effect - adds 'scrolled' class on scroll
 */
function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}
