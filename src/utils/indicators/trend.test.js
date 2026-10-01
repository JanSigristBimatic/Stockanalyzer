import { describe, it, expect } from 'vitest';
import { calcADX } from './trend';

describe('calcADX', () => {
  it('reports a full-strength uptrend for steadily rising bars', () => {
    const bars = Array.from({ length: 40 }, (_, i) => ({ close: i, high: i + 1, low: i - 1 }));

    const { adx, plusDI, minusDI } = calcADX(bars);

    expect(plusDI[14]).toBeCloseTo(50, 6);
    expect(minusDI[14]).toBe(0);
    expect(adx[26]).toBeNull();
    expect(adx[27]).toBeCloseTo(100, 6);
    expect(adx[39]).toBeCloseTo(100, 6);
  });
});
