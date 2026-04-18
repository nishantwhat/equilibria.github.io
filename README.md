# 📦 Supply Side Story
### Interactive Educational Webpage — Production Decisions & Supply-Side Economics

> **Topic:** A mask factory shifts from mask production to fashion wear post-pandemic.
> This page tells that story interactively, section by section, for 4 presenters.

---

## 🚀 How to Run Locally

### Option 1: VS Code Live Server (Recommended)
1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension
3. Open the project folder in VS Code
4. Right-click `index.html` → **Open with Live Server**
5. Browser opens automatically at `http://localhost:5500`

### Option 2: Python (No installs needed if Python is available)
```bash
# Navigate to the project folder
cd supply-side-story

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Node.js (npx)
```bash
cd supply-side-story
npx serve .
```

> ⚠️ **Do NOT open `index.html` directly** (file:// protocol) — ES modules won't work.
> You must use a local server.

---

## 🌐 Deploy on GitHub Pages (Step-by-Step)

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) → Click **New Repository**
2. Name it: `supply-side-story` (or any name)
3. Set to **Public**
4. Click **Create repository**

### Step 2: Upload Files
**Option A — GitHub Web UI:**
1. Open your new repository
2. Click **Upload files**
3. Drag the entire project folder contents (index.html + css/ + js/ + assets/)
4. Click **Commit changes**

**Option B — Git CLI:**
```bash
cd supply-side-story
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/supply-side-story.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your repository, click **Settings** tab
2. Scroll to **Pages** in the left sidebar
3. Under **Source**, select `Deploy from a branch`
4. Branch: **main** | Folder: **/ (root)**
5. Click **Save**

### Step 4: Access Your Site
- Wait 1–2 minutes for deployment
- Your site will be live at: `https://YOUR_USERNAME.github.io/supply-side-story/`
- GitHub shows the URL in Settings → Pages

---

## ✏️ How to Edit Content

### Changing Text Content
All text lives in `index.html`. Each section is clearly labeled:

```html
<!-- SECTION 1 — MARKET SHOCK (Speaker 1) -->
<section id="s1" ...>
  <!-- Edit headings, paragraphs, and context cards here -->
  <h2>The Demand Cliff...</h2>
  <p class="section-subtitle">In 2020, demand for masks...</p>
  
  <!-- Context cards: change the text inside .ctx-body paragraphs -->
  <div class="ctx-card">
    <p class="ctx-body">YOUR CUSTOM TEXT HERE</p>
  </div>
</section>
```

### Changing Numbers in Graphs

#### Section 1 — Demand Curve (`js/modules/demandShift.js`)
Find the `yearData` object (around line 35):
```js
const yearData = {
  2020: {
    eqPrice: 420,        // ← Change equilibrium price for 2020
    eqQty: 0.80,         // ← Quantity as fraction of chart width (0 to 1)
    priceLabel: '₹420 / box',   // ← Display label
    deltaPrice: '+280% vs pre-pandemic',  // ← Shown in stat card
  },
  2023: {
    eqPrice: 110,        // ← Price at 2023
    // ...
  }
};
```

#### Section 2 — Profit Tool (`js/modules/profitTool.js`)
Find the `scenarios` object (around line 35):
```js
const scenarios = {
  masks2020: {
    revenue:     420,   // ← Selling price per unit
    rawMaterial: 180,   // ← Raw material cost
    labour:       60,   // ← Labour cost
    overhead:     40,   // ← Fixed overhead
    profit:       140,  // ← Must equal: revenue - rawMaterial - labour - overhead
  },
  // ...
};
```
> ⚠️ Make sure `profit = revenue - rawMaterial - labour - overhead` stays correct!

#### Section 3 — Economies of Scale (`js/modules/resourceFlow.js`)
Find the `EOS` object (around line 65):
```js
const EOS = {
  fixedCost:    500000,  // ← Monthly fixed cost in ₹
  variableCost: 180,     // ← Per-unit variable cost in ₹
  minQ:         500,     // ← Minimum slider value (units)
  maxQ:         10000,   // ← Maximum slider value (units)
};
```

#### Section 4 — Supply Shift (`js/modules/supplyShift.js`)
Find the `markets` object (around line 35):
```js
const markets = {
  masks: {
    origEq:  { price: 420, qty: 0.45 },  // ← Original equilibrium point
    newEq:   { price: 110, qty: 0.60 },  // ← New equilibrium after shift
    supplyShift: +0.22,   // ← How far supply curve moves (positive = right)
    demandShift: -0.30,   // ← How far demand curve moves (negative = left)
  },
  // ...
};
```

### Changing Colors / Themes
All colors are in `css/styles.css` at the top, in `:root`:

```css
:root {
  /* Section 1 — Market Shock */
  --s1-bg:     #0f1923;    /* ← Background color */
  --s1-accent: #ff6b35;    /* ← Highlight/accent color */

  /* Section 2 — Profit */
  --s2-bg:     #1a1a2e;
  --s2-accent: #e94560;

  /* Section 3 — Production Shift */
  --s3-bg:     #0d2137;
  --s3-accent: #00d4aa;

  /* Section 4 — Market Impact */
  --s4-bg:     #0b1f0e;
  --s4-accent: #4cde80;
}
```

To change the color of an entire section:
1. Change `--s1-bg` to any dark hex color
2. Change `--s1-accent` to any bright accent color
3. Both graph and UI will automatically update

### Changing Presenter Names
In `js/main.js`, find `PRESENTER_MAP`:
```js
const PRESENTER_MAP = {
  s1: { name: 'Speaker 1 — Market Shock',     num: '01' },
  s2: { name: 'Speaker 2 — Profit Analysis',  num: '02' },
  // ← Replace with actual names, e.g.:
  s1: { name: 'Ananya — Market Shock',         num: '01' },
};
```
This updates the nav badge at the top right as sections scroll into view.

---

## 📁 File Structure

```
supply-side-story/
│
├── index.html                  ← Main HTML (all section content lives here)
│
├── css/
│   └── styles.css              ← All styles, animations, section themes, responsive
│
├── js/
│   ├── main.js                 ← Entry point: initializes modules, handles scroll/nav
│   └── modules/
│       ├── demandShift.js      ← Section 1: Demand curve canvas + year slider
│       ├── profitTool.js       ← Section 2: Profit comparison + waterfall chart
│       ├── resourceFlow.js     ← Section 3: Resource bars + economies of scale chart
│       └── supplyShift.js      ← Section 4: Supply-demand graph + equilibrium
│
└── assets/                     ← (empty) Place any images/icons here if needed
    └── .gitkeep
```

### What each file does:

| File | Responsibility |
|------|---------------|
| `index.html` | All HTML structure, section content, aria labels |
| `css/styles.css` | Design system, color variables, animations, responsive layout |
| `js/main.js` | Scroll reveal, nav tracking, module initialization, presenter badge |
| `js/modules/demandShift.js` | Canvas rendering of demand curve; year slider; stat card updates |
| `js/modules/profitTool.js` | Scenario toggle; waterfall bar chart; opportunity cost calculation |
| `js/modules/resourceFlow.js` | Animated resource bars; economies of scale slider + ATC curve |
| `js/modules/supplyShift.js` | Supply-demand graph with progressive shift animation; equilibrium tracking |

---

## 🎤 How to Use This Page While Presenting

### Before You Start
1. Open the site on a laptop connected to a projector/TV
2. Use **full browser window** (press F11 for fullscreen)
3. Close all other tabs to avoid distractions
4. Check that the nav badge at the top right reads **"Intro"**

### During the Presentation

| Speaker | What to Do |
|---------|-----------|
| **Speaker 1** | Scroll to Section 1 (orange). Drag the year slider slowly from 2020 → 2023 while explaining demand collapse. Point to the curve shifting left and the price dropping. |
| **Speaker 2** | Scroll to Section 2 (red). Click "Masks (2020)" → explain healthy profit. Then click "Masks (2023)" → show the loss. Click "Fashion (2023)" → show the opportunity. Point to the Opportunity Cost box changing. |
| **Speaker 3** | Scroll to Section 3 (teal). Let the resource bars animate. Explain the 4 transition steps as they're highlighted. Then drag the EoS slider left and right to show ATC falling with scale. |
| **Speaker 4** | Scroll to Section 4 (green). Toggle between Mask Market and Fashion Market. Wait for the equilibrium dot to animate to E₂ and explain what moved and why. |

### Tips
- **Nav badge** in the top right automatically shows which section is active — useful for knowing where you are
- **Hover** on context cards highlights them — use this to draw attention
- **Sliders** can be controlled with arrow keys for fine control during Q&A
- Each section has a distinct color, so the audience knows you've moved forward
- If the internet is slow, the Google Fonts may not load — the fallback fonts still look good

### Keyboard Shortcuts (Browsers)
- `F11` — Fullscreen
- `Ctrl/Cmd + +` — Zoom in for audience visibility
- Arrow keys — Control range sliders when focused

---

## 🧠 Design Decisions & Improvements Made

### Improvements over original brief:
1. **Added a "before/after" animated bar chart** for resource reallocation instead of static icons — this makes the transition feel real and dynamic
2. **Progressive reveal of supply shift** — curves don't appear simultaneously; S₂ and D₂ animate in after a 0.8s delay so the audience can absorb the original state first
3. **Opportunity cost is computed dynamically** based on whichever scenario is selected — not hardcoded — so it always shows the correct forgone value
4. **Economies of scale shows a diseconomy uptick** after 8,000 units — economically accurate, and it prevents the misleading impression that ATC falls forever
5. **Nav presenter badge** tells the active speaker where they are in the presentation — reduces "where are we?" confusion during live presentations
6. **All numbers are internally consistent** (profit = revenue - all costs; opportunity cost = fashion profit - current scenario profit) with explicit code comments explaining assumptions

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page / graphs not showing | You're opening the file directly. Use a local server (see above) |
| Fonts look wrong | Check internet connection — Google Fonts needs CDN access |
| Canvas is blurry | Resize browser window once to trigger DPR recalculation |
| Sliders not responding | Click once on the slider, then use arrow keys |
| Mobile layout looks off | Site is optimized for 1024px+; mobile is supported but desktop is preferred for presenting |
