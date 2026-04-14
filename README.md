# ✦ Shiny Tracker

> Track every shiny Pokémon hunt. Calculate your luck. Built as a full-stack portfolio project.

A web app for logging shiny Pokémon hunts across all mainline games: with real-time data sync, accurate cumulative probability math, hunt history charts, and per-trainer collections backed by Supabase.

---

## Features

- **Pokémon search with autocomplete** — powered by PokéAPI, pulls shiny sprites, types, and Pokédex info automatically
- **Accurate shiny odds** — probability calculated per method, per game generation, with or without Shiny Charm using the formula `P = 1 - (1 - 1/rate)^n`
- **Live encounter counter** — tap +1 on active hunts without leaving the page
- **Per-trainer collections** — enter any username to get a scoped, real-time synced collection
- **Luck rating** — each hunt is rated (incredibly lucky → impossibly unlucky) based on how your attempts compare to the expected distribution
- **Charts** — attempts per hunt bar chart and monthly catches timeline via Chart.js
- **Odds Calculator** — standalone calculator with milestone breakpoints (25%, 50%, 75%, 90%, 99%)
- **Import / Export** — download your data as JSON or CSV, re-import backups anytime
- **Realtime sync** — Supabase Realtime keeps multiple tabs in sync instantly

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Backend | Supabase (PostgreSQL + Realtime) |
| Charts | Chart.js 4 + react-chartjs-2 |
| Pokémon data | PokéAPI (public, no key needed) |
| Notifications | react-hot-toast |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/ysmine00/shiny-tracker.git
cd shiny-tracker
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`schema.sql`](./schema.sql)
3. Copy your project URL and anon key from **Settings → API**

### 3. Add environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run it

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
src/
├── components/
│   ├── HuntCard.jsx        # Hunt card with odds bar and luck rating
│   ├── AddHuntModal.jsx    # Pokémon search modal with PokéAPI autocomplete
│   ├── StatsBar.jsx        # Summary stats (caught, encounters, luckiest)
│   ├── HuntChart.jsx       # Chart.js bar and timeline charts
│   ├── OddsCalculator.jsx  # Standalone odds calculator
│   └── ExportImport.jsx    # JSON/CSV export and import
├── hooks/
│   └── useHunts.js         # Supabase CRUD + realtime subscription
├── lib/
│   ├── supabase.js         # Supabase client
│   └── pokeapi.js          # PokéAPI fetching, caching, type colors
├── utils/
│   └── odds.js             # All shiny probability math
└── App.jsx                 # Root layout, tabs, filtering
```

---

## Shiny Odds Reference

| Method | Gen 1–5 | Gen 6+ | With Charm |
|---|---|---|---|
| Random encounter | 1/8192 | 1/4096 | 1/1365 |
| Masuda Method | 1/1366 | 1/683 | 1/512 |
| SOS Battle | — | 1/1024 | 1/683 |
| Mass Outbreak (SV) | — | 1/1024 | 1/512 |
| Sandwich Method (SV) | — | 1/1024 | 1/512 |
| Poké Radar chain | 1/200 | 1/200 | 1/200 |
| Legends: Arceus | — | 1/4096 | 1/585 |

**Formula:** `P(n) = 1 − (1 − 1/rate)^n`

---

## Deploy

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel dashboard.

---

## License

MIT
