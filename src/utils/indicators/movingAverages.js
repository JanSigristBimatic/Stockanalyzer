/**
 * Simple Moving Average (SMA)
 * @param {Array} data - Array of price data with 'close' property
 * @param {number} period - Number of periods for the average
 * @returns {Array} - Array of SMA values (null for insufficient data)
 */
export function calcSMA(data, period) {
  return data.map((_, idx) => {
    if (idx < period - 1) return null;
    const sum = data.slice(idx - period + 1, idx + 1).reduce((s, d) => s + d.close, 0);
    return sum / period;
  });
}

/**
 * Exponential Moving Average (EMA) of the closes, seeded with the SMA of the first `period` closes
 * @param {Array} data - Array of price data with 'close' property
 * @param {number} period - Number of periods for the average
 * @returns {Array} - Array of EMA values (null until the period is filled)
 */
export function calcEMA(data, period) {
  return calcEMAFromValues(data.map(d => d.close), period);
}

/**
 * Exponential Moving Average of plain values. Leading nulls are skipped,
 * the seed is the SMA of the first `period` values.
 * @param {Array<number|null>} values - Input values
 * @param {number} period - Number of periods for the average
 * @returns {Array} - Array of EMA values (null until the period is filled)
 */
export function calcEMAFromValues(values, period) {
  const multiplier = 2 / (period + 1);
  const firstIndex = values.findIndex(v => v != null);
  const seedIndex = firstIndex + period - 1;
  let ema = null;

  return values.map((value, idx) => {
    if (firstIndex === -1 || idx < seedIndex) return null;
    ema = idx === seedIndex
      ? values.slice(firstIndex, seedIndex + 1).reduce((s, v) => s + v, 0) / period
      : value * multiplier + ema * (1 - multiplier);
    return ema;
  });
}
