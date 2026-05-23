# Pages & Functionality — PeopleOS Hackathon Demo

Two pages. One user flow: Team → Alex → Brief → Output → Post.

---

## Page Map

| Route | Purpose | Auth | States |
| --- | --- | --- | --- |
| `/` | Team showcase. 8 agent cards. Sets the "AI HR team" narrative. | none | idle (only state) |
| `/alex` | Alex's chat interface. Input + output. | none | idle → submitting → result \| error |

Two pages cover the entire hackathon demo. Everything else is deferred.

---

## Page 1 — Team Showcase (`/`)

### Purpose

The opener. When the pitcher switches to this page on stage, the audience instantly grasps "PeopleOS = 8 named AI HR managers". Only Alex is interactive — the other 7 establish the vision without committing to ship.

### Layout (DM Sans 15px, max-width 900px, dark theme per brand guidelines)

```
+================================================================+
| ⚙ PEOPLEOS · YOUR AI HR TEAM                                   |  <- role-badge style, DM Mono 12px, blue
+================================================================+
|                                                                |
|  Meet your AI HR team.                                         |  <- H1, Syne 48px 800, "team." in gold
|  ────────────────────────────────────────                      |
|  Eight specialists. One platform. All available today.         |  <- subtitle, DM Sans 16px, muted
|                                                                |
+================================================================+
|                                                                |
|  H2 ── THE TEAM ─────────────────────────────────              |  <- gold, 11px Syne, trailing line
|                                                                |
|  +---------------+  +---------------+  +---------------+       |
|  |  ●  AX        |  |     JS        |  |     RT        |       |  <- ● = green online dot (only on Alex)
|  |  Alex Chen    |  |  Jordan Smith |  |  Rae Taylor   |       |
|  |  Talent Acq   |  |  Onboarding   |  |  Performance  |       |
|  |  [ ACTIVE ]   |  |  [ COMING ]   |  |  [ COMING ]   |       |  <- ACTIVE = gold pill, COMING = muted pill
|  +---------------+  +---------------+  +---------------+       |
|                                                                |
|  +---------------+  +---------------+  +---------------+       |
|  |     PR        |  |     MK        |  |     CL        |       |
|  |  Priya R.     |  |  Morgan K.    |  |  Casey L.     |       |
|  |  Comp & Ben   |  |  L&D          |  |  Culture      |       |
|  |  [ COMING ]   |  |  [ COMING ]   |  |  [ COMING ]   |       |
|  +---------------+  +---------------+  +---------------+       |
|                                                                |
|  +---------------+  +---------------+                          |
|  |     SN        |  |     DL        |                          |
|  |  Sam N.       |  |  Dana L.      |                          |
|  |  HR Ops       |  |  Compliance   |                          |
|  |  [ COMING ]   |  |  [ COMING ]   |                          |
|  +---------------+  +---------------+                          |
|                                                                |
+================================================================+
|  PeopleOS · Berlin 2026                                        |  <- footer, DM Mono 11px, muted
+================================================================+
```

### Interactive elements

| Element | Behaviour |
| --- | --- |
| Alex's card | `cursor: pointer`; hover lifts border from `#1a2a3a` → `#60a5fa` (blue); click → `location.href = '/alex'` |
| The other 7 cards | `cursor: not-allowed`; no hover effect; click does nothing. Tooltip on hover: "Coming soon". |
| Green online dot | Static CSS only — no animation. Pulse animation deferred (Phase 2 polish). |

### States

Only **idle**. No loading, no errors. Page is static HTML, no API calls.

### What lives where (component recipe)

- `.agent-card` — from brand guidelines § Agent / Person Card.
- `.avatar` — 60×60px circle, blue-on-navy initials.
- `.tag` for "ACTIVE" / "COMING SOON" — DM Mono 10px, uppercase. ACTIVE uses `--gold` text on `#1a1000` bg + `#3a2a00` border. COMING uses `--muted` text on `#1a1a1a` bg + `--border` border.

### Routing decisions

- **Plain hash routing not needed.** Vercel serves `/` and `/alex` as separate `.html` files (`index.html`, `alex.html`). No client-side router. Browser back button works natively.
- **No prefetch on Alex card hover.** The Alex page is static HTML (~5 KB) — fetch latency is irrelevant.

---

## Page 2 — Alex Interface (`/alex`)

### Purpose

The functional core. The pitcher types/pastes a brief, Alex generates three outputs, the LinkedIn ad gets posted live. This is the whole demo.

### Layout (idle state)

```
+================================================================+
|  ← Back to team                                                |  <- DM Mono 12px, muted, top-left
+================================================================+
|                                                                |
|  ┌──────────────────────────────────────────────────────────┐  |
|  │  [ AX ]   Alex Chen                            ● Online  │  |  <- agent-card from brand
|  │           Talent Acquisition Manager                     │  |
|  │           HIRING & RECRUITMENT · AGENT 1 OF 8            │  |  <- tag
|  └──────────────────────────────────────────────────────────┘  |
|                                                                |
|  H2 ── BRIEF ALEX ───────────────────────────────              |
|                                                                |
|  +----------------------------------------------------------+  |
|  |                                                          |  |
|  |  Brief Alex on the role you need to fill…                |  |
|  |                                                          |  |
|  |  (6 rows, DM Sans 15px, dark textarea, gold border       |  |
|  |   on focus)                                              |  |
|  |                                                          |  |
|  +----------------------------------------------------------+  |
|                                                                |
|                          [ Get to work, Alex → ]               |  <- gold CTA button
|                                                                |
+================================================================+
```

### Layout (submitting state)

The CTA button + textarea become disabled. A new spec-block appears below:

```
+================================================================+
|  (header + agent card + textarea unchanged, but disabled)      |
+================================================================+
|                                                                |
|  ┌──────────────────────────────────────────────────────────┐  |
|  │  ▍ALEX IS ON IT…                                         │  |  <- DM Mono 13px, blue ▍ block cursor
|  │                                                          │  |
|  │  Reviewing the brief.                                    │  |  <- rotating text every ~1.5s:
|  │                                                          │  |     • Reviewing the brief.
|  │  ●●●○                                                    │  |     • Drafting the advert.
|  │                                                          │  |     • Building the scorecard.
|  └──────────────────────────────────────────────────────────┘  |
|                                                                |
+================================================================+
```

### Layout (result state)

```
+================================================================+
|  (header + agent card unchanged)                               |
+================================================================+
|                                                                |
|  H2 ── LINKEDIN JOB ADVERT ──────────────────────              |  <- gold
|                                                                |
|  ┌──────────────────────────────────────────────────────────┐  |  <- featured/hero card: gold-dim border
|  │                                                          │  |
|  │  🚀 We're hiring: Senior Software Engineer (London)      │  |
|  │                                                          │  |
|  │  [LinkedIn-formatted ad copy here, rendered as           │  |
|  │   pre-wrapped text — newlines preserved, emoji intact]   │  |
|  │                                                          │  |
|  │  Apply: …                                                │  |
|  │                                                          │  |
|  │                       [ Copy ]   [ Post to LinkedIn → ]  │  |  <- blue CTA, gold "Post" emphasis
|  └──────────────────────────────────────────────────────────┘  |
|                                                                |
|  H2 ── JOB SPECIFICATION ────────────────────────              |
|                                                                |
|  ┌──────────────────────────────────────────────────────────┐  |  <- standard card
|  │  Role purpose. Reports to. Location. Responsibilities…   │  |
|  │  [Markdown-rendered: headings, bullets, bold]            │  |
|  │                                                          │  |
|  │                                              [ Copy ]    │  |
|  └──────────────────────────────────────────────────────────┘  |
|                                                                |
|  H2 ── INTERVIEW SCORECARD ──────────────────────              |
|                                                                |
|  ┌──────────────────────────────────────────────────────────┐  |
|  │  Competency │ Question 1 │ Question 2 │ Rating 1-5       │  |  <- rendered as table
|  │  ────────── │ ────────── │ ────────── │ ────────         │  |
|  │  …                                                       │  |
|  │                                                          │  |
|  │                                              [ Copy ]    │  |
|  └──────────────────────────────────────────────────────────┘  |
|                                                                |
|                          [ Brief Alex again ]                  |  <- muted secondary button → reset
|                                                                |
+================================================================+
```

### Layout (error state)

```
+================================================================+
|  (header + textarea unchanged, textarea re-enabled)            |
+================================================================+
|                                                                |
|  ┌──────────────────────────────────────────────────────────┐  |  <- warning box from brand
|  │  ⚠  Alex is having a moment.                             │  |
|  │                                                          │  |
|  │  Network hiccup. Hit the button again — it usually       │  |
|  │  takes one retry on a busy network.                      │  |
|  │                                                          │  |
|  │                            [ Try again, Alex → ]         │  |
|  └──────────────────────────────────────────────────────────┘  |
|                                                                |
+================================================================+
```

### State machine

```
        ┌─────────┐  submit  ┌────────────┐  fetch OK   ┌────────┐
        │  idle   │ ───────▶ │ submitting │ ──────────▶ │ result │
        └─────────┘          └────────────┘             └────────┘
             ▲                     │  fetch error           │
             │                     ▼                        │
             │                ┌─────────┐                   │
             └────────────────│  error  │                   │
                  retry       └─────────┘                   │
                                                            │
             ┌──────────────────────────────────────────────┘
             │  "Brief Alex again" button → reset to idle
```

| From → To | Trigger | What happens |
| --- | --- | --- |
| `idle` → `submitting` | Click "Get to work, Alex" OR Cmd/Ctrl+Enter in textarea | Disable textarea + CTA. Render "Alex is on it" panel. POST `/api/alex` with `{ brief }`. |
| `submitting` → `result` | 200 response from `/api/alex` | Parse the 3 sections from response. Render 3 cards. Smooth scroll to first card. |
| `submitting` → `error` | non-2xx, network error, or timeout (30s) | Show warning panel. Re-enable textarea + CTA (now labelled "Try again, Alex"). |
| `result` → `idle` | Click "Brief Alex again" | Clear textarea, hide outputs, scroll to top. |
| `error` → `submitting` | Click "Try again, Alex" | Same as idle→submitting. |

### Interactive elements

| Element | Behaviour |
| --- | --- |
| Textarea | `placeholder="Brief Alex on the role you need to fill…"`. `Cmd+Enter` / `Ctrl+Enter` submits. Min 20 chars required (else CTA stays disabled). Max 2,000 chars (input prevented). |
| "Get to work, Alex" CTA | Gold button. Disabled until brief is ≥20 chars. Renamed to "Try again, Alex" in error state. |
| Hidden shortcut `Cmd+Shift+P` | Pastes the rehearsed brief into the textarea (defined in `BRIEF_REHEARSAL` constant in `alex.js`). Pitcher's safety net. |
| "Copy" buttons | Clipboard API → `navigator.clipboard.writeText(...)`. On success: button text flips to "Copied ✓" for 1.5s, gold colour. |
| "Post to LinkedIn" button | Blue button with gold "→" emphasis. Click: `window.open('https://www.linkedin.com/feed/?shareActive=true&text=' + encodeURIComponent(linkedInAdText), '_blank')`. |
| "Brief Alex again" | Muted secondary button. Resets state to idle. |
| "Back to team" link | Top-left, `<a href="/">`. |

### Parsing the model output

Alex's system prompt produces three Markdown sections separated by `## LINKEDIN JOB ADVERT`, `## JOB SPECIFICATION`, `## INTERVIEW SCORECARD`. Client splits on those headers:

```js
const sections = text.split(/^## /m).filter(Boolean).reduce((acc, chunk) => {
  const [title, ...body] = chunk.split('\n');
  acc[title.trim()] = body.join('\n').trim();
  return acc;
}, {});
// → { 'LINKEDIN JOB ADVERT': '...', 'JOB SPECIFICATION': '...', 'INTERVIEW SCORECARD': '...' }
```

Rendering:
- LinkedIn ad → `<pre style="white-space: pre-wrap">` to preserve emojis + line breaks exactly as the model produced them.
- Job spec → render as Markdown using a tiny dependency-free function (the model produces only `##`, `**bold**`, `-` bullets — no nested complexity).
- Scorecard → expect a Markdown table; render via the same Markdown function.

If a section is missing (model misbehaves): render the raw response in a single fallback card with a "Show raw output" disclosure. Demo doesn't crash.

### Routing decisions

- `/alex` is a separate static HTML file (`alex.html` rewritten by Vercel to `/alex`).
- Back button: native browser back returns to `/`. No history manipulation.
- No deep-linking of outputs (no `?brief=…` query). Each demo session is fresh.

---

## Cross-page handoff

Single transition: click Alex card on `/` → navigate to `/alex`. No data passed between pages. State is purely per-page-load.

---

## Accessibility (best-effort for hackathon)

- All buttons have visible focus rings (gold 2px outline).
- Textarea is keyboard-focusable on `/alex` page load (`autofocus`).
- `Cmd+Enter` submits — most live-demo users will reach for it.
- Colour contrast: gold on dark (`#f5a623` on `#0a0a0a`) = 8.5:1 → passes AAA. Blue on dark = 7.1:1 → passes AAA. ✓
- No screen-reader testing for demo (out of scope, would be added if this went to production).

---

## Routing summary

| Path | File served | Notes |
| --- | --- | --- |
| `/` | `index.html` | Vercel default. |
| `/alex` | `alex.html` | Configured via `vercel.json` rewrite OR served as `alex/index.html` (Vercel auto-resolves). |
| `/api/alex` | `api/alex.js` | Vercel serverless function (Node 20 runtime). |

`vercel.json` (if rewrite is needed):

```json
{
  "rewrites": [
    { "source": "/alex", "destination": "/alex.html" }
  ]
}
```

---

## Top routing / page decisions surfaced

1. **Two static HTML files, not a SPA.** Aligns with the "plain HTML/CSS/JS" constraint and removes a whole class of routing bugs from the demo day.
2. **No client-side state shared across pages.** Each page is self-contained. Avoids "stale brief from previous attempt" bugs.
3. **The hidden `Cmd+Shift+P` shortcut is a hard requirement, not a polish item.** It's the pitcher's safety net for the live demo.
4. **Hero card uses gold-dim border, NOT a different background.** This matches the brand's principle "depth via border, not shadow" — and visually elevates the LinkedIn ad without breaking dark-first consistency.
5. **Error fallback is the most important non-happy-path.** A graceful error is the difference between "demo paused for 5 seconds" and "demo died on stage". Phase 1 ships it.
