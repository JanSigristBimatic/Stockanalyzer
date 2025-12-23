// Vercel Serverless Function - Yahoo Finance Proxy

// Cache for Yahoo Finance crumb and cookies
let authCache = {
  crumb: null,
  cookies: null,
  expires: 0
};

const ALLOWED_HOSTS = new Set(['query1.finance.yahoo.com', 'query2.finance.yahoo.com']);

function normalizeYahooUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { error: 'Invalid url parameter' };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return { error: 'Invalid url parameter' };
  }

  if (parsedUrl.protocol !== 'https:') {
    return { error: 'Only https urls are allowed' };
  }
  if (!ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return { error: 'Host not allowed' };
  }
  if (parsedUrl.username || parsedUrl.password) {
    return { error: 'Credentials not allowed' };
  }
  if (parsedUrl.port && parsedUrl.port !== '443') {
    return { error: 'Port not allowed' };
  }

  return { url: parsedUrl };
}

function buildYahooUrl(rawUrl, crumb) {
  const url = new URL(rawUrl);
  if (url.pathname.includes('/v10/finance/quoteSummary/') && crumb) {
    url.searchParams.set('crumb', crumb);
  }
  return url.toString();
}

/**
 * Get Yahoo Finance authentication (crumb + cookies)
 */
async function getYahooAuth() {
  if (authCache.crumb && Date.now() < authCache.expires) {
    return authCache;
  }

  try {
    const initResponse = await fetch('https://fc.yahoo.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const cookies = initResponse.headers.get('set-cookie') || '';

    const crumbResponse = await fetch('https://query1.finance.yahoo.com/v1/test/getcrumb', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cookie': cookies
      }
    });

    const crumb = await crumbResponse.text();

    if (crumb && !crumb.includes('<!DOCTYPE')) {
      authCache = {
        crumb,
        cookies,
        expires: Date.now() + 3600000
      };
      return authCache;
    }
  } catch (error) {
    console.error('Failed to get Yahoo auth:', error.message);
  }

  return { crumb: null, cookies: null };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUrl = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;

  if (!rawUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const { url, error } = normalizeYahooUrl(rawUrl);
  if (error) {
    return res.status(400).json({ error });
  }

  const baseUrl = url.toString();

  try {
    const auth = await getYahooAuth();

    const finalUrl = buildYahooUrl(baseUrl, auth.crumb);

    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Cookie': auth.cookies || ''
      }
    });

    if (!response.ok) {
      if (response.status === 401 && auth.crumb) {
        authCache.expires = 0;
        const newAuth = await getYahooAuth();

        if (newAuth.crumb) {
          const retryUrl = buildYahooUrl(baseUrl, newAuth.crumb);

          const retryResponse = await fetch(retryUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json',
              'Cookie': newAuth.cookies || ''
            }
          });

          if (retryResponse.ok) {
            const data = await retryResponse.json();
            return res.status(200).json(data);
          }
        }
      }

      return res.status(response.status).json({ error: `Yahoo API returned ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch from Yahoo Finance' });
  }
}
