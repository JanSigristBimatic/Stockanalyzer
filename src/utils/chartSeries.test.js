import { describe, it, expect } from 'vitest';
import { toCandles, toLinePoints, toColoredBars } from './chartSeries';

const chartData = [
  { timestamp: 100, open: 10, high: 12, low: 9, close: 11, volume: 500, sma20: null, macd: -0.5 },
  { timestamp: 200, open: null, high: 13, low: 10, close: 12, volume: 700, sma20: 11.5, macd: 0.25 }
];

describe('toCandles', () => {
  it('maps bars to candles and draws a missing open at the close', () => {
    expect(toCandles(chartData)).toEqual([
      { time: 100, open: 10, high: 12, low: 9, close: 11 },
      { time: 200, open: 12, high: 13, low: 10, close: 12 }
    ]);
  });
});

describe('toLinePoints', () => {
  it('leaves out bars without a value', () => {
    expect(toLinePoints(chartData, 'sma20')).toEqual([{ time: 200, value: 11.5 }]);
  });
});

describe('toColoredBars', () => {
  it('colors each bar by the given rule', () => {
    const colorOf = (bar) => (bar.macd >= 0 ? 'green' : 'red');
    expect(toColoredBars(chartData, 'macd', colorOf)).toEqual([
      { time: 100, value: -0.5, color: 'red' },
      { time: 200, value: 0.25, color: 'green' }
    ]);
  });
});
