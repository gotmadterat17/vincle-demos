(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = navigator.connection && navigator.connection.saveData;
  const chapters = document.querySelectorAll('[data-chapter]');
  const beats = document.querySelectorAll('[data-beat]');
  const scenes = document.querySelectorAll('[data-scene]');
  const workBeats = document.querySelectorAll('.story-beat');

  if (reduce || save) {
    root.classList.add('story-static');
    for (let i = 0; i < beats.length; i++) beats[i].classList.add('is-in');
    return;
  }

  root.classList.add('story-motion');
  const io = new IntersectionObserver((entries) => {
    for (let i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      entries[i].target.classList.add('is-in');
      io.unobserve(entries[i].target);
    }
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  for (let i = 0; i < beats.length; i++) io.observe(beats[i]);

  const wideQuery = matchMedia('(min-width:961px)');
  let wide = wideQuery.matches;
  wideQuery.addEventListener('change', (event) => { wide = event.matches; });

  let ticking = false;
  function frame() {
    ticking = false;
    const vh = window.innerHeight;
    const mid = vh * 0.46;
    const start = vh * 0.92;
    const end = vh * 0.2;
    const span = start - end;
    for (let i = 0; i < chapters.length; i++) {
      const el = chapters[i];
      const rect = el.getBoundingClientRect();
      const total = rect.height + vh;
      const p = total > 0 ? Math.min(1, Math.max(0, (vh - rect.top) / total)) : 0;
      el.style.setProperty('--p', p.toFixed(3));
    }
    for (let i = 0; i < scenes.length; i++) {
      const el = scenes[i];
      const rect = el.getBoundingClientRect();
      let reveal = span > 0 ? (start - rect.top) / span : 1;
      if (reveal < 0) reveal = 0;
      else if (reveal > 1) reveal = 1;
      el.style.setProperty('--reveal', reveal.toFixed(3));
      const cover = wide && el.classList.contains('cut-plate') && i > 0 ? reveal : 1;
      el.style.setProperty('--cover', cover.toFixed(3));
    }
    let best = null;
    let bestDistance = Infinity;
    for (let i = 0; i < workBeats.length; i++) {
      const rect = workBeats[i].getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height * 0.5 - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = workBeats[i];
      }
    }
    const mark = best && bestDistance < vh * 0.55;
    for (let i = 0; i < workBeats.length; i++) {
      const on = mark && workBeats[i] === best;
      if (workBeats[i].classList.contains('is-current') !== on) {
        workBeats[i].classList.toggle('is-current', on);
      }
    }
  }
  function requestFrame() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }
  addEventListener('scroll', requestFrame, { passive: true });
  addEventListener('resize', requestFrame, { passive: true });
  requestFrame();
})();
