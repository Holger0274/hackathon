# Run PeopleOS Alex demo locally

> 5-minute setup, zero Vercel-side config needed beyond an API key.

## Prerequisites

- Node 20+ (`node --version`)
- An OpenRouter API key (https://openrouter.ai)
- `vercel` CLI installed globally (`npm i -g vercel`)

## Setup (one-time)

1. Clone + cd
2. `cp .env.example .env.local`
3. Edit `.env.local`, paste your `OPENROUTER_API_KEY`
4. `vercel link` — link to the Vercel project (only first time)

## Run

```bash
vercel dev
```

Open http://localhost:3000 — you see the 8-card team. Click Alex.

## Smoke-test the full demo path

1. Hit Cmd/Ctrl+Shift+P → rehearsed brief is pre-filled
2. Click "Get to work, Alex →" → 3-section output renders in ≤8s
3. Click "Post to LinkedIn →" → LinkedIn share window opens with the ad pre-populated

## If something breaks

| Symptom | Cause | Fix |
|---|---|---|
| 401 from the API | `OPENROUTER_API_KEY` not set | Re-edit `.env.local`, restart `vercel dev` |
| "Alex is having a moment" | OpenRouter timeout / network blip | Click "Try again, Alex →" |
| Output panel empty | Model returned no `## LINKEDIN JOB ADVERT` section | See Phase 5 (fallback rendering) — not yet implemented |
| LinkedIn window blank | `popup blocker` on browser | Allow popups for localhost:3000 |

## Live demo without Vercel

If the venue's wifi blocks Vercel:

1. Run `vercel dev` on the laptop (uses local Vercel functions, no cloud)
2. Project = phone hotspot, NOT venue wifi
3. Open browser to `http://localhost:3000` — works fully offline of the public internet, only the OpenRouter call needs net.
