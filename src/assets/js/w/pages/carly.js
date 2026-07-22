/* Carly page-specific behaviors (shared nav/reveal/parallax/footer live in js/w/base.js) */

/* §2 why-agent — full-bleed panels: reveal each on scroll (clip-wipe + settle-scale + copy rise).
   No pin/scrub. Reduced-motion or no IO: show all immediately. */
(function(){
  var ps=[].slice.call(document.querySelectorAll('#why-agent .cz-wa-panel'));
  if(!ps.length) return;
  if(!('IntersectionObserver' in window) || (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches)){
    ps.forEach(function(p){ p.classList.add('is-in'); }); return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
  },{threshold:0.28, rootMargin:'0px 0px -8% 0px'});
  ps.forEach(function(p){ io.observe(p); });
})();

/* §4 What Carly does — pinned 4-state scrub over the nebula (same idea as §2 why-agent). */
(function(){
  var sec=document.getElementById('what'); if(!sec) return;
  var states=[].slice.call(sec.querySelectorAll('.cz-do-state'));
  var dots=[].slice.call(sec.querySelectorAll('.cz-do-dot'));
  if(states.length<2) return;
  if(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var n=states.length, cur=-1, ticking=false;
  function cl(v){return v<0?0:v>1?1:v;}
  function upd(){
    ticking=false;
    if(matchMedia('(max-width:768px)').matches){ states.forEach(function(s){s.classList.add('is-on');}); return; }
    var total=sec.offsetHeight-window.innerHeight;
    if(total<=0) return;
    var p=cl(-sec.getBoundingClientRect().top/total);
    var i=Math.floor(p*n - 1e-6); if(i<0)i=0; if(i>n-1)i=n-1;
    if(i!==cur){
      cur=i;
      states.forEach(function(s,k){ s.classList.toggle('is-on', k===i); });
      dots.forEach(function(d,k){ d.classList.toggle('is-on', k===i); });
    }
  }
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(upd); } }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  window.addEventListener('load',upd);
  upd();
})();

/* scale fixed-size embeds (hero 1320 · story 1180 · showcase 1480) to their container width */
(function(){
  function mount(id,w){
    var box=document.getElementById(id);
    if(!box) return;
    function fit(){var f=box.querySelector('iframe');if(f) f.style.transform='scale('+(box.clientWidth/w)+')';}
    window.addEventListener('resize',fit);
    window.addEventListener('load',fit);
    fit();
  }
  mount('heroEmbed',1320);
  mount('storyEmbed',1180);
  mount('showcaseDevice',1480);
})();
/* §4 showcase — pinned scroll-scrub: rail persists on the left, the active tab advances with scroll
   (Activity → Proof Vault → … → Help); each screen crossfades on the device via postMessage.
   Activity auto-plays first. Tabs remain clickable; mobile falls back to click-only. */
(function(){
  var device=document.getElementById('showcaseDevice');
  var sec=document.getElementById('showcase');
  if(!device||!sec) return;
  var ifr=device.querySelector('iframe');
  var tabs=[].slice.call(document.querySelectorAll('.cz-frow'));
  if(!ifr||!tabs.length) return;
  var cur=-1, activated=false;
  /* permanent guard: should the device iframe ever grab focus, blur it immediately and hold
     the scroll position — the section can never yank the page or steal focus. */
  ifr.addEventListener('focus',function(){ try{ ifr.blur(); }catch(e){} });
  function post(i){ try{ ifr.contentWindow.postMessage({cz:'czSetActive',i:i},'*'); }catch(e){} }
  function select(i){
    if(i===cur) return; cur=i;
    tabs.forEach(function(t,j){var on=j===i;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',on?'true':'false');});
    post(i);
  }
  /* Load the device iframe ONLY when the section is reached — stops it stealing focus /
     yanking the page down on load, and Activity plays exactly when you arrive. */
  function activate(){
    if(activated) return; activated=true;
    ifr.addEventListener('load',function(){
      post(cur<0?0:cur);
      if(document.activeElement===ifr){ try{ ifr.blur(); }catch(e){} }   /* don't let the iframe grab scroll */
    });
    var sd=ifr.getAttribute('data-cz-srcdoc'), sc=ifr.getAttribute('data-cz-src');
    if(sd!=null){ ifr.setAttribute('srcdoc',sd); ifr.removeAttribute('data-cz-srcdoc'); }
    else if(sc){ ifr.setAttribute('src',sc); ifr.removeAttribute('data-cz-src'); }
    select(0);   /* Activity shown first */
  }
  /* CLICK-DRIVEN: click a tab to view it. No scroll-scrub — scrolling just leaves the section. */
  tabs.forEach(function(t,i){ t.addEventListener('click',function(){ activate(); select(i); }); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) activate(); }); },{rootMargin:'250px 0px'});
    io.observe(sec);
  } else { activate(); }
})();

/* stop anything from yanking the page onto #showcase: revert un-provoked scroll jumps that land on it */(function(){
  var sec=document.getElementById('showcase');if(!sec)return;
  var lastInput=Date.now();
  ['wheel','touchstart','touchmove','keydown','pointerdown','mousedown'].forEach(function(ev){window.addEventListener(ev,function(){lastInput=Date.now();},{passive:true,capture:true});});
  var lastY=window.pageYOffset||0;
  window.addEventListener('scroll',function(){var y=window.pageYOffset;
    if(Math.abs(y-lastY)>200 && (Date.now()-lastInput)>250){var r=sec.getBoundingClientRect();
      if(r.top<window.innerHeight*0.6 && r.bottom>0){window.scrollTo(0,lastY);return;}}
    lastY=y;},{passive:true});
})();
