(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = navigator.connection && navigator.connection.saveData;
  const track = document.getElementById('seqTrack');
  const stage = document.getElementById('seqStage');
  const kicker = document.getElementById('seqKicker');
  const body = document.getElementById('seqBody');
  const shots = [...document.querySelectorAll('#seqStage .seq-shot')];
  const count = new Set(shots.map((img) => img.dataset.i)).size;
  const engine = typeof window.anime === 'function' ? window.anime : null;
  const copy = {
    ar: [
      ['01 · أوراق', 'الكلمات متفرقة على ست ورقات، ومنها «خارج النص».'],
      ['02 · مسودة', 'نفس الكلمات في ثلاثة أسطر.'],
      ['03 · إطار', 'المسودة نفسها داخل الإطار.'],
      ['04 · صوت', 'الصفحة لم تغادر، والميكروفون جاء إليها.'],
      ['05 · شطب', 'شُطب السطران الزائدان. بقي «خارج النص».'],
      ['06 · البطاقة', 'البطاقة تحمل السطر الذي بقي، وبجانبها المسودة المشطوبة.']
    ],
    en: [
      ['01 · Slips', 'The words are apart, including “off the script”.'],
      ['02 · Draft', 'The same words, in three lines.'],
      ['03 · Frame', 'The same draft, inside the frame.'],
      ['04 · Voice', 'The page stays. The microphone comes to it.'],
      ['05 · Cut', 'The extra lines are struck. “Off the script” stays.'],
      ['06 · The card', 'The card carries the line that stayed, beside the marked draft.']
    ]
  };

  function staticMode() { root.classList.add('story-static'); }

  if (reduce || save || !engine || !track || !shots.length) {
    staticMode();
    shots.forEach((img) => {
      const src = img.getAttribute('data-src');
      if (src && !img.getAttribute('src')) img.src = src;
    });
    return;
  }

  root.classList.add('story-motion');
  root.dataset.anime = engine.version || 'loaded';

  function load(img) {
    const src = img.getAttribute('data-src');
    if (src && !img.getAttribute('src')) img.src = src;
  }
  load(shots[1]);

  function paint() {
    const lang = root.lang === 'en' ? 'en' : 'ar';
    const sticky = stage.parentElement;
    const rect = track.getBoundingClientRect();
    const stuck = 64;
    const span = Math.max(1, rect.height - sticky.getBoundingClientRect().height);
    const p = Math.min(1, Math.max(0, (stuck - rect.top) / span));
    const segCount = count - 1;
    const x = Math.min(0.9999, p) * segCount;
    const seg = Math.min(segCount - 1, Math.floor(x));
    const local = x - seg;
    const show = p > 0.998 ? count - 1 : (local < 0.45 ? seg : seg + 1);
    shots.forEach((img) => {
      const i = Number(img.dataset.i);
      if (Math.abs(i - show) <= 1) load(img);
      const on = i === show;
      engine.set(img, { opacity: on ? 1 : 0, scale: 1 });
    });
    const line = copy[lang][show];
    if (kicker.textContent !== line[0]) kicker.textContent = line[0];
    if (body.textContent !== line[1]) body.textContent = line[1];
    track.dataset.p = p.toFixed(4);
    track.dataset.seg = String(seg);
    track.dataset.local = local.toFixed(4);
    track.dataset.title = String(show);
    const thread = document.querySelector('.method-thread i');
    const host = document.getElementById('method');
    if (thread && host) {
      const r = host.getBoundingClientRect();
      const tp = Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / Math.max(1, r.height)));
      engine.set(thread, { scaleY: tp });
    }
  }

  let ticking = false;
  function request() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; paint(); });
  }
  document.getElementById('langToggle')?.addEventListener('click', () => requestAnimationFrame(paint));
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request, { passive: true });
  paint();
})();
