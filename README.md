# CineFlow — Allu Cinemas Prototype

A front-end-only clickable prototype of the Allu Cinemas CineFlow ordering app. No backend, no real payments, no authentication — all state lives in the browser (`localStorage`).

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL (e.g. `http://localhost:5173`). The app is mobile-first — narrow the browser window or open dev tools' device toolbar for the intended experience; on wider screens it's shown inside a centred phone frame.

Other scripts:

```bash
npm run build     # production build (tsc + vite build)
npm run lint       # eslint
npm run preview    # preview the production build
```

## What's here

- **Stack:** React 19 + TypeScript + Vite, Tailwind CSS v4, React Router, Zustand (with `localStorage` persistence).
- **Flow:** Home → Menu → Product Details → Cart → Payment Method → (Fake Payment | Counter QR) → Order Tracking, plus Loyalty and Profile/reset.
- **Mock data:** `src/data/` (products, movies, loyalty rewards/activity).
- **State:** `src/store/useAppStore.ts` — cart, active order, loyalty points, reward/promo, favourites. Reset via the Profile screen clears everything back to defaults.
- **Design tokens:** `src/index.css` (`@theme` block) — colours, type, radius, shadows lifted from the CineFlow design system doc.

## Known prototype decisions

- Classic Popcorn Combo's catalogue price is pinned to its Regular size price (₹270) so the menu-grid price and the size configurator never disagree.
- The loyalty tier ladder is Blue → Gold → Grandeur (the written spec's naming, used over a screenshot that labelled the third tier "Legacy").
- The counter-payment QR encodes a harmless placeholder string — it is not a real payment QR.
