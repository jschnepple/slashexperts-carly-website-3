/* §4 THE COST — 3-phase scroll build: centered text (always) → favor card slides in from L → trust card from R.
   Desktop + motion only; ≤1024 / reduced-motion shows everything stacked (CSS). */
(function(){
  var sec=document.getElementById('cost');
  if(!sec) return;
  var favor=sec.querySelector('.ar-cost__card--favor');
  var trust=sec.querySelector('.ar-cost__card--trust');
  var big=window.matchMedia('(min-width:1025px)');
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)');
  function clamp(v){return v<0?0:(v>1?1:v);}
  var ticking=false;
  function apply(){
    ticking=false;
    if(!big.matches||reduce.matches){favor.style.opacity='';favor.style.transform='';trust.style.opacity='';trust.style.transform='';return;}
    var r=sec.getBoundingClientRect();
    var denom=sec.offsetHeight-window.innerHeight;
    var p=denom>0?clamp(-r.top/denom):0;
    // phase 2: favor card fades + slides in from the left over p 0.24→0.46
    var f=clamp((p-0.24)/0.22);
    favor.style.opacity=f.toFixed(3);
    favor.style.transform='translateY(-50%) translateX('+(((1-f)*-40)).toFixed(1)+'px)';
    // phase 3: trust card fades + slides in from the right over p 0.56→0.80
    var t=clamp((p-0.56)/0.24);
    trust.style.opacity=t.toFixed(3);
    trust.style.transform='translateY(-50%) translateX('+(((1-t)*40)).toFixed(1)+'px)';
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(apply);}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',apply);
  if(big.addEventListener){big.addEventListener('change',apply);reduce.addEventListener('change',apply);}
  apply();
})();
