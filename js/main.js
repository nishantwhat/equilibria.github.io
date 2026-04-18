/**
 * main.js — Entry point
 * Orchestrates: navigation, scroll reveals, section tracking, module init
 */

import { initDemandShift  } from './modules/demandShift.js';
import { initProfitTool   } from './modules/profitTool.js';
import { initResourceFlow } from './modules/resourceFlow.js';
import { initSupplyShift  } from './modules/supplyShift.js';

// ── Wait for DOM ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize all interactive modules
  initDemandShift();
  initProfitTool();
  initResourceFlow();
  initSupplyShift();

  // 2. Scroll reveal observer
  initReveal();

  // 3. Active nav section tracking
  initNavTracking();

  // 4. Hero timeline animation
  initHeroTimeline();

  // 5. Resource bar triggered animation
  initScrollTriggers();

  // 6. Presenter badge update (which section is active)
  initPresenterBadge();

});

// ── Scroll Reveal ─────────────────────────────────────────────
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // One-shot
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  revealEls.forEach(el => obs.observe(el));
}

// ── Nav Active Section Tracking ───────────────────────────────
function initNavTracking() {
  const sections = document.querySelectorAll('.section, #hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === id);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-20% 0px -20% 0px',
  });

  sections.forEach(s => obs.observe(s));
}

// ── Presenter Badge ───────────────────────────────────────────
const PRESENTER_MAP = {
  hero: { name: 'Intro', num: '' },
  s1:   { name: 'Speaker 1 — Market Shock',      num: '01' },
  s2:   { name: 'Speaker 2 — Profit Analysis',   num: '02' },
  s3:   { name: 'Speaker 3 — Production Shift',  num: '03' },
  s4:   { name: 'Speaker 4 — Market Impact',     num: '04' },
};

function initPresenterBadge() {
  const badge     = document.getElementById('presenter-badge');
  const badgeText = document.getElementById('presenter-badge-text');
  const sections  = document.querySelectorAll('.section, #hero');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const data = PRESENTER_MAP[id];
        if (data && badgeText) {
          badgeText.textContent = data.num ? `[${data.num}] ${data.name}` : data.name;
        }
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}

// ── Hero Timeline Animation ───────────────────────────────────
function initHeroTimeline() {
  const years = document.querySelectorAll('.tl-year');
  if (!years.length) return;

  let current = 0;
  setInterval(() => {
    years.forEach(y => y.classList.remove('active'));
    years[current % years.length].classList.add('active');
    current++;
  }, 1200);
}

// ── Scroll-triggered actions ──────────────────────────────────
function initScrollTriggers() {
  // Trigger resource bars when s3 is in view
  const s3 = document.getElementById('s3');
  if (!s3) return;

  let triggered = false;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        // Trigger before-bars
        document.querySelectorAll('.res-bar.before').forEach((bar, i) => {
          setTimeout(() => {
            const pct = bar.dataset.pct || '90';
            bar.style.width = pct + '%';
          }, i * 200);
        });

        // Trigger after-bars (delayed)
        setTimeout(() => {
          document.querySelectorAll('.res-bar.after').forEach((bar, i) => {
            setTimeout(() => {
              const pct = bar.dataset.pct || '10';
              bar.style.width = pct + '%';
            }, i * 200);
          });
        }, 1200);
      }
    });
  }, { threshold: 0.2 });

  obs.observe(s3);
}
