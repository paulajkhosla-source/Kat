(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const revealTargets = document.querySelectorAll('.section-heading,.card-copy,.about-copy,.gallery-card,.contact>div,.contact-form,.reviews>h2,.reviews>.eyebrow,.cta>div');
  if ('IntersectionObserver' in window && !reduced.matches) {
    document.documentElement.classList.add('reveal-enabled');
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
    revealTargets.forEach((element,i)=>{element.dataset.reveal='';element.style.setProperty('--reveal-delay',`${i%3*65}ms`);observer.observe(element);});
    document.addEventListener('focusin',event=>event.target.closest('[data-reveal]')?.classList.add('is-visible'));
  }
  if(matchMedia('(hover: hover) and (pointer: fine)').matches){
    document.querySelectorAll('.treatment-card').forEach(card=>{
      card.addEventListener('pointermove',event=>{if(reduced.matches||document.documentElement.classList.contains('motion-paused'))return;const r=card.getBoundingClientRect();const x=(event.clientX-r.left)/r.width-.5;const y=(event.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1000px) rotateY(${x*9}deg) rotateX(${-y*5}deg) translateY(-8px)`;});
      card.addEventListener('pointerleave',()=>{card.style.transform='';});
    });
  }
})();
