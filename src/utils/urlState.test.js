import { describe, it, expect } from 'vitest';
import { readUrlState, buildUrlSearch } from './urlState';

describe('readUrlState', () => {
  it('reads symbol, period, interval and tab', () => {
    expect(readUrlState('?s=NESN.SW&p=1M&i=15m&t=charts'))
      .toEqual({ symbol: 'NESN.SW', period: '1M', interval: '15m', tab: 'charts' });
  });

  it('uses the defaults for an empty query', () => {
    expect(readUrlState('')).toEqual({ symbol: null, period: '6M', interval: '1d', tab: 'analyse' });
  });

  it('normalizes the symbol and rejects anything that is not a Yahoo symbol', () => {
    expect(readUrlState('?s=%20aapl%20').symbol).toBe('AAPL');
    expect(readUrlState('?s=%5EGSPC').symbol).toBe('^GSPC');
    expect(readUrlState('?s=EURCHF%3DX').symbol).toBe('EURCHF=X');
    expect(readUrlState('?s=AAPL%3Fmodules%3Dx').symbol).toBeNull();
    expect(readUrlState('?s=../v1').symbol).toBeNull();
  });

  it('falls back to valid combinations of period, interval and tab', () => {
    expect(readUrlState('?p=10Y&t=admin')).toMatchObject({ period: '6M', interval: '1d', tab: 'analyse' });
    expect(readUrlState('?p=5Y&i=15m')).toMatchObject({ period: '5Y', interval: '1wk' });
    expect(readUrlState('?p=__proto__')).toMatchObject({ period: '6M' });
  });
});

describe('buildUrlSearch', () => {
  it('leaves out default values', () => {
    expect(buildUrlSearch({ symbol: 'AAPL', period: '6M', interval: '1d', tab: 'analyse' })).toBe('?s=AAPL');
    expect(buildUrlSearch({ symbol: null, period: '6M', interval: '1d', tab: 'analyse' })).toBe('');
    expect(buildUrlSearch({ symbol: 'VOD.L', period: '5Y', interval: '1wk', tab: 'analyse' })).toBe('?s=VOD.L&p=5Y');
  });

  it('round-trips through readUrlState', () => {
    const state = { symbol: 'EURCHF=X', period: '1M', interval: '1h', tab: 'kennzahlen' };
    expect(readUrlState(buildUrlSearch(state))).toEqual(state);
  });
});
