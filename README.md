# Bhavora V3: The AI Decision Twin 🌆🤖

**Tagline:** Simulate Tomorrow. Decide Today.

Bhavora is a Next-Generation AI Decision Twin designed for urban governance and critical infrastructure management. Built as a high-fidelity deterministic simulation engine, it allows policy-makers to dynamically test macro-economic, demographic, and infrastructure parameters (like EV adoption rates or Metro expansion) and immediately visualize the cascading impacts on the city's power grid, traffic throughput, and water reserves.

## 🏆 Hackathon Ready Features

- **Real-Time Scenario Builder:** Drag sliders for population growth, EV adoption, and industrial expansion, and run the neural simulation.
- **FastAPI Deterministic Engine:** Custom backend logic calculates complex interplay between multi-domain variables (Energy, Water, Carbon, Traffic).
- **Beautiful Dashboards:** A fully custom, glassmorphism-inspired UI built with Next.js App Router and Tailwind CSS v4.
- **Disaster Response Mode:** A high-intensity command center view for tracking cascading infrastructure failures.
- **Predictive AI Insights:** Automated strategic recommendations based on 15-year forward-looking simulation runs.

## 🛠 Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4 (Custom OkLCH themes)
- Material Symbols & Framer Motion

**Backend:**
- Python 3.10+
- FastAPI
- Uvicorn (ASGI Server)
- Pydantic for strict data validation

## 🚀 Getting Started

### 1. Start the FastAPI Simulation Engine
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```
*The API will be available at http://localhost:8000*

### 2. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
*The app will be available at http://localhost:3000*

## 🌐 Deployment (Vercel)

This repository is configured for 1-click Vercel deployment via `vercel.json`. It handles both the Next.js frontend and the FastAPI serverless backend seamlessly!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/karanscosmo/bhavora)

## 💡 Use Case: Bengaluru 2035 
Bhavora comes pre-loaded with the **Bengaluru Urban Intelligence Corpus**. 
*Test this:* What happens if Karnataka reaches 80% EV adoption by 2035 while population grows by 22%? Run the scenario in the app to find out!
