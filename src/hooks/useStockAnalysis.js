import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchStockData, fetchFundamentalData, fetchCompanyInfo, searchSymbolVariants, searchSymbols } from '../services';
import { calcSMA, calcEMA, calcRSI, calcMACD, calcBollinger, calcOBV, calcATR, calcStochastic, calcADX } from '../utils/indicators';
import { calcFibonacci, calcSupportResistance, generateVerdict } from '../utils/analysis';

/**
 * Custom hook for stock analysis functionality
 * Manages all state and logic for fetching and analyzing stock data
 */
export function useStockAnalysis() {
  // Search state
  const [symbol, setSymbol] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Autocomplete state
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const debounceRef = useRef(null);

  // Data state
  const [stockData, setStockData] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [fibonacci, setFibonacci] = useState(null);
  const [supportResistance, setSupportResistance] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [dataInfo, setDataInfo] = useState(null);
  const [fundamentalData, setFundamentalData] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  // Settings state
  const [timePeriod, setTimePeriod] = useState('6M');
  const [interval, setInterval] = useState('1d');

  /**
   * Debounced autocomplete search - triggers when user types
   */
  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't search if input is too short or empty
    if (!inputValue || inputValue.length < 2) {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      return;
    }

    // Debounce the search by 300ms
    debounceRef.current = setTimeout(async () => {
      setAutocompleteLoading(true);
      const results = await searchSymbols(inputValue);
      setAutocompleteResults(results);
      setShowAutocomplete(results.length > 0);
      setAutocompleteLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue]);

  /**
   * Selects an autocomplete result and triggers search
   */
  const selectAutocomplete = useCallback(async (selected) => {
    const sym = selected.symbol;
    setInputValue(sym);
    setShowAutocomplete(false);
    setAutocompleteResults([]);

    // Directly trigger search with the selected symbol
    setSearching(true);
    setError(null);
    setSuggestions([]);
    setShowSuggestions(false);

    const directResult = await fetchStockData(sym);

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
  }, [analyzeWithData, showNotFoundError]);

  /**
   * Hides autocomplete dropdown
   */
  const hideAutocomplete = useCallback(() => {
    // Small delay to allow click to register
    setTimeout(() => setShowAutocomplete(false), 200);
  }, []);

  /**
   * Processes raw stock data and calculates all indicators
   * @param {Array} data - Raw stock price data
   * @param {Object} fundamentals - Fundamental data for combined verdict (optional)
   */
  const processData = useCallback((data, fundamentals = null) => {
    // Calculate all technical indicators
    const sma20 = calcSMA(data, 20);
    const sma50 = calcSMA(data, 50);
    const rsi = calcRSI(data);
    const macd = calcMACD(data);
    const bollinger = calcBollinger(data);
    const obv = calcOBV(data);
    const atr = calcATR(data);
    const stochastic = calcStochastic(data);
    const adxData = calcADX(data);
    const fib = calcFibonacci(data);
    const sr = calcSupportResistance(data);

    // Enrich data with all indicators
    const enrichedData = data.map((d, i) => ({
      ...d,
      sma20: sma20[i],
      sma50: sma50[i],
      rsi: rsi[i],
      macd: macd.macdLine[i],
      signal: macd.signalLine[i],
      histogram: macd.histogram[i],
      bbUpper: bollinger[i].upper,
      bbMiddle: bollinger[i].middle,
      bbLower: bollinger[i].lower,
      obv: obv[i],
      atr: atr[i],
      stochK: stochastic.stochK[i],
      stochD: stochastic.stochD[i],
      adx: adxData.adx[i],
      plusDI: adxData.plusDI[i],
      minusDI: adxData.minusDI[i]
    }));

    // Calculate current indicator values
    const lastPrice = data[data.length - 1].close;
    const prevPrice = data[data.length - 2].close;
    const lastRSI = rsi[rsi.length - 1];
    const lastBB = bollinger[bollinger.length - 1];

    // Determine Bollinger Band position
    let bbPosition = 'middle';
    if (lastBB.upper && lastPrice > lastBB.upper - (lastBB.upper - lastBB.middle) * 0.2) {
      bbPosition = 'upper';
    } else if (lastBB.lower && lastPrice < lastBB.lower + (lastBB.middle - lastBB.lower) * 0.2) {
      bbPosition = 'lower';
    }

    const indicatorData = {
      lastPrice,
      priceChange: ((lastPrice - prevPrice) / prevPrice * 100).toFixed(2),
      lastRSI,
      shortTrend: sma20[sma20.length - 1] > sma50[sma50.length - 1] ? 'bullish' : 'bearish',
      rsiSignal: lastRSI > 70 ? 'overbought' : lastRSI < 30 ? 'oversold' : 'neutral',
      macdSignal: macd.histogram[macd.histogram.length - 1] > 0 ? 'bullish' : 'bearish',
      sma20: sma20[sma20.length - 1],
      sma50: sma50[sma50.length - 1],
      bbPosition,
      lastATR: atr[atr.length - 1],
      lastStochK: stochastic.stochK[stochastic.stochK.length - 1],
      lastStochD: stochastic.stochD[stochastic.stochD.length - 1],
      lastADX: adxData.adx[adxData.adx.length - 1]
    };

    // Update all state
    setIndicators(indicatorData);
    setStockData(enrichedData);
    setFibonacci(fib);
    setSupportResistance(sr);
    // Generate verdict with combined technical and fundamental analysis
    setVerdict(generateVerdict(indicatorData, fib, sr, lastPrice, fundamentals));
    setLoading(false);
  }, []);

  /**
   * Analyzes stock with fetched data
   */
  const analyzeWithData = useCallback(async (sym, result) => {
    setSymbol(sym);
    setDataInfo({ currency: result.currency, exchange: result.exchange });

    // Fetch additional data in parallel
    const [fundamentals, company] = await Promise.all([
      fetchFundamentalData(sym),
      fetchCompanyInfo(sym)
    ]);
    setFundamentalData(fundamentals);
    setCompanyInfo(company);

    // Process data with fundamentals for combined verdict
    processData(result.data, fundamentals);
  }, [processData]);

  /**
   * Shows error when symbol not found
   */
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

  /**
   * Handles search for stock symbol
   */
  const handleSearch = useCallback(async () => {
    if (!inputValue.trim()) return;

    setSearching(true);
    setError(null);
    setSuggestions([]);
    setShowSuggestions(false);

    const upperSymbol = inputValue.toUpperCase();
    const directResult = await fetchStockData(upperSymbol);

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
  }, [inputValue, analyzeWithData, showNotFoundError]);

  /**
   * Selects a suggestion and analyzes it
   */
  const selectSuggestion = useCallback(async (selectedSymbol) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setLoading(true);
    setError(null);
    setSymbol(selectedSymbol);

    const result = await fetchStockData(selectedSymbol);

    if (result?.data?.length > 20) {
      analyzeWithData(selectedSymbol, result);
    } else {
      showNotFoundError(selectedSymbol);
    }
  }, [analyzeWithData, showNotFoundError]);

  /**
   * Changes time period and refetches data
   */
  const changePeriod = useCallback(async (newPeriod) => {
    setTimePeriod(newPeriod);

    // Reset interval to daily for longer periods
    const newInterval = ['1M', '3M'].includes(newPeriod) ? interval : '1d';
    if (newInterval !== interval) setInterval(newInterval);

    if (!symbol) return;

    setLoading(true);
    const result = await fetchStockData(symbol, newPeriod, newInterval);
    if (result?.data) {
      await analyzeWithData(symbol, result);
    } else {
      setLoading(false);
    }
  }, [symbol, interval, analyzeWithData]);

  /**
   * Changes data interval and refetches data
   */
  const changeInterval = useCallback(async (newInterval) => {
    setInterval(newInterval);

    if (!symbol) return;

    setLoading(true);
    const result = await fetchStockData(symbol, timePeriod, newInterval);
    if (result?.data) {
      await analyzeWithData(symbol, result);
    } else {
      setLoading(false);
    }
  }, [symbol, timePeriod, analyzeWithData]);

  return {
    // Search state
    symbol,
    inputValue,
    setInputValue,
    loading,
    searching,
    error,
    suggestions,
    showSuggestions,

    // Autocomplete state
    autocompleteResults,
    showAutocomplete,
    autocompleteLoading,

    // Data state
    stockData,
    indicators,
    fibonacci,
    supportResistance,
    verdict,
    dataInfo,
    fundamentalData,
    companyInfo,

    // Settings
    timePeriod,
    interval,

    // Actions
    handleSearch,
    selectSuggestion,
    selectAutocomplete,
    hideAutocomplete,
    changePeriod,
    changeInterval
  };
}
