# KStream

A Korean drama streaming platform built with **Vue 3**, **TypeScript**, and **Video.js**. Features real show data from TMDB, HLS video playback with subtitle support, and a responsive Netflix-style dark UI.

## Tech Stack

- **Vue 3** — Composition API with `<script setup lang="ts">`
- **TypeScript** — Full type coverage across components, services, and stores
- **Video.js** — HLS streaming, subtitle tracks, custom themed player
- **Vite** — Build tool and dev server
- **Vue Router** — Client-side routing with lazy-loaded views
- **Pinia** — State management with localStorage persistence
- **Tailwind CSS v4** — Utility-first styling
- **TMDB API** — Real Korean TV show metadata, posters, and episode data

## Features

- **Home Page** — Hero banner, trending shows, genre-based content rows
- **Browse** — Filter by genre, network (KBS/MBC/SBS), sort by popularity/rating/newest, search
- **Show Detail** — Full metadata, season selector, episode list, watchlist toggle
- **Video Player** — HLS playback, EN/KO subtitles, playback rate control, keyboard shortcuts
- **Watchlist** — Add/remove shows, persisted to localStorage
- **Continue Watching** — Tracks playback progress, resume where you left off
- **Responsive** — Mobile hamburger menu, touch-friendly scrolling, adaptive layouts
- **Loading States** — Skeleton placeholders, route progress bar, image fallbacks

## Getting Started

### Prerequisites

- Node.js 18+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Setup

```bash
git clone https://github.com/your-username/kstream.git
cd kstream
npm install
```

Create a `.env` file:

```
VITE_TMDB_API_KEY=your_api_key
VITE_TMDB_ACCESS_TOKEN=your_read_access_token
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
  components/       # Reusable UI components
    VideoPlayer.vue    # Video.js wrapper with HLS, subtitles, keyboard shortcuts
    ContentCard.vue    # Show poster card with rating badge
    ContentRow.vue     # Horizontal scroll row with arrow navigation
    HeroSection.vue    # Full-width hero banner
    EpisodeCard.vue    # Episode list item with thumbnail
    ...
  views/             # Route pages
    HomeView.vue       # Landing page with hero + content rows
    BrowseView.vue     # Filterable show grid
    DetailView.vue     # Show detail with episodes
    PlayerView.vue     # Video player with episode sidebar
    WatchlistView.vue  # Saved shows
  services/
    tmdb.ts            # TMDB API client with typed responses
  stores/
    watchlist.ts       # Pinia store for watchlist + playback progress
  composables/
    useScrolled.ts     # Scroll position tracking
  types/
    index.ts           # TypeScript interfaces
  data/
    streams.ts         # HLS test stream URLs + subtitle config
  router/
    index.ts           # Route definitions with lazy loading
```

## Key Technical Decisions

- **Video.js over native `<video>`** — Provides HLS support, subtitle management, quality selection, and a consistent player UI across browsers. Custom CSS theme matches the app design.
- **Vue Composition API** — All components use `<script setup>` for cleaner, more maintainable code with full TypeScript inference.
- **Pinia with localStorage** — Watchlist and playback progress persist across sessions without a backend.
- **TMDB for metadata + free HLS streams for playback** — Demonstrates real API integration and video player skills without requiring licensed content.
- **Tailwind CSS v4** — Rapid UI development with the Vite plugin for optimal build performance.

## Keyboard Shortcuts (Player)

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `Left Arrow` | Seek back 10s |
| `Right Arrow` | Seek forward 10s |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |
