# Phase 5 — Streaming

> Branch: `riff/phase-5-fallback-rendering-and-streaming`
> Goal: Stream the OpenRouter response token-by-token via SSE. First visible characters appear <1s after Submit. The LinkedIn ad card builds up live; Job Spec and Scorecard render after stream ends.

## Existing state (don't rebuild)

- `api/alex.js` — currently awaits full JSON response, returns `{ output: string }` via POST.
- `alex.js` frontend — `fetchOutput()` does `fetch('/api/alex', { method: 'POST', body: ... })` then `await res.json()` then `renderOutput(data.output)`.
- Fallback-rendering (raw card on missing sections) already at lines 309-321 of `alex.js`.
- Loading panel with rotating copy already implemented.

## Architecture decision

**Approach: SSE endpoint alongside existing POST**

- New endpoint: `api/alex-stream.js` — responds `Content-Type: text/event-stream`, proxies OpenRouter's stream, sends `data: <chunk>\n\n` events, ends with `data: [DONE]\n\n`.
- Existing `api/alex.js` stays untouched — if streaming fails/errors, frontend falls back to the existing POST path.
- Frontend: new `fetchOutputStreaming()` function using `EventSource`-style `fetch` + `ReadableStream`. If `EventSource` or `ReadableStream` not available, falls back to `fetchOutput()`.

**Why a new endpoint (not modify existing):**
SSE and JSON are fundamentally different response types. Keeping them separate keeps the error paths clean and preserves the non-streaming fallback for free.

**What streams live vs what renders after:**
- **LinkedIn ad** (`## LINKEDIN JOB ADVERT` section): streams character-by-character into the hero card's `<pre>`. This is the visual wow moment.
- **Job Spec + Scorecard**: rendered after stream ends (full sections available). Appended to output region without clearing the hero card.

## Tasks

### Task 5.1 — `api/alex-stream.js` — SSE endpoint

New Vercel serverless function. Accepts same POST body as `api/alex.js` (`{ brief: string }`). Same input validation. Same error responses for bad input or missing API key.

Key difference: calls OpenRouter with `"stream": true`, pipes chunks back as SSE:

```js
// api/alex-stream.js
import { ALEX_SYSTEM_PROMPT } from './_prompt.js';

export const config = { runtime: 'nodejs20.x' }; // explicit for Vercel streaming

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }

  const { brief } = req.body ?? {};
  if (typeof brief !== 'string' || brief.length < 20 || brief.length > 2000) {
    res.status(400).json({ error: 'brief must be between 20 and 2000 chars' });
    return;
  }

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) { res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' }); return; }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',  // disable nginx buffering on Vercel
    'Connection': 'keep-alive',
  });

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': `https://${req.headers.host}`,
        'X-Title': 'PeopleOS · Alex',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4.6',
        messages: [
          { role: 'system', content: ALEX_SYSTEM_PROMPT },
          { role: 'user', content: brief },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      }),
    });

    if (!upstream.ok) {
      res.write('event: error\ndata: upstream error\n\n');
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      // OpenRouter sends lines: "data: {...}\n\n" or "data: [DONE]\n\n"
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
      for (const line of lines) {
        const raw = line.slice(6); // strip "data: "
        if (raw === '[DONE]') {
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }
        try {
          const parsed = JSON.parse(raw);
          const token = parsed?.choices?.[0]?.delta?.content ?? '';
          if (token) res.write(`data: ${JSON.stringify(token)}\n\n`);
        } catch { /* skip malformed chunk */ }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    res.write('event: error\ndata: fetch failed\n\n');
    res.end();
  }
}
```

### Task 5.2 — Frontend streaming in `alex.js`

Two changes in `alex.js`:

**A) New `fetchOutputStreaming()` function** — sits alongside the existing `fetchOutput()`:

```js
function fetchOutputStreaming(brief) {
  // Accumulates full text; renders hero card live, rest after [DONE]
  var outputRgn = document.getElementById('output-region');
  var accumulated = '';

  // Show hero card immediately (empty, will fill in)
  var heroCard = buildCard(true);
  var heroTag = document.createElement('div');
  heroTag.className = 'output-tag output-tag--gold';
  heroTag.textContent = 'OUTPUT 01 — LINKEDIN JOB ADVERT';
  heroCard.appendChild(heroTag);
  var heroPre = document.createElement('pre');
  heroPre.textContent = '';
  heroCard.appendChild(heroPre);
  outputRgn.innerHTML = '';
  outputRgn.appendChild(heroCard);
  hidePanels();  // hide loading panel

  return fetch('/api/alex-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brief }),
  }).then(function (res) {
    if (!res.ok || !res.body) throw new Error('stream unavailable');

    var reader = res.body.getReader();
    var decoder = new TextDecoder();
    var buffer = '';

    function pump() {
      return reader.read().then(function ({ done, value }) {
        if (done) {
          // Render full output (Job Spec + Scorecard) from accumulated text
          renderOutput(accumulated);
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        var lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete last line

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          if (!line.startsWith('data: ')) continue;
          var raw = line.slice(6);
          if (raw === '[DONE]') { renderOutput(accumulated); return; }
          try {
            var token = JSON.parse(raw);
            accumulated += token;
            // Live-update the hero <pre> with the ad section so far
            var adMatch = accumulated.match(/## LINKEDIN JOB ADVERT\s*([\s\S]*?)(?=## [A-Z]|$)/);
            if (adMatch) heroPre.textContent = adMatch[1].trim();
          } catch { /* skip */ }
        }

        return pump();
      });
    }

    return pump();
  });
}
```

**B) Wire streaming into the submit flow** — in `fetchOutput()` call site (around line 115-135), wrap with a streaming-first attempt:

```js
// Replace: renderOutput(data.output) call chain
// With: try streaming, fall back to existing fetchOutput on error
function startFetch(brief) {
  showLoadingPanel();
  fetchOutputStreaming(brief).catch(function () {
    // streaming failed — fall back silently to full-response POST
    return fetchOutput(brief);
  });
}
```

Update the submit button click handler and retry button to call `startFetch(brief)` instead of the inline fetch chain.

**C) `hidePanels()` helper** — small utility to hide both loading-panel and warning-panel (DRY for the streaming path):

```js
function hidePanels() {
  document.getElementById('loading-panel').hidden = true;
  document.getElementById('warning-panel').hidden = true;
}
```

### Smoke

- Manual: run `vercel dev`, paste a brief, Submit → hero card appears within ~1s showing partial LinkedIn ad text building up live.
- Verify fallback: temporarily set an invalid URL in `fetchOutputStreaming` → should fall through to the existing 4-7s loading + full render.
- `grep -c 'alex-stream' api/alex-stream.js vercel.json` — verify new endpoint exists and is referenced.

## Out of scope

- No change to the system prompt.
- No change to `api/alex.js` (non-streaming endpoint stays).
- No UI changes beyond the streaming hero card update.
- No section-level streaming for Job Spec / Scorecard (too complex for incremental value).

## Risk / fallback

If streaming is flaky on Vercel's infrastructure (buffering, timeout), the `catch` on `fetchOutputStreaming` silently falls back to the existing POST path. The demo still works, just without the streaming effect.

## Model Recommendation

- `executor_model: sonnet` — the streaming pattern is well-understood even in vanilla JS. No novel architecture needed.
