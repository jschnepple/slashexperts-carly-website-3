/* book-a-demo page JS (P3, Session E). Designer field-validation (valid/invalid states)
   kept verbatim; the local 'is-sent' success reveal is removed because RevenueHero's
   scheduler is the booking success UX (Jeff's call). Network post + RevenueHero init +
   Customer.io live in the page's extraScripts module. Shared nav/footer/reveal are in base.js. */
/* book-a-demo form validation — valid/invalid states + working submit (prototype: no network post) */
(function(){
  var form=document.querySelector('form[data-form-name="book_a_demo"]');
  if(!form)return;
  var emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var reqs=[
    {el:form.querySelector('#bd-email'),test:function(v){return emailRe.test(v);}},
    {el:form.querySelector('#bd-name'),test:function(v){return v.length>0;}},
    {el:form.querySelector('#bd-company'),test:function(v){return v.length>0;}}
  ];
  function wrap(el){return el.closest('.w-field');}
  function mark(w,state){ w.classList.remove('w-field--error','w-field--ok'); if(state)w.classList.add(state); }
  function checkField(f,showErr){
    var v=(f.el.value||'').trim(), ok=f.test(v), w=wrap(f.el);
    if(ok)mark(w,'w-field--ok'); else mark(w, showErr?'w-field--error':null);
    return ok;
  }
  function interestWrap(){return form.querySelector('.bd-field-interest');}
  function checkInterest(showErr){
    var ok=!!form.querySelector('input[name="interest"]:checked'), w=interestWrap();
    if(ok)w.classList.remove('w-field--error'); else if(showErr)w.classList.add('w-field--error');
    return ok;
  }
  reqs.forEach(function(f){
    f.el.addEventListener('input',function(){ if(wrap(f.el).classList.contains('w-field--error'))checkField(f,true); });
    f.el.addEventListener('blur',function(){ if((f.el.value||'').trim())checkField(f,true); });
  });
  form.querySelectorAll('input[name="interest"]').forEach(function(r){ r.addEventListener('change',function(){ checkInterest(false); }); });
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true;
    reqs.forEach(function(f){ if(!checkField(f,true))ok=false; });
    if(!checkInterest(true))ok=false;
    if(!ok){ var first=form.querySelector('.w-field--error input, .w-field--error .bd-choice input'); if(first)first.focus(); return; }
    /* success now handled by RevenueHero scheduler (Session E, Jeff) */
  });
})();
