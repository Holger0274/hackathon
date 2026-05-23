# Backend taste — PeopleOS

Read when touching `api/alex.js` or anything server-side.

There is exactly ONE server function. Resist the urge to split it.

## File layout

```
/api/alex.js         — The only server endpoint. POST handler. ~50 lines max.
```

If `api/alex.js` exceeds ~80 lines, extract the system prompt to `api/_prompt.js`. Don't extract earlier.

## Vercel function shape

```js
// api/alex.js — Node 20 runtime
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const { brief } = req.body ?? {};
  if (typeof brief !== 'string' || brief.length < 20 || brief.length > 2000) {
    res.status(400).json({ error: 'brief must be a string between 20 and 2000 chars' });
    return;
  }

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });
    return;
  }

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('openrouter non-ok:', r.status, detail.slice(0, 200));
      res.status(502).json({ error: 'upstream model error' });
      return;
    }

    const data = await r.json();
    const output = data?.choices?.[0]?.message?.content;
    if (!output) {
      console.error('openrouter empty output:', JSON.stringify(data).slice(0, 300));
      res.status(502).json({ error: 'empty model output' });
      return;
    }

    res.status(200).json({ output });
  } catch (err) {
    console.error('openrouter fetch failed:', err);
    res.status(502).json({ error: 'upstream fetch failed' });
  }
}
```

## Rules

- **One file, one job.** Reject other methods, validate input, call OpenRouter, return output. Nothing else.
- **No middleware.** No Express, no Hono, no validation library. Native checks.
- **Validate at the boundary.** `typeof`, `length`, env-var existence. Done. Don't reach for Zod.
- **Don't log request bodies.** Briefs may contain sensitive HR info. Log status codes, error types, timing — never content.
- **Don't log model output.** Same reason.
- **Errors return `{ error: string }` with appropriate HTTP status.** Client just shows "Alex is having a moment" — exact error type doesn't need to be user-visible.
- **System prompt lives as a constant in this file** (or in `api/_prompt.js` if it grows). Verbatim from `Docs/peopleos-alex-demo.html` § "The System Prompt". UK English. £ for salary. Three sections.

## Timeout + retries

- **No client retries in the function.** If OpenRouter fails, fail fast and let the client retry. Avoids stacking timeouts.
- **No streaming in v1.** Plain JSON response.
- **30s default Vercel timeout is plenty** for Sonnet 4.6's typical 4-7s response.

## Anti-pattern checklist

- ❌ No Express / Fastify / Hono wrappers
- ❌ No Zod / Yup / Joi
- ❌ No DB client
- ❌ No JWT / auth lib
- ❌ No logging library (winston, pino) — `console.error` is fine for Vercel logs
- ❌ No middleware stack
- ❌ No request body in logs
- ❌ No model output in logs
- ❌ No client-side retries triggered from the server
- ❌ No "robust" abstractions for an API we'll call from exactly one place
