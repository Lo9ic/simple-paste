// Serverless function to store and fetch a single shared paste.
// Uses Upstash REST API (compatible with Vercel KV) via environment variables.
// Set either KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV)
// or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.

const KEY = 'paste';

function getKvEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return { url, token };
}

async function kvGet(key) {
  const { url, token } = getKvEnv();
  if (!url || !token) {
    // No persistent storage configured
    return null;
  }
  const res = await fetch(url.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([["GET", key]])
  });
  if (!res.ok) throw new Error('kv get failed');
  const data = await res.json();
  // Upstash returns { result: [value] }
  const resultArray = data?.result || data;
  return Array.isArray(resultArray) ? resultArray[0] : null;
}

async function kvSet(key, value) {
  const { url, token } = getKvEnv();
  if (!url || !token) {
    throw new Error('KV not configured');
  }
  const res = await fetch(url.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([["SET", key, value]])
  });
  if (!res.ok) throw new Error('kv set failed');
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    try {
      const text = await kvGet(KEY);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ text: text ?? '' }));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to fetch text' }));
    }
    return;
  }
  if (req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const text = typeof body.text === 'string' ? body.text : '';
      await kvSet(KEY, text);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      const notConfigured = /KV not configured/i.test(String(e.message || ''));
      res.statusCode = notConfigured ? 501 : 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: notConfigured ? 'KV not configured' : 'Failed to save text' }));
    }
    return;
  }
  res.statusCode = 405;
  res.setHeader('Allow', 'GET, POST');
  res.end('Method Not Allowed');
};
