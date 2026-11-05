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
     2. QA CONSTELLATION — Premium 3D Canvas Animation
     Concept: A slowly rotating sphere of interconnected test nodes
     with electric pulse beams, orbiting data rings, and drifting
     stardust — representing precision QA intelligence.
     Pure canvas 2D with 3D projection math (no external libs needed).
     ========================================================== */
  const canvas = document.getElementById('bgCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    window.updateCanvasTheme = (theme) => { isDark = theme !== 'light'; };

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }, { passive: true });

    /* ---- Mouse parallax ---- */
    let mx = 0, my = 0;
    if (!isMobile) {
      window.addEventListener('mousemove', e => {
        mx = (e.clientX / W - 0.5);
        my = (e.clientY / H - 0.5);
      }, { passive: true });
    }

    /* ---- 3D sphere node network ---- */
    const NODE_COUNT = isMobile ? 28 : 55;
    const SPHERE_R   = isMobile ? 160 : 230;
    const CONN_DIST  = isMobile ? 110 : 160; // max distance to draw connection

    // Distribute nodes on sphere surface using Fibonacci spiral
    function fibonacciSphere(n) {
      const pts = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = golden * i;
        pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
      }
      return pts;
    }

    const baseNodes = fibonacciSphere(NODE_COUNT);

    /* ---- Orbiting ring data ---- */
    const rings = [
      { radius: SPHERE_R * 1.35, tiltX: 0.52, tiltZ: 0.0,  speed: 0.0007, dotCount: 3, dotOffset: 0 },
      { radius: SPHERE_R * 1.60, tiltX: 1.1,  tiltZ: 0.4,  speed: -0.0005, dotCount: 2, dotOffset: 1.8 },
      { radius: SPHERE_R * 1.85, tiltX: 0.2,  tiltZ: 0.9,  speed: 0.0004, dotCount: 2, dotOffset: 3.1 }
    ];

    /* ---- Pulse beams travelling along connections ---- */
    const pulses = [];
    for (let i = 0; i < 6; i++) {
      pulses.push({ progress: Math.random(), speed: 0.004 + Math.random() * 0.003, a: 0, b: 0 });
    }

    /* ---- Stardust micro particles ---- */
    const stars = [];
    const STAR_COUNT = isMobile ? 30 : 65;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random(), y: Math.random(),
        size: Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.3 + 0.05,
        vy: (Math.random() * 0.00015 + 0.00004),
        pulse: Math.random() * Math.PI * 2,
        pulseSpd: Math.random() * 0.018 + 0.008
      });
    }

    /* ---- Floating ambient glow blobs ---- */
    const blobs = [
      { px: 0.18, py: 0.28, vx: 0.00025, vy: 0.00015, r: 280, alpha: 0.09 },
      { px: 0.82, py: 0.18, vx: -0.0002, vy: 0.0003,  r: 320, alpha: 0.07 },
      { px: 0.50, py: 0.80, vx: 0.00018, vy: -0.00018,r: 290, alpha: 0.08 }
    ];

    /* ---- 3D rotation state ---- */
    let rotX = 0.3, rotY = 0;
    let targetRotX = 0.3, targetRotY = 0;

    /* ---- 3D → 2D projection ---- */
    function project(x, y, z, cx, cy, fov) {
      const scale = fov / (fov + z);
      return { sx: cx + x * scale, sy: cy + y * scale, scale };
    }

    function rotateXY(x, y, z, ax, ay) {
      // Rotate around X axis
      let y1 = y * Math.cos(ax) - z * Math.sin(ax);
      let z1 = y * Math.sin(ax) + z * Math.cos(ax);
      // Rotate around Y axis
      let x2 = x * Math.cos(ay) + z1 * Math.sin(ay);
      let z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);
      return { x: x2, y: y1, z: z2 };
    }

    let time = 0;
    let lastT = performance.now();
    let rafId = null;

    function render(now) {
      rafId = requestAnimationFrame(render);
      if (document.hidden) return;

      const dt = Math.min(now - lastT, 50);
      lastT = now;
      time += dt * 0.001;

      ctx.clearRect(0, 0, W, H);

      /* -- Floating ambient glow blobs -- */
      for (const b of blobs) {
        b.px += b.vx * (dt / 16);
        b.py += b.vy * (dt / 16);
        if (b.px < 0.05 || b.px > 0.95) b.vx *= -1;
        if (b.py < 0.05 || b.py > 0.95) b.vy *= -1;
        const bx = b.px * W, by = b.py * H;
        if (isDark) {
          const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
          g.addColorStop(0, `rgba(56,189,248,${b.alpha})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(bx, by, b.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* -- Stardust -- */
      for (const s of stars) {
        s.y -= s.vy * (dt / 16);
        if (s.y < 0) { s.y = 1; s.x = Math.random(); }
        s.pulse += s.pulseSpd;
        const a = Math.max(0.02, Math.min(0.5, s.alpha + Math.sin(s.pulse) * 0.1));
        ctx.fillStyle = isDark ? `rgba(186,230,253,${a})` : `rgba(2,132,199,${a * 0.5})`;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (prefersReducedMotion) return;

      /* -- Update rotation with mouse parallax ease -- */
      const autoRotY = time * 0.18;
      targetRotX = 0.3 + my * 0.35;
      targetRotY = autoRotY + mx * 0.5;
      rotX += (targetRotX - rotX) * 0.03;
      rotY += (targetRotY - rotY) * 0.03;

      /* -- Centre of constellation (right-biased visually) -- */
      const cx = W * (isMobile ? 0.5 : 0.72);
      const cy = H * 0.52;
      const FOV = 420;

      /* -- Project all nodes -- */
      const projected = baseNodes.map(n => {
        const p = rotateXY(n.x * SPHERE_R, n.y * SPHERE_R, n.z * SPHERE_R, rotX, rotY);
        return project(p.x, p.y, p.z, cx, cy, FOV);
      });

      /* -- Draw connections (back nodes first for depth) -- */
      const sorted = projected.map((p, i) => ({ p, i }))
        .sort((a, b) => a.p.scale - b.p.scale);

      // Build connection pairs (each node connects to nearest few)
      const connPairs = [];
      for (let i = 0; i < baseNodes.length; i++) {
        const pi = projected[i];
        for (let j = i + 1; j < baseNodes.length; j++) {
          const pj = projected[j];
          const dx = pi.sx - pj.sx, dy = pi.sy - pj.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONN_DIST) connPairs.push({ i, j, dist });
        }
      }

      // Draw connection lines
      for (const { i, j, dist } of connPairs) {
        const pi = projected[i], pj = projected[j];
        const alpha = isDark
          ? (1 - dist / CONN_DIST) * 0.22 * Math.min(pi.scale, pj.scale) * 1.6
          : (1 - dist / CONN_DIST) * 0.08;
        if (alpha < 0.01) continue;
        ctx.beginPath();
        ctx.moveTo(pi.sx, pi.sy);
        ctx.lineTo(pj.sx, pj.sy);
        ctx.strokeStyle = isDark ? `rgba(56,189,248,${alpha.toFixed(3)})` : `rgba(2,132,199,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      /* -- Pulse beams travelling along connections -- */
      if (connPairs.length > 4) {
        for (const pulse of pulses) {
          pulse.progress += pulse.speed * (dt / 16);
          if (pulse.progress >= 1) {
            pulse.progress = 0;
            // Pick a random connection pair
            const idx = Math.floor(Math.random() * connPairs.length);
            pulse.a = connPairs[idx].i;
            pulse.b = connPairs[idx].j;
          }
          const pa = projected[pulse.a], pb = projected[pulse.b];
          if (!pa || !pb) continue;
          const t2 = pulse.progress;
          const px = pa.sx + (pb.sx - pa.sx) * t2;
          const py = pa.sy + (pb.sy - pa.sy) * t2;
          const pulseAlpha = isDark ? 0.9 : 0.5;
          const pg = ctx.createRadialGradient(px, py, 0, px, py, 7);
          pg.addColorStop(0, `rgba(103,232,249,${pulseAlpha})`);
          pg.addColorStop(0.4, `rgba(56,189,248,${pulseAlpha * 0.4})`);
          pg.addColorStop(1, 'rgba(56,189,248,0)');
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.arc(px, py, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* -- Draw sphere nodes (sorted back to front) -- */
      for (const { p, i } of sorted) {
        const brightness = 0.3 + p.scale * 0.7;
        const radius = Math.max(1.5, p.scale * (isMobile ? 3.5 : 4.5));
        // Node glow
        if (isDark) {
          const ng = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, radius * 2.8);
          ng.addColorStop(0, `rgba(56,189,248,${brightness * 0.55})`);
          ng.addColorStop(1, 'rgba(56,189,248,0)');
          ctx.fillStyle = ng;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
        // Node dot
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(103,232,249,${brightness * 0.95})`
          : `rgba(2,132,199,${brightness * 0.6})`;
        ctx.fill();
      }

      /* -- Orbiting data rings -- */
      for (const ring of rings) {
        ring.dotOffset += ring.speed * (dt / 16);
        const steps = 90;
        ctx.beginPath();
        for (let k = 0; k <= steps; k++) {
          const angle = (k / steps) * Math.PI * 2;
          const rx = Math.cos(angle) * ring.radius;
          const ry = Math.sin(angle) * ring.radius * Math.cos(ring.tiltX);
          const rz = Math.sin(angle) * ring.radius * Math.sin(ring.tiltX);
          // apply tiltZ
          const finalX = rx * Math.cos(ring.tiltZ) - rz * Math.sin(ring.tiltZ);
          const finalZ = rx * Math.sin(ring.tiltZ) + rz * Math.cos(ring.tiltZ);
          // apply scene rotation Y
          const fx = finalX * Math.cos(rotY) + finalZ * Math.sin(rotY);
          const fz = -finalX * Math.sin(rotY) + finalZ * Math.cos(rotY);
          const proj = project(fx, ry, fz, cx, cy, FOV);
          if (k === 0) ctx.moveTo(proj.sx, proj.sy);
          else ctx.lineTo(proj.sx, proj.sy);
        }
        ctx.closePath();
        ctx.strokeStyle = isDark ? 'rgba(56,189,248,0.14)' : 'rgba(2,132,199,0.06)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Orbiting glowing dots on the ring
        for (let d = 0; d < ring.dotCount; d++) {
          const dAngle = ring.dotOffset + (d / ring.dotCount) * Math.PI * 2;
          const drx = Math.cos(dAngle) * ring.radius;
          const dry = Math.sin(dAngle) * ring.radius * Math.cos(ring.tiltX);
          const drz = Math.sin(dAngle) * ring.radius * Math.sin(ring.tiltX);
          const dfx = drx * Math.cos(ring.tiltZ) - drz * Math.sin(ring.tiltZ);
          const dfz = drx * Math.sin(ring.tiltZ) + drz * Math.cos(ring.tiltZ);
          const dfx2 = dfx * Math.cos(rotY) + dfz * Math.sin(rotY);
          const dfz2 = -dfx * Math.sin(rotY) + dfz * Math.cos(rotY);
          const dp = project(dfx2, dry, dfz2, cx, cy, FOV);
          const dg = ctx.createRadialGradient(dp.sx, dp.sy, 0, dp.sx, dp.sy, 10);
          dg.addColorStop(0, isDark ? 'rgba(103,232,249,0.9)' : 'rgba(2,132,199,0.7)');
          dg.addColorStop(1, 'rgba(56,189,248,0)');
          ctx.fillStyle = dg;
          ctx.beginPath();
          ctx.arc(dp.sx, dp.sy, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(dp.sx, dp.sy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.95)' : 'rgba(2,132,199,0.9)';
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
