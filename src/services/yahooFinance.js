import { EXCHANGE_SUFFIXES, TIME_PERIODS } from '../constants';

/**
 * Local proxy server URL (run: node server/proxy.js)
 */
const LOCAL_PROXY = 'http://localhost:3001/api/yahoo?url=';

/**
 * CORS Proxies for Yahoo Finance API (fallback when local proxy unavailable)
 */
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.org/?',
];

/**
 * Fetches data with local proxy first, then CORS proxy fallback
 * @param {string} url - The URL to fetch
 * @param {number} timeout - Request timeout in ms (default: 8000)
 * @returns {Promise<Response|null>} - The response or null if all proxies fail
 */
async function fetchWithProxy(url, timeout = 8000) {
  // Try local proxy first (best reliability)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(LOCAL_PROXY + encodeURIComponent(url), {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return response;
    }
  } catch {
    // Local proxy not running, fall through to CORS proxies
  }

  // Fallback to CORS proxies
  for (const proxy of CORS_PROXIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(proxy + encodeURIComponent(url), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Calculates Unix timestamps for a given time period
 * @param {string} period - Time period key (e.g., '1M', '6M', '1Y')
 * @returns {{period1: number, period2: number}} - Start and end timestamps
 */
export function getTimePeriod(period) {
  const period2 = Math.floor(Date.now() / 1000);
  const period1 = period2 - (TIME_PERIODS[period] || TIME_PERIODS['6M']);
  return { period1, period2 };
}

/**
 * Checks if a stock symbol exists on Yahoo Finance
 * @param {string} symbol - The stock symbol to check
 * @returns {Promise<Object|null>} - Symbol info or null if not found
 */
export async function checkSymbolExists(symbol) {
  const period2 = Math.floor(Date.now() / 1000);
  const period1 = period2 - (7 * 24 * 60 * 60);
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1d`;

  const response = await fetchWithProxy(yahooUrl);
  if (!response) return null;

  try {
    const json = await response.json();
    const result = json.chart?.result?.[0];
    if (!result?.timestamp?.length) return null;

    const lastPrice = result.indicators.quote[0].close?.slice(-1)[0];
    return {
      symbol,
      exchange: result.meta.exchangeName,
      currency: result.meta.currency,
      name: result.meta.shortName || result.meta.longName || symbol,
      price: lastPrice ? lastPrice.toFixed(2) : 'N/A'
    };
  } catch {
    return null;
  }
}

/**
 * Searches for a symbol across multiple exchanges
 * @param {string} baseSymbol - The base symbol to search
 * @returns {Promise<Array>} - Array of found symbol variants
 */
export async function searchSymbolVariants(baseSymbol) {
  const cleanSymbol = baseSymbol.replace(/\.[A-Z]+$/, '').toUpperCase();

  const checks = EXCHANGE_SUFFIXES.map(async ({ suffix, exchange, flag }) => {
    const fullSymbol = cleanSymbol + suffix;
    const result = await checkSymbolExists(fullSymbol);
    if (result) {
      return { ...result, suffix, exchangeLabel: exchange, flag };
    }
    return null;
  });

  const allResults = await Promise.all(checks);
  return allResults.filter(Boolean);
}

/**
 * Fetches stock price data from Yahoo Finance
 * @param {string} symbol - The stock symbol
 * @param {string} period - Time period (default: '6M')
 * @param {string} interval - Data interval (default: '1d')
 * @returns {Promise<Object|null>} - Stock data or null if failed
 */
export async function fetchStockData(symbol, period = '6M', interval = '1d') {
  const { period1, period2 } = getTimePeriod(period);
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${interval}&includePrePost=false`;

  const response = await fetchWithProxy(yahooUrl);
  if (!response) return null;

  try {
    const json = await response.json();
    const result = json.chart?.result?.[0];
    if (!result?.timestamp || !result?.indicators?.quote?.[0]) return null;

    const quotes = result.indicators.quote[0];
    const timestamps = result.timestamp;

    const data = timestamps
      .map((ts, i) => {
        const date = new Date(ts * 1000);
        const hasIntraday = interval.includes('m') || interval.includes('h');

        return {
          date: hasIntraday
            ? date.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
            : date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
          fullDate: date,
          open: quotes.open[i] ? +quotes.open[i].toFixed(2) : null,
          high: quotes.high[i] ? +quotes.high[i].toFixed(2) : null,
          low: quotes.low[i] ? +quotes.low[i].toFixed(2) : null,
          close: quotes.close[i] ? +quotes.close[i].toFixed(2) : null,
          volume: quotes.volume[i] || 0
        };
      })
      .filter(d => d.close !== null);

    if (data.length < 20) return null;

    return {
      data,
      realData: true,
      currency: result.meta.currency,
      exchange: result.meta.exchangeName
    };
  } catch {
    return null;
  }
}

/**
 * Fetches fundamental data for a stock
 * @param {string} symbol - The stock symbol
 * @returns {Promise<Object|null>} - Fundamental data or null
 */
export async function fetchFundamentalData(symbol) {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=defaultKeyStatistics,financialData,summaryDetail`;

  const response = await fetchWithProxy(url);
  if (!response) return null;

  try {
    const json = await response.json();
    const result = json.quoteSummary?.result?.[0];
    if (!result) return null;

    const keyStats = result.defaultKeyStatistics || {};
    const summary = result.summaryDetail || {};
    const financial = result.financialData || {};

    return {
      // Valuation Ratios
      peRatio: keyStats.trailingPE?.raw || summary.trailingPE?.raw || null,
      forwardPE: keyStats.forwardPE?.raw || null,
      pegRatio: keyStats.pegRatio?.raw || null,
      priceToBook: keyStats.priceToBook?.raw || null,
      priceToSales: summary.priceToSalesTrailing12Months?.raw || null,

      // Market Data
      marketCap: summary.marketCap?.raw || null,
      enterpriseValue: keyStats.enterpriseValue?.raw || null,
      week52High: summary.fiftyTwoWeekHigh?.raw || null,
      week52Low: summary.fiftyTwoWeekLow?.raw || null,

      // Per Share Data
      eps: keyStats.trailingEps?.raw || null,
      forwardEps: keyStats.forwardEps?.raw || null,
      bookValue: keyStats.bookValue?.raw || null,

      // Profitability Metrics
      profitMargin: financial.profitMargins?.raw || null,
      operatingMargin: financial.operatingMargins?.raw || null,
      grossMargin: financial.grossMargins?.raw || null,
      returnOnEquity: financial.returnOnEquity?.raw || null,
      returnOnAssets: financial.returnOnAssets?.raw || null,

      // Growth Metrics
      earningsGrowth: financial.earningsGrowth?.raw || null,
      revenueGrowth: financial.revenueGrowth?.raw || null,
      earningsQuarterlyGrowth: keyStats.earningsQuarterlyGrowth?.raw || null,

      // Financial Health
      debtToEquity: financial.debtToEquity?.raw || null,
      currentRatio: financial.currentRatio?.raw || null,
      quickRatio: financial.quickRatio?.raw || null,
      totalCash: financial.totalCash?.raw || null,
      totalDebt: financial.totalDebt?.raw || null,
      freeCashflow: financial.freeCashflow?.raw || null,
      operatingCashflow: financial.operatingCashflow?.raw || null,

      // Income & Revenue
      totalRevenue: financial.totalRevenue?.raw || null,
      ebitda: financial.ebitda?.raw || null,

      // Dividend & Risk
      dividendYield: summary.dividendYield?.raw || null,
      dividendRate: summary.dividendRate?.raw || null,
      payoutRatio: summary.payoutRatio?.raw || null,
      beta: keyStats.beta?.raw || null,

      // Targets & Recommendations
      targetMeanPrice: financial.targetMeanPrice?.raw || null,
      targetHighPrice: financial.targetHighPrice?.raw || null,
      targetLowPrice: financial.targetLowPrice?.raw || null,
      recommendationMean: financial.recommendationMean?.raw || null,
      recommendationKey: financial.recommendationKey || null,
      numberOfAnalystOpinions: financial.numberOfAnalystOpinions?.raw || null
    };
  } catch {
    return null;
  }
}

/**
 * Fetches company profile information
 * @param {string} symbol - The stock symbol
 * @returns {Promise<Object|null>} - Company info or null
 */
export async function fetchCompanyInfo(symbol) {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=assetProfile,price`;

  const response = await fetchWithProxy(url);
  if (!response) return null;

  try {
    const json = await response.json();
    const result = json.quoteSummary?.result?.[0];
    if (!result) return null;

    const profile = result.assetProfile || {};
    const price = result.price || {};

    return {
      name: price.longName || price.shortName || symbol,
      sector: profile.sector || null,
      industry: profile.industry || null,
      description: profile.longBusinessSummary || null,
      employees: profile.fullTimeEmployees || null,
      website: profile.website || null,
      city: profile.city || null,
      country: profile.country || null
    };
  } catch {
    return null;
  }
}
