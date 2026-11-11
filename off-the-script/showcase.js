(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = navigator.connection && navigator.connection.saveData;
  if (reduce || save || typeof anime === 'undefined') return;

  document.documentElement.classList.add('motion');
  const narrow = matchMedia('(max-width: 700px)').matches;
  const dur = narrow ? 460 : 620;

  function settle(targets) {
    targets.forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
      el.classList.remove('rise');
    });
  }

  function rise(container, selector, scale) {
    const root = typeof container === 'string' ? document.querySelector(container) : container;
    if (!root) return;
    const targets = selector ? [...root.querySelectorAll(selector)] : [root];
    if (!targets.length) return;
    targets.forEach((el) => el.classList.add('rise'));
    let anim = null;
    const io = new IntersectionObserver((entries) => {
      const on = entries.some((entry) => entry.isIntersecting);
      if (!on) {
        if (anim && !anim.completed) anim.pause();
        return;
      }
      if (anim) {
        if (!anim.completed) anim.play();
        return;
      }
      anim = anime({
        targets,
        opacity: [0, 1],
        translateY: [narrow ? 10 : 16, 0],
        scale: scale || [0.97, 1],
        delay: anime.stagger(narrow ? 36 : 55),
        duration: dur,
        easing: 'easeOutCubic',
        complete: () => settle(targets)
      });
    }, { threshold: 0.18 });
    io.observe(root);
  }

  document.querySelectorAll('.strip').forEach((list) => rise(list, ':scope > li'));
  rise('#stills', '.art-card');
  rise('.kinds', 'article');
  rise('.contact-channels', '.channel');
  rise('.field', ':scope > figure', [0.98, 1]);
  document.querySelectorAll('.headline-num').forEach((el) => rise(el, null, [0.94, 1]));
  rise('.reel-stage', null, [0.985, 1]);

  const logo = document.querySelector('.site-nav .logo');
  const cta = document.querySelector('.hero-card .btn-primary');
  const hero = document.querySelector('[data-hero]');
  if (hero && (logo || cta)) {
    let pulsed = false;
    const io = new IntersectionObserver((entries) => {
      if (pulsed || !entries.some((entry) => entry.isIntersecting)) return;
      pulsed = true;
      io.disconnect();
      anime({
        targets: [logo, cta].filter(Boolean),
        scale: [1, 1.045, 1],
        duration: 820,
        delay: anime.stagger(120),
        easing: 'easeInOutQuad'
      });
    }, { threshold: 0.4 });
    io.observe(hero);
  }

  const cam = document.getElementById('cam');
  const body = cam && cam.querySelector('.cam-body');
  const iris = cam && cam.querySelector('.cam-iris');
  const parts = cam ? [...cam.querySelectorAll('.cam-part')] : [];
  if (cam && body && iris && parts.length) {
    const full = body.getAttribute('d');
    const flat = 'M26 54h76a12 12 0 0 1 12 2v0a12 12 0 0 1-12 2H26a12 12 0 0 1-12-2v0a12 12 0 0 1 12-2z';
    const shut = iris.getAttribute('d');
    const open = 'M64 58 m-16 0 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0';
    const from = [
      { x: 0, y: 26 },
      { x: -16, y: -30 },
      { x: 28, y: 10 },
      { x: 0, y: 0 },
      { x: 20, y: -16 }
    ];
    body.setAttribute('d', flat);
    const tl = anime.timeline({ autoplay: false, easing: 'easeInOutCubic' });
    tl.add({
      targets: parts,
      opacity: [0, 1],
      translateX: (el, i) => [from[i].x, 0],
      translateY: (el, i) => [from[i].y, 0],
      scale: (el, i) => [i === 3 ? 0.2 : 0.6, 1],
      delay: anime.stagger(70),
      duration: narrow ? 520 : 700
    }).add({
      targets: body,
      d: [{ value: full }],
      duration: narrow ? 480 : 640,
      easing: 'easeOutCubic'
    }, 0).add({
      targets: iris,
      d: [{ value: open }],
      duration: 420,
      easing: 'easeOutQuad'
    }, '-=280').add({
      targets: parts,
      translateX: (el, i) => from[i].x * 0.85,
      translateY: (el, i) => from[i].y * 0.85,
      scale: 0.7,
      opacity: 0.4,
      delay: anime.stagger(36),
      duration: 480,
      easing: 'easeInQuad'
    }, '+=420').add({
      targets: body,
      d: [{ value: flat }],
      duration: 420
    }, '-=480').add({
      targets: iris,
      d: [{ value: shut }],
      duration: 360
    }, '-=420').add({
      targets: parts,
      translateX: 0,
      translateY: 0,
      scale: 1,
      opacity: 1,
      delay: anime.stagger(48),
      duration: narrow ? 520 : 680,
      easing: 'easeOutCubic'
    }).add({
      targets: body,
      d: [{ value: full }],
      duration: 520,
      easing: 'easeOutCubic'
    }, '-=560').add({
      targets: iris,
      d: [{ value: open }],
      duration: 420
    }, '-=400');

    const io = new IntersectionObserver((entries) => {
      const on = entries.some((entry) => entry.isIntersecting);
      if (!on) {
        if (!tl.completed) tl.pause();
        return;
      }
      if (!tl.completed) tl.play();
    }, { threshold: 0.45 });
    io.observe(cam);
  }
})();
