import { calcSMA } from './movingAverages';

/**
 * Bollinger Bands
 * @param {Array} data - Array of price data with 'close' property
 * @param {number} period - SMA period (default: 20)
 * @param {number} stdDevMultiplier - Standard deviation multiplier (default: 2)
 * @returns {Array} - Array of {upper, middle, lower} band values
 */
export function calcBollinger(data, period = 20, stdDevMultiplier = 2) {
  const sma = calcSMA(data, period);

  return data.map((_, idx) => {
    if (idx < period - 1) {
      return { upper: null, middle: null, lower: null };
    }

    const slice = data.slice(idx - period + 1, idx + 1);
    const mean = sma[idx];
    const squaredDiffs = slice.reduce((s, d) => s + Math.pow(d.close - mean, 2), 0);
    const std = Math.sqrt(squaredDiffs / period);

    return {
      upper: +(mean + stdDevMultiplier * std).toFixed(2),
      middle: mean,
      lower: +(mean - stdDevMultiplier * std).toFixed(2)
    };
  });
}

/**
 * Average True Range (ATR)
 * @param {Array} data - Array of price data with 'high', 'low', 'close' properties
 * @param {number} period - ATR period (default: 14)
 * @returns {Array} - Array of ATR values
 */
export function calcATR(data, period = 14) {
  const atr = [];
  let atrValue = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      atr.push(null);
      continue;
    }

    const trueRange = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    );

    if (i < period) {
      atrValue += trueRange;
      atr.push(null);
    } else if (i === period) {
      atrValue += trueRange;
      atrValue = atrValue / period;
      atr.push(+atrValue.toFixed(2));
    } else {
      atrValue = ((atrValue * (period - 1)) + trueRange) / period;
      atr.push(+atrValue.toFixed(2));
    }
  }

  return atr;
}
