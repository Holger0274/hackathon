# Phase 3 — Team Showcase Page

> Branch: `riff/phase-3-team-showcase-page`
> Goal: Replace the placeholder `/` landing with a proper Team Showcase grid of 8 agent cards. Only Alex is interactive; the other 7 are visibly muted "Coming Soon" cards.

## Acceptance criteria

1. `/` loads a page with **all 8 cards** rendered (3-col grid, last row has 2 cards).
2. **Alex's card** (`AX · Alex Chen · Talent Acquisition`) is clickable → navigates to `/alex`, hover lifts the border to blue (`--blue`), gold "ACTIVE" pill, green online dot on the avatar.
3. **Other 7 cards** are muted (`team-card--inactive`), `cursor: not-allowed`, show a "COMING" pill, no avatar dot, no link.
4. Header keeps the existing `role-badge` + `<h1>Meet your AI HR <em>team.</em></h1>` + subtitle, but the subtitle copy updates to `Eight specialists. One platform. Meet Alex.` (already correct in current file — leave as-is).
5. **No JS file** — pure HTML + existing `styles.css`. Page must load in `<1s` on a fast connection (no external scripts, only Google Fonts).
6. Footer matches existing pattern (`PeopleOS · Berlin 2026`).
7. Smoke: open `/` in browser → 8 cards visible, Alex hover turns border blue, click Alex → `/alex` loads.

## Agent roster (source of truth — match ROADMAP.yaml verbatim)

| Initials | Name           | Role                   | Status   |
|----------|----------------|------------------------|----------|
| AX       | Alex Chen      | Talent Acquisition     | ACTIVE   |
| JS       | Jordan Smith   | Onboarding             | COMING   |
| RT       | Rae Taylor     | Performance            | COMING   |
| PR       | Priya Rao      | Compensation & Bens    | COMING   |
| MK       | Morgan Kade    | Learning & Devt        | COMING   |
| CL       | Casey Lin      | Culture & Engmt        | COMING   |
| SN       | Sam Nakamura   | HR Operations          | COMING   |
| DL       | Dana Lee       | Compliance & Legal     | COMING   |

## Existing assets (reuse, do not re-invent)

- `styles.css` already ships `.team-grid` (3-col grid, gap 12px), `.team-card`, `.team-card--active`, `.team-card--inactive`, `.status-pill--active` (gold), `.status-pill--coming` (muted), `.avatar` (60×60px circle, overridden to 48×48 inside `.team-card`).
- `.online-dot` (green 8×8 circle) exists for Alex's avatar.
- Footer + `role-badge` + `header` styles all reused.

## Tasks

### Task 3.1 — Rewrite `index.html` with the 8-card grid

Replace the placeholder `<section><a href="/alex">Meet Alex →</a></section>` block with:

```html
<section>
  <h2>The team</h2>
  <div class="team-grid">
    <!-- Alex (active) -->
    <a href="/alex" class="team-card team-card--active">
      <div class="avatar">
        AX<span class="online-dot" aria-label="Online"></span>
      </div>
      <div>
        <div class="team-card-name">Alex Chen</div>
        <div class="team-card-role">Talent Acquisition</div>
        <span class="status-pill status-pill--active">Active</span>
      </div>
    </a>

    <!-- Jordan Smith (coming) -->
    <div class="team-card team-card--inactive" aria-disabled="true" title="Coming soon">
      <div class="avatar">JS</div>
      <div>
        <div class="team-card-name">Jordan Smith</div>
        <div class="team-card-role">Onboarding</div>
        <span class="status-pill status-pill--coming">Coming soon</span>
      </div>
    </div>

    <!-- … 6 more coming-soon cards in the same pattern … -->
  </div>
</section>
```

Render order **left-to-right, top-to-bottom**: AX, JS, RT, PR, MK, CL, SN, DL. The last row (3-col grid, 8 cards) leaves the 9th cell empty — that's fine, no filler needed.

**Online-dot positioning fix**: the dot needs to sit inside the avatar visually. Simplest: just keep the dot inline next to the initials (the existing `.online-dot` spec has `margin-right: 6px` and works as an inline element). If it looks ugly in-card during smoke, demote to a tiny top-right absolute-positioned dot via a `team-card--active` selector tweak — but only if needed (don't pre-emptively rewrite CSS).

### Task 3.2 — Verify CSS coverage, patch only if visibly broken

`styles.css` was authored speculatively for Phase 3 in Phase 1. After rendering Task 3.1, open the page and check:

- Grid is 3 columns, last row has 2 cards aligned left.
- Active card hover turns the border `--blue`.
- Inactive cards show `cursor: not-allowed` (currently set), gold pill visible only on AX.
- Online dot doesn't break the avatar layout.

**Patch CSS only on a real visible problem**, not pre-emptively. If patches are needed, append them at the end of the existing `Team grid` block (don't reorder the file).

### Smoke

Run `vercel dev` (port 3000), open `http://localhost:3000/`:

- `curl -s http://localhost:3000/ | grep -c 'team-card'` → expect `8`
- Visually confirm: 8 cards, Alex active (gold pill, green dot), others muted (grey pill).
- Click Alex → `/alex` opens.
- Click any other card → nothing happens (browser default for `<div aria-disabled>`).

If `vercel dev` isn't running, manual visual smoke via `file://` open of `index.html` is acceptable for this static-only phase (the `/alex` link will 404 on `file://` but the grid itself can be verified).

## Out of scope

- No tooltip JS (browser `title=` attribute is enough for "Coming soon").
- No animation/transitions beyond the existing `border-color 0.15s`.
- No 8th-card layout custom logic (3-col grid naturally handles 8 items).
- No new fonts, no new colors, no new components.
- LinkedIn share, API calls, copy buttons — all live on `/alex` only.

## Model Recommendation

- `executor_model: sonnet` (trivial HTML edit, ~30 lines of markup, no architecture).
