/**
 * Tolerance for grouping nearby price levels (2%)
 */
const PRICE_TOLERANCE = 0.02;

/**
 * Minimum touches required for a valid level
 */
const MIN_TOUCHES = 2;

/**
 * Maximum levels to return per type
 */
const MAX_LEVELS = 3;

/**
 * Detects Support and Resistance levels from price data
 * @param {Array} data - Array of price data with 'high', 'low', 'close' properties
 * @returns {{support: Array, resistance: Array}}
 */
export function calcSupportResistance(data) {
  const pivots = findPivotPoints(data);

  return {
    support: groupLevels(pivots, 'support'),
    resistance: groupLevels(pivots, 'resistance')
  };
}

/**
 * Finds pivot points (local highs and lows)
 * @param {Array} data - Price data array
 * @returns {Array} - Array of pivot points
 */
function findPivotPoints(data) {
  const pivots = [];

  for (let i = 2; i < data.length - 2; i++) {
    const isHigh = isLocalHigh(data, i);
    const isLow = isLocalLow(data, i);

    if (isHigh) {
      pivots.push({ type: 'resistance', price: data[i].high });
    }
    if (isLow) {
      pivots.push({ type: 'support', price: data[i].low });
    }
  }

  return pivots;
}

/**
 * Checks if a point is a local high
 */
function isLocalHigh(data, index) {
  const current = data[index].high;
  return (
    current > data[index - 1].high &&
    current > data[index - 2].high &&
    current > data[index + 1].high &&
    current > data[index + 2].high
  );
}

/**
 * Checks if a point is a local low
 */
function isLocalLow(data, index) {
  const current = data[index].low;
  return (
    current < data[index - 1].low &&
    current < data[index - 2].low &&
    current < data[index + 1].low &&
    current < data[index + 2].low
  );
}

/**
 * Groups nearby price levels together
 * @param {Array} pivots - Array of pivot points
 * @param {string} type - 'support' or 'resistance'
 * @returns {Array} - Grouped and sorted levels
 */
function groupLevels(pivots, type) {
  const filtered = pivots.filter(p => p.type === type);
  const groups = [];

  filtered.forEach(pivot => {
    const existing = groups.find(
      g => Math.abs(g.price - pivot.price) / g.price < PRICE_TOLERANCE
    );

    if (existing) {
      existing.count++;
      existing.price = (existing.price + pivot.price) / 2;
    } else {
      groups.push({ price: pivot.price, count: 1, type });
    }
  });

  return groups
    .filter(g => g.count >= MIN_TOUCHES)
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_LEVELS);
}

/**
 * Checks if current price is near a support/resistance level
 * @param {Array} levels - Support or resistance levels
 * @param {number} price - Current price
 * @param {number} threshold - Proximity threshold (default: 3%)
 * @returns {Object|null} - Nearby level or null
 */
export function findNearbyLevel(levels, price, threshold = 0.03) {
  return levels.find(level => Math.abs(level.price - price) / price < threshold) || null;
}
