import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { normalizeYahooUrl, proxyYahoo } from './yahooProxy.js';

const CHART_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL?interval=1d&range=5d';
const SUMMARY_URL = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary/AAPL?modules=price';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status });

/**
 * Fake Yahoo: answers the auth endpoints and delegates data requests to `handleData`
 */
function stubYahoo(handleData) {
  const requests = [];
  vi.stubGlobal('fetch', vi.fn(async (input, init = {}) => {
    const url = new URL(input);
    requests.push({ url, headers: init.headers || {} });
    if (url.hostname === 'fc.yahoo.com') {
      return new Response('', { headers: { 'Set-Cookie': 'A3=session; Domain=.yahoo.com; Path=/; Secure' } });
    }
    if (url.pathname === '/v1/test/getcrumb') return new Response('crumb123');
    return handleData(url, requests);
  }));
  return requests;
}

describe('normalizeYahooUrl', () => {
  it.each([
    ['http://query1.finance.yahoo.com/v8/finance/chart/AAPL', 'Only https urls are allowed'],
    ['https://example.com/v8/finance/chart/AAPL', 'Host not allowed'],
    ['https://user:pw@query1.finance.yahoo.com/v8/finance/chart/AAPL', 'Credentials not allowed'],
    ['https://query1.finance.yahoo.com/v7/finance/download/AAPL', 'Path not allowed'],
    ['not a url', 'Invalid url parameter'],
    [undefined, 'Invalid url parameter']
  ])('rejects %s', (rawUrl, error) => {
    expect(normalizeYahooUrl(rawUrl)).toEqual({ error });
  });

  it('accepts the chart, quoteSummary and search endpoints', () => {
    for (const path of ['/v8/finance/chart/AAPL', '/v10/finance/quoteSummary/AAPL', '/v1/finance/search?q=apple']) {
      expect(normalizeYahooUrl(`https://query2.finance.yahoo.com${path}`).url).toBeInstanceOf(URL);
    }
  });
});

describe('proxyYahoo', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => vi.unstubAllGlobals());

  it('rejects disallowed URLs without contacting Yahoo', async () => {
    const requests = stubYahoo(() => json({}));
    const result = await proxyYahoo('https://example.com/v8/finance/chart/AAPL');

    expect(result).toEqual({ status: 400, body: { error: 'Host not allowed' }, cacheControl: null });
    expect(requests).toHaveLength(0);
  });

  it('passes Yahoo status and error body through for unknown symbols', async () => {
    const yahooError = { chart: { result: null, error: { code: 'Not Found', description: 'No data found' } } };
    stubYahoo(() => json(yahooError, 404));

    const result = await proxyYahoo(CHART_URL);

    expect(result.status).toBe(404);
    expect(result.body).toEqual(yahooError);
    expect(result.cacheControl).toBeNull();
  });

  it('caches successful responses at the edge', async () => {
    stubYahoo(() => json({ chart: { result: [] } }));
    const result = await proxyYahoo(CHART_URL);

    expect(result.status).toBe(200);
    expect(result.cacheControl).toContain('s-maxage=60');
  });

  it('adds the crumb and only the cookie name and value to quoteSummary requests', async () => {
    const requests = stubYahoo(() => json({ quoteSummary: { result: [] } }));
    await proxyYahoo(SUMMARY_URL);

    const dataRequest = requests.find(r => r.url.pathname.startsWith('/v10/finance/quoteSummary/'));
    expect(dataRequest.url.searchParams.get('crumb')).toBe('crumb123');
    expect(dataRequest.headers.Cookie).toBe('A3=session');
  });

  it('refreshes the auth once after a 401', async () => {
    let dataCalls = 0;
    stubYahoo(() => (++dataCalls === 1 ? json({ error: 'Invalid Crumb' }, 401) : json({ quoteSummary: { result: [] } })));

    const result = await proxyYahoo(SUMMARY_URL);

    expect(result.status).toBe(200);
    expect(dataCalls).toBe(2);
  });

  it('wraps non-JSON error bodies', async () => {
    stubYahoo(() => new Response('Too Many Requests', { status: 429 }));
    const result = await proxyYahoo(CHART_URL);

    expect(result).toEqual({ status: 429, body: { error: 'Yahoo API returned 429' }, cacheControl: null });
  });
});
