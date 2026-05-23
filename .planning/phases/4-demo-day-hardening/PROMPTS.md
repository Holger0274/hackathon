# Phase 4 — Agent Prompts

> Captures the prompts sent to each sub-agent by the orchestrator during this phase.
> Used by `riff-pr-metadata.sh` to inject prompts into the PR body for stakeholder review.

## Planner

Inline (Opus, parent). Inputs: ROADMAP.yaml phase 4 entry, STATE.md, existing alex.js (lines 335-355 already implement silent truncation), .env.example, Docs/. Output: PLAN.md with three independent tasks (run-local docs, visible truncation pill, pre-demo checklist) marked parallel.

## Executor

Branch: riff/phase-4-demo-day-hardening. Read PLAN.md, taste.md, CLAUDE.md, alex.js (lines 335-355), styles.css. Execute all 3 tasks (4.1, 4.2, 4.3) — they touch different files so can be done in any order. Commit each task separately with conventional message. Write SUMMARY.md.

## Adversarial reviewer (Codex)

_(not invoked)_

## Security reviewer

_(not invoked)_

## Debugger (if invoked)

_(not invoked)_
