# Performance Review — Kill Criteria

**Date:** 2026-05-23  
**Stack:** React 19 + Vite 6 SPA on Vercel  
**Build baseline:** `npm run build` → JS 269 KB (87 KB gzip), CSS 32 KB (6 KB gzip), fonts **7.2 MB**

---

## Critical

### 1. Four uncompressed TTF font files (~7.2 MB total)

| File | Size |
|------|------|
| `public/fonts/google-sans/google-sans-{400,500,600,700}.ttf` | ~1.8 MB each |

**Where:** `src/styles/fonts.css`, `public/fonts/google-sans/`  
**Why it matters:** On Philippine mobile (3G/4G, data caps), first visit may download **7+ MB** before text renders crisply. This dominates LCP/FCP and dwarfs the 87 KB JS bundle. All four weights are referenced in CSS modules (400–700), so the browser will fetch multiple files during the session.  
**Fix:**
1. Convert to **WOFF2** (typically 60–70% smaller than TTF).
2. Prefer a **single variable font** file if licensing allows.
3. Add `<link rel="preload" href="/fonts/google-sans/google-sans-400.woff2" as="font" type="font/woff2" crossorigin>` in `index.html` for LCP text.
4. Add `size-adjust` / fallback metrics on `--sans` to reduce CLS during swap.

**Expected:** LCP −1–3 s on 3G; total transfer −5+ MB first visit.

---

## High

### 2. No route or vendor code splitting

**Where:** `src/App.tsx` — eager imports of `Hub`, `Flow`, `Disclosure`; `vite.config.ts` — no `manualChunks`.  
**Why:** Single 269 KB JS chunk loads React 19 + React Router 7 + all routes + all flow data before Hub is interactive. Hub-only visitors pay for Flow/Disclosure code.  
**Fix:**
```tsx
// App.tsx
const Flow = lazy(() => import("./routes/Flow"));
const Disclosure = lazy(() => import("./routes/Disclosure"));
// Wrap Routes in <Suspense fallback={…}>
```
```ts
// vite.config.ts
build: { rollupOptions: { output: { manualChunks: { vendor: ["react", "react-dom", "react-router-dom"] } } } }
```
**Expected:** Hub FCP/TTI −20–40 KB gzip on first paint; better cache stability for vendor chunk.

### 3. All flow data eagerly bundled

**Where:** `src/data/flows.ts` imports `quitJob`, `changeEmployer`, `leaveProfession`; consumed by `Hub.tsx` (`flowList`) and `useFlowState`.  
**Why:** ~25 KB source (~8–10 KB minified) always in main chunk even when user picks one flow.  
**Fix:** Dynamic `import()` per flow in `getFlow()`; Hub can import lightweight metadata-only export (titles, accents) without full node graphs.  
**Expected:** −5–10 KB gzip from initial chunk (modest but free).

### 4. Missing long-cache headers for hashed assets

**Where:** `vercel.json` — only `/fonts/(.*)` has `Cache-Control: immutable`; `/assets/*` has no rule.  
**Why:** Vercel defaults may revalidate JS/CSS on repeat visits; hashed filenames are safe for 1-year immutable cache.  
**Fix:** Add header rule for `/assets/(.*)` → `public, max-age=31536000, immutable`. Keep `index.html` uncached or short TTL. Sync with `src/config/security-headers.ts` + test.  
**Expected:** Faster repeat visits; lower origin bandwidth.

### 5. No font preload in HTML

**Where:** `index.html` — no `rel="preload"` for primary text face.  
**Why:** LCP element is likely Hub headline (`font-weight: 500`). Font discovery waits for CSS parse chain: HTML → JS → CSS → `@font-face`.  
**Fix:** Preload weight 500 (most common in Hub/QuestionCard) or variable font file.  
**Expected:** LCP −200–500 ms on slow networks.

---

## Medium

### 6. Minimal Vite production config

**Where:** `vite.config.ts` — default chunking only.  
**Fix:** Add `build.target: 'es2020'`, `cssCodeSplit: true` (default), consider `rollup-plugin-visualizer` in CI. Set `build.chunkSizeWarningLimit` after splitting to catch regressions.

### 7. Complex layered background paint

**Where:** `src/styles/background.css` — 7 gradients on `body`, fixed `::before`/`::after` pseudo-elements, `color-mix()`.  
**Why:** Extra paint/composite work on low-end Android GPUs during scroll.  
**Fix:** Profile on Moto G-class device; consider simplifying to 2–3 layers or `will-change: transform` on fixed layers. Already respects `prefers-reduced-motion` for decorative SVG overlay.

### 8. localStorage write on every navigation step

**Where:** `src/hooks/useFlowState.ts` — `useEffect` calls `saveStoredSession` on `[flowId, currentNodeId, path, hydrated]`.  
**Why:** Synchronous `localStorage.setItem` can block main thread briefly; fires once per answer (acceptable) but also on hydration.  
**Fix:** Debounce 100–300 ms or save only in `choose`/`goBack`/`restart` handlers. Use `flowSession.ts` validation consistently (Hub uses it; hook has lighter validation).

### 9. Duplicate `useReducedMotion` listeners

**Where:** `ChoiceButtons.tsx`, `StepTransition.tsx` each call `useReducedMotion()`.  
**Fix:** Lift to `FlowShell` context or read once in `Flow.tsx` and pass prop. Minor INP/listener overhead.

### 10. `font-display: swap` without metric overrides

**Where:** `src/styles/fonts.css`  
**Why:** Swap can cause CLS when custom font loads (headlines use `clamp()` sizes).  
**Fix:** Add `@font-face` `size-adjust`, `ascent-override`, `descent-override` for Google Sans vs system-ui fallback.

---

## Low / Nice-to-have

### 11. `getMaxDepth()` tree walk at runtime

**Where:** `src/data/flows.ts`, called from `Flow.tsx` via `useMemo`.  
**Fix:** Precompute `maxDepth` in each flow definition at author time. Negligible cost today (~small trees).

### 12. Lazy-load Disclosure route

**Where:** `src/routes/Disclosure.tsx`, `src/data/disclosure.ts` (~4 KB).  
**Fix:** Include in route-level `lazy()` split. Small win.

### 13. `StrictMode` in production entry

**Where:** `src/main.tsx`  
**Note:** Dev-only double effects; no production perf impact. Keep for dev quality.

### 14. OG image not optimized

**Where:** `public/og-image.png` (89 KB) — social crawlers only, not user-facing LCP.

### 15. No bundle analyzer in CI

**Fix:** Add `vite-bundle-visualizer` or `rollup-plugin-visualizer` to catch regressions on PRs.

---

## Core Web Vitals Risk Summary

| Metric | Risk | Primary cause |
|--------|------|---------------|
| **LCP** | High | 7 MB fonts + no preload; text is LCP element |
| **INP** | Low | Small component tree; `choose()` is lightweight; ripples gated by reduced-motion |
| **CLS** | Medium | `font-display: swap` without size-adjust; sticky choice bar may shift layout |
| **FCP** | High | Fonts + single large JS chunk before first paint |
| **TTFB** | Low | Static SPA on Vercel edge — excellent |

---

## Already Done Well

- **Lean dependencies** — only React, React DOM, React Router; no UI library bloat.
- **CSS Modules** — scoped styles, no Tailwind runtime; 6 KB gzip total CSS.
- **Reduced motion** — global CSS `@media (prefers-reduced-motion)`, `useReducedMotion` hook, animations/ripples disabled appropriately.
- **Native `<details>` for references** — `ReferencePanel` avoids JS accordion overhead.
- **Session persistence** — validated reads in `flowSession.ts`; resume UX without server.
- **Mobile-first tokens** — `--tap-min: 58px`, `100dvh`, `clamp()` typography, safe-area aware.
- **Security + font caching** — CSP headers; `/fonts/*` immutable 1-year cache in `vercel.json`.
- **Data size is modest** — ~25 KB total flow source; not a bottleneck compared to fonts.
- **No images in app UI** — no `<img>` LCP candidates; SVG mark is CSS-only (`FieldnotesMark`).
- **Accessibility focus management** — `Flow.tsx` focuses main on step change (good for a11y, minimal perf cost).

---

## Recommended Priority Order

1. Convert fonts to WOFF2 (or variable font) + preload primary weight  
2. Lazy routes + vendor chunk split  
3. Add `/assets/*` cache headers in `vercel.json`  
4. Dynamic flow data imports  
5. Font metric overrides for CLS  
6. Background CSS simplification (if profiling confirms)

---

## Build Commands Reference

```bash
npm run build          # Inspect dist/ sizes
npx vite-bundle-visualizer  # Treemap (dev)
```

**Total first-visit weight (approx.):** ~7.5 MB uncached → target **< 500 KB** after font optimization.
