/* ============================================================
   JOSE ASHMITHA V. — PROFESSIONAL QA PORTFOLIO JAVASCRIPT
   Version: 3.0 (Redesign) — Theme Toggle, Canvas Engine,
   Accurate Active Nav Tracking, Scroll Progress Ring & Fallbacks
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. THEME SWITCHER (Dark Navy <-> Executive Light)
     ========================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function getStoredTheme() {
    const saved = localStorage.getItem('ja_portfolio_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to system preference, fallback to dark
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches 
      ? 'light' 
      : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ja_portfolio_theme', theme);

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#f8fafc' : '#050B18');
    }

    if (themeToggle) {
      themeToggle.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
      themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }

    // Notify background canvas of theme change
    if (window.updateCanvasTheme) {
      window.updateCanvasTheme(theme);
    }
  }

  // Initialize theme
  const currentTheme = getStoredTheme();
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // Listen to OS system color scheme changes if user hasn't explicitly set preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem('ja_portfolio_theme')) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  /* ==========================================================
     2. QUANTUM NEURAL FIELD — Grand Full-Width Premium Animation
     Concept: A living neural storm that spans the entire viewport.
     Layers: deep glow blobs → animated grid → 180 drifting nodes
     → neural connections → cascading ripple waves → meteor streams
     → mouse repulsion field. Full horizontal coverage. 60fps canvas.
     ========================================================== */
  const canvas = document.getElementById('bgCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    window.updateCanvasTheme = t => { isDark = t !== 'light'; };

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildParticles();
    }, { passive: true });

    /* ================================================================
       MOUSE FIELD
    ================================================================ */
    let mouseX = W * 0.5, mouseY = H * 0.5;
    const MOUSE_RADIUS = 130;
    if (!isMobile) {
      window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }, { passive: true });
    }

    /* ================================================================
       PARTICLES — full-width scatter
    ================================================================ */
    const PARTICLE_COUNT = isMobile ? 70 : 180;
    const CONNECT_DIST   = isMobile ? 120 : 170;
    let particles = [];

    function buildParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.28,
          r:  Math.random() * 2.0 + 0.8,
          alpha: Math.random() * 0.5 + 0.3,
          pulse: Math.random() * Math.PI * 2,
          pulseSpd: 0.012 + Math.random() * 0.016,
          // Some particles are "hotspot" (brighter, bigger)
          hot: Math.random() < 0.08
        });
      }
    }
    buildParticles();

    /* ================================================================
       RIPPLE WAVES — cascading expanding rings across full width
    ================================================================ */
    const MAX_RIPPLES = 7;
    const ripples = [];

    function spawnRipple() {
      ripples.push({
        x:       Math.random() * W,
        y:       Math.random() * H * 0.85 + H * 0.07,
        radius:  0,
        maxR:    Math.random() * 260 + 180,
        alpha:   0.55,
        speed:   Math.random() * 1.1 + 0.9,
        color:   Math.random() < 0.6 ? '56,189,248' : '103,232,249'
      });
    }

    // Prime with staggered initial ripples
    for (let i = 0; i < 4; i++) {
      spawnRipple();
      ripples[i].radius = (ripples[i].maxR / 4) * i;
    }

    /* ================================================================
       METEOR STREAMS — bright lines shooting across the screen
    ================================================================ */
    const MAX_METEORS = isMobile ? 2 : 5;
    const meteors = [];

    function spawnMeteor() {
      const startY = Math.random() * H * 0.7 + H * 0.05;
      const length = Math.random() * 180 + 120;
      meteors.push({
        x:    -length,
        y:    startY,
        len:  length,
        vx:   Math.random() * 5 + 4,
        vy:   Math.random() * 1.2 - 0.6,
        alpha: Math.random() * 0.5 + 0.4,
        color: Math.random() < 0.5 ? '103,232,249' : '56,189,248'
      });
    }

    for (let i = 0; i < 2; i++) {
      spawnMeteor();
      meteors[i].x = Math.random() * W;
    }

    /* ================================================================
       LARGE AMBIENT GLOW BLOBS — full width coverage (5 blobs)
    ================================================================ */
    const blobs = [
      { px: 0.08, py: 0.35, vx: 0.00018, vy: 0.00012, r: 320, a: 0.08 },
      { px: 0.30, py: 0.65, vx: -0.00015,vy: 0.00018, r: 380, a: 0.07 },
      { px: 0.55, py: 0.25, vx: 0.00020, vy:-0.00014, r: 350, a: 0.07 },
      { px: 0.78, py: 0.70, vx:-0.00018, vy: 0.00010, r: 300, a: 0.08 },
      { px: 0.95, py: 0.40, vx: 0.00012, vy: 0.00022, r: 280, a: 0.06 }
    ];

    /* ================================================================
       GRID — subtle animated perspective grid lines (full width)
    ================================================================ */
    function drawGrid(t) {
      if (!isDark) return;
      ctx.save();
      ctx.globalAlpha = 0.028;
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 0.6;

      // Horizontal lines (gently wave)
      const hStep = 55;
      for (let y2 = 0; y2 < H + hStep; y2 += hStep) {
        const wave = Math.sin(t * 0.3 + y2 * 0.008) * 4;
        ctx.beginPath();
        ctx.moveTo(0, y2 + wave);
        ctx.lineTo(W, y2 + wave);
        ctx.stroke();
      }

      // Vertical lines (gently wave)
      const vStep = 70;
      for (let x2 = 0; x2 < W + vStep; x2 += vStep) {
        const wave = Math.sin(t * 0.25 + x2 * 0.006) * 3;
        ctx.beginPath();
        ctx.moveTo(x2 + wave, 0);
        ctx.lineTo(x2 + wave, H);
        ctx.stroke();
      }

      ctx.restore();
    }

    /* ================================================================
       RENDER LOOP
    ================================================================ */
    let time = 0;
    let lastT = performance.now();
    let rafId = null;
    let rippleTimer = 0;
    let meteorTimer  = 0;

    function render(now) {
      rafId = requestAnimationFrame(render);
      if (document.hidden) return;

      const dt = Math.min(now - lastT, 50);
      lastT = now;
      time += dt * 0.001;

      ctx.clearRect(0, 0, W, H);

      /* ---- LAYER 1: Deep background fill ---- */
      ctx.fillStyle = isDark ? '#030C1A' : '#f1f5f9';
      ctx.fillRect(0, 0, W, H);

      /* ---- LAYER 2: Ambient glow blobs (full width) ---- */
      for (const b of blobs) {
        b.px += b.vx * (dt / 16);
        b.py += b.vy * (dt / 16);
        if (b.px < 0.02 || b.px > 0.98) b.vx *= -1;
        if (b.py < 0.05 || b.py > 0.95) b.vy *= -1;
        const bx = b.px * W, by = b.py * H;
        if (isDark) {
          const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
          g.addColorStop(0, `rgba(56,189,248,${b.a})`);
          g.addColorStop(0.5, `rgba(30,120,200,${b.a * 0.4})`);
          g.addColorStop(1, 'rgba(3,12,26,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(bx, by, b.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ---- LAYER 3: Animated grid ---- */
      drawGrid(time);

      /* ---- LAYER 4: Update & draw particles ---- */
      if (!prefersReducedMotion) {
        for (const p of particles) {
          // Mouse repulsion
          if (!isMobile) {
            const dx = p.x - mouseX, dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
              const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.6;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          // Damping
          p.vx *= 0.985;
          p.vy *= 0.985;

          // Base drift speed restore
          if (Math.abs(p.vx) < 0.05) p.vx += (Math.random() - 0.5) * 0.06;
          if (Math.abs(p.vy) < 0.03) p.vy += (Math.random() - 0.5) * 0.04;

          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);

          // Wrap around edges (full-width seamless)
          if (p.x < -10)  p.x = W + 10;
          if (p.x > W + 10) p.x = -10;
          if (p.y < -10)  p.y = H + 10;
          if (p.y > H + 10) p.y = -10;

          p.pulse += p.pulseSpd;
        }
      }

      /* ---- LAYER 5: Neural connections ---- */
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x, dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = isDark
              ? (1 - dist / CONNECT_DIST) * 0.28
              : (1 - dist / CONNECT_DIST) * 0.10;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            // Gradient line from cyan to blue
            const grad = ctx.createLinearGradient(pi.x, pi.y, pj.x, pj.y);
            grad.addColorStop(0, `rgba(103,232,249,${alpha.toFixed(3)})`);
            grad.addColorStop(1, `rgba(56,189,248,${alpha.toFixed(3)})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = pi.hot || pj.hot ? 1.0 : 0.65;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      /* ---- LAYER 6: Draw particles ---- */
      for (const p of particles) {
        const alpha = isDark
          ? p.alpha + Math.sin(p.pulse) * 0.18
          : p.alpha * 0.5;
        const a = Math.max(0.05, Math.min(0.9, alpha));
        const r = p.hot ? p.r * 2.2 : p.r;

        if (isDark && p.hot) {
          // Hotspot glow
          const hg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
          hg.addColorStop(0, `rgba(103,232,249,${a})`);
          hg.addColorStop(0.3, `rgba(56,189,248,${a * 0.5})`);
          hg.addColorStop(1, 'rgba(56,189,248,0)');
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (isDark) {
          // Regular glow halo
          const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
          rg.addColorStop(0, `rgba(56,189,248,${a * 0.45})`);
          rg.addColorStop(1, 'rgba(56,189,248,0)');
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(${p.hot ? '255,255,255' : '103,232,249'},${a})`
          : `rgba(2,132,199,${a})`;
        ctx.fill();
      }

      /* ---- LAYER 7: Ripple waves ---- */
      rippleTimer += dt;
      if (rippleTimer > 1400 && ripples.length < MAX_RIPPLES) {
        spawnRipple();
        rippleTimer = 0;
      }

      for (let ri = ripples.length - 1; ri >= 0; ri--) {
        const rp = ripples[ri];
        rp.radius += rp.speed * (dt / 16);
        rp.alpha  -= 0.0025 * (dt / 16);
        if (rp.alpha <= 0 || rp.radius >= rp.maxR) {
          ripples.splice(ri, 1);
          continue;
        }
        const ripAlpha = isDark ? rp.alpha : rp.alpha * 0.4;

        // Outer glow ring
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rp.color},${(ripAlpha * 0.4).toFixed(3)})`;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Sharp inner ring
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rp.color},${ripAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      /* ---- LAYER 8: Meteor streams ---- */
      meteorTimer += dt;
      if (meteorTimer > 2200 && meteors.length < MAX_METEORS) {
        spawnMeteor();
        meteorTimer = 0;
      }

      for (let mi = meteors.length - 1; mi >= 0; mi--) {
        const m = meteors[mi];
        m.x += m.vx * (dt / 16);
        m.y += m.vy * (dt / 16);

        if (m.x > W + m.len) {
          meteors.splice(mi, 1);
          continue;
        }

        if (isDark) {
          const mg = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y);
          mg.addColorStop(0, `rgba(${m.color},${m.alpha})`);
          mg.addColorStop(0.3, `rgba(${m.color},${m.alpha * 0.5})`);
          mg.addColorStop(1, `rgba(${m.color},0)`);
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.len, m.y);
          ctx.strokeStyle = mg;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Bright head
          const mh = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 6);
          mh.addColorStop(0, `rgba(255,255,255,${m.alpha})`);
          mh.addColorStop(0.4, `rgba(${m.color},${m.alpha * 0.7})`);
          mh.addColorStop(1, `rgba(${m.color},0)`);
          ctx.fillStyle = mh;
          ctx.beginPath();
          ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    rafId = requestAnimationFrame(render);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else {
        if (!rafId) { lastT = performance.now(); rafId = requestAnimationFrame(render); }
      }
    });
  }

  /* ==========================================================
     3. NAVBAR SCROLL STATE & BACK-TO-TOP PROGRESS RING
     ========================================================== */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const progressIndicator = document.getElementById('progressIndicator');
  const circleCircumference = 119.38; // 2 * PI * 19

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Sticky header appearance
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 40);
    }

    // Back to top button visibility & circular progress
    if (backToTop && progressIndicator) {
      if (scrollY > 280) {
        backToTop.classList.add('visible');
        if (docHeight > 0) {
          const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
          const dashoffset = circleCircumference - (circleCircumference * progress);
          progressIndicator.style.strokeDashoffset = dashoffset;
        }
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Update active nav link (unless manual scrolling lock is active)
    if (!isManualNavigating) {
      updateActiveNavLinkOnScroll();
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveNav('#home');
      history.replaceState(null, null, '#home');
    });
  }

  /* ==========================================================
     4. ACTIVE NAVIGATION TRACKING (Requirement 6 - High Priority)
     ========================================================== */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  let isManualNavigating = false;
  let manualNavTimeout = null;

  function setActiveNav(targetHref) {
    let matched = false;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === targetHref) {
        link.classList.add('active');
        matched = true;
      } else {
        link.classList.remove('active');
      }
    });
    return matched;
  }

  function updateActiveNavLinkOnScroll() {
    const scrollPos = window.scrollY + 130;
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 70);

    // If reached bottom of document, automatically highlight Contact
    if (isAtBottom) {
      setActiveNav('#contact');
      return;
    }

    // Iterate backwards so lower sections match first
    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = sections[i];
      if (sec.offsetTop <= scrollPos) {
        const id = '#' + sec.getAttribute('id');
        setActiveNav(id);
        return;
      }
    }

    // Fallback to Home if near top
    if (window.scrollY < 200) {
      setActiveNav('#home');
    }
  }

  // Handle click on all navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();

        // 1. Immediately highlight clicked link
        setActiveNav(href);

        // 2. Lock scroll spy during smooth scroll transition (800ms)
        isManualNavigating = true;
        if (manualNavTimeout) clearTimeout(manualNavTimeout);
        manualNavTimeout = setTimeout(() => {
          isManualNavigating = false;
          updateActiveNavLinkOnScroll();
        }, 850);

        // 3. Smooth scroll with dynamic nav height offset
        const navHeight = (navbar ? navbar.offsetHeight : 72) + 10;
        const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // 4. Update URL without breaking back button
        if (history.replaceState) {
          history.replaceState(null, null, href);
        }

        // 5. Close mobile hamburger menu if open
        closeMobileMenu();
      }
    });
  });

  // Handle URL hash on initial load
  if (window.location.hash) {
    const hash = window.location.hash;
    const matched = setActiveNav(hash);
    if (!matched) {
      setActiveNav('#home');
    }
  } else {
    setActiveNav('#home');
  }

  // Handle browser back and forward history buttons
  window.addEventListener('hashchange', () => {
    if (window.location.hash) {
      setActiveNav(window.location.hash);
    } else {
      setActiveNav('#home');
    }
  });

  window.addEventListener('popstate', () => {
    if (window.location.hash) {
      setActiveNav(window.location.hash);
    } else {
      updateActiveNavLinkOnScroll();
    }
  });

  /* ==========================================================
     5. MOBILE HAMBURGER MENU
     ========================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  function closeMobileMenu() {
    if (hamburger && navLinksContainer) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinksContainer.classList.remove('open');
    }
  }

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navLinksContainer.classList.toggle('open', isOpen);
    });

    // Close when clicking outside of navbar
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinksContainer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  /* ==========================================================
     6. TYPING ROLE ANIMATION
     ========================================================== */
  const typedEl = document.getElementById('typedRole');
  const roles = [
    'Software Tester',
    'QA Engineer',
    'Test Case Designer',
    'Bug Hunter',
    'Quality Advocate'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeRole() {
    if (!typedEl) return;
    const current = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      typedEl.textContent = current.substring(0, charIndex);
    } else {
      charIndex++;
      typedEl.textContent = current.substring(0, charIndex);
    }

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400; // Pause before typing next word
    }

    setTimeout(typeRole, delay);
  }
  setTimeout(typeRole, 700);

  /* ==========================================================
     7. ANIMATED STATS & SKILL PROGRESS BARS
     ========================================================== */
  // Skill Bars on scroll into view
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;

  function animateSkillBars() {
    if (skillsAnimated || !skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      skillsAnimated = true;
      document.querySelectorAll('.skill-fill').forEach((bar, idx) => {
        const targetWidth = bar.getAttribute('data-width') || '80';
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, idx * 60);
      });
    }
  }

  window.addEventListener('scroll', animateSkillBars, { passive: true });
  animateSkillBars(); // Check on initial load

  // iPortfolio Stats PureCounter Animation
  const statsSection = document.getElementById('stats');
  let statsCounted = false;

  function countUpStats() {
    if (statsCounted || !statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      statsCounted = true;
      document.querySelectorAll('.sb-counter').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const duration = 1200;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.floor(easeProgress * target);
          counter.textContent = currentVal;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        }
        requestAnimationFrame(updateCounter);
      });
    }
  }

  window.addEventListener('scroll', countUpStats, { passive: true });
  countUpStats();

  /* ==========================================================
     8. FADE-IN ON SCROLL (IntersectionObserver)
     ========================================================== */
  const FADE_SELECTORS = [
    '.section-header',
    '.about-profile-card',
    '.about-text-card',
    '.about-info-grid',
    '.iportfolio-details-grid',
    '.qa-mindset-box',
    '.stat-box-v2',
    '.skill-category-card',
    '.soft-skills-row',
    '.service-card-v2',
    '.project-feature-card',
    '.tc-filter-bar',
    '.tc-table-wrapper',
    '.tc-summary-row',
    '.bug-card',
    '.academic-showcase-card',
    '.cert-filter-bar',
    '.cert-card-v2',
    '.cert-tip',
    '.timeline-item',
    '.resume-card',
    '.contact-info-panel',
    '.contact-form-panel'
  ];

  FADE_SELECTORS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('fade-in'));
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }

  /* ==========================================================
     8b. TILT CARD 3D HOVER EFFECT
     ========================================================== */
  if (!prefersReducedMotion && !('ontouchstart' in window)) {
    document.querySelectorAll('.service-card-v2, .cert-card-v2, .project-feature-card, .stat-box-v2').forEach(card => {
      card.classList.add('tilt-card');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = -(y * 8).toFixed(2);
        const tiltY  = (x * 8).toFixed(2);
        card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================
     9. TEST CASES FILTERING
     ========================================================== */
  const tcFilterBtns = document.querySelectorAll('.tc-filter');
  const tcRows = document.querySelectorAll('#tcTable tbody tr');

  tcFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tcFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      tcRows.forEach(row => {
        const rowMod = row.getAttribute('data-module');
        const show = filter === 'all' || rowMod === filter;
        row.style.display = show ? '' : 'none';
      });
    });
  });

  /* ==========================================================
     10. CERTIFICATIONS FILTERING
     ========================================================== */
  const certFilterBtns = document.querySelectorAll('.cert-filter');
  const certCards = document.querySelectorAll('.cert-card-v2');
  const academicCard = document.querySelector('.academic-showcase-card');

  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      // Academic Showcase Card
      if (academicCard) {
        academicCard.style.display = (filter === 'all' || filter === 'academic') ? '' : 'none';
      }

      // Individual Credential Cards
      certCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ==========================================================
     11. PROFILE PHOTO FALLBACK HANDLER (Requirement 3)
     ========================================================== */
  document.querySelectorAll('.profile-photo, .apc-photo').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const fallback = img.parentElement.querySelector('.photo-fallback');
      if (fallback) {
        fallback.style.display = 'flex';
      }
    });
  });

  /* ==========================================================
     12. CONTACT FORM SUBMISSION FEEDBACK
     ========================================================== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        alert('Please fill out all required fields.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-circle-check"></i> Message Received!';
      submitBtn.style.background = '#22c55e';
      submitBtn.style.borderColor = '#22c55e';
      submitBtn.style.color = '#ffffff';
      submitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        submitBtn.innerHTML = originalHtml;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
        submitBtn.style.pointerEvents = '';
        contactForm.reset();
      }, 3500);
    });
  }

  /* ==========================================================
     13. CINEMATIC HERO VIDEO CONTROLLER & ACCESSIBILITY
     ========================================================== */
  const heroVideo = document.getElementById('heroVideo');
  const heroVideoFallback = document.getElementById('heroVideoFallback');
  const videoControlBtn = document.getElementById('videoControlBtn');

  if (heroVideo) {
    // 1. Respect prefers-reduced-motion
    if (prefersReducedMotion) {
      heroVideo.pause();
      heroVideo.style.display = 'none';
      if (heroVideoFallback) heroVideoFallback.style.display = 'block';
      if (videoControlBtn) videoControlBtn.style.display = 'none';
    } else {
      // 2. Autoplay handling with promise catch (browser policy protection)
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay prevented by browser power saving or audio policy
          if (videoControlBtn) {
            videoControlBtn.classList.add('paused');
            videoControlBtn.setAttribute('title', 'Play video');
            videoControlBtn.setAttribute('aria-label', 'Play video');
          }
        });
      }
    }

    // 3. Fallback on network or decoding error
    heroVideo.addEventListener('error', () => {
      heroVideo.style.display = 'none';
      if (heroVideoFallback) heroVideoFallback.style.display = 'block';
      if (videoControlBtn) videoControlBtn.style.display = 'none';
    });

    // 4. Interactive Pause / Play toggle control
    if (videoControlBtn) {
      videoControlBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play().then(() => {
            videoControlBtn.classList.remove('paused');
            videoControlBtn.setAttribute('title', 'Pause video');
            videoControlBtn.setAttribute('aria-label', 'Pause video');
          }).catch(err => {
            console.warn('Video play prevented:', err);
          });
        } else {
          heroVideo.pause();
          videoControlBtn.classList.add('paused');
          videoControlBtn.setAttribute('title', 'Play video');
          videoControlBtn.setAttribute('aria-label', 'Play video');
        }
      });
    }

    // 5. Performance and battery saver: pause video when scrolled away or tab is hidden
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!prefersReducedMotion && heroVideo) {
            if (entry.isIntersecting) {
              if (videoControlBtn && !videoControlBtn.classList.contains('paused')) {
                heroVideo.play().catch(() => {});
              }
            } else {
              heroVideo.pause();
            }
          }
        });
      }, { threshold: 0.15 });

      videoObserver.observe(heroVideo);
    }
  }

  // Initial scroll evaluation
  handleScroll();
});
