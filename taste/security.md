# Security taste — PeopleOS

Read when touching anything that handles the API key, user input, or LinkedIn URLs.

## API key

- **Lives in Vercel env vars only.** `OPENROUTER_API_KEY` set in Vercel dashboard for Production + Preview + Development environments.
- **Never** in `.env` committed to git. The `.env.example` lists the variable name with no value.
- **Never** in client-side code. Browser bundle must not contain the string `sk-or-` (OpenRouter key prefix) or any reference to the key.
- **Pre-commit safety**: `.gitleaks.toml` config catches common key patterns. Run `gitleaks detect` before any push if uncertain.

## Input validation

- **Client side**: textarea max-length 2000, disabled until min-length 20. Strip leading/trailing whitespace before submit.
- **Server side (`api/alex.js`)**: re-validate `brief` is string, 20-2000 chars. Client validation is UX, server validation is security.
- **No HTML in input.** The brief is plain text. If it contains `<script>` — fine, that's not executed anywhere; it goes straight to the model as text. We never `innerHTML`-render the brief.

## Output handling

- **Model output is untrusted.** Render Markdown via the bespoke renderer (`taste/frontend.md`) which uses `textContent` for raw model text and only generates HTML for known patterns (headings, lists, tables, `<strong>`). No `innerHTML` shortcut on raw output.
- **LinkedIn ad section**: render in `<pre style="white-space: pre-wrap">` with `textContent` set. Emojis are fine; `<script>` tags would not execute because `<pre>` doesn't evaluate child tags.
- **The LinkedIn share URL**: always wrap the text in `encodeURIComponent()`. Never string-concatenate raw text into a URL.

## LinkedIn share safety

- `window.open(url, '_blank', 'noopener,noreferrer')` — mandatory. Prevents `window.opener` access from the LinkedIn tab.
- Truncate to 1,950 chars + "…" if the ad section exceeds 2,000 chars. LinkedIn URL limit is real; we keep a buffer.
- Do not include any user-identifying data in the share URL. Just the ad text.

## Logging

- **Never log**: request body (`brief`), model output, API key.
- **OK to log**: HTTP status codes, timing, error type strings, response sizes.
- Vercel function logs are visible to the team — assume any log line could leak. Treat like a public bulletin board.

## Rate limiting

- **None in Phase 1.** Demo scope; no public traffic.
- If we hit OpenRouter rate limits during rehearsals: add a simple in-memory `lastCallTime` throttle in `api/alex.js` (reject if < 2s since last call). Stateless across function instances but good enough.

## CORS

- **Same-origin**: browser and function are both on the Vercel deploy URL. No CORS config needed.
- If we ever serve `/api/alex` from a different domain than the frontend: set `Access-Control-Allow-Origin` to the exact frontend URL, not `*`.

## Secrets in error messages

- Server: error responses say `{ error: 'upstream model error' }` or `{ error: 'OPENROUTER_API_KEY not configured' }`. The latter exposes a config detail — that's intentional for debugging, but only the developer sees it (Vercel logs + during local dev).
- Client: user only sees the generic warm error panel. Never propagate raw server `error` strings to the UI.

## Pre-demo security checklist

Before the demo:
- [ ] `OPENROUTER_API_KEY` is set in Vercel Production env.
- [ ] `.env` and `.env.local` are gitignored (already in `.gitignore`).
- [ ] No keys in git history: `git log -p --all -S 'sk-or'` returns nothing.
- [ ] Repo is private (key would be exposed via Vercel preview URL if PRs are public).
- [ ] OpenRouter dashboard: rate limits + budget cap configured (avoid runaway costs from a bug).

## Anti-pattern checklist

- ❌ Key in source code (even temporarily)
- ❌ Key in `.env` checked into git
- ❌ `dangerouslySetInnerHTML` or `innerHTML = modelOutput`
- ❌ String concatenation into URLs without `encodeURIComponent`
- ❌ `window.open(url)` without `'noopener,noreferrer'`
- ❌ Logging request body or model output
- ❌ Exposing internal error strings in the UI
- ❌ `Access-Control-Allow-Origin: *` for an endpoint that holds an API key
