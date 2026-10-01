import { describe, it, expect } from 'vitest';
import { calcFibonacci, findNearestFibLevel } from './fibonacci';

describe('calcFibonacci', () => {
  it('places the retracement levels between the high and the low', () => {
    const bars = [
      { high: 150, low: 100 },
      { high: 200, low: 160 },
      { high: 180, low: 140 }
    ];

    const { high, low, levels } = calcFibonacci(bars);

    expect(high).toBe(200);
    expect(low).toBe(100);
    [200, 176.4, 161.8, 150, 138.2, 121.4, 100].forEach((price, i) => {
      expect(levels[i].price).toBeCloseTo(price, 6);
    });
  });
});

describe('findNearestFibLevel', () => {
  it('returns the level closest to the price', () => {
    const { levels } = calcFibonacci([{ high: 200, low: 100 }]);

    expect(findNearestFibLevel(levels, 152).label).toBe('50%');
  });
});
