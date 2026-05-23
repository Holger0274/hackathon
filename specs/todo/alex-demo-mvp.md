# PeopleOS — Alex Demo MVP

> **Status:** ready to build
> **Owner:** Holger Peschke (AImation)
> **Event:** Hackathon Berlin 2026
> **Demo mode:** Live pitch on stage. Reliability > feature depth.

---

## 1. Problem Statement

The hackathon stage demo must land in 90 seconds:

1. The pitcher types **one line** into an input field (the "hiring brief").
2. **Alex Chen** (AI agent, Talent Acquisition Manager) delivers in <10 seconds:
   - LinkedIn Job Advert (hero output)
   - Full Job Specification (internal document)
   - Interview Scorecard (5 competencies × 2 questions × rating 1–5)
3. Pitcher clicks **"Post to LinkedIn"** → LinkedIn share dialog opens with pre-filled text.
4. Audience sees: one-liner → complete hiring package → live post.

**Constraints**
- **No build step, no framework** — Plain HTML/CSS/JS.
- **No LinkedIn API key** — share via `linkedin.com/feed/?shareActive=true&text=...`.
- **Claude API** for Alex outputs (streaming preferred so the audience sees text appearing live).
- **API key must not live in the client** → minimal proxy required (Vercel Function).
- **Brand exactly** per PeopleOS Brand Guidelines v2 (dark, gold/blue, Syne/DM Sans/DM Mono).

**Definition of Done**
- Demo runs 3× reproducibly with different briefs (Backend Engineer, VP Marketing, Junior Recruiter).
- Output arrives in <10 s with visible streaming.
- LinkedIn share dialog opens with correct text.
- Deployed on Vercel, any URL (vercel.app is fine), HTTPS.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Plain HTML/CSS/JS)                                │
│  ──────────────────────────────────────────────             │
│  index.html      → Pitch UI (input + output sections)       │
│  styles.css      → PeopleOS Brand v2 (CSS custom props)     │
│  app.js          → fetch('/api/alex'), stream parsing,      │
│                    section rendering, LinkedIn share        │
└────────────────────────┬────────────────────────────────────┘
                         │ POST /api/alex { brief }
                         │ (Server-Sent Events / chunks)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Vercel Function (Node.js, default runtime)                 │
│  ──────────────────────────────────────────────             │
│  api/alex.js                                                │
│  - reads ANTHROPIC_API_KEY from process.env                 │
│  - calls Claude API (claude-sonnet-4-6) with Alex prompt    │
│  - streams response back as text/event-stream               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
                  api.anthropic.com
```

**Architecture decisions**

| Question | Decision | Reason |
|---|---|---|
| Framework? | None (Plain HTML/CSS/JS) | CLAUDE.md mandates it. No build = no risk on stage. |
| Routing? | Single page (index.html) | One demo, one page. |
| API proxy? | Vercel Function (Node) | Key protection, easy streaming. |
| Streaming? | Server-Sent Events (text/event-stream) | Audience sees text appear — "AI thinking" drama. |
| Model? | `claude-sonnet-4-6` | Speed + quality balance. Opus 4.7 if quality insufficient. |
| Errors? | Inline error box + Retry button + local mock fallback | Stage demo must never hang. |
| Mock mode? | `?mock=1` URL param shows pre-generated output | Backup if API/internet fails. |
| Persistence? | None (CLAUDE.md: stateless) | — |

---

## 3. Target File Tree

```
/
├── index.html
├── styles.css
├── app.js
├── api/
│   └── alex.js               # Vercel Function (Node)
├── public/
│   └── favicon.svg
├── mocks/
│   └── alex-backend-engineer.txt   # fallback output
├── package.json              # only for @anthropic-ai/sdk
├── .env.example
├── .gitignore
├── vercel.json               # functions config (optional)
├── README.md                 # already exists
└── CLAUDE.md                 # already exists
```

---

## 4. Implementation Phases

### Phase 1 — Static UI Shell (brand-compliant, no API)

**Goal:** Page opens, looks like PeopleOS, has input + three empty output sections, "Post to LinkedIn" button (disabled).

**Tasks**
1. `index.html` with semantic HTML:
   - `<header>` with "PeopleOS" wordmark (Syne, gold) + tagline.
   - `<main>` with `<form>` (textarea + "Ask Alex" button).
   - 3 `<section>` for the three outputs: `#linkedin-advert`, `#job-spec`, `#scorecard`. Initially empty with skeleton hint text.
   - `<button id="post-linkedin">` (initially `disabled`).
2. Google Fonts via `<link>`: DM Sans, Syne, DM Mono.
3. `styles.css`:
   - CSS custom properties exactly from CLAUDE.md (`--black`, `--card`, `--gold`, etc.).
   - H2 section labels with `::after` trailing line (see Brand Guidelines).
   - Spec block component: header strip (gold, DM Mono UPPERCASE) + body (`#1a1a1a`).
   - Buttons: 2px border-radius, gold = primary CTA, blue = secondary.
   - Avatar circle 60×60 (`#0d1a2e` bg, blue text, "AC" for Alex Chen).
4. Visual check: dark, no box-shadow, gold = headings/CTA only.

**Acceptance**
- Open `index.html` locally (or via `python3 -m http.server`), page looks like PeopleOS Brand v2.
- Lighthouse Accessibility ≥ 90.

---

### Phase 2 — Alex API Proxy (Vercel Function)

**Goal:** `POST /api/alex { brief }` streams Claude response back to the client.

**Tasks**
1. `package.json` with `"@anthropic-ai/sdk": "^0.40.0"` (or latest). `"type": "module"`.
2. `.env.example`: `ANTHROPIC_API_KEY=sk-ant-...`
3. `api/alex.js`:
   - Import `Anthropic` from `@anthropic-ai/sdk`.
   - Read `req.body.brief` (JSON, with body parsing).
   - System prompt as per CLAUDE.md (Alex Chen, three sections, UK English, £).
   - **Prompt caching** on the system prompt (`cache_control: { type: 'ephemeral' }`) — saves tokens on repeated calls.
   - `messages.stream()` with `model: 'claude-sonnet-4-6'`, `max_tokens: 2000`.
   - Forward each `text_delta` event as SSE chunk: `data: ${JSON.stringify({ delta })}\n\n`.
   - On completion: `data: [DONE]\n\n`.
   - On error: `data: ${JSON.stringify({ error: msg })}\n\n` + 200 status (so client catches it in stream).
4. `vercel.json` (if needed):
   ```json
   {
     "functions": {
       "api/alex.js": { "maxDuration": 30 }
     }
   }
   ```

**System prompt skeleton** (`api/alex.js`):

```js
const SYSTEM = `You are Alex Chen, Talent Acquisition Manager at PeopleOS.
Given a one-line hiring brief, produce three sections in this EXACT order and format. Use UK English and £ for salary.

## LINKEDIN JOB ADVERT
A scroll-stopping LinkedIn post (max 1300 chars). Hook in line 1. Use line breaks and 2-3 relevant emojis. End with a clear CTA.

## JOB SPECIFICATION
Markdown with: Role, Reporting Line, Location, Salary Band (£), Responsibilities (5-7 bullets), Must-Haves (5), Nice-to-Haves (3), Compensation & Benefits.

## INTERVIEW SCORECARD
Five competencies. For each: name, 2 interview questions, rating scale 1-5 with anchors at 1, 3, 5.
Format each competency as:
### {Competency Name}
Q1: ...
Q2: ...
Rating: 1 = {anchor}, 3 = {anchor}, 5 = {anchor}

Never break the section headers. Never add a preamble.`;
```

**Acceptance**
- `curl -N -X POST http://localhost:3000/api/alex -d '{"brief":"Senior Backend Engineer, Berlin, £85-110k"}' -H 'content-type: application/json'` streams text.
- Response contains all three `## …` headers.

---

### Phase 3 — Client Wiring (Streaming, Section Parsing, LinkedIn Share)

**Goal:** Browser renders the three sections live as the stream arrives; button posts to LinkedIn.

**Tasks**
1. `app.js`:
   - Form submit handler: `fetch('/api/alex', { method:'POST', body: JSON.stringify({brief}) })`.
   - Read stream via `response.body.getReader()` + `TextDecoder`.
   - **Section router**: parse incoming text. On `## LINKEDIN JOB ADVERT` → write to `#linkedin-advert`. On `## JOB SPECIFICATION` → switch. On `## INTERVIEW SCORECARD` → switch.
   - Per section: Markdown → HTML (minimal: `marked` via CDN, or own mini-parser for `**bold**`, `###`, lists).
   - While stream runs: "Ask Alex" button disabled + spinner. "Post to LinkedIn" disabled.
   - Stream done: "Post to LinkedIn" button enabled.
2. **LinkedIn share handler**:
   ```js
   document.getElementById('post-linkedin').addEventListener('click', () => {
     const advert = document.getElementById('linkedin-advert').innerText.trim();
     const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(advert)}`;
     window.open(url, '_blank', 'noopener');
   });
   ```
3. **Mock fallback** (`?mock=1` query param):
   - Instead of fetch → read `mocks/alex-backend-engineer.txt`, simulate streaming via `setInterval` (5 chars every 20ms).
4. **Error UI**: Red banner (`--red`) "Alex couldn't reach the server. Retry?" with retry button.

**Acceptance**
- Enter a brief → 3 sections fill progressively.
- "Post to LinkedIn" opens LinkedIn tab with advert text pre-filled.
- `?mock=1` works offline without API.

---

### Phase 4 — Deploy + Stage Hardening

**Tasks**
1. **Vercel deploy:**
   - `vercel link` (choose team, project name `peopleos-alex`).
   - `vercel env add ANTHROPIC_API_KEY production preview development` (value never logged).
   - `vercel deploy --prod`.
2. **Smoke test against prod URL:**
   - Run 3 briefs, verify stream + LinkedIn share.
3. **Stage hardening:**
   - QR code to demo URL for slide deck.
   - Document mock mode for pitcher (knows `?mock=1`).
   - Offline backup: static HTML with pre-generated outputs as `.zip` on USB stick.
4. **Performance:**
   - Lighthouse Performance ≥ 90.
   - Preload Google Fonts.
   - `<link rel="preconnect" href="https://api.anthropic.com">`.

**Acceptance**
- Production URL live.
- README contains pitcher instructions (3 example briefs, mock mode, backup path).

---

## 5. Edge Cases & Risks

| Risk | Mitigation |
|---|---|
| API latency > 15 s | Streaming = immediate feedback. Mock mode as backup. |
| Anthropic rate limit on stage | Run 5 test calls beforehand, check quota and credits. |
| LinkedIn share URL changes | Test 24h before demo. Fallback: copy-to-clipboard + paste manually. |
| Output breaks section format | System prompt explicitly says "Never break the section headers". On parse failure: render full response as plain text in all three sections. |
| WiFi/internet unstable on stage | `?mock=1` URL as backup, offline version on laptop. |
| Cache issues on stage | Vercel deploys are immutable. Practice hard-refresh before pitch. |
| Brief too vague ("Marketer") | System prompt handles it: makes reasonable assumptions visible in Job Spec ("Assumed: Mid-level, London, £55-70k"). |

---

## 6. Testing Strategy

**Manual smoke tests** (no Jest, no Vitest — hackathon speed):

1. **Brief matrix** (local + prod):
   - "Senior Backend Engineer, Berlin, Rust, £90-120k"
   - "VP of Marketing, remote UK, B2B SaaS"
   - "Junior Recruiter, London, £30k, no experience needed"
2. **Visual brand checks**: compare against Brand Guidelines v2 (CSS custom props, section label trailing line, gold usage).
3. **Streaming check**: output trickles in progressively, not in one block.
4. **LinkedIn share check**: tab opens, text is in composer.
5. **Mock mode**: `?mock=1` runs fully offline.
6. **Error path**: wrong API key → error banner appears, retry works after fix.

---

## 7. Success Criteria

- ✅ Live demo runs 3× in a row with different briefs without manual intervention.
- ✅ Time-to-first-token < 2 s, full response < 12 s.
- ✅ LinkedIn post goes live on stage (or mock shows it).
- ✅ Visually 100% PeopleOS Brand v2.
- ✅ Mock fallback works without internet.
- ✅ Production URL deployed, README updated.

---

## 8. Out of Scope (for MVP)

- The other 7 AI agents (ship after successful Alex demo).
- User auth, persistence, history.
- Multi-tenancy / workspaces.
- Real LinkedIn API integration (OAuth, draft API).
- A/B testing of generated outputs.
- Multi-language (UK English only).

---

## 9. Next Steps After MVP

1. Polish Alex demo with real example briefs from AImation client context.
2. Ship second agent ("Sam — People Analytics"?) as proof of PeopleOS scalability.
3. Extract brand components as a mini design system (reusable for further agents).
