import { describe, it, expect } from 'vitest';
import { calcRSI, calcStochastic } from './momentum';

const toBars = (closes) => closes.map(close => ({ close }));
const constantRangeBars = (closes) => closes.map(close => ({ close, high: 110, low: 90 }));

// StockCharts RSI example (14 periods); published values are rounded to two decimals
const STOCKCHARTS_RSI_CLOSES = [
  44.3389, 44.0902, 44.1497, 43.6124, 44.3278, 44.8264, 45.0955, 45.4245, 45.8433, 46.0826,
  45.8931, 46.0328, 45.6140, 46.2820, 46.2820, 46.0028, 46.0328, 46.4116, 46.2222, 45.6439,
  46.2122, 46.2521, 45.7137, 46.4515, 45.7835, 45.3548, 44.0288, 44.1783, 44.2181, 44.5672,
  43.4205, 42.6628, 43.1314
];

describe('calcRSI', () => {
  it('matches the StockCharts reference values', () => {
    const rsi = calcRSI(toBars(STOCKCHARTS_RSI_CLOSES));

    expect(rsi[13]).toBeNull();
    expect(rsi[14]).toBeCloseTo(70.53, 2);
    expect(rsi[15]).toBeCloseTo(66.32, 2);
    expect(rsi[24]).toBeCloseTo(54.71, 2);
    expect(rsi[32]).toBeCloseTo(37.77, 2);
  });

  it('is 50 for a flat series', () => {
    expect(calcRSI(toBars(Array(20).fill(10)))[19]).toBe(50);
  });

  it('is 100 for a strictly rising series', () => {
    expect(calcRSI(toBars(Array.from({ length: 20 }, (_, i) => 10 + i)))[19]).toBe(100);
  });
});

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
