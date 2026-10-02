import { fetchStockData, fetchQuoteSummary, isMarketOpen } from './yahooFinance';
import { analyzeStock, toAnalysisSummary } from '../utils/analysis/analyzeStock';

/**
 * Loads chart and quoteSummary in parallel and runs the shared analysis.
 * Fundamentals only enter the verdict for equities; ETFs and other instruments are rated technically.
 * @param {string} symbol - Yahoo symbol
 * @param {string} [period='6M'] - Display period
 * @param {string} [interval='1d'] - Bar interval
 * @returns {Promise<{analysis: Object, fundamentals: Object|null, company: Object|null, analystRatings: Object|null, events: Object|null, meta: Object}|{error: Object}>}
 */
export async function analyzeSymbol(symbol, period = '6M', interval = '1d') {
  const [chart, quoteSummary] = await Promise.all([
    fetchStockData(symbol, period, interval),
    fetchQuoteSummary(symbol)
  ]);
  if (chart.error) return { error: chart.error };

  const fundamentals = quoteSummary?.fundamentals ?? null;
  const analysis = analyzeStock(chart.data, {
    prefetchCount: chart.prefetchCount,
    fundamentals: chart.instrumentType === 'EQUITY' ? fundamentals : null,
    dailyChangePercent: quoteSummary?.dailyChangePercent ?? null,
    lastBarComplete: !isMarketOpen(chart.tradingPeriod),
    currency: chart.currency,
    priceHint: chart.priceHint
  });

  return {
    analysis,
    fundamentals,
    company: quoteSummary?.company ?? null,
    analystRatings: quoteSummary?.analystRatings ?? null,
    events: quoteSummary?.events ?? null,
    meta: {
      currency: chart.currency,
      exchange: chart.exchange,
      priceHint: chart.priceHint,
      regularMarketTime: chart.regularMarketTime
    }
  };
}

/**
 * Analyzes a symbol on daily bars and condenses the result into a row for the watchlist and the scanner
 * @param {string} symbol - Yahoo symbol
 * @param {string} period - Display period
 * @returns {Promise<Object|null>} - null if the symbol could not be loaded
 */
export async function analyzeSymbolSummary(symbol, period) {
  const response = await analyzeSymbol(symbol, period, '1d');
  return response.error ? null : toAnalysisSummary(symbol, response.analysis, response);
}
