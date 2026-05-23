# Phase 5 — Agent Prompts

> Captures the prompts sent to each sub-agent by the orchestrator during this phase.
> Used by `riff-pr-metadata.sh` to inject prompts into the PR body for stakeholder review.

## Planner

Inline (Opus, parent). Inputs: ROADMAP.yaml phase 5 entry, STATE.md, api/alex.js (current non-streaming endpoint), alex.js (fetchOutput + renderOutput at lines 115-135, 302-321). Key finding: fallback rendering already exists (lines 309-321). Scope reduced to streaming only. Output: PLAN.md with 2 tasks — new api/alex-stream.js SSE endpoint + frontend fetchOutputStreaming() with fallback to existing POST path.

## Executor

_(not invoked)_

## Adversarial reviewer (Codex)

_(not invoked)_

## Security reviewer

_(not invoked)_

## Debugger (if invoked)

_(not invoked)_
