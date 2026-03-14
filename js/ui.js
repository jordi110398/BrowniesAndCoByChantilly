/* ═══════════════════════════════════════════
   Brownies&Co — js/ui.js
   Interaccions generals de la interfície
   ═══════════════════════════════════════════ */

// ── Toast notification ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Navbar: ombra en scroll ──
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Menú hamburguesa (mòbil) ──
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const btn   = document.getElementById('hamburger');
  if (!links || !btn) return;
  const isOpen = links.classList.toggle('open');
  btn.classList.toggle('active', isOpen);
  // Animació les tres barres → X
  const spans = btn.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
}

// Tancar menú mòbil en clicar un link
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      const links = document.getElementById('navLinks');
      const btn   = document.getElementById('hamburger');
      if (links?.classList.contains('open')) toggleMenu();
    });
  });

  // Inicialitzar resum
  updateSummary();
  updateCartUI();

  // Animació d'aparició en scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.brownie-card, .step-card, .pillar, .stat, .nos-text').forEach(el => {
    el.classList.add('fade-observe');
    observer.observe(el);
  });
});

// ── Tancar modals amb Escape ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const cartOpen  = document.getElementById('cartPanel')?.classList.contains('open');
    const modalOpen = document.getElementById('modalOverlay')?.classList.contains('open');
    if (modalOpen) closeCheckout();
    else if (cartOpen) closeCart();
  }
});

// ── CSS per a animació d'aparició ──
const style = document.createElement('style');
style.textContent = `
  .fade-observe {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .fade-observe.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
