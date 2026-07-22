/* DS7-Web · blog post page behavior.
   The designer's post bundles ship exactly one tail script (the shared DS7 nav
   drawer), which already lives in js/w/base.js and is not duplicated here.
   The only post-specific behavior is the copy-link share button — the bundle
   rendered it as a dead href="#", so it is wired here rather than left inert. */
(function () {
  var btn = document.querySelector('[data-copy-link]');
  if (!btn) return;
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    var url = btn.getAttribute('data-copy-link');
    var done = function () {
      btn.classList.add('is-copied');
      setTimeout(function () { btn.classList.remove('is-copied'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () {});
    }
  });
})();
