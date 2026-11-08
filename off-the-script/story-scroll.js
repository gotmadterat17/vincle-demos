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
      ['01 · أوراق', 'أجزاء الجملة على ست ورقات، قبل أن تُجمع.'],
      ['02 · مسودة', 'الجملة كما هي في «من نحن»، بلا شطب.'],
      ['03 · إطار', 'المسودة نفسها داخل الإطار. لم يُحذف شيء.'],
      ['04 · صوت', 'السطر الذي سيبقى، بجانب الميكروفون.'],
      ['05 · شطب', 'شُطب ما زاد عن المقطع: الذي يعيد شغفنا، وحبّنا للإبداع.'],
      ['06 · المقطع', 'المخرجات مقطع قصير: نجمع الحروف المتفرقة حتى نطوّعها لخلق المحتوى.']
    ],
    en: [
      ['01 · Slips', 'The sentence in six slips, before it is gathered.'],
      ['02 · Draft', 'The line as it stands in “Who we are”, before any cut.'],
      ['03 · Frame', 'The same draft, inside the frame. Nothing removed yet.'],
      ['04 · Voice', 'The line that will stay, beside the microphone.'],
      ['05 · Cut', 'What is more than the cut is struck: the clause about passion and love of making.'],
      ['06 · The cut', 'The output is a short cut: we gather the scattered letters until we shape them into content.']
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
