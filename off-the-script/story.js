(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  const letters = document.querySelector('.letters');
  if (letters && !reduce) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      letters.classList.add('is-go');
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(letters);
  }

  const reel = document.querySelector('[data-reel]');
  const desktop = matchMedia('(min-width: 960px)');
  if (reel && !reduce && desktop.matches) {
    const frames = [...reel.querySelectorAll('.reel-frame')];
    const label = reel.querySelector('[data-reel-label]');
    reel.style.setProperty('--n', String(frames.length));
    reel.classList.add('is-live');
    let last = -1;
    const apply = (i) => {
      if (i === last) return;
      last = i;
      frames.forEach((frame, n) => frame.classList.toggle('is-on', n === i));
      if (label) {
        const title = frames[i].getAttribute('data-title') || '';
        const en = frames[i].getAttribute('data-title-en') || title;
        label.textContent = root.lang === 'en' ? en : title;
      }
    };
    const onScroll = () => {
      const rect = reel.getBoundingClientRect();
      const total = reel.offsetHeight - innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const i = Math.min(frames.length - 1, Math.floor(p * frames.length));
      apply(i);
    };
    apply(0);
    addEventListener('scroll', onScroll, { passive: true });
    document.getElementById('langToggle')?.addEventListener('click', () => {
      last = -1;
      onScroll();
    });
    onScroll();
  }

  const counter = document.querySelector('[data-count]');
  if (counter && !reduce) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / 1100);
        const eased = 1 - Math.pow(1 - t, 3);
        const n = Math.round(1000000 * eased);
        counter.textContent = '+' + n.toLocaleString('en-US');
        if (t < 1) requestAnimationFrame(tick);
        else counter.textContent = '+1,000,000';
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(counter);
  }

  const sheet = document.getElementById('sheet');
  const sheetImg = document.getElementById('sheetImg');
  const sheetCap = document.getElementById('sheetCap');
  document.querySelectorAll('[data-zoom]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!sheet || !sheetImg) return;
      sheetImg.src = btn.dataset.zoom;
      sheetImg.alt = btn.dataset.alt || '';
      sheetImg.width = Number(btn.dataset.w || 960);
      sheetImg.height = Number(btn.dataset.h || 656);
      if (sheetCap) sheetCap.textContent = (root.lang === 'en' ? btn.dataset.capEn : btn.dataset.cap) || btn.dataset.cap || '';
      if (typeof sheet.showModal === 'function') sheet.showModal();
      else sheet.hidden = false;
    });
  });
  sheet?.querySelector('[data-close]')?.addEventListener('click', () => sheet.close());
})();
