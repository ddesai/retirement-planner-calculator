# Architecture Documentation

This folder contains technical design and architecture documentation for **Darshan's Retirement Planning & Tax Strategy Calculator**.

## Document Index

| Document | Description |
|----------|-------------|
| [01-overview.md](./01-overview.md) | High-level architecture, system boundaries, and deployment model |
| [02-tech-stack.md](./02-tech-stack.md) | Technologies, frameworks, and tooling used |
| [03-component-architecture.md](./03-component-architecture.md) | React component tree, props, and state flow |
| [04-data-flow-and-formulas.md](./04-data-flow-and-formulas.md) | Calculation logic, utility modules, and financial formulas |
| [05-sequence-diagrams.md](./05-sequence-diagrams.md) | Sequence diagrams for app bootstrap, user flows, and calculations |
| [06-backend-and-services.md](./06-backend-and-services.md) | Backend services (none today) and hosting model |

## Quick Summary

- **Type:** Single-page application (SPA), client-side only
- **Stack:** React 19, TypeScript, Vite, Tailwind CSS, Chart.js
- **Backend:** None; all logic runs in the browser
- **Hosting:** Static assets on Vercel (GitHub-connected deployments)
