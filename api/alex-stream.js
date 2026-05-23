// api/alex-stream.js — Node 20 Vercel serverless function
// POST /api/alex-stream  { brief: string }  →  text/event-stream
// Validates input, calls OpenRouter with stream:true, pipes SSE chunks to client.
// NEVER logs request body or model output — Vercel logs are not private.

import { ALEX_SYSTEM_PROMPT } from './_prompt.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { brief } = req.body ?? {};
  if (typeof brief !== 'string' || brief.length < 20 || brief.length > 2000) {
    res.status(400).json({ error: 'brief must be between 20 and 2000 chars' });
    return;
  }

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',
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
