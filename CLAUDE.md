# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wedding website with a vanilla HTML/JS/CSS frontend and a Python FastAPI backend. RSVP data is stored in Google Sheets (no traditional database).

## Architecture

**`app/`** — Static frontend (no build tools)
- Single-page app with hash-based routing (`#/home`, `#/story`, `#/schedule`, `#/party`, `#/gallery`, `#/faq`, `#/rsvp`)
- Tailwind CSS 4 via CDN, Google Fonts (Lato, Reenie Beanie)
- Pages are `div.page-section[data-page]` elements toggled via `navigateToPage()` in `script.js`

**`api/`** — FastAPI backend
- `__init__.py` — App setup, CORS, route handlers
- `sheets.py` — Google Sheets integration via `gspread`. `SheetsService` is a singleton injected as a FastAPI dependency (`SheetsServiceDependency`)
- `dtos.py` — Pydantic request/response models
- Supports up to 6 guests per RSVP row. Sheet columns follow the pattern: `Name {n}`, `{n} Yes/No`, `{n} Dietary Restrictions`

**API Endpoints:**
- `POST /codes` — Look up guest by name, returns RSVP code
- `GET /rsvps/{rsvp_id}` — Fetch RSVP data
- `PUT /rsvps` — Submit/update RSVP

## Development Commands

### Backend API
```bash
cd api
source venv/bin/activate
python -m uvicorn __init__:app --reload
```
Runs at `http://0.0.0.0:8000`. API docs at `/docs` (Swagger).

Requires `api/.env` with `GOOGLE_SHEETS_ID` and `GOOGLE_SHEETS_CREDENTIALS` (see `.env.example`).

### Frontend
```bash
cd app
python -m http.server 8080
```

### Type Checking
Pyright in "standard" mode (`pyrightconfig.json`). Python 3.13.

### Install Dependencies
```bash
cd api
source venv/bin/activate
pip install -r requirements.txt
```

## Color Palette
- Primary: `#2c3e50` (dark blue-gray)
- Secondary: `#e8d5c4` (warm beige)
- Accent: `#d4a574` (gold)
