/**
 * Average Directional Index (ADX)
 * Measures trend strength regardless of direction
 * @param {Array} data - Array of price data with 'high', 'low', 'close' properties
 * @param {number} period - ADX period (default: 14)
 * @returns {{adx: Array, plusDI: Array, minusDI: Array}}
 */
export function calcADX(data, period = 14) {
  const plusDM = [];
  const minusDM = [];
  const tr = [];
  const plusDI = [];
  const minusDI = [];
  const dx = [];
  const adx = [];

  // Calculate directional movements and true range
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      plusDM.push(0);
      minusDM.push(0);
      tr.push(0);
      continue;
    }

    const highDiff = data[i].high - data[i - 1].high;
    const lowDiff = data[i - 1].low - data[i].low;

    plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
    minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);

    tr.push(Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    ));
  }

  // Smooth and calculate DI and ADX
  let smoothPlusDM = 0;
  let smoothMinusDM = 0;
  let smoothTR = 0;

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      smoothPlusDM += plusDM[i];
      smoothMinusDM += minusDM[i];
      smoothTR += tr[i];
      plusDI.push(null);
      minusDI.push(null);
      dx.push(null);
      adx.push(null);
    } else {
      smoothPlusDM = (smoothPlusDM - smoothPlusDM / period) + plusDM[i];
      smoothMinusDM = (smoothMinusDM - smoothMinusDM / period) + minusDM[i];
      smoothTR = (smoothTR - smoothTR / period) + tr[i];

      const pdi = smoothTR === 0 ? 0 : (smoothPlusDM / smoothTR) * 100;
      const mdi = smoothTR === 0 ? 0 : (smoothMinusDM / smoothTR) * 100;

      plusDI.push(+pdi.toFixed(2));
      minusDI.push(+mdi.toFixed(2));

      const dxValue = (pdi + mdi) === 0 ? 0 : (Math.abs(pdi - mdi) / (pdi + mdi)) * 100;
      dx.push(+dxValue.toFixed(2));

      if (i < period * 2 - 1) {
        adx.push(null);
      } else if (i === period * 2 - 1) {
        const adxValue = dx.slice(period, period * 2).reduce((s, v) => s + v, 0) / period;
        adx.push(+adxValue.toFixed(2));
      } else {
        const adxValue = (adx[i - 1] * (period - 1) + dx[i]) / period;
        adx.push(+adxValue.toFixed(2));
      }
    }
  }

  return { adx, plusDI, minusDI };
}
