/**
 * Become An Expert Page JavaScript Module
 * Handles FAQ accordion, calculator, testimonial carousel, floating avatar animations, and video modal
 */

import { initVideoModal } from '../components/video-modal.js';

export function initBecomeanexpert() {
    // Initialize video modal
    initVideoModal();
    // FAQ Accordion
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Calculator
    const slider = document.getElementById('callsSlider');
    const callsValue = document.getElementById('callsValue');
    const earningsValue = document.getElementById('earningsValue');

    if (slider && callsValue && earningsValue) {
        slider.addEventListener('input', () => {
            const calls = slider.value;
            callsValue.textContent = calls;
            const earnings = calls * 150;
            earningsValue.textContent = '$' + earnings.toLocaleString();
        });
    }

    // Floating Avatars Pop Animation on scroll
    const testimonialsSection = document.getElementById('testimonialsSection');
    const floatingAvatars = document.querySelectorAll('.floating-avatar');

    if (testimonialsSection && floatingAvatars.length > 0) {
        // Intersection Observer for avatar pop animation
        const avatarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class to all floating avatars
                    // CSS animation-delay handles the staggered timing
                    floatingAvatars.forEach((avatar) => {
                        avatar.classList.add('visible');
                    });

                    // Unobserve after animation triggers
                    avatarObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        avatarObserver.observe(testimonialsSection);
    }

    // Testimonial Carousel
    const carouselCards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('carouselDots');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    if (carouselCards.length > 0 && dotsContainer && prevArrow && nextArrow) {
        let currentIndex = 2; // Start with the 3rd card centered (Omar Hassan)
        const totalCards = carouselCards.length;

        // Generate dots
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        const dots = document.querySelectorAll('.carousel-dot');

        function updateCarousel() {
            carouselCards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

                const diff = index - currentIndex;

                if (diff === 0) {
                    card.classList.add('active');
                } else if (diff === -1 || (currentIndex === 0 && index === totalCards - 1)) {
                    card.classList.add('prev');
                } else if (diff === 1 || (currentIndex === totalCards - 1 && index === 0)) {
                    card.classList.add('next');
                } else if (diff === -2 || (currentIndex <= 1 && index >= totalCards - 2)) {
                    card.classList.add('far-prev');
                } else if (diff === 2 || (currentIndex >= totalCards - 2 && index <= 1)) {
                    card.classList.add('far-next');
                }
            });

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        // Event listeners
        nextArrow.addEventListener('click', nextSlide);
        prevArrow.addEventListener('click', prevSlide);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });

        // Initialize carousel
        updateCarousel();
    }
}
