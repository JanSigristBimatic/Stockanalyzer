import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchStockData, fetchFundamentalData, fetchCompanyInfo, searchSymbolVariants, searchSymbols } from '../services';
import { calcSMA, calcEMA, calcRSI, calcMACD, calcBollinger, calcOBV, calcATR, calcStochastic, calcADX } from '../utils/indicators';
import { calcFibonacci, calcSupportResistance, generateVerdict } from '../utils/analysis';

export function useStockAnalysis() {
  const [symbol, setSymbol] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const debounceRef = useRef(null);
  const autocompleteRequestRef = useRef(0);
  const [stockData, setStockData] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [fibonacci, setFibonacci] = useState(null);
  const [supportResistance, setSupportResistance] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [dataInfo, setDataInfo] = useState(null);
  const [fundamentalData, setFundamentalData] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [timePeriod, setTimePeriod] = useState('6M');
  const [interval, setInterval] = useState('1d');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const requestId = autocompleteRequestRef.current + 1;
    autocompleteRequestRef.current = requestId;
    if (!inputValue || inputValue.length < 2) {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      setAutocompleteLoading(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setAutocompleteLoading(true);
      try {
        const results = await searchSymbols(inputValue);
        if (autocompleteRequestRef.current !== requestId) return;
        setAutocompleteResults(results);
        setShowAutocomplete(results.length > 0);
      } finally {
        if (autocompleteRequestRef.current === requestId) {
          setAutocompleteLoading(false);
        }
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [inputValue]);

  const hideAutocomplete = useCallback(() => {
    setTimeout(() => setShowAutocomplete(false), 200);
  }, []);

  const getFetchErrorMessage = useCallback((error) => {
    if (!error) return null;
    if (error.type === 'network') {
      return 'Netzwerkfehler beim Laden der Daten. Bitte prüfe Proxy oder Verbindung.';
    }
    if (error.type === 'http') {
      return `Datenquelle antwortet mit Fehler ${error.status}. Bitte später erneut versuchen.`;
    }
    if (error.type === 'parse') {
      return 'Antwort der Datenquelle konnte nicht verarbeitet werden.';
    }
    return 'Daten konnten nicht geladen werden.';
  }, []);

  const processData = useCallback((data, fundamentals = null, prefetchCount = 0) => {
    // Calculate indicators on full data (including prefetch) so SMAs are valid from display start
    const sma20 = calcSMA(data, 20);
    const sma50 = calcSMA(data, 50);
    const rsi = calcRSI(data);
    const macd = calcMACD(data);
    const bollinger = calcBollinger(data);
    const obv = calcOBV(data);
    const atr = calcATR(data);
    const stochastic = calcStochastic(data);
    const adxData = calcADX(data);

    // Enrich full data with indicators
    const fullEnrichedData = data.map((d, i) => ({
      ...d,
      sma20: sma20[i], sma50: sma50[i], rsi: rsi[i],
      macd: macd.macdLine[i], signal: macd.signalLine[i], histogram: macd.histogram[i],
      bbUpper: bollinger[i].upper, bbMiddle: bollinger[i].middle, bbLower: bollinger[i].lower,
      obv: obv[i], atr: atr[i],
      stochK: stochastic.stochK[i], stochD: stochastic.stochD[i],
      adx: adxData.adx[i], plusDI: adxData.plusDI[i], minusDI: adxData.minusDI[i]
    }));

    // Trim prefetch data - only display data from requested period onward
    const enrichedData = fullEnrichedData.slice(prefetchCount);
    const displayData = data.slice(prefetchCount);

    // Calculate Fibonacci and S/R on display data only
    const fib = calcFibonacci(displayData);
    const sr = calcSupportResistance(displayData);

    const lastPrice = displayData[displayData.length - 1].close;
    const prevPrice = displayData[displayData.length - 2].close;
    const lastRSI = rsi[rsi.length - 1];
    const lastBB = bollinger[bollinger.length - 1];

    let bbPosition = 'middle';
    if (lastBB.upper && lastPrice > lastBB.upper - (lastBB.upper - lastBB.middle) * 0.2) bbPosition = 'upper';
    else if (lastBB.lower && lastPrice < lastBB.lower + (lastBB.middle - lastBB.lower) * 0.2) bbPosition = 'lower';

    const indicatorData = {
      lastPrice,
      priceChange: ((lastPrice - prevPrice) / prevPrice * 100).toFixed(2),
      lastRSI,
      shortTrend: sma20[sma20.length - 1] > sma50[sma50.length - 1] ? 'bullish' : 'bearish',
      rsiSignal: lastRSI > 70 ? 'overbought' : lastRSI < 30 ? 'oversold' : 'neutral',
      macdSignal: macd.histogram[macd.histogram.length - 1] > 0 ? 'bullish' : 'bearish',
      sma20: sma20[sma20.length - 1], sma50: sma50[sma50.length - 1], bbPosition,
      lastATR: atr[atr.length - 1],
      lastStochK: stochastic.stochK[stochastic.stochK.length - 1],
      lastStochD: stochastic.stochD[stochastic.stochD.length - 1],
      lastADX: adxData.adx[adxData.adx.length - 1]
    };

    setIndicators(indicatorData);
    setStockData(enrichedData);
    setFibonacci(fib);
    setSupportResistance(sr);
    setVerdict(generateVerdict(indicatorData, fib, sr, lastPrice, fundamentals));
    setLoading(false);
  }, []);

  const analyzeWithData = useCallback(async (sym, result) => {
    setSymbol(sym);
    setDataInfo({ currency: result.currency, exchange: result.exchange });
    const [fundamentals, company] = await Promise.all([
      fetchFundamentalData(sym),
      fetchCompanyInfo(sym)
    ]);
    setFundamentalData(fundamentals);
    setCompanyInfo(company);
    processData(result.data, fundamentals, result.prefetchCount || 0);
  }, [processData]);

  const showNotFoundError = useCallback((sym) => {
    setSymbol(sym);
    setDataInfo(null);
    setStockData(null);
    setIndicators(null);
    setFibonacci(null);
    setSupportResistance(null);
    setVerdict(null);
    setFundamentalData(null);
    setCompanyInfo(null);
    setError(`Symbol "${sym}" konnte nicht gefunden werden. Bitte überprüfe das Symbol und versuche es erneut.`);
    setLoading(false);
  }, []);

  const selectSuggestion = useCallback(async (selectedSymbol) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setLoading(true);
    setError(null);
    setSymbol(selectedSymbol);
    const result = await fetchStockData(selectedSymbol);
    if (result?.error && result.error.type !== 'symbol') {
      setError(getFetchErrorMessage(result.error));
      setLoading(false);
      return;
    }
    if (result?.data?.length > 20) {
      analyzeWithData(selectedSymbol, result);
    } else {
      showNotFoundError(selectedSymbol);
    }
  }, [analyzeWithData, showNotFoundError, getFetchErrorMessage]);

  const handleSearch = useCallback(async () => {
    if (!inputValue.trim()) return;
    setSearching(true);
    setError(null);
    setSuggestions([]);
    setShowSuggestions(false);
    const upperSymbol = inputValue.toUpperCase();
    const directResult = await fetchStockData(upperSymbol);
    if (directResult?.error && directResult.error.type !== 'symbol') {
      setSearching(false);
      setError(getFetchErrorMessage(directResult.error));
      return;
    }
    if (directResult?.data?.length > 20) {
      setSearching(false);
      analyzeWithData(upperSymbol, directResult);
    } else {
      const variants = await searchSymbolVariants(inputValue);
      setSearching(false);
      if (variants.length === 1) {
        selectSuggestion(variants[0].symbol);
      } else if (variants.length > 1) {
        setSuggestions(variants);
        setShowSuggestions(true);
      } else {
        showNotFoundError(upperSymbol);
      }
    }
  }, [inputValue, analyzeWithData, showNotFoundError, selectSuggestion]);

  const selectAutocomplete = useCallback(async (selected) => {
    const sym = selected.symbol;
    setInputValue(sym);
    setShowAutocomplete(false);
    setAutocompleteResults([]);
    setSearching(true);
    setError(null);
    setSuggestions([]);
    setShowSuggestions(false);
    const directResult = await fetchStockData(sym);
    if (directResult?.error && directResult.error.type !== 'symbol') {
      setSearching(false);
      setError(getFetchErrorMessage(directResult.error));
      return;
    }
    if (directResult?.data?.length > 20) {
      setSearching(false);
      analyzeWithData(sym, directResult);
    } else {
      const variants = await searchSymbolVariants(sym);
      setSearching(false);
      if (variants.length === 1) {
        selectSuggestion(variants[0].symbol);
      } else if (variants.length > 1) {
        setSuggestions(variants);
        setShowSuggestions(true);
      } else {
        showNotFoundError(sym);
      }
    }
  }, [analyzeWithData, showNotFoundError, selectSuggestion, getFetchErrorMessage]);

  const changePeriod = useCallback(async (newPeriod) => {
    setTimePeriod(newPeriod);
    // Yahoo API limitiert historische Daten basierend auf Intervall:
    // - 15m/1h: nur ~60-730 Tage verfügbar
    // - 1d: bis zu 10+ Jahre verfügbar
    // Daher: Bei längeren Zeiträumen (3M+) immer auf 1d wechseln
    const newInterval = newPeriod === '1M' ? interval : '1d';
    if (newInterval !== interval) setInterval(newInterval);
    if (!symbol) return;
    setLoading(true);
    const result = await fetchStockData(symbol, newPeriod, newInterval);
    if (result?.error) {
      setError(getFetchErrorMessage(result.error));
      setLoading(false);
      return;
    }
    if (result?.data) {
      await analyzeWithData(symbol, result);
    } else {
      setLoading(false);
    }
  }, [symbol, interval, analyzeWithData, getFetchErrorMessage]);

  const changeInterval = useCallback(async (newInterval) => {
    setInterval(newInterval);
    if (!symbol) return;
    setLoading(true);
    const result = await fetchStockData(symbol, timePeriod, newInterval);
    if (result?.error) {
      setError(getFetchErrorMessage(result.error));
      setLoading(false);
      return;
    }
    if (result?.data) {
      await analyzeWithData(symbol, result);
    } else {
      setLoading(false);
    }
  }, [symbol, timePeriod, analyzeWithData, getFetchErrorMessage]);

  return {
    symbol, inputValue, setInputValue, loading, searching, error, suggestions, showSuggestions,
    autocompleteResults, showAutocomplete, autocompleteLoading,
    stockData, indicators, fibonacci, supportResistance, verdict, dataInfo, fundamentalData, companyInfo,
    timePeriod, interval,
    handleSearch, selectSuggestion, selectAutocomplete, hideAutocomplete, changePeriod, changeInterval
  };
}
