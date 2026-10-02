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
 * Size of one quote unit in the main currency, e.g. 0.01 for prices quoted in pence (GBp)
 * @param {string|null} currency - Yahoo currency code
 * @returns {number}
 */
export function mainCurrencyPerQuoteUnit(currency) {
  return 1 / (MINOR_UNITS[currency]?.factor ?? 1);
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
 * Creates a formatter for quote values without the currency, e.g. for chart axes that format
 * many values per frame. Minor-unit quotes such as pence are converted like in formatPrice.
 * @param {string|null} currency - Yahoo currency code of the quote
 * @param {number} [priceHint=2] - Decimal places
 * @returns {function(number): string}
 */
export function createQuoteFormatter(currency, priceHint = 2) {
  const minorUnit = MINOR_UNITS[currency];
  const digits = priceHint + (minorUnit?.extraDigits ?? 0);
  const numberFormat = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return (value) => numberFormat.format(minorUnit ? value / minorUnit.factor : value);
}

const compactNumberFormat = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });

/**
 * Formats large plain numbers compactly, e.g. a volume of 3247178 as "3.2 Mio."
 * @param {number} value
 * @returns {string}
 */
export function formatCompactNumber(value) {
  return compactNumberFormat.format(value);
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

/**
 * Formats a unix timestamp as a Swiss date, e.g. 29.10.2026
 * @param {number} timestamp - Unix seconds
 * @returns {string}
 */
export function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const relativeTimeFormat = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
const RELATIVE_TIME_UNITS = [
  { unit: 'day', seconds: 24 * 60 * 60 },
  { unit: 'hour', seconds: 60 * 60 },
  { unit: 'minute', seconds: 60 }
];

/**
 * Formats a day offset from today, e.g. "heute", "morgen" or "in 27 Tagen"
 * @param {number} days - Calendar days from today
 * @returns {string}
 */
export function formatDaysFromToday(days) {
  return relativeTimeFormat.format(days, 'day');
}

/**
 * Formats a past point in time relative to now, e.g. "vor 3 Stunden" or "gestern"
 * @param {number} timestamp - Unix seconds
 * @param {number} [nowSeconds]
 * @returns {string}
 */
export function formatTimeAgo(timestamp, nowSeconds = Date.now() / 1000) {
  const elapsed = Math.max(0, nowSeconds - timestamp);
  const { unit, seconds } = RELATIVE_TIME_UNITS.find(({ seconds }) => elapsed >= seconds) ?? RELATIVE_TIME_UNITS.at(-1);
  return relativeTimeFormat.format(-Math.round(elapsed / seconds), unit);
}

function currencyStyle(currency) {
  return currency ? { style: 'currency', currency } : {};
}
