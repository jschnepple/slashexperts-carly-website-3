/* §2 five moves — pinned scroll-scrub: 5 steps drive a crossfading panel (adapted from W-CARLY-HOW chw-loop) */(function(){
  var sec=document.getElementById("booking");if(!sec)return;
  var steps=[].slice.call(sec.querySelectorAll(".ehl-loop__step")),vids=[].slice.call(sec.querySelectorAll(".ehl-loop__vid")),fill=sec.querySelector(".ehl-loop__prog-fill");
  var media=sec.querySelector(".ehl-loop__media"),grid=sec.querySelector(".ehl-loop__grid"),pin=sec.querySelector(".ehl-loop__pin");
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
