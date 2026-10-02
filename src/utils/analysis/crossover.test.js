import { describe, it, expect } from 'vitest';
import { findLastCrossover } from './crossover';

describe('findLastCrossover', () => {
  it('finds an upward cross', () => {
    expect(findLastCrossover([1, 2, 4, 5], [3, 3, 3, 3])).toEqual({ index: 2, direction: 'up' });
  });

  it('finds a downward cross', () => {
    expect(findLastCrossover([5, 4, 2, 1], [3, 3, 3, 3])).toEqual({ index: 2, direction: 'down' });
  });

  it('returns the most recent of several crosses', () => {
    expect(findLastCrossover([1, 4, 2, 1], [3, 3, 3, 3])).toEqual({ index: 2, direction: 'down' });
  });

  it('ignores the warm-up period and returns null without a cross', () => {
    expect(findLastCrossover([null, null, 4, 5], [null, 3, 3, 3])).toBeNull();
  });
});
