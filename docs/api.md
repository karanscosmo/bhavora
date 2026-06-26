# API Reference

Bhavora provides a series of REST API endpoints designed to power the client-side dashboard and visualization layer.

## `POST /api/disaster/flood`
Calculates localized flood risk based on climate input parameters.
- **Request Body:** `{ climateEvent: string; rainfall: number; district: string }`
- **Response:** GeoJSON zones, risk score, recommended alternate routes, and hospital stress capacity.

## `POST /api/simulation`
Processes custom scenario inputs to calculate deltas.
- **Request Body:** `{ evAdoption: number; popGrowth: number; ... }`
- **Response:** Success confirmation. (Note: Engine calculates deltas via Zustand store to reduce server lag).

## `POST /api/analytics`
Fetches historical performance metrics.
- **Request Body:** `{ metrics: string[]; timeframe: string }`
- **Response:** Timeline array data.

## `POST /api/chat`
Communicates with the AI Copilot.
- **Request Body:** `{ message: string, context: object }`
- **Response:** AI recommendations based on context data.
