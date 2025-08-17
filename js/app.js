// Partículas
(() => {
  const c = document.querySelector('.particles'); if(!c) return;
  const frag = document.createDocumentFragment();
  for(let i=0;i<60;i++){
    const s=document.createElement('span'); const size=1+Math.random()*3;
    s.style.cssText=`position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(255,255,255,${.15+Math.random()*.2});top:${Math.random()*100}%;left:${Math.random()*100}%;animation:drift ${8+Math.random()*12}s ease-in-out ${Math.random()*3}s infinite alternate;box-shadow:0 0 ${6+size*3}px rgba(255,255,255,.25);`;
    frag.appendChild(s);
  }
  c.appendChild(frag);
  const sty=document.createElement('style'); sty.textContent='@keyframes drift{0%{transform:translateY(0)}100%{transform:translateY(-20px)}}'; document.head.appendChild(sty);
})();

// Tilt 3D
(() => {
  const cards=document.querySelectorAll('[data-tilt]'); const B=12;
  cards.forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect(), px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
      const rx=(py-.5)*-B, ry=(px-.5)*B; card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave',()=> card.style.transform='perspective(900px) rotateX(0) rotateY(0)');
  });
})();

// Progress bars on view
(() => {
  const bars=document.querySelectorAll('.fill'); const io=new IntersectionObserver(ents=>{
    ents.forEach(e=>{ if(e.isIntersecting){ e.target.style.width=(e.target.dataset.p||'90')+'%'; io.unobserve(e.target) }});
  },{threshold:.4});
  bars.forEach(b=>io.observe(b));
})();

// Parallax
(() => {
  const els=document.querySelectorAll('[data-parallax]'); const on=()=>{ const y=window.scrollY; els.forEach(el=>{ const s=Number(el.dataset.parallax||.15); el.style.transform=`translate3d(0,${y*-s}px,0)`; }); };
  window.addEventListener('scroll',on,{passive:true}); on();
})();

// Carousel básico
(() => {
  const dots=document.querySelectorAll('.dot'), slides=document.querySelectorAll('.slide');
  if(!dots.length) return; let i=0; const show=k=>{slides[i].classList.remove('active');dots[i].classList.remove('active');i=(k+slides.length)%slides.length;slides[i].classList.add('active');dots[i].classList.add('active');};
  dots.forEach(d=>d.addEventListener('click',()=>show(Number(d.dataset.i))));
  setInterval(()=>show(i+1),8000);
})();

// Countdown
(() => {
  const el=document.querySelector('.count'); if(!el) return; let s=Number(el.dataset.seconds||'86400');
  const tick=()=>{ s=Math.max(0,s-1); const h=String(Math.floor(s/3600)).padStart(2,'0'), m=String(Math.floor((s%3600)/60)).padStart(2,'0'), q=String(s%60).padStart(2,'0'); el.textContent=`${h}:${m}:${q}`; };
  setInterval(tick,1000); tick();
})();

// Live counter cosmético
(() => {
  const n=document.querySelector('.live'); if(!n) return; const base=Number(n.dataset.base||'2000');
  setInterval(()=>{ n.textContent=(base + Math.floor(Date.now()/600000)%800).toLocaleString('es-ES'); },3000);
})();

// Demo IA (usa Netlify si existe)
(() => {
  const out=document.getElementById('out'); const form=document.getElementById('ask'); const input=document.getElementById('q'); const opts=document.querySelector('.options');
  const API='/.netlify/functions/tutor';
  const presets={design:'Ruta: Canva → Tipografías → Paletas → 3 proyectos (7 días).',video:'Ruta: Atajos Premiere → Corte rítmico → Subtítulos → 3 shorts (7 días).',marketing:'Ruta: Propuesta → Hooks → Calendario 14 días → 3 anuncios A/B.'};

  opts.addEventListener('click',e=>{const b=e.target.closest('.chip'); if(!b) return; out.classList.remove('hidden'); out.textContent=presets[b.dataset.resp]||'Cuéntame más.';});

  form.addEventListener('submit',async e=>{
    e.preventDefault(); const msg=input.value.trim(); if(!msg) return; out.classList.remove('hidden'); out.textContent='Pensando…';
    try{
      const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,profile:{objetivo:'crecer como creativo'}})});
      if(r.ok){ const d=await r.json(); out.textContent=d.answer||'Sin respuesta.'; return;}
      throw new Error('No OK');
    }catch{ out.textContent=`Demo local: ${msg} → Define una meta medible (p. ej., 3 posts/semana).`; }
  });
})();
