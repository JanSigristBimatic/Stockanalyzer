export function formatMarketCap(value) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  return `$${(value / 1e6).toFixed(2)}M`;
}

/**
 * Formats a percentage with sign, e.g. +1.23%; '–' for missing values
 * @param {number|null} value - Percentage value
 * @param {number} [digits=2] - Decimal places
 * @returns {string}
 */
export function formatPercent(value, digits = 2) {
  if (value == null || Number.isNaN(value)) return '–';
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}%`;
}
