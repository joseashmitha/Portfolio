# Jose Ashmitha V. — Professional QA Engineer Portfolio

A creative, cinematic, recruiter-ready portfolio for an **Aspiring Software Tester / QA Engineer**, built with clean HTML5, modern CSS3, and responsive JavaScript.

Featuring a **cinematic dark navy-blue theme**, an **integrated AI video hero showcase**, structured **manual testing case studies (BookCart)**, **50+ test cases**, **defect reports**, and **13 verified credentials** (including B.Sc. CS with Distinction).

---

## 🎨 Theme & Visual Architecture

- **Deep Navy Base:** `#07111F`
- **Dark Blue Container:** `#0B1B33`
- **Electric Blue Accents:** `#4DA3FF` / `#2563eb`
- **Typography:** High-contrast White (`#f8fafc`) and Muted Slate (`#94a3b8`) using *Inter*, *Plus Jakarta Sans*, and *JetBrains Mono*
- **Theme Switcher:** Instant toggle between Cinematic Dark Navy and Crisp Executive Light theme with persistent localStorage state.

---

## 🎬 AI Hero Video Integration

- **File Location:** `assets/hero-video.mp4`
- **Poster & Static Fallback:** `Images/Jose_Ashmitha_Navy_Portrait.png`
- **Frame Styling:** Custom responsive `.video-frame` with `object-fit: cover` and `object-position: center 18%` to center the face without stretching.
- **Red Rim Neutralization Overlays:**
  1. `Layer 1 (.cinematic-color-overlay)`: Radial gradient with `mix-blend-mode: hue` preserving natural facial skin tones in the center while shifting the outer silhouette rim light toward electric blue `#4DA3FF` and navy `#0B1B33`.
  2. `Layer 2 (.cinematic-vignette-overlay)`: Radial vignette darkening the periphery to `#07111F` to eliminate background red glow.
  3. `Layer 3 (.cinematic-depth-overlay)`: Ambient gradient at the bottom for high contrast against playback controls.
- **Controls & Accessibility:**
  - Interactive Play / Pause control toggle button.
  - Automatic pause when scrolled out of view (`IntersectionObserver`) to save battery and GPU cycles.
  - Graceful fallback to static portrait if video fails to load or if `prefers-reduced-motion` is active.

---

## 📋 Portfolio Sections

1. **Home / Hero:** Personal identity, typing role animation, core summary, and quick CTAs (`Explore My Projects`, `View Resume`, `Contact Me`).
2. **About Me:** Profile card with academic honors (First Class with Distinction), B.Sc. Computer Science (AI & Data Science), and Core QA Mindset.
3. **Technical Skills:** Interactive animated progress bars covering Testing Disciplines, Methodologies (STLC/SDLC/Agile), and Tools/Languages (SQL, Java, Python, Excel, HTML/CSS).
4. **Featured Project:** End-to-end Manual Testing of the **BookCart E-Commerce Platform** (User Login, Registration, Book Search, Shopping Cart).
5. **Test Cases:** Filterable test case matrix with execution status (10 PASS / 3 FAIL) and module filters.
6. **Bug Reports:** Detailed defect cards with Severity levels (Critical, High, Medium), steps to reproduce, expected vs. actual outcomes, and TC references.
7. **Certifications & Credentials:** Dedicated showcase for university provisional degree certificate plus 12 industry internships, workshops, cloud, and programming credentials with verified PDF links.
8. **Resume:** Direct PDF download and in-browser viewing.
9. **Contact:** Direct email, phone, location, social profiles, and validated contact form.

---

## 🚀 How to Run & Preview Locally

### Option 1: Open Directly in Browser (Quickest)
1. Navigate to the `portfoliowebsite` folder.
2. Double-click `index.html`.
3. It opens immediately in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Run Built-In Local Web Server (Recommended)
This project includes a multi-threaded HTTP server with MP4 byte-range streaming support:
1. Open PowerShell in the project directory.
2. Execute:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8080
   ```
3. Open your browser and navigate to:
   ```
   http://127.0.0.1:8080
   ```

### Option 3: VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Right-click `index.html` → **Open with Live Server**.
3. Changes will automatically hot-reload in your browser.

---

## 🌐 How to Publish Publicly

### Method 1: Netlify Drop (1-Minute, Free, No CLI needed)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the whole `portfoliowebsite` folder onto the browser window.
3. Netlify will deploy the site and provide a live URL (e.g., `https://jose-ashmitha-qa.netlify.app`).

### Method 2: GitHub Pages (Free 24/7 Hosting)
1. Initialize git and push the folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial QA portfolio deployment"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
2. In your repository on GitHub, go to **Settings > Pages**.
3. Under **Build and deployment**, select source: **Deploy from a branch**, Branch: `main` / `root`.
4. Your website will be live at `https://<your-username>.github.io/portfolio/`.

### Method 3: Instant Live Tunnel (For Quick Sharing)
Double-click `share-portfolio.bat` to launch a temporary secure HTTPS link (`https://xxxx.lhr.life`) to share immediately with recruiters.

---

## 🔒 Verification & Quality Assurance Checklist

- [x] Zero hardcoded absolute Windows paths; 100% relative paths.
- [x] Responsive layout tested across desktop, tablet, and mobile breakpoints.
- [x] All 13 certificates verified against physical PDF files on disk.
- [x] HTML5 video configured with `autoplay`, `muted`, `loop`, `playsinline`, and static fallback.
- [x] WCAG color contrast compliance with white text on dark navy surfaces.
- [x] Reduced-motion accessibility supported.
