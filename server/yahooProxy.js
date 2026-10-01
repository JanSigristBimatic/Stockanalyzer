// Yahoo Finance proxy shared by the Vercel function (api/yahoo.js) and the Vite dev server

const ALLOWED_HOSTS = new Set(['query1.finance.yahoo.com', 'query2.finance.yahoo.com']);
const ALLOWED_PATH_PREFIXES = ['/v8/finance/chart/', '/v10/finance/quoteSummary/', '/v1/finance/search'];
const QUOTE_SUMMARY_PATH = '/v10/finance/quoteSummary/';
const SEARCH_PATH = '/v1/finance/search';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const AUTH_TTL_MS = 60 * 60 * 1000;
const CACHE_CONTROL = {
  quotes: 'public, s-maxage=60, stale-while-revalidate=300',
  search: 'public, s-maxage=3600, stale-while-revalidate=86400'
};

let authCache = { crumb: null, cookie: null, expires: 0 };

/**
 * Validates the requested Yahoo URL against the allowed hosts and endpoints
 * @param {string} rawUrl - Absolute Yahoo Finance URL
 * @returns {{url: URL}|{error: string}}
 */
export function normalizeYahooUrl(rawUrl) {
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
  if (!ALLOWED_PATH_PREFIXES.some(prefix => parsedUrl.pathname.startsWith(prefix))) {
    return { error: 'Path not allowed' };
  }

  return { url: parsedUrl };
}

/**
 * Forwards a request to Yahoo Finance. Yahoo's status and JSON body are passed through,
 * so the client can tell an unknown symbol (404) from other failures.
 * @param {string} rawUrl - Absolute Yahoo Finance URL
 * @returns {Promise<{status: number, body: Object, cacheControl: string|null}>}
 */
export async function proxyYahoo(rawUrl) {
  const { url, error } = normalizeYahooUrl(rawUrl);
  if (error) {
    return { status: 400, body: { error }, cacheControl: null };
  }

  try {
    let auth = await getYahooAuth();
    let response = await requestYahoo(url, auth);

    if (response.status === 401 && auth.crumb) {
      auth = await getYahooAuth({ refresh: true });
      response = await requestYahoo(url, auth);
    }

    const body = parseJson(await response.text()) ?? { error: `Yahoo API returned ${response.status}` };
    return {
      status: response.status,
      body,
      cacheControl: response.ok ? getCacheControl(url) : null
    };
  } catch (err) {
    console.error('Proxy error:', err.message);
    return { status: 502, body: { error: 'Failed to fetch from Yahoo Finance' }, cacheControl: null };
  }
}

/**
 * Yahoo requires a crumb plus the matching cookie for quoteSummary requests
 */
async function getYahooAuth({ refresh = false } = {}) {
  if (!refresh && authCache.crumb && Date.now() < authCache.expires) {
    return authCache;
  }

  try {
    const initResponse = await fetch('https://fc.yahoo.com', { headers: { 'User-Agent': USER_AGENT } });
    // Only the name=value part of each Set-Cookie header belongs into a Cookie header
    const cookie = initResponse.headers.getSetCookie().map(entry => entry.split(';')[0]).join('; ');

    const crumbResponse = await fetch('https://query1.finance.yahoo.com/v1/test/getcrumb', {
      headers: { 'User-Agent': USER_AGENT, Cookie: cookie }
    });
    const crumb = await crumbResponse.text();

    if (crumbResponse.ok && crumb && !crumb.includes('<')) {
      authCache = { crumb, cookie, expires: Date.now() + AUTH_TTL_MS };
      return authCache;
    }
  } catch (err) {
    console.error('Failed to get Yahoo auth:', err.message);
  }

  return { crumb: null, cookie: null };
}

function requestYahoo(url, auth) {
  const target = new URL(url);
  if (target.pathname.startsWith(QUOTE_SUMMARY_PATH) && auth.crumb) {
    target.searchParams.set('crumb', auth.crumb);
  }

  return fetch(target, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
      Cookie: auth.cookie || ''
    }
  });
}

function getCacheControl(url) {
  return url.pathname.startsWith(SEARCH_PATH) ? CACHE_CONTROL.search : CACHE_CONTROL.quotes;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
