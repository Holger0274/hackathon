# Phase 3 — Team Showcase Page: Summary

## What was built

The placeholder landing page (a single "Meet Alex →" CTA button) was replaced with a full 8-card team showcase grid. The grid renders all eight PeopleOS AI agents in render order AX → JS → RT → PR → MK → CL → SN → DL using the existing `.team-grid` / `.team-card` CSS from `styles.css`. Alex Chen is the sole active card — wrapped in a clickable `<a href="/alex">`, with a gold "Active" pill and a green `.online-dot` inside the avatar. The remaining seven agents render as `<div aria-disabled="true">` with a muted "Coming soon" pill and `opacity: 0.6`. No JavaScript, no new CSS, and no external dependencies were added.

## Files changed

| Path | Purpose |
|---|---|
| `index.html` | Replaced single CTA `<section>` block with full 8-card team grid markup |

## Tasks done

- [x] **Task 3.1** — Rewrote `index.html`: replaced `<section><a href="/alex" class="cta-button">Meet Alex →</a></section>` with the 8-card team grid; render order AX, JS, RT, PR, MK, CL, SN, DL; Alex uses `<a>`, all others use `<div aria-disabled="true">`; `.online-dot` placed inline inside Alex's avatar div.
- [x] **Task 3.2** — CSS assessed: no visible problems found. Existing `.team-grid`, `.team-card`, `.team-card--active`, `.team-card--inactive`, `.status-pill--active`, `.status-pill--coming`, `.avatar`, and `.online-dot` styles from `styles.css` cover all requirements. No CSS patches applied.

## Smoke results

`vercel dev` is not running in this environment. Local file-based check performed instead:

```
grep -c 'class="team-card' index.html  →  8 card container elements confirmed
```

Manual verification pending — Vercel deploy will smoke this.

Expected results once deployed:
- 8 cards visible in browser, 3-col grid, 9th cell empty
- Alex card: gold "Active" pill, green dot in avatar, hover → blue border, click → `/alex`
- Other 7 cards: muted grey "Coming soon" pill, `cursor: not-allowed`, non-clickable

---

> Status: code complete
> Branch: `riff/phase-3-team-showcase-page`
> Merge commit: {{MERGE_COMMIT}}
