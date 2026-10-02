import { useState, useEffect } from 'react';
import { fetchExchangeRate } from '../services';

/**
 * Loads the exchange rate between two main currencies
 * @returns {{rate: number|null, loading: boolean}} - rate is null while loading or when unavailable
 */
export function useExchangeRate(fromCurrency, toCurrency) {
  const pair = `${fromCurrency}${toCurrency}`;
  const isSameCurrency = fromCurrency === toCurrency;
  const [loaded, setLoaded] = useState({ pair: null, rate: null });

  useEffect(() => {
    if (isSameCurrency) return undefined;
    let isCancelled = false;
    fetchExchangeRate(fromCurrency, toCurrency).then(rate => {
      if (!isCancelled) setLoaded({ pair, rate });
    });
    return () => { isCancelled = true; };
  }, [fromCurrency, toCurrency, pair, isSameCurrency]);

  if (isSameCurrency) return { rate: 1, loading: false };
  return loaded.pair === pair ? { rate: loaded.rate, loading: false } : { rate: null, loading: true };
}
