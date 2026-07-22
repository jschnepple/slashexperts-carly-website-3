/* peer-matching page JS (P3, Session E). Two page-specific set-pieces lifted verbatim
   from the designer bundle tail: the emx- scene fit-scaler + the §better-together
   briefcase-open/cards fly-in. Shared behavior (nav drawer, reveal, parallax) is in base.js. */
/* emx- scene scaler — CONTAIN + CENTER (never width-only; width-only clips the canvas
   bottom at medium widths — responsive-traps.md §3). Runs on load/resize/fonts-ready. */
(function(){
  var fits=[].slice.call(document.querySelectorAll(".emx-fit"));
  if(!fits.length)return;
  function fit(el){
    var box=el.parentNode;
    /* a wide canvas contain-scales to illegibility in a narrow stage. A fragment may declare an
       alternate PORTRAIT canvas via data-canvas-sm; we use it (and flag it to CSS with .is-sm)
       below 700px so the fragment can re-lay-out itself for that canvas via a media query. */
    var sm = innerWidth<=700 && el.getAttribute("data-canvas-sm");
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
  /* A3 is a still composition — reveal it with the section (no loop). */
  var s3=document.querySelector(".ema3-scene");
  if(s3&&"IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target);}
    });},{threshold:0.15});
    io.observe(s3);
  }else if(s3){s3.classList.add("is-in");}

  /* ── ADOBE STACK · stackfit ─────────────────────────────────────────────────
     Whether a section can be PINNED depends on viewport HEIGHT, which CSS media queries
     cannot test. A pinned section taller than the viewport hides its own bottom content
     (its CTA disappears). So: measure, and unpin anything that doesn't fit. */
  (function(){
    var stack=document.querySelector(".ems-stack");
    if(!stack)return;
    var secs=[].slice.call(stack.children).filter(function(e){return e.tagName==="SECTION";});
    var rm=matchMedia("(prefers-reduced-motion:reduce)");
    function stackfit(){
      var off = innerWidth<=700 || rm.matches;
      secs.forEach(function(el){
        if(off || el.scrollHeight > innerHeight-4){
          el.style.position="relative"; el.style.top="auto";
        }else{
          el.style.position=""; el.style.top="";
        }
      });
    }
    stackfit();
    addEventListener("resize",stackfit,{passive:true});
    addEventListener("load",stackfit);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(stackfit);
    if(rm.addEventListener)rm.addEventListener("change",stackfit);
  })();
})();

/* §10 better-together — image briefcase-open + cards fly-in (scroll-linked).
   Lifted VERBATIM from the shipped W-HOME §5. Approved set-piece (motion-library.md §5). */(function(){
  var sec=document.getElementById('better-together'); if(!sec) return;
  var img=sec.querySelector('.hm-bt__img');
  var cards=sec.querySelectorAll('.bt-fly');
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(rm){ if(img)img.style.transform='none'; for(var k=0;k<cards.length;k++){cards[k].style.opacity='1';cards[k].style.transform='none';} return; }
  function absTop(e){var y=0;while(e){y+=e.offsetTop;e=e.offsetParent;}return y;}
  var tick=false;
  function upd(){
    if(!img) return;
    var vh=innerHeight||document.documentElement.clientHeight;
    var top=absTop(img)-window.scrollY;
    var p=Math.min(1,Math.max(0,(vh-top)/(vh*0.82)));
    img.style.transform='perspective(1500px) rotateX('+(72*(1-p)).toFixed(2)+'deg) scale('+(1+0.22*(1-p)).toFixed(4)+')';
    for(var i=0;i<cards.length;i++){
      var ctop=absTop(cards[i])-window.scrollY;
      var raw=(vh-ctop)/(vh*0.52);
      var ci=Math.min(1,Math.max(0, raw - i*0.16));
      var e=ci<.5?2*ci*ci:1-Math.pow(-2*ci+2,2)/2;
      cards[i].style.opacity=e.toFixed(3);
      cards[i].style.transform='translate3d(0,'+((1-e)*92).toFixed(1)+'px,0) scale('+(0.96+0.04*e).toFixed(3)+')';
    }
  }
  function onS(){ if(tick)return; tick=true; requestAnimationFrame(function(){upd();tick=false;}); }
  addEventListener('scroll',onS,{passive:true});
  addEventListener('resize',onS,{passive:true});
  addEventListener('load',upd);
  upd();
})();
