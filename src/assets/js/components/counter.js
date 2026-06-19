/**
 * Animated counter for numbers
 * Smoothly counts up from 0 to target value using requestAnimationFrame
 */
export function animateCounter(element, target, duration = 2000, decimals = 0) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);

    const currentValue = start + (target - start) * easeOut;

    if (decimals > 0) {
      element.textContent = currentValue.toFixed(decimals);
    } else {
      element.textContent = Math.floor(currentValue).toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (decimals > 0) {
        element.textContent = target.toFixed(decimals);
      } else {
        element.textContent = target.toLocaleString();
      }
    }
  }

  requestAnimationFrame(update);
}

/**
 * Initialize all counters on the page
 * Looks for elements with data-counter attribute
 */
export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');

  if (!counters.length) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        const target = parseFloat(entry.target.dataset.counter);
        const decimals = parseInt(entry.target.dataset.decimals) || 0;
        animateCounter(entry.target, target, 2000, decimals);
        entry.target.dataset.counted = 'true';
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}
