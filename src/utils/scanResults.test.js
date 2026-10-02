import { describe, it, expect } from 'vitest';
import { sortScanResults, filterScanResults, summarizeScanResults, toScanCsv } from './scanResults';

const NOW = 1_790_000_000;
const row = (symbol, overrides = {}) => ({
  symbol,
  name: null,
  score: 0,
  bullishPercent: 40,
  bearishPercent: 40,
  verdict: 'NEUTRAL',
  verdictType: 'neutral',
  price: 100,
  currency: 'USD',
  priceChange: 0,
  rsi: 50,
  rsiZone: 'neutral',
  sma200Distance: null,
  maCross: null,
  volumeRatio: 1,
  week52HighDistance: null,
  ...overrides
});

const rows = [
  row('AAA', { score: 20, rsi: 75, rsiZone: 'overbought', sma200Distance: 5 }),
  row('BBB', { score: -40, verdictType: 'strong-bearish', sma200Distance: -8, name: 'Beta Corp' }),
  row('CCC', { score: 60, verdictType: 'strong-bullish', rsi: null, sma200Distance: 12 }),
  row('DDD', { score: 20, verdictType: 'bullish' })
];
const symbols = (list) => list.map(item => item.symbol);

describe('sortScanResults', () => {
  it('ranks by score from best to worst and back, ties ordered by symbol', () => {
    expect(symbols(sortScanResults(rows, 'score', 'desc'))).toEqual(['CCC', 'AAA', 'DDD', 'BBB']);
    expect(symbols(sortScanResults(rows, 'score', 'asc'))).toEqual(['BBB', 'AAA', 'DDD', 'CCC']);
  });

  it('puts rows without a value last in both directions', () => {
    expect(symbols(sortScanResults(rows, 'rsi', 'asc'))).toEqual(['BBB', 'DDD', 'AAA', 'CCC']);
    expect(symbols(sortScanResults(rows, 'rsi', 'desc')).at(-1)).toBe('CCC');
  });

  it('sorts text alphabetically', () => {
    expect(symbols(sortScanResults(rows, 'symbol', 'desc'))).toEqual(['DDD', 'CCC', 'BBB', 'AAA']);
  });

  it('does not change the input', () => {
    sortScanResults(rows, 'score', 'desc');
    expect(symbols(rows)).toEqual(['AAA', 'BBB', 'CCC', 'DDD']);
  });
});

describe('filterScanResults', () => {
  it('filters by verdict group', () => {
    expect(symbols(filterScanResults(rows, { verdictGroup: 'bullish' }, NOW))).toEqual(['CCC', 'DDD']);
    expect(symbols(filterScanResults(rows, { verdictGroup: 'bearish' }, NOW))).toEqual(['BBB']);
  });

  it('filters by signal', () => {
    expect(symbols(filterScanResults(rows, { signalId: 'overbought' }, NOW))).toEqual(['AAA']);
  });

  it('searches symbol and name', () => {
    expect(symbols(filterScanResults(rows, { query: ' beta ' }, NOW))).toEqual(['BBB']);
    expect(symbols(filterScanResults(rows, { query: 'cc' }, NOW))).toEqual(['CCC']);
  });
});

describe('summarizeScanResults', () => {
  it('summarizes the market breadth', () => {
    const summary = summarizeScanResults(rows);
    expect(summary.total).toBe(4);
    expect(summary.verdictCounts).toEqual({ 'strong-bullish': 1, bullish: 1, neutral: 1, bearish: 0, 'strong-bearish': 1 });
    expect(summary.aboveSma200Percent).toBeCloseTo(200 / 3, 10);
    expect(summary.averageScore).toBe(15);
    expect(summary.best.symbol).toBe('CCC');
    expect(summary.worst.symbol).toBe('BBB');
  });

  it('handles an empty scan', () => {
    expect(summarizeScanResults([])).toMatchObject({ total: 0, aboveSma200Percent: null, averageScore: null, best: null, worst: null });
  });
});

describe('toScanCsv', () => {
  it('writes a header and one line per row with prices in the main currency', () => {
    const csv = toScanCsv([row('VOD.L', { name: 'Vodafone; "Group"', price: 124.1, currency: 'GBp', rsi: 49.26, score: 15 })], NOW);
    const [header, line] = csv.split('\r\n');
    expect(header.startsWith('Rang;Symbol;Name;Urteil;Score')).toBe(true);
    expect(line).toBe('1;VOD.L;"Vodafone; ""Group""";NEUTRAL;15;40;40;1.241;GBP;0;49.3;;;');
  });
});
