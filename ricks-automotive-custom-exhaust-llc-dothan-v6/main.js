window.__B={"H": {"Monday": [450, 1020], "Tuesday": [450, 1020], "Wednesday": [450, 1020], "Thursday": [450, 1020], "Friday": [450, 1020], "Saturday": null, "Sunday": null}, "tz": "America/Chicago", "city": "Dothan"};
(function(){
var B=window.__B,doc=document.documentElement;
/* live open/closed status */
try{var D=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],H=B.H,p={};
new Intl.DateTimeFormat('en-US',{timeZone:B.tz,hour:'numeric',minute:'numeric',weekday:'long',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
var m=(+p.hour%24)*60+(+p.minute),d=D.indexOf(p.weekday),h=H[p.weekday],t,open=false;
function fm(x){var hh=Math.floor(x/60),mm=x%60,ap=hh<12?'AM':'PM';hh=hh%12||12;return hh+(mm?':'+(mm<10?'0':'')+mm:'')+' '+ap}
function dur(x){return (x>=60?Math.floor(x/60)+' h ':'')+(x%60)+' min'}
if(h&&m>=h[0]&&m<h[1]){open=true;t='Open now. Closes at '+fm(h[1])+', in '+dur(h[1]-m)+'.'}
else{for(var i=0;i<8;i++){var dn=D[(d+i)%7],q=H[dn];if(q&&(i>0||m<q[0])){var w=i*1440+q[0]-m;t='Closed now. Opens '+(i==0?'today':i==1?'tomorrow':dn)+' at '+fm(q[0])+(w<1440?', in '+dur(w):'')+'.';break}}}
document.querySelectorAll('.status').forEach(function(s){s.classList.toggle('open',open);s.querySelector('span').textContent=t+' '+B.city+' time.'});
var r=document.querySelector('tr[data-d="'+p.weekday+'"]');if(r)r.className='today'}catch(e){}

var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(RM||!window.gsap||!window.ScrollTrigger)return;
var g=gsap,ST=ScrollTrigger;g.registerPlugin(ST);doc.classList.add('gs');
var fine=matchMedia('(pointer:fine)').matches,mobile=innerWidth<860;

/* smooth scroll */
var lenis=null;
if(window.Lenis){lenis=new Lenis({lerp:.09,wheelMultiplier:1,anchors:true});lenis.on('scroll',ST.update);g.ticker.add(function(t){lenis.raf(t*1000)});g.ticker.lagSmoothing(0)}

/* hero: heat intro then scroll-scrubbed heat; hero copy drifts out; photo parallax */
var tint=document.querySelector('.tint'),glow=document.querySelector('.glow');
g.set(tint,{scaleX:.02,animation:'none'});
g.to(tint,{scaleX:.5,duration:1.8,delay:1.1,ease:'expo.out'});
g.fromTo(glow,{opacity:0},{opacity:1,duration:.5,delay:1.1,yoyo:true,repeat:1,repeatDelay:.4});
ST.create({trigger:'.hero',start:'top top',end:'bottom 20%',onUpdate:function(s){g.to(tint,{scaleX:.5+s.progress*.75,duration:.35,overwrite:true,ease:'power2.out'});g.set(glow,{opacity:Math.min(1,s.progress*2.2)*(1-s.progress*.6)})}});
g.to('.hbg',{yPercent:18,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
g.to('.hcopy',{yPercent:-14,opacity:.15,ease:'none',scrollTrigger:{trigger:'.hero',start:'35% top',end:'bottom top',scrub:true}});

/* marquee: speed and direction follow scroll velocity */
var mq=g.to('.mq-track',{xPercent:-50,repeat:-1,duration:26,ease:'none'}),dir=1;
if(lenis)lenis.on('scroll',function(e){var v=e.velocity||0;if(v)dir=v>0?1:-1;g.to(mq,{timeScale:dir*(1+Math.min(Math.abs(v),40)/5),duration:.3,overwrite:true});g.to(mq,{timeScale:dir,duration:1.2,delay:.3})});

/* split headings: words rise when they enter */
document.querySelectorAll('h2.split').forEach(function(h){
 var ws=h.textContent.trim().split(/\s+/);h.setAttribute('aria-label',h.textContent.trim());
 h.innerHTML=ws.map(function(w){return '<span class="w" aria-hidden="true"><span>'+w.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span></span>'}).join(' ');
 g.from(h.querySelectorAll('.w>span'),{yPercent:115,rotate:5,duration:1.1,ease:'expo.out',stagger:.07,scrollTrigger:{trigger:h,start:'top 86%'}})});

/* quote: words light up as you scroll */
g.to('.q .sw',{color:'#121826',stagger:.08,ease:'none',scrollTrigger:{trigger:'.quote',start:'top 70%',end:'bottom 65%',scrub:.6}});
g.from('.quote .who',{y:30,opacity:0,duration:.9,ease:'expo.out',scrollTrigger:{trigger:'.quote .who',start:'top 92%'}});

/* pinned horizontal services */
var track=document.querySelector('.hs-track');
function dist(){return Math.max(0,track.scrollWidth-innerWidth)}
var hz=g.to(track,{x:function(){return -dist()},ease:'none',scrollTrigger:{trigger:'.hs',start:'top top',end:function(){return '+='+dist()*(mobile?1:1.1)},pin:true,scrub:.8,invalidateOnRefresh:true,anticipatePin:1}});
g.to('.bar i',{scaleX:1,ease:'none',scrollTrigger:{trigger:'.hs',start:'top top',end:function(){return '+='+dist()},scrub:true,invalidateOnRefresh:true}});
document.querySelectorAll('.panel').forEach(function(pn,i){
 g.fromTo(pn.querySelector('img'),{xPercent:-7},{xPercent:7,ease:'none',scrollTrigger:{trigger:pn,containerAnimation:hz,start:'left right',end:'right left',scrub:true}});
 g.from(pn.querySelectorAll('.ptxt>*'),{y:40,opacity:0,stagger:.08,duration:.9,ease:'expo.out',scrollTrigger:{trigger:pn,containerAnimation:hz,start:'left 78%'}});
 if(i)g.from(pn.querySelector('.pimg'),{clipPath:'inset(0 0 0 100%)',duration:1.2,ease:'expo.inOut',scrollTrigger:{trigger:pn,containerAnimation:hz,start:'left 92%'}})});

/* stacked review cards: slide in, earlier ones sink back */
var cards=g.utils.toArray('.card');
cards.forEach(function(c,i){
 g.from(c,{y:120,rotate:i%2?2.5:-2.5,opacity:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:c,start:'top 92%'}});
 if(i<cards.length-1)g.to(c,{scale:.9-.02*(cards.length-i),filter:'brightness(.7)',ease:'none',scrollTrigger:{trigger:cards[i+1],start:'top 90%',end:'top 20%',scrub:true}})});

/* visit band parallax + reveals */
g.fromTo('.band .par',{yPercent:-10},{yPercent:10,ease:'none',scrollTrigger:{trigger:'.band',start:'top bottom',end:'bottom top',scrub:true}});
g.utils.toArray('.rv').forEach(function(el){g.from(el,{y:60,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 88%'}})});
g.from('tbody tr',{x:-30,opacity:0,stagger:.05,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'table',start:'top 85%'}});
g.from('.round',{scale:.3,rotate:-30,opacity:0,duration:1.2,ease:'back.out(1.6)',scrollTrigger:{trigger:'.close',start:'top 70%'}});
g.from('footer .mark span',{yPercent:100,opacity:0,stagger:.06,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'footer',start:'top 85%'}});

/* smoke from the tailpipe (canvas, only while the hero is on screen) */
var cv=document.querySelector('.smoke');
if(cv&&cv.getContext){var cx=cv.getContext('2d'),W,Hh,dpr=Math.min(devicePixelRatio||1,mobile?1.5:2),parts=[],on=true,sp=document.createElement('canvas');
 sp.width=sp.height=64;var sx=sp.getContext('2d'),gr=sx.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(225,230,238,.34)');gr.addColorStop(.45,'rgba(200,206,216,.14)');gr.addColorStop(1,'rgba(200,206,216,0)');sx.fillStyle=gr;sx.fillRect(0,0,64,64);
 function size(){var r=cv.getBoundingClientRect();W=r.width;Hh=r.height;cv.width=W*dpr;cv.height=Hh*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}
 size();addEventListener('resize',size);
 var N=mobile?34:60;
 function spawn(){return{x:0,y:Hh-40+(Math.random()-.5)*6,vx:(mobile?.25:.5)+Math.random()*(mobile?.6:1.1),vy:-(.35+Math.random()*.7),s:10+Math.random()*14,g:.35+Math.random()*.45,a:.9,life:0,max:170+Math.random()*120,r:Math.random()*6.28}}
 new IntersectionObserver(function(e){on=e[0].isIntersecting}).observe(document.querySelector('.hero'));
 g.ticker.add(function(){if(!on)return;cx.clearRect(0,0,W,Hh);if(parts.length<N&&Math.random()<.7)parts.push(spawn());
  for(var i=parts.length-1;i>=0;i--){var q=parts[i];q.life++;q.x+=q.vx+Math.sin((q.life+q.r*30)/28)*.35;q.y+=q.vy;q.vy*=.997;q.s+=q.g;var k=q.life/q.max;
   if(k>=1){parts.splice(i,1);continue}cx.globalAlpha=Math.min(1,q.life/18)*(1-k)*.8;cx.drawImage(sp,q.x-q.s,q.y-q.s,q.s*2,q.s*2)}
  cx.globalAlpha=1})}

/* magnetic buttons + custom cursor (fine pointers only) */
if(fine){
 document.querySelectorAll('.mag').forEach(function(el){el.style.transition='translate .5s cubic-bezier(.16,1,.3,1)';
  el.addEventListener('pointermove',function(e){var b=el.getBoundingClientRect(),x=e.clientX-b.left-b.width/2,y=e.clientY-b.top-b.height/2;el.style.translate=(x*.32)+'px '+(y*.42)+'px'});
  el.addEventListener('pointerleave',function(){el.style.translate='0 0'})});
 document.querySelectorAll('.panel,.card').forEach(function(el){
  el.addEventListener('pointermove',function(e){var b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;g.to(el.querySelector('img,blockquote,.big')||el,{x:x*14,y:y*10,duration:.6,ease:'power3.out'})});
  el.addEventListener('pointerleave',function(){g.to(el.querySelector('img,blockquote,.big')||el,{x:0,y:0,duration:.8,ease:'elastic.out(1,.5)'})})});
 var cur=document.querySelector('.cursor'),qx=g.quickTo(cur,'x',{duration:.35,ease:'power3'}),qy=g.quickTo(cur,'y',{duration:.35,ease:'power3'});
 addEventListener('pointermove',function(e){cur.classList.add('on');qx(e.clientX);qy(e.clientY)});
 document.addEventListener('pointerleave',function(){cur.classList.remove('on')});
 document.querySelectorAll('a,.panel').forEach(function(a){a.addEventListener('pointerenter',function(){cur.classList.add('big')});a.addEventListener('pointerleave',function(){cur.classList.remove('big')})})}
addEventListener('load',function(){ST.refresh()});
})();
