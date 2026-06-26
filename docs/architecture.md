# Bhavora Platform Architecture

## Overview
Bhavora uses a monolithic frontend-heavy architecture built on Next.js 14 App Router, moving complex backend simulation logic into the client-side state engine (Zustand) and Next.js serverless API routes.

## Stack
- **Framework:** Next.js (App Router)
- **State Management:** Zustand (Client-side simulation engine)
- **Styling:** Tailwind CSS
- **Maps:** Mapbox GL JS v3 (React-map-gl)
- **Validation:** Zod (API Routes)

## Core Flow
1. **User Input:** User interacts with UI controls (e.g., changing EV adoption rate).
2. **State Layer (Zustand):** The `useSimulationStore` updates the inputs and triggers `runSimulation`.
3. **Simulation Engine:** `runSimulation` applies deterministic algorithms to recalculate metrics based on baseline 2025 data.
4. **UI Update:** The React components subscribe to the Zustand store and automatically re-render maps, charts, and metrics.
5. **Persistence:** Scenarios are saved using Zustand's local storage persistence.

## API Layer
All API routes are located in `apps/web/src/app/api`. They are secured via `middleware.ts` which implements CSP, HSTS, and Rate Limiting. Input validation is handled via Zod schemas.

## Data Layer
Data is currently mocked or retrieved via deterministic functions calibrated to 15 years of Bengaluru municipal data. Future iterations will connect to real-time IoT hubs.
