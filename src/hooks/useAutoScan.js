import { useState, useCallback, useRef } from 'react';
import { fetchStockData, fetchFundamentalData } from '../services';
import { calcSMA, calcRSI, calcMACD, calcBollinger, calcATR, calcStochastic, calcADX } from '../utils/indicators';
import { calcFibonacci, calcSupportResistance, generateVerdict } from '../utils/analysis';
import { SCAN_CATEGORIES, getSymbolsFromCategories, getAllSymbols } from '../constants/autoScan';

/**
 * Hook for automated stock scanning
 * Scans through a list of symbols until finding one with bullish percentage >= threshold
 */
export function useAutoScan() {
  const [scanning, setScanning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [scannedCount, setScannedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [foundStock, setFoundStock] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [scanPeriod, setScanPeriod] = useState('6M');
  const [threshold, setThreshold] = useState(90);
  const [selectedCategories, setSelectedCategories] = useState(['sp500']); // Default to S&P 500
  const [activeSymbols, setActiveSymbols] = useState(() => getSymbolsFromCategories(['sp500']));

  const abortRef = useRef(false);
  const indexRef = useRef(0);

  /**
   * Process stock data and calculate indicators
   */
  const processStockData = useCallback((data, fundamentals = null) => {
    const sma20 = calcSMA(data, 20);
    const sma50 = calcSMA(data, 50);
    const rsi = calcRSI(data);
    const macd = calcMACD(data);
    const bollinger = calcBollinger(data);
    const atr = calcATR(data);
    const stochastic = calcStochastic(data);
    const adxData = calcADX(data);
    const fib = calcFibonacci(data);
    const sr = calcSupportResistance(data);

    const lastPrice = data[data.length - 1].close;
    const prevPrice = data[data.length - 2].close;
    const lastRSI = rsi[rsi.length - 1];
    const lastBB = bollinger[bollinger.length - 1];

    let bbPosition = 'middle';
    if (lastBB.upper && lastPrice > lastBB.upper - (lastBB.upper - lastBB.middle) * 0.2) bbPosition = 'upper';
    else if (lastBB.lower && lastPrice < lastBB.lower + (lastBB.middle - lastBB.lower) * 0.2) bbPosition = 'lower';

    const indicators = {
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

    const verdict = generateVerdict(indicators, fib, sr, lastPrice, fundamentals);
    return { indicators, verdict, fib, sr };
  }, []);

  /**
   * Analyze a single symbol
   */
  const analyzeSymbol = useCallback(async (symbol, period) => {
    try {
      const result = await fetchStockData(symbol, period, '1d');
      if (!result?.data?.length || result.data.length < 20) {
        return null;
      }

      const fundamentals = await fetchFundamentalData(symbol);
      const analysis = processStockData(result.data, fundamentals);

      return {
        symbol,
        price: analysis.indicators.lastPrice,
        priceChange: analysis.indicators.priceChange,
        bullishPercent: analysis.verdict.bullishPercent,
        bearishPercent: analysis.verdict.bearishPercent,
        verdict: analysis.verdict.verdict,
        verdictType: analysis.verdict.verdictType,
        currency: result.currency,
        exchange: result.exchange
      };
    } catch (error) {
      console.error(`Error analyzing ${symbol}:`, error);
      return null;
    }
  }, [processStockData]);

  /**
   * Start or continue scanning
   */
  const startScan = useCallback(async () => {
    setScanning(true);
    setPaused(false);
    abortRef.current = false;

    const startIndex = indexRef.current;
    const symbols = activeSymbols;

    for (let i = startIndex; i < symbols.length; i++) {
      if (abortRef.current) {
        setPaused(true);
        setScanning(false);
        return;
      }

      const symbol = symbols[i];
      setCurrentSymbol(symbol);
      setCurrentIndex(i);
      indexRef.current = i;

      const result = await analyzeSymbol(symbol, scanPeriod);

      if (result) {
        setScannedCount(prev => prev + 1);
        setScanHistory(prev => [result, ...prev].slice(0, 100)); // Keep last 100

        if (result.bullishPercent >= threshold) {
          setFoundStock(result);
          setScanning(false);
          indexRef.current = i + 1; // Next position for continue
          return;
        }
      } else {
        setSkippedCount(prev => prev + 1);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    // Finished all symbols
    setScanning(false);
    setCurrentSymbol('');
    indexRef.current = 0;
  }, [analyzeSymbol, scanPeriod, threshold, activeSymbols]);

  /**
   * Pause the current scan
   */
  const pauseScan = useCallback(() => {
    abortRef.current = true;
  }, []);

  /**
   * Continue scanning after a find
   */
  const continueScan = useCallback(() => {
    setFoundStock(null);
    startScan();
  }, [startScan]);

  /**
   * Reset and start fresh
   */
  const resetScan = useCallback(() => {
    abortRef.current = true;
    setScanning(false);
    setPaused(false);
    setCurrentIndex(0);
    setCurrentSymbol('');
    setScannedCount(0);
    setSkippedCount(0);
    setFoundStock(null);
    setScanHistory([]);
    indexRef.current = 0;
  }, []);

  /**
   * Change scan period (resets scan)
   */
  const changeScanPeriod = useCallback((newPeriod) => {
    setScanPeriod(newPeriod);
    resetScan();
  }, [resetScan]);

  /**
   * Change threshold (resets scan)
   */
  const changeThreshold = useCallback((newThreshold) => {
    setThreshold(newThreshold);
    resetScan();
  }, [resetScan]);

  /**
   * Toggle a category selection
   */
  const toggleCategory = useCallback((categoryId) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId];

      // Ensure at least one category is selected
      if (newCategories.length === 0) return prev;

      // Update active symbols
      const newSymbols = getSymbolsFromCategories(newCategories);
      setActiveSymbols(newSymbols);

      return newCategories;
    });
    resetScan();
  }, [resetScan]);

  /**
   * Select all categories
   */
  const selectAllCategories = useCallback(() => {
    const allCategoryIds = Object.keys(SCAN_CATEGORIES);
    setSelectedCategories(allCategoryIds);
    setActiveSymbols(getAllSymbols());
    resetScan();
  }, [resetScan]);

  /**
   * Clear all and select only one category
   */
  const selectOnlyCategory = useCallback((categoryId) => {
    setSelectedCategories([categoryId]);
    setActiveSymbols(getSymbolsFromCategories([categoryId]));
    resetScan();
  }, [resetScan]);

  return {
    // State
    scanning,
    paused,
    currentIndex,
    currentSymbol,
    scannedCount,
    skippedCount,
    foundStock,
    scanHistory,
    scanPeriod,
    threshold,
    selectedCategories,
    totalSymbols: activeSymbols.length,
    progress: Math.round((currentIndex / activeSymbols.length) * 100) || 0,
    categories: SCAN_CATEGORIES,

    // Actions
    startScan,
    pauseScan,
    continueScan,
    resetScan,
    changeScanPeriod,
    changeThreshold,
    toggleCategory,
    selectAllCategories,
    selectOnlyCategory
  };
}
