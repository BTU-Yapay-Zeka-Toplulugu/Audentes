// ===== Audentes — Interactive Scripts =====

document.addEventListener('DOMContentLoaded', () => {
  initDNAHelix();
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initTimelineProgress();
});

// ─── DNA Helix Canvas Animation ─────────────────────────────────────────────
function initDNAHelix() {
  const canvas = document.getElementById('dna-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  const W = () => canvas.offsetWidth;
  const H = () => canvas.offsetHeight;

  const helixCount = 3;
  const helices = Array.from({ length: helixCount }, (_, i) => ({
    x: (W() / (helixCount + 1)) * (i + 1),
    amplitude: 40 + Math.random() * 30,
    frequency: 0.015 + Math.random() * 0.005,
    speed: 0.008 + Math.random() * 0.006,
    phase: Math.random() * Math.PI * 2,
    pairs: 28 + Math.floor(Math.random() * 8),
  }));

  let time = 0;

  function drawHelix(helix) {
    const { x, amplitude, frequency, speed, phase, pairs } = helix;
    const h = H();
    const spacing = h / pairs;

    for (let i = 0; i < pairs; i++) {
      const y = i * spacing;
      const offset = Math.sin(y * frequency + time * speed + phase) * amplitude;

      const x1 = x + offset;
      const x2 = x - offset;

      // Base pair connector
      const depth = (Math.sin(y * frequency + time * speed + phase) + 1) / 2;
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.06 + depth * 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();

      // Nucleotide dots — strand 1
      const r1 = 2 + depth * 2;
      ctx.beginPath();
      ctx.arc(x1, y, r1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${0.3 + depth * 0.5})`;
      ctx.fill();

      // Nucleotide dots — strand 2
      const r2 = 2 + (1 - depth) * 2;
      ctx.beginPath();
      ctx.arc(x2, y, r2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(179, 136, 255, ${0.3 + (1 - depth) * 0.5})`;
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W(), H());

    // Update helix positions on resize
    helices.forEach((helix, i) => {
      helix.x = (W() / (helixCount + 1)) * (i + 1);
    });

    helices.forEach(drawHelix);
    time += 1;
    requestAnimationFrame(animate);
  }

  animate();
}

// ─── Scroll-triggered Animations ────────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}

// ─── Navbar scroll effect ───────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Smooth scroll
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      // Close mobile menu if open
      closeMobileMenu();
    });
  });
}

// ─── Mobile Menu ────────────────────────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }
}

function closeMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ─── Timeline Progress ─────────────────────────────────────────────────────
function initTimelineProgress() {
  const milestones = [
    { deadline: new Date('2026-02-20'), id: 1 },
    { deadline: new Date('2026-03-25'), id: 2 },
    { deadline: new Date('2026-05-05'), id: 3 },
    { deadline: new Date('2026-06-29'), id: 4 },
    { deadline: new Date('2026-09-30'), id: 5 },
  ];

  const now = new Date();

  // Determine status of each milestone
  milestones.forEach((m, i) => {
    const node = document.querySelector(`[data-task="${m.id}"] .timeline-node`);
    const card = document.querySelector(`[data-task="${m.id}"] .phase-card`);

    if (!node || !card) return;

    if (now > m.deadline) {
      // Completed phase
      node.classList.add('completed');
      node.innerHTML = '✓';
      card.classList.add('phase-completed');
    } else if (i === 0 || now > milestones[i - 1].deadline) {
      // Active phase
      node.classList.add('active');
      node.innerHTML = m.id;
      card.classList.add('phase-active-glow');
    } else {
      // Upcoming phase
      node.classList.add('upcoming');
      node.innerHTML = m.id;
    }
  });

  // Animate the progress line
  const timelineContainer = document.querySelector('.timeline-container');
  const progressLine = document.querySelector('.timeline-line-progress');
  if (!timelineContainer || !progressLine) return;

  const items = document.querySelectorAll('.timeline-item');
  if (items.length === 0) return;

  // Calculate progress height
  const completedCount = milestones.filter((m) => now > m.deadline).length;
  const activeIndex = milestones.findIndex(
    (m, i) => now <= m.deadline && (i === 0 || now > milestones[i - 1].deadline)
  );

  let progressFraction;
  if (completedCount === milestones.length) {
    progressFraction = 1;
  } else if (activeIndex >= 0) {
    const prevDeadline = activeIndex > 0 ? milestones[activeIndex - 1].deadline : new Date('2026-01-01');
    const currentDeadline = milestones[activeIndex].deadline;
    const elapsed = now - prevDeadline;
    const total = currentDeadline - prevDeadline;
    const withinTask = Math.min(Math.max(elapsed / total, 0), 1);
    progressFraction = (activeIndex + withinTask) / milestones.length;
  } else {
    progressFraction = 0;
  }

  // Set height after a short delay for animation
  setTimeout(() => {
    const containerHeight = timelineContainer.offsetHeight;
    progressLine.style.height = `${progressFraction * containerHeight}px`;
  }, 500);

  // Update chain stats counter
  const completedEl = document.getElementById('chain-completed');
  const activeEl = document.getElementById('chain-active');
  const upcomingEl = document.getElementById('chain-upcoming');

  if (completedEl) completedEl.textContent = completedCount;
  if (activeEl) activeEl.textContent = activeIndex >= 0 ? 1 : 0;
  if (upcomingEl)
    upcomingEl.textContent = milestones.length - completedCount - (activeIndex >= 0 ? 1 : 0);

}
