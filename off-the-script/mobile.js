(() => {
  const toggle=document.getElementById('navToggle');
  const menu=document.getElementById('mobileNav');
  if(!toggle || !menu) return;
  const close=(restore=false)=>{
    menu.hidden=true;toggle.setAttribute('aria-expanded','false');
    document.body.classList.remove('nav-open');
    if(restore) toggle.focus();
  };
  toggle.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'){
      e.preventDefault();menu.hidden=false;toggle.setAttribute('aria-expanded','true');
      menu.querySelector('a')?.focus();
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && !menu.hidden){e.preventDefault();close(true);}});
  document.addEventListener('click',e=>{if(!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target))close();});
  document.addEventListener('focusin',e=>{if(!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target))close();});
  menu.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{
    close();const section=document.getElementById(a.hash.slice(1));
    if(section){section.setAttribute('tabindex','-1');section.focus({preventScroll:true});}
  }));
  matchMedia('(min-width:961px)').addEventListener('change',e=>{if(e.matches)close();});
  // Art is decorative on phones; page remains vertically scrollable, not a touch-orbit trap.
  const hit=document.getElementById('heroHit');
  const mobile=matchMedia('(max-width:960px)');
  const update=()=>{if(hit) hit.tabIndex=mobile.matches?-1:0;};
  mobile.addEventListener('change',update);update();
})();
