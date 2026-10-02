import { getScanSignals } from './analysis/scanSignals';
import { mainCurrencyPerQuoteUnit, toMainCurrency } from './format';

/**
 * Metrics the scan results can be sorted by
 */
export const SORT_OPTIONS = [
  { id: 'score', label: 'Score', value: (row) => row.score },
  { id: 'bullishPercent', label: 'Bullish %', value: (row) => row.bullishPercent },
  { id: 'bearishPercent', label: 'Bearish %', value: (row) => row.bearishPercent },
  { id: 'priceChange', label: 'Tagesveränderung', value: (row) => row.priceChange },
  { id: 'rsi', label: 'RSI', value: (row) => row.rsi },
  { id: 'sma200Distance', label: 'Abstand SMA 200', value: (row) => row.sma200Distance },
  { id: 'week52HighDistance', label: 'Abstand 52W-Hoch', value: (row) => row.week52HighDistance },
  { id: 'symbol', label: 'Symbol', value: (row) => row.symbol }
];

/**
 * Verdict types from best to worst
 */
export const VERDICT_TYPES = ['strong-bullish', 'bullish', 'neutral', 'bearish', 'strong-bearish'];

export const VERDICT_GROUPS = [
  { id: 'all', label: 'Alle', types: null },
  { id: 'bullish', label: 'Bullish', types: ['strong-bullish', 'bullish'] },
  { id: 'neutral', label: 'Neutral', types: ['neutral'] },
  { id: 'bearish', label: 'Bearish', types: ['bearish', 'strong-bearish'] }
];

/**
 * Score with sign, e.g. +42 or -15
 * @param {number} score
 * @returns {string}
 */
export function formatScore(score) {
  return `${score > 0 ? '+' : ''}${score}`;
}

const isMissing = (value) => value == null || (typeof value === 'number' && !Number.isFinite(value));
const compareValues = (a, b) => (typeof a === 'string' ? a.localeCompare(b) : a - b);

/**
 * Sorts scan rows by one of the SORT_OPTIONS. Rows without a value go last in both
 * directions, equal values are ordered by symbol.
 * @param {Array} rows - Results of toAnalysisSummary
 * @param {string} sortId - Id of a SORT_OPTIONS entry
 * @param {'asc'|'desc'} direction
 * @returns {Array} - New sorted array
 */
export function sortScanResults(rows, sortId, direction) {
  const { value } = SORT_OPTIONS.find(option => option.id === sortId);
  const sign = direction === 'asc' ? 1 : -1;

  return [...rows].sort((rowA, rowB) => {
    const a = value(rowA);
    const b = value(rowB);
    if (isMissing(a) || isMissing(b)) return isMissing(a) - isMissing(b);
    return sign * compareValues(a, b) || rowA.symbol.localeCompare(rowB.symbol);
  });
}

/**
 * Keeps the rows that match the verdict group, the signal and the search text (symbol or name)
 * @param {Array} rows - Results of toAnalysisSummary
 * @param {{verdictGroup?: string, signalId?: string|null, query?: string}} filters
 * @param {number} [nowSeconds]
 * @returns {Array}
 */
export function filterScanResults(rows, { verdictGroup = 'all', signalId = null, query = '' }, nowSeconds = Date.now() / 1000) {
  const { types } = VERDICT_GROUPS.find(group => group.id === verdictGroup);
  const search = query.trim().toLowerCase();

  return rows.filter(row => (
    (!types || types.includes(row.verdictType))
    && (!signalId || getScanSignals(row, nowSeconds).some(signal => signal.id === signalId))
    && (!search || row.symbol.toLowerCase().includes(search) || (row.name ?? '').toLowerCase().includes(search))
  ));
}

/**
 * Market breadth of a scan: verdict distribution, share above SMA 200, average score, best and worst row
 * @param {Array} rows - Results of toAnalysisSummary
 */
export function summarizeScanResults(rows) {
  const verdictCounts = Object.fromEntries(VERDICT_TYPES.map(type => [type, 0]));
  rows.forEach(row => { verdictCounts[row.verdictType] += 1; });

  const withSma200 = rows.filter(row => Number.isFinite(row.sma200Distance));
  const ranked = sortScanResults(rows, 'score', 'desc');

  return {
    total: rows.length,
    verdictCounts,
    aboveSma200Percent: withSma200.length > 0
      ? (withSma200.filter(row => row.sma200Distance > 0).length / withSma200.length) * 100
      : null,
    averageScore: rows.length > 0 ? rows.reduce((sum, row) => sum + row.score, 0) / rows.length : null,
    best: ranked[0] ?? null,
    worst: ranked.at(-1) ?? null
  };
}

const roundTo = (value, digits) => (Number.isFinite(value) ? Number(value.toFixed(digits)) : null);

const CSV_COLUMNS = [
  { header: 'Rang', value: (row, index) => index + 1 },
  { header: 'Symbol', value: (row) => row.symbol },
  { header: 'Name', value: (row) => row.name },
  { header: 'Urteil', value: (row) => row.verdict },
  { header: 'Score', value: (row) => row.score },
  { header: 'Bullish %', value: (row) => row.bullishPercent },
  { header: 'Bearish %', value: (row) => row.bearishPercent },
  { header: 'Kurs', value: (row) => roundTo(row.price * mainCurrencyPerQuoteUnit(row.currency), 4) },
  { header: 'Währung', value: (row) => toMainCurrency(row.currency) },
  { header: 'Tag %', value: (row) => roundTo(row.priceChange, 2) },
  { header: 'RSI', value: (row) => roundTo(row.rsi, 1) },
  { header: 'Abstand SMA 200 %', value: (row) => roundTo(row.sma200Distance, 2) },
  { header: 'Abstand 52W-Hoch %', value: (row) => roundTo(row.week52HighDistance, 2) },
  { header: 'Signale', value: (row, index, nowSeconds) => getScanSignals(row, nowSeconds).map(signal => signal.label).join(', ') }
];

/**
 * CSV of the rows in the given order. Semicolons and decimal points open as columns and
 * numbers in Excel with Swiss settings.
 * @param {Array} rows - Results of toAnalysisSummary
 * @param {number} [nowSeconds]
 * @returns {string}
 */
export function toScanCsv(rows, nowSeconds = Date.now() / 1000) {
  const header = CSV_COLUMNS.map(column => column.header);
  const lines = rows.map((row, index) => CSV_COLUMNS.map(column => column.value(row, index, nowSeconds)));
  return [header, ...lines].map(cells => cells.map(toCsvCell).join(';')).join('\r\n');
}

function toCsvCell(value) {
  if (value == null) return '';
  const text = String(value);
  return /[";\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
