/**
 * demandShift.js — Section 1: Market Shock (Demand Curve)
 *
 * ECONOMIC ASSUMPTIONS (comment these for presenter awareness):
 * - We model demand for face masks using a simplified linear demand curve
 * - In 2020 (pandemic peak): Demand is extremely high; consumers willing to pay premium prices
 * - In 2021: Demand softening as vaccines roll out
 * - In 2022: Demand normalizing; approaching pre-pandemic levels
 * - In 2023: Demand at a low equilibrium; masks are generic commodity
 *
 * SIMPLIFICATION: Real demand curves are non-linear and market-specific.
 *   We use a stylized linear model to illustrate the concept clearly.
 *
 * GRAPH: Price (Y-axis) vs Quantity (X-axis)
 *   - Demand curve shifts LEFT as year increases (demand falls post-2020)
 *   - Price falls correspondingly at any given quantity
 */

export function initDemandShift() {
  const canvas = document.getElementById('demand-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('year-slider');
  const yearDisplay = document.getElementById('year-display');

  // ── Data by year ──────────────────────────────────────────
  // Each year defines: demandShift (horizontal offset), equilibrium price, qty, label
  const yearData = {
    2020: {
      shift: 0,                    // Demand curve far right (peak demand)
      eqPrice: 420,                // ₹420 per box (N95 at pandemic peak)
      eqQty: 0.80,                 // 80% of chart width
      label: 'Pandemic Surge',
      priceLabel: '₹420 / box',
      deltaPrice: '+280% vs pre-pandemic',
      deltaQty: '+340% volume surge',
      sentiment: 'PANIC BUYING',
    },
    2021: {
      shift: -0.12,
      eqPrice: 310,
      eqQty: 0.65,
      label: 'Vaccine Rollout',
      priceLabel: '₹310 / box',
      deltaPrice: '−26% from peak',
      deltaQty: '−18% volume',
      sentiment: 'STABILIZING',
    },
    2022: {
      shift: -0.26,
      eqPrice: 195,
      eqQty: 0.48,
      label: 'Return to Normal',
      priceLabel: '₹195 / box',
      deltaPrice: '−54% from peak',
      deltaQty: '−40% volume',
      sentiment: 'DECLINING',
    },
    2023: {
      shift: -0.40,
      eqPrice: 110,
      eqQty: 0.32,
      label: 'Commodity Market',
      priceLabel: '₹110 / box',
      deltaPrice: '−74% from peak',
      deltaQty: '−62% volume',
      sentiment: 'OVERSUPPLY',
    },
  };

  // Colors
  const COLORS = {
    demand2020: 'rgba(255, 107, 53, 0.9)',   // Orange: high demand
    demand:     'rgba(255, 107, 53, 0.65)',
    supply:     'rgba(100, 180, 255, 0.7)',
    eq:         'rgba(255, 255, 100, 0.9)',
    grid:       'rgba(255,255,255,0.06)',
    text:       'rgba(248, 245, 240, 0.6)',
    axis:       'rgba(255,255,255,0.18)',
  };

  let currentYear = 2020;
  let animFrame = null;
  let renderProgress = 1;  // 0→1 for transition animation
  let prevData = yearData[2020];
  let targetData = yearData[2020];

  // ── Resize canvas to its CSS size ────────────────────────
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = 280 * dpr;
    canvas.style.height = '280px';
    ctx.scale(dpr, dpr);
    draw(1);
  }

  // ── Draw the full graph ───────────────────────────────────
  function draw(progress) {
    const W = canvas.width  / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);
    const pad = { top: 20, right: 30, bottom: 45, left: 55 };
    const gW = W - pad.left - pad.right;
    const gH = H - pad.top  - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 10);
    ctx.fill();

    // Grid lines
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (gH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + gW, y);
      ctx.stroke();
      const x = pad.left + (gW / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + gH);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = COLORS.axis;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + gH);
    ctx.lineTo(pad.left + gW, pad.top + gH);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = COLORS.text;
    ctx.font = '11px DM Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Quantity (units / month)', pad.left + gW / 2, H - 6);
    ctx.save();
    ctx.translate(14, pad.top + gH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Price (₹ / box)', 0, 0);
    ctx.restore();

    // Price axis ticks
    const prices = [100, 200, 300, 400];
    const maxP = 500;
    ctx.textAlign = 'right';
    prices.forEach(p => {
      const y = pad.top + gH - (p / maxP) * gH;
      ctx.fillStyle = COLORS.text;
      ctx.fillText('₹' + p, pad.left - 6, y + 4);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + gW, y);
      ctx.stroke();
    });

    // ── Interpolate between prev and target data ──
    const d = lerpData(prevData, targetData, easeInOut(progress));

    // Supply curve (relatively stable; slight shift for context)
    // Supply is fixed here to keep focus on demand shift
    const supplyStartX = pad.left + gW * 0.05;
    const supplyStartY = pad.top  + gH * 0.9;
    const supplyEndX   = pad.left + gW * 0.95;
    const supplyEndY   = pad.top  + gH * 0.05;

    ctx.strokeStyle = COLORS.supply;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(supplyStartX, supplyStartY);
    ctx.lineTo(supplyEndX, supplyEndY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Supply label
    ctx.fillStyle = COLORS.supply;
    ctx.font = '11px DM Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Supply (S)', supplyEndX - 60, supplyEndY + 14);

    // ── Demand curve ─────────────────────────────────────
    // Shift amount maps to horizontal offset on the chart
    const shiftPx = d.shift * gW;

    const demStartX = pad.left + gW * 0.05 + shiftPx;
    const demStartY = pad.top  + gH * 0.08;
    const demEndX   = pad.left + gW * 0.80 + shiftPx;
    const demEndY   = pad.top  + gH * 0.95;

    // Gradient along demand line
    const demGrad = ctx.createLinearGradient(demStartX, demStartY, demEndX, demEndY);
    demGrad.addColorStop(0, COLORS.demand2020);
    demGrad.addColorStop(1, 'rgba(255, 107, 53, 0.3)');

    ctx.strokeStyle = demGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(demStartX, demStartY);
    ctx.lineTo(demEndX, demEndY);
    ctx.stroke();

    // Demand label
    ctx.fillStyle = COLORS.demand2020;
    ctx.font = 'bold 11px DM Mono, monospace';
    ctx.textAlign = 'right';
    const labelYear = Math.round(prevData._year + (targetData._year - prevData._year) * easeInOut(progress));
    ctx.fillText(`D (${labelYear})`, Math.min(demStartX + 50, pad.left + gW - 5), demStartY + 16);

    // ── Equilibrium point ─────────────────────────────────
    // Find intersection of supply line and demand line
    // Supply: y = supplyStartY + (supplyEndY - supplyStartY) * t,  x = supplyStartX + (supplyEndX - supplyStartX) * t
    // Demand: parameterized similarly; find intersection
    const eqX = pad.left + d.eqQty * gW;
    const supplySlope = (supplyEndY - supplyStartY) / (supplyEndX - supplyStartX);
    const eqY = supplyStartY + supplySlope * (eqX - supplyStartX);

    // Equilibrium dashed lines
    ctx.strokeStyle = 'rgba(255,255,100,0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(eqX, eqY);
    ctx.lineTo(eqX, pad.top + gH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(eqX, eqY);
    ctx.lineTo(pad.left, eqY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Price label on Y axis
    const priceRatio = 1 - (eqY - pad.top) / gH;
    const dispPrice  = Math.round(priceRatio * maxP);
    ctx.fillStyle = COLORS.eq;
    ctx.font = '11px DM Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('₹' + dispPrice, pad.left - 6, eqY + 4);

    // Equilibrium dot
    ctx.fillStyle = COLORS.eq;
    ctx.beginPath();
    ctx.arc(eqX, eqY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(eqX, eqY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Equilibrium label
    ctx.fillStyle = COLORS.eq;
    ctx.font = 'bold 10px DM Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('E*', eqX + 10, eqY - 6);
  }

  // ── Lerp helper ───────────────────────────────────────────
  function lerpData(a, b, t) {
    return {
      shift:   a.shift   + (b.shift   - a.shift)   * t,
      eqPrice: a.eqPrice + (b.eqPrice - a.eqPrice) * t,
      eqQty:   a.eqQty   + (b.eqQty   - a.eqQty)   * t,
      _year:   a._year   + (b._year   - a._year)   * t,
    };
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // ── Animate transition ────────────────────────────────────
  function animateTo(newYear) {
    prevData   = { ...yearData[currentYear], _year: currentYear };
    targetData = { ...yearData[newYear],     _year: newYear };
    currentYear = newYear;

    let start = null;
    const duration = 500; // ms

    cancelAnimationFrame(animFrame);
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      draw(p);
      if (p < 1) animFrame = requestAnimationFrame(step);
    }
    animFrame = requestAnimationFrame(step);
  }

  // ── Update stat cards ─────────────────────────────────────
  function updateStats(year) {
    const d = yearData[year];
    setEl('stat-price',      d.priceLabel);
    setEl('stat-delta-price', d.deltaPrice);
    setEl('stat-delta-qty',   d.deltaQty);
    setEl('stat-sentiment',   d.sentiment);
    setEl('stat-label-text',  d.label);

    // Update card highlight classes
    const priceCard = document.getElementById('stat-card-price');
    const sentCard  = document.getElementById('stat-card-sent');
    if (priceCard) {
      priceCard.className = 'stat-card ' + (year <= 2020 ? 'highlight' : year >= 2023 ? 'negative' : '');
    }
    if (sentCard) {
      const sentEl = sentCard.querySelector('.stat-delta');
      if (sentEl) sentEl.className = 'stat-delta ' + (year <= 2020 ? 'up' : 'down');
    }
  }

  function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // ── Wire slider ───────────────────────────────────────────
  if (slider) {
    slider.addEventListener('input', () => {
      const year = parseInt(slider.value);
      if (yearDisplay) yearDisplay.textContent = year;
      updateStats(year);
      animateTo(year);
    });
  }

  // Initial render
  prevData._year   = 2020;
  targetData._year = 2020;
  updateStats(2020);
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}
