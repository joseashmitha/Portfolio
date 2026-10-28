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
      metaThemeColor.setAttribute('content', theme === 'light' ? '#f8fafc' : '#07111F');
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
     2. ANIMATED BACKGROUND CANVAS ENGINE (Lightweight & Smooth)
     ========================================================== */
  const canvas = document.getElementById('bgCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let width = 0;
    let height = 0;
    let isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Floating Ambient Light Nodes (Deep Navy & Electric Blue)
    const nodes = [
      { x: 0.2, y: 0.3, vx: 0.0003, vy: 0.0002, r: 240, colorDark: 'rgba(77, 163, 255, 0.12)', colorLight: 'rgba(2, 132, 199, 0.06)' },
      { x: 0.8, y: 0.2, vx: -0.0002, vy: 0.0003, r: 280, colorDark: 'rgba(96, 165, 250, 0.10)', colorLight: 'rgba(99, 102, 241, 0.05)' },
      { x: 0.5, y: 0.75, vx: 0.0002, vy: -0.0002, r: 260, colorDark: 'rgba(11, 27, 51, 0.22)', colorLight: 'rgba(37, 99, 235, 0.05)' }
    ];

    // Star-dust micro particles
    const particleCount = 38;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.4 + 0.1,
        speedY: (Math.random() * 0.0002 + 0.00008),
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI
      });
    }

    window.updateCanvasTheme = function(theme) {
      isDark = theme !== 'light';
    };

    let lastTime = performance.now();

    function render(time) {
      const delta = Math.min(time - lastTime, 50);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw drifting ambient glow nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * (delta / 16);
        n.y += n.vy * (delta / 16);

        if (n.x < 0.05 || n.x > 0.95) n.vx *= -1;
        if (n.y < 0.05 || n.y > 0.95) n.vy *= -1;

        const px = n.x * width;
        const py = n.y * height;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, n.r);
        const col = isDark ? n.colorDark : n.colorLight;

        grad.addColorStop(0, col);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw subtle star-dust particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY * (delta / 16);
        if (p.y < 0) {
          p.y = 1;
          p.x = Math.random();
        }

        p.pulseVal += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulseVal) * 0.15;
        const safeAlpha = Math.max(0.04, Math.min(0.7, currentAlpha));

        const px = p.x * width;
        const py = p.y * height;

        ctx.fillStyle = isDark
          ? `rgba(186, 230, 253, ${safeAlpha})`
          : `rgba(2, 132, 199, ${safeAlpha * 0.7})`;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    // Start loop
    animationFrameId = requestAnimationFrame(render);

    // Pause when tab is not active to save battery/CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
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
