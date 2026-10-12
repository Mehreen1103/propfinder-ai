# PropFinder AI

Property search where you can type a request like
"2-bedroom flat in Chittagong under 50 lakh with parking". The backend turns it into
structured filters with an LLM, validates them, and returns matching listings. Manual
filters work too, and AI-extracted filters show up as removable chips you can tweak.

Everything here runs on free tiers: Groq (LLM), Render (API), Vercel (frontend).

## Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19, Vite 6, plain CSS |
| Backend  | Node 20+, Express 5 |
| AI       | LangChain (`@langchain/groq`) and LangGraph (`@langchain/langgraph`), Groq `llama-3.3-70b-versatile` |
| Data     | `server/src/data/listings.json` (20 sample listings) |

## How the AI search works

A LangGraph state graph (`server/src/ai/searchGraph.js`) runs each query:

```
START -> extract --(JSON returned)--> validate -> search -> END
            \--(LLM error/timeout)--------------> search -> END   (fallback: all listings)
```

- `extract` runs a LangChain chain (`server/src/ai/filterChain.js`): prompt -> ChatGroq in JSON mode -> JSON parser.
- `validate` (`server/src/validators/filterSchema.js`) uses zod to keep only known fields, coerce types, restrict
  features to a whitelist, and drop anything invalid. Model output is never trusted directly.
- `search` applies the clean filters (`server/src/services/filter.service.js`).
- If Groq fails, times out (8s), or returns nothing usable, the user still gets all listings plus a warning.

## Project layout

```
.env.example     all keys/settings for both apps (copy to .env)
requirements.txt every dependency and version
server/src/
  ai/            filterChain.js (LangChain), searchGraph.js (LangGraph)
  config/        env.js
  controllers/   listings, search
  data/          listings.json
  middleware/    rateLimiter, errorHandler
  routes/        listings, search
  services/      listings, filter, nlSearch
  validators/    filterSchema.js
server/tests/    node:test unit tests
client/src/
  api/           fetch wrapper
  components/    SearchBar, FilterPanel, AiFilterChips, ListingGrid, ListingCard, Loader, EmptyState
  hooks/         useListings, useAiSearch
  utils/         format.js (lakh/crore formatting)
```

## Run locally

Requires Node.js 20 or newer (tested on 20 and 22). All dependencies are listed in `requirements.txt`
(npm installs them from the `package.json` files in the root, `server/` and `client/`).

1. Get a free Groq key at https://console.groq.com/keys.
2. Create the single `.env` for both apps in the project root, then add your key as `GROQ_API_KEY`:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # macOS/Linux
   cp .env.example .env
   ```
   `.env` is ignored by Git; do not commit it or share your API key. The checked-in `.env.example` contains placeholders only.
3. Install everything, then start both apps from the project root:
   ```bash
   npm run install:all
   npm run dev               # API on http://localhost:4000, app on http://localhost:5173
   ```
4. Open http://localhost:5173.
5. Tests: `npm test`

Prefer two terminals? `cd server && npm install && npm run dev`, and `cd client && npm install && npm run dev`.

If an install fails, first try `npm install` again in the affected app. Keep its `package-lock.json` so installs remain reproducible.

All keys and settings live in the root `.env` (see `.env.example`). The client only receives variables
prefixed with `VITE_`, so `GROQ_API_KEY` never reaches the browser.

Without a `GROQ_API_KEY` the app still works; AI search just falls back to showing all listings.

## API

- `GET /api/health`
- `GET /api/listings?location=&bedrooms=&minPrice=&maxPrice=&propertyType=&features=parking,lift&sort=price_asc`
- `GET /api/listings/:id`
- `POST /api/search/ai` with `{ "query": "..." }` returns `{ filters, listings, aiUsed, warning? }`
  (max 200 chars, 20 requests/min/IP)

## Deploy for free

### 1. Backend on Render
1. Push this repo to GitHub.
2. Render dashboard: New > Blueprint, select the repo (uses `render.yaml`), or create a Web Service manually with
   root directory `server`, build `npm install`, start `npm start`, plan Free.
3. Set the same variables from `.env.example` in the Render dashboard (there is no `.env` file on the host):
   `GROQ_API_KEY` and `CLIENT_ORIGIN` (fill in after step 2).
4. Note the URL, e.g. `https://propfinder-api.onrender.com`.

The free tier sleeps after about 15 minutes idle, so the first request can take around 30 seconds. The UI shows a
hint when that happens.

### 2. Frontend on Vercel
1. New Project, import the repo, set Root Directory to `client` (Vite is auto-detected).
2. Add environment variable `VITE_API_URL` = your Render URL (no trailing slash).
3. Deploy, then copy the Vercel URL into `CLIENT_ORIGIN` on Render (comma-separate multiple origins) and redeploy
   the API so CORS allows it.

## Notes

- The API key lives only on the backend. The browser never sees it.
- Bedrooms is an exact match; features must all be present; location matches city or area (case-insensitive).
- Suggested commit history: scaffold server, listings API, AI search graph, client scaffold, filters and chips,
  deploy config.

## CV entry

**PropFinder AI: Real Estate Search App** | React, Node.js, Express, LangChain, LangGraph, Groq API

- Built a full-stack property search app with a React frontend and Express REST API, deployed on Vercel and Render.
- Implemented natural-language search as a LangGraph pipeline (LLM extraction, zod validation, filtering) using
  LangChain and Groq (Llama 3.3), with schema-validated output, rate limiting, and a graceful fallback on failure.
