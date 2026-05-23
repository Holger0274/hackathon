# State — PeopleOS

## Current Position

- **Command**: /riff:next (Phase 3 merged)
- **Phase**: Phase 3 done. Ready for Phase 4 (Demo-Day Hardening).
- **Stage / Step**: idle
- **Status**: Phase 3 merged to main (merge SHA a18d689, 2026-05-23)
- **Last action**: `git merge --no-ff riff/phase-3-team-showcase-page`

## Active Phase

- **Id**: 4
- **Slug**: 4-demo-day-hardening
- **Branch**: riff/phase-4-demo-day-hardening
- **Step**: 5 (pending)

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

## Files to bootstrap

- (none — Phase 3 complete, all files committed)

## Resume Command

Run `/riff:next` to start Phase 4 (demo-day-hardening).

## Session Notes

- Phase 1 executor pulled forward two Phase 2 features that were trivially cheap (loading rotation, Cmd+Shift+P shortcut).
- Model slug was initially written as `claude-sonnet-4-6` (hyphenated); fixed to `claude-sonnet-4.6` (dotted) per OpenRouter's slug convention.
- Phase 3: CSS scaffold was pre-authored in Phase 1, so implementation was 86 lines of HTML only.

## Blockers

- None.

## Next Action

Run `/riff:next` to start Phase 4 (Demo-Day Hardening — local fallback + LinkedIn URL validation + pre-demo checklist).
