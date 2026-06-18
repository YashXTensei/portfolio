// ============================================================
// YASH MITTAL — PORTFOLIO JS
// Nav scroll state, mobile menu, scroll-reveal, smooth scroll
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV: scrolled state ──
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE MENU ──
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('navMobile');

  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    burger.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
    });
  });

  // ── SCROLL REVEAL ──
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ── SCROLL CUE → scroll to about ──
  const scrollCue = document.getElementById('scrollCue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ── Footer year ──
  document.querySelectorAll('.footer .mono').forEach(el => {
    if (el.textContent.includes('{{YEAR}}')) {
      el.textContent = new Date().getFullYear();
    }
  });

});