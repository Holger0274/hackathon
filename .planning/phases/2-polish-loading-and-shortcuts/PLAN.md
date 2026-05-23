# Phase 2 PLAN — Polish: Copy buttons on output cards

> Branch: `riff/phase-2-polish-loading-and-shortcuts`
> Scope (revised): Copy-Buttons only. Loading-Rotation + Cmd+Shift+P already shipped in Phase 1.

## Goal

Every output card (LinkedIn Ad, Job Spec, Interview Scorecard) gets a "Copy" button. Click → raw section text on clipboard. Button momentarily flips to "Copied ✓" for 1.5s, then resets.

The pitcher can copy any section to paste into Slack, an ATS, or a doc — without scrolling and selecting manually.

## Acceptance criteria

| # | Criterion |
|---|---|
| 1 | LinkedIn Ad card has a "Copy" button. Click copies the raw LinkedIn ad text (not HTML) to clipboard. |
| 2 | Job Specification card has a "Copy" button. Click copies the raw Job Spec Markdown to clipboard. |
| 3 | Interview Scorecard card has a "Copy" button. Click copies the raw Scorecard Markdown to clipboard. |
| 4 | After successful copy, the clicked button shows "Copied ✓" for exactly 1500ms, then reverts. |
| 5 | If the Clipboard API call rejects (permission denied, insecure context), button shows "Copy failed" for 1500ms. |
| 6 | Copy button visually matches existing card-action buttons (DM Mono label, blue accent on LinkedIn Hero card matching the Post button row, neutral on the other two). |
| 7 | Existing "Post to LinkedIn →" button keeps working; the Copy button sits next to it on the hero card. |
| 8 | Reset (`Brief Alex again`) clears any pending "Copied ✓" state correctly (no stale timers leaking). |

## Tasks

### Task 1 — CSS: card-action row + copy button styles
**Files:** `styles.css`
- Ensure `.output-card-actions` is a flex row with `gap: 12px` (already exists; verify and tune if needed).
- Add `.cta-button--ghost` modifier: same dimensions as primary CTA, transparent bg, `border: 1px solid var(--border)`, text `var(--white)`, hover bumps border to `var(--blue)`. DM Mono label, UPPERCASE, 12px letter-spacing 0.05em.
- Add `.cta-button--ghost.is-success` state: text `var(--green)`, border `var(--green)` for the 1.5s feedback window.
- Add `.cta-button--ghost.is-error` state: text `var(--red)`, border `var(--red)`.

### Task 2 — JS: render Copy buttons on all 3 cards
**Files:** `alex.js`
- In `renderOutput()`, add a Copy button to each of the 3 cards (hero / spec / scorecard).
  - On the hero card: copy button sits next to "Post to LinkedIn →" in the same `output-card-actions` row.
  - On spec + scorecard cards: create a `output-card-actions` row containing only the Copy button.
- Each Copy button gets a click handler bound to its respective raw text (closed over `adText` / `specContent` / `scoreContent` from `parseSections`).

### Task 3 — JS: copy handler with feedback + cleanup
**Files:** `alex.js`
- Implement `attachCopyHandler(button, text)`:
  - On click: `await navigator.clipboard.writeText(text)`.
  - On success: store original label, set `textContent = 'Copied ✓'`, add `.is-success` class, set 1500ms timer to revert.
  - On reject (any error): set `textContent = 'Copy failed'`, add `.is-error` class, 1500ms timer to revert. Log to `console.error` with truncated message.
  - Guard against double-click while feedback active: ignore clicks if button already has `.is-success` or `.is-error`.
- In `doReset()`: clear any active feedback timers by storing them on the button (`button._feedbackTimer`) and clearing in reset.

### Task 4 — Verify with smoke check
**Files:** none — manual verification only.
- Open `/alex` locally (or production), submit a brief, wait for output.
- Click each Copy button; verify clipboard contains the raw text (paste into a scratch buffer).
- Verify "Copied ✓" appears for ~1.5s.
- Verify no console errors.

## Smoke section

Manual browser smokes (no automated harness available — vanilla project):
1. `vercel dev` → submit rehearsal brief (Cmd+Shift+P) → wait for 3 cards → click each Copy button → paste into a text editor and verify content matches.
2. Test on production URL (`hackathon-rust-ten.vercel.app/alex`) — Clipboard API requires HTTPS, so production is the real test.

## Out of scope

- Loading-state changes (already polished in Phase 1).
- Cmd+Shift+P (already wired in Phase 1).
- Animation on card entrance (would be Phase 4 polish, not requested).

## Model Recommendation

`executor_model: sonnet` — small, well-bounded JS+CSS change, no novel architecture.
