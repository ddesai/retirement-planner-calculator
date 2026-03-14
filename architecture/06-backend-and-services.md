# Backend and Services

## Backend Services: None

This application **does not use any application backend or server-side business logic**.

- **No API server:** No Node, Python, or other runtime serving custom endpoints.
- **No database:** No persistence of user data; all inputs and results exist only in the browser session.
- **No server-side calculations:** All retirement and tax calculations run in the client (see `src/utils/`).
- **No authentication/authorization:** The app is anonymous; no login or user accounts.

This design keeps the project simple, avoids handling sensitive financial data on a server, and allows fully static hosting.

---

## What *Is* Used

### Static hosting (Vercel)

- **Role:** Serves the built static files (HTML, JS, CSS) from the `dist/` directory.
- **Behavior:** Vercel acts as a CDN; it does not execute application code. The browser downloads the SPA and runs it entirely on the client.

### Optional: GitHub

- **Role:** Version control and (if connected) the source for Vercel’s automatic deployments.
- **Behavior:** Pushing to the linked branch (e.g. `main`) can trigger a new Vercel build and deploy. GitHub is not used as a “backend” for the app itself.

### Build pipeline

- **Vite:** Runs at build time (e.g. on Vercel) to produce the static bundle. It is a build-time tool, not a runtime service.
- **TypeScript (tsc):** Type checking during build; no runtime dependency.

---

## Data and Privacy

- All user-entered data (ages, balances, contributions, etc.) stays in the browser.
- Nothing is sent to a server for storage or processing.
- Refreshing or closing the tab discards all inputs and results.

---

## Possible Future Services (Out of Scope Today)

If the product were extended later, examples of services that *could* be added (not implemented now) include:

- **Backend API:** To persist scenarios, user preferences, or to run heavier Monte Carlo simulations.
- **Authentication:** To associate saved plans with user accounts.
- **Analytics:** To understand usage (e.g. Vercel Analytics or a third-party script); no such integration exists today.

Current architecture assumes **no backend services** for the application.
