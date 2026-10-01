import { EXCHANGE_SUFFIXES, TIME_PERIODS } from '../constants';

const YAHOO_API = 'https://query1.finance.yahoo.com';
const DAY_SECONDS = 24 * 60 * 60;
const MIN_BARS = 20;
const INTRADAY_INTERVALS = ['15m', '1h'];
const LONG_PERIODS = ['6M', '1Y', '2Y', '5Y'];
const QUOTE_SUMMARY_MODULES = 'defaultKeyStatistics,financialData,summaryDetail,assetProfile,price';

// Calendar time that covers at least ~55 bars before the display period (SMA 50 warm-up),
// including nights, weekends and holidays
const PREFETCH_SECONDS = {
  '15m': 5 * DAY_SECONDS,
  '1h': 14 * DAY_SECONDS,
  '1d': 80 * DAY_SECONDS,
  '1wk': 60 * 7 * DAY_SECONDS
};

// Served by api/yahoo.js on Vercel and by the Vite dev server locally
const PROXY_URL = '/api/yahoo?url=';

async function fetchWithProxy(url, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(PROXY_URL + encodeURIComponent(url), { signal: controller.signal });
    return { response, error: null };
  } catch (error) {
    console.error('Proxy fetch failed:', error.message);
    return { response: null, error };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Time range for a chart request: the display period plus a prefetch for indicator warm-up
 * @returns {{period1: number, period2: number, displayCutoff: number}} - Unix seconds
 */
export function getTimePeriod(period, interval = '1d') {
  const period2 = Math.floor(Date.now() / 1000);
  const displaySeconds = TIME_PERIODS[period] || TIME_PERIODS['6M'];
  const prefetchSeconds = PREFETCH_SECONDS[interval] || PREFETCH_SECONDS['1d'];
  return {
    period1: period2 - displaySeconds - prefetchSeconds,
    period2,
    displayCutoff: period2 - displaySeconds
  };
}

/**
 * Whether the regular session of the exchange is currently running
 * @param {{start: number, end: number}|null} tradingPeriod - Regular session from the chart meta (unix seconds)
 * @param {number} nowSeconds - Current time in unix seconds
 */
export function isMarketOpen(tradingPeriod, nowSeconds = Date.now() / 1000) {
  return Boolean(tradingPeriod) && nowSeconds >= tradingPeriod.start && nowSeconds < tradingPeriod.end;
}

export async function searchSymbols(query) {
  if (!query || query.length < 2) return [];
  const searchUrl = `${YAHOO_API}/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`;
  const { response } = await fetchWithProxy(searchUrl, 5000);
  if (!response || !response.ok) return [];
  try {
    const json = await response.json();
    return (json.quotes || [])
      .filter(q => q.quoteType === 'EQUITY' || q.quoteType === 'ETF')
      .map(q => ({ symbol: q.symbol, name: q.longname || q.shortname || q.symbol, exchange: q.exchange, exchangeDisplay: q.exchDisp || q.exchange, type: q.quoteType, score: q.score || 0 }));
  } catch { return []; }
}

export async function checkSymbolExists(symbol) {
  const period2 = Math.floor(Date.now() / 1000);
  const period1 = period2 - (7 * DAY_SECONDS);
  const yahooUrl = `${YAHOO_API}/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1d`;
  const { response } = await fetchWithProxy(yahooUrl);
  if (!response || !response.ok) return null;
  try {
    const json = await response.json();
    const result = json.chart?.result?.[0];
    if (!result?.timestamp?.length) return null;
    const lastPrice = result.indicators.quote[0].close?.slice(-1)[0];
    return { symbol, exchange: result.meta.exchangeName, currency: result.meta.currency, name: result.meta.shortName || result.meta.longName || symbol, price: lastPrice ? lastPrice.toFixed(2) : 'N/A' };
  } catch { return null; }
}

export async function searchSymbolVariants(baseSymbol) {
  const cleanSymbol = baseSymbol.replace(/\.[A-Z]+$/, '').toUpperCase();
  const checks = EXCHANGE_SUFFIXES.map(async ({ suffix, exchange, flag }) => {
    const fullSymbol = cleanSymbol + suffix;
    const result = await checkSymbolExists(fullSymbol);
    if (result) return { ...result, suffix, exchangeLabel: exchange, flag };
    return null;
  });
  return (await Promise.all(checks)).filter(Boolean);
}

export async function fetchStockData(symbol, period = '6M', interval = '1d') {
  const { period1, period2, displayCutoff } = getTimePeriod(period, interval);
  const yahooUrl = `${YAHOO_API}/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${interval}&includePrePost=false`;
  const { response, error } = await fetchWithProxy(yahooUrl);
  if (!response) {
    return { error: { type: 'network', message: error?.message || 'Network error' } };
  }
  try {
    return parseChartResponse(await response.json(), response.status, { period, interval, displayCutoff });
  } catch {
    return { error: { type: 'parse', message: 'Failed to parse response' } };
  }
}

/**
 * Converts a Yahoo chart response into OHLCV bars at full precision
 * @param {Object} json - Response body
 * @param {number} status - HTTP status
 * @param {{period: string, interval: string, displayCutoff: number}} options
 * @returns {Object} - Bars with meta data, or { error } with type 'symbol' or 'http'
 */
export function parseChartResponse(json, status, { period, interval, displayCutoff }) {
  if (status === 404) {
    return { error: { type: 'symbol', message: json?.chart?.error?.description || 'Symbol not found' } };
  }
  if (status >= 400) {
    return { error: { type: 'http', status } };
  }

  const result = json?.chart?.result?.[0];
  const quote = result?.indicators?.quote?.[0];
  if (!result?.timestamp || !quote) {
    return { error: { type: 'symbol', message: 'No data available' } };
  }

  // Bars without high or low would distort ATR, ADX, Stochastic and Fibonacci
  const data = result.timestamp
    .map((timestamp, i) => {
      const date = new Date(timestamp * 1000);
      return {
        date: formatBarDate(date, period, interval),
        fullDate: date,
        timestamp,
        open: quote.open[i] ?? null,
        high: quote.high[i],
        low: quote.low[i],
        close: quote.close[i],
        volume: quote.volume[i] ?? 0
      };
    })
    .filter(bar => bar.close != null && bar.high != null && bar.low != null);

  if (data.length < MIN_BARS) {
    return { error: { type: 'symbol', message: 'Insufficient data' } };
  }

  const { meta } = result;
  return {
    data,
    prefetchCount: data.filter(bar => bar.timestamp < displayCutoff).length,
    currency: meta.currency,
    exchange: meta.exchangeName,
    priceHint: meta.priceHint ?? 2,
    instrumentType: meta.instrumentType,
    regularMarketTime: meta.regularMarketTime,
    tradingPeriod: meta.currentTradingPeriod?.regular ?? null
  };
}

function formatBarDate(date, period, interval) {
  if (INTRADAY_INTERVALS.includes(interval)) {
    return date.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }
  if (LONG_PERIODS.includes(period)) {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: '2-digit' });
  }
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

/**
 * Loads fundamentals, company profile and the daily change in one request
 * @returns {Promise<{fundamentals: Object, company: Object, dailyChangePercent: number|null}|null>}
 */
export async function fetchQuoteSummary(symbol) {
  const url = `${YAHOO_API}/v10/finance/quoteSummary/${symbol}?modules=${QUOTE_SUMMARY_MODULES}`;
  const { response } = await fetchWithProxy(url);
  if (!response || !response.ok) return null;
  try {
    return parseQuoteSummary(await response.json(), symbol);
  } catch { return null; }
}

const raw = (field) => field?.raw ?? null;

/**
 * Maps a Yahoo quoteSummary response; zero values are kept, missing values become null
 */
export function parseQuoteSummary(json, symbol) {
  const result = json?.quoteSummary?.result?.[0];
  if (!result) return null;

  const keyStats = result.defaultKeyStatistics || {};
  const summary = result.summaryDetail || {};
  const financial = result.financialData || {};
  const profile = result.assetProfile || {};
  const price = result.price || {};

  // Yahoo reports debt-to-equity in percent (78.4 means a ratio of 0.784)
  const debtToEquityPercent = raw(financial.debtToEquity);
  const changeFraction = raw(price.regularMarketChangePercent);

  return {
    fundamentals: {
      peRatio: raw(keyStats.trailingPE) ?? raw(summary.trailingPE),
      forwardPE: raw(keyStats.forwardPE),
      pegRatio: raw(keyStats.pegRatio),
      priceToBook: raw(keyStats.priceToBook),
      priceToSales: raw(summary.priceToSalesTrailing12Months),
      marketCap: raw(summary.marketCap),
      enterpriseValue: raw(keyStats.enterpriseValue),
      week52High: raw(summary.fiftyTwoWeekHigh),
      week52Low: raw(summary.fiftyTwoWeekLow),
      eps: raw(keyStats.trailingEps),
      forwardEps: raw(keyStats.forwardEps),
      bookValue: raw(keyStats.bookValue),
      profitMargin: raw(financial.profitMargins),
      operatingMargin: raw(financial.operatingMargins),
      grossMargin: raw(financial.grossMargins),
      returnOnEquity: raw(financial.returnOnEquity),
      returnOnAssets: raw(financial.returnOnAssets),
      earningsGrowth: raw(financial.earningsGrowth),
      revenueGrowth: raw(financial.revenueGrowth),
      earningsQuarterlyGrowth: raw(keyStats.earningsQuarterlyGrowth),
      debtToEquity: debtToEquityPercent == null ? null : debtToEquityPercent / 100,
      currentRatio: raw(financial.currentRatio),
      quickRatio: raw(financial.quickRatio),
      totalCash: raw(financial.totalCash),
      totalDebt: raw(financial.totalDebt),
      freeCashflow: raw(financial.freeCashflow),
      operatingCashflow: raw(financial.operatingCashflow),
      totalRevenue: raw(financial.totalRevenue),
      ebitda: raw(financial.ebitda),
      dividendYield: raw(summary.dividendYield),
      dividendRate: raw(summary.dividendRate),
      payoutRatio: raw(summary.payoutRatio),
      beta: raw(keyStats.beta),
      targetMeanPrice: raw(financial.targetMeanPrice),
      targetHighPrice: raw(financial.targetHighPrice),
      targetLowPrice: raw(financial.targetLowPrice),
      recommendationMean: raw(financial.recommendationMean),
      recommendationKey: financial.recommendationKey ?? null,
      numberOfAnalystOpinions: raw(financial.numberOfAnalystOpinions),
      // Currency of the financial statements (cash flow figures), may differ from the quote currency
      financialCurrency: financial.financialCurrency ?? null
    },
    company: {
      name: price.longName || price.shortName || symbol,
      sector: profile.sector || null,
      industry: profile.industry || null,
      description: profile.longBusinessSummary || null,
      employees: profile.fullTimeEmployees || null,
      website: profile.website || null,
      city: profile.city || null,
      country: profile.country || null
    },
    dailyChangePercent: changeFraction == null ? null : changeFraction * 100
  };
}
