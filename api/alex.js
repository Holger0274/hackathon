// api/alex.js — Node 20 Vercel serverless function
// POST /api/alex  { brief: string }  →  { output: string }
// Validates input, reads OPENROUTER_API_KEY from env, calls OpenRouter, returns output.
// NEVER logs request body or model output — Vercel logs are not private.

import { ALEX_SYSTEM_PROMPT } from './_prompt.js';

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

  const start = Date.now();

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
        model: 'anthropic/claude-sonnet-4-6',
        messages: [
          { role: 'system', content: ALEX_SYSTEM_PROMPT },
          { role: 'user', content: brief },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const elapsed = Date.now() - start;

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('openrouter non-ok:', r.status, elapsed + 'ms', detail.slice(0, 200));
      res.status(502).json({ error: 'upstream model error' });
      return;
    }

    const data = await r.json();
    const output = data?.choices?.[0]?.message?.content;

    if (!output) {
      console.error('openrouter empty output:', elapsed + 'ms', JSON.stringify(data).slice(0, 300));
      res.status(502).json({ error: 'empty model output' });
      return;
    }

    console.error('openrouter ok:', r.status, elapsed + 'ms');
    res.status(200).json({ output });
  } catch (err) {
    const elapsed = Date.now() - start;
    console.error('openrouter fetch failed:', elapsed + 'ms', err.message);
    res.status(502).json({ error: 'upstream fetch failed' });
  }
}
