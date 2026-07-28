# tomalmog.com

Personal site styled as a Mac desktop: an animated anime-countryside wallpaper
(canvas-drawn, with a real day/night cycle driven by the visitor's clock) with
a single clean floating window on top. Six tabs: about, projects, experience,
now, music, ask.

## Tech

- Next.js 14 (App Router) + Tailwind
- Canvas 2D wallpaper scene — palettes and composition in `app/(main)/lib/palette.ts` and `scene.ts`
- Live Last.fm feed (`/api/lastfm`, needs `LASTFM_API_KEY`)
- Live GitHub activity (`/api/github`)
- AI chatbot via Groq (`/api/chat`, needs `GROQ_API_KEY`)
- Site content lives in `app/(main)/lib/content.ts`

Also hosts `/bmm`, `/tempo`, and `/committrader`.

## Develop

```bash
npm run dev    # local dev server
npm test       # vitest unit tests
npm run build  # production build
```

Debug the wallpaper at any time of day with `?t=<hour>`, e.g. `/?t=23`.
