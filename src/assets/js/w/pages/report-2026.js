/* report-2026 — page behavior, lifted verbatim from the designer bundle (P3, Session K3). */
(function(){
  function ready(fn){ if(document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    var f=document.getElementById('rpForm'), btn=document.getElementById('rpSubmit'), err=document.getElementById('rpErr');
    if(!btn) return;
    btn.addEventListener('click',function(){
      var email=(document.getElementById('rpEmail').value||'').trim();
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ err.style.display='block'; return; }
      err.style.display='none';
      var to=document.getElementById('rpSentTo'); if(to) to.textContent='Your copy of the 2026 GTM Report is on its way to '+email+'.';
      f.classList.add('is-sent');
      /* TODO: wire to CRM/marketing automation + real PDF delivery */
    });
  });
})();
