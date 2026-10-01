import { describe, it, expect } from 'vitest';
import { calcATR } from './volatility';

describe('calcATR', () => {
  it('equals the constant bar range once the period is filled', () => {
    const bars = Array.from({ length: 20 }, () => ({ close: 100, high: 101, low: 99 }));

    const atr = calcATR(bars);

    expect(atr[13]).toBeNull();
    expect(atr[14]).toBe(2);
    expect(atr[19]).toBe(2);
  });
});
