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
    return +(sum / period).toFixed(2);
  });
}

/**
 * Exponential Moving Average (EMA)
 * @param {Array} data - Array of price data with 'close' property
 * @param {number} period - Number of periods for the average
 * @returns {Array} - Array of EMA values
 */
export function calcEMA(data, period) {
  const multiplier = 2 / (period + 1);
  const ema = [];

  data.forEach((item, idx) => {
    if (idx === 0) {
      ema.push(item.close);
    } else {
      const newEma = item.close * multiplier + ema[idx - 1] * (1 - multiplier);
      ema.push(+newEma.toFixed(2));
    }
  });

  return ema;
}
