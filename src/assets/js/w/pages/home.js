/* §1.5 overview — pin + scrub the card rail horizontally on vertical scroll (Adobe-style) */(function(){
  var sec=document.getElementById('overview');if(!sec)return;
  var vp=sec.querySelector('.hm-ov__viewport'),track=sec.querySelector('.hm-ov__track');
  if(!vp||!track)return;
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,maxX=0,on=false,tick=false;
  function render(){if(!on)return;var top=sec.getBoundingClientRect().top;var p=Math.min(1,Math.max(0,(-top)/maxX));track.style.transform='translate3d('+(-p*maxX).toFixed(1)+'px,0,0)';}
  function measure(){
    sec.classList.remove('hm-ov--scrub');sec.style.height='';track.style.transform='';on=false;
    if(window.innerWidth<=900||rm)return;
    sec.classList.add('hm-ov--scrub');
    var reals=[].slice.call(track.children).filter(function(c){return c.className.indexOf('hm-ov__card--dupe')<0;});
    var last=reals[reals.length-1],padR=parseFloat(getComputedStyle(track).paddingRight)||0;
    maxX=Math.max(0,last.offsetLeft+last.offsetWidth+padR-vp.clientWidth);
    if(maxX>40){sec.style.height=(window.innerHeight+maxX)+'px';on=true;render();}
    else{sec.classList.remove('hm-ov--scrub');sec.style.height='';}
  }
  function onScroll(){if(tick)return;tick=true;requestAnimationFrame(function(){render();tick=false;});}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',measure,{passive:true});
  measure();addEventListener('load',measure);
})();

/* §7 results — scroll-scrub reveal: middle card full-bleed -> all three (Adobe-style) */(function(){
  var sec=document.getElementById('revReveal');if(!sec)return;
  var row=sec.querySelector('.hm-rev__row');
  var cards=[].slice.call(sec.querySelectorAll('.hm-rev__card'));
  if(!row||cards.length<3)return;
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,dist=0,on=false,tick=false,MID=1;
  function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
  function apply(p){
    var e=ease(p);
    cards.forEach(function(c,i){
      var g=(i===MID)?(1+(1-e)*14):(0.04+e*0.96);
      c.style.flexGrow=g.toFixed(3);
      var pn=c.querySelector('.hm-rev__panel');
      if(pn)pn.style.opacity=(i===MID)?'1':(e<.55?'0':((e-.55)/.45).toFixed(2));
    });
    row.style.gap=(e*16).toFixed(1)+'px';
  }
  function render(){if(!on)return;var top=sec.getBoundingClientRect().top;var p=Math.min(1,Math.max(0,(-top)/dist));apply(p);}
  function measure(){
    sec.classList.remove('hm-rev--scrub');sec.style.height='';on=false;
    cards.forEach(function(c){c.style.flexGrow='';var pn=c.querySelector('.hm-rev__panel');if(pn)pn.style.opacity='';});row.style.gap='';row.style.width='';
    if(window.innerWidth<=900||rm)return;
    sec.classList.add('hm-rev--scrub');
    dist=Math.round(window.innerHeight*1.1);
    sec.style.height=(window.innerHeight+dist)+'px';on=true;render();
  }
  function onScroll(){if(tick)return;tick=true;requestAnimationFrame(function(){render();tick=false;});}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',measure,{passive:true});
  measure();addEventListener('load',measure);
})();

/* §5 better-together — image briefcase-open + cards fly-in (scroll-linked) */(function(){
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
      var raw=(vh-ctop)/(vh*0.52);                       // fly in as the row rises into view
      var ci=Math.min(1,Math.max(0, raw - i*0.16));      // stagger left->right (center->right cascade)
      var e=ci<.5?2*ci*ci:1-Math.pow(-2*ci+2,2)/2;
      cards[i].style.opacity=e.toFixed(3);
      cards[i].style.transform='translate3d(0,'+((1-e)*92).toFixed(1)+'px,0) scale('+(0.96+0.04*e).toFixed(3)+')';
    }
  }
  function onS(){if(tick)return;tick=true;requestAnimationFrame(function(){upd();tick=false;});}
  addEventListener('scroll',onS,{passive:true});addEventListener('resize',onS,{passive:true});
  upd();addEventListener('load',upd);
})();

/* hero scene sequencer — strict order, each clip plays from its start (no loop glitch) */(function(){
  var scenes=[].slice.call(document.querySelectorAll('.hm-hero__scene'));if(!scenes.length)return;
  function set(idx){scenes.forEach(function(s,k){var on=k===idx;s.classList.toggle('is-active',on);var v=s.querySelector('video');if(v){if(on){try{v.currentTime=0;var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}}else{try{v.pause();}catch(e){}}}});var h=document.querySelector('.hm-hero');if(h){h.classList.toggle('hm-hero--nodim',idx===scenes.length-1);h.classList.toggle('hm-hero--dim90',idx===0);}}
  set(0);if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var durs=scenes.map(function(s,k){return k===scenes.length-1?5000:3000;});var i=0;(function loop(){setTimeout(function(){i=(i+1)%scenes.length;set(i);loop();},durs[i]);})();
})();

/* trust-layer rail arrows — page the native-scroll viewport on small screens */(function(){var sec=document.getElementById("overview");if(!sec)return;var vp=sec.querySelector(".hm-ov__viewport"),nav=sec.querySelector(".hm-ov__nav");if(!vp||!nav)return;var prev=nav.querySelector(".hm-ov__arrow--prev"),next=nav.querySelector(".hm-ov__arrow--next");function step(){var c=vp.querySelector(".hm-ov__card"),t=vp.querySelector(".hm-ov__track");var g=t?parseFloat(getComputedStyle(t).gap)||24:24;return c?c.getBoundingClientRect().width+g:vp.clientWidth*0.82;}function upd(){var max=vp.scrollWidth-vp.clientWidth-2;prev.disabled=vp.scrollLeft<=2;next.disabled=vp.scrollLeft>=max;}prev.addEventListener("click",function(){vp.scrollBy({left:-step(),behavior:"smooth"});});next.addEventListener("click",function(){vp.scrollBy({left:step(),behavior:"smooth"});});vp.addEventListener("scroll",function(){requestAnimationFrame(upd);},{passive:true});addEventListener("resize",upd,{passive:true});addEventListener("load",upd);setTimeout(upd,60);})();
