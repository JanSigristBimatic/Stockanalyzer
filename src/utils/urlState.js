import { DEFAULT_PERIOD, PERIOD_INTERVALS, TAB_IDS } from '../constants';

const DEFAULT_TAB = TAB_IDS[0];
// Yahoo symbols such as AAPL, NESN.SW, BRK-B, ^GSPC or EURCHF=X
const SYMBOL_PATTERN = /^[A-Z0-9.^=-]{1,20}$/;

/**
 * Reads the app state from a query string such as ?s=NESN.SW&p=1Y&t=charts.
 * Invalid or missing values fall back to the defaults.
 * @param {string} search - location.search
 * @returns {{symbol: string|null, period: string, interval: string, tab: string}}
 */
export function readUrlState(search) {
  const params = new URLSearchParams(search);
  const symbol = params.get('s')?.trim().toUpperCase() ?? '';
  const period = Object.hasOwn(PERIOD_INTERVALS, params.get('p')) ? params.get('p') : DEFAULT_PERIOD;
  const intervals = PERIOD_INTERVALS[period];

  return {
    symbol: SYMBOL_PATTERN.test(symbol) ? symbol : null,
    period,
    interval: intervals.includes(params.get('i')) ? params.get('i') : intervals[0],
    tab: TAB_IDS.includes(params.get('t')) ? params.get('t') : DEFAULT_TAB
  };
}

/**
 * Query string for the app state; default values are left out to keep links short
 * @param {{symbol: string|null, period: string, interval: string, tab: string}} state
 * @returns {string} - e.g. "?s=NESN.SW&p=1Y", or an empty string for the default state
 */
export function buildUrlSearch({ symbol, period, interval, tab }) {
  const params = new URLSearchParams();
  if (symbol) params.set('s', symbol);
  if (period !== DEFAULT_PERIOD) params.set('p', period);
  if (interval !== PERIOD_INTERVALS[period][0]) params.set('i', interval);
  if (tab !== DEFAULT_TAB) params.set('t', tab);

  const search = params.toString();
  return search ? `?${search}` : '';
}
