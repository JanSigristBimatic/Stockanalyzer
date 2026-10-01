import { describe, it, expect } from 'vitest';
import { analyzeStock, toAnalysisSummary } from './analyzeStock';

function makeBars(count, { close = (i) => 100 + Math.sin(i / 5) * 5 + i * 0.1, volume = () => 1000 } = {}) {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: i,
    close: close(i),
    high: close(i) + 1,
    low: close(i) - 1,
    volume: volume(i)
  }));
}

describe('analyzeStock', () => {
  it('warms up the indicators on the prefetch bars', () => {
    const { chartData } = analyzeStock(makeBars(120), { prefetchCount: 60 });

    expect(chartData).toHaveLength(60);
    expect(chartData[0].sma50).not.toBeNull();
    expect(chartData[0].rsi).not.toBeNull();
    expect(chartData[0].signal).not.toBeNull();
  });

  it('gives no trend signal while SMA 50 is not available', () => {
    const { indicators, verdict } = analyzeStock(makeBars(30));

    expect(indicators.shortTrend).toBeNull();
    expect(verdict.signals.some(s => s.text.includes('SMA'))).toBe(false);
  });

  it('compares the last completed bar while the session is still running', () => {
    const bars = makeBars(60, { volume: (i) => (i === 59 ? 100 : 1000) });

    expect(analyzeStock(bars, { lastBarComplete: true }).indicators.volumeData.currentVolume).toBe(100);
    expect(analyzeStock(bars, { lastBarComplete: false }).indicators.volumeData.currentVolume).toBe(1000);
  });

  it('detects the OBV direction independently of a negative OBV level', () => {
    const fallingThenRising = (i) => (i < 50 ? 200 - i : 150 + (i - 50));

    const rising = analyzeStock(makeBars(60, { close: fallingThenRising }));
    const falling = analyzeStock(makeBars(60, { close: (i) => 200 - i }));

    expect(rising.indicators.volumeData.obvTrend).toBe('rising');
    expect(falling.indicators.volumeData.obvTrend).toBe('falling');
  });

  it('takes the daily change from the options', () => {
    expect(analyzeStock(makeBars(60), { dailyChangePercent: -0.81 }).indicators.priceChange).toBe(-0.81);
  });
});

describe('toAnalysisSummary', () => {
  it('condenses the analysis into a result row', () => {
    const analysis = analyzeStock(makeBars(120), { prefetchCount: 60, dailyChangePercent: 1.5 });

    const summary = toAnalysisSummary('NESN.SW', analysis, { currency: 'CHF', exchange: 'EBS', priceHint: 2 });

    expect(summary).toMatchObject({
      symbol: 'NESN.SW',
      price: analysis.indicators.lastPrice,
      priceChange: 1.5,
      bullishPercent: analysis.verdict.bullishPercent,
      verdict: analysis.verdict.verdict,
      currency: 'CHF',
      trend: analysis.indicators.shortTrend
    });
  });
});
