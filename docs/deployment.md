# Deployment Guide

## Prerequisites
- Node.js >= 18.17.0
- NPM >= 9.0.0
- Mapbox Account & Token

## Local Development
1. Clone the repository
2. Navigate to `apps/web`
3. Copy `.env.example` to `.env.local` and add your Mapbox token
4. Run `npm install`
5. Run `npm run dev`

## Production Build
To create an optimized production build:
```bash
npm run build
```
Start the production server:
```bash
npm run start
```

## Vercel Deployment
This project is highly optimized for Vercel deployment.
1. Import the repository into Vercel.
2. Set the Root Directory to `apps/web`.
3. Add the `NEXT_PUBLIC_MAPBOX_TOKEN` environment variable.
4. Deploy.

The Next.js `middleware.ts` will automatically apply security headers globally across the Vercel Edge Network.
