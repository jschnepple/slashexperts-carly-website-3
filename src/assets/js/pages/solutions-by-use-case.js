// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate stats on scroll
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const animateValue = (element, start, end, duration, suffix = '') => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        
        if (suffix === '×') {
            element.textContent = current.toFixed(1) + suffix;
        } else if (suffix === '%' || suffix === '') {
            element.textContent = Math.floor(current) + suffix;
        } else {
            element.textContent = suffix + (current / 1000000).toFixed(1) + 'M';
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.impact-stat .value');
            stats.forEach(stat => {
                const text = stat.textContent;
                let value, suffix;
                
                if (text.includes('×')) {
                    value = parseFloat(text);
                    suffix = '×';
                } else if (text.includes('%')) {
                    value = parseInt(text);
                    suffix = '%';
                } else if (text.includes('$')) {
                    value = 2400000;
                    suffix = '$';
                } else if (text === 'Zero') {
                    return;
                } else {
                    value = parseInt(text);
                    suffix = '';
                }
                
                if (!isNaN(value)) {
                    animateValue(stat, 0, value, 2000, suffix);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.impact-stats').forEach(section => {
    statsObserver.observe(section);
});

// Funnel animation
const funnelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.funnel-bar-fill');
            fills.forEach((fill, index) => {
                setTimeout(() => {
                    fill.style.width = fill.style.width || '0%';
                }, index * 200);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.funnel-visual').forEach(funnel => {
    funnelObserver.observe(funnel);
});

// Update active pill on scroll
const sections = document.querySelectorAll('section[id]');
const pills = document.querySelectorAll('.usecase-pill');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    pills.forEach(pill => {
        pill.classList.remove('active');
        if (pill.getAttribute('href') === '#' + current) {
            pill.classList.add('active');
        }
    });
});

// Account node hover effect
document.querySelectorAll('.account-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
        node.querySelector('.node-avatar').style.transform = 'scale(1.15)';
    });
    node.addEventListener('mouseleave', () => {
        node.querySelector('.node-avatar').style.transform = 'scale(1)';
    });
});

// Pipeline stage click effect
document.querySelectorAll('.pipeline-stage').forEach(stage => {
    stage.addEventListener('click', () => {
        document.querySelectorAll('.pipeline-stage').forEach(s => s.classList.remove('active'));
        stage.classList.add('active');
    });
});
