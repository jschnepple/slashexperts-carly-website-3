/**
 * Homepage-specific JavaScript
 * All interactive elements for the homepage
 */
export function initHomepage() {
    // Navigation scroll effect (sticky CTA)
    const nav = document.getElementById('nav');
    const stickyCta = document.getElementById('stickyCta');

    window.addEventListener('scroll', () => {
        if (nav && window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else if (nav) {
            nav.classList.remove('scrolled');
        }

        // Show sticky CTA after scrolling past hero
        if (stickyCta) {
            if (window.scrollY > 800) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        }
    });

    // 3D Tilt Effect for Hero Card
    const heroCard = document.getElementById('heroCard');
    const heroVisual = document.getElementById('heroVisual');

    if (heroCard && heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // Move glow with tilt
            const glow = heroVisual.querySelector('.hero-glow');
            if (glow) {
                const glowX = 50 + (rotateY * 2);
                const glowY = 50 + (rotateX * 2);
                glow.style.left = `${glowX}%`;
                glow.style.top = `${glowY}%`;
            }

            // Parallax on floating elements
            const floatingCards = heroVisual.querySelectorAll('.floating-card');
            floatingCards.forEach((card, index) => {
                const depth = (index + 1) * 0.5;
                card.style.transform = `translate(${rotateY * depth * 3}px, ${-rotateX * depth * 3}px)`;
            });

            const floatingAvatars = heroVisual.querySelectorAll('.floating-avatar');
            floatingAvatars.forEach((avatar, index) => {
                const depth = (index + 1) * 0.7;
                avatar.style.transform = `translate(${-rotateY * depth * 4}px, ${rotateX * depth * 4}px)`;
            });
        });

        heroVisual.addEventListener('mouseleave', () => {
            heroCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            heroCard.style.transition = 'transform 0.5s ease';

            const glow = heroVisual.querySelector('.hero-glow');
            if (glow) {
                glow.style.left = '50%';
                glow.style.top = '50%';
                glow.style.transition = 'left 0.5s ease, top 0.5s ease';
            }

            const floatingCards = heroVisual.querySelectorAll('.floating-card');
            floatingCards.forEach(card => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s ease';
            });

            const floatingAvatars = heroVisual.querySelectorAll('.floating-avatar');
            floatingAvatars.forEach(avatar => {
                avatar.style.transform = '';
                avatar.style.transition = 'transform 0.5s ease';
            });

            setTimeout(() => {
                heroCard.style.transition = 'transform 0.1s ease';
                if (glow) glow.style.transition = '';
                floatingCards.forEach(card => card.style.transition = '');
                floatingAvatars.forEach(avatar => avatar.style.transition = '');
            }, 500);
        });

        heroVisual.addEventListener('mouseenter', () => {
            heroCard.style.transition = 'transform 0.1s ease';
        });
    }

    // Hero counter animation
    const heroCounters = document.querySelectorAll('.hero-counter');
    heroCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateHeroCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * easeOut);

            if (progress < 1) {
                requestAnimationFrame(updateHeroCounter);
            } else {
                counter.textContent = target;
            }
        }

        // Start after a delay
        setTimeout(() => {
            requestAnimationFrame(updateHeroCounter);
        }, 1000);
    });

    // Scroll Typography - Images reveal on scroll
    const scrollTypographyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const images = entry.target.querySelectorAll('.scroll-image');
                const label = entry.target.querySelector('.scroll-image-label');

                images.forEach((img, index) => {
                    setTimeout(() => {
                        img.classList.add('visible');
                    }, index * 150);
                });

                if (label) {
                    setTimeout(() => {
                        label.classList.add('visible');
                    }, images.length * 150 + 200);
                }
            } else {
                const images = entry.target.querySelectorAll('.scroll-image');
                const label = entry.target.querySelector('.scroll-image-label');
                images.forEach(img => img.classList.remove('visible'));
                if (label) label.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll('[data-scroll-reveal]').forEach(group => {
        scrollTypographyObserver.observe(group);
    });

    // FAQ Accordion
    document.querySelectorAll('[data-faq]').forEach(faq => {
        const question = faq.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other FAQs
            document.querySelectorAll('[data-faq]').forEach(otherFaq => {
                if (otherFaq !== faq) {
                    otherFaq.classList.remove('active');
                }
            });
            // Toggle current FAQ
            faq.classList.toggle('active');
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.problem-card, .solution-step, .metric-card, .testimonial-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Use case tabs
    const tabs = document.querySelectorAll('.usecase-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Animated Counters for Metrics Section
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const isDecimal = counter.getAttribute('data-decimal') === 'true';
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function (ease-out)
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = target * easeOut;

                        if (isDecimal) {
                            counter.textContent = current.toFixed(1);
                        } else {
                            counter.textContent = Math.floor(current);
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            if (isDecimal) {
                                counter.textContent = target.toFixed(1);
                            } else {
                                counter.textContent = target;
                            }
                        }
                    }

                    requestAnimationFrame(updateCounter);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const metricsSection = document.querySelector('.metrics-section');
    if (metricsSection) {
        counterObserver.observe(metricsSection);
    }

    // 3D Tilt Effect for Solution Cards
    const solutionCards = document.querySelectorAll('.solution-step');

    solutionCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Parallax effect on step number
            const stepNumber = card.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = `translateY(-4px) scale(1.05) translateX(${rotateY * 0.5}px) translateY(${-rotateX * 0.5}px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';

            const stepNumber = card.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'translateY(0) scale(1)';
            }

            setTimeout(() => {
                card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
            }, 500);
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
        });
    });

    // Invisible Counter Widget
    const widget = document.getElementById('invisibleWidget');
    const counterEl = document.getElementById('dealCounter');

    if (widget && counterEl) {
        let currentCount = Math.floor(Math.random() * 6) + 1;
        let counterInterval;
        let widgetClosed = false;

        // Set initial counter value
        counterEl.textContent = currentCount;

        function showWidget() {
            if (widgetClosed) return;
            widget.classList.add('visible');
            startCounter();

            // Hide after 12 seconds
            setTimeout(() => {
                hideWidget();
            }, 12000);
        }

        function hideWidget() {
            widget.classList.remove('visible');
            stopCounter();

            // Show again after 20 seconds
            setTimeout(() => {
                showWidget();
            }, 20000);
        }

        function closeWidget() {
            widget.classList.remove('visible');
            widgetClosed = true;
            stopCounter();
        }

        function startCounter() {
            scheduleNextIncrement();
        }

        function scheduleNextIncrement() {
            // Increment every 3 seconds (with slight variation)
            const delay = (Math.random() * 400) + 2800;
            counterInterval = setTimeout(() => {
                currentCount += Math.floor(Math.random() * 4) + 3;
                counterEl.style.transform = 'scale(1.1)';
                counterEl.style.transition = 'transform 0.2s ease';
                counterEl.textContent = currentCount;
                setTimeout(() => {
                    counterEl.style.transform = 'scale(1)';
                }, 200);
                scheduleNextIncrement();
            }, delay);
        }

        function stopCounter() {
            clearTimeout(counterInterval);
        }

        // Start the show/hide cycle after 11 seconds
        setTimeout(() => {
            showWidget();
        }, 11000);

        // Click to scroll to CTA (or close if close button clicked)
        widget.addEventListener('click', (e) => {
            if (e.target.classList.contains('widget-close')) {
                closeWidget();
                return;
            }
            document.querySelector('.final-cta').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    }

    // Profile cards parallax and swipe animation
    const cards = document.querySelectorAll('.profile-card');
    const heroContainer = document.querySelector('.hero-visual-container');
    const heroSection = document.querySelector('.hero');

    // Scroll speeds for parallax
    const scrollSpeeds = {
        'profile-card-1': 0.3,
        'profile-card-2': 0.2,
        'profile-card-3': 0.35,
        'profile-card-4': 0.25
    };

    // Card swipe timing: Sarah at 3000ms, then 1000ms intervals
    const swipeTimings = [
        { card: 'profile-card-1', delay: 3000 },
        { card: 'profile-card-3', delay: 4000 },
        { card: 'profile-card-4', delay: 5000 },
        { card: 'profile-card-2', delay: 6000 }
    ];

    let heroTop = 0;
    let swipeStarted = false;
    let cardsSwipedIn = new Set();

    function updateHeroPosition() {
        if (heroSection) {
            heroTop = heroSection.getBoundingClientRect().top + window.scrollY;
        }
    }
    updateHeroPosition();
    window.addEventListener('resize', updateHeroPosition);

    function startSwipeSequence() {
        if (swipeStarted) return;
        swipeStarted = true;

        // Swipe in each card
        swipeTimings.forEach(({ card, delay }) => {
            setTimeout(() => {
                const cardEl = document.querySelector('.' + card);
                if (cardEl) {
                    cardEl.classList.add('swiped-in');
                    cardEl.style.transform = 'translateX(0) translateY(0)';
                    cardsSwipedIn.add(card);
                }
            }, delay);
        });
    }

    function handleScroll() {
        const scrollY = window.scrollY;

        if (heroContainer) {
            const heroRect = heroContainer.getBoundingClientRect();

            if (heroRect.bottom > -200 && heroRect.top < window.innerHeight + 200) {
                cards.forEach(card => {
                    const cardClass = Array.from(card.classList).find(c => c.startsWith('profile-card-'));

                    if (cardsSwipedIn.has(cardClass)) {
                        const speed = scrollSpeeds[cardClass] || 0.25;
                        const yOffset = -(scrollY - heroTop) * speed;
                        card.style.transform = `translateX(0) translateY(${yOffset}px)`;
                    }
                });
            }
        }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    startSwipeSequence();

    // Stats carousel
    const statsCards = document.querySelectorAll('.stats-cards li');
    const prevBtn = document.getElementById('statsPrev');
    const nextBtn = document.getElementById('statsNext');

    if (statsCards.length === 0) return;

    let currentCenter = 0;
    let autoPlayInterval;
    let isAnimating = false;
    const totalCards = statsCards.length;

    function getPositionIndex(cardIndex, centerIndex) {
        // Calculate relative position from center
        let diff = cardIndex - centerIndex;

        // Handle wrapping for circular carousel
        if (diff > totalCards / 2) diff -= totalCards;
        if (diff < -totalCards / 2) diff += totalCards;

        // Map diff to position
        if (diff === 0) return 'center';
        if (diff === 1) return 'right-1';
        if (diff === -1) return 'left-1';
        if (diff === 2) return 'right-2';
        if (diff === -2) return 'left-2';
        return 'hidden';
    }

    function updatePositions() {
        statsCards.forEach((card, index) => {
            const position = getPositionIndex(index, currentCenter);
            card.setAttribute('data-position', position);
        });
    }

    function goToNext() {
        if (isAnimating) return;
        isAnimating = true;

        currentCenter = (currentCenter + 1) % totalCards;
        updatePositions();

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function goToPrev() {
        if (isAnimating) return;
        isAnimating = true;

        currentCenter = (currentCenter - 1 + totalCards) % totalCards;
        updatePositions();

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(goToNext, 4000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // Initialize positions
    updatePositions();

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToNext();
            startAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToPrev();
            startAutoPlay();
        });
    }

    // Click on side cards to navigate
    statsCards.forEach((card) => {
        card.addEventListener('click', () => {
            const position = card.getAttribute('data-position');
            if (position === 'left-1' || position === 'left-2') {
                goToPrev();
                startAutoPlay();
            } else if (position === 'right-1' || position === 'right-2') {
                goToNext();
                startAutoPlay();
            }
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    const gallery = document.getElementById('statsGallery');

    if (gallery) {
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, { passive: true });

        gallery.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToNext();
                } else {
                    goToPrev();
                }
            }
            startAutoPlay();
        }, { passive: true });

        // Pause autoplay on hover
        gallery.addEventListener('mouseenter', stopAutoPlay);
        gallery.addEventListener('mouseleave', startAutoPlay);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const statsSection = document.querySelector('.research-stats-section');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            if (e.key === 'ArrowRight') {
                goToNext();
                startAutoPlay();
            } else if (e.key === 'ArrowLeft') {
                goToPrev();
                startAutoPlay();
            }
        }
    });

    // Start autoplay
    startAutoPlay();

    // Use case tabs
    const usecaseTabs = document.querySelectorAll('.usecase-tab');
    const contents = document.querySelectorAll('.usecase-content');

    if (usecaseTabs.length === 0) return;

    usecaseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active from all tabs
            usecaseTabs.forEach(t => t.classList.remove('active'));

            // Add active to clicked tab
            tab.classList.add('active');

            // Hide all content
            contents.forEach(content => {
                content.classList.remove('active');
            });

            // Show target content
            const targetContent = document.querySelector(`.usecase-content[data-content="${targetTab}"]`);
            if (targetContent) {
                // Small delay for transition effect
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 50);
            }
        });
    });

    // Typing animation
    const typingWord = document.querySelector('.typing-word');
    if (!typingWord) return;

    const words = ['sales', 'revenue', 'pipeline', 'marketing', 'growth'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 100;       // Speed of typing each character
    const deleteSpeed = 60;      // Speed of deleting each character
    const pauseAfterWord = 2000; // Pause after word is complete
    const pauseBeforeType = 400; // Pause before typing new word

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            // Delete characters
            charIndex--;
            // Use zero-width space when empty to maintain cursor position
            typingWord.innerHTML = charIndex > 0 ? currentWord.substring(0, charIndex) : '\u200B';

            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, pauseBeforeType);
                return;
            }

            setTimeout(type, deleteSpeed);
        } else {
            // Type characters
            charIndex++;
            typingWord.textContent = currentWord.substring(0, charIndex);

            if (charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, pauseAfterWord);
                return;
            }

            setTimeout(type, typeSpeed);
        }
    }

    // Initialize with zero-width space
    typingWord.innerHTML = '\u200B';

    // Start typing
    setTimeout(type, 500);
}
