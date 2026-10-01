// Vercel Function: same-origin proxy for Yahoo Finance (no CORS headers on purpose)
import { proxyYahoo } from '../server/yahooProxy.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawUrl = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;
  const { status, body, cacheControl } = await proxyYahoo(rawUrl);

  if (cacheControl) {
    res.setHeader('Cache-Control', cacheControl);
  }
  return res.status(status).json(body);
}
