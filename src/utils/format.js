const LOCALE = 'de-CH';

// Yahoo quotes some exchanges in minor units, e.g. London in pence (GBp)
const MINOR_UNITS = {
  GBp: { currency: 'GBP', factor: 100, extraDigits: 2 },
  ZAc: { currency: 'ZAR', factor: 100, extraDigits: 2 },
  ILA: { currency: 'ILS', factor: 100, extraDigits: 2 }
};

/**
 * Main currency for a Yahoo currency code (GBp becomes GBP); other codes stay unchanged
 * @param {string|null} currency - Yahoo currency code
 * @returns {string|null}
 */
export function toMainCurrency(currency) {
  return MINOR_UNITS[currency]?.currency ?? currency;
}

/**
 * Formats a quote price in its currency with the decimals Yahoo suggests (priceHint).
 * Minor-unit quotes such as pence are converted to the main currency.
 * @param {number|null} value - Price as quoted by Yahoo
 * @param {string|null} currency - Yahoo currency code of the quote
 * @param {number} [priceHint=2] - Decimal places
 * @returns {string}
 */
export function formatPrice(value, currency, priceHint = 2) {
  if (value == null || Number.isNaN(value)) return '–';

  const minorUnit = MINOR_UNITS[currency];
  const amount = minorUnit ? value / minorUnit.factor : value;
  const digits = priceHint + (minorUnit?.extraDigits ?? 0);

  return new Intl.NumberFormat(LOCALE, {
    ...currencyStyle(toMainCurrency(currency)),
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(amount);
}

/**
 * Formats large amounts compactly, e.g. "CHF 191.96 Mrd."; the value must be in the main currency
 * @param {number|null} value - Amount
 * @param {string|null} currency - Currency code
 * @returns {string}
 */
export function formatCompactCurrency(value, currency) {
  if (value == null || Number.isNaN(value)) return '–';

  return new Intl.NumberFormat(LOCALE, {
    ...currencyStyle(toMainCurrency(currency)),
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(value);
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

function currencyStyle(currency) {
  return currency ? { style: 'currency', currency } : {};
}
