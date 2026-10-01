import { calcEMA, calcEMAFromValues } from './movingAverages';

/**
 * Relative Strength Index (RSI) with Wilder smoothing
 * @param {Array} data - Array of price data with 'close' property
 * @param {number} period - RSI period (default: 14)
 * @returns {Array} - Array of RSI values (0-100), null until the period is filled
 */
export function calcRSI(data, period = 14) {
  let avgGain = 0;
  let avgLoss = 0;

  return data.map((bar, i) => {
    if (i === 0) return null;

    const change = bar.close - data[i - 1].close;
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);

    if (i <= period) {
      // Seed with the simple average of the first `period` changes
      avgGain += gain / period;
      avgLoss += loss / period;
      return i === period ? toRSI(avgGain, avgLoss) : null;
    }

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    return toRSI(avgGain, avgLoss);
  });
}

function toRSI(avgGain, avgLoss) {
  if (avgLoss === 0) return avgGain === 0 ? 50 : 100;
  return 100 - 100 / (1 + avgGain / avgLoss);
}

/**
 * Moving Average Convergence Divergence (MACD 12/26/9)
 * @param {Array} data - Array of price data with 'close' property
 * @returns {{macdLine: Array, signalLine: Array, histogram: Array}} - null until each line is warmed up
 */
export function calcMACD(data) {
  const ema12 = calcEMA(data, 12);
  const ema26 = calcEMA(data, 26);

  const macdLine = ema12.map((fast, i) => (fast == null || ema26[i] == null ? null : fast - ema26[i]));
  const signalLine = calcEMAFromValues(macdLine, 9);
  const histogram = macdLine.map((macd, i) => (signalLine[i] == null ? null : macd - signalLine[i]));

  return { macdLine, signalLine, histogram };
}

/**
 * Stochastic Oscillator
 * @param {Array} data - Array of price data with 'high', 'low', 'close' properties
 * @param {number} kPeriod - %K period (default: 14)
 * @param {number} dPeriod - %D period (default: 3)
 * @returns {{stochK: Array, stochD: Array}}
 */
export function calcStochastic(data, kPeriod = 14, dPeriod = 3) {
  const stochK = [];
  const stochD = [];

  for (let i = 0; i < data.length; i++) {
    if (i < kPeriod - 1) {
      stochK.push(null);
      stochD.push(null);
      continue;
    }

    const slice = data.slice(i - kPeriod + 1, i + 1);
    const high = Math.max(...slice.map(d => d.high));
    const low = Math.min(...slice.map(d => d.low));
    const close = data[i].close;

    const k = high === low ? 50 : ((close - low) / (high - low)) * 100;
    stochK.push(k);

    if (i < kPeriod + dPeriod - 2) {
      stochD.push(null);
    } else {
      stochD.push(stochK.slice(-dPeriod).reduce((sum, val) => sum + val, 0) / dPeriod);
    }
  }

  return { stochK, stochD };
}
