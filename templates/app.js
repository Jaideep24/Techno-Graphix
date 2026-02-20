// Theme toggle (persisted)
(function(){
  const btn=document.getElementById('theme-toggle');
  const root=document.documentElement;
  const stored=localStorage.getItem('theme');
  if(stored==='dark'||(!stored&&window.matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('dark');
  btn.addEventListener('click',()=>{root.classList.toggle('dark');localStorage.setItem('theme',root.classList.contains('dark')?'dark':'light');});
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
  function measure(){state.vw=innerWidth;state.vh=innerHeight;state.tw=track.scrollWidth*1.03;const extra=Math.max(0,state.tw-state.vw);section.style.minHeight=(state.vh+extra)+"px";}
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
  function render(){track.innerHTML=data.map((rv,idx)=>`<div class='review' data-index='${idx}'><div class='review__card'><div class='review__head'>${rv.profile?`<img class='review__avatar' src='${rv.profile}' alt='${rv.author}'>`:`<div class='review__avatar'></div>`}<div><div class='review__name'>${rv.author}</div><div class='review__time'>${rv.time||'Google Review'}</div></div></div><div class='review__text'>"${rv.text}"</div><div class='stars'>${'★'.repeat(Math.round(rv.rating||5))}${'☆'.repeat(5-Math.round(rv.rating||5))}</div></div></div>`).join(''); updateOpacity();}
  function updateOpacity(){const reviews=track.querySelectorAll('.review'); reviews.forEach((review,idx)=>{const card=review.querySelector('.review__card'); if(idx===i){card.style.opacity='1'; card.style.transform='scale(1)'; card.style.transition='opacity 0.3s ease, transform 0.3s ease';} else {card.style.opacity='0'; card.style.transform='scale(0.95)'; card.style.transition='opacity 0.3s ease, transform 0.3s ease';}});}
  function go(n){if(!data.length)return; i=(n+data.length)%data.length; track.style.transform=`translateX(-${i*100}%)`; updateOpacity();}
  function play(){stop(); timer=setInterval(()=>go(i+1),3500);} function stop(){if(timer)clearInterval(timer);}
  function fallback(){data=[{author:'Aarav Shah',rating:5,text:'Phenomenal team. Speed, UX and SEO nailed.'},{author:'Riya Kapoor',rating:5,text:'Launch-ready assets and app. Highly recommended.'},{author:'Vikram Mehta',rating:5,text:'World-class craft from Mumbai.'}]; render(); play();}
  fallback();
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
  const submitBtn=form.querySelector('button[type="submit"]');

  function setLoading(on){
    if(!submitBtn) return;
    submitBtn.classList.toggle('btn--loading', on);
    submitBtn.disabled = on;
  }

  // Inject SVG tick, animate it, then restore button after delay
  function showSuccess(){
    if(!submitBtn) return;
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('class','btn__tick');
    svg.setAttribute('width','22'); svg.setAttribute('height','22');
    svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none');

    // Polyline: set stroke-dasharray/offset as PRESENTATION ATTRIBUTES so
    // the browser paints the invisible initial state before the animation fires.
    const poly=document.createElementNS(ns,'polyline');
    poly.setAttribute('class','tick-check');
    poly.setAttribute('points','4,13 9,18 20,7');
    poly.setAttribute('stroke','white'); poly.setAttribute('stroke-width','2.5');
    poly.setAttribute('stroke-linecap','round'); poly.setAttribute('stroke-linejoin','round');
    poly.setAttribute('stroke-dasharray','23');  // initial = invisible
    poly.setAttribute('stroke-dashoffset','23');

    const circle=document.createElementNS(ns,'circle');
    circle.setAttribute('class','tick-circle');
    circle.setAttribute('cx','12'); circle.setAttribute('cy','12'); circle.setAttribute('r','10');
    circle.setAttribute('stroke','white'); circle.setAttribute('stroke-width','2');
    circle.setAttribute('stroke-linecap','round'); circle.setAttribute('fill','none');
    circle.setAttribute('stroke-dasharray','63');  // 2π×10 ≈ 62.8
    circle.setAttribute('stroke-dashoffset','63');

    svg.appendChild(poly); svg.appendChild(circle);
    submitBtn.appendChild(svg);
    submitBtn.disabled = true;

    // rAF: let browser commit the painted dash-invisible state first,
    // THEN add the class that triggers the CSS keyframe animations.
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        submitBtn.classList.add('btn--success');
      });
    });

    setTimeout(()=>{
      submitBtn.classList.remove('btn--success');
      submitBtn.disabled = false;
      svg.remove();
    }, 2400);
  }

  form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    setLoading(true);
    let success=false;
    try{
      const response = await fetch('/contact/submit/', {
        method: 'POST',
        body: new FormData(form),
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        credentials: 'same-origin'
      });
      const data = await response.json();
      if(response.ok && data.success) {
        success=true;
        form.reset();
        showToast("Message sent! We'll get back within 24h.");
      } else {
        showToast(data.message || 'Failed to send. Please try again.');
      }
    } catch(err){ 
      console.error(err);
      showToast('Failed to send. Please try again.'); 
    } finally {
      setLoading(false);
      if(success) showSuccess();
    }
  });
  function showToast(msg){ toast.textContent=msg; toast.classList.add('is-visible'); setTimeout(()=>toast.classList.remove('is-visible'),10000); }
})();

// Footer year
const _copyYear=document.getElementById('copy-year');if(_copyYear)_copyYear.textContent=new Date().getFullYear();

// Mobile nav toggle - Hamburger Menu
(function(){
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('primary-nav');
  
  if (!hamburger || !navLinks) return;
  
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
  
  // Close menu on resize above 860px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
})();

// Team deck — pure scroll-driven card animation (same pattern as portfolio hscroll)
// No wheel hijacking, no touch prevention, no body locking.
// The section gets extra height so the user scrolls through it naturally;
// position:sticky on .container keeps the deck pinned while the section passes.
(function(){
  const section = document.getElementById('team');
  if (!section) return;
  const deck = section.querySelector('.deck');
  if (!deck) return;
  const cards = [...deck.querySelectorAll('.card')];
  const n = cards.length;
  if (n === 0) return;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const ease   = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2;

  const SCROLL_PER_CARD = 300;

  // ── Fan position driven by fractional rank ─────────────────────────────────
  // rank 0 = front card: perfectly straight, no offset
  // rank 1 = one behind: slight lean and shift
  // rank n = furthest back: most pronounced lean
  // Each card's rank = max(0, i - progress), which smoothly decreases as the
  // cards in front of it get dealt away, causing it to gradually straighten.
  function fanAt(rank, side) {
    return {
      dx:  side * rank * 18,
      dy:  rank * 16,
      dz: -rank * 44,
      rz:  side * rank * 3.0,  // 3° per rank level; rank-0 = 0° (straight)
    };
  }

  // ── Stable non-transform card properties ───────────────────────────────────
  function initCards() {
    cards.forEach((c, i) => {
      c.style.willChange    = 'transform';
      c.style.zIndex        = String(n - i);
      c.style.opacity       = '1';
      c.style.filter        = 'none';
      c.style.pointerEvents = 'auto';
    });
  }

  // ── Render every card for the given scroll progress (0 → n-1) ──────────────
  function renderCards(progress) {
    const txMax = Math.min(72, window.innerWidth * 0.12);

    for (let i = 0; i < n; i++) {
      const p_raw = clamp(progress - i, 0, 1);
      const p     = ease(p_raw);
      const side  = i % 2 === 0 ? 1 : -1;

      // ── Waiting cards: render at dynamic rank-based fan position ────────────
      if (p_raw === 0) {
        // rank smoothly shrinks as the card in front deals away:
        //   e.g. card 2 at progress=0.7 → rank = 2 - 0.7 = 1.3 (lean decreasing)
        const rank = i - progress;            // always ≥ 0 when p_raw === 0
        const { dx, dy, dz, rz } = fanAt(rank, side);
        cards[i].style.zIndex       = String(n - i);
        cards[i].style.opacity      = '1';
        cards[i].style.filter       = 'none';
        cards[i].style.pointerEvents = 'auto';
        cards[i].style.transform    = `translate3d(${dx}px,${dy}px,${dz}px) rotateZ(${rz}deg)`;
        continue;
      }

      // ── Animating card: starts from rank-0 (straight, no offset) ───────────
      // Phase 1 (p 0→0.5): throw upward / outward
      // Phase 2 (p 0.5→1): arc back down and slip behind the last card
      const phase1 = Math.min(p * 2, 1);
      const phase2 = Math.max((p - 0.5) * 2, 0);

      // Arc peak (absolute, since base is always 0,0,0 for animating card)
      const pk_tx =  side * txMax;
      const pk_ty = -300;
      const pk_tz =  140;
      const pk_rx =  72;
      const pk_ry =  side * 20;

      // Behind-stack rest: target fanAt(n, side) so the card settles into the
      // same tilted/offset shape as every other waiting card at the back.
      // This keeps the whole deck visually consistent as animation proceeds.
      const bk = fanAt(n, side); // dx = side*n*18, dy = n*16, dz = -n*44, rz = side*n*3°

      let tx, ty, tz, rx, ry, finalRz, scale;

      if (phase2 === 0) {
        // Phase 1 — throw: card leaves from straight-upright front position
        tx      = pk_tx * phase1;
        ty      = pk_ty * phase1;
        tz      = pk_tz * phase1;
        rx      = pk_rx * phase1;
        ry      = pk_ry * phase1;
        finalRz = 0;
        scale   = 1 + 0.04 * phase1;
      } else {
        // Phase 2 — settle: arc from peak into the fanned back position
        tx      = pk_tx  + (bk.dx  - pk_tx)  * phase2;  // drifts to fan x offset
        ty      = pk_ty  + (bk.dy  - pk_ty)  * phase2;
        tz      = pk_tz  + (bk.dz  - pk_tz)  * phase2;
        rx      = pk_rx  * (1 - phase2);                 // tilt flattens
        ry      = pk_ry  * (1 - phase2);
        finalRz = bk.rz  * phase2;                       // rotates into fan angle
        scale   = 1.04   - 0.04 * phase2;                // barely any shrink
      }

      // z-index drops to -1 the instant phase 2 begins
      cards[i].style.zIndex        = p_raw > 0.5 ? '-1' : String(n - i);
      cards[i].style.opacity       = '1';                // never transparent
      cards[i].style.filter        = 'none';
      cards[i].style.pointerEvents = p_raw > 0.5 ? 'none' : 'auto';
      cards[i].style.transform     = [
        `translate3d(${tx}px,${ty}px,${tz}px)`,
        `rotateX(${rx}deg)`,
        `rotateY(${ry}deg)`,
        `rotateZ(${finalRz}deg)`,
        `scale(${scale})`
      ].join(' ');
    }
  }

  // ── Section height: only n-1 cards animate; last card stays as base ────────
  function measure() {
    section.style.minHeight = (window.innerHeight + (n - 1) * SCROLL_PER_CARD) + 'px';
  }

  // ── Passive scroll handler ─────────────────────────────────────────────────
  // On desktop a 200 px lead-in ensures the deck is fully visible in the
  // sticky pin before the first card starts dealing. On mobile it's 0.
  function onScroll() {
    const rect = section.getBoundingClientRect();
    const scrollRange = rect.height - window.innerHeight;
    if (scrollRange <= 0) return;
    const leadIn = window.innerWidth >= 861 ? 200 : 0;
    const raw = (-rect.top - leadIn) / Math.max(scrollRange - leadIn, 1);
    renderCards(clamp(raw, 0, 1) * (n - 1));
  }

  measure();
  initCards();
  onScroll();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); onScroll(); });
})();

