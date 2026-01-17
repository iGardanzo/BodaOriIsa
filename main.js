const target = new Date('2026-04-11T00:00:00');

function pad(n) { return n.toString().padStart(2, '0') }

function tick() {
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) return;

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  document.getElementById('d').textContent = pad(d);
  document.getElementById('h').textContent = pad(h);
  document.getElementById('m').textContent = pad(m);
  document.getElementById('s').textContent = pad(s);
}

tick();
setInterval(tick, 1000);

(function () {
  const MAX_GUESTS = 5;

  const countEl = document.querySelector('.guests__count');
  const namesWrap = document.querySelector('.guests__names');
  const section = document.querySelector('.guests');
  const labelInvitados = document.querySelector('.guests__title');

  if (!countEl || !namesWrap || !section) return;

  const params = new URLSearchParams(window.location.search);
  const rawGuests = params.get('guests');

  // Si no hay invitados por query â†’ ocultamos la secciÃ³n completa
  if (!rawGuests) {
    section.style.display = 'none';
    return;
  }

  // Parsear invitados
  const guests = rawGuests
    .split('|')
    .map(g => decodeURIComponent(g).trim())
    .filter(Boolean)
    .slice(0, MAX_GUESTS);

  if (guests.length === 0) {
    section.style.display = 'none';
    return;
  }
  if (guests.length === 1) {
    labelInvitados.textContent = 'INVITADO';
  }
  if (guests.length > 1) {
    labelInvitados.textContent = 'INVITADOS';
  }

  // Actualizar cantidad
  countEl.textContent = guests.length;

  // Limpiar nombres existentes
  namesWrap.innerHTML = '';

  // Renderizar nombres
  guests.forEach(name => {
    const pill = document.createElement('div');
    pill.className = 'guest-pill';
    pill.textContent = name;
    namesWrap.appendChild(pill);
  });

})();

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  const getModals = () => [...document.querySelectorAll('.modal')];
  const bgAudio = document.getElementById('bg-audio');
  const audioToggle = document.getElementById('audioToggle');
  let isPlaying = true;

    const tryPlayAudio = () => {
    if (!bgAudio) return;
    const play = bgAudio.play();
    if (play && play.catch) play.catch(() => {});
    isPlaying = !bgAudio.paused;
  };

  const syncAudioToggle = () => {
    if (!audioToggle) return;
    const playing = bgAudio && !bgAudio.paused;
    audioToggle.classList.toggle('is-playing', playing);
    audioToggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
    audioToggle.setAttribute('title', playing ? 'Pausar' : 'Reproducir');
  };

  // Intenta reproducir al cargar y fuerza con la primera interacción (políticas de autoplay)
  tryPlayAudio();
  syncAudioToggle();
  ['click', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, () => {
      if (bgAudio && bgAudio.paused) {
        tryPlayAudio();
        syncAudioToggle();
      }
    }, { once: true });
  });

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (!bgAudio) return;
      if (bgAudio.paused) {
        tryPlayAudio();
      } else {
        bgAudio.pause();
      }
      syncAudioToggle();
    });
  }
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-open'));

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => modal.classList.add('is-open'));

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove('is-open');

    setTimeout(() => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');

      const anyOpen = [...document.querySelectorAll('.modal')].some(m => !m.hidden);
      if (!anyOpen) {
        overlay.classList.remove('is-open');
        setTimeout(() => {
          overlay.hidden = true;
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
        }, 220);
      }
    }, 220);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-modal]');
    if (btn) {
      e.preventDefault();
      openModal(btn.getAttribute('data-modal'));
      return;
    }

    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) {
      closeModal(e.target.closest('.modal'));
      return;
    }

    // click fuera del panel
    const modalBg = e.target.classList.contains('modal') ? e.target : null;
    if (modalBg) closeModal(modalBg);
  });

  if (audioToggle) {
    audioToggle.classList.add('is-play');
    audioToggle.setAttribute('aria-label', 'Pausar música');
    audioToggle.setAttribute('title', 'Pausar');
    audioToggle.addEventListener('click', () => {
      if (!bgAudio) return;
      if (bgAudio.paused) {
        tryPlayAudio();
        audioToggle.classList.add('is-play');
        audioToggle.setAttribute('aria-label', 'Pausar música');
        audioToggle.setAttribute('title', 'Pausar');
      } else {
        bgAudio.pause();
        audioToggle.classList.remove('is-play');
        audioToggle.setAttribute('aria-label', 'Reproducir música');
        audioToggle.setAttribute('title', 'Reproducir');
      }
    });
  }

  overlay.addEventListener('click', () => {
    const openEl = getModals().find(m => !m.hidden);
    if (openEl) closeModal(openEl);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openEl = getModals().find(m => !m.hidden);
      if (openEl) closeModal(openEl);
    }
  });

});


// Helper: convertir URL de Google Forms a EMBED correcto
// Uso: const embed = toGoogleFormsEmbed("https://docs.google.com/forms/d/e/XXXX/viewform?usp=sharing");
function toGoogleFormsEmbed(url) {
  try {
    const u = new URL(url);
    // embed suele ser: /forms/d/e/<id>/viewform?embedded=true
    if (u.pathname.includes('/forms/d/e/')) {
      return `${u.origin}${u.pathname.replace('/viewform', '/viewform')}?embedded=true`;
    }
    return url; // fallback
  } catch {
    return url;
  }
}

/* =======================
   Carrusel auto + loop (sin librerÃ­as)
   - loop real: al llegar al final vuelve al inicio
   - respeta prefers-reduced-motion
======================= */
(() => {
  const viewport = document.querySelector('[data-gallery-viewport]');
  const track = document.querySelector('[data-gallery-track]');
  const dotsWrap = document.querySelector('[data-gallery-dots]');
  const btnPrev = document.querySelector('[data-gallery-prev]');
  const btnNext = document.querySelector('[data-gallery-next]');
  if (!viewport || !track || !dotsWrap) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const slides = Array.from(track.children);
  const gapPx = () => {
    const cs = getComputedStyle(track);
    const g = cs.columnGap || cs.gap || "0px";
    return parseFloat(g) || 0;
  };

  let index = 0;
  let timer = null;

  function slidesPerView() {
    // depende del flex-basis por breakpoint
    const w = viewport.getBoundingClientRect().width;
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function maxIndex() {
    // Ãºltimo index que aÃºn muestra una "pÃ¡gina" completa
    return Math.max(0, slides.length - slidesPerView());
  }

  function slideWidth() {
    // ancho real de un slide (incluye gap)
    const el = slides[0];
    if (!el) return 0;
    const w = el.getBoundingClientRect().width;
    return w + gapPx();
  }

  function setActiveDot() {
    const dots = Array.from(dotsWrap.querySelectorAll('.gallery__dot'));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function renderDots() {
    dotsWrap.innerHTML = '';
    // dots = cantidad de "pÃ¡ginas" posibles
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gallery__dot' + (i === 0 ? ' is-active' : '');
      b.setAttribute('aria-label', `Ir a la foto ${i + 1}`);
      b.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(b);
    }
  }

  function applyTransform(animate) {
    if (!animate || prefersReduced) {
      track.style.transition = 'none';
      requestAnimationFrame(() => {
        track.style.transform = `translate3d(${-(index * slideWidth())}px,0,0)`;
        // re-habilitar transiciÃ³n
        requestAnimationFrame(() => {
          track.style.transition = 'transform 480ms ease';
        });
      });
      return;
    }
    track.style.transform = `translate3d(${-(index * slideWidth())}px,0,0)`;
  }

  function goTo(nextIndex, animate = false) {
    index = Math.min(Math.max(0, nextIndex), maxIndex());
    applyTransform(animate);
    setActiveDot();
  }

  function next() {
    if (index >= maxIndex()) {
      // loop al inicio
      goTo(0, true);
    } else {
      goTo(index + 1, true);
    }
  }

  function prev() {
    if (index <= 0) {
      // loop al final
      goTo(maxIndex(), true);
    } else {
      goTo(index - 1, true);
    }
  }

  function startAuto() {
    if (prefersReduced) return;
    stopAuto();
    timer = setInterval(next, 3200); // velocidad del auto-slide
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Eventos
  btnNext?.addEventListener('click', () => { next(); startAuto(); });
  btnPrev?.addEventListener('click', () => { prev(); startAuto(); });

  // Pausar al hover (desktop) / al tocar (mobile)
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);
  viewport.addEventListener('touchstart', stopAuto, { passive: true });
  viewport.addEventListener('touchend', startAuto, { passive: true });

  // Recalcular en resize
  window.addEventListener('resize', () => {
    renderDots();
    goTo(Math.min(index, maxIndex()), false);
  });

  // Init
  renderDots();
  goTo(0, false);
  startAuto();
})();

document.querySelectorAll('.anim-adorno-titulo svg .linea path').forEach(p => {
  const len = p.getTotalLength();
  p.style.strokeDasharray = `${len}`;
  p.style.strokeDashoffset = `${len}`;
});




