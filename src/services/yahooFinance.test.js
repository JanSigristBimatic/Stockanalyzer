import { describe, it, expect } from 'vitest';
import { parseChartResponse, parseQuoteSummary, parseNews, getNewsQuery, isMarketOpen, getTimePeriod } from './yahooFinance';
import { TIME_PERIODS } from '../constants';

const OPTIONS = { period: '6M', interval: '1d', displayCutoff: 1_000_000 + 10 * 86400 };

function chartJson({ bars = 30, close = (i) => 0.93 + i * 0.0001, high = (i) => close(i) + 0.001, meta = {} } = {}) {
  const timestamps = Array.from({ length: bars }, (_, i) => 1_000_000 + i * 86400);
  return {
    chart: {
      result: [{
        meta: {
          currency: 'CHF',
          exchangeName: 'EBS',
          priceHint: 4,
          instrumentType: 'EQUITY',
          regularMarketTime: 1_000_000 + bars * 86400,
          currentTradingPeriod: { regular: { start: 100, end: 200 } },
          ...meta
        },
        timestamp: timestamps,
        indicators: {
          quote: [{
            open: timestamps.map((_, i) => close(i)),
            high: timestamps.map((_, i) => high(i)),
            low: timestamps.map((_, i) => close(i) - 0.001),
            close: timestamps.map((_, i) => close(i)),
            volume: timestamps.map(() => 1000)
          }]
        }
      }],
      error: null
    }
  };
}

describe('parseChartResponse', () => {
  it('classifies an unknown symbol (HTTP 404) as a symbol error', () => {
    const json = { chart: { result: null, error: { code: 'Not Found', description: 'No data found, symbol may be delisted' } } };
    expect(parseChartResponse(json, 404, OPTIONS).error).toEqual({ type: 'symbol', message: 'No data found, symbol may be delisted' });
  });

  it('classifies a 404 without Yahoo body as a symbol error as well', () => {
    expect(parseChartResponse({ error: 'Yahoo API returned 404' }, 404, OPTIONS).error.type).toBe('symbol');
  });

  it('reports other HTTP failures with their status', () => {
    expect(parseChartResponse({}, 422, OPTIONS).error).toEqual({ type: 'http', status: 422 });
  });

  it('keeps full price precision', () => {
    const { data } = parseChartResponse(chartJson(), 200, OPTIONS);
    expect(data[1].close).toBeCloseTo(0.9301, 10);
  });

  it('drops bars without high or low', () => {
    const json = chartJson({ high: (i) => (i === 5 ? null : 1) });
    const { data } = parseChartResponse(json, 200, OPTIONS);
    expect(data).toHaveLength(29);
    expect(data.every(bar => bar.high != null)).toBe(true);
  });

  it('passes the chart meta data through', () => {
    const result = parseChartResponse(chartJson(), 200, OPTIONS);
    expect(result).toMatchObject({
      currency: 'CHF',
      exchange: 'EBS',
      priceHint: 4,
      instrumentType: 'EQUITY',
      tradingPeriod: { start: 100, end: 200 }
    });
  });

  it('counts the bars before the display cutoff as prefetch', () => {
    expect(parseChartResponse(chartJson(), 200, OPTIONS).prefetchCount).toBe(10);
  });

  it('rejects series with fewer than 20 bars', () => {
    expect(parseChartResponse(chartJson({ bars: 19 }), 200, OPTIONS).error.type).toBe('symbol');
  });
});

describe('parseQuoteSummary', () => {
  const json = {
    quoteSummary: {
      result: [{
        financialData: { debtToEquity: { raw: 78.445 }, earningsGrowth: { raw: 0 }, recommendationKey: 'buy' },
        summaryDetail: { dividendYield: { raw: 0.0032 } },
        defaultKeyStatistics: {},
        price: { longName: 'Apple Inc.', regularMarketChangePercent: { raw: -0.008107566 } }
      }]
    }
  };

  it('converts debt-to-equity from percent to a ratio', () => {
    expect(parseQuoteSummary(json, 'AAPL').fundamentals.debtToEquity).toBeCloseTo(0.78445, 8);
  });

  it('keeps zero values and maps missing values to null', () => {
    const { fundamentals } = parseQuoteSummary(json, 'AAPL');
    expect(fundamentals.earningsGrowth).toBe(0);
    expect(fundamentals.pegRatio).toBeNull();
  });

  it('reports the daily change in percent', () => {
    expect(parseQuoteSummary(json, 'AAPL').dailyChangePercent).toBeCloseTo(-0.8108, 4);
  });

  it('returns null without a result', () => {
    expect(parseQuoteSummary({ quoteSummary: { result: null } }, 'X')).toBeNull();
  });

  it('takes the analyst ratings of the current month', () => {
    const withTrend = {
      quoteSummary: {
        result: [{
          recommendationTrend: {
            trend: [
              { period: '-1m', strongBuy: 9, buy: 9, hold: 9, sell: 9, strongSell: 9 },
              { period: '0m', strongBuy: 6, buy: 19, hold: 13, sell: 3 }
            ]
          }
        }]
      }
    };
    expect(parseQuoteSummary(withTrend, 'AAPL').analystRatings)
      .toEqual({ strongBuy: 6, buy: 19, hold: 13, sell: 3, strongSell: 0 });
  });

  it('has no analyst ratings without coverage', () => {
    const uncovered = { quoteSummary: { result: [{ recommendationTrend: { trend: [{ period: '0m', strongBuy: 0, buy: 0, hold: 0, sell: 0, strongSell: 0 }] } }] } };
    expect(parseQuoteSummary(uncovered, 'X').analystRatings).toBeNull();
    expect(parseQuoteSummary(json, 'AAPL').analystRatings).toBeNull();
  });

  it('reads the next earnings and ex-dividend dates', () => {
    const withEvents = {
      quoteSummary: {
        result: [{
          calendarEvents: {
            earnings: { earningsDate: [{ raw: 1793304000 }, { raw: 1793563200 }], isEarningsDateEstimate: true },
            exDividendDate: { raw: 1786320000 }
          }
        }]
      }
    };
    expect(parseQuoteSummary(withEvents, 'AAPL').events).toEqual({
      earningsDate: 1793304000,
      isEarningsDateEstimate: true,
      exDividendDate: 1786320000
    });
  });

  it('maps an empty earnings calendar to null dates', () => {
    const empty = { quoteSummary: { result: [{ calendarEvents: { earnings: { earningsDate: [] }, exDividendDate: {} } }] } };
    expect(parseQuoteSummary(empty, 'NESN.SW').events).toEqual({
      earningsDate: null,
      isEarningsDateEstimate: false,
      exDividendDate: null
    });
  });
});

describe('parseNews', () => {
  it('keeps https articles only and sorts them newest first', () => {
    const json = {
      news: [
        { uuid: 'a', title: 'Older', publisher: 'Reuters', link: 'https://finance.yahoo.com/a', providerPublishTime: 100 },
        { uuid: 'b', title: 'Script', link: 'javascript:alert(1)', providerPublishTime: 300 },
        { uuid: 'c', title: 'Newer', link: 'https://finance.yahoo.com/c', providerPublishTime: 200 },
        { uuid: 'd', link: 'https://finance.yahoo.com/d', providerPublishTime: 400 }
      ]
    };
    expect(parseNews(json)).toEqual([
      { id: 'c', title: 'Newer', publisher: null, link: 'https://finance.yahoo.com/c', publishedAt: 200 },
      { id: 'a', title: 'Older', publisher: 'Reuters', link: 'https://finance.yahoo.com/a', publishedAt: 100 }
    ]);
  });

  it('returns an empty list without news', () => {
    expect(parseNews({ news: [] })).toEqual([]);
    expect(parseNews({})).toEqual([]);
  });
});

describe('getNewsQuery', () => {
  it('searches by company name for symbols with an exchange suffix', () => {
    expect(getNewsQuery('NESN.SW', 'Nestlé S.A.')).toBe('Nestlé S.A.');
    expect(getNewsQuery('AAPL', 'Apple Inc.')).toBe('AAPL');
    expect(getNewsQuery('VOD.L', null)).toBe('VOD.L');
  });
});

describe('isMarketOpen', () => {
  const regular = { start: 100, end: 200 };

  it('is true during the regular session only', () => {
    expect(isMarketOpen(regular, 150)).toBe(true);
    expect(isMarketOpen(regular, 99)).toBe(false);
    expect(isMarketOpen(regular, 200)).toBe(false);
    expect(isMarketOpen(null, 150)).toBe(false);
  });
});

describe('getTimePeriod', () => {
  it('requests the display period plus a prefetch for indicator warm-up', () => {
    const { period1, period2, displayCutoff } = getTimePeriod('6M', '1d');
    expect(period2 - displayCutoff).toBe(TIME_PERIODS['6M']);
    expect(displayCutoff - period1).toBe(300 * 86400);
  });
});
