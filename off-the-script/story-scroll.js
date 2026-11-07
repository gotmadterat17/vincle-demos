(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = navigator.connection && navigator.connection.saveData;
  const wideQuery = matchMedia('(min-width:961px)');
  const frames = [...document.querySelectorAll('.seq-frame')];
  const steps = [...document.querySelectorAll('.seq-step')];
  const label = document.getElementById('seqLabel');
  const engine = typeof window.anime === 'function' ? window.anime : null;
  let active = -1;
  let wide = wideQuery.matches;

  function visibleLabel(step) {
    const node = step.querySelector('.seq-label');
    if (!node) return '';
    const copy = node.cloneNode(true);
    const english = root.lang === 'en';
    copy.querySelectorAll(english ? '.ar-only' : '.en-only').forEach((el) => el.remove());
    return copy.textContent.replace(/\s+/g, ' ').trim();
  }

  function staticMode() {
    root.classList.add('story-static');
    frames.forEach((img) => {
      img.style.opacity = '1';
      img.style.transform = 'none';
    });
  }

  if (reduce || save || !engine || !frames.length) {
    staticMode();
    return;
  }

  root.classList.add('story-motion');
  document.documentElement.dataset.anime = engine.version || 'loaded';

  function loadFrame(img) {
    if (img.getAttribute('src')) return;
    const full = img.getAttribute('data-src');
    if (full) img.src = full;
  }

  if (wide) frames.forEach(loadFrame);

  function go(index) {
    if (index === active || index < 0 || index >= frames.length) return;
    const prev = active >= 0 ? frames[active] : null;
    active = index;
    const next = frames[index];
    loadFrame(next);
    engine.remove(frames);
    if (prev) {
      engine({
        targets: prev,
        opacity: 0,
        scale: 1.045,
        duration: 480,
        easing: 'easeInOutCubic'
      });
    }
    engine({
      targets: next,
      opacity: [0, 1],
      scale: [1.06, 1],
      duration: 700,
      easing: 'easeOutCubic'
    });
    steps.forEach((step, i) => step.classList.toggle('is-current', i === index));
    if (label && steps[index]) {
      engine.remove(label);
      engine({
        targets: label,
        opacity: [1, 0],
        translateY: [0, -8],
        duration: 160,
        easing: 'easeInQuad',
        complete() {
          if (index !== active) return;
          label.textContent = visibleLabel(steps[index]);
          engine({
            targets: label,
            opacity: [0, 1],
            translateY: [12, 0],
            duration: 420,
            easing: 'easeOutCubic'
          });
        }
      });
    }
  }

  const phoneNodes = [...document.querySelectorAll('.seq-phone, .still-reveal')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      engine({
        targets: entry.target,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 640,
        easing: 'easeOutCubic'
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  if (!wide) phoneNodes.forEach((node) => io.observe(node));

  function nearest() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 8) return steps.length - 1;
    const mid = window.innerHeight * 0.42;
    let best = 0;
    let bestDistance = Infinity;
    for (let i = 0; i < steps.length; i++) {
      const rect = steps[i].getBoundingClientRect();
      const distance = Math.abs(rect.top + Math.min(rect.height * 0.28, 160) - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    return best;
  }

  let ticking = false;
  function onFrame() {
    ticking = false;
    wide = wideQuery.matches;
    if (!wide) return;
    go(nearest());
  }
  function request() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onFrame);
  }
  document.getElementById('langToggle')?.addEventListener('click', () => {
    requestAnimationFrame(() => {
      if (label && steps[active]) label.textContent = visibleLabel(steps[active]);
    });
  });
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
  if (wide) {
    frames.forEach((img, i) => { img.style.opacity = i === 0 ? '1' : '0'; });
    request();
  }
})();
