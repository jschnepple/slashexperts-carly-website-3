/* A1 scene scaler — contain + center (motion-library §6) */
(function(){
  var m=document.querySelector('.chwl-mount'); if(!m) return;
  function fit(){
    var f=m.querySelector('.chwl-fit'); if(!f) return;
    var W=m.clientWidth,H=m.clientHeight,s=Math.min(W/1180,H/860);
    f.style.transform='translate('+((W-1180*s)/2)+'px,'+((H-860*s)/2)+'px) scale('+s+')';
  }
  if('ResizeObserver' in window){ new ResizeObserver(fit).observe(m); }
  window.addEventListener('resize',fit,{passive:true}); fit();
})();

/* §3 moments — pin + scrub rail horizontally; a single visor "flagger" flows across each card on scroll */(function(){
  var sec=document.getElementById('moments');if(!sec)return;
  var vp=sec.querySelector('.chw-ov__viewport'),track=sec.querySelector('.chw-ov__track');
  var pin=sec.querySelector('.chw-ov__pin'),flag=sec.querySelector('.chw-ov__flag'),foot=sec.querySelector('.chw-ov__foot');
  var head=sec.querySelector('.w-section-head');
  var cards=[].slice.call(sec.querySelectorAll('.chw-ov__card'));
  if(!vp||!track)return;
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,maxX=0,on=false,tick=false;
  var E0=0.10, O0=0.88;                       /* intro end · outro start */
  function setFlag(cx,y){        /* cx = target centre-x, y = desired flag top (both viewport coords) */
    if(!flag||!pin)return;
    var pr=pin.getBoundingClientRect();
    flag.style.transform='translate('+(cx-pr.left-flag.offsetWidth/2).toFixed(1)+'px,'+(y-pr.top).toFixed(1)+'px)';
  }
  function flagOff(){cards.forEach(function(c){c.classList.remove('is-flagged');});}
  function render(){
    if(!on)return;
    var top=sec.getBoundingClientRect().top;var p=Math.min(1,Math.max(0,(-top)/maxX));
    track.style.transform='translate3d('+(-p*maxX).toFixed(1)+'px,0,0)';
    if(!flag)return;
    flag.classList.add('is-on');
    if(p<E0){                                                          /* default: rest on top of the badge */
      flagOff();flag.classList.remove('on-card');
      var badge=(head&&head.querySelector('.w-badge'))||head,br=badge.getBoundingClientRect();
      var by=Math.max(br.top-flag.offsetHeight*0.94, 80);              /* rest ABOVE the badge (don't cover it); never behind the nav */
      setFlag(br.left+br.width/2, by);
    } else if(p<O0){                                                   /* ride the top of the active card */
      var t=(p-E0)/(O0-E0), idx=Math.min(cards.length-1,Math.floor(t*cards.length));
      cards.forEach(function(c,i){c.classList.toggle('is-flagged',i===idx);});
      flag.classList.add('on-card');
      var cr=cards[idx].getBoundingClientRect();
      setFlag(cr.left+cr.width/2, cr.top-flag.offsetHeight*0.5);
    } else {                                                           /* settle UNDER the closing text */
      flagOff();flag.classList.remove('on-card');
      var fr=foot.getBoundingClientRect();
      setFlag(fr.left+fr.width/2, fr.bottom+Math.min(18,flag.offsetHeight*0.12));
    }
  }
  function measure(){
    sec.classList.remove('chw-ov--scrub');sec.style.height='';track.style.transform='';on=false;
    if(flag){flag.classList.remove('is-on');flag.classList.remove('on-card');flag.style.transform='';}flagOff();
    if(window.innerWidth<=900||rm)return;
    sec.classList.add('chw-ov--scrub');
    var reals=[].slice.call(track.children).filter(function(c){return c.className.indexOf('chw-ov__card--dupe')<0;});
    var last=reals[reals.length-1],padR=parseFloat(getComputedStyle(track).paddingRight)||0;
    maxX=Math.max(0,last.offsetLeft+last.offsetWidth+padR-vp.clientWidth);
    if(maxX>40){sec.style.height=(Math.round(window.innerHeight*1.3)+maxX)+'px';on=true;render();}   /* +30% taller stage */
    else{sec.classList.remove('chw-ov--scrub');sec.style.height='';}
  }
  function onScroll(){if(tick)return;tick=true;requestAnimationFrame(function(){render();tick=false;});}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',measure,{passive:true});
  measure();addEventListener('load',measure);
})();

/* §3 moments rail arrows — page the native-scroll viewport on small screens */(function(){var sec=document.getElementById("moments");if(!sec)return;var vp=sec.querySelector(".chw-ov__viewport"),nav=sec.querySelector(".chw-ov__nav");if(!vp||!nav)return;var prev=nav.querySelector(".chw-ov__arrow--prev"),next=nav.querySelector(".chw-ov__arrow--next");function step(){var c=vp.querySelector(".chw-ov__card"),t=vp.querySelector(".chw-ov__track");var g=t?parseFloat(getComputedStyle(t).gap)||24:24;return c?c.getBoundingClientRect().width+g:vp.clientWidth*0.82;}function upd(){var max=vp.scrollWidth-vp.clientWidth-2;prev.disabled=vp.scrollLeft<=2;next.disabled=vp.scrollLeft>=max;}prev.addEventListener("click",function(){vp.scrollBy({left:-step(),behavior:"smooth"});});next.addEventListener("click",function(){vp.scrollBy({left:step(),behavior:"smooth"});});vp.addEventListener("scroll",function(){requestAnimationFrame(upd);},{passive:true});addEventListener("resize",upd,{passive:true});addEventListener("load",upd);setTimeout(upd,60);})();

/* §3 closing line — rise within a clip as it enters, same as the footer /Experts wordmark */(function(){
  var box=document.querySelector(".chw-ov__foot");if(!box)return;var tx=box.querySelector(".chw-ov__foot-tx");if(!tx)return;
  if(matchMedia("(prefers-reduced-motion:reduce)").matches){tx.style.transform="none";return;}var tick=false;
  function upd(){var r=box.getBoundingClientRect(),vh=innerHeight||document.documentElement.clientHeight;var p=Math.min(1,Math.max(0,(vh-r.top)/(r.height+vh*0.14)));tx.style.transform="translateY("+((1-p)*110).toFixed(1)+"%)";}
  function onS(){if(tick)return;tick=true;requestAnimationFrame(function(){upd();tick=false;});}
  addEventListener("scroll",onS,{passive:true});addEventListener("resize",onS,{passive:true});upd();addEventListener("load",upd);
})();

/* §3.5 product — the whole scene ZOOMS in to its resting size as you scroll down. Scene + cards scale
   over a solid rust base (var --pz), so shrinking never exposes the dark page bg. Desktop only. */(function(){
  var sec=document.getElementById("product");if(!sec)return;
  if(matchMedia("(prefers-reduced-motion:reduce)").matches){sec.style.setProperty("--pz","1");return;}
  var tick=false;
  function upd(){
    if(innerWidth<=900){sec.style.setProperty("--pz","1");return;}   /* mobile: no zoom (faded image bg) */
    var r=sec.getBoundingClientRect(),vh=innerHeight||document.documentElement.clientHeight;
    var p=Math.min(1,Math.max(0,(vh - r.top)/(vh*0.9)));var e=1-Math.pow(1-p,2.2);
    sec.style.setProperty("--pz",(0.82+0.18*e).toFixed(4));}
  function onS(){if(tick)return;tick=true;requestAnimationFrame(function(){upd();tick=false;});}
  addEventListener("scroll",onS,{passive:true});addEventListener("resize",onS,{passive:true});upd();addEventListener("load",upd);
})();

/* §2 core mechanism — pinned scroll-scrub: 4 steps drive a crossfading video */(function(){
  var sec=document.getElementById("loop");if(!sec)return;
  var steps=[].slice.call(sec.querySelectorAll(".chw-loop__step")),vids=[].slice.call(sec.querySelectorAll(".chw-loop__vid")),fill=sec.querySelector(".chw-loop__prog-fill");
  var media=sec.querySelector(".chw-loop__media"),grid=sec.querySelector(".chw-loop__grid"),pin=sec.querySelector(".chw-loop__pin");
  function alignMedia(){if(!media||!grid||!pin)return;if(innerWidth<=1024){media.style.top="";return;}var gr=grid.getBoundingClientRect(),pr=pin.getBoundingClientRect();media.style.top=(gr.top-pr.top+gr.height/2-media.offsetHeight/2)+"px";}
  addEventListener("resize",alignMedia);addEventListener("load",alignMedia);alignMedia();
  var N=steps.length;if(!N)return;if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;var tick=false;
  var cur=-1;
  function render(){var top=sec.getBoundingClientRect().top,vh=innerHeight||document.documentElement.clientHeight;var total=sec.offsetHeight-vh;if(total<=0)return;
    var p=Math.min(1,Math.max(0,(-top)/total));var idx=Math.min(N-1,Math.floor(p*N));
    if(fill)fill.style.height=(p*100).toFixed(1)+"%";
    if(idx===cur)return;cur=idx;
    steps.forEach(function(sp,i){sp.classList.toggle("is-on",i===idx);});
    vids.forEach(function(v,i){var on=i===idx;v.classList.toggle("is-on",on);if(v.tagName==="VIDEO"){if(on){try{v.currentTime=0;}catch(e){}var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});}else{try{v.pause();}catch(e){}}}});}
  function onS(){if(tick)return;tick=true;requestAnimationFrame(function(){render();tick=false;});}
  addEventListener("scroll",onS,{passive:true});addEventListener("resize",onS,{passive:true});render();addEventListener("load",render);
})();
