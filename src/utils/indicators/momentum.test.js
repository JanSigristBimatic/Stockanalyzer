import { describe, it, expect } from 'vitest';
import { calcStochastic } from './momentum';

const constantRangeBars = (closes) => closes.map(close => ({ close, high: 110, low: 90 }));

describe('calcStochastic', () => {
  it('is 100 when the close sits at the period high', () => {
    const { stochK } = calcStochastic(constantRangeBars(Array(14).fill(110)));
    expect(stochK[13]).toBe(100);
  });

  it('is 0 when the close sits at the period low', () => {
    const { stochK } = calcStochastic(constantRangeBars(Array(14).fill(90)));
    expect(stochK[13]).toBe(0);
  });

  it('is 50 when the period has no range', () => {
    const flatBars = Array.from({ length: 14 }, () => ({ close: 100, high: 100, low: 100 }));
    const { stochK } = calcStochastic(flatBars);
    expect(stochK[13]).toBe(50);
  });

  it('smooths %K over three bars for %D', () => {
    const { stochK, stochD } = calcStochastic(constantRangeBars([...Array(13).fill(100), 110, 90, 100]));
    expect(stochK.slice(13)).toEqual([100, 0, 50]);
    expect(stochD[15]).toBe(50);
  });
});
