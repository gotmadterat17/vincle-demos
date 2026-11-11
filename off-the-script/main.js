(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobile = () => {
    if (!mobileNav || !navToggle) return;
    mobileNav.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };
  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    if (mobileNav) mobileNav.hidden = open;
    document.body.classList.toggle('nav-open', !open);
  });
  mobileNav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobile));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && mobileNav && !mobileNav.hidden) { closeMobile(); navToggle?.focus(); } });

  const contactCopy = {
    ar: {
      fields: { 'cf-name':['الاسم','الاسم'], 'cf-org':['الجهة أو الشركة','الجهة أو الشركة'], 'cf-email':['بريدك الإلكتروني','بريدك الإلكتروني'], 'cf-msg':['نوع المحتوى، الجمهور، الموعد…','عن المشروع'] },
      invalid:'يرجى تعبئة الحقول المطلوبة ببريد صالح.', required:'هذا الحقل مطلوب.', email:'أدخل بريداً إلكترونياً صالحاً.',
      copied:'تم نسخ المسودة. افتح @OFFTHESCRIPT_ للإرسال. لم يُرسل شيء تلقائياً.',
      failed:'تعذّر النسخ. انسخ المسودة أدناه يدوياً. لم يُرسل شيء.', draft:'المسودة — انسخ يدوياً',
      greeting:'مرحباً خارج النص', name:'الاسم', org:'الجهة', address:'البريد', signature:'مسودة من الموقع — لم تُرسل'
    },
    en: {
      fields: { 'cf-name':['Your name','Name'], 'cf-org':['Organization or company','Organization'], 'cf-email':['Your email address','Email address'], 'cf-msg':['Content type, audience, timing…','About your project'] },
      invalid:'Please complete the required fields and enter a valid email.', required:'This field is required.', email:'Enter a valid email address.',
      copied:'Draft copied. Open @OFFTHESCRIPT_ to send it. Nothing was sent automatically.',
      failed:'Could not copy. Select and copy the draft below manually. Nothing was sent.', draft:'Draft — copy manually',
      greeting:'Hello Off The Script', name:'Name', org:'Organization', address:'Email', signature:'Website draft — not sent'
    }
  };
  const getContactCopy = () => contactCopy[root.lang === 'en' ? 'en' : 'ar'];
  function syncContactLanguage() {
    const copy = getContactCopy();
    const formEl = document.getElementById('contactForm');
    if (formEl) formEl.lang = root.lang;
    Object.entries(copy.fields).forEach(([id,[placeholder,label]]) => {
      const el = document.getElementById(id); if (!el) return;
      el.placeholder = placeholder; el.setAttribute('aria-label',label);
      if (id !== 'cf-email') el.dir = root.dir;
      if (el.getAttribute('aria-invalid') === 'true') el.setCustomValidity(el.value.trim() ? copy.email : copy.required);
    });
    const fallback = document.getElementById('draftFallback');
    fallback?.setAttribute('aria-label',copy.draft);
    const notice = document.getElementById('cfStatus');
    if (notice?.dataset.messageKey) notice.textContent = copy[notice.dataset.messageKey];
  }
  syncContactLanguage();
  document.getElementById('contactForm')?.addEventListener('input',e=>{
    if (typeof e.target.setCustomValidity === 'function') { e.target.setCustomValidity(''); e.target.setAttribute('aria-invalid','false'); e.target.classList.remove('is-invalid'); }
  });
  function syncA11yLanguage() {
    const en = root.lang === 'en';
    document.querySelectorAll('.ar-only').forEach((el) => el.setAttribute('aria-hidden', en ? 'true' : 'false'));
    document.querySelectorAll('.en-only').forEach((el) => el.setAttribute('aria-hidden', en ? 'false' : 'true'));
    const toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.textContent = en ? 'عر' : 'EN';
      toggle.setAttribute('aria-label', en ? 'عر' : 'EN');
    }
    const menu = document.getElementById('navToggle');
    if (menu) menu.setAttribute('aria-label', en ? 'Menu' : 'القائمة');
  }
  syncA11yLanguage();
  document.getElementById('langToggle')?.addEventListener('click', () => {
    const toEn = root.lang !== 'en';
    root.lang = toEn ? 'en' : 'ar';
    root.dir = toEn ? 'ltr' : 'rtl';
    syncA11yLanguage();
    syncContactLanguage();
  });

  const bar = document.getElementById('progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    if (bar) bar.style.transform = `scaleX(${root.dir === 'rtl' ? -p : p})`;
  };
  addEventListener('scroll', onScroll, { passive: true });

  const fibDelays = [0, 100, 100, 200, 300, 500, 800];
  const fibDur = [300, 500, 800, 1300];
  const card = document.querySelector('.hero-card');
  if (card && !reduce) {
    card.classList.add('is-enter');
    const kids = [...card.children];
    kids.forEach((el, i) => {
      const d = fibDelays[i % fibDelays.length];
      const dur = 700 + fibDur[Math.min(i, fibDur.length - 1)];
      el.style.transition = `opacity ${dur}ms cubic-bezier(.22,.61,.36,1) ${d}ms, transform ${dur}ms cubic-bezier(.22,.61,.36,1) ${d}ms`;
      el.style.willChange = 'opacity, transform';
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      kids.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }));
    setTimeout(() => kids.forEach((el) => { el.style.willChange = 'auto'; }), 2400);
  } else if (card) {
    card.classList.remove('is-enter');
  }

  const vids = [...document.querySelectorAll('video[data-lazy]')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) {
        if (v.dataset.src && !v.getAttribute('src')) {
          v.src = v.dataset.src;
          v.load();
        }
        if (!reduce && !matchMedia('(max-width:960px)').matches && !navigator.connection?.saveData) v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { rootMargin: '80px', threshold: 0.15 });
  vids.forEach((v) => { if (reduce || matchMedia('(max-width:960px)').matches || navigator.connection?.saveData) { v.controls = true; v.loop = false; v.removeAttribute('autoplay'); } io.observe(v); });

  const form = document.getElementById('contactForm');
  const status = document.getElementById('cfStatus');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.elements.namedItem('name');
    const email = form.elements.namedItem('email');
    const message = form.elements.namedItem('message');
    const org = form.elements.namedItem('org');
    const copy = getContactCopy();
    let ok = true;
    [name, email, message].forEach((el) => {
      const bad = !el.value.trim() || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.classList.toggle('is-invalid', bad);
      el.setAttribute('aria-invalid', String(bad));
      el.setCustomValidity(bad ? (el.value.trim() ? copy.email : copy.required) : '');
      if (bad) ok = false;
    });
    status.hidden = false;
    if (!ok) {
      [name, email, message].find(el => el.getAttribute('aria-invalid') === 'true')?.focus();
      status.className = 'form-status is-error';
      status.dataset.messageKey = 'invalid';
      status.textContent = copy.invalid;
      return;
    }
    const draft = [
      copy.greeting,
      '',
      `${copy.name}: ${name.value.trim()}`,
      org.value.trim() ? `${copy.org}: ${org.value.trim()}` : null,
      `${copy.address}: ${email.value.trim()}`,
      '',
      message.value.trim(),
      '',
      copy.signature
    ].filter(Boolean).join('\n');
    try {
      await navigator.clipboard.writeText(draft);
      status.className = 'form-status';
      status.dataset.messageKey = 'copied';
      status.textContent = copy.copied;
    } catch {
      status.className = 'form-status is-error';
      const fallback = document.getElementById('draftFallback');
      fallback.hidden = false; fallback.value = draft; fallback.focus(); fallback.select();
      status.dataset.messageKey = 'failed';
      status.textContent = copy.failed;
    }
  });

  const canvas = document.getElementById('nebula');
  /* variant-nonebula gate — keep layout, hide atmosphere */
  const _v = (new URLSearchParams(location.search).get('variant') || 'nebula').toLowerCase();
  const _nonebula = _v === 'nonebula' || _v === 'flat' || _v === 'b' || _v === 'no-nebula';
  if (_nonebula) {
    document.documentElement.classList.add('variant-nonebula');
    document.documentElement.classList.remove('variant-nebula');
    if (canvas) canvas.style.display = 'none';
  } else {
    document.documentElement.classList.add('variant-nebula');
    document.documentElement.classList.remove('variant-nonebula');
  }

  const spectrum = [
    [220, 12, 196],
    [152, 16, 216],
    [48, 16, 208],
    [16, 136, 208],
    [24, 208, 144]
  ];
  if (canvas && !_nonebula && !reduce && !matchMedia('(max-width:700px)').matches) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(devicePixelRatio || 1, 1.35);
    let w = 0, h = 0, clouds = [], motes = [], raf = 0, t0 = performance.now();
    const resize = () => {
      w = innerWidth; h = innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      clouds = spectrum.map((c, i) => ({
        c,
        x: (0.12 + (i * 0.18) % 0.82) * w,
        y: (0.18 + (i * 0.14) % 0.7) * h,
        r: Math.min(w, h) * (0.22 + (i % 3) * 0.06),
        ox: (i % 2 ? 1 : -1) * (0.08 + i * 0.01),
        oy: (i % 2 ? -1 : 1) * (0.05 + i * 0.008),
        phase: i * 1.1,
        a: 0.14 + (i % 3) * 0.03
      }));
      const n = Math.min(18, Math.floor((w * h) / 70000));
      motes = Array.from({ length: n }, (_, i) => {
        const c = spectrum[i % spectrum.length];
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + Math.random() * 1.2,
          vy: -0.03 - Math.random() * 0.07,
          vx: (Math.random() - 0.5) * 0.03,
          a: 0.05 + Math.random() * 0.1,
          c
        };
      });
    };
    const tick = (now) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const cl of clouds) {
        const x = cl.x + Math.sin(t * 0.07 + cl.phase) * w * cl.ox * 0.35;
        const y = cl.y + Math.cos(t * 0.055 + cl.phase) * h * cl.oy * 0.35;
        const r = cl.r * (1 + Math.sin(t * 0.09 + cl.phase) * 0.06);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${cl.c[0]},${cl.c[1]},${cl.c[2]},${cl.a})`);
        g.addColorStop(0.45, `rgba(${cl.c[0]},${cl.c[1]},${cl.c[2]},${cl.a * 0.35})`);
        g.addColorStop(1, `rgba(${cl.c[0]},${cl.c[1]},${cl.c[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      for (const m of motes) {
        m.x += m.vx; m.y += m.vy;
        if (m.y < -4) { m.y = h + 4; m.x = Math.random() * w; }
        if (m.x < -4) m.x = w + 4;
        if (m.x > w + 4) m.x = -4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${m.c[0]},${m.c[1]},${m.c[2]},${m.a})`;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    resize();
    addEventListener('resize', resize, { passive: true });
    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(tick); }
    };
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(tick);
  } else if (canvas) {
    canvas.style.display = 'none';
  }

  if (!reduce) {
    const revealables = [...document.querySelectorAll('.journey-card, .menu-card, .method-step, .gal-grid .vid-frame')];
    const show = (el, i) => {
      const d = fibDelays[i % fibDelays.length];
      el.style.transition = `opacity 700ms cubic-bezier(.22,.61,.36,1) ${d}ms, transform 700ms cubic-bezier(.22,.61,.36,1) ${d}ms`;
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.willChange = 'auto';
      }, d + 750);
    };
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const i = revealables.indexOf(el);
        show(el, Math.max(0, i));
        rio.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '120px' });
    revealables.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.willChange = 'opacity, transform';
      rio.observe(el);
    });
  }

  /* HUD waveforms — pause when hero offscreen */
  let heroVisible = true;
  const heroEl = document.querySelector('[data-hero]');
  if (heroEl) {
    new IntersectionObserver((entries) => {
      heroVisible = entries.some((en) => en.isIntersecting);
    }, { threshold: 0.05 }).observe(heroEl);
  }

  function waveLoop(canvasEl, colors, amp = 14) {
    if (!canvasEl || reduce) return;
    const ctx = canvasEl.getContext('2d');
    let t = 0;
    const draw = () => {
      requestAnimationFrame(draw);
      if (!heroVisible || document.hidden) return;
      const w = canvasEl.width, h = canvasEl.height;
      ctx.clearRect(0, 0, w, h);
      colors.forEach((col, i) => {
        ctx.beginPath();
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.75 - i * 0.15;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin((x / w) * Math.PI * (3 + i) + t * (1.1 + i * 0.25) + i) * (amp - i * 2)
            + Math.sin((x / w) * Math.PI * 7 + t * 0.6) * 3;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      t += 0.028;
    };
    draw();
  }
  if (matchMedia('(min-width: 700px)').matches) {
    const armWaves = () => {
      waveLoop(document.getElementById('waveA'), ['#e8eef6', '#dc0cc4', '#3aa3e0'], 16);
      waveLoop(document.getElementById('waveB'), ['#dc0cc4', '#18d090'], 12);
      waveLoop(document.getElementById('waveC'), ['#9810d8', '#1088d0'], 10);
    };
    const later = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
    if (document.readyState === 'complete') later(armWaves, { timeout: 1200 });
    else addEventListener('load', () => later(armWaves, { timeout: 1200 }), { once: true });
  }

  if (!reduce) {
    const bars = document.querySelectorAll('#hudBars i');
    setInterval(() => {
      if (!heroVisible || document.hidden) return;
      bars.forEach((el) => {
        el.style.setProperty('--h', `${28 + Math.random() * 70}%`);
      });
    }, 1100);
  }
})();
