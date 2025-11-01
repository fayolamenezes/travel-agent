# AI Travel Guide – Personalized Tour Planner

A full-stack Next.js 15 web app that generates personalized travel itineraries using AI, displays curated destinations, integrates live weather forecasts (including travel-date forecasts), streams responses in real time, and visualizes a public reasoning timeline showing how AI refines trip plans.

## Features

### Itinerary Builder
- Interactive form to collect destination, travel dates, interests, budget, and travelers.
- Streams a day-wise itinerary using OpenAI's gpt-4o-mini API.
- Markdown rendering with support for bold text, lists, and tables, with a raw markdown toggle.
- Persists itineraries to MongoDB.

### Weather Forecast
- Uses OpenWeatherMap (Geocoding and OneCall API).
- Two tabs: Current Forecast and Forecast for the user's entered travel dates.
- Responsive UI with Tailwind and forecast cards.

### Public Reasoning Timeline
- Policy-safe, user-facing timeline that summarizes how the AI planned the itinerary (for example, weather, pacing, distances, local highlights).
- Streams line-by-line from /api/reasoning.
- This is not the model's private chain-of-thought.

### Suggested Trips
- Curated destinations showing city, highlights, and best time to visit.
- Styled to match a green-themed UI.

### Live Streaming Responses
- ReadableStream + TextDecoder for fluid token streaming.
- Auto-scroll and cancellation supported mid-generation.

### Persistence
- MongoDB model (Itinerary) stores generated plans with timestamps.
- View JSON directly via /api/itineraries.

## Tech Stack

- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS
- Backend: Next.js API Routes (Node runtime for Mongoose)
- Database: MongoDB via Mongoose
- AI: OpenAI gpt-4o-mini (streaming; can swap to Gemini)
- Weather API: OpenWeather (Geocoding and One Call)
- Deployment: Vercel

## Setup and Installation

1) Clone and Install
```bash
git clone https://github.com/fayolamenezes/travel-agent.git
cd travel-agent
npm install
```

2) Environment Variables
Create a `.env.local` file:
```env
OPENAI_API_KEY=sk-...
OPENWEATHER_API_KEY=...
MONGODB_URI=mongodb+srv://USER:PASS@HOST/ai-travel-guide
MONGODB_DB=ai-travel-guide
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
```

3) Run in Development
```bash
npm run dev
# open http://localhost:3000
```

4) Build for Production
```bash
npm run build && npm start
```

## Usage

- Home page: fill the form and click Generate Itinerary to stream the plan.
- Click Show Timeline to view the public reasoning steps.
- Weather widget shows current forecast and travel-date forecast.
- Click Save Plan to persist the itinerary (requires MongoDB).
- Visit /api/itineraries to see saved itineraries as JSON.
- Suggested trips available at /trips (fetches from /api/suggested with fallback).

## API Endpoints

- POST /api/itinerary – streams a markdown itinerary
  Example body:
  ```json
  {
    "destination": "Kyoto",
    "startDate": "2025-11-10",
    "endDate": "2025-11-13",
    "interests": "temples, food",
    "travelers": 2,
    "budget": "Moderate"
  }
  ```

- POST /api/reasoning – streams public planning steps (newline-delimited)

- GET /api/weather?destination=<city> – returns geocoded forecast

- POST /api/itinerary/save – saves payload + planText to MongoDB

- GET /api/itineraries – lists recent saved itineraries (JSON)

- GET /api/suggested – returns curated suggested trips

## Notes on Reasoning

This app shows a concise, public rationale for transparency (timeline bullets), not the model’s private chain-of-thought.

## Switching to Gemini (Optional)

Replace OpenAI calls in:
- app/api/itinerary/route.ts
- app/api/reasoning/route.ts

with the Gemini SDK streaming equivalents, keeping the same response format.

## Deployment

- Vercel: connect your GitHub repo, add environment variables in Project Settings.
- Set NEXT_PUBLIC_BASE_URL to your final domain (for example, https://your-vercel-domain.vercel.app) and redeploy.
- MongoDB Atlas: create a free cluster, add a database user, and allow network access. Paste your connection string in MONGODB_URI.

## Security

- Do not commit .env.local.
- Store production secrets in Vercel environment settings.
- Consider adding rate limiting to POST endpoints in production.

## Acknowledgment

Made for the GradGuide Full-Stack Web Developer Internship assignment.
