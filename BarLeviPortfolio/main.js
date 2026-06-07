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
  const duration = 1200;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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
