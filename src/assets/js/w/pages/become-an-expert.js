/* become-an-expert page JS — set-pieces lifted verbatim from the designer bundle tail.
   [0] bxx- scene scaler (.bxx-fit contain+center)  [1] stackfit pin (.bx-stack>section).
   The 3rd tail script (DS7 nav drawer/mega) is shared → lives in js/w/base.js, dropped. */

/* bxx- scene scaler — CONTAIN + CENTER (never width-only; width-only clips the canvas
   bottom at medium widths — responsive-traps.md §3). Runs on load/resize/fonts-ready. */
(function(){
  var fits=[].slice.call(document.querySelectorAll(".bxx-fit"));
  if(!fits.length)return;
  function fit(el){
    var box=el.parentNode;
    /* a wide canvas contain-scales to illegibility in a narrow stage. A fragment may declare an
       alternate PORTRAIT canvas via data-canvas-sm; we use it (and flag it to CSS with .is-sm)
       below 700px so the fragment can re-lay-out itself for that canvas via a media query. */
    var at = parseInt(el.getAttribute("data-sm-at"),10) || 700;   /* per-scene breakpoint */
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
  /* The §2 card figures are STILL compositions — reveal them with the section (no loop).
     (bea1 + bea3 are pure-CSS loops and need no observer.) */
  var stills=[].slice.call(document.querySelectorAll(".bea2a-scene,.bea2b-scene,.bea2c-scene"));
  if(stills.length&&"IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target);}
    });},{threshold:0.15});
    stills.forEach(function(el){io.observe(el);});
  }else{stills.forEach(function(el){el.classList.add("is-in");});}
})();

/* Adobe stacking · stackfit — a section pins ONLY if it FITS the viewport HEIGHT.
   (CSS media queries can't test height; a pinned section taller than the viewport hides its own
   bottom content. motion-library §2 + responsive-traps.) */
(function(){
  var secs=[].slice.call(document.querySelectorAll(".bx-stack > section"));
  if(!secs.length)return;
  var mq=matchMedia("(prefers-reduced-motion: reduce)");
  function upd(){
    var off = innerWidth<=900 || mq.matches;
    secs.forEach(function(s){
      var fits = !off && s.scrollHeight <= innerHeight-4;
      if(fits){ s.style.position=""; s.style.top=""; }        /* let the CSS sticky apply */
      else    { s.style.position="relative"; s.style.top="auto"; }  /* flow, fully visible */
    });
  }
  upd();
  addEventListener("resize",upd,{passive:true});
  addEventListener("load",upd);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(upd);
  if(mq.addEventListener)mq.addEventListener("change",upd);
})();
