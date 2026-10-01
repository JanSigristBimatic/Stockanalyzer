import { describe, it, expect } from 'vitest';
import { generateVerdict } from './verdict';
import { calcFibonacci } from './fibonacci';

const PRICE = 100;
// Price sits on the 50% level, which produces no Fibonacci signal
const NEUTRAL_FIBONACCI = calcFibonacci([{ high: 200, low: 0 }]);
const NO_LEVELS = { support: [], resistance: [] };

const BASE_INDICATORS = {
  lastPrice: PRICE,
  shortTrend: 'bullish',
  lastRSI: 55,
  macdSignal: 'bullish',
  bbPosition: 'middle',
  volumeData: null
};

function verdictFor(indicatorOverrides = {}, { supportResistance = NO_LEVELS, fundamentals = null } = {}) {
  return generateVerdict(
    { ...BASE_INDICATORS, ...indicatorOverrides },
    NEUTRAL_FIBONACCI,
    supportResistance,
    PRICE,
    fundamentals
  );
}

const signalTexts = (verdict) => verdict.signals.map(s => s.text);

describe('generateVerdict: technical signals', () => {
  it('skips the trend signal while SMA 50 is not available', () => {
    const texts = signalTexts(verdictFor({ shortTrend: null }));
    expect(texts.some(t => t.includes('SMA'))).toBe(false);
  });

  it('skips the MACD signal while the signal line is not available', () => {
    const texts = signalTexts(verdictFor({ macdSignal: null }));
    expect(texts.some(t => t.includes('MACD'))).toBe(false);
  });

  it('counts a support level only below the price', () => {
    const above = verdictFor({}, { supportResistance: { support: [{ price: 102 }], resistance: [] } });
    const below = verdictFor({}, { supportResistance: { support: [{ price: 98.5 }], resistance: [] } });

    expect(signalTexts(above).some(t => t.startsWith('Nahe Unterstützung'))).toBe(false);
    expect(signalTexts(below).some(t => t.startsWith('Nahe Unterstützung'))).toBe(true);
  });

  it('counts a resistance level only above the price', () => {
    const below = verdictFor({}, { supportResistance: { support: [], resistance: [{ price: 98 }] } });
    const above = verdictFor({}, { supportResistance: { support: [], resistance: [{ price: 101 }] } });

    expect(signalTexts(below).some(t => t.startsWith('Nahe Widerstand'))).toBe(false);
    expect(signalTexts(above).some(t => t.startsWith('Nahe Widerstand'))).toBe(true);
  });
});

describe('generateVerdict: volume signals', () => {
  const volumeSignals = (verdict) => verdict.signals.filter(s => /Volumen|OBV/.test(s.text));

  it('rates a falling price on falling OBV as bearish', () => {
    const verdict = verdictFor({
      volumeData: { currentVolume: 100, avgVolume: 100, obvTrend: 'falling', priceDirection: 'down' }
    });

    const signals = volumeSignals(verdict);
    expect(signals.map(s => s.text)).toContain('Volumen bestätigt Abwärtsbewegung');
    expect(signals.every(s => s.type === 'bearish')).toBe(true);
  });

  it('adds no confirmation or divergence signal for a neutral OBV', () => {
    const verdict = verdictFor({
      volumeData: { currentVolume: 100, avgVolume: 100, obvTrend: 'neutral', priceDirection: 'up' }
    });

    expect(volumeSignals(verdict)).toEqual([]);
  });

  it('reports the volume excess relative to the average', () => {
    const verdict = verdictFor({
      volumeData: { currentVolume: 160, avgVolume: 100, obvTrend: 'neutral', priceDirection: 'up' }
    });

    expect(signalTexts(verdict)).toContain('Volumen 60% über Durchschnitt (starker Kaufdruck)');
  });
});

describe('generateVerdict: fundamental signals', () => {
  it('treats fundamentals without any values like missing fundamentals', () => {
    // Bullish 5 vs bearish 1: strong bullish only without the stricter fundamental thresholds
    const overrides = { bbPosition: 'upper' };
    const emptyFundamentals = { peRatio: null, pegRatio: null, returnOnEquity: null, debtToEquity: null };

    const withoutData = verdictFor(overrides);
    const withEmptyData = verdictFor(overrides, { fundamentals: emptyFundamentals });

    expect(withoutData.verdict).toBe('STARK BULLISH');
    expect(withEmptyData.verdict).toBe(withoutData.verdict);
    expect(withEmptyData.recommendation).toBe(withoutData.recommendation);
  });

  it('rates a debt-to-equity ratio below 1 as healthy', () => {
    const verdict = verdictFor({}, { fundamentals: { debtToEquity: 0.78445 } });
    expect(signalTexts(verdict)).toContain('Verschuldungsgrad 0.78 - Gesund (< 1)');
  });

  it('translates snake_case analyst recommendation keys', () => {
    const verdict = verdictFor({}, { fundamentals: { targetMeanPrice: 130, recommendationKey: 'strong_buy' } });
    expect(signalTexts(verdict)).toContain('Analysten: Stark Kaufen (30% Kurspotential)');
  });
});
