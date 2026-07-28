# tomalmog.com Redesign — "Desktop" Site

**Date:** 2026-07-28
**Status:** Approved by Tom

## Goal

Replace the current generic portfolio with a unique, memorable site aimed at
**startup founders / early-stage teams**. The visitor should walk away thinking
"this person builds real things fast — I want them on my team."

Reference: [sebs.computer](https://www.sebs.computer/) — same genre (scenery
wallpaper + floating window + live music + ask-AI), but differentiated:

1. The window is **flat, solid, clean** (Linear/Notion-grade product UI), not
   frosted translucent glass.
2. The wallpaper is a **code-drawn animated anime-countryside scene** with a
   real day/night cycle, not a static image.

## Positioning / content rules

- Identity: builder-first. CS @ Waterloo. **No quant framing anywhere** — not
  in the headline, about copy, or chatbot persona.
- "Founding Engineer — Parkalytics" appears **only** as the title in the
  experience section, not in the headline.
- Content source of truth is the July 2026 resume (CS Co-op, not Mathematics —
  fix everywhere including chatbot system prompt).

## The shell

- Full-viewport fixed "desktop": canvas wallpaper fills the screen, one
  centered floating window on top (~85% width, max ~1100px, rounded corners,
  soft shadow).
- Faux menu bar strip: `tomalmog.com // online` left, live local time right.
- No dock, no draggable/multiple windows. The window is the site.
- Mobile: window goes near-fullscreen, slim wallpaper border still visible.

## Wallpaper scene (canvas 2D)

Original anime-countryside composition, parallax layers back-to-front:

1. Sky — gradient interpolated by time of day
2. Sun/moon + stars
3. Far cloud clusters (drift, different speeds per depth)
4. Rolling hills (two depths)
5. Foreground meadow strip with swaying grass

Ambient events: birds crossing during day (every 1–2 min), fireflies at night.

- Day/night cycle driven by the visitor's local clock. Four keyframe palettes
  (dawn / day / dusk / night) with smooth interpolation.
- All colors in one palette file; iterate on composition/palette **first**,
  before the window UI. Biggest project risk is "looks like programmer art."
- ~30fps throttle; pause when tab hidden.
- `prefers-reduced-motion` or no-canvas: static gradient of current palette.
- Dev override: `?t=<hour>` forces a time of day for visual checking.

## The window

- Flat solid surface: white in day, deep charcoal at night. Theme follows the
  wallpaper clock, with a manual toggle.
- Header: name, one-line builder identity, green "online" dot.
- Footer: tab bar, six tabs, icons + mono labels.
- Typography: Inter-style sans for content; monospace only for small labels
  (`NOW PLAYING`, timestamps, tags).
- Deep links: `/#music` etc. opens that tab.

### Tabs

1. **about** — two short voice-y paragraphs (builder identity; music/gym/human
   side). Proof links: GitHub, LinkedIn, email, resume.
2. **projects** — compact list, click to expand detail view in-window (what it
   is, one honest paragraph on why it's interesting, screenshot, tags, links).
   Order: Crucible (flagship), optimizer-energy publication, Retinal OCT
   classifier, CarbonAware-ML. Older projects (WagerLoo, Tempo, CommitTrader,
   card counter) in a collapsed "more projects" section.
3. **experience** — condensed timeline, one line each, expandable bullets:
   - Founding Engineer — Parkalytics (May 2026–present)
   - Data Engineer Intern — Polymarket (Apr 2026)
   - Machine Learning Engineer — WatStreet (Dec 2025–Mar 2026)
   - Machine Learning Engineer — Wat.AI + research paper (Sep–Dec 2025)
   - Autonomous Systems Engineer — WARG (May–Aug 2025)
   - Education: BCS Co-op, University of Waterloo (Sep 2025–May 2030)
4. **now** — hand-edited "currently building" config + live recent GitHub
   activity for `tomalmog`.
5. **music** — Last.fm user `TomAlmog`: now playing (30s poll, equalizer bars
   when live), recent tracks, top artists, top albums, big all-time scrobble
   count. Sub-tabs: recent / artists / albums.
6. **ask** — existing Groq chatbot restyled; suggested-question chips. Updated
   system prompt (CS, founding engineer, new projects, no quant).

## Architecture

- Stays in this Next.js 14 repo. New site replaces `app/(main)` page.
  `/bmm`, `/tempo`, `/committrader` and existing API routes untouched.
- New API routes:
  - `app/api/lastfm` — server-side Last.fm calls (`user.getRecentTracks`,
    `user.getTopArtists`, `user.getTopAlbums`, `user.getInfo`), key in
    `LASTFM_API_KEY` env var, ~60s server cache.
  - `app/api/github` — public GitHub events for `tomalmog`, ~5 min cache,
    no token.
- Chatbot: reuse `app/api/chat` as-is; update system-prompt content only.

## Error handling

All live integrations fail soft and invisible:

- Last.fm down → last-known data + quiet "last seen" timestamp, never an error.
- GitHub down → now tab shows only the hand-written blurb.
- Canvas unavailable / reduced motion → static time-of-day gradient.

## Testing

Unit tests for non-visual logic only:

- Palette interpolation (3am / 7am / noon / 7pm → correct blended colors)
- Last.fm response parsing (now-playing vs not-playing shapes)
- API route caching / error fallbacks

Visual scene verified by eye with the `?t=hour` override.

## Out of scope

- Dock, multiple windows, draggable windows
- Writing/blog tab
- CMS — "now" blurb is a typed config file
- Any changes to /bmm, /tempo, /committrader

## Needed from Tom

- `LASTFM_API_KEY` env var (free at last.fm/api) — site degrades gracefully
  without it until added.
