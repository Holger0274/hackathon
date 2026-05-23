# Phase 1 SUMMARY — Tracer bullet, full end-to-end Alex demo

> Branch: riff/phase-1-tracer-bullet-end-to-end
> Status: pending verification (requires user to run `vercel dev` with their OPENROUTER_API_KEY)
> Commits: b375481, 3e2934d, bbb2de4, 99daf08, d9b3e30
> Merge commit: 7936839

## What was built

**Wave 1 — Backend foundation** (b375481)
- `api/_prompt.js`: Alex system prompt as exported const, verbatim from Builder Brief
- `api/alex.js`: Vercel Node 20 handler — validates brief (20-2000 chars), reads OPENROUTER_API_KEY from env, POSTs to OpenRouter, returns { output }. Logs timing + status only.
- `vercel.json`: /alex → /alex.html rewrite + Node 20 runtime declaration

**Wave 2 — Frontend skeleton** (3e2934d)
- `styles.css`: Full :root CSS vars from brand-guidelines.md + all Phase 1 components
- `index.html`: Minimal landing stub — role-badge, H1 gold em, CTA → /alex, footer
- `alex.html`: Full shell — back-link, agent-card, textarea (autofocus), loading/output/warning panels

**Wave 3 — Frontend logic** (bbb2de4)
- `alex.js`: State machine (idle/submitting/result/error), parseSections(), markdownToHtml() (createElement+textContent only), renderOutput() with hero+spec+scorecard cards + fallback, Post-to-LinkedIn with encodeURIComponent + truncate + noopener,noreferrer, Cmd/Ctrl+Shift+P rehearsal shortcut

## Files changed

| Path | Purpose |
|---|---|
| `api/_prompt.js` | Alex system prompt exported const |
| `api/alex.js` | Vercel serverless OpenRouter proxy + validation |
| `vercel.json` | /alex rewrite + Node 20 runtime config |
| `styles.css` | Shared stylesheet — :root CSS vars + all Phase 1 components |
| `index.html` | Minimal landing stub |
| `alex.html` | Alex interface shell |
| `alex.js` | Alex page client logic — state machine, fetch, parser, renderer, LinkedIn |

## Acceptance criteria

| Criterion | Status |
|---|---|
| `vercel dev` runs locally with OPENROUTER_API_KEY set | PENDING VERIFICATION |
| Production deploy on Vercel | PENDING VERIFICATION |
| /alex renders agent header, textarea, CTA, autofocused | PENDING VERIFICATION |
| Submitting valid brief shows loading panel within 200ms | PENDING VERIFICATION |
| /api/alex returns { output } with three-section Markdown | PENDING VERIFICATION |
| Output parsed into 3 sections; LinkedIn ad card has gold-dim border | PENDING VERIFICATION |
| Post to LinkedIn opens correct URL with noopener,noreferrer | CODE VERIFIED |
| Ad >2000 chars truncated to 1950 + "..." | CODE VERIFIED |
| Network/server errors render warning panel + retry | CODE VERIFIED |
| Malformed output renders fallback card with raw output | CODE VERIFIED |
| Brand fidelity: dark theme, gold/blue, CSS vars only | CODE VERIFIED |
| No OPENROUTER_API_KEY in client-side files | VERIFIED (git grep clean) |
| index.html exists and links to /alex | VERIFIED |

## Smoke results

| Smoke | Command | Status |
|---|---|---|
| curl /api/alex POST empty → 400 | `curl -s http://localhost:3000/api/alex -X POST -H 'Content-Type: application/json' -d '{}'` | PENDING |
| curl /api/alex POST valid brief → 200 with 3 section headers | `curl -s http://localhost:3000/api/alex -X POST -H 'Content-Type: application/json' -d '{"brief":"Alex, I need to hire a Senior Software Engineer with 5 years React experience in London."}'` | PENDING |
| / loads, Meet Alex CTA visible | `open http://localhost:3000/` | PENDING |
| /alex loads, textarea autofocused | `open http://localhost:3000/alex` | PENDING |
| Submit happy path → 3 cards ≤8s | Paste brief, click submit | PENDING |
| Post-to-LinkedIn → new tab with shareActive=true&text=... | Click Post to LinkedIn | PENDING |

## Deploy instructions

### Local dev
```bash
cp .env.example .env.local
# edit .env.local: OPENROUTER_API_KEY=sk-or-...
npm i -g vercel  # if not installed
vercel dev
# open http://localhost:3000/
# open http://localhost:3000/alex
# paste brief, submit
```

### Production deploy
```bash
vercel               # interactive first deploy
vercel env add OPENROUTER_API_KEY production
# paste key when prompted
vercel --prod        # subsequent deploys
```

## Open questions / known issues

- **Model ID**: Using `anthropic/claude-sonnet-4-6` (with hyphen, not dot). Verify this is the correct OpenRouter slug — if not, update the `model:` line in `api/alex.js`.
- **.env.example missing**: Create `.env.example` with `OPENROUTER_API_KEY=` (no value) before first deploy.
- **index.html stub**: Intentionally minimal — full 8-agent Team Showcase with cards, hover states, "COMING SOON" pills is Phase 3.
- **Cmd/Ctrl+Enter submit**: Documented in pages.md but not wired in Phase 1 (Cmd/Ctrl+Shift+P rehearsal shortcut IS wired). Deferred to Phase 2.
- **Copy buttons on output cards**: Deferred to Phase 2.

## Next phase

Phase 2: polish-loading-and-shortcuts (loading animation + copy buttons on output cards)
