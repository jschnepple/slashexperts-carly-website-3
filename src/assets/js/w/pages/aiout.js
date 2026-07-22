/* aiout page script (P3, Session D) — .aios orchestration-scene fit-scaler (verbatim from bundle head). */
(function(){
  function fit(){
    var mobile=window.innerWidth<=960;
    document.querySelectorAll('.aios').forEach(function(b){
      var s=b.querySelector('.aios__stage'); if(!s) return;
      if(mobile){ s.style.transform=''; s.style.width=''; b.style.height=''; return; }
      var cs=getComputedStyle(b);
      var av=b.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
      var sc=Math.min(1.4, av/700);
      s.style.width='700px'; s.style.transform='scale('+sc+')';
      b.style.height=(s.offsetHeight*sc+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom))+'px';
    });
  }
  window.addEventListener('load',function(){fit();setTimeout(fit,300);});
  window.addEventListener('resize',fit);
})();
