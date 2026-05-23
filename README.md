# PeopleOS — Alex Demo

> Hackathon demo (Berlin 2026): an AI HR team of 8 agents. Alex Chen (Talent Acquisition Manager) is the only functional one. Pitcher gives Alex a one-paragraph hiring brief; Alex produces a LinkedIn ad + Job Spec + Interview Scorecard, and the pitcher posts the ad to LinkedIn live on stage.

## Stack

- **Frontend**: vanilla HTML/CSS/JS — `index.html` (Team Showcase) and `alex.html` (Alex interface). No framework.
- **Backend**: one Vercel serverless function — `api/alex.js`. Proxies the brief to OpenRouter.
- **LLM**: OpenRouter → `anthropic/claude-sonnet-4.6`.
- **Hosting**: Vercel (static + functions).
- **LinkedIn**: `window.open()` to the share dialog. No API integration.

## Local dev

```bash
# 1. Get an OpenRouter API key from https://openrouter.ai/
# 2. Copy the example env file and add your key (gitignored)
cp .env.example .env.local
# Edit .env.local: OPENROUTER_API_KEY=sk-or-...

# 3. Install Vercel CLI (one-time, global)
npm install -g vercel

# 4. Run local dev server (serves static + functions on http://localhost:3000)
vercel dev
```

Open `http://localhost:3000/` to see the Team Showcase. Click Alex to land on `/alex`.

No `npm install` for the project itself — the frontend is plain HTML/CSS/JS, and the `api/alex.js` function has zero npm dependencies (uses Node's built-in `fetch`).

## Deploy

```bash
# First-time deploy (interactive, creates the project on Vercel)
vercel

# Set the API key as a production environment variable
vercel env add OPENROUTER_API_KEY production
# Paste your key when prompted

# Subsequent deploys
vercel --prod
```

The production URL is bookmarked for the demo. After deploying, test:
1. Load `/`. Click Alex's card → `/alex` opens.
2. Paste a brief, hit `Cmd/Ctrl+Enter`. Output renders in ≤ 8s.
3. Click "Post to LinkedIn". Share dialog opens with the ad pre-populated.

## Workflow

This project uses [RIFF](https://github.com/) (planning framework) — see `.riff/` (gitignored, local symlink).

- `/riff:next` — execute the next planned step.
- `/riff:dashboard` — show project status.
- `/riff:debug` — debug a failing test or error.

Planning artifacts live in `.planning/`. The locked decisions are in `CONTEXT.md` and `ROADMAP.yaml`.

## Repo layout

```
.
├── index.html              # Team Showcase (Phase 3 — currently a stub)
├── alex.html               # Alex Interface (Phase 1 — tracer bullet)
├── styles.css              # Shared stylesheet
├── team.js                 # Team page logic
├── alex.js                 # Alex page logic
├── api/
│   └── alex.js             # Vercel function — OpenRouter proxy
├── Docs/
│   ├── peopleos-alex-demo.html   # Builder brief (existing, authoritative)
│   └── brand-guidelines.md       # Colour + type system (PeopleOS Brand v2)
├── .planning/
│   ├── design/             # pages.md, architecture.md
│   ├── phases/             # per-phase plans
│   └── config.json         # RIFF config (scope, gates)
├── PROJECT.md              # Vision, users, features, constraints
├── ROADMAP.yaml            # 5 phases — Phase 1 is the tracer bullet
├── CONTEXT.md              # Locked decisions
├── taste.md                # Code-quality conventions
├── STATE.md                # Current RIFF position
└── INCIDENTS.md            # Production incident log (empty until first incident)
```

## Status

Discovery complete. 5 phases planned. Ready to ship Phase 1 (tracer-bullet end-to-end demo). Demo target: Berlin 2026, today/tomorrow.

> ⚠️ This is hackathon-scope code. Not production-ready for real HR use.
