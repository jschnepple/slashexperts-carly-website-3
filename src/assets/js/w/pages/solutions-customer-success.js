/* For Customer Success page-specific behavior (shared nav/reveal/parallax/footer live in js/w/base.js) */

/* §NEW · "The load, shared" rotation rail — randomly turn 2-3 experts "on" at a time,
   never repeating any expert from the immediately previous set. CSS (cs-rot__* rules in
   solutions-customer-success.css) handles the actual B&W<->color / bar-height transitions
   via the .is-active class this toggles; this file only owns the timing + selection. */
(function(){
  var rail = document.querySelector('.cs-rot__rail');
  if(!rail) return;
  var nodes = [].slice.call(rail.querySelectorAll('.cs-rot__node'));
  if(nodes.length < 2) return;

  if((window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) || !('IntersectionObserver' in window)){
    return; // leave nodes in their static resting (B&W) state
  }

  var prevActive = [];

  function pickNext(){
    var pool = [];
    for(var i = 0; i < nodes.length; i++){
      if(prevActive.indexOf(i) === -1) pool.push(i);
    }
    // Fisher-Yates shuffle of the eligible (non-repeating) pool
    for(var j = pool.length - 1; j > 0; j--){
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = pool[j]; pool[j] = pool[k]; pool[k] = tmp;
    }
    var count = Math.min(2 + Math.round(Math.random()), pool.length); // 2 or 3, capped by what's available
    return pool.slice(0, count);
  }

  function rand(min, max){ return min + Math.random() * (max - min); }

  // Give a node a freshly randomized rise/fall shape + speed for this "on" cycle, so no two
  // activations look identical. Duration range is centered ~2.5x slower than the original fixed 2.1s wobble.
  function rollWobble(node){
    node.style.setProperty('--wb0', rand(.45, .65).toFixed(2));
    node.style.setProperty('--wb1', rand(.75, 1.0).toFixed(2));
    node.style.setProperty('--wb2', rand(.55, .8).toFixed(2));
    node.style.setProperty('--wb3', rand(.9, 1.25).toFixed(2));
    node.style.setProperty('--wb4', rand(.6, .85).toFixed(2));
    node.style.setProperty('--wb-dur', rand(4.6, 6.0).toFixed(2) + 's');
  }

  function activate(){
    var next = pickNext();
    nodes.forEach(function(node, i){
      var isNext = next.indexOf(i) !== -1;
      if(isNext) rollWobble(node);
      node.classList.toggle('is-active', isNext);
    });
    prevActive = next;
  }

  var timer = null;
  function start(){
    if(timer) return;
    activate();
    timer = setInterval(activate, 3200);
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        start();
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.3});
  io.observe(rail);
})();
