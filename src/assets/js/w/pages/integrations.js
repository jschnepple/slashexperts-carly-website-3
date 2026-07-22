/* Integrations page — category filter, dynamic counts, clickable cards.
   DS7-Web port of the 2.0 /integrations behavior. Loaded as a plain script
   via base-w.njk (pageJS: integrations); no imports/exports. */
(function () {
  var wall = document.getElementById('igWall');
  if (!wall) return;

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.ig-filter__tab'));
  var cards = Array.prototype.slice.call(wall.querySelectorAll('.ig-int'));
  var desc = document.getElementById('igCatDesc');

  var IG_DESC = {
    "all": { title: "All Integrations", desc: "Browse the complete library of integrations designed to embed your booking system across every buyer touchpoint and move pipeline forward." },
    "crm": { title: "CRM Integrations", desc: "Sync activities, contacts, and campaigns so every SlashExperts outcome is tracked right inside your CRM." },
    "sales": { title: "Sales Engagement Integrations", desc: "Embed your booking system inside outbound sequences — a fresh, compelling reason for prospects to engage with your reps." },
    "demo": { title: "Demo Automation Integrations", desc: "Add your booking link to interactive demos for stronger CTAs that turn demo viewers into real conversations." },
    "intent": { title: "Web Intent Integrations", desc: "Convert more web intent by offering high-value visitors the chance to book time with real customers." },
    "chat": { title: "Chat Integrations", desc: "Share your booking link in live chats for instant peer validation the moment prospects need it." },
    "nps": { title: "NPS Integrations", desc: "Automatically surface and recruit your happiest customers, based on NPS, to join your expert program." },
    "customer-reference": { title: "Customer Reference Integrations", desc: "Connect leading customer reference platforms to streamline expert recruitment and management." },
    "mutual-action": { title: "Mutual Action Plans Integrations", desc: "Embed expert calls as key milestones in mutual action plans to accelerate deal progression." },
    "webinars": { title: "Webinar Integrations", desc: "Feature your experts in webinars and let attendees book follow-up conversations." },
    "personalization": { title: "Web Personalization Integrations", desc: "Deliver personalized booking experiences based on visitor attributes and behavior." },
    "optimization": { title: "Web Optimization Integrations", desc: "A/B test and optimize your booking system placement for maximum conversion." },
    "cms": { title: "Website/CMS Integrations", desc: "Embed your booking system on any website or CMS with a simple code snippet." }
  };

  /* Authoritative counts computed from the actual cards on the page. */
  var counts = {}, total = 0;
  cards.forEach(function (c) {
    var k = c.getAttribute('data-category');
    counts[k] = (counts[k] || 0) + 1;
    total++;
  });
  tabs.forEach(function (t) {
    var cat = t.getAttribute('data-category');
    var n = t.querySelector('.ig-filter__n');
    if (n) n.textContent = (cat === 'all') ? total : (counts[cat] || 0);
  });
  var firstStat = document.querySelector('.ig-stat__v');
  if (firstStat) firstStat.textContent = total;

  function applyFilter(cat) {
    cards.forEach(function (c) {
      var show = (cat === 'all') || (c.getAttribute('data-category') === cat);
      if (show) {
        if (c.hidden) {
          c.hidden = false;
          c.classList.add('is-enter');
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { c.classList.remove('is-enter'); });
          });
        }
      } else {
        c.hidden = true;
      }
    });
  }

  tabs.forEach(function (t) {
    t.setAttribute('role', 'tab');
    t.setAttribute('aria-selected', t.classList.contains('is-active') ? 'true' : 'false');
    t.addEventListener('click', function () {
      var cat = t.getAttribute('data-category');
      tabs.forEach(function (x) {
        x.classList.remove('is-active');
        x.setAttribute('aria-selected', 'false');
      });
      t.classList.add('is-active');
      t.setAttribute('aria-selected', 'true');

      var d = IG_DESC[cat];
      if (d && desc) {
        desc.innerHTML = '<h3></h3><p></p>';
        desc.querySelector('h3').textContent = d.title;
        desc.querySelector('p').textContent = d.desc;
      }
      applyFilter(cat);
    });
  });

  /* Whole card opens the vendor site; the inner link keeps its default. */
  cards.forEach(function (c) {
    var link = c.querySelector('.ig-int__link');
    if (!link) return;
    var href = link.getAttribute('href');
    c.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      window.open(href, '_blank', 'noopener,noreferrer');
    });
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target === c) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    });
  });
})();
