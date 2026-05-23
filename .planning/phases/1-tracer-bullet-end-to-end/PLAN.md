# Phase 1 — Plan: Tracer bullet, full end-to-end Alex demo

> Goal: ship a vertical slice that takes a one-paragraph hiring brief and produces three rendered output cards plus a working LinkedIn share button. Production deploy on Vercel. Demo target: today / tomorrow.

## Goal (one sentence)

Pitcher loads the deployed Vercel URL → opens Alex's page → pastes a brief → hits submit → sees three brand-styled output cards within ≤8s → clicks "Post to LinkedIn" → LinkedIn share dialog opens with the ad pre-populated.

## Acceptance criteria

- [ ] `vercel dev` runs locally without errors when `OPENROUTER_API_KEY` is set in `.env.local`.
- [ ] Production deploy on Vercel; `OPENROUTER_API_KEY` set in Vercel env vars (Production).
- [ ] `/alex` renders the agent header, textarea, "Get to work, Alex" CTA, and is keyboard-focused on load.
- [ ] Submitting a valid brief (20–2000 chars) shows the "Alex is on it…" panel within 200ms.
- [ ] The `/api/alex` function returns `{ output }` with the three-section Markdown from `anthropic/claude-sonnet-4.6` via OpenRouter.
- [ ] Output is parsed into three sections (LinkedIn ad / Job Spec / Scorecard) and rendered as three cards. The LinkedIn ad card uses the gold-dim border (hero treatment).
- [ ] Clicking "Post to LinkedIn" opens `https://www.linkedin.com/feed/?shareActive=true&text=<encoded>` in a new tab, with `noopener,noreferrer`.
- [ ] Ad-section length > 2000 chars is truncated to 1950 + "…" before building the URL.
- [ ] Network/server errors render the warm "Alex is having a moment" panel with a "Try again" button.
- [ ] Malformed model output (missing section headers) renders a fallback card with the raw output + disclosure.
- [ ] Brand fidelity: dark theme, gold/blue accents, DM Sans + Syne + DM Mono. CSS variables from `Docs/brand-guidelines.md`.
- [ ] No `OPENROUTER_API_KEY` reference in client-side code. `git grep -E 'OPENROUTER|sk-or-' index.html alex.html *.js styles.css` returns nothing.
- [ ] `index.html` exists with the Team Showcase shell (real cards land in Phase 3; for Phase 1 this can be a stub that links to `/alex`).

## Out of scope (this phase)

- Cmd+Shift+P pre-fill shortcut → Phase 2.
- Copy buttons on output cards → Phase 2.
- Loading state with rotating copy → Phase 2 (Phase 1 uses a single static "Alex is on it…" line).
- Streaming token-by-token → Phase 5.
- Full Team Showcase with 8 agent cards → Phase 3 (Phase 1 ships a minimal landing stub).
- `Cmd/Ctrl+Enter` shortcut to submit → Phase 2 polish.

## Files to create

| Path | Purpose |
| --- | --- |
| `index.html` | Minimal landing stub. Single hero "PeopleOS — Meet Alex" + CTA button → `/alex`. Full Team Showcase comes in Phase 3. |
| `alex.html` | Alex's interface. Agent header + textarea + submit button + output region. |
| `styles.css` | Shared stylesheet. `:root` variables, layout, components (agent-card, spec, output cards, warning, button). Single file for both pages. |
| `alex.js` | Alex page client logic: state machine (idle → submitting → result / error), fetch to `/api/alex`, section parser, Markdown renderer, LinkedIn URL builder. |
| `api/alex.js` | Vercel serverless function. Validates input (20–2000 chars), reads `OPENROUTER_API_KEY` from env, calls OpenRouter, returns `{ output }`. |
| `api/_prompt.js` | The Alex system prompt as an exported const. Kept separate so Phase 2+ can edit it without touching the function logic. |
| `vercel.json` | Rewrite `/alex` → `/alex.html` (if Vercel doesn't auto-resolve). Function runtime config if needed. |

No `package.json`. The function uses Node 20's built-in `fetch`. No npm dependencies.

## Waves

### Wave 1 — Backend foundation (parallel-safe)

- **Task 1.1**: Create `api/_prompt.js` exporting `ALEX_SYSTEM_PROMPT` (verbatim from `Docs/peopleos-alex-demo.html` § "The System Prompt").
- **Task 1.2**: Create `api/alex.js` per `taste/backend.md` shape. Validate body, read env var, call OpenRouter with model `anthropic/claude-sonnet-4.6`, return `{ output }`. Log status + timing only, never request body or model output.
- **Task 1.3**: Create `vercel.json` with `/alex` rewrite + Node 20 runtime declaration for the function.

These three files have zero shared logic → `parallel: [1.1, 1.2, 1.3]`.

### Wave 2 — Frontend skeleton

- **Task 2.1**: Create `styles.css` with `:root` CSS variables (verbatim from `Docs/brand-guidelines.md`), base body styles (DM Sans, dark bg), and layout primitives (`.page` 900px max-width). Include component classes: `.agent-card`, `.avatar`, `.spec`, `.spec-header`, `.spec-body`, `.cta-button`, `.cta-button--gold`, `.warning`, `.output-card`, `.output-card--hero`, `.output-tag`. Load Google Fonts via `<link>` in HTML (no @import).
- **Task 2.2**: Create `index.html` minimal landing stub. Loads `styles.css`. Single section: "PeopleOS · Your AI HR Team", subtitle "Eight AI HR managers. One platform. Meet Alex.", CTA button "Meet Alex →" linking to `/alex`. Footer.
- **Task 2.3**: Create `alex.html`. Loads `styles.css` and `alex.js` (as `<script type="module">` if needed, otherwise plain). Structure: `<a href="/">← Back</a>`, agent header card (AX avatar, "Alex Chen", "Talent Acquisition Manager", agent tag "Hiring & Recruitment · Agent 1 of 8"), input section with textarea + CTA, output region (initially empty / hidden), warning region (initially hidden).

### Wave 3 — Frontend logic

- **Task 3.1**: Create `alex.js`. Implement the state machine:
  - `state = 'idle' | 'submitting' | 'result' | 'error'`
  - `render(state)` toggles visibility of input/loading/output/warning regions.
  - On submit: `POST /api/alex` with `{ brief }`, 30s `AbortController` timeout.
  - On 200: parse sections via `split(/^## /m)`, render three cards via bespoke Markdown renderer.
  - On non-2xx / network / timeout / JSON-parse error: transition to `error`.
  - LinkedIn ad ≤2000 chars → use; >2000 → truncate to 1950 + "…", `console.warn`.
  - `window.open(linkedInUrl, '_blank', 'noopener,noreferrer')`.
  - Markdown renderer (~30 lines): `## h3`, `**bold**`, `- bullets`, `1. numbered`, `| tables |`, plain paragraphs. Render `<pre style="white-space: pre-wrap">` for the LinkedIn ad section to preserve emojis + line breaks; use `textContent` for raw model text.
  - If `LINKEDIN JOB ADVERT` section missing after parse → render fallback card with full raw output + a small "raw output (couldn't parse)" tag.

### Wave 4 — Local + deploy verification

- **Task 4.1** (manual / instructional): document the dev command in SUMMARY.md. `vercel dev` from project root, set `.env.local` with `OPENROUTER_API_KEY`, hit `http://localhost:3000/alex`. Three rehearsal briefs run end-to-end without error.
- **Task 4.2** (manual / instructional): `vercel --prod` deploy. `vercel env add OPENROUTER_API_KEY production`. Hit deploy URL, repeat the three rehearsal briefs.

Waves 4.1 and 4.2 are instructional because they require the user's OpenRouter key + Vercel account. The executor writes the commands into SUMMARY.md but does NOT execute them.

## Smoke

Hackathon scope, no automated test framework. Smoke is manual + a single curl check that the function exists.

- `curl -s http://localhost:3000/api/alex -X POST -H 'Content-Type: application/json' -d '{}'` → expect 400 with `{ error: "brief must be a string between 20 and 2000 chars" }`.
- `curl -s http://localhost:3000/api/alex -X POST -H 'Content-Type: application/json' -d '{"brief":"valid 20+ char string for sanity check"}'` → expect 200 with `{ output: "..." }` containing the strings `LINKEDIN JOB ADVERT`, `JOB SPECIFICATION`, `INTERVIEW SCORECARD`.
- Load `http://localhost:3000/`. Expect: title visible, "Meet Alex" CTA visible, link targets `/alex`.
- Load `http://localhost:3000/alex`. Expect: agent header, textarea focused, CTA visible.
- Paste a 200-char brief, submit. Expect: "Alex is on it…" within 200ms; three output cards within ≤8s.
- Click "Post to LinkedIn". Expect: new tab opens at `linkedin.com/feed/?shareActive=true&text=…`. Text param present (decoded length matches the ad section).

`planned_smokes:`
- `curl /api/alex POST empty body → 400`
- `curl /api/alex POST valid brief → 200 with 3 section headers`
- `/` loads, Meet Alex CTA visible
- `/alex` loads, textarea autofocused
- Submit happy path → 3 cards rendered ≤8s
- Post-to-LinkedIn click → new tab opens with `shareActive=true&text=…`

The executor records each smoke result (PASS / FAIL / SKIPPED with reason) in SUMMARY.md § Smoke results.

## Risk focus

- **OpenRouter call shape**: header `HTTP-Referer` is required by OpenRouter to identify the app; `X-Title` is optional but appreciated. Without `HTTP-Referer` the call may be rejected.
- **Three-section parsing edge cases**: the model occasionally prepends a preamble before the first `## LINKEDIN JOB ADVERT` header. Parser must skip preamble (anything before the first `## `).
- **LinkedIn URL encoding**: always `encodeURIComponent(adText)`. Never string-concatenate raw text into the URL.
- **API key leak**: search results post-build must show zero hits for `OPENROUTER_API_KEY` or `sk-or-` in any file shipped to the browser.
- **XSS via model output**: the bespoke Markdown renderer must NEVER use `innerHTML` on raw model substrings. All text goes through `textContent`; HTML is built via `document.createElement`.

## Anti-patterns to avoid (executor: do NOT)

- Add a build step. No webpack, no Vite production build. Plain HTML + plain JS modules.
- Pull in a Markdown library (marked, markdown-it). Hand-roll the ~30-line renderer.
- Add Express, Hono, Fastify, Zod, axios, or any other dependency to `api/alex.js`.
- Use `innerHTML = userOrModelText`.
- Build the LinkedIn URL with template string interpolation. Use `encodeURIComponent` + plain string concat.
- Log the brief or model output (Vercel logs are not private).
- Add a `package.json` "just in case" — only add if a dependency genuinely needs it (it doesn't, in Phase 1).
- Hardcode the OpenRouter API key anywhere. Read from `process.env.OPENROUTER_API_KEY` only inside the function.

## Model Recommendation

`executor_model: sonnet`

Justification: no novel architecture, modest file count (~7), well-known APIs (OpenRouter is OpenAI-compatible; Vercel Functions are documented; vanilla browser JS). Sonnet handles this comfortably; opus would be overkill and slower for the demo deadline.

`complex_execution: false` — no `think hard` keyword needed.
