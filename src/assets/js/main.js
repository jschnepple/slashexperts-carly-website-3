/**
 * Main JavaScript Entry Point
 * Imports and initializes all interactive components
 */

import { initNav } from './components/nav.js';
import { initAnimations } from './components/animations.js';
import { initTilt } from './components/tilt.js';
import { initCounters } from './components/counter.js';
import { initUtmTracking } from './components/utm.js';

// Initialize UTM tracking immediately (before DOM ready)
// This ensures we capture UTM params from the URL before any navigation
initUtmTracking();

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAnimations();
  initTilt();
  initCounters();

  // Initialize page-specific JS if it exists
  if (typeof initHomepage !== 'undefined') {
    initHomepage();
  }
});
