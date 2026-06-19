// Week timeline scroll animations
export function initHowItWorks() {
    const weekItems = document.querySelectorAll('.week-item');
    
    if (weekItems.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.2
    };

    const weekObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on order
                const item = entry.target;
                const itemIndex = Array.from(weekItems).indexOf(item);
                
                setTimeout(() => {
                    item.classList.add('animate-in');
                }, itemIndex * 150); // 150ms stagger between items
                
                weekObserver.unobserve(item);
            }
        });
    }, observerOptions);

    weekItems.forEach(item => {
        weekObserver.observe(item);
    });
}
