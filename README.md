# AI Travel Guide – Personalized Tour Planner

A full-stack Next.js app that generates personalized itineraries with AI, shows curated trips, integrates OpenWeather forecasts, streams responses, visualizes a **public reasoning timeline**, and persists itineraries to MongoDB.

## Features
- **Itinerary Builder** → Streams a day-wise markdown plan from OpenAI.
- **Suggested Trips** → Curated ideas with highlights + best time to visit.
- **Weather** → 5-day snapshot via OpenWeather (geocoding + One Call).
- **Public Reasoning Timeline** → Policy-safe summary of steps (not hidden CoT).
- **Persistence** → Save itineraries to MongoDB; browse via `/api/itineraries`.
- **Edge runtime** for low-latency AI streaming.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind
- **Backend**: Next.js API routes (Node)
- **DB**: MongoDB (Mongoose)
- **AI**: OpenAI (`gpt-4o-mini` streaming; swap to Gemini if preferred)
- **Weather**: OpenWeather Geocoding + One Call

## Setup
1. **Clone & Install**
   ```bash
   npm i  # or yarn / pnpm
   ```
2. **Environment**
   Create `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   OPENWEATHER_API_KEY=...
   MONGODB_URI=mongodb+srv://USER:PASS@HOST/ai-travel-guide
   MONGODB_DB=ai-travel-guide
   # For SSR fetching to itself in prod (Vercel/etc)
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```
3. **Run Dev**
   ```bash
   npm run dev
   ```
4. **Build & Start**
   ```bash
   npm run build && npm start
   ```

## Usage
- Home page → fill the form → **Prepare** → click **Generate Itinerary** to see streaming output.
- Click **Show Timeline** to visualize a user-facing step summary.
- Weather widget shows a 5-card forecast for the destination (if API key is set).
- Click **Save Plan** to persist (if MongoDB is configured).
- Visit `/api/itineraries` to see the latest saved itineraries as JSON.
- Suggested trips at `/trips` (uses `/api/suggested`).

## Notes on Reasoning
This app shows a **concise, public rationale** for transparency (timeline bullets), *not* the model’s private chain-of-thought.

## Swap to Gemini (Optional)
Replace the OpenAI client usage in `app/api/itinerary/route.ts` and `app/api/reasoning/route.ts` with your preferred Gemini SDK. Keep streaming semantics.

## Demo Video Script (2–3 min)
1. Intro: brief problem/solution; stack.
2. Itinerary Builder: fill inputs; click *Generate* → show streaming.
3. Show the weather widget and explain its influence.
4. Click *Show Timeline* for the public rationale.
5. Save plan → mention MongoDB.
6. Open **Suggested Trips** and summarize.
7. Close with future work (maps, price estimates, PDF export).

## Deployment
- **Vercel**: Add env vars; set `NEXT_PUBLIC_BASE_URL` to your domain so server routes can fetch internal APIs in prod.
- **MongoDB Atlas**: Create a free cluster, get a connection string, whitelist IP or use `0.0.0.0/0` for testing.

## Security
- Do not commit `.env.local`.
- Use environment variables in the Vercel dashboard for prod.

---

**Made for the GradGuide Full-Stack Web Developer Internship assignment.**
