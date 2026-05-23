# Frontend taste — PeopleOS

Read when touching `index.html`, `alex.html`, `*.css`, or browser-side JS.

## File layout

```
/index.html       — Team Showcase
/alex.html        — Alex Interface
/styles.css       — Single shared stylesheet, contains :root CSS vars + components
/team.js          — Team page logic (minimal: click handler only)
/alex.js          — Alex page logic (state machine, fetch, parse, render)
/api/alex.js      — Server function (see taste/backend.md)
```

## Core rules

- **No bundler in production.** Pages are plain HTML loading plain `<script>` tags. Vite optional for dev-server reload only.
- **CSS variables for every colour.** Hex values live only in `:root`. Components reference `var(--gold)`, not `#f5a623`.
- **One stylesheet for both pages.** Don't split — it's <500 lines total. CSS specificity is easier to reason about with one file.
- **Class names: BEM-ish, no framework conventions.** `.agent-card`, `.agent-card__avatar`, `.agent-card--active`. Lowercase, hyphens, double-underscore for elements, double-hyphen for modifiers.
- **No CSS-in-JS, no Tailwind, no preprocessor.** Vanilla CSS.
- **Inline event handlers are fine** for trivial cases (`<a onclick="...">`). For anything ≥ 2 lines, attach in JS via `addEventListener`.

## DOM interaction

- **Use `document.getElementById` and `querySelector`. No jQuery, no helpers.**
- **State machine for `/alex` is explicit.** A single `state` variable (`'idle' | 'submitting' | 'result' | 'error'`) plus a `render(state)` function. State transitions are functions, not ad-hoc class toggles.
- **Show/hide via `[hidden]` attribute or `display: none` class — pick one, stay consistent.** Recommended: `.is-hidden { display: none; }`.

## Fetch + error handling

- **Use `fetch` directly, no axios.** One call: `POST /api/alex` with `{ brief }`.
- **30s timeout** via `AbortController`. Vercel function will also time out, but client should bail first so the user sees the error panel instead of a hanging UI.
- **Three error categories**, all surface the same user-facing warning panel:
  - Network failure (`fetch` throws).
  - Non-2xx response (`!response.ok`).
  - Malformed JSON (`response.json()` throws).
- **Log to console with full context** (`console.error('alex submit failed:', err, { brief, status })`). The user-visible message stays warm.

## Markdown rendering (no library)

The 3 sections are simple Markdown. Write a ~30-line function that handles:
- `## Header` → `<h3>`
- `**bold**` → `<strong>`
- `- bullet` → `<ul><li>`
- `1. numbered` → `<ol><li>`
- `| col | col |` table rows → `<table>`
- Plain paragraphs separated by blank lines.

**Important**: the LinkedIn ad is NOT Markdown — it's pre-wrapped text with emojis. Render that section in `<pre style="white-space: pre-wrap">` to preserve the model's exact line breaks.

## Section parsing

```js
function parseSections(markdown) {
  const sections = {};
  const parts = markdown.split(/^## /m);
  for (const part of parts) {
    if (!part.trim()) continue;
    const newlineIdx = part.indexOf('\n');
    const title = part.slice(0, newlineIdx).trim();
    const body = part.slice(newlineIdx + 1).trim();
    sections[title] = body;
  }
  return sections;
}
```

If `sections['LINKEDIN JOB ADVERT']` is missing → render fallback card with raw text + "Show raw output" disclosure.

## LinkedIn share URL

```js
const url = 'https://www.linkedin.com/feed/?shareActive=true&text=' + encodeURIComponent(adText);
window.open(url, '_blank', 'noopener,noreferrer');
```

- `noopener,noreferrer` is mandatory — prevents the LinkedIn tab from accessing `window.opener`.
- If `adText.length > 2000`: truncate to `adText.slice(0, 1950) + '…'` and `console.warn` about it.

## Accessibility minimum

- `autofocus` on the textarea on `/alex` page load.
- Visible focus rings on all buttons (gold 2px outline).
- `aria-label` on icon-only elements if any (probably none — we use text buttons).
- `aria-live="polite"` on the output region so screen readers announce when Alex finishes.

## Anti-pattern checklist

- ❌ No bundler in production
- ❌ No CSS preprocessor (Sass, Less, PostCSS)
- ❌ No state library (Redux, Zustand)
- ❌ No router library
- ❌ No HTTP client library (axios, ky)
- ❌ No Markdown library — ours is small and bespoke
- ❌ No icon library — we have ~3 icons total, inline SVG or emoji
- ❌ No web components / shadow DOM
- ❌ No `innerHTML` with un-escaped model output (XSS) — use `textContent` for raw model text, and only insert HTML through the controlled Markdown renderer
- ❌ No global mutable state outside the explicit state machine
