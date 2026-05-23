# Phase 3 — Agent Prompts

> Captures the prompts sent to each sub-agent by the orchestrator during this phase.
> Used by `riff-pr-metadata.sh` to inject prompts into the PR body for stakeholder review.

## Planner

Inline (Opus, parent). Inputs: ROADMAP.yaml phase 3 entry, STATE.md, PROJECT.md skim, Phase 2 SUMMARY.md, existing index.html / alex.html / styles.css (lines 556-630 already contain a .team-grid scaffold). Output: PLAN.md with two tasks — rewrite index.html with 8-card grid, patch CSS only if visibly broken.

## Executor

Branch: riff/phase-3-team-showcase-page. Read PLAN.md, taste.md, CLAUDE.md, existing index.html / styles.css. Replace the single CTA-button section in index.html with the 8-card team grid per Task 3.1. Only patch styles.css if the live render visibly breaks. Commit with conventional message, stage explicitly. Write SUMMARY.md.

## Adversarial reviewer (Codex)

_(not invoked)_

## Security reviewer

_(not invoked)_

## Debugger (if invoked)

_(not invoked)_
