// ============================================================
// YASH MITTAL — PORTFOLIO JS
// Nav state, mobile menu, scroll-reveal, MindForge gallery, lightbox
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

  if (burger && mobileMenu) {
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
  }

  // ── SCROLL REVEAL ──
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const revealVisible = () => {
    const thresholdY = window.innerHeight + 80;
    revealEls.forEach(el => {
      if (el.classList.contains('is-visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= thresholdY) {
        el.classList.add('is-visible');
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '80px 0px 80px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  window.addEventListener('scroll', revealVisible, { passive: true });
  window.addEventListener('resize', revealVisible, { passive: true });
  revealVisible();

  // ── MINDFORGE SCREENSHOT GALLERY ──
  const mfSlides = [
    {
      src: 'assets/mindforge-dashboard.png',
      alt: 'MindForge Dashboard showing notes, vault documents, and pending topic reviews',
      route: 'mindtensei.me/dashboard',
      title: 'MindForge — Dashboard & Knowledge Vault',
      caption: 'Unified vault overview with decaying-topic review alerts, notes & ingested documents.'
    },
    {
      src: 'assets/mindforge-chat.jpg',
      alt: 'MindForge AI Chat answering React hook questions with inline source citations',
      route: 'mindtensei.me/chat',
      title: 'MindForge — Source-Cited RAG Chat',
      caption: 'Conversation-aware RAG chat grounded in vault notes with inline [Source] citations.'
    },
    {
      src: 'assets/mindforge-topics.png',
      alt: 'MindForge Your Knowledge Map showing topic mastery percentages and review queues',
      route: 'mindtensei.me/topics',
      title: 'MindForge — Active Learning & SM-2 Knowledge Map',
      caption: 'Extracted topics tracked with mastery progress bars and SM-2 spaced-repetition queues.'
    },
    {
      src: 'assets/mindforge-graph.png',
      alt: 'MindForge interactive Knowledge Graph built with react-force-graph-2d and mastery inspector',
      route: 'mindtensei.me/graph',
      title: 'MindForge — Prerequisite Knowledge Graph & Gap Analysis',
      caption: 'Force-directed prerequisite graph (react-force-graph-2d) with backward BFS gap analysis.'
    }
  ];

  let activeSlide = 0;
  const mainImg = document.getElementById('mfMainImg');
  const routeEl = document.getElementById('mfRoute');
  const captionEl = document.getElementById('mfCaption');
  const tabs = document.querySelectorAll('.mf-tab');
  const thumbs = document.querySelectorAll('.mf-thumb');
  const linkedPillars = document.querySelectorAll('.mf-pillar[data-slide]');

  const setSlide = (idx) => {
    const safeIdx = ((idx % mfSlides.length) + mfSlides.length) % mfSlides.length;
    activeSlide = safeIdx;
    const slide = mfSlides[safeIdx];

    if (mainImg) {
      mainImg.src = slide.src;
      mainImg.alt = slide.alt;
    }
    if (routeEl) routeEl.textContent = slide.route;
    if (captionEl) captionEl.textContent = slide.caption;

    tabs.forEach(t => {
      const match = Number(t.dataset.slide) === safeIdx;
      t.classList.toggle('is-active', match);
      t.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    thumbs.forEach(th => {
      th.classList.toggle('is-active', Number(th.dataset.slide) === safeIdx);
    });

    linkedPillars.forEach(p => {
      p.classList.toggle('is-active', Number(p.dataset.slide) === safeIdx);
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => setSlide(Number(tab.dataset.slide)));
  });

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => setSlide(Number(thumb.dataset.slide)));
  });

  linkedPillars.forEach(pillar => {
    pillar.addEventListener('click', () => setSlide(Number(pillar.dataset.slide)));
    pillar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSlide(Number(pillar.dataset.slide));
      }
    });
  });

  // ── LIGHTBOX MODAL ──
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbSub = document.getElementById('lightboxSub');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  const mfZoomTrigger = document.getElementById('mfZoomTrigger');
  const cpZoomTriggers = document.querySelectorAll('.cp-zoom-trigger');

  let lightboxMode = 'mindforge';
  let lightboxIndex = 0;

  const renderLightbox = () => {
    if (!lightbox) return;
    if (lightboxMode === 'mindforge') {
      const slide = mfSlides[lightboxIndex];
      lbImg.src = slide.src;
      lbImg.alt = slide.alt;
      lbTitle.textContent = slide.title;
      lbSub.textContent = `${slide.route} — ${slide.caption}`;
      lbPrev?.classList.remove('is-hidden');
      lbNext?.classList.remove('is-hidden');
    }
  };

  const openMindForgeLightbox = (idx) => {
    lightboxMode = 'mindforge';
    lightboxIndex = idx;
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const openSingleLightbox = (src, title, sub) => {
    lightboxMode = 'single';
    lbImg.src = src;
    lbImg.alt = title;
    lbTitle.textContent = title;
    lbSub.textContent = sub;
    lbPrev?.classList.add('is-hidden');
    lbNext?.classList.add('is-hidden');
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (mfZoomTrigger) {
    mfZoomTrigger.addEventListener('click', () => openMindForgeLightbox(activeSlide));
  }

  cpZoomTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      openSingleLightbox(
        btn.dataset.lightboxSrc,
        btn.dataset.lightboxTitle,
        btn.dataset.lightboxSub
      );
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => {
    if (lightboxMode !== 'mindforge') return;
    lightboxIndex = (lightboxIndex - 1 + mfSlides.length) % mfSlides.length;
    setSlide(lightboxIndex);
    renderLightbox();
  });
  lbNext?.addEventListener('click', () => {
    if (lightboxMode !== 'mindforge') return;
    lightboxIndex = (lightboxIndex + 1) % mfSlides.length;
    setSlide(lightboxIndex);
    renderLightbox();
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (lightboxMode === 'mindforge') {
      if (e.key === 'ArrowLeft') lbPrev?.click();
      if (e.key === 'ArrowRight') lbNext?.click();
    }
  });
});
