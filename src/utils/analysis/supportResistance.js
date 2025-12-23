/**
 * Base tolerance for grouping nearby price levels (2%)
 */
const BASE_PRICE_TOLERANCE = 0.02;

/**
 * Minimum touches required for a valid level (for longer timeframes)
 */
const BASE_MIN_TOUCHES = 2;

/**
 * Maximum levels to return per type
 */
const MAX_LEVELS = 3;

/**
 * Threshold for considering data as "short timeframe"
 */
const SHORT_TIMEFRAME_THRESHOLD = 40;

/**
 * Gets dynamic parameters based on data length
 * @param {number} dataLength - Number of data points
 * @returns {{minTouches: number, priceTolerance: number, pivotWindow: number}}
 */
function getDynamicParams(dataLength) {
  // For short timeframes (< 40 data points), be more lenient
  if (dataLength < SHORT_TIMEFRAME_THRESHOLD) {
    return {
      minTouches: 1, // Accept single-touch pivots for short timeframes
      priceTolerance: 0.03, // Wider tolerance (3%) to group more levels
      pivotWindow: 1 // Smaller window for pivot detection
    };
  }

  // For medium timeframes (40-100 data points)
  if (dataLength < 100) {
    return {
      minTouches: 2,
      priceTolerance: 0.025, // 2.5% tolerance
      pivotWindow: 2
    };
  }

  // For longer timeframes (100+ data points)
  return {
    minTouches: BASE_MIN_TOUCHES,
    priceTolerance: BASE_PRICE_TOLERANCE,
    pivotWindow: 2
  };
}

/**
 * Detects Support and Resistance levels from price data
 * @param {Array} data - Array of price data with 'high', 'low', 'close' properties
 * @returns {{support: Array, resistance: Array}}
 */
export function calcSupportResistance(data) {
  if (!data || data.length < 5) {
    return { support: [], resistance: [] };
  }

  const params = getDynamicParams(data.length);
  const pivots = findPivotPoints(data, params.pivotWindow);

  return {
    support: groupLevels(pivots, 'support', params),
    resistance: groupLevels(pivots, 'resistance', params)
  };
}

/**
 * Finds pivot points (local highs and lows)
 * @param {Array} data - Price data array
 * @param {number} window - Number of bars to look back/forward for pivot detection
 * @returns {Array} - Array of pivot points
 */
function findPivotPoints(data, window = 2) {
  const pivots = [];

  for (let i = window; i < data.length - window; i++) {
    const isHigh = isLocalHigh(data, i, window);
    const isLow = isLocalLow(data, i, window);

    if (isHigh) {
      pivots.push({ type: 'resistance', price: data[i].high, index: i });
    }
    if (isLow) {
      pivots.push({ type: 'support', price: data[i].low, index: i });
    }
  }

  return pivots;
}

/**
 * Checks if a point is a local high
 * @param {Array} data - Price data array
 * @param {number} index - Current index
 * @param {number} window - Number of bars to check on each side
 */
function isLocalHigh(data, index, window = 2) {
  const current = data[index].high;
  for (let i = 1; i <= window; i++) {
    if (current <= data[index - i].high || current <= data[index + i].high) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if a point is a local low
 * @param {Array} data - Price data array
 * @param {number} index - Current index
 * @param {number} window - Number of bars to check on each side
 */
function isLocalLow(data, index, window = 2) {
  const current = data[index].low;
  for (let i = 1; i <= window; i++) {
    if (current >= data[index - i].low || current >= data[index + i].low) {
      return false;
    }
  }
  return true;
}

/**
 * Groups nearby price levels together
 * @param {Array} pivots - Array of pivot points
 * @param {string} type - 'support' or 'resistance'
 * @param {Object} params - Dynamic parameters {minTouches, priceTolerance}
 * @returns {Array} - Grouped and sorted levels
 */
function groupLevels(pivots, type, params) {
  const { minTouches, priceTolerance } = params;
  const filtered = pivots.filter(p => p.type === type);
  const groups = [];

  filtered.forEach(pivot => {
    const existing = groups.find(
      g => Math.abs(g.price - pivot.price) / g.price < priceTolerance
    );

    if (existing) {
      existing.count++;
      existing.price = (existing.price + pivot.price) / 2;
    } else {
      groups.push({ price: pivot.price, count: 1, type });
    }
  });

  return groups
    .filter(g => g.count >= minTouches)
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
