# ✦ Shiny Tracker

A full-stack Pokémon shiny hunt tracker built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

Track every shiny hunt, calculate exact probability odds, visualise your history with charts, and keep separate collections per trainer — all synced in real-time.

![Shiny Tracker screenshot](https://via.placeholder.com/900x500/0D0D14/F5C842?text=✦+Shiny+Tracker)

---

## Features

- **Per-trainer collections** — enter any username to scope your own data; share a URL with friends
- **PokéAPI integration** — search any of the 1,025 Pokémon by name; shiny sprites, types, and genus auto-filled
- **Accurate shiny odds** — probability calculated per method, per game generation, with/without Shiny Charm
- **Cumulative probability** — see the exact chance you'd have found your shiny by now using `P = 1 - (1 - 1/rate)^n`
- **Live encounter counter** — tap "+1 encounter" on active hunts without leaving the page
- **Charts** — attempts-per-hunt bar chart, monthly catches timeline (Chart.js)
- **Odds Calculator** — standalone calculator with milestone breakpoints (25%, 50%, 75%, 90%, 99%)
- **Import / Export** — download your data as JSON or CSV; re-import JSON backups
- **Real-time sync** — Supabase Realtime subscriptions keep multiple tabs in sync instantly
- **Responsive** — works on mobile and desktop

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite 5                                |
| Styling    | Tailwind CSS 3                                  |
| Charts     | Chart.js 4 + react-chartjs-2                    |
| Backend    | Supabase (PostgreSQL + Realtime)                |
| Data       | PokéAPI (public, no key required)               |
| Toasts     | react-hot-toast                                 |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/shiny-tracker.git
cd shiny-tracker
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`schema.sql`](./schema.sql)
3. Copy your project URL and anon key from **Settings → API**

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
shiny-tracker/
├── src/
│   ├── components/
│   │   ├── StatsBar.jsx        # Summary stat cards
│   │   ├── HuntCard.jsx        # Individual hunt card with odds bar
│   │   ├── AddHuntModal.jsx    # Modal with PokéAPI autocomplete
│   │   ├── HuntChart.jsx       # Chart.js bar + line charts
│   │   ├── OddsCalculator.jsx  # Standalone odds calculator
│   │   └── ExportImport.jsx    # JSON/CSV export + import
│   ├── hooks/
│   │   └── useHunts.js         # Supabase CRUD + realtime subscription
│   ├── lib/
│   │   ├── supabase.js         # Supabase client
│   │   └── pokeapi.js          # PokéAPI fetching + caching + type colours
│   ├── utils/
│   │   └── odds.js             # All shiny probability math
│   ├── App.jsx                 # Root component, routing, layout
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind + global styles
├── schema.sql                  # Supabase table + RLS + realtime setup
├── .env.example                # Environment variable template
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Shiny Odds Reference

| Method               | Gen 1–5   | Gen 6+   | With Charm (Gen 6+) |
|----------------------|-----------|----------|----------------------|
| Random encounter     | 1/8192    | 1/4096   | 1/1365              |
| Masuda Method        | 1/1366    | 1/683    | 1/512               |
| Soft reset           | 1/8192    | 1/4096   | 1/1365              |
| SOS Battle           | —         | 1/1024   | 1/683               |
| Mass Outbreak (SV)   | —         | 1/1024   | 1/512               |
| Sandwich Method (SV) | —         | 1/1024   | 1/512               |
| Poké Radar chain     | 1/200     | 1/200    | 1/200               |
| Legends: Arceus      | —         | 1/4096   | 1/585               |

Cumulative probability formula: **P(n) = 1 − (1 − 1/rate)^n**

---

## Deploying

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel dashboard.

### Netlify

```bash
npm run build
# drag the dist/ folder into netlify.com/drop
```

---

## Roadmap

- [ ] Supabase Auth (login with email/Google)
- [ ] Pokémon detail pages with full Pokédex info
- [ ] Hunt streaks and personal records
- [ ] Share your collection via public profile URL
- [ ] Notifications when probability crosses 99%

---

## License

MIT
