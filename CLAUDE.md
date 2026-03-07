# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wedding website with a vanilla HTML/JS/CSS frontend and a Python FastAPI backend.

## Architecture

**`app/`** — Static frontend (no build tools)

- Single-page app with hash-based routing (`#/home`, `#/story`, `#/schedule`, `#/party`, `#/gallery`, `#/faq`)
- Tailwind CSS 4 via CDN, Google Fonts (Lato, Reenie Beanie)
- Pages are `div.page-section[data-page]` elements toggled via `navigateToPage()` in `script.js`

### Sections

**Hero** (`#hero`, fixed full-screen) — Intro animation shown on first load. Displays "Jared & Mackensie" in Reenie Beanie script with animated cosmo flower clusters in each corner and a location/date subtitle. On scroll, the title shrinks and flies up into the nav bar ("J & M" logo), revealing the main nav.

**Home** (`#/home`) — Couple photo with name/date overlay, followed by an animated flip-digit countdown clock counting down to December 11, 2026.

**Story** (`#/story`) — Narrative timeline of the couple's relationship told in four chapters: "The Early Days", "Some of Our Adventures", "The Proposal", and "And Now" — each pairing a photo with a text blurb.

**Schedule** (`#/schedule`) — Two-day event breakdown. Day One (Dec 10): Welcome Party at 6PM. Day Two (Dec 11): Ceremony at 4PM, Cocktail Hour at 5PM, Reception at 6PM. Each day includes venue name, address, and a Google Maps directions link.

**Party** (`#/party`) — Wedding party roster in two columns (Groomsmen / Bridesmaids) with roles, plus a separate Officiant card. Best Men: Joseph Sarchett & Spencer Rust. Maid of Honor: Mandy Nick. Officiant: Blake Yarbrough.

**Gallery** (`#/gallery`) — Masonry-style photo grid of engagement photos (2-col mobile, 3-col desktop). Images are clickable.

**FAQ** (`#/faq`) — Accordion or list of Q&A cards covering common guest questions.

## Development Commands

### Frontend

```bash
npx live-server app
```

## Color Palette

- Primary: `#2c3e50` (dark blue-gray)
- Secondary: `#e8d5c4` (warm beige)
- Accent: `#d4a574` (gold)
