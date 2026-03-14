# Technology Stack

## Core

| Technology | Version (approx.) | Role |
|------------|-------------------|------|
| **React** | 19.x | UI library; components and state |
| **TypeScript** | 5.9 | Static typing for components and utils |
| **Vite** | 8.x | Build tool, dev server, HMR |

## Styling

| Technology | Role |
|------------|------|
| **Tailwind CSS** | 4.x | Utility-first CSS; design tokens and responsive layout |
| **PostCSS** | 8.x | Used by Tailwind (via `@tailwindcss/postcss`) |
| **Autoprefixer** | 10.x | Vendor prefixes for CSS |

Tailwind is configured via `tailwind.config.ts` and `postcss.config.mjs`. Global and component-level styles are in `src/index.css` (including `@layer` and custom classes such as `.card`, `.number-input`, `.slider`).

## Charts

| Technology | Role |
|------------|------|
| **Chart.js** | 4.x | Canvas-based charts (line, bar, pie) |
| **react-chartjs-2** | 5.x | React bindings for Chart.js |

Chart.js is registered once in `src/components/Charts.tsx` (scales, elements, tooltip, legend). The app uses four chart types: two line charts (spending, savings growth), one pie chart (allocation), and one stacked bar chart (income sources).

## Development & Quality

| Tool | Role |
|------|------|
| **ESLint** | Linting (TypeScript, React, React Hooks) |
| **TypeScript (tsc)** | Type checking; run as part of `npm run build` |
| **Vite** | Dev server (`npm run dev`), production build, preview (`npm run preview`) |

## Hosting & Delivery

| Service | Role |
|---------|------|
| **GitHub** | Version control and (optionally) source for Vercel |
| **Vercel** | Static hosting; builds from GitHub or CLI; CDN delivery |

No application backend, database, or third-party APIs are used for core app behavior.
