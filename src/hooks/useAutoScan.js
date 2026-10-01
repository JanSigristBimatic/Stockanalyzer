import { useState, useCallback, useRef, useMemo } from 'react';
import { analyzeSymbol } from '../services';
import { toAnalysisSummary } from '../utils/analysis';
import { SCAN_CATEGORIES, getSymbolsFromCategories } from '../constants/autoScan';

const HISTORY_SIZE = 100;
// Small delay between symbols to avoid rate limiting
const REQUEST_DELAY_MS = 400;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function analyzeSummary(symbol, period) {
  const response = await analyzeSymbol(symbol, period, '1d');
  return response.error ? null : toAnalysisSummary(symbol, response.analysis, response.meta);
}

/**
 * Hook for automated stock scanning.
 * Scans the selected symbols until one reaches the bullish threshold. Every run has an id;
 * pausing or resetting invalidates the running loop, so a stale loop never writes state and
 * only one scan runs at a time.
 */
export function useAutoScan() {
  const [scanning, setScanning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [scannedCount, setScannedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [foundStock, setFoundStock] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [scanPeriod, setScanPeriod] = useState('6M');
  const [threshold, setThreshold] = useState(90);
  const [selectedCategories, setSelectedCategories] = useState(['sp500']);

  const runIdRef = useRef(0);
  const nextIndexRef = useRef(0);

  const activeSymbols = useMemo(() => getSymbolsFromCategories(selectedCategories), [selectedCategories]);

  /**
   * Starts a scan, continues after a pause or a find, or starts over after a completed scan
   */
  const startScan = useCallback(async () => {
    const runId = ++runIdRef.current;
    const isCurrentRun = () => runId === runIdRef.current;

    if (nextIndexRef.current >= activeSymbols.length) {
      nextIndexRef.current = 0;
      setScannedCount(0);
      setSkippedCount(0);
      setScanHistory([]);
    }
    setScanning(true);
    setPaused(false);
    setFoundStock(null);

    while (nextIndexRef.current < activeSymbols.length) {
      const symbol = activeSymbols[nextIndexRef.current];
      setCurrentSymbol(symbol);

      const result = await analyzeSummary(symbol, scanPeriod);
      // A paused or reset run drops its result; continuing rescans this symbol
      if (!isCurrentRun()) return;
      nextIndexRef.current += 1;

      if (!result) {
        setSkippedCount(prev => prev + 1);
      } else {
        setScannedCount(prev => prev + 1);
        setScanHistory(prev => [result, ...prev].slice(0, HISTORY_SIZE));
        if (result.bullishPercent >= threshold) {
          setFoundStock(result);
          setScanning(false);
          return;
        }
      }

      await sleep(REQUEST_DELAY_MS);
      if (!isCurrentRun()) return;
    }

    setScanning(false);
    setCurrentSymbol('');
  }, [activeSymbols, scanPeriod, threshold]);

  /**
   * Pauses the running scan; it can be continued with startScan
   */
  const pauseScan = useCallback(() => {
    runIdRef.current += 1;
    setScanning(false);
    setPaused(true);
  }, []);

  /**
   * Stops any running scan and clears all progress
   */
  const resetScan = useCallback(() => {
    runIdRef.current += 1;
    nextIndexRef.current = 0;
    setScanning(false);
    setPaused(false);
    setCurrentSymbol('');
    setScannedCount(0);
    setSkippedCount(0);
    setFoundStock(null);
    setScanHistory([]);
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
   * Toggles a category; at least one category stays selected (resets scan)
   */
  const toggleCategory = useCallback((categoryId) => {
    const nextCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    if (nextCategories.length === 0) return;

    setSelectedCategories(nextCategories);
    resetScan();
  }, [selectedCategories, resetScan]);

  /**
   * Selects all categories (resets scan)
   */
  const selectAllCategories = useCallback(() => {
    setSelectedCategories(Object.keys(SCAN_CATEGORIES));
    resetScan();
  }, [resetScan]);

  return {
    scanning,
    paused,
    currentSymbol,
    scannedCount,
    skippedCount,
    foundStock,
    scanHistory,
    scanPeriod,
    threshold,
    selectedCategories,
    totalSymbols: activeSymbols.length,
    progress: Math.round(((scannedCount + skippedCount) / activeSymbols.length) * 100),
    categories: SCAN_CATEGORIES,
    startScan,
    pauseScan,
    resetScan,
    changeScanPeriod,
    changeThreshold,
    toggleCategory,
    selectAllCategories
  };
}
