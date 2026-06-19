/**
 * 3D tilt effect for hero cards and visual elements
 * Creates perspective-based tilt on mousemove
 */
export function initTilt() {
  const heroCard = document.getElementById('heroCard');
  const heroVisual = document.getElementById('heroVisual');

  if (!heroCard || !heroVisual) return;

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
