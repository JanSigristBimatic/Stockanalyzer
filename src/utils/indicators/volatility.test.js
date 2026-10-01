import { describe, it, expect } from 'vitest';
import { calcATR, calcBollinger } from './volatility';

describe('calcBollinger', () => {
  it('spreads two population standard deviations around the SMA', () => {
    const bars = Array.from({ length: 20 }, (_, i) => ({ close: i + 1 }));

    const bands = calcBollinger(bars);

    expect(bands[18]).toEqual({ upper: null, middle: null, lower: null });
    expect(bands[19].middle).toBeCloseTo(10.5, 6);
    expect(bands[19].upper).toBeCloseTo(22.0326, 4);
    expect(bands[19].lower).toBeCloseTo(-1.0326, 4);
  });
});

describe('calcATR', () => {
  it('equals the constant bar range once the period is filled', () => {
    const bars = Array.from({ length: 20 }, () => ({ close: 100, high: 101, low: 99 }));

    const atr = calcATR(bars);

    expect(atr[13]).toBeNull();
    expect(atr[14]).toBe(2);
    expect(atr[19]).toBe(2);
  });
});
