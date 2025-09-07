// Theme toggle (persisted)
(function(){
  const btn=document.getElementById('theme-toggle');
  const root=document.documentElement;
  const stored=localStorage.getItem('theme');
  if(stored==='dark'||(!stored&&window.matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('dark');
  btn.textContent=root.classList.contains('dark')?'Light':'Dark';
  btn.addEventListener('click',()=>{root.classList.toggle('dark');localStorage.setItem('theme',root.classList.contains('dark')?'dark':'light');btn.textContent=root.classList.contains('dark')?'Light':'Dark';});
})();

// Smooth in-page scroll
(function(){
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href');if(id.length>1){e.preventDefault();document.querySelector(id)?.scrollIntoView({behavior:'smooth',block:'start'});}});
})();

// Rotating focus words
(function(){
  const words=['Web Development','App Development','Branding & Design','Video Editing','SEO','Social Media Marketing','Machine Learning'];
  const el=document.getElementById('rotator');let i=0;function tick(){el.textContent=words[i%words.length];i++;}tick();setInterval(tick,2200);
})();

// Particles background + parallax
(function(){
  const c=document.getElementById('bg-particles');if(!c)return;const ctx=c.getContext('2d');let parts=[];function resize(){c.width=innerWidth;c.height=innerHeight;const count=Math.floor(innerWidth*innerHeight*0.0009);parts=Array.from({length:count},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6}));}resize();addEventListener('resize',resize);
  function frame(){ctx.clearRect(0,0,c.width,c.height);for(const p of parts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>c.width)p.vx*=-1;if(p.y<0||p.y>c.height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,1.3,0,Math.PI*2);ctx.fillStyle='rgba(16,185,129,.9)';ctx.fill();}
    for(let i=0;i<parts.length;i++){for(let j=i+1;j<parts.length;j++){const a=parts[i],b=parts[j];const dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<120){ctx.strokeStyle=`rgba(45,212,191,${(1-d/120)*.35})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}
    requestAnimationFrame(frame);
  }requestAnimationFrame(frame);
})();

// Tilt on hover (cards & buttons)
(function(){
  const els=[...document.querySelectorAll('.tilt,.portfolio__card')];
  els.forEach(el=>{
    el.addEventListener('mousemove',(e)=>{const r=el.getBoundingClientRect();const x=e.clientX-r.left;const y=e.clientY-r.top;const rx=((y-r.height/2)/r.height)*-10;const ry=((x-r.width/2)/r.width)*10;el.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;});
    el.addEventListener('mouseleave',()=>{el.style.transform='perspective(900px) rotateX(0) rotateY(0)';});
  });
})();

// Scroll reveals
(function(){
  const els=[...document.querySelectorAll('.section, .card, .post, .stat, .portfolio__card, .about .placeholder, .team__card')].filter(el=>!el.closest('#team .deck'));
  els.forEach(el=>el.classList.add('reveal'));
  const io=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}})},{threshold:.2});
  els.forEach(el=>io.observe(el));
})();

// Horizontal scroll portfolio with pinned section
(function(){
  const section=document.querySelector('[data-hscroll]'); if(!section) return;
  const track=document.getElementById('portfolio-track');
  const items=[...track.getElementsByClassName('portfolio__card')];
  console.log(items);
  const render=(cat)=>{
    track.innerHTML='';
    console.log(cat);
    (cat==='all'?items:items.filter(i=>i.classList.contains(cat))).forEach(i=>{
      console.log(i);
      track.innerHTML+=i.outerHTML;
    });
  };
  
  const state={vw:0,vh:0,tw:0};
  function measure(){state.vw=innerWidth;state.vh=innerHeight;state.tw=track.scrollWidth;const extra=Math.max(0,state.tw-state.vw);section.style.minHeight=(state.vh+extra)+"px";}
  function onScroll(){
    const rect=section.getBoundingClientRect();
    const start=rect.top; const end=rect.bottom-state.vh;
    let progress=0; if(end-start!==0) progress=Math.min(1,Math.max(0,-start/(end-start)));
    const distance=Math.max(0,state.tw-state.vw);
    if(distance===0){ track.style.transform='translate3d(0,0,0)'; return; }
    const x=-progress*distance; track.style.transform=`translate3d(${x}px,0,0)`;
  }
  addEventListener('resize',()=>{measure();onScroll();});
  addEventListener('scroll',onScroll,{passive:true});
  // ensure measure after images
  function afterImages(cb){const imgs=[...track.querySelectorAll('img')]; if(!imgs.length){cb();return;} let loaded=0; imgs.forEach(img=>{if(img.complete){if(++loaded===imgs.length)cb();} else {img.addEventListener('load',()=>{if(++loaded===imgs.length)cb();});}});}
  measure(); onScroll(); afterImages(()=>{measure(); onScroll();}); requestAnimationFrame(()=>{measure(); onScroll();});
  // Filters
  document.getElementById('portfolio-filters').addEventListener('click',e=>{
    const btn=e.target.closest('.tab'); 
    if(!btn) return; 
    [...btn.parentNode.children].forEach(b=>b.classList.remove('is-active')); 
    btn.classList.add('is-active'); 
    console.log(btn.dataset.cat);
    render(btn.dataset.cat); 
    setTimeout(()=>{measure();onScroll();},0);
  });
})();

// Lottie speed hover effect
(function(){
  // Hide until component is defined to avoid broken placeholders
  const groups=[...document.querySelectorAll('.contact__lotties, .contact__lottie')];
  groups.forEach(g=>g.classList.remove('lotties-ready'));
  (customElements?.whenDefined?customElements.whenDefined('lottie-player'):Promise.resolve()).then(()=>{
    groups.forEach(g=>g.classList.add('lotties-ready'));
    document.querySelectorAll('.lottie').forEach(el=>{el.addEventListener('mouseenter',()=>{el.setSpeed?.(1.8)}); el.addEventListener('mouseleave',()=>{el.setSpeed?.(1)});});
  });
})();

// Hero parallax heading
(function(){
  const hero=document.querySelector('.hero'); if(!hero) return; const title=hero.querySelector('.hero__title');
  hero.addEventListener('mousemove',(e)=>{const r=hero.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5; title.style.transform=`translate3d(${x*10}px,${y*10}px,0)`;});
  hero.addEventListener('mouseleave',()=>{title.style.transform='translate3d(0,0,0)'});
})();

// Stats animation
(function(){
  document.querySelectorAll('.stat').forEach(el=>{
    const target=parseInt(el.dataset.count||'0',10); const numEl=el.querySelector('.stat__num');
    const io=new IntersectionObserver(([entry])=>{ if(!entry.isIntersecting) return; const start=performance.now(); const dur=1200; function tick(t){ const p=Math.min(1,(t-start)/dur); numEl.textContent = Math.floor(target*p)+(el.dataset.count==='98'?'%':''); if(p<1) requestAnimationFrame(tick);} requestAnimationFrame(tick); io.disconnect(); },{threshold:.4});
    io.observe(el);
  });
})();

// Testimonials slider with Google reviews + arrows
(function(){
  const wrap=document.getElementById('reviews-slider'); if(!wrap) return; const track=wrap.querySelector('.slider__track'); let i=0; let data=[]; let timer=null;
  function render(){track.innerHTML=data.map(rv=>`<div class='review'><div class='review__card'><div class='review__head'>${rv.profile?`<img class='review__avatar' src='${rv.profile}' alt='${rv.author}'>`:`<div class='review__avatar'></div>`}<div><div class='review__name'>${rv.author}</div><div class='review__time'>${rv.time||'Google Review'}</div></div></div><div class='review__text'>“${rv.text}”</div><div class='stars'>${'★'.repeat(Math.round(rv.rating||5))}${'☆'.repeat(5-Math.round(rv.rating||5))}</div></div></div>`).join('');}
  function go(n){if(!data.length)return; i=(n+data.length)%data.length; track.style.transform=`translateX(-${i*100}%)`;}
  function play(){stop(); timer=setInterval(()=>go(i+1),3500);} function stop(){if(timer)clearInterval(timer);}
  function fallback(){data=[{author:'Aarav Shah',rating:5,text:'Phenomenal team. Speed, UX and SEO nailed.'},{author:'Riya Kapoor',rating:5,text:'Launch-ready assets and app. Highly recommended.'},{author:'Vikram Mehta',rating:5,text:'World-class craft from Mumbai.'}]; render(); play();}
  fetch('/api/reviews').then(r=>r.json()).then(d=>{data=(d.reviews||[]).slice(0,6); if(!data.length){fallback();return;} render(); play();}).catch(fallback);
  const prevBtn=wrap.querySelector('.slider__prev');
  const nextBtn=wrap.querySelector('.slider__next');
  prevBtn.addEventListener('click',()=>{stop(); go(i-1); play();});
  nextBtn.addEventListener('click',()=>{stop(); go(i+1); play();});
  // Pause on hover for better control
  wrap.addEventListener('mouseenter',stop);
  wrap.addEventListener('mouseleave',play);
  // Keyboard support
  wrap.setAttribute('tabindex','0');
  wrap.addEventListener('keydown',(e)=>{if(e.key==='ArrowLeft'){stop(); go(i-1); play();} if(e.key==='ArrowRight'){stop(); go(i+1); play();}});
})();

// Enhance portfolio measurement to ensure visibility
(function(){
  const section=document.querySelector('[data-hscroll]'); if(!section) return; const track=document.getElementById('portfolio-track');
  function afterImages(cb){const imgs=[...track.querySelectorAll('img')]; if(!imgs.length){cb();return;} let loaded=0; imgs.forEach(img=>{if(img.complete){if(++loaded===imgs.length)cb();} else {img.addEventListener('load',()=>{if(++loaded===imgs.length)cb();});}});}
  const measureAndScroll=()=>{const evt=new Event('resize'); dispatchEvent(evt); const evt2=new Event('scroll'); dispatchEvent(evt2);};
  afterImages(measureAndScroll);
})();

// Extra interactivity: brand 3D hover & ripple on buttons
(function(){
  const brand=document.querySelector('.brand'); if(brand){brand.addEventListener('mousemove',(e)=>{const r=brand.getBoundingClientRect();const x=e.clientX-r.left;const y=e.clientY-r.top;brand.style.transform=`perspective(800px) rotateX(${((y-r.height/2)/r.height)*-6}deg) rotateY(${((x-r.width/2)/r.width)*6}deg)`;}); brand.addEventListener('mouseleave',()=>brand.style.transform='perspective(800px) rotateX(0) rotateY(0)');}
  document.querySelectorAll('.btn').forEach(btn=>{btn.addEventListener('click',function(e){const r=this.getBoundingClientRect();const ripple=document.createElement('span');ripple.style.position='absolute';ripple.style.left=(e.clientX-r.left)+'px';ripple.style.top=(e.clientY-r.top)+'px';ripple.style.width=ripple.style.height='12px';ripple.style.borderRadius='999px';ripple.style.transform='translate(-50%,-50%)';ripple.style.background='rgba(255,255,255,.6)';ripple.style.boxShadow='0 0 40px rgba(255,255,255,.6)';ripple.style.pointerEvents='none';this.style.position='relative';this.appendChild(ripple);setTimeout(()=>ripple.remove(),450);});});
})();

// Contact form: Django-compatible (POST) with optional AJAX enhancement
(function(){
  const form=document.getElementById('contact-form'); const toast=document.getElementById('toast'); if(!form) return;
  form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const fd=new FormData(form); // Send to Django if action is set, else AJAX to /api/contact (not implemented here)
    try{ const action=form.getAttribute('action'); if(action){ await fetch(action,{method:'POST',body:fd}); }
    $.ajax({
        url: '/contact/submit/',
        type: 'POST',
        data: {
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            'name': $('input[name="name"]').val(),
            'email': $('input[name="email"]').val(),
            'service': $('select[name="service"]').val(),
            'message': $('textarea[name="message"]').val()
             // Get from hidden input
        },
        dataType: 'json',
        success: function(data) {
            console.log(data);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
     showToast("Message sent! We'll get back within 24h."); form.reset(); }
    catch(err){ showToast('Failed to send. Please try again.'); }
  });
  function showToast(msg){ toast.textContent=msg; toast.classList.add('is-visible'); setTimeout(()=>toast.classList.remove('is-visible'),2000); }
})();

// Footer year
document.getElementById('copy-year').textContent=new Date().getFullYear();

// Mobile nav toggle
(function(){
  const header=document.querySelector('.nav');
  const btn=document.getElementById('menu-toggle');
  const menu=document.getElementById('primary-nav');
  if(!header||!btn||!menu) return;
  function close(){ header.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); }
  btn.addEventListener('click',()=>{ const open=!header.classList.contains('is-open'); header.classList.toggle('is-open',open); btn.setAttribute('aria-expanded', String(open)); });
  menu.addEventListener('click',e=>{ if(e.target.tagName==='A'||e.target.closest('a')) close(); });
  addEventListener('resize',()=>{ if(innerWidth>860) close(); });
})();
(function(){
  const section = document.getElementById('team');
  if (!section) return;

  const deck = section.querySelector('.deck');
  if (!deck) return;

  const cards = [...deck.querySelectorAll('.card')];
  const n = cards.length;
  if (!n) return;

  const clamp = (v,min,max) => Math.max(min, Math.min(max, v));
  const base = (i) => {
    const dz = -i * 60;
    const dy = i * 12;
    const rz = (i % 2 ? -2 : 2);
    return `translate3d(0,${dy}px,${dz}px) rotateZ(${rz}deg)`;
  };

  let vh = innerHeight, sh = 0;

  function layout() {
    vh = innerHeight;

    // prepare cards
    cards.forEach((c,i) => {
      c.style.willChange = 'transform,opacity,filter';
      c.style.zIndex = String(n - i);
      c.style.transformOrigin = '50% 60%';
      c.style.transform = base(i);
      c.style.opacity = '1';
      c.style.filter = 'none';
    });

    // total scroll length = enough to flip all cards
    const interval = vh * 1; // scroll space per card
    const virtual = (n - 1) * interval;
    sh = vh + virtual;

    // make section tall enough
    section.style.minHeight = sh + "px";

    onScroll();
  }

  function render(p) {
    for (let i = 0; i < n; i++) {
      const local = clamp(p - i, 0, 1);
      const lift = 1 - clamp(Math.abs(p - i), 0, 1);
      const ty = -120 * local;
      const rx = 80 * local;
      const tz = 110 * local;
      const sc = 1 + lift * 0.02;
      const blur = local * 0.8;

      cards[i].style.transform =
        `${base(i)} translateY(${ty}px) rotateX(${rx}deg) translateZ(${tz}px) scale(${sc})`;
      cards[i].style.opacity = (1 - local).toFixed(3);
      cards[i].style.filter = `blur(${blur}px)`;
    }
  }

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const scrolled = clamp(-rect.top, 0, sh - vh);
    const ratio = (sh - vh ? scrolled / (sh - vh) : 0);

    // map scroll to card index progression
    const p = ratio * ((n - 1) - 1e-4);

    render(p);
  }

  addEventListener('resize', layout);
  addEventListener('scroll', onScroll, { passive: true });
  layout();
})();
