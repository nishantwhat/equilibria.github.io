/**
 * supplyShift.js — Section 4: Market Impact (Supply + Equilibrium)
 *
 * ECONOMIC CONCEPTS:
 * 1. Supply curve shift:
 *    - Masks: Supply INCREASES (more producers entered during pandemic)
 *      → Supply curve shifts RIGHT → price falls → oversupply at old price
 *    - Fashion: Supply INCREASES (factories retooling, new capacity)
 *      → BUT demand is also rising → equilibrium settles at new price
 *
 * 2. New market equilibrium:
 *    - Masks: New equilibrium is lower price, higher quantity supplied
 *      (but demand hasn't kept up → market glut)
 *    - Fashion: New equilibrium shows healthy price + quantity balance
 *
 * SIMPLIFICATION:
 *   We use stylized linear supply and demand curves.
 *   Real supply curves are more complex (stepped, kinked, non-linear).
 *   The graph is meant to illustrate directional shifts, not precise values.
 *
 * Two modes: "Mask Market" vs "Fashion Market"
 * Each shows original S/D + shifted S/D + old/new equilibrium
 */

export function initSupplyShift() {
  const canvas = document.getElementById('supply-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const toggleBtns = document.querySelectorAll('.supply-tog-btn');

  // ── Market configurations ─────────────────────────────────
  const markets = {
    masks: {
      label: 'Mask Market',
      color: '#e94560',

      // Original equilibrium (2020): High price, moderate qty
      origEq:  { price: 420, qty: 0.45 },

      // New equilibrium (2023): Much lower price, slightly higher qty (oversupply)
      newEq:   { price: 110, qty: 0.60 },

      // Supply shift direction: RIGHT (supply increased due to new entrants)
      supplyShift: +0.22,

      // Demand shift direction: LEFT (demand collapsed post-pandemic)
      demandShift: -0.30,

      // Labels for callouts
      story: 'Supply surged as factories mass-produced masks → Price collapsed',
      supplyNote: 'S₁ → S₂ (new entrants flooded market)',
      demandNote: 'D₁ → D₂ (demand collapsed post-pandemic)',

      // Equilibrium changes
      eqPriceOld: '₹420', eqPriceNew: '₹110',
      eqQtyOld: 'Moderate', eqQtyNew: 'High (glut)',
      eqPriceDelta: '−74%',
      eqPriceDeltaClass: 'down',
      eqWelfareNote: 'Consumer surplus ↑ (cheap masks), Producer surplus ↓ (many exit market)',
    },
    fashion: {
      label: 'Fashion Market',
      color: '#00d4aa',

      origEq:  { price: 400, qty: 0.40 },
      newEq:   { price: 650, qty: 0.58 },

      supplyShift: +0.15,  // Supply increases (more factories retool)
      demandShift: +0.20,  // Demand also rises (urban fashion growth)

      story: 'Demand-led growth: fashion wear booms, supply catches up',
      supplyNote: 'S₁ → S₂ (factories retool, capacity grows)',
      demandNote: 'D₁ → D₂ (rising urban demand + aspirational buying)',

      eqPriceOld: '₹400', eqPriceNew: '₹650',
      eqQtyOld: 'Moderate', eqQtyNew: 'Higher',
      eqPriceDelta: '+63%',
      eqPriceDeltaClass: 'up',
      eqWelfareNote: 'Both consumers and producers benefit — expanding market with improving margins',
    },
  };

  let activeMarket = 'masks';
  let animFrame   = null;
  let progress    = 1;
  let showShifted = false;

  // ── Toggle between original and shifted curves ─────────────
  // We reveal shifts progressively after a short delay
  let shiftTimeout = null;

  function setMarket(key) {
    activeMarket = key;
    showShifted  = false;
    progress     = 0;

    clearTimeout(shiftTimeout);
    shiftTimeout = setTimeout(() => {
      showShifted = true;
      animateIn();
    }, 800);

    updateStats(key, false);
    draw(0, false);
    animateIn();
  }

  function animateIn() {
    let start = null;
    cancelAnimationFrame(animFrame);
    function step(ts) {
      if (!start) start = ts;
      progress = Math.min((ts - start) / 600, 1);
      draw(progress, showShifted);
      if (progress < 1) animFrame = requestAnimationFrame(step);
      else updateStats(activeMarket, showShifted);
    }
    animFrame = requestAnimationFrame(step);
  }

  // ── Draw the supply-demand graph ──────────────────────────
  function draw(p, shifted) {
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width  / dpr;
    const H = canvas.height / dpr;
    const pad = { top: 24, right: 28, bottom: 48, left: 62 };
    const gW = W - pad.left - pad.right;
    const gH = H - pad.top  - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    const market = markets[activeMarket];
    const ease = easeInOut(p);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (gH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + gW, y); ctx.stroke();
      const x = pad.left + (gW / 4) * i;
      ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + gH); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + gH);
    ctx.lineTo(pad.left + gW, pad.top + gH);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '10px DM Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Quantity', pad.left + gW / 2, H - 5);
    ctx.save();
    ctx.translate(14, pad.top + gH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Price (₹)', 0, 0);
    ctx.restore();

    // Price ticks
    const priceLabels = activeMarket === 'masks'
      ? [100, 200, 300, 400]
      : [200, 300, 400, 500, 600];
    const maxP = activeMarket === 'masks' ? 500 : 750;

    ctx.textAlign = 'right';
    ctx.font = '9px DM Mono, monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    priceLabels.forEach(p => {
      const y = pad.top + gH - (p / maxP) * gH;
      ctx.fillText('₹' + p, pad.left - 5, y + 3);
    });

    // ── Original Demand curve (D1) ────────────────────────
    drawLine(ctx,
      { x: pad.left + gW * 0.05, y: pad.top + gH * 0.05 },
      { x: pad.left + gW * 0.85, y: pad.top + gH * 0.95 },
      'rgba(100, 160, 255, 0.7)', 2, false, null
    );

    labelLine(ctx, pad.left + gW * 0.83, pad.top + gH * 0.75,
      'D₁', 'rgba(100,160,255,0.8)', 'left');

    // ── Original Supply curve (S1) ────────────────────────
    drawLine(ctx,
      { x: pad.left + gW * 0.08, y: pad.top + gH * 0.92 },
      { x: pad.left + gW * 0.88, y: pad.top + gH * 0.08 },
      'rgba(180, 140, 255, 0.7)', 2, false, null
    );

    labelLine(ctx, pad.left + gW * 0.84, pad.top + gH * 0.20,
      'S₁', 'rgba(180,140,255,0.8)', 'left');

    // ── Original equilibrium E1 ───────────────────────────
    const origEqX = pad.left + market.origEq.qty * gW;
    const origEqY = pad.top + gH - (market.origEq.price / maxP) * gH;

    drawEqLines(ctx, origEqX, origEqY, pad, gH, 'rgba(255,200,100,0.25)');

    ctx.fillStyle = 'rgba(255,200,100,0.6)';
    ctx.beginPath();
    ctx.arc(origEqX, origEqY, 5, 0, Math.PI * 2);
    ctx.fill();

    labelLine(ctx, origEqX + 10, origEqY - 10,
      'E₁ ' + market.eqPriceOld, 'rgba(255,200,100,0.7)', 'left');

    // ── Shifted curves (revealed after delay) ─────────────
    if (shifted && ease > 0) {
      const dShift = market.demandShift * ease;
      const sShift = market.supplyShift * ease;

      // Shifted Demand D2
      drawLine(ctx,
        { x: pad.left + gW * (0.05 + dShift), y: pad.top + gH * 0.05 },
        { x: pad.left + gW * (0.85 + dShift), y: pad.top + gH * 0.95 },
        market.color + 'CC', 2.5, true, null,
        ease
      );

      labelLine(ctx,
        pad.left + gW * Math.min(0.83 + dShift, 0.94),
        pad.top + gH * 0.6,
        'D₂', market.color, 'left'
      );

      // Shifted Supply S2
      drawLine(ctx,
        { x: pad.left + gW * (0.08 + sShift), y: pad.top + gH * 0.92 },
        { x: pad.left + gW * (0.88 + sShift), y: pad.top + gH * 0.08 },
        market.color + '99', 2.5, true, null,
        ease
      );

      labelLine(ctx,
        pad.left + gW * Math.min(0.84 + sShift, 0.94),
        pad.top + gH * 0.22,
        'S₂', market.color + 'BB', 'left'
      );

      // New equilibrium E2
      const newEqX = pad.left + market.newEq.qty * gW;
      const newEqY = pad.top + gH - (market.newEq.price / maxP) * gH;
      const animX  = origEqX + (newEqX - origEqX) * ease;
      const animY  = origEqY + (newEqY - origEqY) * ease;

      drawEqLines(ctx, animX, animY, pad, gH, market.color + '30');

      // Arrow from E1 to E2
      if (ease > 0.5) {
        drawArrow(ctx, origEqX, origEqY, animX, animY,
          market.color + Math.round((ease - 0.5) * 2 * 255).toString(16).padStart(2, '0'));
      }

      ctx.fillStyle = market.color;
      ctx.beginPath();
      ctx.arc(animX, animY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(animX, animY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      if (ease > 0.7) {
        labelLine(ctx, animX + 12, animY - 12,
          'E₂ ' + market.eqPriceNew, market.color, 'left');
      }
    }
  }

  // ── Helper: draw a curve line ─────────────────────────────
  function drawLine(ctx, from, to, color, width, dashed, _gradient, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth   = width;
    if (dashed) ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function labelLine(ctx, x, y, text, color, align) {
    ctx.fillStyle  = color;
    ctx.font       = 'bold 11px DM Mono, monospace';
    ctx.textAlign  = align;
    ctx.fillText(text, x, y);
  }

  function drawEqLines(ctx, x, y, pad, gH, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x, pad.top + gH);
    ctx.moveTo(x, y); ctx.lineTo(pad.left, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawArrow(ctx, x1, y1, x2, y2, color) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const len   = Math.hypot(x2 - x1, y2 - y1);
    if (len < 10) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrowhead
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(x2, y2);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, -5);
    ctx.lineTo(-10, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  // ── Update stat callout cards ─────────────────────────────
  function updateStats(key, shifted) {
    const market = markets[key];

    const priceEl = document.getElementById('eq-price-new');
    const deltaEl = document.getElementById('eq-price-delta');
    const storyEl = document.getElementById('eq-story');
    const welfEl  = document.getElementById('eq-welfare');

    if (priceEl) {
      priceEl.textContent = shifted ? market.eqPriceNew : market.eqPriceOld;
      priceEl.style.color = shifted
        ? (market.eqPriceDeltaClass === 'up' ? 'var(--s4-accent)' : 'var(--s2-accent)')
        : 'var(--white)';
    }

    if (deltaEl) {
      deltaEl.textContent = shifted ? market.eqPriceDelta : '— original equilibrium';
      deltaEl.className   = 'eq-stat-change ' + (shifted ? market.eqPriceDeltaClass : '');
    }

    if (storyEl) storyEl.textContent = market.story;
    if (welfEl)  welfEl.textContent  = market.eqWelfareNote;
  }

  // ── Resize canvas ─────────────────────────────────────────
  function resizeCanvas() {
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width * dpr;
    canvas.height = 320 * dpr;
    canvas.style.height = '320px';
    ctx.scale(dpr, dpr);
    draw(1, showShifted);
  }

  // ── Wire toggle buttons ───────────────────────────────────
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.market;
      if (!key || key === activeMarket) return;

      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setMarket(key);
    });
  });

  resizeCanvas();
  setMarket('masks');
  window.addEventListener('resize', resizeCanvas);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
