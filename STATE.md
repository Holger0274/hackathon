# State — PeopleOS

## Current Position

- **Command**: /riff:next (Phase 1 merged)
- **Phase**: Phase 1 done. Ready for Phase 2 or live testing.
- **Stage / Step**: idle
- **Status**: Phase 1 merged to main (merge SHA 7936839, 2026-05-23)
- **Last action**: `git merge --no-ff riff/phase-1-tracer-bullet-end-to-end` + branch deleted

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
- Phase 1 pulled Phase 2 polish (loading rotation, Cmd+Shift+P) forward — Phase 2 scope effectively shrinks to "copy buttons" only.

## Open Buckets

- Local runtime verification still pending — needs `vercel dev` + `OPENROUTER_API_KEY` to smoke-test the function end-to-end.
- Production deploy (`vercel --prod`) pending.

## Files to bootstrap

- (none — Phase 1 complete, all files committed)

## Resume Command

Run `/riff:next` to start Phase 2 (polish-loading-and-shortcuts), OR run `vercel dev` to test Phase 1 locally before continuing.

## Session Notes

- Phase 1 executor pulled forward two Phase 2 features that were trivially cheap (loading rotation, Cmd+Shift+P shortcut). Phase 2 description in ROADMAP still says all three; consider trimming to "copy buttons" only before starting Phase 2.
- Model slug was initially written as `claude-sonnet-4-6` (hyphenated) by the executor; fixed to `claude-sonnet-4.6` (dotted) per OpenRouter's slug convention. Verified against https://openrouter.ai/anthropic/claude-sonnet-4.6.

## Blockers

- None.

## Next Action

Recommended: run `vercel dev` locally (after setting `OPENROUTER_API_KEY` in `.env.local`) and verify the demo end-to-end with a real brief before scheduling Phase 2 or production deploy.
