/* Experts+ page-specific behaviors (shared nav/reveal/parallax/footer live in js/w/base.js) */

/* §2 peer split — slide panels in from the sides when the block scrolls into view */(function(){var els=[].slice.call(document.querySelectorAll(".ep-peer2,.ep-cust2"));if(!els.length)return;if(!("IntersectionObserver" in window)||(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)){els.forEach(function(el){el.classList.add("is-in");});return;}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target);}});},{threshold:.25});els.forEach(function(el){io.observe(el);});})();

/* §4 showcase — tab switch + lazy real-app embeds (loaded when the section nears the viewport;
   each activation replays the scene's ExpertScore animation via postMessage) */(function(){
var w=document.querySelector(".ep-show");if(!w)return;
var tabs=[].slice.call(w.querySelectorAll(".ep-show__tab")),scenes=[].slice.call(w.querySelectorAll(".ep-show__scene"));
var activated=false;
function frameOf(sc){return sc.querySelector(".ep-show__appframe");}
function activate(){if(activated)return;activated=true;
  scenes.forEach(function(sc){var f=frameOf(sc);if(!f)return;
    f.addEventListener("focus",function(){try{f.blur();}catch(e){}});
    var sd=f.getAttribute("data-ep-srcdoc"),src=f.getAttribute("data-ep-src");
    if(sd!=null){f.setAttribute("srcdoc",sd);f.removeAttribute("data-ep-srcdoc");}
    else if(src){f.setAttribute("src",src);f.removeAttribute("data-ep-src");}
  });}
function play(sc){var f=frameOf(sc);if(!f||!f.contentWindow)return;try{f.contentWindow.postMessage({ep:"epPlay"},"*");}catch(e){}}
function show(i){activate();
  tabs.forEach(function(t,j){t.classList.toggle("is-active",j===i);t.setAttribute("aria-selected",j===i?"true":"false");});
  scenes.forEach(function(sc,j){sc.classList.toggle("is-active",j===i);if(j===i)play(sc);});}
tabs.forEach(function(t,i){t.addEventListener("click",function(){show(i);});});
if("IntersectionObserver" in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){activate();io.disconnect();}});},{rootMargin:"300px 0px"});
  io.observe(w);
}else{activate();}
})();

/* §3 how-it-works — pinned scroll-scrub (like What Carly does) */(function(){var eph=document.querySelector(".ephow");if(!eph)return;var rows=[].slice.call(eph.querySelectorAll(".ephow__row")),dots=[].slice.call(eph.querySelectorAll(".ephow__dot"));if(!rows.length)return;var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;function set(i){rows.forEach(function(r,j){r.classList.toggle("is-on",j===i);});dots.forEach(function(d,j){d.classList.toggle("is-on",j===i);});}function upd(){if((window.matchMedia&&matchMedia("(max-width:840px)").matches)||reduce){rows.forEach(function(r){r.classList.remove("is-on");});return;}var r=eph.getBoundingClientRect(),total=eph.offsetHeight-window.innerHeight;if(total<=0){set(0);return;}var p=Math.min(1,Math.max(0,-r.top/total)),i=Math.floor(p*rows.length-1e-6);if(i<0)i=0;if(i>rows.length-1)i=rows.length-1;set(i);}set(0);addEventListener("scroll",upd,{passive:true});addEventListener("resize",upd);addEventListener("load",upd);upd();})();
