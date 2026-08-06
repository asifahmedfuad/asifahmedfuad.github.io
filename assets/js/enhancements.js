/* enhancements.js — fade-in-on-scroll for homepage sections (.enh-reveal) */
(function () {
  function reveal() {
    var els = document.querySelectorAll('.enh-reveal');
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }
  if (document.readyState !== 'loading') reveal();
  else document.addEventListener('DOMContentLoaded', reveal);
})();
