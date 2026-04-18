/**
 * profitTool.js — Section 2: Profit & Cost Analysis
 *
 * ECONOMIC ASSUMPTIONS:
 * - All figures are per unit (per box of 50 masks, or per garment)
 * - "Masks 2020": Pandemic boom — high revenue, but raw material costs surged too
 * - "Masks 2023": Post-pandemic slump — margins severely compressed
 *   (price fell faster than cost, due to raw material contracts + oversupply)
 * - "Fashion 2023": Factory retooled; better margin due to differentiated product,
 *   brand positioning, and reduced commodity risk
 *
 * OPPORTUNITY COST shown = Profit forgone by NOT switching to fashion
 *
 * SIMPLIFICATION: We use per-unit gross margin as a proxy for profitability.
 *   Fixed cost amortization and full COGS breakdown are omitted for clarity.
 *
 * Numbers are illustrative but internally consistent and economically plausible.
 */

export function initProfitTool() {
  const toggleBtns = document.querySelectorAll('.tog-btn');
  if (!toggleBtns.length) return;

  // ── Data ──────────────────────────────────────────────────
  // All values in ₹ per unit
  const scenarios = {
    masks2020: {
      label:       'Masks (2020)',
      color:       '#ff6b35',
      revenue:     420,   // High selling price at pandemic peak
      rawMaterial: 180,   // Raw material cost spiked (global shortage)
      labour:       60,   // Overtime labour
      overhead:     40,   // Fixed overhead per unit
      profit:       140,  // Profit = Revenue − All Costs
      profitLabel: '+₹140',
      profitClass: 'positive',
      note: 'Pandemic demand drove price to ₹420/box. Raw material costs also rose due to global supply crunch.',
    },
    masks2023: {
      label:       'Masks (2023)',
      color:       '#e94560',
      revenue:     110,   // Price collapsed as demand fell and supply remained high
      rawMaterial:  65,   // Some cost reduction, but not proportional
      labour:       35,
      overhead:     40,   // Fixed overhead stays the same
      profit:      -30,   // LOSS — price below break-even
      profitLabel: '−₹30 (LOSS)',
      profitClass: 'negative',
      note: 'Price fell 74% from peak. Fixed costs remain. Oversupply market means selling below break-even.',
    },
    fashion2023: {
      label:       'Fashion Wear (2023)',
      color:       '#00d4aa',
      revenue:     650,   // Retail fashion garment — differentiated product
      rawMaterial: 220,   // Higher quality fabric
      labour:       90,   // Skilled labour, higher wage
      overhead:     80,   // Retooling amortized; higher per-unit overhead initially
      profit:       260,  // Strong margin on differentiated product
      profitLabel: '+₹260',
      profitClass: 'positive',
      note: 'Fashion wear commands premium pricing. Higher costs but significantly better margins.',
    },
  };

  let activeScenario = 'masks2020';
  let compareScenario = null; // for opportunity cost

  const canvas = document.getElementById('waterfall-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  // ── Render waterfall bar chart ────────────────────────────
  function renderChart(scKey) {
    if (!ctx) return;
    const sc = scenarios[scKey];
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width * dpr;
    canvas.height = 240 * dpr;
    canvas.style.height = '240px';
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = 240;
    const pad = { top: 20, right: 20, bottom: 40, left: 60 };
    const gW = W - pad.left - pad.right;
    const gH = H - pad.top  - pad.bottom;

    ctx.clearRect(0, 0, W, H);

    // Bars: Revenue, RawMat, Labour, Overhead, Profit
    const bars = [
      { label: 'Revenue',     value: sc.revenue,     color: sc.color, type: 'positive' },
      { label: 'Raw Mat.',    value: -sc.rawMaterial, color: '#e94560', type: 'negative' },
      { label: 'Labour',      value: -sc.labour,      color: '#e05030', type: 'negative' },
      { label: 'Overhead',    value: -sc.overhead,    color: '#c04020', type: 'negative' },
      { label: 'Profit',      value: sc.profit,       color: sc.profit >= 0 ? '#4cde80' : '#e94560', type: 'result' },
    ];

    const maxVal = sc.revenue + 50; // Scale reference
    const barW = (gW / bars.length) * 0.55;
    const spacing = gW / bars.length;
    const baseY = pad.top + gH * 0.7; // Baseline at 70% from top (allows negatives below)

    // Axis
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, baseY);
    ctx.lineTo(pad.left + gW, baseY);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + gH);
    ctx.stroke();

    // Zero line label
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px DM Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText('₹0', pad.left - 4, baseY + 4);

    // Draw bars with animation
    bars.forEach((bar, i) => {
      const x = pad.left + i * spacing + (spacing - barW) / 2;
      const heightPx = (Math.abs(bar.value) / maxVal) * (gH * 0.65);
      const y = bar.value >= 0 ? baseY - heightPx : baseY;

      // Bar
      ctx.fillStyle = bar.color;
      ctx.globalAlpha = 0.85;
      roundRect(ctx, x, y, barW, heightPx, 4);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Value label
      ctx.fillStyle = '#f8f5f0';
      ctx.font = 'bold 11px DM Mono, monospace';
      ctx.textAlign = 'center';
      const valLabel = (bar.value >= 0 ? '+' : '') + '₹' + Math.abs(bar.value);
      ctx.fillText(valLabel, x + barW / 2, bar.value >= 0 ? y - 5 : y + heightPx + 13);

      // Bar label below axis
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px DM Mono, monospace';
      ctx.fillText(bar.label, x + barW / 2, pad.top + gH + 14);
    });
  }

  // Polyfill for roundRect
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  // ── Update profit table ───────────────────────────────────
  function updateTable(scKey) {
    const sc = scenarios[scKey];

    setVal('pt-revenue',   '₹' + sc.revenue);
    setVal('pt-rawmat',   '−₹' + sc.rawMaterial);
    setVal('pt-labour',   '−₹' + sc.labour);
    setVal('pt-overhead', '−₹' + sc.overhead);

    const profitEl = document.getElementById('pt-profit');
    if (profitEl) {
      profitEl.textContent = sc.profitLabel;
      profitEl.className   = 'pt-val ' + sc.profitClass;
    }

    const noteEl = document.getElementById('profit-note');
    if (noteEl) noteEl.textContent = sc.note;

    // ── Opportunity Cost ─────────────────────────────────────
    // = What you COULD earn (fashion 2023) − What you ARE earning (current)
    // Only meaningful when showing mask scenarios
    const fashionProfit = scenarios.fashion2023.profit;
    const oppCostEl = document.getElementById('opp-value');
    const oppDescEl = document.getElementById('opp-desc');

    if (oppCostEl) {
      if (scKey === 'fashion2023') {
        oppCostEl.textContent = '₹0';
        if (oppDescEl) oppDescEl.textContent = 'No opportunity cost — you\'ve already made the optimal switch to fashion wear.';
      } else {
        const oc = fashionProfit - sc.profit;
        oppCostEl.textContent = '₹' + oc + ' / unit forgone';
        if (oppDescEl) {
          oppDescEl.textContent = scKey === 'masks2020'
            ? `In 2020, fashion wasn't yet the better option — masks were profitable. But by 2023, staying in masks costs ₹${oc}/unit in lost opportunity.`
            : `By remaining in mask production in 2023, you forgo ₹${oc} per unit that fashion wear would earn. This is the economic cost of inaction.`;
        }
      }
    }

    renderChart(scKey);
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // ── Wire toggle buttons ───────────────────────────────────
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sc = btn.dataset.scenario;
      if (!sc) return;
      activeScenario = sc;

      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      updateTable(sc);
    });
  });

  // Initial render
  updateTable('masks2020');
  window.addEventListener('resize', () => {
    if (ctx) renderChart(activeScenario);
  });
}
