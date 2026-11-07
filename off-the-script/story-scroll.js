(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const save = navigator.connection && navigator.connection.saveData;
  const track = document.getElementById('seqTrack');
  const stage = document.getElementById('seqStage');
  const kicker = document.getElementById('seqKicker');
  const body = document.getElementById('seqBody');
  const engine = typeof window.anime === 'function' ? window.anime : null;

  function staticMode() {
    root.classList.add('story-static');
  }

  if (reduce || save || !engine || !track || !stage) {
    staticMode();
    return;
  }

  root.classList.add('story-motion');
  root.dataset.anime = engine.version || 'loaded';

  const words = [...stage.querySelectorAll('.w')];
  const rule = stage.querySelector('.rule');
  const finder = stage.querySelector('.finder');
  const cut = stage.querySelector('.cut');
  const copy = {
    ar: [
      ['01 · فكرة', 'ثلاث كلمات من جملة الاستوديو، ما زالت متفرقة. القرار: ماذا نريد أن يبقى.'],
      ['02 · سكربت', 'الكلمات تصطف في جملة واحدة. القرار: النبرة قبل أي صورة.'],
      ['03 · إطار', 'إطار يُغلق على الجملة نفسها. القرار: ماذا يدخل الكادر.'],
      ['04 · مونتاج', 'نُبقي «خارج النص» ونُخفض الباقي. القرار: المقطع الذي يُنشر.']
    ],
    en: [
      ['01 · Idea', 'Three words from the studio line, still apart. The decision: what should remain.'],
      ['02 · Script', 'The words lock into one line. The decision: tone before any picture.'],
      ['03 · Frame', 'A frame closes on the same line. The decision: what sits inside the shot.'],
      ['04 · Edit', 'We keep “off the script” and lower the rest. The decision: the cut that is published.']
    ],
    mid: {
      ar: [
        'الكلمات في طريقها إلى سطر واحد.',
        'الإطار يُغلق على السطر نفسه.',
        'القصّ يُبقي «خارج النص» ويُخفض الباقي.'
      ],
      en: [
        'The words are gathering into one line.',
        'The frame is closing on the same line.',
        'The cut keeps “off the script” and lowers the rest.'
      ]
    }
  };

  function poses(rtl) {
    if (rtl) {
      return [
        { w: [[.74, .30, 1], [.26, .44, 1], [.48, .72, 1]], rule: 0, finder: 0, cut: 0 },
        { w: [[.76, .48, 1], [.50, .48, 1], [.22, .48, 1]], rule: 1, finder: 0, cut: 0 },
        { w: [[.74, .48, 1], [.50, .48, 1], [.24, .48, 1]], rule: 1, finder: 1, cut: 0 },
        { w: [[.74, .36, .32], [.48, .36, .32], [.50, .68, 1]], rule: 0, finder: 1, cut: 1 }
      ];
    }
    return [
      { w: [[.24, .30, 1], [.52, .46, 1], [.74, .72, 1]], rule: 0, finder: 0, cut: 0 },
      { w: [[.22, .48, 1], [.48, .48, 1], [.76, .48, 1]], rule: 1, finder: 0, cut: 0 },
      { w: [[.24, .48, 1], [.48, .48, 1], [.74, .48, 1]], rule: 1, finder: 1, cut: 0 },
      { w: [[.24, .36, .32], [.50, .36, .32], [.50, .68, 1]], rule: 0, finder: 1, cut: 1 }
    ];
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function paint() {
    const lang = root.lang === 'en' ? 'en' : 'ar';
    const rtl = root.dir !== 'ltr';
    const rect = track.getBoundingClientRect();
    const stuck = 68;
    const span = Math.max(1, rect.height - stage.parentElement.getBoundingClientRect().height);
    const p = Math.min(1, Math.max(0, (stuck - rect.top) / span));
    const steps = poses(rtl);
    const segCount = steps.length - 1;
    const x = Math.min(0.9999, p) * segCount;
    const seg = Math.min(segCount - 1, Math.floor(x));
    const local = x - seg;
    const from = steps[seg];
    const to = steps[seg + 1];
    const box = stage.getBoundingClientRect();
    words.forEach((el, i) => {
      const a = from.w[i];
      const b = to.w[i];
      const xPos = lerp(a[0], b[0], local) * box.width - el.offsetWidth / 2;
      const yPos = lerp(a[1], b[1], local) * box.height - el.offsetHeight / 2;
      engine.set(el, { translateX: xPos, translateY: yPos, opacity: lerp(a[2], b[2], local) });
    });
    engine.set(rule, { scaleX: lerp(from.rule, to.rule, local) });
    engine.set(finder, { opacity: lerp(from.finder, to.finder, local) });
    engine.set(cut, { scaleX: lerp(from.cut, to.cut, local) });
    const mode = local < 0.35 ? 'from' : (local < 0.65 ? 'mid' : 'to');
    const titleIndex = p > 0.998 ? steps.length - 1 : (mode === 'to' ? seg + 1 : seg);
    const line = mode === 'mid' ? [copy[lang][seg][0], copy.mid[lang][seg]] : copy[lang][titleIndex];
    if (kicker.textContent !== line[0]) kicker.textContent = line[0];
    if (body.textContent !== line[1]) body.textContent = line[1];
    track.dataset.p = p.toFixed(4);
    track.dataset.seg = String(seg);
    track.dataset.local = local.toFixed(4);
    track.dataset.title = String(titleIndex);
    track.dataset.mode = mode;

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
