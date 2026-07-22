/* DS7-Web · /blog/ listing behavior — category chips + client-side search.
   Lifted verbatim from the designer bundle's single page-specific tail script
   (the second tail script was the shared DS7 nav drawer, already in base.js).
   Note: it filters the cards rendered on the CURRENT page of the paginated
   index — that is the designer's behavior, unchanged. */
(function(){
  var chips=[].slice.call(document.querySelectorAll('.blc__chip'));
  var cards=[].slice.call(document.querySelectorAll('.blg__card'));
  var search=document.querySelector('.blh__search input');
  var active='All Articles';
  function norm(t){return (t||'').toLowerCase();}
  function apply(){
    var q=norm(search&&search.value);
    cards.forEach(function(c){
      var okCat = active==='All Articles' || c.getAttribute('data-cat')===active;
      var okQ = !q || norm(c.textContent).indexOf(q)>-1;
      c.style.display = (okCat&&okQ)?'':'none';
    });
  }
  chips.forEach(function(ch){
    if(ch.tagName!=='BUTTON') return;
    ch.addEventListener('click',function(){
      chips.forEach(function(x){if(x.tagName==='BUTTON'){x.classList.remove('is-active');x.setAttribute('aria-selected','false');}});
      ch.classList.add('is-active');ch.setAttribute('aria-selected','true');
      active=ch.textContent.trim().replace(/\s+/g,' ');
      apply();
    });
  });
  if(search){search.addEventListener('input',apply);}
})();
