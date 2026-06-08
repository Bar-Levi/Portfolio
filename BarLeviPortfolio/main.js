// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
});
overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  hamburger.classList.remove('open');
  overlay.classList.remove('show');
});

// ── ACTIVE NAV ON SCROLL ──
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Close sidebar on nav click (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('show');
  });
});

// ── SCROLL ANIMATIONS ──
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

// ── METRIC COUNTER ANIMATION ──
function animateCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const isFloat  = el.hasAttribute('data-float');
  const duration = 1400;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = target * eased;

    el.textContent = isFloat
      ? current.toFixed(1) + suffix
      : Math.floor(current) + suffix;

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const valueEl = entry.target.querySelector('.metric-value[data-target]');
      if (valueEl) animateCounter(valueEl);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.metric-card').forEach(card => counterObserver.observe(card));

// ── SCROLL PROGRESS BAR ──
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const docH  = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

// ── TEXT SCRAMBLE ──
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~/.-_';

function scrambleText(el) {
  const original = el.dataset.originalText || el.textContent;
  el.dataset.originalText = original;

  let frame = 0;
  const totalFrames = original.length * 3;

  function tick() {
    const progress = frame / totalFrames;
    const revealUpTo = Math.floor(progress * original.length);

    el.textContent = original
      .split('')
      .map((char, i) => {
        if (i < revealUpTo) return char;
        if (char === ' ') return ' ';
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');

    frame++;
    if (frame <= totalFrames) requestAnimationFrame(tick);
    else el.textContent = original;
  }

  requestAnimationFrame(tick);
}

const scrambleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      scrambleText(entry.target);
      scrambleObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.8 });

document.querySelectorAll('.section-label').forEach(el => scrambleObserver.observe(el));

// ── 3D CARD TILT ──
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

function addTilt(selector, strength = 8) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (isMobile()) return;
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * strength;
      const rotY =  dx * strength;

      card.style.transition = 'transform 0.08s ease, border-color 0.25s, box-shadow 0.25s';
      card.style.transform  = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease, border-color 0.25s, box-shadow 0.25s';
      card.style.transform  = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
}

addTilt('.project-card', 7);
addTilt('.metric-card', 5);
