# Taste — PeopleOS

> Stack: vanilla HTML/CSS/JS + Vercel Functions (Node 20) + OpenRouter | Last reviewed: 2026-05-23
>
> Read this file on EVERY task. Follow the index below to load only the sections relevant to what you're touching. Hackathon scope — these rules favour demo-day robustness over long-term maintainability.

## Always-apply architecture

- **One feature, one place.** No abstraction layers, no helpers split across files unless the same logic is used in ≥ 2 places. Two HTML files + ~3 JS files is the whole codebase.
- **Stateless everywhere.** No global state, no caches, no session. Each fetch builds its own request from scratch.
- **Server function = one job.** `api/alex.js` reads brief, calls OpenRouter, returns output. Nothing else. No middleware, no routing, no validation library.
- **Fail loud in dev, soft in prod.** In the browser console: log full error objects. In the user-visible UI: a warm "Alex is having a moment" panel. Never a stack trace on screen.
- **No silent fallbacks for the demo path.** If `OPENROUTER_API_KEY` is missing, the function returns 500 with `{ error: "key not configured" }` — don't dummy-respond, the pitcher needs to know immediately.
- **Brand fidelity is load-bearing.** Every colour, font, radius from `Docs/brand-guidelines.md`. CSS variables in `:root`. No inline hex values in components.

## Load on-demand

| Read when the task touches...                                     | File                                     |
| ----------------------------------------------------------------- | ---------------------------------------- |
| HTML pages, CSS, client JS, DOM interaction, fetch from browser  | [`taste/frontend.md`](taste/frontend.md) |
| `api/alex.js`, OpenRouter call, server-side env, response shape  | [`taste/backend.md`](taste/backend.md)   |
| API key handling, LinkedIn share URL safety, input validation    | [`taste/security.md`](taste/security.md) |

(Skipped `testing.md` — hackathon demo, manual rehearsal-based verification. Add later if scope grows.)

## Framework-level rules (shared across RIFF projects)

Cross-project baseline (skim only the ones we hit):
- `~/DEV/frameworks/riff/references/taste/architecture.md`
- `~/DEV/frameworks/riff/references/taste/security.md`
- `~/DEV/frameworks/riff/references/taste/backend.md`

Stack-specific gotchas: none — vanilla JS + Vercel functions are not covered by the stack files.

## Decisions log

- **2026-05-23 — Chose vanilla JS over React/Vue** because demo-day stability > developer ergonomics. Two HTML files have a smaller failure surface than a SPA on a laptop on stage.
- **2026-05-23 — Chose OpenRouter over Anthropic direct** because user wanted model-swap flexibility and an OpenAI-compatible client. Latency cost (~50-100ms) deemed acceptable.
- **2026-05-23 — No streaming in Phase 1** because plain JSON + a "Alex is on it…" panel is good enough for a 4-7s wait, and streaming adds SSE buffering + edge-case complexity.
- **2026-05-23 — LinkedIn share via `window.open()`** because the LinkedIn API requires app review and OAuth — incompatible with a one-day hackathon timeline.
- **2026-05-23 — No DB, no auth, no persistence** because demo is single-pitcher single-session; everything else is YAGNI for the hackathon.
