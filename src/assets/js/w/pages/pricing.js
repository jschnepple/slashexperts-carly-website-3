/* pricing page JS — set-piece lifted verbatim from the designer bundle tail.
   [0] stackfit hero pin (.pr-stack .pr-hero — sticky only when it fits viewport height).
   Tail scripts 1 (nav-surface), 2 (footer peel), 3 (nav drawer) are shared → js/w/base.js, dropped. */

/* Adobe stacking · stackfit — pin the hero only when it FITS the viewport height (JS, not a width query) */
(function(){var hero=document.querySelector('.pr-stack .pr-hero');if(!hero)return;var mq=matchMedia('(prefers-reduced-motion: reduce)');function upd(){var fit=innerWidth>700&&!mq.matches&&hero.scrollHeight<=innerHeight-4;if(fit){hero.style.position='sticky';hero.style.top='0';hero.style.zIndex='0';}else{hero.style.position='relative';hero.style.top='auto';}}upd();addEventListener('resize',upd,{passive:true});addEventListener('load',upd);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(upd);mq.addEventListener&&mq.addEventListener('change',upd);})();
