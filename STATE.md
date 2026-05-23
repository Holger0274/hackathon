# State — PeopleOS

## Current Position

- **Command**: /riff:start
- **Phase**: 1 (tracer-bullet-end-to-end)
- **Stage / Step**: discovery complete
- **Status**: Initialized
- **Last action**: Bootstrap files written (Stage 5)

## Active Phase

- **Id**: 1
- **Slug**: 1-tracer-bullet-end-to-end
- **Branch**: riff/phase-1-tracer-bullet-end-to-end
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

## Open Buckets

- Nothing in flight. Ready for `/riff:next` to start Phase 1.

## Files to bootstrap

- PROJECT.md
- ROADMAP.yaml
- CONTEXT.md
- taste.md (+ taste/frontend.md, taste/backend.md, taste/security.md)
- .planning/design/pages.md
- .planning/design/architecture.md
- INCIDENTS.md
- Docs/peopleos-alex-demo.html (existing — Builder Brief, the source of truth for visual + prompt details)
- Docs/brand-guidelines.md (existing — colour + type system)

## Resume Command

Run `/riff:next` to start Phase 1 (tracer-bullet-end-to-end).

## Session Notes

- Existing files in `Docs/` (peopleos-alex-demo.html, brand-guidelines.md) are the authoritative source for visual design + Alex system prompt.
- `CLAUDE.md` declares "Plain HTML/CSS/JS (kein Framework, keine Build-Pipeline)" — Vercel functions are an addition, not a contradiction. Update CLAUDE.md if the framework note misleads future sessions.

## Blockers

- None.

## Next Action

Run `/riff:next` to begin Phase 1 implementation.
