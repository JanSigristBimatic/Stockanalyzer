import { describe, it, expect } from 'vitest';
import { getScanSignals } from './scanSignals';

const DAY = 24 * 60 * 60;
const NOW = 1_790_000_000;
const signalIds = (row) => getScanSignals(row, NOW).map(signal => signal.id);

describe('getScanSignals', () => {
  it('reports a golden or death cross only within the last two weeks', () => {
    expect(signalIds({ maCross: { type: 'golden', timestamp: NOW - 5 * DAY } })).toEqual(['goldenCross']);
    expect(signalIds({ maCross: { type: 'death', timestamp: NOW - 14 * DAY } })).toEqual(['deathCross']);
    expect(signalIds({ maCross: { type: 'golden', timestamp: NOW - 15 * DAY } })).toEqual([]);
  });

  it('reports the RSI zones', () => {
    expect(signalIds({ rsiZone: 'oversold' })).toEqual(['oversold']);
    expect(signalIds({ rsiZone: 'overbought' })).toEqual(['overbought']);
    expect(signalIds({ rsiZone: 'neutral' })).toEqual([]);
  });

  it('reports a volume of at least twice the average', () => {
    expect(signalIds({ volumeRatio: 2 })).toEqual(['volumeSpike']);
    expect(signalIds({ volumeRatio: 1.9 })).toEqual([]);
  });

  it('reports a price within 3% of the 52-week high', () => {
    expect(signalIds({ week52HighDistance: -2.5 })).toEqual(['near52WeekHigh']);
    expect(signalIds({ week52HighDistance: 1.2 })).toEqual(['near52WeekHigh']);
    expect(signalIds({ week52HighDistance: -3.5 })).toEqual([]);
  });

  it('reports nothing for missing values', () => {
    expect(signalIds({ maCross: null, rsiZone: null, volumeRatio: null, week52HighDistance: null })).toEqual([]);
  });
});
