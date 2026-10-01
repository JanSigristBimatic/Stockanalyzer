import { describe, it, expect } from 'vitest';
import { calcOBV } from './volume';

describe('calcOBV', () => {
  it('adds volume on up closes, subtracts on down closes and keeps it on unchanged closes', () => {
    const bars = [
      { close: 10, volume: 100 },
      { close: 11, volume: 200 },
      { close: 10, volume: 300 },
      { close: 10, volume: 400 }
    ];

    expect(calcOBV(bars)).toEqual([0, 200, -100, -100]);
  });
});
