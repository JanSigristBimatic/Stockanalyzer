import { describe, it, expect } from 'vitest';
import { calcSMA, calcEMA, calcEMAFromValues } from './movingAverages';

const toBars = (closes) => closes.map(close => ({ close }));

// StockCharts EMA example (10 periods); published values are rounded to two decimals
const STOCKCHARTS_EMA_CLOSES = [
  22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29,
  22.15, 22.39, 22.38, 22.61, 23.36, 24.05, 23.75, 23.83, 23.95, 23.63,
  23.82, 23.87, 23.65, 23.19, 23.10, 23.33, 22.68, 23.10, 22.40, 22.17
];

describe('calcSMA', () => {
  it('averages the last n closes and is null before the period is filled', () => {
    expect(calcSMA(toBars([1, 2, 3, 4]), 3)).toEqual([null, null, 2, 3]);
  });

  it('keeps full precision for prices below 1', () => {
    expect(calcSMA(toBars([0.9312, 0.9318, 0.9325]), 3)[2]).toBeCloseTo(0.931833, 6);
  });
});

describe('calcEMA', () => {
  it('is seeded with the SMA and matches the StockCharts reference values', () => {
    const ema = calcEMA(toBars(STOCKCHARTS_EMA_CLOSES), 10);

    expect(ema[8]).toBeNull();
    expect(ema[9]).toBeCloseTo(22.22, 2);
    expect(ema[19]).toBeCloseTo(23.34, 2);
    expect(ema[28]).toBeCloseTo(23.08, 2);
  });

  it('follows prices below 1 instead of freezing at a rounded value', () => {
    const closes = Array.from({ length: 40 }, (_, i) => 0.93 + i * 0.0012);
    const ema = calcEMA(toBars(closes), 10);

    expect(ema[39]).toBeGreaterThan(0.97);
  });
});

describe('calcEMAFromValues', () => {
  it('skips leading nulls before seeding', () => {
    expect(calcEMAFromValues([null, null, 1, 2, 3], 2)).toEqual([null, null, null, 1.5, 2.5]);
  });
});
