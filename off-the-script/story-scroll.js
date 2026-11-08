(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = navigator.connection && navigator.connection.saveData;
  const track = document.getElementById('seqTrack');
  const stage = document.getElementById('seqStage');
  const kicker = document.getElementById('seqKicker');
  const body = document.getElementById('seqBody');
  const shots = [...document.querySelectorAll('#seqStage .seq-shot')];
  const engine = typeof window.anime === 'function' ? window.anime : null;
  const copy = {
    ar: [
      ['01 · فكرة', 'أوراق متفرقة على الطاولة. القرار: ماذا نجمع.'],
      ['02 · سكربت', 'صارت صفحة واحدة. النبرة قبل أي صورة.'],
      ['03 · إطار', 'إطار حول الصفحة نفسها. ما يدخل الكادر.'],
      ['04 · صوت', 'الميكروفون يدخل على الصفحة نفسها.'],
      ['05 · مونتاج', 'الصفحة بجانب الشريط. البناء يبدأ.'],
      ['06 · القطع', 'شريط يبقى، والقصاصات تخرج.'],
      ['07 · ما يصلك', 'بطاقة جاهزة. هذا شكل المخرج، لا شعارنا.'],
      ['08 · البداية', 'الظرف مفتوح. اكتب موجزك وأرسله.']
    ],
    en: [
      ['01 · Idea', 'Loose slips on the desk. The decision: what to gather.'],
      ['02 · Script', 'One page. Tone before any picture.'],
      ['03 · Frame', 'A frame around the same page. What enters the shot.'],
      ['04 · Voice', 'The microphone arrives at the same page.'],
      ['05 · Edit', 'The page sits beside the timeline.'],
      ['06 · Cut', 'One bar stays. The scraps leave.'],
      ['07 · What you receive', 'A finished card. That is the piece, not our mark.'],
      ['08 · Begin', 'The envelope is open. Write your brief and send it.']
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
    const segCount = shots.length - 1;
    const x = Math.min(0.9999, p) * segCount;
    const seg = Math.min(segCount - 1, Math.floor(x));
    const local = x - seg;
    const show = p > 0.998 ? shots.length - 1 : (local < 0.45 ? seg : seg + 1);
    shots.forEach((img, i) => {
      if (Math.abs(i - show) <= 1) load(img);
      const on = i === show;
      const drift = on ? 1.04 - Math.min(local, 1 - local) * 0.06 : 1;
      engine.set(img, { opacity: on ? 1 : 0, scale: drift });
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
