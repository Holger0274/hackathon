# Context — Locked Decisions

> Decisions locked during `/riff:start` discovery (2026-05-23). The planner reads this before creating any plan.
> Do not modify during execution — these are the constraints.

## Product Decisions

- **What this is**: PeopleOS — Berlin 2026 hackathon demo. Showcases an AI HR team of 8 agents; only "Alex Chen" (Talent Acquisition Manager) is functional in this build.
- **The single user-facing flow**: Pitcher loads `/` → sees 8 agent cards → clicks Alex → lands on `/alex` → pastes a one-paragraph hiring brief → submits → sees 3 outputs (LinkedIn ad + Job Spec + Interview Scorecard) → clicks "Post to LinkedIn" → LinkedIn share dialog opens with the ad pre-populated.
- **Demo target**: brief → output rendered in ≤ 8 seconds; click "Post to LinkedIn" → share dialog instant.
- **Out of scope explicitly**: the other 7 agents are visual stubs only; no auth; no DB; no persistence; no LinkedIn API integration; no streaming in Phase 1.
- **Language**: UK English in Alex's output, £ for salary. German/English in code comments fine; user-facing UI in English.

## Architecture Decisions

- **Stack**: vanilla HTML/CSS/JS (no framework) + 1 Vercel serverless function (`api/alex.js`, Node 20) + OpenRouter as LLM proxy.
- **Why no framework**: zero build-time surprises on demo day. Two flat HTML files + two JS modules + one server function.
- **Why OpenRouter, not Anthropic direct**: user choice. Lets us swap models without changing client code. ~50-100ms latency cost is acceptable.
- **Model**: `anthropic/claude-sonnet-4.6` — hardcoded in the server function. No model-picker UI. Sweet spot for output quality + speed.
- **Why Vercel**: server-side env var holds the OpenRouter key (key never ships to browser); static + edge functions in one deploy.
- **No DB, no state, no sessions**. Every brief is a fresh stateless request.
- **LinkedIn integration = `window.open()`** on `https://www.linkedin.com/feed/?shareActive=true&text=<encoded>`. No API, no OAuth, no review process.
- **Routing**: two static HTML files (`index.html`, `alex.html`). No client-side router. `vercel.json` rewrite for `/alex` if needed.
- **Output parsing**: model returns Markdown with `## LINKEDIN JOB ADVERT`, `## JOB SPECIFICATION`, `## INTERVIEW SCORECARD` headers. Client splits on those headers. If parsing fails → fallback card with raw output.

## Design Decisions

- **Brand**: PeopleOS Brand Guidelines v2 (`Docs/brand-guidelines.md`). Dark-first, gold/blue accents, DM Sans (body) + Syne (display) + DM Mono (labels/code).
- **Hero output card** uses gold-dim border (`#a06b10`); other cards use default `#2a2a2a`. Depth via border, never via shadow.
- **Page width**: max 900px, centred. Same as the existing demo-spec HTML in `Docs/`.
- **Loading state**: "Alex is on it…" panel with rotating copy lines + animated dots. Demo-personality, not a generic spinner.
- **Hidden shortcut** Cmd/Ctrl+Shift+P: pastes the rehearsed brief into the textarea. Pitcher's safety net.
- **No mobile responsiveness** beyond "doesn't visibly break". Demo runs on a laptop.

## Constraints

- **Deadline**: today/tomorrow. Tracer-bullet mode. Phase 1 must ship a working E2E demo deployed to Vercel.
- **API key**: `OPENROUTER_API_KEY` in Vercel env vars (Production + Preview). Never in repo. Never in client bundle.
- **LinkedIn ad ≤ 2,000 chars**. Enforced in system prompt AND verified client-side before opening the share URL (truncate to 1,950 + "…" if over).
- **Brief input**: 20–2,000 chars. Validated client + server.
- **Demo cannot crash**. Every failure mode (OpenRouter 5xx, malformed output, network blip) has a graceful fallback path.
- **Budget**: hackathon-scale OpenRouter usage. Single-digit dollars for many rehearsals.
- **No analytics, no telemetry, no logging of brief content or model output**. Vercel logs may capture timing + status codes only.

## Stack pinning

| Component | Choice | Reason |
| --- | --- | --- |
| Frontend framework | none (vanilla JS) | Demo-day stability > developer ergonomics |
| Dev server (optional) | Vite (only if needed for fast reload) | Zero impact on production build |
| Runtime | Vercel Node 20 (default) | One-click deploy, free tier sufficient |
| LLM provider | OpenRouter | User choice; OpenAI-compatible API |
| Model | `anthropic/claude-sonnet-4.6` | Speed + quality balance for ≤ 8s output |
| Auth on `/api/alex` | none | Demo only; no public traffic |
| Database | none | Stateless |
| Hosting | Vercel | Static + serverless in one deploy |
| LinkedIn integration | share-URL only | No API key, no OAuth, no review |
