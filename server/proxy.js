const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all origins (localhost dev)
app.use(cors());

// Cache for Yahoo Finance crumb and cookies
let authCache = {
  crumb: null,
  cookies: null,
  expires: 0
};

/**
 * Get Yahoo Finance authentication (crumb + cookies)
 */
async function getYahooAuth() {
  // Return cached auth if still valid (cache for 1 hour)
  if (authCache.crumb && Date.now() < authCache.expires) {
    return authCache;
  }

  try {
    // First, get cookies from Yahoo Finance
    const initResponse = await fetch('https://fc.yahoo.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const cookies = initResponse.headers.get('set-cookie') || '';

    // Then get the crumb
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
        expires: Date.now() + 3600000 // 1 hour
      };
      console.log('Yahoo auth refreshed:', crumb.substring(0, 10) + '...');
      return authCache;
    }
  } catch (error) {
    console.error('Failed to get Yahoo auth:', error.message);
  }

  return { crumb: null, cookies: null };
}

/**
 * Proxy endpoint for Yahoo Finance API
 * Usage: GET /api/yahoo?url=<encoded-yahoo-url>
 */
app.get('/api/yahoo', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    // Get authentication
    const auth = await getYahooAuth();

    // Add crumb to URL if it's a quoteSummary request
    let finalUrl = url;
    if (url.includes('quoteSummary') && auth.crumb) {
      finalUrl = url + (url.includes('?') ? '&' : '?') + 'crumb=' + encodeURIComponent(auth.crumb);
    }

    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Cookie': auth.cookies || ''
      }
    });

    if (!response.ok) {
      // If 401, clear cache and retry once
      if (response.status === 401 && auth.crumb) {
        console.log('Auth expired, refreshing...');
        authCache.expires = 0;
        const newAuth = await getYahooAuth();

        if (newAuth.crumb) {
          let retryUrl = url;
          if (url.includes('quoteSummary')) {
            retryUrl = url + (url.includes('?') ? '&' : '?') + 'crumb=' + encodeURIComponent(newAuth.crumb);
          }

          const retryResponse = await fetch(retryUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json',
              'Cookie': newAuth.cookies || ''
            }
          });

          if (retryResponse.ok) {
            const data = await retryResponse.json();
            return res.json(data);
          }
        }
      }

      return res.status(response.status).json({ error: `Yahoo API returned ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch from Yahoo Finance' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', authCached: !!authCache.crumb });
});

app.listen(PORT, () => {
  console.log(`Yahoo Finance Proxy running on http://localhost:${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/yahoo?url=https://query1.finance.yahoo.com/v8/finance/chart/AAPL`);

  // Pre-fetch auth on startup
  getYahooAuth().then(() => console.log('Initial auth fetched'));
});
