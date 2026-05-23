# Phase 1 — Agent Prompts

> Captures the prompts sent to each sub-agent by the orchestrator during this phase.
> Used by `riff-pr-metadata.sh` to inject prompts into the PR body for stakeholder review.

## Planner

```
(inline, Opus parent)
Inputs: ROADMAP.yaml entry for phase 1, PROJECT.md, .planning/design/{pages,architecture}.md, taste.md + taste/{frontend,backend,security}.md, Docs/peopleos-alex-demo.html (Builder Brief), Docs/brand-guidelines.md.

Brief: Plan the tracer-bullet Phase 1 — full end-to-end Alex demo (vanilla HTML/CSS/JS + Vercel Function + OpenRouter). 4 waves. Wave 1 backend (api/alex.js, _prompt.js, vercel.json) parallel-safe. Wave 2 frontend skeleton (styles.css, index.html stub, alex.html). Wave 3 client logic (alex.js — state machine, fetch, parse, render, LinkedIn URL). Wave 4 manual local + Vercel deploy verification (instructional, executor documents but does not run). Risk focus: OpenRouter call shape, section parsing, LinkedIn URL encoding, XSS via model output, key leak.
```

## Executor

```
Branch: riff/phase-1-tracer-bullet-end-to-end
Model: sonnet

FIRST: verify you are on branch riff/phase-1-tracer-bullet-end-to-end. Refuse to proceed if not.

Read in order:
1. .planning/phases/1-tracer-bullet-end-to-end/PLAN.md (the contract)
2. taste.md + taste/frontend.md + taste/backend.md + taste/security.md (the rules)
3. CLAUDE.md (project conventions)
4. CONTEXT.md (locked decisions)
5. Docs/peopleos-alex-demo.html (Alex system prompt verbatim — Section "The System Prompt")
6. Docs/brand-guidelines.md (colours, fonts, spacing)
7. .planning/design/pages.md (wireframes + state machine)
8. .planning/design/architecture.md (function shape, error modes)

Execute all 4 waves from PLAN.md. Wave 1 has three parallel-safe tasks (1.1 _prompt.js, 1.2 api/alex.js, 1.3 vercel.json) — write all three in a single response. Waves 2 (styles.css, index.html, alex.html) and 3 (alex.js) are sequential because alex.js references DOM IDs from alex.html.

Commit after each wave with a conventional message:
- feat(api): OpenRouter proxy function + system prompt
- feat(ui): brand-styled CSS + index landing stub + Alex page shell
- feat(ui): Alex client logic (state machine, fetch, parser, LinkedIn)
- docs(phase-1): SUMMARY.md with deploy instructions

Stage files EXPLICITLY by name — never `git add .` or `git add -A`. Pre-commit hook blocks those.

Wave 4 is INSTRUCTIONAL: document the `vercel dev` + `vercel --prod` commands in SUMMARY.md but do NOT execute them (you don't have the user's OpenRouter key or Vercel account).

Write SUMMARY.md to .planning/phases/1-tracer-bullet-end-to-end/SUMMARY.md per the riff convention:
- ## What was built (per-wave bullets)
- ## Files changed (path: 1-line purpose)
- ## Smoke results (each planned smoke from PLAN.md — PASS/FAIL/SKIPPED with reason. Most will be SKIPPED — "requires running `vercel dev` with OPENROUTER_API_KEY". Document what the user needs to do to verify.)
- ## Deploy instructions (the exact commands the user runs)
- ## Open questions / known issues

Acceptance criteria from PLAN.md must each be testable from the SUMMARY.

Anti-patterns to avoid — also in PLAN.md, restating:
- No build step (no Vite/webpack in production path)
- No npm dependencies in api/alex.js (use built-in fetch)
- No Markdown library — hand-roll ~30 lines
- No innerHTML on raw model text
- No hardcoded API key
- Never log brief or model output

Brand fidelity is load-bearing — use CSS variables, never inline hex.

When done: SUMMARY.md complete, all files committed, on the phase branch, no uncommitted changes.
```

## Adversarial reviewer (Codex)

```
{{prompt verbatim}}
```

## Security reviewer

```
{{prompt verbatim}}
```

## Debugger (if invoked)

```
{{prompt verbatim}}
```
