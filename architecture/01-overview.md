# Architecture Overview

## System Boundary

The application is a **client-only single-page application (SPA)**. All logic runs in the user's browser; there is no application server or database.

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React App (Vite bundle)                                    │  │
│  │  • UI components (inputs, charts, cards)                    │  │
│  │  • Calculation utilities (finance, tax)                      │  │
│  │  • State (React useState)                                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  (no outbound API calls for app logic)
                              ▼
                    Static asset delivery only
                    (HTML, JS, CSS from Vercel CDN)
```

## High-Level Layers

| Layer | Responsibility |
|-------|----------------|
| **Entry** | `main.tsx` mounts the React app into `#root`; `index.html` is the single HTML shell. |
| **App** | `App.tsx` composes the dashboard layout and holds shared state (e.g. annual income goal) passed to children. |
| **Features** | Four feature components: Income Calculator, Savings Projection, Allocation Planner, Tax Strategy Planner. |
| **Charts** | Reusable Chart.js wrappers (Line, Bar, Pie) in `Charts.tsx`. |
| **Utils** | Pure functions for finance and tax calculations; no UI, no I/O. |

## Deployment Model

- **Build:** `npm run build` produces a static `dist/` (HTML + JS + CSS).
- **Hosting:** Vercel serves the `dist/` output. Optional GitHub integration triggers a new deployment on every push to the linked branch (e.g. `main`).
- **Runtime:** User opens the app URL; the browser loads the SPA and executes all logic locally.

## Design Decisions

- **No backend:** Keeps the project simple, free to host, and avoids handling sensitive financial data on a server.
- **State in React:** No global store (e.g. Redux); parent state and callbacks are sufficient for the current scope.
- **Formulas in utils:** All retirement and tax math live in `financeCalculations.ts` and `taxCalculations.ts` for clarity and testability.
