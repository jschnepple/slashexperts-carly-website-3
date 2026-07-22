(function(){var nav=document.querySelector(".w-nav");if(!nav)return;var secs=[].slice.call(document.querySelectorAll("[data-nav-surface]"));var t=false;function upd(){var line=nav.offsetHeight*0.55,cur="dark";for(var i=0;i<secs.length;i++){var r=secs[i].getBoundingClientRect();if(r.top<=line&&r.bottom>line){cur=secs[i].getAttribute("data-nav-surface");break;}}nav.classList.toggle("is-on-light",cur==="light");nav.classList.toggle("is-on-dark",cur!=="light");}upd();addEventListener("scroll",function(){if(t)return;t=true;requestAnimationFrame(function(){upd();t=false;});},{passive:true});addEventListener("resize",upd,{passive:true});})();

(function(){
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* 1 · stagger reveal children inside grids */
if(!rm){document.querySelectorAll('.w-grid,.w-stat-grid').forEach(function(g){
  var k=[].slice.call(g.children).filter(function(c){return c.classList.contains('w-reveal');});
  k.forEach(function(c,i){if(!c.style.getPropertyValue('--w-reveal-delay'))c.style.setProperty('--w-reveal-delay',(i*100)+'ms');});});}
/* 2 · count-up on stat numbers */
function cu(el){var raw=el.getAttribute('data-cu')||el.textContent.trim();el.setAttribute('data-cu',raw);
  var m=raw.match(/^(\D*)(\d[\d,]*)(.*)$/);if(!m){return;}var pre=m[1],num=parseInt(m[2].replace(/,/g,''),10),suf=m[3];
  if(rm){el.textContent=raw;return;}var d=1500,t0=null;
  function st(t){if(!t0)t0=t;var p=Math.min((t-t0)/d,1),e=1-Math.pow(1-p,3);el.textContent=pre+Math.round(num*e)+suf;if(p<1)requestAnimationFrame(st);else el.textContent=raw;}
  requestAnimationFrame(st);}
var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){cu(en.target);io.unobserve(en.target);}});},{threshold:.6});
[].slice.call(document.querySelectorAll('.w-stat__value')).filter(function(el){return !el.closest('.hm-proof');}).forEach(function(el){io.observe(el);});
/* robust reveal — guarantees large assets reveal (threshold 0) */
var rio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('is-visible');rio.unobserve(en.target);}});},{threshold:0,rootMargin:'0px 0px -12% 0px'});
document.querySelectorAll('.w-reveal').forEach(function(el){rio.observe(el);});
/* why-now: start the asset's card entrance only when the section is well in view */
var wb=document.querySelector('.hm-why__band');
if(wb){if(matchMedia('(prefers-reduced-motion:reduce)').matches){wb.classList.add('why-go');}else{var wio=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('why-go');wio.unobserve(en.target);}});},{threshold:0,rootMargin:'0px 0px -40% 0px'});wio.observe(wb);}}
/* 3 · subtle hero parallax */
var hero=document.querySelector('.hm-hero');
if(hero&&!rm){var tick=false;addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){
  var off=Math.max(-hero.getBoundingClientRect().top,0);hero.style.setProperty('--hero-py',Math.min(off*0.10,36)+'px');tick=false;});},{passive:true});}
})();

/* DS7-Web · nav behavior — mobile drawer open/close. Desktop dropdowns are CSS hover/focus. */
(function(){
  var drawer = document.getElementById('wNavDrawer');
  function open(){ if(!drawer) return; drawer.classList.add('is-open'); document.body.style.overflow='hidden'; }
  function close(){ if(!drawer) return; drawer.classList.remove('is-open'); document.body.style.overflow=''; }
  document.querySelectorAll('[data-nav-open]').forEach(function(b){ b.addEventListener('click', open); });
  document.querySelectorAll('[data-nav-close]').forEach(function(b){ b.addEventListener('click', close); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
})();

/* mega-menu hover-intent + click toggle (close delay bridges the bar→panel gap) */
(function(){
  var items = [].slice.call(document.querySelectorAll('.w-nav__item'))
                .filter(function(i){ return i.querySelector('.w-nav__mega'); });
  if(!items.length) return;
  var timer;
  function openItem(item){
    clearTimeout(timer);
    items.forEach(function(i){ i.classList.toggle('is-open', i===item);
      var b=i.querySelector('.w-nav__link'); if(b&&b.hasAttribute('aria-haspopup')) b.setAttribute('aria-expanded', i===item ? 'true':'false'); });
  }
  function closeAll(){ items.forEach(function(i){ i.classList.remove('is-open');
    var b=i.querySelector('.w-nav__link'); if(b&&b.hasAttribute('aria-haspopup')) b.setAttribute('aria-expanded','false'); }); }
  items.forEach(function(item){
    var btn = item.querySelector('.w-nav__link');
    item.addEventListener('mouseenter', function(){ openItem(item); });
    item.addEventListener('mouseleave', function(){ clearTimeout(timer); timer=setTimeout(closeAll, 180); });
    if(btn) btn.addEventListener('click', function(e){ e.preventDefault();
      item.classList.contains('is-open') ? closeAll() : openItem(item); });
  });
  document.addEventListener('click', function(e){ if(!e.target.closest('.w-nav__item')) closeAll(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeAll(); });
})();

/* account / login dropdown (rightmost) — hover-intent + click toggle */
(function(){
  var prof = document.querySelector('.w-nav__profile[data-profile]');
  if(!prof) return;
  var btn = prof.querySelector('.w-nav__avatar');
  var timer;
  function open(){ clearTimeout(timer); prof.classList.add('is-open'); if(btn) btn.setAttribute('aria-expanded','true'); }
  function close(){ prof.classList.remove('is-open'); if(btn) btn.setAttribute('aria-expanded','false'); }
  prof.addEventListener('mouseenter', open);
  prof.addEventListener('mouseleave', function(){ clearTimeout(timer); timer=setTimeout(close, 180); });
  if(btn) btn.addEventListener('click', function(e){ e.preventDefault();
    prof.classList.contains('is-open') ? close() : open(); });
  document.addEventListener('click', function(e){ if(!e.target.closest('.w-nav__profile')) close(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
})();

/* adaptive header — the bar (and its dropdown) restyle to match the section behind them.
   Mark a section with data-nav-surface="light" | "dark". Falls back to the page theme.
   Only runs on a pinned header (sticky/fixed) — in-page demos are left alone. */
(function(){
  var nav = document.querySelector('.w-nav');
  if(!nav) return;
  var pos = getComputedStyle(nav).position;
  if(pos !== 'sticky' && pos !== 'fixed') return;
  function pageSurface(){ return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function sample(){
    var h = nav.offsetHeight;
    nav.style.pointerEvents = 'none';
    var el = document.elementFromPoint(Math.round(window.innerWidth/2), h + 2);
    nav.style.pointerEvents = '';
    if(!(el && el.closest && el.closest('.w-nav'))){       // ignore samples that land on the bar/panel
      var marked = el && el.closest && el.closest('[data-nav-surface]');
      var surface = marked ? marked.getAttribute('data-nav-surface') : pageSurface();
      nav.classList.toggle('is-on-light', surface === 'light');
      nav.classList.toggle('is-on-dark',  surface !== 'light');
    }
    nav.classList.toggle('is-stuck', (window.scrollY || window.pageYOffset) > 4);
  }
  var ticking = false;
  function onScroll(){ if(ticking) return; ticking = true; requestAnimationFrame(function(){ sample(); ticking = false; }); }
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  sample();
})();

/* DS7-Web · base behavior — reveal-on-scroll via IntersectionObserver.
   Add class "w-reveal" to any element; optional inline style --w-reveal-delay for stagger.
   Honors prefers-reduced-motion (CSS shows them immediately; JS still no-ops gracefully). */
(function(){
  var els = document.querySelectorAll('.w-reveal');
  if(!els.length) return;
  if(!('IntersectionObserver' in window) ||
     window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    els.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  els.forEach(function(el){ io.observe(el); });
})();


/* parallax-move (Adobe): elements with [data-parallax="0.06"] drift up faster than scroll as they enter.
   Adds to (does not fight) reveal — only target elements that carry no other transform. */
(function(){
  var nodes=[].slice.call(document.querySelectorAll('[data-parallax]'));
  if(!nodes.length) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var tick=false;
  function upd(){
    tick=false; var vh=window.innerHeight||document.documentElement.clientHeight;
    for(var i=0;i<nodes.length;i++){
      var el=nodes[i], r=el.getBoundingClientRect();
      if(r.bottom<-60||r.top>vh+60) continue;
      var c=r.top+r.height/2, d=(c-vh/2)/vh, sp=parseFloat(el.getAttribute('data-parallax'))||0.06;
      el.style.transform='translate3d(0,'+(-d*vh*sp).toFixed(1)+'px,0)';
    }
  }
  function onS(){ if(tick) return; tick=true; requestAnimationFrame(upd); }
  window.addEventListener('scroll',onS,{passive:true});
  window.addEventListener('resize',onS,{passive:true});
  upd();
})();

/* footer peel-up — size spacer to the static /Experts mark */(function(){
  var big=document.querySelector('.w-footer__bigmark'),sp=document.querySelector('.w-foot-spacer');
  if(!big||!sp)return;
  function upd(){ sp.style.height=(window.innerWidth<=900?0:big.offsetHeight)+'px'; }
  upd();addEventListener('resize',upd,{passive:true});addEventListener('load',upd);
})();

/* footer /Experts reveal — rises within its clip as the footer scrolls in (all screens) */(function(){var box=document.querySelector('.w-footer__bigmark'),tx=box&&box.querySelector('.w-footer__bigmark-tx');if(!box||!tx)return;if(matchMedia('(prefers-reduced-motion:reduce)').matches){tx.style.transform='none';return;}var tick=false;function upd(){var r=box.getBoundingClientRect(),vh=window.innerHeight||document.documentElement.clientHeight;var p=Math.min(1,Math.max(0,(vh-r.top)/r.height));tx.style.transform='translateY('+((1-p)*100).toFixed(1)+'%)';}function onS(){if(tick)return;tick=true;requestAnimationFrame(function(){upd();tick=false;});}addEventListener('scroll',onS,{passive:true});addEventListener('resize',onS,{passive:true});upd();addEventListener('load',upd);})();
