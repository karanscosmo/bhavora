# Bhavora Platform - System Context & Implementation History

This document serves as a comprehensive context file for LLMs (like ChatGPT or Claude) to understand the current state, architecture, and recent changes made to the Bhavora platform.

## 1. Project Overview
Bhavora is an advanced, AI-driven Urban Intelligence and Simulation Platform designed to help city planners and stakeholders make data-driven decisions. It allows users to simulate infrastructure changes (e.g., EV adoption, Metro expansion, Power Grid load) and instantly see their downstream cascading impacts on traffic, carbon emissions, water reserves, and economic indices.

## 2. Current Tech Stack
* **Framework**: Next.js 16.2.9 (App Router)
* **UI Library**: React 19
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS v4 (Glassmorphism, fluid gradients, responsive design)
* **State Management**: Zustand (`useSimulationStore.ts`)
* **Mapping/GIS**: Mapbox GL JS (3D WebGL maps with extruded buildings and geojson data layers)
* **Icons**: Lucide React
* **Security**: Strict Content-Security-Policy (CSP) via Next.js Edge Middleware
* **Deployment**: Vercel (Zero-config automated Git deployments)

## 3. Comprehensive Implementation History (Recent Work)
The platform underwent a massive architectural and UI overhaul to transition from a static UI prototype to a fully-functional, data-driven web application.

### A. UI/UX & Aesthetic Overhaul
* Transformed the entire application to a premium, unified **glassmorphism** design system.
* Implemented fluid CSS gradients, translucent backdrop blurs (`backdrop-blur-xl`, `bg-white/80`), and high-quality micro-animations (`hover:-translate-y-1`, `active:scale-95`).
* Built a stunning new Landing Page (`app/page.tsx`) with animated hero sections, dynamic module preview cards, and a professional, enterprise-ready look.

### B. State Management & Data Binding
* Replaced static HTML mockups with a centralized Zustand store (`useSimulationStore.ts`).
* Created comprehensive default scenarios (e.g., "EV Revolution 2035", "Monsoon Flood Crisis").
* Successfully bound this global store to **all** dashboard pages (`analytics`, `cities`, `decision-twin`, `impact`, `insights`, `platform`, `reports`, `scenario-builder`), ensuring that changing a parameter in one tab updates the graphs and metrics universally across the application.

### C. Iconography Migration
* **Issue**: The original `material-symbols-outlined` font failed to load in the production build, causing icons to render as raw text literals (e.g., "location_city", "dashboard").
* **Resolution**: Completely purged the Material Symbols font dependency. Systematically scanned every single file in the repository and migrated the entire iconography system to **Lucide React**.

### D. Mapbox GL Integration (Removing Static Content)
* **Issue**: The original prototype used static Google User Content placeholder images for all maps.
* **Resolution**: Implemented real, interactive **Mapbox GL JS** maps across the entire application.
  * **Landing Page (`page.tsx`)**: Added a 3D extruded building map for the hero section, and a secondary interactive map for the "Cities Twin" preview card. Fixed an async React race condition by using explicit inline dimensions and cleanup flags to ensure the preview map renders reliably.
  * **Overview (`overview/page.tsx`)**: Replaced the "Real-Time Traffic Congestion" image with a live Mapbox Heatmap layer utilizing GeoJSON traffic data.
  * **Simulation Results (`simulation-results/page.tsx`)**: Implemented a side-by-side "Before & After" dual Mapbox implementation to visually demonstrate traffic optimization.
  * **Insights (`insights/page.tsx`)**: Replaced the static background of the transportation preview with a dark-mode Mapbox instance.

### E. Security Hardening & Vercel Fixes
* **CSP Blocking Workers**: The original `middleware.ts` had a strict Content-Security-Policy that blocked `blob:` URLs. This prevented Mapbox GL JS from spawning its internal WebGL Web Workers, causing the maps to silently fail (rendering a grey canvas with no tiles).
  * **Fix**: Added `worker-src 'self' blob:;` and `child-src 'self' blob:;` to the CSP headers, restoring Mapbox functionality while maintaining enterprise security.
* **White-labeling**: Conducted a deep scan and removed all temporary hackathon-specific terminology ("SIH 2025", "Bugs2Bucks"), converting the platform to a fully white-labeled, professional enterprise product ("Bhavora Platform").

## 4. Key File Structure
```text
bhavora/apps/web/
├── next.config.ts
├── src/
│   ├── middleware.ts                  # Enterprise CSP and security headers
│   ├── store/
│   │   └── useSimulationStore.ts      # Global Zustand state (scenarios, metrics)
│   ├── components/
│   │   └── ui/                        # Reusable glassmorphism UI elements
│   ├── app/
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Main Landing Page (Hero Mapbox + Preview Maps)
│   │   └── (dashboard)/               # Protected / Application routes
│   │       ├── overview/page.tsx      # Main dashboard & live traffic heatmap
│   │       ├── cities/page.tsx        # Cities Twin
│   │       ├── decision-twin/page.tsx # Policy toggles & simulator inputs
│   │       ├── impact/page.tsx        # Downstream impact graphs
│   │       ├── simulation-results/page.tsx # Before/After Mapbox views
│   │       ├── insights/page.tsx      # AI generated recommendations
│   │       ├── analytics/page.tsx     # Deep data analytics
│   │       ├── scenario-builder/      # Custom scenario creation
│   │       └── settings/page.tsx      # User/Node configuration
```

## 5. Next Steps for LLMs
If instructed to build new features, remember to:
1. Always maintain the **glassmorphism** design aesthetic (`bg-white/80 backdrop-blur-xl border border-outline-variant/30`).
2. Continue using **Lucide React** for all new icons. Never revert to Material Symbols.
3. Keep the CSP in mind: if you introduce new third-party scripts or workers, `middleware.ts` must be updated.
4. Use **Zustand** (`useSimulationStore.ts`) for any new global state variables rather than prop-drilling or local component state.
