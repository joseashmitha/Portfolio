/* ============================================================
   JOSE ASHMITHA V. — PROFESSIONAL QA PORTFOLIO JAVASCRIPT
   Version: 3.0 (Redesign) — Theme Toggle, Canvas Engine,
   Accurate Active Nav Tracking, Scroll Progress Ring & Fallbacks
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. THEME — DARK NAVY ONLY (light theme disabled permanently)
     ========================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    // Always force dark — ignore any light request
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('ja_portfolio_theme', 'dark');

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#030C1A');
    }

    if (themeToggle) {
      themeToggle.setAttribute('title', 'Dark Mode Active');
      themeToggle.setAttribute('aria-label', 'Dark Mode Active');
    }

    // Notify background canvas
    if (window.updateCanvasTheme) {
      window.updateCanvasTheme('dark');
    }
  }

  // Always initialize to dark
  applyTheme('dark');

  // Theme toggle button — keep dark always, do nothing on click
  if (themeToggle) {
    themeToggle.style.display = 'none'; // hide toggle so users can't switch to light
  }

  /* ==========================================================
     2. GRAND AURORA & QUANTUM QA MATRIX ENGINE (Premium 3D Full-Width)
     - Full-width undulating Aurora Ribbons across horizontal span
     - Radiant Cosmic Nebula Glow Spheres (Cyan / Indigo / Teal)
     - Neural Constellation Web with Travelling Light Energy Pulses
     - Floating 3D Isometric QA Wireframe Glyphs (Precision Cubes)
     - Expanding Sonar Test Waves & Horizontal Meteor Streams
     - Interactive Cursor Aurora Aura & Magnetic Starlight Beams
     ========================================================== */
  const canvas = document.getElementById('bgCanvas');
  const isMobile = window.innerWidth <= 768;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initNodes();
    }, { passive: true });

    /* ----------------------------------------------------------
       MOUSE INTERACTION FIELD
    ---------------------------------------------------------- */
    let mouseX = W * 0.5, mouseY = H * 0.4;
    let mouseActive = false;
    if (!isMobile) {
      window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseActive = true;
      }, { passive: true });
      window.addEventListener('mouseleave', () => {
        mouseActive = false;
      });
    }

    /* ----------------------------------------------------------
       LAYER A: 4 GRAND RADIANT NEBULA CORES (Span full width)
    ---------------------------------------------------------- */
    const nebulas = [
      { rx: 0.12, ry: 0.28, vx: 0.00015, vy: 0.00012, radius: 420, color1: 'rgba(14, 85, 160, 0.38)', color2: 'rgba(56, 189, 248, 0.16)' },
      { rx: 0.82, ry: 0.38, vx:-0.00012, vy: 0.00018, radius: 460, color1: 'rgba(99, 102, 241, 0.32)', color2: 'rgba(56, 189, 248, 0.14)' },
      { rx: 0.48, ry: 0.72, vx: 0.00018, vy:-0.00014, radius: 400, color1: 'rgba(13, 148, 136, 0.30)', color2: 'rgba(45, 212, 191, 0.14)' },
      { rx: 0.92, ry: 0.80, vx:-0.00016, vy:-0.00011, radius: 360, color1: 'rgba(37, 99, 235, 0.32)',  color2: 'rgba(99, 102, 241, 0.12)' }
    ];

    /* ----------------------------------------------------------
       LAYER B: CONSTELLATION NODES & ENERGY WEB
    ---------------------------------------------------------- */
    const NODE_COUNT = isMobile ? 60 : 130;
    const CONNECT_DIST = isMobile ? 120 : 175;
    let nodes = [];

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 2.2 + 1.0,
          baseAlpha: Math.random() * 0.4 + 0.45,
          pulse: Math.random() * Math.PI * 2,
          pulseSpd: 0.018 + Math.random() * 0.022,
          isHero: Math.random() < 0.12 // 12% Supernova nodes with big glow
        });
      }
    }
    initNodes();

    /* ----------------------------------------------------------
       LAYER C: TRAVELLING DATA PULSES (Along connection lines)
    ---------------------------------------------------------- */
    const MAX_PULSES = isMobile ? 6 : 14;
    const pulses = [];

    function spawnPulse(n1, n2) {
      if (pulses.length >= MAX_PULSES) return;
      pulses.push({
        x1: n1.x, y1: n1.y,
        x2: n2.x, y2: n2.y,
        progress: 0,
        speed: 0.015 + Math.random() * 0.02,
        color: Math.random() < 0.5 ? '#67E8F9' : '#38BDF8'
      });
    }

    /* ----------------------------------------------------------
       LAYER D: FLOATING 3D ISOMETRIC QA CUBES (Precision Testing)
    ---------------------------------------------------------- */
    const CUBE_COUNT = isMobile ? 3 : 6;
    const cubes = [];
    for (let i = 0; i < CUBE_COUNT; i++) {
      cubes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 18 + Math.random() * 24,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        spdX: 0.004 + Math.random() * 0.006,
        spdY: 0.005 + Math.random() * 0.007,
        spdZ: 0.003 + Math.random() * 0.005,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: 0.25 + Math.random() * 0.25
      });
    }

    function drawIsoCube(cube) {
      const s = cube.size;
      const angX = cube.rotX, angY = cube.rotY;
      // 8 vertices in 3D
      const verts = [
        [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
        [-s, -s,  s], [s, -s,  s], [s, s,  s], [-s, s,  s]
      ];
      // Project into 2D
      const proj = verts.map(v => {
        let x = v[0], y = v[1], z = v[2];
        // Rotate Y
        let x1 = x * Math.cos(angY) + z * Math.sin(angY);
        let z1 = -x * Math.sin(angY) + z * Math.cos(angY);
        // Rotate X
        let y2 = y * Math.cos(angX) - z1 * Math.sin(angX);
        let z2 = y * Math.sin(angX) + z1 * Math.cos(angX);
        const f = 280 / (280 + z2);
        return [cube.x + x1 * f, cube.y + y2 * f];
      });

      const edges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
      ];

      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${cube.alpha.toFixed(3)})`;
      ctx.lineWidth = 1.1;
      for (const [i, j] of edges) {
        ctx.beginPath();
        ctx.moveTo(proj[i][0], proj[i][1]);
        ctx.lineTo(proj[j][0], proj[j][1]);
        ctx.stroke();
      }
      // Glowing core vertex
      ctx.fillStyle = `rgba(103, 232, 249, ${(cube.alpha * 1.4).toFixed(3)})`;
      for (const p of proj) {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    /* ----------------------------------------------------------
       LAYER E: EXPANDING SONAR RADAR RINGS (QA Test Pulses)
    ---------------------------------------------------------- */
    const MAX_RINGS = 6;
    const rings = [];

    function spawnRing() {
      rings.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.9 + H * 0.05,
        radius: 0,
        maxR: 220 + Math.random() * 260,
        alpha: 0.65,
        speed: 1.2 + Math.random() * 1.0,
        color: Math.random() < 0.6 ? '56, 189, 248' : '103, 232, 249'
      });
    }
    for (let i = 0; i < 3; i++) {
      spawnRing();
      rings[i].radius = (rings[i].maxR / 3) * i;
    }

    /* ----------------------------------------------------------
       LAYER F: HORIZONTAL METEORS / LIGHT BEAMS
    ---------------------------------------------------------- */
    const MAX_METEORS = isMobile ? 3 : 6;
    const meteors = [];

    function spawnMeteor() {
      const len = 140 + Math.random() * 220;
      meteors.push({
        x: -len,
        y: Math.random() * H * 0.85 + H * 0.05,
        len: len,
        vx: 5 + Math.random() * 5,
        vy: (Math.random() - 0.45) * 1.2,
        alpha: 0.55 + Math.random() * 0.4,
        color: Math.random() < 0.5 ? '103, 232, 249' : '56, 189, 248'
      });
    }
    for (let i = 0; i < 2; i++) {
      spawnMeteor();
      meteors[i].x = Math.random() * W;
    }

    /* ----------------------------------------------------------
       RENDER LOOP
    ---------------------------------------------------------- */
    let time = 0;
    let lastT = performance.now();
    let ringTimer = 0;
    let meteorTimer = 0;
    let pulseTimer = 0;

    function render(now) {
      requestAnimationFrame(render);
      if (document.hidden) return;

      const dt = Math.min(now - lastT, 50);
      lastT = now;
      time += dt * 0.001;

      ctx.clearRect(0, 0, W, H);

      // BASE BACKGROUND FILL (Dark Navy Blue)
      ctx.fillStyle = '#030C1A';
      ctx.fillRect(0, 0, W, H);

      /* ========================================================
         1. FLOWING AURORA RIBBONS (Full Horizontal Width)
      ======================================================== */
      ctx.save();
      // Wave 1: Upper Ocean Cyan Ribbon
      ctx.beginPath();
      ctx.moveTo(0, H * 0.25);
      for (let x = 0; x <= W + 40; x += 40) {
        const y = H * 0.28 +
          Math.sin(x * 0.0025 + time * 0.6) * 65 +
          Math.sin(x * 0.006 - time * 0.4) * 35;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      const grad1 = ctx.createLinearGradient(0, 0, W, H * 0.4);
      grad1.addColorStop(0, 'rgba(14, 58, 110, 0.40)');
      grad1.addColorStop(0.35, 'rgba(56, 189, 248, 0.22)');
      grad1.addColorStop(0.7, 'rgba(99, 102, 241, 0.18)');
      grad1.addColorStop(1, 'rgba(3, 12, 26, 0.0)');
      ctx.fillStyle = grad1;
      ctx.fill();

      // Wave 2: Mid-Screen Electric Indigo / Cyan River
      ctx.beginPath();
      ctx.moveTo(0, H * 0.55);
      for (let x = 0; x <= W + 40; x += 40) {
        const y = H * 0.52 +
          Math.sin(x * 0.003 - time * 0.5) * 80 +
          Math.sin(x * 0.005 + time * 0.3) * 40;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      const grad2 = ctx.createLinearGradient(W * 0.2, H * 0.3, W * 0.8, H * 0.85);
      grad2.addColorStop(0, 'rgba(99, 102, 241, 0.24)');
      grad2.addColorStop(0.5, 'rgba(56, 189, 248, 0.22)');
      grad2.addColorStop(0.85, 'rgba(45, 212, 191, 0.18)');
      grad2.addColorStop(1, 'rgba(3, 12, 26, 0.0)');
      ctx.fillStyle = grad2;
      ctx.fill();
      ctx.restore();

      /* ========================================================
         2. RADIANT NEBULA GLOW SPHERES (4 Spheres across W)
      ======================================================== */
      for (const neb of nebulas) {
        neb.rx += neb.vx * (dt / 16);
        neb.ry += neb.vy * (dt / 16);
        if (neb.rx < 0.05 || neb.rx > 0.95) neb.vx *= -1;
        if (neb.ry < 0.08 || neb.ry > 0.92) neb.vy *= -1;
        const nx = neb.rx * W, ny = neb.ry * H;

        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.radius);
        g.addColorStop(0, neb.color1);
        g.addColorStop(0.5, neb.color2);
        g.addColorStop(1, 'rgba(3, 12, 26, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(nx, ny, neb.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ========================================================
         3. PRECISION DIGITAL QA GRID (Wavy with Crosshairs)
      ======================================================== */
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 0.8;
      const hStep = 60, vStep = 75;
      for (let y = 0; y < H + hStep; y += hStep) {
        const wave = Math.sin(time * 0.35 + y * 0.007) * 4;
        ctx.beginPath();
        ctx.moveTo(0, y + wave);
        ctx.lineTo(W, y + wave);
        ctx.stroke();
      }
      for (let x = 0; x < W + vStep; x += vStep) {
        const wave = Math.sin(time * 0.3 + x * 0.006) * 3;
        ctx.beginPath();
        ctx.moveTo(x + wave, 0);
        ctx.lineTo(x + wave, H);
        ctx.stroke();
      }
      // Glowing crosshairs at selected grid intersections
      ctx.fillStyle = 'rgba(103, 232, 249, 0.35)';
      for (let x = vStep * 2; x < W; x += vStep * 3) {
        for (let y = hStep * 2; y < H; y += hStep * 3) {
          const crossSize = 3;
          ctx.fillRect(x - crossSize, y - 0.5, crossSize * 2, 1);
          ctx.fillRect(x - 0.5, y - crossSize, 1, crossSize * 2);
        }
      }
      ctx.restore();

      /* ========================================================
         4. FLOATING 3D ISOMETRIC QA CUBES
      ======================================================== */
      for (const cube of cubes) {
        cube.x += cube.vx * (dt / 16);
        cube.y += cube.vy * (dt / 16);
        cube.rotX += cube.spdX;
        cube.rotY += cube.spdY;
        cube.rotZ += cube.spdZ;
        if (cube.x < -60) cube.x = W + 60;
        if (cube.x > W + 60) cube.x = -60;
        if (cube.y < -60) cube.y = H + 60;
        if (cube.y > H + 60) cube.y = -60;
        drawIsoCube(cube);
      }

      /* ========================================================
         5. UPDATE & DRAW NEURAL NODES & CONNECTIONS
      ======================================================== */
      // Update nodes
      for (const n of nodes) {
        // Mouse interaction
        if (mouseActive) {
          const dx = n.x - mouseX, dy = n.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 0) {
            const force = (160 - dist) / 160 * 0.7;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
          }
        }

        n.vx *= 0.985;
        n.vy *= 0.985;
        if (Math.abs(n.vx) < 0.05) n.vx += (Math.random() - 0.5) * 0.07;
        if (Math.abs(n.vy) < 0.04) n.vy += (Math.random() - 0.5) * 0.05;

        n.x += n.vx * (dt / 16);
        n.y += n.vy * (dt / 16);

        if (n.x < -15) n.x = W + 15;
        if (n.x > W + 15) n.x = -15;
        if (n.y < -15) n.y = H + 15;
        if (n.y > H + 15) n.y = -15;

        n.pulse += n.pulseSpd;
      }

      // Draw connection lines & spawn travelling pulses
      pulseTimer += dt;
      ctx.save();
      for (let i = 0; i < nodes.length; i++) {
        const ni = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nj = nodes[j];
          const dx = ni.x - nj.x, dy = ni.y - nj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.42;
            ctx.beginPath();
            ctx.moveTo(ni.x, ni.y);
            ctx.lineTo(nj.x, nj.y);
            const lineGrad = ctx.createLinearGradient(ni.x, ni.y, nj.x, nj.y);
            lineGrad.addColorStop(0, `rgba(103, 232, 249, ${alpha.toFixed(3)})`);
            lineGrad.addColorStop(1, `rgba(56, 189, 248, ${alpha.toFixed(3)})`);
            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = (ni.isHero || nj.isHero) ? 1.2 : 0.75;
            ctx.stroke();

            // Occasionally spawn a light pulse travelling on this line
            if (pulseTimer > 400 && Math.random() < 0.02) {
              spawnPulse(ni, nj);
              pulseTimer = 0;
            }
          }
        }

        // Draw connections to mouse cursor if within range
        if (mouseActive) {
          const mdx = ni.x - mouseX, mdy = ni.y - mouseY;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            const mAlpha = (1 - mdist / 180) * 0.55;
            ctx.beginPath();
            ctx.moveTo(ni.x, ni.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(103, 232, 249, ${mAlpha.toFixed(3)})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Draw travelling pulses
      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const p = pulses[pi];
        p.progress += p.speed * (dt / 16);
        if (p.progress >= 1) {
          pulses.splice(pi, 1);
          continue;
        }
        const px = p.x1 + (p.x2 - p.x1) * p.progress;
        const py = p.y1 + (p.y2 - p.y1) * p.progress;

        const pulseGlow = ctx.createRadialGradient(px, py, 0, px, py, 7);
        pulseGlow.addColorStop(0, '#ffffff');
        pulseGlow.addColorStop(0.4, p.color);
        pulseGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = pulseGlow;
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw star nodes with halos
      for (const n of nodes) {
        const alpha = Math.max(0.15, Math.min(1.0, n.baseAlpha + Math.sin(n.pulse) * 0.25));
        const r = n.isHero ? n.r * 2.2 : n.r;

        if (n.isHero) {
          // Supernova radiant aura
          const hg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5.5);
          hg.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          hg.addColorStop(0.3, `rgba(103, 232, 249, ${alpha * 0.7})`);
          hg.addColorStop(0.65, `rgba(56, 189, 248, ${alpha * 0.35})`);
          hg.addColorStop(1, 'rgba(3, 12, 26, 0)');
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 5.5, 0, Math.PI * 2);
          ctx.fill();

          // Pulsing halo ring
          ctx.strokeStyle = `rgba(103, 232, 249, ${(alpha * 0.6).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 2.8, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Soft cyan star halo
          const sg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
          sg.addColorStop(0, `rgba(103, 232, 249, ${alpha * 0.8})`);
          sg.addColorStop(0.5, `rgba(56, 189, 248, ${alpha * 0.4})`);
          sg.addColorStop(1, 'rgba(3, 12, 26, 0)');
          ctx.fillStyle = sg;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star core
        ctx.fillStyle = n.isHero ? '#ffffff' : `rgba(103, 232, 249, ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cursor radiant aura
      if (mouseActive) {
        const mg = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 130);
        mg.addColorStop(0, 'rgba(103, 232, 249, 0.28)');
        mg.addColorStop(0.4, 'rgba(56, 189, 248, 0.14)');
        mg.addColorStop(1, 'rgba(3, 12, 26, 0)');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 130, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(103, 232, 249, 0.5)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* ========================================================
         6. EXPANDING SONAR RADAR RINGS
      ======================================================== */
      ringTimer += dt;
      if (ringTimer > 1500 && rings.length < MAX_RINGS) {
        spawnRing();
        ringTimer = 0;
      }
      for (let ri = rings.length - 1; ri >= 0; ri--) {
        const rp = rings[ri];
        rp.radius += rp.speed * (dt / 16);
        rp.alpha -= 0.0022 * (dt / 16);
        if (rp.alpha <= 0 || rp.radius >= rp.maxR) {
          rings.splice(ri, 1);
          continue;
        }
        // Outer soft glow ring
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rp.color}, ${(rp.alpha * 0.35).toFixed(3)})`;
        ctx.lineWidth = 7;
        ctx.stroke();
        // Inner crisp laser ring
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rp.color}, ${rp.alpha.toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      /* ========================================================
         7. HORIZONTAL METEORS / DIGITAL LIGHT STREAMS
      ======================================================== */
      meteorTimer += dt;
      if (meteorTimer > 2000 && meteors.length < MAX_METEORS) {
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

        const mg = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y);
        mg.addColorStop(0, `rgba(${m.color}, ${m.alpha})`);
        mg.addColorStop(0.35, `rgba(${m.color}, ${m.alpha * 0.5})`);
        mg.addColorStop(1, `rgba(${m.color}, 0)`);

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.len, m.y);
        ctx.strokeStyle = mg;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // White-hot meteor head
        const mh = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 7);
        mh.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        mh.addColorStop(0.4, `rgba(${m.color}, ${m.alpha * 0.8})`);
        mh.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = mh;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(render);
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
