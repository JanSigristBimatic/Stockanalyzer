/**
 * Fibonacci retracement ratios
 */
const FIBONACCI_LEVELS = [
  { level: 0, label: '0% (Hoch)' },
  { level: 0.236, label: '23.6%' },
  { level: 0.382, label: '38.2%' },
  { level: 0.5, label: '50%' },
  { level: 0.618, label: '61.8%' },
  { level: 0.786, label: '78.6%' },
  { level: 1, label: '100% (Tief)' }
];

/**
 * Calculates Fibonacci Retracement Levels
 * @param {Array} data - Array of price data with 'high' and 'low' properties
 * @returns {{high: number, low: number, levels: Array}}
 */
export function calcFibonacci(data) {
  const recentData = data.slice(-60);
  const high = Math.max(...recentData.map(d => d.high));
  const low = Math.min(...recentData.map(d => d.low));
  const diff = high - low;

  const levels = FIBONACCI_LEVELS.map(({ level, label }) => ({
    level,
    price: +(high - diff * level).toFixed(2),
    label
  }));

  return { high, low, levels };
}

/**
 * Finds the nearest Fibonacci level to a given price
 * @param {Array} levels - Fibonacci levels array
 * @param {number} price - Current price
 * @returns {Object} - Nearest Fibonacci level
 */
export function findNearestFibLevel(levels, price) {
  return levels.reduce((prev, curr) =>
    Math.abs(curr.price - price) < Math.abs(prev.price - price) ? curr : prev
  );
}
