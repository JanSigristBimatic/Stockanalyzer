/**
 * On-Balance Volume (OBV)
 * @param {Array} data - Array of price data with 'close' and 'volume' properties
 * @returns {Array} - Array of cumulative OBV values
 */
export function calcOBV(data) {
  let obv = 0;

  return data.map((item, idx) => {
    if (idx === 0) return 0;

    if (item.close > data[idx - 1].close) {
      obv += item.volume;
    } else if (item.close < data[idx - 1].close) {
      obv -= item.volume;
    }

    return obv;
  });
}
