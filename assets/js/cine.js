/* Первый экран главной: дом растёт при прокрутке. GSAP + ScrollTrigger, Lenis только на компьютере. */
(function () {
  var S = document.querySelector('.cine'); if (!S) return;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM || !window.gsap || !window.ScrollTrigger) { S.classList.add('static'); return; }
  gsap.registerPlugin(ScrollTrigger);
  S.classList.add('live');

  /* плавная прокрутка только мышью; на телефоне родная инерция */
  if (window.Lenis && matchMedia('(pointer: fine)').matches) {
    var lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a) return;
      var el = document.querySelector(a.getAttribute('href')); if (!el) return;
      e.preventDefault(); lenis.scrollTo(el, { offset: -70 });
    });
  }

  var imgs = gsap.utils.toArray('.cine .cf'), N = imgs.length;
  var st = gsap.utils.toArray('.cine-st li'), prog = S.querySelector('.cine-prog i');
  var txt = S.querySelector('.cine-txt'), num = S.querySelector('.cine-num'), hint = S.querySelector('.cine-hint');
  gsap.set(imgs.slice(1), { autoAlpha: 0 });
  gsap.set(num, { autoAlpha: 0, y: 40 });

  var tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: S, start: 'top top', end: 'bottom bottom', scrub: 0.6,
      onUpdate: function (self) {
        var p = self.progress, k = Math.min(N - 1, Math.round(p / 0.8 * (N - 1)));
        st.forEach(function (li, i) { li.classList.toggle('on', i === k); li.classList.toggle('done', i < k); });
        if (prog) prog.style.transform = 'scaleX(' + p.toFixed(3) + ')';
      }
    }
  });
  /* 0–0.8: кадры стройки; заголовок уходит вверх в первой четверти */
  tl.to(txt, { autoAlpha: 0, y: -60, duration: 0.1 }, 0.01);
  tl.to(hint, { autoAlpha: 0, duration: 0.05 }, 0.02);
  tl.fromTo(imgs[0], { scale: 1.12 }, { scale: 1, duration: 0.8 }, 0);
  var step = 0.8 / (N - 1);
  imgs.forEach(function (im, i) {
    if (!i) return;
    tl.to(im, { autoAlpha: 1, duration: step * 0.6 }, step * (i - 1) + step * 0.4);
    tl.fromTo(im, { scale: 1.06 }, { scale: 1, duration: step * 1.2 }, step * (i - 1) + step * 0.4);
  });
  /* 0.8–1: дом готов, ночь, цифры кейса */
  tl.to(num, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.82);
  tl.to({}, { duration: 0.06 });

  /* картинки догрузились — пересчитать */
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
