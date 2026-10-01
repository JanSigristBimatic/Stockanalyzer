import { fetchStockData, fetchQuoteSummary, isMarketOpen } from './yahooFinance';
import { analyzeStock } from '../utils/analysis/analyzeStock';

/**
 * Loads chart and quoteSummary in parallel and runs the shared analysis.
 * Fundamentals only enter the verdict for equities; ETFs and other instruments are rated technically.
 * @param {string} symbol - Yahoo symbol
 * @param {string} [period='6M'] - Display period
 * @param {string} [interval='1d'] - Bar interval
 * @returns {Promise<{analysis: Object, fundamentals: Object|null, company: Object|null, meta: Object}|{error: Object}>}
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
    meta: {
      currency: chart.currency,
      exchange: chart.exchange,
      priceHint: chart.priceHint,
      instrumentType: chart.instrumentType,
      regularMarketTime: chart.regularMarketTime
    }
  };
}
