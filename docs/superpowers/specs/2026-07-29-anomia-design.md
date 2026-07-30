# Anomia Online — Design Spec

**Date:** 2026-07-29
**Route:** tomalmog.com/anomia (`app/anomia` in this repo)
**Model:** Same-room "phones as cards" — each player's phone lies on the table showing their top card; opponents read it across the table.

## Core principle

The app never announces matches. Spotting a symbol match is the skill of Anomia, so
no popups, highlights, sounds, or animations fire when a match appears. Players react
to what they see on the table; the app only arbitrates after someone claims.

## Constraints

- **Free forever.** Vercel Hobby (existing) + Upstash Redis free tier (existing
  account). No new paid or trial services. Expected load: ≤2 concurrent games, rare use.
- 2–8 players per game.
- Full Anomia rules: symbol matches, face-offs, wild cards, cascades.
- Original category/deck content (not Anomia's copyrighted card text).

## Screens (`app/anomia`)

1. **Home** — Create game or join via 4-letter room code. Enter a display name. No accounts.
2. **Lobby** — Player list; host taps Start (2–8 players).
3. **Table** — the main screen (below).
4. **Game over** — final win-pile counts, winner, "Play again" (same room, fresh deck).

## Table screen

Phone lies flat in front of the player, acting as their card pile.

- **Full-screen card**: category text right-side up along the near (bottom) edge and
  rotated 180° along the far (top) edge; the match symbol large in the center
  (distinct shape + color per symbol, readable at distance, colorblind-safe).
- **Corners**: domino-style reserved slots rendering "?" / "?" for now. They will
  eventually display the active wild-card pairing — exact rendering is **deferred**
  and will be designed after the core game is playable.
- **Flip**: on your turn, tap the card to flip the next card onto your pile. Turn
  indication is subtle (thin border) — visible to the owner, not distracting.
- **Claim button**: a permanent, visually static button (plain strip at the bottom
  edge). Never pulses, highlights, or changes state when a match exists.
  - One live match involving the claimer → resolves immediately: loser's top card
    moves to claimer's win pile; loser's next card is revealed (which may silently
    create a new match — cascades need no special handling).
  - Multiple live matches involving the claimer → popup: "Which face-off did you
    win?" listing the candidates; claimer picks.
  - No live match involving the claimer → nothing happens except a quiet "no match"
    note on the claimer's own screen.
- **Host dispute menu**: small host-only button in a corner. Opens a list of recent
  decisions (claims/card transfers), each with an Undo. The app never judges
  disputes; the table does, and the host applies the correction.
- **Footer**: dim, unobtrusive — own win-pile count and cards left in deck.

## Sync architecture

Short polling against Upstash Redis — no WebSockets, SSE, or third-party push.

- One Redis key per room (`anomia:room:{code}`): JSON game state + version counter,
  TTL a few hours.
- Clients `GET /api/anomia/state?room=X&v=N` every ~1s; response is 304-style
  "unchanged" or the new state.
- Mutations are POSTs handled by a pure server-side reducer:
  `join`, `start`, `flip`, `claim(matchId?)`, `undo(decisionId)`, `playAgain`.
- Simultaneous claims: Redis mutation ordering decides; the later claimer quietly
  gets "already claimed". Latency is invisible because the app never races to
  notify anyone — humans react to the physical table.

## Game logic

- Deck built at game start: ~90+ cards, 8 symbols, wild cards mixed in. Original
  categories written for this project.
- Wild card flipped → sets the active symbol pairing (all pairs of those two symbols
  now match) until the next wild appears.
- Game ends when the deck empties; most cards in win pile wins.
- Disconnect/refresh: state is server-side; rejoining with room code + same name
  restores the seat. Host can remove a dropped player; their pile returns to the
  bottom of the deck.

## Testing

- Vitest unit tests for the reducer: deck building, match detection, wild pairings,
  cascades, claim arbitration (single, multiple, none, simultaneous), undo.
- Light API-route tests for join/poll flow.

## Deferred

- Wild-card corner rendering on the card face.
- Any spectator/remote mode.
