import { EXCHANGE_SUFFIXES, TIME_PERIODS } from '../constants';

const getProxyUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return '/api/yahoo?url=';
  }
  return 'http://localhost:3001/api/yahoo?url=';
};

async function fetchWithProxy(url, timeout = 10000) {
  const proxyUrl = getProxyUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(url), { signal: controller.signal });
    return { response, error: null };
  } catch (error) {
    console.error('Proxy fetch failed:', error.message);
    return { response: null, error };
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getTimePeriod(period) {
  const period2 = Math.floor(Date.now() / 1000);
  const period1 = period2 - (TIME_PERIODS[period] || TIME_PERIODS['6M']);
  return { period1, period2 };
}

export async function searchSymbols(query) {
  if (!query || query.length < 2) return [];
  const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`;
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
  const period1 = period2 - (7 * 24 * 60 * 60);
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=1d`;
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
  const { period1, period2 } = getTimePeriod(period);
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${interval}&includePrePost=false`;
  const { response, error } = await fetchWithProxy(yahooUrl);
  if (!response) {
    return { error: { type: 'network', message: error?.message || 'Network error' } };
  }
  try {
    const json = await response.json();
    if (!response.ok) {
      if (json?.chart?.error) {
        return { error: { type: 'symbol', message: json.chart.error.description || 'Symbol not found' } };
      }
      return { error: { type: 'http', status: response.status } };
    }
    const result = json.chart?.result?.[0];
    if (json.chart?.error) {
      return { error: { type: 'symbol', message: json.chart.error.description || 'Symbol not found' } };
    }
    if (!result?.timestamp || !result?.indicators?.quote?.[0]) {
      return { error: { type: 'symbol', message: 'No data available' } };
    }
    const quotes = result.indicators.quote[0];
    const data = result.timestamp.map((ts, i) => {
      const date = new Date(ts * 1000);
      const hasIntraday = interval.includes('m') || interval.includes('h');
      const needsYear = ['6M', '1Y', '2Y', '5Y'].includes(period);

      let dateStr;
      if (hasIntraday) {
        dateStr = date.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      } else if (needsYear) {
        dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: '2-digit' });
      } else {
        dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
      }

      return {
        date: dateStr,
        fullDate: date,
        open: quotes.open[i] ? +quotes.open[i].toFixed(2) : null,
        high: quotes.high[i] ? +quotes.high[i].toFixed(2) : null,
        low: quotes.low[i] ? +quotes.low[i].toFixed(2) : null,
        close: quotes.close[i] ? +quotes.close[i].toFixed(2) : null,
        volume: quotes.volume[i] || 0
      };
    }).filter(d => d.close !== null);
    if (data.length < 20) return { error: { type: 'symbol', message: 'Insufficient data' } };
    return { data, realData: true, currency: result.meta.currency, exchange: result.meta.exchangeName };
  } catch {
    return { error: { type: 'parse', message: 'Failed to parse response' } };
  }
}

export async function fetchFundamentalData(symbol) {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=defaultKeyStatistics,financialData,summaryDetail`;
  const { response } = await fetchWithProxy(url);
  if (!response || !response.ok) return null;
  try {
    const json = await response.json();
    const result = json.quoteSummary?.result?.[0];
    if (!result) return null;
    const keyStats = result.defaultKeyStatistics || {};
    const summary = result.summaryDetail || {};
    const financial = result.financialData || {};
    return {
      peRatio: keyStats.trailingPE?.raw || summary.trailingPE?.raw || null,
      forwardPE: keyStats.forwardPE?.raw || null,
      pegRatio: keyStats.pegRatio?.raw || null,
      priceToBook: keyStats.priceToBook?.raw || null,
      priceToSales: summary.priceToSalesTrailing12Months?.raw || null,
      marketCap: summary.marketCap?.raw || null,
      enterpriseValue: keyStats.enterpriseValue?.raw || null,
      week52High: summary.fiftyTwoWeekHigh?.raw || null,
      week52Low: summary.fiftyTwoWeekLow?.raw || null,
      eps: keyStats.trailingEps?.raw || null,
      forwardEps: keyStats.forwardEps?.raw || null,
      bookValue: keyStats.bookValue?.raw || null,
      profitMargin: financial.profitMargins?.raw || null,
      operatingMargin: financial.operatingMargins?.raw || null,
      grossMargin: financial.grossMargins?.raw || null,
      returnOnEquity: financial.returnOnEquity?.raw || null,
      returnOnAssets: financial.returnOnAssets?.raw || null,
      earningsGrowth: financial.earningsGrowth?.raw || null,
      revenueGrowth: financial.revenueGrowth?.raw || null,
      earningsQuarterlyGrowth: keyStats.earningsQuarterlyGrowth?.raw || null,
      debtToEquity: financial.debtToEquity?.raw || null,
      currentRatio: financial.currentRatio?.raw || null,
      quickRatio: financial.quickRatio?.raw || null,
      totalCash: financial.totalCash?.raw || null,
      totalDebt: financial.totalDebt?.raw || null,
      freeCashflow: financial.freeCashflow?.raw || null,
      operatingCashflow: financial.operatingCashflow?.raw || null,
      totalRevenue: financial.totalRevenue?.raw || null,
      ebitda: financial.ebitda?.raw || null,
      dividendYield: summary.dividendYield?.raw || null,
      dividendRate: summary.dividendRate?.raw || null,
      payoutRatio: summary.payoutRatio?.raw || null,
      beta: keyStats.beta?.raw || null,
      targetMeanPrice: financial.targetMeanPrice?.raw || null,
      targetHighPrice: financial.targetHighPrice?.raw || null,
      targetLowPrice: financial.targetLowPrice?.raw || null,
      recommendationMean: financial.recommendationMean?.raw || null,
      recommendationKey: financial.recommendationKey || null,
      numberOfAnalystOpinions: financial.numberOfAnalystOpinions?.raw || null
    };
  } catch { return null; }
}

export async function fetchCompanyInfo(symbol) {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=assetProfile,price`;
  const { response } = await fetchWithProxy(url);
  if (!response || !response.ok) return null;
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
  } catch { return null; }
}
