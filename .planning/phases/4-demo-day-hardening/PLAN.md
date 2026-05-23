# Phase 4 — Demo-Day Hardening

> Branch: `riff/phase-4-demo-day-hardening`
> Goal: Three safety nets for the live demo: local-fallback docs, observable LinkedIn-URL guard, pre-demo checklist.

## Acceptance criteria

1. `Docs/RUN-LOCAL.md` exists. A new contributor can follow it from scratch and get a working Alex demo on `localhost:3000` in <5 minutes without touching Vercel infra.
2. The existing LinkedIn-length truncation guard (already in `alex.js:346-348`) becomes **visible to the operator** — a soft, non-blocking on-screen pill ("trimmed to fit LinkedIn's 2k limit") next to the Post button when truncation fires. Currently it only logs to `console.warn`, which the pitcher won't see live.
3. `Docs/PRE-DEMO.md` exists as a tickable checklist of every step the pitcher must verify before going on stage.

## Existing state (don't rebuild)

- LinkedIn truncation **already implemented** — `alex.js:344-353`. Slices to 1950 + "…" if `text.length > 2000`. The only gap is operator visibility.
- `.env.example` already documents `OPENROUTER_API_KEY` and the model the API uses.
- `vercel.json` already has `"outputDirectory": "."` so `vercel dev` serves the static files correctly.
- `Docs/` directory exists (already holds `brand-guidelines.md`, `peopleos-alex-demo.html`).

## Tasks

### Task 4.1 — `Docs/RUN-LOCAL.md` (parallel with 4.2 + 4.3)

New markdown file. Structure:

```
# Run PeopleOS Alex demo locally

> 5-minute setup, zero Vercel-side config needed beyond an API key.

## Prerequisites

- Node 20+ (`node --version`)
- An OpenRouter API key (https://openrouter.ai)
- `vercel` CLI installed globally (`npm i -g vercel`)

## Setup (one-time)

1. Clone + cd
2. `cp .env.example .env.local`
3. Edit `.env.local`, paste your `OPENROUTER_API_KEY`
4. `vercel link` — link to the Vercel project (only first time)

## Run

```bash
vercel dev
```

Open http://localhost:3000 — you see the 8-card team. Click Alex.

## Smoke-test the full demo path

1. Hit Cmd/Ctrl+Shift+P → rehearsed brief is pre-filled
2. Click "Get to work, Alex →" → 3-section output renders in ≤8s
3. Click "Post to LinkedIn →" → LinkedIn share window opens with the ad pre-populated

## If something breaks

| Symptom | Cause | Fix |
|---|---|---|
| 401 from the API | `OPENROUTER_API_KEY` not set | Re-edit `.env.local`, restart `vercel dev` |
| "Alex is having a moment" | OpenRouter timeout / network blip | Click "Try again, Alex →" |
| Output panel empty | Model returned no `## LINKEDIN JOB ADVERT` section | See Phase 5 (fallback rendering) — not yet implemented |
| LinkedIn window blank | `popup blocker` on browser | Allow popups for localhost:3000 |

## Live demo without Vercel

If the venue's wifi blocks Vercel:

1. Run `vercel dev` on the laptop (uses local Vercel functions, no cloud)
2. Project = phone hotspot, NOT venue wifi
3. Open browser to `http://localhost:3000` — works fully offline of the public internet, only the OpenRouter call needs net.
```

(Keep tone concise. UK English. Markdown only — no diagrams.)

### Task 4.2 — Visible truncation pill (parallel with 4.1 + 4.3)

Surface the silent `console.warn` to the operator. Two files:

**`alex.js`** — refactor the Post-button click handler (lines 344-353) so truncation also paints a small status element next to the button:

```js
postBtn.addEventListener('click', function () {
  var text = adText;
  var wasTruncated = false;
  if (text.length > 2000) {
    text = text.slice(0, 1950) + '…';
    wasTruncated = true;
    console.warn('LinkedIn ad truncated to 1950 chars (original: ' + adText.length + ')');
  }
  var url = 'https://www.linkedin.com/feed/?shareActive=true&text=' +
            encodeURIComponent(text);
  window.open(url, '_blank', 'noopener,noreferrer');
  if (wasTruncated) {
    showTruncationPill(heroActions);
  }
});
```

Add a helper next to `showCopyFeedback`:

```js
function showTruncationPill(container) {
  // Idempotent — only one pill at a time
  var existing = container.querySelector('.truncation-pill');
  if (existing) existing.remove();
  var pill = document.createElement('span');
  pill.className = 'truncation-pill';
  pill.textContent = 'Trimmed to fit LinkedIn (2k limit)';
  container.appendChild(pill);
  setTimeout(function () { pill.remove(); }, 4000);
}
```

**`styles.css`** — append at the end of the existing button-states block:

```css
.truncation-pill {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.05em;
  color: var(--warn-text);
  background: var(--warn-bg);
  border: 1px solid var(--warn-border);
  padding: 6px 10px;
  border-radius: 2px;
  align-self: center;
}
```

Note: `.output-card-actions` is already `display: flex` with `gap: 10px`, so the pill sits naturally next to the buttons.

### Task 4.3 — `Docs/PRE-DEMO.md` (parallel with 4.1 + 4.2)

New markdown file. Tickable, exhaustive, tuned for "30 minutes before going on stage":

```
# Pre-demo checklist

> Run through this 30 min before going on stage. If any box is not ticked, the demo is not ready.

## Infrastructure

- [ ] Production URL bookmarked in the browser bookmarks bar (not in history)
- [ ] `OPENROUTER_API_KEY` confirmed in Vercel project env (Project → Settings → Environment Variables → "Production")
- [ ] Production deploy is green (Vercel dashboard → no failing build)
- [ ] Test the live URL once — full demo path: brief → output → LinkedIn dialog
- [ ] LinkedIn account logged in on the demo browser (NOT in incognito)
- [ ] Browser cache cleared (Cmd+Shift+Delete → last hour)

## Backup plan

- [ ] `Docs/RUN-LOCAL.md` skimmed; laptop can run `vercel dev` if the deploy goes down
- [ ] `.env.local` on the laptop has a working `OPENROUTER_API_KEY` (NOT a placeholder)
- [ ] Phone hotspot tested as a backup network (venue wifi often blocks API calls)

## Demo flow

- [ ] Rehearsed brief copied into clipboard (or Cmd+Shift+P shortcut tested live)
- [ ] Demo run three times back-to-back with different briefs — output looks sensible each time
- [ ] LinkedIn share window opens (not blocked by popup blocker)
- [ ] Tested truncation pill: paste a brief that produces >2000 chars, confirm "Trimmed to fit" pill appears next to Post button

## On stage

- [ ] Browser at 125% zoom or bigger (back-row readability)
- [ ] DevTools / console window closed
- [ ] Notifications muted (macOS Focus / DnD on)
- [ ] Bookmarks bar visible, but only this project's URL pinned
- [ ] Backup tab open with the rehearsed brief in case Cmd+Shift+P fails on stage

## Pitch script (cue cards)

- [ ] Intro line memorised: "Meet your AI HR team. Eight specialists. One platform."
- [ ] Alex-card click → "Here's Alex. Talent Acquisition Manager."
- [ ] Brief paste → "Watch what 30 seconds of AI does to hiring."
- [ ] Post-to-LinkedIn → "And it's live."
```

(Keep tickable, no prose blocks. Each item one line.)

## Parallel grouping

All three tasks touch different files — fully independent. Mark `parallel: [4.1, 4.2, 4.3]` in the executor brief.

## Smoke

- `cat Docs/RUN-LOCAL.md | wc -l` → >40 lines
- `cat Docs/PRE-DEMO.md | wc -l` → >25 lines
- Open `alex.html` locally, paste a 3000-char brief into the textarea (use the existing maxlength=2000 disabled state will block — bypass by directly running `postBtn.click()` from devtools after seeding a long `adText`), confirm pill appears for 4 seconds.
- Manual sanity: `grep truncation-pill styles.css` returns 1 hit, `grep showTruncationPill alex.js` returns 2 hits (definition + call).

## Out of scope

- No streaming, no fallback rendering — those are Phase 5.
- No new API endpoints, no env-var changes, no Vercel config changes.
- Pill is visual only — no aria-live announcement (the toast lifecycle is short, and screen-reader users wouldn't be operating a live LinkedIn share anyway).

## Model Recommendation

- `executor_model: sonnet` (three independent edits, no architecture, ~80 lines total).
