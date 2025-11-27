/* main.js
   Slider con:
   - autoplay
   - prev/next buttons
   - indicadores (dots)
   - drag/touch para mobile
*/

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.cards-track');
  const cards = Array.from(document.querySelectorAll('.card'));
  const prevBtn = document.querySelector('.nav.prev');
  const nextBtn = document.querySelector('.nav.next');
  const dotsContainer = document.querySelector('.dots');

  if (!track || cards.length === 0) return;

  // configuración
  let index = 0;
  const gap = 20; // debe coincidir con CSS .cards-track gap
  let cardWidth = cards[0].getBoundingClientRect().width;
  let autoplayInterval = 3500;
  let autoplayTimer = null;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // crear dots
  const dots = [];
  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i=0;i<cards.length;i++){
      const btn = document.createElement('button');
      btn.dataset.idx = i;
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => { goTo(i); resetAutoplay(); });
      dotsContainer.appendChild(btn);
      dots.push(btn);
    }
  }

  createDots();

  // actualizar tamaños al redimensionar
  function recalc() {
    cardWidth = cards[0].getBoundingClientRect().width;
    moveToCurrent(false);
  }
  window.addEventListener('resize', recalc);

  // mover track
  function moveToCurrent(animate = true) {
    const offset = index * (cardWidth + gap);
    if (!animate) track.style.transition = 'none';
    else track.style.transition = '';
    track.style.transform = `translateX(${-offset}px)`;

    // activar clase active en la tarjeta centrada
    cards.forEach((c,i) => c.classList.toggle('active', i === index));
    // actualizar dots
    dots.forEach((d,i)=> d.classList.toggle('active', i === index));
  }

  // next / prev
  function next() {
    index = (index + 1) % cards.length;
    moveToCurrent();
  }
  function prev() {
    index = (index - 1 + cards.length) % cards.length;
    moveToCurrent();
  }

  // ir a índice
  function goTo(i) {
    index = Math.max(0, Math.min(i, cards.length-1));
    moveToCurrent();
  }

  // botones
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

  // autoplay
  function startAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => { next(); }, autoplayInterval);
  }
  function resetAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    startAutoplay();
  }
  startAutoplay();

  // --- Drag / Touch handling ---
  // usa pointer events si están disponibles
  const viewport = document.querySelector('.cards-viewport');

  function pointerDown(e) {
    isDragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    prevTranslate = -index * (cardWidth + gap);
    track.style.transition = 'none';
    cancelAnimationFrame(animationID);
    resetAutoplay();
  }

  function pointerMove(e) {
    if (!isDragging) return;
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
    const delta = clientX - startX;
    currentTranslate = prevTranslate + delta;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function pointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    const moved = currentTranslate - prevTranslate;
    // si se movió más de 1/4 del ancho de tarjeta cambiar slide
    if (Math.abs(moved) > (cardWidth / 4)) {
      if (moved < 0) index = Math.min(index + 1, cards.length - 1);
      else index = Math.max(index - 1, 0);
    }
    moveToCurrent();
  }

  // listeners
  viewport.addEventListener('touchstart', pointerDown, {passive:true});
  viewport.addEventListener('touchmove', pointerMove, {passive:true});
  viewport.addEventListener('touchend', pointerUp);

  viewport.addEventListener('mousedown', pointerDown);
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);

  // soporte para keyboard (left/right)
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight') { next(); resetAutoplay(); }
    if (ev.key === 'ArrowLeft') { prev(); resetAutoplay(); }
  });

  // posicion inicial
  moveToCurrent(false);
});
