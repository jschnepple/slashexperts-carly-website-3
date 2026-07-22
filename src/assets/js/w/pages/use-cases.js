/* cux- scene scaler — CONTAIN + CENTER (never width-only; width-only clips the canvas
   bottom at medium widths — responsive-traps.md §3). Runs on load/resize/fonts-ready.
   A wide canvas contain-scaled into a narrow stage doesn't clip — it goes ILLEGIBLE. So each
   fragment may declare a PORTRAIT alternate via data-canvas-sm, and we flag it to CSS with
   .is-sm at/below its own legibility floor (data-sm-at, default 700). SCENE-LEGIBILITY gate. */
(function(){
  var fits=[].slice.call(document.querySelectorAll(".cux-fit"));
  if(!fits.length)return;
  function fit(el){
    var box=el.parentNode;
    var at=parseFloat(el.getAttribute("data-sm-at"))||700;
    var sm = innerWidth<=at && el.getAttribute("data-canvas-sm");
    el.classList.toggle("is-sm", !!sm);
    var d=(sm || el.getAttribute("data-canvas")||"").split("x");
    var W=parseFloat(d[0]), H=parseFloat(d[1]); if(!W||!H)return;
    el.style.width=W+"px"; el.style.height=H+"px";
    var bw=box.clientWidth, bh=box.clientHeight; if(!bw||!bh)return;
    var sc=Math.min(bw/W, bh/H);
    el.style.transform="translate("+((bw-W*sc)/2).toFixed(2)+"px,"+((bh-H*sc)/2).toFixed(2)+"px) scale("+sc.toFixed(4)+")";
  }
  function all(){fits.forEach(fit);}
  all();
  addEventListener("resize",all,{passive:true});
  addEventListener("load",all);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(all);
  if(window.ResizeObserver){var ro=new ResizeObserver(all);fits.forEach(function(el){ro.observe(el.parentNode);});}

  /* still compositions reveal with their section (no loop) */
  var stills=[].slice.call(document.querySelectorAll(".cux-still"));
  if(stills.length){
    if("IntersectionObserver" in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target);}
      });},{threshold:0.15});
      stills.forEach(function(el){io.observe(el);});
    }else{stills.forEach(function(el){el.classList.add("is-in");});}
  }

  /* §7 loop diagram doubles as the page's second nav — a click on a node jumps to its band.
     Anchors inside the scaled canvas keep working because the canvas is transformed, not
     re-rendered; we only need smooth-scroll + a focus ring for keyboard users. */
  document.querySelectorAll('[data-jump]').forEach(function(n){
    n.addEventListener('click',function(){
      var t=document.querySelector(n.getAttribute('data-jump'));
      if(t)t.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"});
    });
  });

  /* ── ADOBE COVER-REVEAL STACK ───────────────────────────────────────────────────
     The closing run stacks via CSS only (rising z-index + a cover-overlap + rounded
     tops in _page.css) — no JS pinning. Pinning was removed because these sections
     are taller than the viewport and top-weighted, so a hard pin left dead bands
     (Jeff picked the scroll cover-reveal, 07-15). Nothing to compute here. */
})();
