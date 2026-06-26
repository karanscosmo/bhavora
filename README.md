# Bhavora Platform Documentation

Bhavora is an advanced, AI-driven Urban Intelligence and Simulation Platform designed to help city planners and stakeholders make data-driven decisions.

## Features
- **AI Decision Twin:** Simulate the impact of policy changes (EV adoption, Metro lines) on traffic, carbon, and energy metrics.
- **Disaster Response Mode:** Real-time cascading alerts, infrastructure stress monitoring, and dynamic traffic rerouting during floods or extreme weather.
- **Automated Reporting:** Generate comprehensive PDF export reports based on simulation outputs.
- **Enterprise Security:** Strict CSP headers, XSS protections, API rate-limiting, and schema validations.
- **Monorepo Architecture:** Clean code separation inside `apps/web`.

## Tech Stack
- Next.js 14 App Router
- React 19
- TypeScript (Strict Mode)
- Tailwind CSS v4
- Mapbox GL JS (3D Maps)
- Zustand (State Management)
- Zod (Schema Validation)
- jsPDF & html2canvas (Export)

## Getting Started
See [Deployment Guide](docs/deployment.md) for local installation instructions.

## Structure
The application follows a modular structure:
- `apps/web/src/components/`: Reusable UI components
- `apps/web/src/features/`: Complex, domain-specific modules
- `apps/web/src/store/`: Zustand state definitions
- `apps/web/src/app/api/`: Secured serverless routes

---
*Built for Bengaluru, scalable to the world.*
