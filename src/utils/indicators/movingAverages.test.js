import { describe, it, expect } from 'vitest';
import { calcSMA } from './movingAverages';

const toBars = (closes) => closes.map(close => ({ close }));

describe('calcSMA', () => {
  it('averages the last n closes and is null before the period is filled', () => {
    expect(calcSMA(toBars([1, 2, 3, 4]), 3)).toEqual([null, null, 2, 3]);
  });
});
