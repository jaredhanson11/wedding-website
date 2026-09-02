# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wedding website with a vanilla HTML/JS/CSS frontend (`app/`) and a Python FastAPI backend (`api/`, work in progress — Google Sheets integration for RSVPs).

## Architecture

**`app/`** — Static frontend (no build tools)

- Single-page app with hash-based routing (`#/home`, `#/story`, `#/schedule`, `#/party`, `#/gallery`, `#/travel`, `#/rsvp`, `#/faq`; `#/registry` exists but is temporarily hidden)
- Tailwind CSS 4 via CDN, Google Fonts (Lato, Reenie Beanie), Leaflet for the travel map, Google Analytics (gtag)
- Pages are `div.page-section[data-page]` elements toggled via `navigateToPage()` in `script.js`

### Sections

**Hero** (`#hero`, fixed full-screen) — Intro animation shown on first load (only when there's no hash). Displays "Jared & Mackensie" with a 12.11.2026 / San Diego subtitle; on enter/scroll the title flies up into the nav bar ("J & M" logo), revealing the main nav.

**Home** (`#/home`) — Couple photo with name/date overlay, followed by an animated flip-digit countdown clock targeting the ceremony start (Dec 11, 2026, 3:30 PM Pacific — `dest` in `script.js`).

**Story** (`#/story`) — Narrative timeline of the couple's relationship told in four chapters: "The Early Days", "Some of Our Adventures", "The Proposal", and "And Now" — each pairing a photo with a text blurb.

**Schedule** (`#/schedule`) — Three-day breakdown, each with venue name, address, and a Google Maps directions link:
- Thursday, Dec 10: Welcome Party, 6:30–9:00 PM at Blackbird Tavern, Old Town Temecula (optional, casual attire)
- Friday, Dec 11: Ceremony 3:30 PM (seated by 3:15), Cocktail Hour 4:30–5:30 PM, Reception 6:00–10:00 PM at Ethereal Gardens, Escondido (black tie optional)
- Saturday, Dec 12: Afternoon at the Vineyards, 12:00 PM, Temecula Wine Country (optional, details TBD)

**Party** (`#/party`) — Wedding party roster in two columns (Bridesmaids / Groomsmen) with roles, plus a separate Officiant card. Best Men: Joseph Sarchett & Spencer Rust. Maid of Honor: Mandy Nick. Officiant: Blake Yarbrough.

**Gallery** (`#/gallery`) — Masonry-style photo grid of engagement photos (2-col mobile, 3-col desktop). Thumbnails in `assets/gallery/small/` open the `assets/gallery/large/` version in a lightbox.

**Travel** (`#/travel`) — Collapsible Leaflet map of all locations (`MAP_LOCATIONS` in `script.js`), airport comparison (SAN recommended, CRQ, SNA), hotel recommendations (Pechanga Resort — where the couple is staying, SpringHill Suites, Temecula Creek Inn), and things-to-do cards.

**FAQ** (`#/faq`) — `<details>` accordion cards grouped under The Details, Dress Code & Guests, Food & Drink, and Logistics. Contact email: mackensie.wedding@gmail.com.

**RSVP** (`#/rsvp`) — Embedded WithJoy RSVP iframe, with a fallback link to open the form in a new tab. RSVP CTA buttons appear in the mobile nav bar, desktop nav bar (pinned right), and the slide-out menu.

**Registry** (`#/registry`) — **Hidden for now.** Placeholder content only. Nav links are commented out in `index.html`, and `hiddenPages` in `script.js` redirects direct links to home. Remove `'registry'` from `hiddenPages` and un-comment the nav links to re-enable.

## Development Commands

### Frontend

```bash
npx live-server app
```

## Styling

Dark theme throughout: page background `#111111`, cards `#1c1c1c` with `border-white/10`, body text `text-gray-400`, headings `text-gray-100`/white. Accent (CTA buttons, tips, "recommended" badges): olive green `#A4B42B` (hover `#8A9724`). Script headings use Reenie Beanie; body is Lato.
