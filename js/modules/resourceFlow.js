/**
 * resourceFlow.js — Section 3: Production Shift
 *
 * Part A: Resource Reallocation Visualization
 *   Shows the 3 factors of production (Labour, Capital, Land) shifting
 *   from mask production to fashion wear.
 *   Bars animate when the section becomes visible.
 *
 * Part B: Economies of Scale (EoS) Demo
 *   Slider: Output units (500 → 10,000 / month)
 *   As output grows: Average Total Cost falls (EoS)
 *   ECONOMIC CONCEPT: Spreading fixed costs over more units
 *   FORMULA: ATC = (Fixed Cost + Variable Cost × Q) / Q
 *             As Q → ∞, ATC → Variable Cost (marginal cost)
 *
 * ASSUMPTIONS:
 * - Fixed Cost = ₹5,00,000/month (rent, machine leases, management)
 * - Variable Cost = ₹180 per garment (fabric, thread, direct labour)
 * - These are illustrative; real factories would have stepped cost curves
 *
 * SIMPLIFICATION: We omit diminishing returns for clarity.
 *   In reality, ATC eventually rises again (diseconomies of scale).
 *   We note this with a "warning zone" on the graph.
 */

export function initResourceFlow() {
  initReallocationBars();
  initEosSlider();
}

// ── Part A: Resource Reallocation ────────────────────────────
function initReallocationBars() {
  const bars = document.querySelectorAll('.res-bar');
  if (!bars.length) return;

  // Data: how much of each resource has been reallocated (%)
  const reallocationData = {
    labour:  { before: 95, after: 8,  realloc: 87 },  // 87% of labour retrained
    capital: { before: 90, after: 15, realloc: 75 },  // 75% of machines retooled
    land:    { before: 100, after: 100, realloc: 0 }, // Factory land unchanged (same location)
  };

  // Animate bars when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBars();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const flowSection = document.querySelector('.flow-layout');
  if (flowSection) observer.observe(flowSection);

  function animateBars() {
    // Before column bars
    document.querySelectorAll('.res-bar.before').forEach(bar => {
      const resource = bar.dataset.resource;
      const data = reallocationData[resource];
      if (data) {
        setTimeout(() => {
          bar.style.width = data.before + '%';
        }, 100);
      }
    });

    // After column bars
    document.querySelectorAll('.res-bar.after').forEach(bar => {
      const resource = bar.dataset.resource;
      const data = reallocationData[resource];
      if (data) {
        setTimeout(() => {
          bar.style.width = data.after + '%';
          // Color change for dramatic effect
          if (data.realloc > 50) {
            bar.style.background = 'var(--s3-accent)';
          }
        }, 600);
      }
    });

    // Update percentage labels
    setTimeout(() => {
      document.querySelectorAll('.realloc-pct').forEach(el => {
        const resource = el.dataset.resource;
        const data = reallocationData[resource];
        if (data) {
          animateNumber(el, 0, data.realloc, 800, '%');
        }
      });
    }, 600);
  }

  // Activate transition steps sequentially
  const steps = document.querySelectorAll('.step-item');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        steps.forEach((step, i) => {
          setTimeout(() => step.classList.add('active'), i * 350);
        });
        stepObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (steps.length) stepObserver.observe(steps[0]);
}

// ── Part B: Economies of Scale Slider ────────────────────────
function initEosSlider() {
  const slider = document.getElementById('eos-slider');
  const canvas  = document.getElementById('eos-canvas');
  if (!slider || !canvas) return;

  const ctx = canvas.getContext('2d');

  // ECONOMIC PARAMETERS (easy to modify)
  const EOS = {
    fixedCost:    500000,  // ₹5,00,000 / month
    variableCost: 180,     // ₹180 per unit (direct costs)
    minQ:         500,     // Minimum output on slider
    maxQ:         10000,   // Maximum output on slider
    optimalQ:     7000,    // Approximate optimal scale (for annotation)
  };

  // ATC formula
  function atc(q) {
    return (EOS.fixedCost / q) + EOS.variableCost;
  }

  // MC is constant (simplification: no diminishing returns in short range)
  // In reality, MC would eventually rise. We add a slight uptick after 8000.
  function mc(q) {
    if (q > 8000) return EOS.variableCost + (q - 8000) * 0.03; // Gentle diseconomies
    return EOS.variableCost;
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width * dpr;
    canvas.height = 240 * dpr;
    canvas.style.height = '240px';
    ctx.scale(dpr, dpr);
  }

  function draw(currentQ) {
    const W = canvas.width  / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);
    const pad = { top: 20, right: 20, bottom: 40, left: 65 };
    const gW = W - pad.left - pad.right;
    const gH = H - pad.top  - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    // Max ATC for scale (at min Q)
    const maxATC = atc(EOS.minQ);  // ~₹1180
    const minATC = EOS.variableCost; // ₹180 (floor)
    const scaleMax = maxATC + 50;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (gH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + gW, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + gH);
    ctx.lineTo(pad.left + gW, pad.top + gH);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px DM Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Output (units / month)', pad.left + gW / 2, H - 4);
    ctx.save();
    ctx.translate(14, pad.top + gH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Cost per unit (₹)', 0, 0);
    ctx.restore();

    // Y axis ticks
    [200, 400, 600, 800, 1000, 1180].forEach(v => {
      if (v > scaleMax) return;
      const y = pad.top + gH - (v / scaleMax) * gH;
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.textAlign = 'right';
      ctx.font = '9px DM Mono, monospace';
      ctx.fillText('₹' + v, pad.left - 5, y + 3);
    });

    // X axis ticks
    [2000, 4000, 6000, 8000, 10000].forEach(q => {
      const x = pad.left + ((q - EOS.minQ) / (EOS.maxQ - EOS.minQ)) * gW;
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.textAlign = 'center';
      ctx.font = '9px DM Mono, monospace';
      ctx.fillText(q >= 1000 ? (q / 1000) + 'k' : q, x, pad.top + gH + 14);
    });

    // ATC Curve
    const atcGrad = ctx.createLinearGradient(pad.left, 0, pad.left + gW, 0);
    atcGrad.addColorStop(0, 'rgba(0, 212, 170, 0.9)');
    atcGrad.addColorStop(0.7, 'rgba(0, 180, 130, 0.7)');
    atcGrad.addColorStop(1, 'rgba(255, 107, 53, 0.6)');  // Color shift at diseconomies

    ctx.beginPath();
    ctx.strokeStyle = atcGrad;
    ctx.lineWidth = 2.5;
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const q = EOS.minQ + (i / steps) * (EOS.maxQ - EOS.minQ);
      const a = atc(q);
      const x = pad.left + (i / steps) * gW;
      const y = pad.top + gH - (a / scaleMax) * gH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // ATC label
    ctx.fillStyle = 'rgba(0, 212, 170, 0.8)';
    ctx.font = 'bold 10px DM Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('ATC', pad.left + 8, pad.top + 16);

    // MC line (horizontal dashed line at variable cost)
    const mcY = pad.top + gH - (EOS.variableCost / scaleMax) * gH;
    ctx.strokeStyle = 'rgba(255, 200, 100, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.left, mcY);
    ctx.lineTo(pad.left + gW, mcY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255, 200, 100, 0.7)';
    ctx.font = '10px DM Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('MC = ₹' + EOS.variableCost, pad.left + gW - 4, mcY - 5);

    // Current Q marker
    const curX = pad.left + ((currentQ - EOS.minQ) / (EOS.maxQ - EOS.minQ)) * gW;
    const curATC = atc(currentQ);
    const curY = pad.top + gH - (curATC / scaleMax) * gH;

    // Vertical line at current Q
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(curX, curY);
    ctx.lineTo(curX, pad.top + gH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dot at current ATC
    ctx.fillStyle = '#00d4aa';
    ctx.beginPath();
    ctx.arc(curX, curY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(curX, curY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // ATC value callout
    const callX = Math.min(curX + 10, pad.left + gW - 80);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath();
    ctx.roundRect(callX, curY - 24, 80, 22, 4);
    ctx.fill();
    ctx.fillStyle = '#00d4aa';
    ctx.font = 'bold 11px DM Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('₹' + Math.round(curATC), callX + 8, curY - 8);

    // Savings annotation (vs min output)
    const savingsVsMin = Math.round(atc(EOS.minQ) - curATC);
    if (savingsVsMin > 10) {
      ctx.fillStyle = 'rgba(76,222,128,0.6)';
      ctx.font = '9px DM Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('−₹' + savingsVsMin + ' vs min', curX, pad.top + gH + 27);
    }
  }

  // ── Update EoS stat cards ─────────────────────────────────
  function updateStats(q) {
    const curATC = atc(q);
    const savings = atc(EOS.minQ) - curATC;
    const totalCost = curATC * q;
    const fixedPerUnit = EOS.fixedCost / q;

    setEl('eos-atc',     '₹' + Math.round(curATC));
    setEl('eos-fixed',   '₹' + Math.round(fixedPerUnit));
    setEl('eos-savings', '₹' + Math.round(savings));
    setEl('eos-total',   '₹' + formatLakh(totalCost));
    setEl('eos-qty',     q.toLocaleString('en-IN') + ' units');

    // Update slider label
    const qLabel = document.getElementById('eos-q-label');
    if (qLabel) qLabel.textContent = q.toLocaleString('en-IN') + ' units / month';
  }

  function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function formatLakh(val) {
    if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + 'L';
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }

  // ── Wire slider ───────────────────────────────────────────
  slider.addEventListener('input', () => {
    const q = parseInt(slider.value);
    updateStats(q);
    draw(q);
  });

  resizeCanvas();
  updateStats(parseInt(slider.value));
  draw(parseInt(slider.value));
  window.addEventListener('resize', () => {
    resizeCanvas();
    draw(parseInt(slider.value));
  });
}

// ── Utility: Animate a number counting up ────────────────────
function animateNumber(el, from, to, duration, suffix = '') {
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const val = Math.round(from + (to - from) * easeOut(p));
    el.textContent = val + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
