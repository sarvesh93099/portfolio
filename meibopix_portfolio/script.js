'use strict';

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const setMenu = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navLinks.classList.toggle('open', open);
  };
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', () => setMenu(false));

  // Content stays visible if JavaScript or motion support is unavailable.
  if ('IntersectionObserver' in window) {
    if (!reducedMotion.matches) document.documentElement.classList.add('js-motion');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px 15px 0px' });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = navLinks.querySelector(`a[href="#${entry.target.id}"]`);
        navLinks.querySelectorAll('[aria-current]').forEach((active) => active.removeAttribute('aria-current'));
        if (link) link.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('#home, #work, #about, #experience, #contact').forEach((section) => sectionObserver.observe(section));
  }

  const filters = [...document.querySelectorAll('.filter')];
  const projects = [...document.querySelectorAll('[data-category]')];
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filters.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle('active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      let count = 0;
      projects.forEach((project) => {
        const show = button.dataset.filter === 'all' || project.dataset.category === button.dataset.filter;
        project.hidden = !show;
        if (show) {
          count++;
          project.classList.add('visible');
        }
      });
      document.querySelector('#filter-status').textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}.`;
    });
  });

  const projectDetails = {
    meibopix: {
      category: 'COMPUTER VISION / MEDICAL IMAGING',
      title: 'MeiboPix.',
      intro: 'AI-powered meibography analysis for eyelid and meibomian gland segmentation with a live demo.',
      body: `<h3>The idea</h3><p>Meibography captures the meibomian glands in the eyelids. MeiboPix brings deep learning and image processing into a workflow for segmenting the eyelid and gland regions, supporting visual analysis of these images.</p><h3>What I built</h3><ul><li>Developed a U-Net-based segmentation workflow for eyelid and meibomian gland analysis in Python using PyTorch.</li><li>Applied preprocessing, ROI extraction, and prediction visualization to improve the clarity of gland segmentation outputs.</li><li>Integrated the model into an interactive web app for image upload, prediction viewing, and AI-assisted meibography analysis.</li></ul><h3>The workflow</h3><p>Image input → preprocessing → deep learning segmentation → visual review of the output.</p><div class="tags"><span>PyTorch</span><span>U-Net</span><span>OpenCV</span><span>Medical Imaging</span></div><p class="dialog-note">A research and portfolio project. The visual output supports exploration and is not a clinical diagnosis.</p><a class="button button-primary" href="https://meibopix-latest-f.vercel.app/" target="_blank" rel="noopener"> Explore live MeiboPix <svg class="icon"><use href="#i-arrow"/></svg></a>`
    },
    sales: {
      category: 'AGENTIC AI / WORKFLOW AUTOMATION',
      title: 'AI Sales Intelligence.',
      intro: 'A multi-agent sales intelligence and outreach workflow, with a person in control of what gets sent.',
      body: `<h3>The idea</h3><p>Lead discovery and outreach involve many connected decisions. This project organizes that work into explicit stages: identify relevant businesses, understand their needs, and prepare outreach that reflects the research.</p><h3>How the agents work together</h3><ul><li><strong>Discover:</strong> select a target market, find leads, and check for duplicates.</li><li><strong>Understand:</strong> research the business and analyze its digital presence.</li><li><strong>Qualify:</strong> detect problems, match services, score leads, and enrich contact information.</li><li><strong>Prepare:</strong> perform deeper research and generate personalized solutions and outreach.</li><li><strong>Review and route:</strong> require human review before sending, then route replies into interested, follow-up, and rejected leads.</li></ul><h3>Built with</h3><p>Python, LangChain, LangGraph, and LLM APIs to structure the multi-step workflow and connect its decision stages.</p><div class="tags"><span>Python</span><span>LangChain</span><span>LangGraph</span><span>LLM APIs</span><span>Human Review</span></div>`
    },
    xray: {
      category: 'DEEP LEARNING / EXPLAINABLE AI',
      title: 'X-Ray AI.',
      intro: 'Chest pneumonia classification with confidence scores, visual explanations, and an accessible web interface.',
      body: `<h3>The model</h3><p>Fine-tuned DenseNet121 using two-phase transfer learning on the Kaggle Chest X-Ray dataset to classify images as PNEUMONIA or NORMAL, with confidence scores.</p><h3>Beyond a prediction</h3><ul><li><strong>Explainability:</strong> Grad-CAM heatmaps visualize the regions contributing to the model's prediction.</li><li><strong>Input checks:</strong> a four-check heuristic validation module is designed to reject non-X-ray uploads before inference.</li><li><strong>API integration:</strong> a FastAPI POST /predict endpoint returns the class, confidence, and Grad-CAM overlay.</li><li><strong>Interface:</strong> a drag-and-drop web frontend connects image upload to prediction and visualization.</li></ul><div class="tags"><span>TensorFlow</span><span>Keras</span><span>DenseNet121</span><span>OpenCV</span><span>FastAPI</span><span>Grad-CAM</span></div><p class="dialog-note">An educational machine learning project. Predictions and confidence scores are not a substitute for clinical assessment.</p>`
    }
  };
  const dialog = document.querySelector('#project-dialog');
  let dialogTrigger = null;
  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      const project = projectDetails[button.dataset.project];
      if (!project) return;
      dialogTrigger = button;
      document.querySelector('#dialog-category').textContent = project.category;
      document.querySelector('#dialog-title').textContent = project.title;
      document.querySelector('#dialog-intro').textContent = project.intro;
      // All markup comes from the fixed project content above, never user input.
      document.querySelector('#dialog-body').innerHTML = project.body;
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('dialog-open');
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    dialogTrigger?.focus({ preventScroll: true });
  });

  const email = 'talegaonkarsarves@gmail.com';
  const copyButton = document.querySelector('.copy-email');
  const copyStatus = document.querySelector('.copy-status');
  let copyReset;
  function legacyCopy() {
    const temporary = document.createElement('textarea');
    temporary.value = email;
    temporary.setAttribute('readonly', '');
    temporary.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(temporary);
    temporary.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } finally { temporary.remove(); copyButton.focus({ preventScroll: true }); }
    return copied;
  }
  copyButton.addEventListener('click', async () => {
    clearTimeout(copyReset);
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch { /* File previews and browser policies may require the fallback. */ }
    if (!copied) {
      try { copied = legacyCopy(); } catch { copied = false; }
    }
    copyStatus.textContent = copied ? 'Email copied!' : 'Select the email to copy it.';
    copyButton.querySelector('use').setAttribute('href', copied ? '#i-check' : '#i-copy');
    copyReset = setTimeout(() => {
      copyStatus.textContent = '';
      copyButton.querySelector('use').setAttribute('href', '#i-copy');
    }, 3500);
  });
  document.querySelector('#year').textContent = new Date().getFullYear();

  // A lightweight, original 3D point field, rendered without external libraries.
  const canvas = document.querySelector('#neural-canvas');
  const ctx = canvas.getContext('2d');
  const animationButton = document.querySelector('.animation-toggle');
  if (!ctx) { animationButton.hidden = true; return; }
  const art = document.querySelector('.neural-art');
  const points = [];
  const edges = [];
  const count = 185;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const ripple = 1 + 0.06 * Math.sin(theta * 3 + y * 6);
    points.push({ x: Math.cos(theta) * r * ripple, y: y * ripple, z: Math.sin(theta) * r * ripple, core: false });
  }
  for (let i = 0; i < 32; i++) {
    const y = 1 - (i / 31) * 2;
    const r = Math.sqrt(1 - y * y) * .58;
    points.push({ x: Math.cos(goldenAngle * i) * r, y: y * .58, z: Math.sin(goldenAngle * i) * r, core: true });
  }
  points.forEach((point, i) => {
    for (let j = i + 1; j < points.length; j++) {
      const other = points[j];
      const distance = Math.hypot(point.x - other.x, point.y - other.y, point.z - other.z);
      if (distance < (point.core || other.core ? .63 : .35)) edges.push([i, j, distance]);
    }
  });
  let width = 0, height = 0, frameId = 0, rotation = .45, lastTime = 0;
  let paused = reducedMotion.matches, onscreen = true;
  let pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0;
  function project(point, angle, tilt) {
    const x = point.x * Math.cos(angle) - point.z * Math.sin(angle);
    const z = point.x * Math.sin(angle) + point.z * Math.cos(angle);
    const y = point.y * Math.cos(tilt) - z * Math.sin(tilt);
    const depth = point.y * Math.sin(tilt) + z * Math.cos(tilt);
    const perspective = 3.6 / (3.6 + depth);
    const radius = Math.min(width * .355, height * .365);
    return { x: width / 2 + x * radius * perspective, y: height / 2 + y * radius * perspective, z: depth, scale: perspective };
  }
  function draw() {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const angle = rotation + tiltX;
    const tilt = .19 + tiltY;
    const projected = points.map((point) => project(point, angle, tilt));
    const halo = ctx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, Math.min(width, height) * .45);
    halo.addColorStop(0, 'rgba(144, 180, 92, 0.08)');
    halo.addColorStop(.7, 'rgba(110, 154, 82, 0.025)');
    halo.addColorStop(1, 'rgba(110, 154, 82, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, width, height);
    // Tilted orbits give the point field a quiet sense of structure.
    for (let ring = 0; ring < 3; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const a = (i / 140) * Math.PI * 2;
        const ringTilt = .4 + ring * .9;
        const point = project({ x: Math.cos(a) * 1.14, y: Math.sin(a) * Math.cos(ringTilt) * 1.14, z: Math.sin(a) * Math.sin(ringTilt) * 1.14 }, angle * .4 + ring, tilt);
        if (i === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
      }
      ctx.strokeStyle = ring === 1 ? 'rgba(190, 218, 149, 0.22)' : 'rgba(164, 192, 125, 0.11)';
      ctx.lineWidth = .65;
      ctx.stroke();
    }
    edges.forEach(([a, b, distance]) => {
      const first = projected[a], second = projected[b];
      const depth = (first.z + second.z) / 2;
      const alpha = Math.max(.025, (1.3 - depth) * .18 * (1 - distance * .9));
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(second.x, second.y);
      ctx.strokeStyle = `rgba(174, 208, 137, ${alpha})`;
      ctx.lineWidth = depth < 0 ? .7 : .45;
      ctx.stroke();
    });
    projected.forEach((point, index) => {
      const alpha = Math.max(.12, Math.min(1, (1.4 - point.z) * .5));
      const bright = index % 13 === 0;
      const radius = (bright ? 2.1 : 1.1) * point.scale;
      if (bright && point.z < .6) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199, 232, 157, ${alpha * .07})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${bright ? '221, 245, 186' : '165, 198, 134'}, ${alpha})`;
      ctx.fill();
    });
  }
  function tick(now) {
    frameId = 0;
    if (paused || !onscreen || document.hidden) return;
    const delta = lastTime ? Math.min(now - lastTime, 50) : 16;
    if (delta >= 30) {
      rotation += delta * .000045;
      tiltX += (pointerX - tiltX) * .045;
      tiltY += (pointerY - tiltY) * .045;
      lastTime = now;
      draw();
    } else if (!lastTime) lastTime = now;
    frameId = requestAnimationFrame(tick);
  }
  function syncAnimation() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = 0;
    animationButton.setAttribute('aria-pressed', String(paused));
    animationButton.setAttribute('aria-label', paused ? 'Play neural network animation' : 'Pause neural network animation');
    animationButton.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
    draw();
    if (!paused && onscreen && !document.hidden) frameId = requestAnimationFrame(tick);
  }
  function resize() {
    width = art.clientWidth;
    height = art.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  art.addEventListener('pointermove', (event) => {
    if (paused || event.pointerType === 'touch') return;
    const bounds = art.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * .5;
    pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * .35;
  });
  art.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
  animationButton.addEventListener('click', () => { paused = !paused; syncAnimation(); });
  reducedMotion.addEventListener('change', () => {
    paused = reducedMotion.matches;
    if (paused) document.documentElement.classList.remove('js-motion');
    syncAnimation();
  });
  document.addEventListener('visibilitychange', syncAnimation);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { onscreen = entry.isIntersecting; syncAnimation(); }, { threshold: .01 }).observe(art);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(art);
  else window.addEventListener('resize', resize);
  resize();
  syncAnimation();
})();
