/* calculators — page behavior, lifted verbatim from the designer bundle (P3, Session K3). */
(function(){
  function ready(fn){ if(document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    var $=function(id){return document.getElementById(id)};
    /* ---- ROI ---- */
    var B={winRateLift:0.60,cycleReduction:0.29,adminReduction:0.70,hoursPerOpp:2.5};
    var IM={saas:1.0,fintech:1.1,healthcare:0.95,manufacturing:0.85,professional:0.9,other:0.9};
    function fmt(a){a=Math.round(a); if(a>=1e6) return '$'+(a/1e6).toFixed(1)+'M'; if(a>=1000) return '$'+Math.round(a/1000)+'K'; return '$'+a.toLocaleString();}
    var opps=$('opps'),win=$('winRate'),cyc=$('cycle'),deal=$('dealSize'),ind=$('industry');
    function calcROI(){
      var monthlyOpps=+opps.value, winRate=(+win.value)/100, salesCycle=+cyc.value;
      var dealSize=parseInt((deal.value||'').replace(/[^0-9]/g,''))||50000;
      var mult=IM[ind.value]||1;
      var annualOpps=monthlyOpps*12;
      var curWon=annualOpps*winRate, curRev=curWon*dealSize;
      var newWinRate=Math.min(winRate*(1+B.winRateLift*mult),0.95);
      var newWon=annualOpps*newWinRate, newRev=newWon*dealSize;
      var impact=newRev-curRev;
      var extra=Math.round(newWon-curWon);
      var daysSaved=Math.round(salesCycle*B.cycleReduction);
      var hours=Math.round(annualOpps*B.hoursPerOpp*B.adminReduction);
      $('oppsVal').textContent=monthlyOpps; $('winVal').textContent=(+win.value)+'%'; $('cycleVal').textContent=salesCycle+' days';
      $('totalROI').textContent=fmt(impact);
      $('costOfInaction').textContent='-'+fmt(impact/12);
      $('winLift').textContent='+'+Math.round(B.winRateLift*100*mult)+'%';
      $('cycleSaved').textContent=daysSaved+' days';
      $('extraDeals').textContent='+'+extra;
      $('hoursSaved').textContent=hours.toLocaleString()+' hrs';
    }
    [opps,win,cyc,deal,ind].forEach(function(el){el&&el.addEventListener('input',calcROI);});
    deal&&deal.addEventListener('blur',function(){var n=parseInt((deal.value||'').replace(/[^0-9]/g,''))||50000; deal.value=n.toLocaleString();});
    calcROI();
    /* lead gate — ROI card */
    var gate=$('roiGate'), res=$('roiResults');
    $('gSubmit')&&$('gSubmit').addEventListener('click',function(){
      var email=($('gEmail').value||'').trim();
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){$('gErr').style.display='block';return;}
      $('gErr').style.display='none';
      gate.classList.add('is-hidden'); res.classList.add('is-revealed');
    });
    /* lead gate — Invisible Pipeline Score (added per Jeff: gate the quiz, mirror the ROI card) */
    var plGate=$('plGate'), plRes=$('pipelineResults');
    $('plSubmit')&&$('plSubmit').addEventListener('click',function(){
      var email=($('plEmail').value||'').trim();
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){$('plErr').style.display='block';return;}
      $('plErr').style.display='none';
      plGate.classList.add('is-hidden'); plRes.classList.add('is-revealed');
    });
    /* ---- Pipeline Score ---- */
    var answers={};
    document.querySelectorAll('.cx-q').forEach(function(q){
      var key=q.getAttribute('data-q');
      q.querySelectorAll('.cx-opt').forEach(function(btn){
        btn.addEventListener('click',function(){
          q.querySelectorAll('.cx-opt').forEach(function(b){b.setAttribute('aria-pressed','false')});
          btn.setAttribute('aria-pressed','true');
          answers[key]=+btn.getAttribute('data-v');
          scorePipeline();
        });
      });
    });
    function scorePipeline(){
      var a=answers;
      var speed=((a.responseTime||0)/4)*25;
      var vis=(((a.tracking||0)+(a.channels||0))/8)*25;
      var prec=((a.matching||0)/4)*25;
      var scale=(((a.scale||0)+(a.integration||0))/8)*25;
      var total=Math.round(speed+vis+prec+scale);
      var C=490;
      $('scoreProg').style.strokeDashoffset=C-(C*total/100);
      $('scoreNum').textContent=total;
      setDim('dimSpeed',speed);setDim('dimVis',vis);setDim('dimPrec',prec);setDim('dimScale',scale);
      var r=$('scoreRating'),label,tier;
      if(total<30){label='Critical blind spots';tier='critical';}
      else if(total<55){label='Significant gaps';tier='warning';}
      else if(total<75){label='Above average';tier='ok';}
      else{label='Industry leader';tier='excellent';}
      var done=Object.keys(a).length>=6;
      r.textContent=done?label:'Answer the 6 questions'; r.setAttribute('data-tier',done?tier:'critical');
      if(done){
        var impacts={critical:'Most of your proof pipeline is invisible. A Trust Layer would put verified peer proof on every ready deal — and on the record.',warning:'You have the pieces, not the system. Matching and delivery at the deciding moment is where the revenue is leaking.',ok:'Solid foundation. Closing the last gaps — speed and coverage — is what separates above-average from industry-leading.',excellent:'You run proof like infrastructure. A Trust Layer keeps it compounding as you scale.'};
        $('scoreImpact').textContent=impacts[tier];
      }
    }
    function setDim(id,val){var f=$(id); if(f){f.style.width=(val/25*100)+'%'; var v=$(id+'V'); if(v)v.textContent=Math.round(val);}}
  });
})();
