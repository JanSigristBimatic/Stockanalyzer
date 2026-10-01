/**
 * German labels for Yahoo Finance analyst recommendation keys.
 * Yahoo returns snake_case keys (e.g. strong_buy); camelCase variants are kept for older payloads.
 */
export const RECOMMENDATION_LABELS = {
  strongBuy: 'Stark Kaufen',
  strong_buy: 'Stark Kaufen',
  buy: 'Kaufen',
  hold: 'Halten',
  underperform: 'Untergewichten',
  sell: 'Verkaufen',
  strongSell: 'Stark Verkaufen',
  strong_sell: 'Stark Verkaufen'
};

/**
 * @param {string|null} key - Yahoo recommendation key
 * @returns {string} - German label, the raw key if unknown
 */
export function getRecommendationLabel(key) {
  return RECOMMENDATION_LABELS[key] || key || 'Keine Empfehlung';
}
