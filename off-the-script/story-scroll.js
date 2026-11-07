(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = navigator.connection && navigator.connection.saveData;
  const wideQuery = matchMedia('(min-width:961px)');
  const frames = [...document.querySelectorAll('.seq-frame')];
  const steps = [...document.querySelectorAll('.seq-step')];
  const label = document.getElementById('seqLabel');
  const grounds = [...document.querySelectorAll('.band-glow img')];
  const beats = [...document.querySelectorAll('.beat-still')];
  const rails = [...document.querySelectorAll('.stance-rail i, .method-thread i')];
  const engine = typeof window.anime === 'function' ? window.anime : null;
  let shown = -1;

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
  }

  if (reduce || save || !engine || !frames.length) {
    staticMode();
    return;
  }

  root.classList.add('story-motion');
  root.dataset.anime = engine.version || 'loaded';

  function sourceFor(img) {
    return wideQuery.matches ? img.getAttribute('data-full') : img.getAttribute('data-poster');
  }

  function loadFrame(img) {
    const next = sourceFor(img);
    if (!next || img.getAttribute('src') === next) return;
    img.src = next;
  }

  frames.forEach((img, index) => {
    if (index < 2) loadFrame(img);
  });

  function setLabel(index) {
    if (!label || !steps[index] || index === shown) return;
    shown = index;
    const text = visibleLabel(steps[index]);
    engine.remove(label);
    engine({
      targets: label,
      opacity: [1, 0],
      translateY: [0, -10],
      duration: 140,
      easing: 'easeInQuad',
      complete() {
        if (shown !== index) return;
        label.textContent = text;
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

  function progressOf(rect) {
    const span = Math.max(1, rect.height - window.innerHeight * 0.28);
    return Math.min(1, Math.max(0, -rect.top / span));
  }

  function paint() {
    const wide = wideQuery.matches;
    const stepsBox = document.querySelector('.seq-steps');
    if (stepsBox) {
      const p = progressOf(stepsBox.getBoundingClientRect());
      const last = frames.length - 1;
      const f = p * last;
      const index = Math.min(last, Math.floor(f));
      const mix = f - index;
      frames.forEach((img, k) => {
        let opacity = 0;
        if (k === index) opacity = index === last ? 1 : 1 - mix;
        else if (k === index + 1) opacity = mix;
        if (opacity > 0.02) loadFrame(img);
        engine.set(img, { opacity, scale: 1.045 - opacity * 0.045 });
      });
      steps.forEach((step, i) => step.classList.toggle('is-current', i === index));
      setLabel(index);
    }

    grounds.forEach((img) => {
      const section = img.closest('section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const span = Math.max(1, rect.height + window.innerHeight);
      const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span));
      engine.set(img, { translateY: (0.5 - p) * (wide ? 48 : 24), scale: 1.08 });
    });

    beats.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - rect.top) / (window.innerHeight + rect.height)));
      engine.set(img, { translateY: (0.5 - p) * 28, scale: 1.04 });
    });

    rails.forEach((bar) => {
      const host = bar.closest('section');
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.72 - rect.top) / Math.max(1, rect.height)));
      engine.set(bar, bar.closest('.method-thread') ? { scaleY: p } : { scaleX: p });
    });

    document.querySelectorAll('[data-chapter] h2').forEach((heading) => {
      if (heading.dataset.handed) return;
      const rect = heading.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.78 && rect.bottom > 0) {
        heading.dataset.handed = '1';
        engine({
          targets: heading,
          translateY: [22, 0],
          opacity: [0.2, 1],
          duration: 680,
          easing: 'easeOutCubic'
        });
      }
    });
  }

  let ticking = false;
  function request() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      paint();
    });
  }

  document.getElementById('langToggle')?.addEventListener('click', () => {
    shown = -1;
    requestAnimationFrame(() => {
      const current = steps.findIndex((step) => step.classList.contains('is-current'));
      if (current >= 0 && label) label.textContent = visibleLabel(steps[current]);
    });
  });
  wideQuery.addEventListener('change', () => {
    frames.forEach((img) => { img.removeAttribute('src'); });
    frames.slice(0, 2).forEach(loadFrame);
    request();
  });
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
  paint();
})();
