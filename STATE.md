# State — PeopleOS

## Current Position

- **Command**: /riff:next (Phase 4 merged)
- **Phase**: Phase 4 done. Starting Phase 5 (Robustness + Streaming).
- **Stage / Step**: idle
- **Status**: Phase 4 merged to main (merge SHA 198cb65, 2026-05-23)
- **Last action**: `git merge --no-ff riff/phase-4-demo-day-hardening`

## Active Phase

- **Id**: -
- **Slug**: -
- **Branch**: -
- **Step**: -

## Active Decisions

- Scope = production
- Stack source = discussed (no starter clone)
- Architecture adversarial = skipped (trivial 1-function architecture)
- Roadmap adversarial = skipped (5 phases, easy to re-sequence manually)
- LLM provider = OpenRouter
- Model = anthropic/claude-sonnet-4.6
- Hosting = Vercel
- API key storage = Vercel env vars (OPENROUTER_API_KEY)
- Demo scope = Team Showcase + Alex (functional)
- Deadline = today / tomorrow → tracer-bullet mode
- Stack = vanilla HTML/CSS/JS + Vercel Functions
- Phase 1 pulled Phase 2 polish forward; Phase 3 CSS scaffold pre-authored in Phase 1.
- Phase 4: LinkedIn truncation was already in alex.js from Phase 1 — only the visibility gap was closed.

## Open Buckets

- `avatars/` directory + `generate_avatars.py` (with hardcoded API key) sitting untracked in working tree — out of scope for all phases so far, user chose to ignore.

## Resume Command

Run `/riff:next` to start Phase 5 (fallback-rendering-and-streaming).

## Session Notes

- Executor silent-exit pattern seen in Phase 4: executor returned cleanly but did not write SUMMARY.md. Backfilled inline from commit data.

## Blockers

- None.

## Next Action

Phase 5: Robustness (fallback rendering for malformed output) + optional streaming via SSE.
