/* ============================================================
   PH DİZAYN — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== CUSTOM CURSOR =====
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    // Ring follows with lag
    (function animateCursor() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    })();

    // Hover expand
    const hoverTargets = document.querySelectorAll(
      'a, button, .prod-card, .proj-cell, .tech-card, .metric-cell, .cert-item'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
        cursorRing.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovered');
        cursorRing.classList.remove('hovered');
      });
    });
  }

  // ===== PROGRESS BAR =====
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight) * 100;
      progressBar.style.width = pct + '%';
    });
  }

  // ===== NAV SCROLL =====
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ===== SMOOTH NAV LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== SCENE NAV DOTS =====
  const sceneIds = ['s1','s2','s3','s4','s5','s6','s7','s8'];
  const dots = document.querySelectorAll('.snav-dot');

  dots.forEach(d => {
    d.addEventListener('click', () => {
      const el = document.getElementById(d.dataset.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const sceneObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = sceneIds.indexOf(e.target.id);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.4 });

  sceneIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) sceneObs.observe(el);
  });

  // ===== SCROLL REVEAL =====
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('revealed');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObs.observe(el));

  // ===== HERO PARALLAX =====
  const heroBg = document.querySelector('.hero-bg-img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
      }
    });
  }

  // ===== PRODUCT CARD 3D TILT =====
  document.querySelectorAll('.prod-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) scale(1.015)`;
      card.style.transition = 'box-shadow .4s, transform .05s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'box-shadow .4s, transform .6s cubic-bezier(0.16,1,0.3,1)';
    });
  });

  // ===== PROJECT CELL PARALLAX =====
  document.querySelectorAll('.proj-cell').forEach(cell => {
    const bg = cell.querySelector('.proj-bg-layer');
    if (!bg) return;

    cell.addEventListener('mouseenter', () => {
      bg.style.transition = 'transform .25s';
    });
    cell.addEventListener('mousemove', e => {
      const r = cell.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      bg.style.transform = `scale(1.08) translate(${x * 10}px, ${y * 7}px)`;
    });
    cell.addEventListener('mouseleave', () => {
      bg.style.transition = 'transform .9s cubic-bezier(0.16,1,0.3,1)';
      bg.style.transform = '';
    });
  });

  // ===== FINISH DOT SWITCHER =====
  // When user clicks a finish dot, swap product SVG colors
  document.querySelectorAll('.prod-card').forEach(card => {
    const dots = card.querySelectorAll('.fdot');
    const svgG = card.querySelector('.prod-svg-steel');

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.style.outline = '');
        dot.style.outline = '2px solid var(--gold)';
        dot.style.outlineOffset = '2px';

        if (!svgG) return;
        const finish = dot.dataset.finish;
        if (finish === 'steel') {
          svgG.style.filter = 'none';
        } else if (finish === 'black') {
          svgG.style.filter = 'grayscale(1) brightness(.3)';
        } else if (finish === 'gold') {
          svgG.style.filter = 'sepia(1) saturate(2) hue-rotate(-10deg) brightness(.9)';
        }
      });
    });
  });

});
