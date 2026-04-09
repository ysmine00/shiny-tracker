# Shiny Tracker

A personal project to track shiny hunts in Pokémon games and Pokémon GO.

Built with React, Tailwind, and Supabase — accounts are per email, data syncs in real-time across tabs.

## What it does

- Search any Pokémon and log a hunt with your method, game, and attempt count
- Calculates the actual odds and how lucky (or unlucky) you are based on your encounters
- Supports both mainline games and Pokémon GO with different encounter types
- Charts to visualize your hunt history
- Built-in odds calculator with milestone breakpoints

## Stack

- React + Vite
- Tailwind CSS
- Supabase (auth, PostgreSQL, realtime)
- PokéAPI

## Running locally

1. Create a project at [supabase.com](https://supabase.com)
2. Run `schema.sql` in the Supabase SQL Editor
3. Copy `.env.example` to `.env.local` and add your Supabase URL and anon key
4. `npm install && npm run dev`
