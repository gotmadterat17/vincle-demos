(() => {
  const hero = document.querySelector('[data-hero]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const query = new URLSearchParams(location.search);
  if (!hero || reduced.matches || navigator.connection?.saveData) return;
  const flat = ['nonebula','flat','b','no-nebula'].includes((query.get('variant') || '').toLowerCase());
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'a-ambient-loop';
  if (!flat) hero.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let width = 1, height = 1, visible = true, running = 0;
  let active = 0, last = 0, eased = 0, target = 0, lastPaint = 0;
  function resize() {
    const mobile = innerWidth <= 700;
    const rect = hero.getBoundingClientRect();
    if (mobile) {
      const aspect = rect.height / Math.max(1, rect.width);
      width = 96;
      height = Math.max(64, Math.round(width * aspect));
      if (height > 160) {
        height = 160;
        width = Math.max(48, Math.round(height / aspect));
      }
    } else {
      const scale = Math.min(1.25, 960 / Math.max(1, rect.width));
      width = Math.max(1, Math.round(rect.width * scale));
      height = Math.max(1, Math.round(rect.height * scale));
    }
    canvas.width = width; canvas.height = height;
    ctx.filter = mobile ? 'blur(4px)' : 'none';
    scroll();
  }
  function scroll() {
    const rect = hero.getBoundingClientRect();
    target = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
  }
  const volumes = [
    [.22,.36,.36,[220,12,196],.12],
    [.51,.29,.42,[48,16,208],.14],
    [.72,.53,.38,[16,136,208],.17],
    [.57,.78,.29,[24,208,144],.08]
  ];
  function paint() {
    if (flat) return;
    ctx.clearRect(0,0,width,height);
    const phase = active * Math.PI * 2 / 24;
    volumes.forEach(([x,y,r,c,a],i) => {
      const px = (x + Math.sin(phase + i) * .025) * width;
      const py = (y + Math.cos(phase + i) * .018 - eased * .04) * height;
      const radius = r * Math.max(width,height);
      const g = ctx.createRadialGradient(px,py,0,px,py,radius);
      g.addColorStop(0,`rgba(${c},${a * (1 + eased * .15)})`);
      g.addColorStop(.45,`rgba(${c},${a * .45})`);
      g.addColorStop(1,`rgba(${c},0)`);
      ctx.fillStyle = g; ctx.fillRect(0,0,width,height);
    });
  }
  function frame(now) {
    running = 0;
    const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now;
    if (!visible || document.hidden || reduced.matches) return;
    active += dt;
    eased += (target - eased) * (1 - Math.exp(-7 * dt));
    hero.style.setProperty('--a-scroll', eased.toFixed(4));
    if (now - lastPaint >= 32) { lastPaint = now; paint(); }
    running = requestAnimationFrame(frame);
  }
  function resume() {
    if (innerWidth <= 700 || running || !visible || document.hidden || reduced.matches) return;
    last = performance.now(); running = requestAnimationFrame(frame);
  }
  function pause() { cancelAnimationFrame(running); running = 0; }
  new IntersectionObserver(entries => {
    visible = entries.some(e => e.isIntersecting);
    if (visible) resume(); else pause();
  }, {threshold: 0}).observe(hero);
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());
  reduced.addEventListener('change', () => { if (reduced.matches) { pause(); canvas.hidden = true; hero.style.removeProperty('--a-scroll'); } else { canvas.hidden = false; resume(); } });
  addEventListener('scroll',scroll,{passive:true});
  addEventListener('resize', () => {
    resize();
    if (innerWidth <= 700) { pause(); paint(); }
    else resume();
  }, {passive:true});
  resize();
  if (innerWidth <= 700) paint();
  else resume();
})();
