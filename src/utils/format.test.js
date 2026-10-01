import { describe, it, expect } from 'vitest';
import { formatPrice, formatCompactCurrency, formatPercent, toMainCurrency } from './format';

// ICU versions differ in grouping characters and spaces; compare a normalized form
const normalize = (text) => text.replace(/[\u00a0\u202f]/g, ' ').replace(/[\u2019]/g, "'");

describe('formatPrice', () => {
  it('formats Swiss francs with grouping', () => {
    expect(normalize(formatPrice(1234.5, 'CHF'))).toBe("CHF 1'234.50");
  });

  it('uses the decimals from priceHint', () => {
    expect(normalize(formatPrice(0.9312, 'CHF', 4))).toBe('CHF 0.9312');
  });

  it('converts pence quotes to pounds', () => {
    expect(normalize(formatPrice(1250, 'GBp'))).toBe('£ 12.5000');
  });

  it('shows a dash for missing values and a plain number without currency', () => {
    expect(formatPrice(null, 'CHF')).toBe('–');
    expect(normalize(formatPrice(12.3, null))).toBe('12.30');
  });
});

describe('formatCompactCurrency', () => {
  it('abbreviates large amounts', () => {
    expect(normalize(formatCompactCurrency(191964758016, 'CHF'))).toBe('CHF 191.96 Mrd.');
  });

  it('keeps the sign of negative amounts', () => {
    expect(normalize(formatCompactCurrency(-5e9, 'EUR'))).toContain('-');
  });
});

describe('formatPercent', () => {
  it('adds a sign to positive values', () => {
    expect(formatPercent(1.234)).toBe('+1.23%');
    expect(formatPercent(-0.81)).toBe('-0.81%');
    expect(formatPercent(null)).toBe('–');
  });
});

describe('toMainCurrency', () => {
  it('maps minor units to their main currency', () => {
    expect(toMainCurrency('GBp')).toBe('GBP');
    expect(toMainCurrency('CHF')).toBe('CHF');
  });
});
