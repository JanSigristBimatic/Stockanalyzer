/**
 * Point arrays for Lightweight Charts built from the analysis chart data. The time of a point is
 * the unix timestamp of its bar; the chart formats it in local time.
 */

/**
 * OHLC candles; a bar without open is drawn at its close
 * @param {Array} chartData - Bars with timestamp, open, high, low and close
 * @returns {Array<{time: number, open: number, high: number, low: number, close: number}>}
 */
export function toCandles(chartData) {
  return chartData.map(bar => ({
    time: bar.timestamp,
    open: bar.open ?? bar.close,
    high: bar.high,
    low: bar.low,
    close: bar.close
  }));
}

/**
 * Line points of one value; bars before an indicator is warmed up are left out
 * @param {Array} chartData - Bars with timestamp and the value under key
 * @param {string} key - Property of the bar, e.g. 'sma50'
 * @returns {Array<{time: number, value: number}>}
 */
export function toLinePoints(chartData, key) {
  return chartData
    .filter(bar => Number.isFinite(bar[key]))
    .map(bar => ({ time: bar.timestamp, value: bar[key] }));
}

/**
 * Histogram bars with a color per bar, e.g. volume by candle direction
 * @param {Array} chartData - Bars with timestamp and the value under key
 * @param {string} key - Property of the bar, e.g. 'volume'
 * @param {function(Object): string} colorOf - Color for a bar
 * @returns {Array<{time: number, value: number, color: string}>}
 */
export function toColoredBars(chartData, key, colorOf) {
  return chartData
    .filter(bar => Number.isFinite(bar[key]))
    .map(bar => ({ time: bar.timestamp, value: bar[key], color: colorOf(bar) }));
}
