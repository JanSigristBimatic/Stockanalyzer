import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { analyzeSymbolSummary } from '../services';
import { SCAN_CATEGORIES, getSymbolsFromCategories } from '../constants/autoScan';
import { mapWithConcurrency } from '../utils/async';
import { usePersistentSettings } from './usePersistentSettings';

const SETTINGS_KEY = 'stockanalyzer_scan_settings';
const RESULTS_KEY = 'stockanalyzer_last_scan';
const DEFAULT_SETTINGS = { period: '6M', categoryIds: ['sp500'] };
const EMPTY_RESULTS = { rows: [], failedSymbols: [], status: 'idle', startedAt: null, finishedAt: null };
const CONCURRENT_REQUESTS = 4;

const isSameSelection = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);

// Results of the last paused or finished scan, if they belong to the current settings
function loadResults({ period, categoryIds }) {
  try {
    const stored = JSON.parse(localStorage.getItem(RESULTS_KEY));
    if (!stored || stored.period !== period || !isSameSelection(stored.categoryIds, categoryIds)) return EMPTY_RESULTS;
    const { rows, failedSymbols, status, startedAt, finishedAt } = stored;
    return { rows, failedSymbols, status, startedAt, finishedAt };
  } catch (e) {
    console.error('Failed to load scan results:', e);
    return EMPTY_RESULTS;
  }
}

function removeStoredResults() {
  try {
    localStorage.removeItem(RESULTS_KEY);
  } catch (e) {
    console.error('Failed to remove scan results:', e);
  }
}

/**
 * Scans all symbols of the selected categories and collects one summary row per symbol.
 * Every run has an id; pausing, resetting or changing the settings invalidates the running
 * run, so a stale run never writes state and only one scan runs at a time. Settings and the
 * results of a paused or finished scan survive a reload.
 * @param {Array<{symbol: string}>} watchlist - Offered as an additional category
 */
export function useAutoScan(watchlist) {
  const [settings, setSettings] = usePersistentSettings(SETTINGS_KEY, DEFAULT_SETTINGS);
  const [results, setResults] = useState(() => loadResults(settings));
  const [currentSymbol, setCurrentSymbol] = useState('');
  const runIdRef = useRef(0);

  const categories = useMemo(() => (watchlist.length === 0 ? SCAN_CATEGORIES : {
    ...SCAN_CATEGORIES,
    watchlist: { label: 'Watchlist', description: 'Deine Watchlist', symbols: watchlist.map(item => item.symbol) }
  }), [watchlist]);
  const activeSymbols = useMemo(
    () => getSymbolsFromCategories(categories, settings.categoryIds),
    [categories, settings.categoryIds]
  );

  useEffect(() => {
    if (results.status !== 'paused' && results.status !== 'done') return;
    try {
      localStorage.setItem(RESULTS_KEY, JSON.stringify({ ...settings, ...results }));
    } catch (e) {
      console.error('Failed to save scan results:', e);
    }
  }, [settings, results]);

  const runScan = useCallback(async (symbols) => {
    const runId = ++runIdRef.current;
    const isCurrentRun = () => runId === runIdRef.current;
    setResults(prev => ({ ...prev, status: 'scanning' }));

    await mapWithConcurrency(symbols, CONCURRENT_REQUESTS, async (symbol) => {
      if (!isCurrentRun()) return;
      setCurrentSymbol(symbol);
      const row = await analyzeSymbolSummary(symbol, settings.period);
      // A paused or reset run drops its result; continuing rescans this symbol
      if (!isCurrentRun()) return;
      setResults(prev => (row
        ? { ...prev, rows: [...prev.rows, row] }
        : { ...prev, failedSymbols: [...prev.failedSymbols, symbol] }));
    });

    if (!isCurrentRun()) return;
    setCurrentSymbol('');
    setResults(prev => ({ ...prev, status: 'done', finishedAt: Date.now() }));
  }, [settings.period]);

  /**
   * Starts a new scan of all selected symbols
   */
  const startScan = useCallback(() => {
    setResults({ ...EMPTY_RESULTS, startedAt: Date.now() });
    runScan(activeSymbols);
  }, [activeSymbols, runScan]);

  /**
   * Continues a paused scan with the symbols that have no result yet
   */
  const resumeScan = useCallback(() => {
    const processed = new Set([...results.rows.map(row => row.symbol), ...results.failedSymbols]);
    runScan(activeSymbols.filter(symbol => !processed.has(symbol)));
  }, [activeSymbols, results, runScan]);

  const pauseScan = useCallback(() => {
    runIdRef.current += 1;
    setCurrentSymbol('');
    setResults(prev => ({ ...prev, status: 'paused', finishedAt: Date.now() }));
  }, []);

  /**
   * Stops a running scan and clears its results, also the stored ones
   */
  const resetScan = useCallback(() => {
    runIdRef.current += 1;
    setCurrentSymbol('');
    setResults(EMPTY_RESULTS);
    removeStoredResults();
  }, []);

  const updateSettings = useCallback((changes) => {
    resetScan();
    setSettings(prev => ({ ...prev, ...changes }));
  }, [resetScan, setSettings]);

  const changePeriod = useCallback((period) => updateSettings({ period }), [updateSettings]);

  /**
   * Toggles a category; at least one category stays selected
   */
  const toggleCategory = useCallback((categoryId) => {
    const { categoryIds } = settings;
    const nextIds = categoryIds.includes(categoryId)
      ? categoryIds.filter(id => id !== categoryId)
      : [...categoryIds, categoryId];
    if (nextIds.length > 0) updateSettings({ categoryIds: nextIds });
  }, [settings, updateSettings]);

  const selectAllCategories = useCallback(
    () => updateSettings({ categoryIds: Object.keys(categories) }),
    [categories, updateSettings]
  );

  const processedCount = results.rows.length + results.failedSymbols.length;

  return {
    ...results,
    currentSymbol,
    period: settings.period,
    categoryIds: settings.categoryIds,
    categories,
    totalSymbols: activeSymbols.length,
    processedCount,
    progress: activeSymbols.length > 0 ? Math.min(100, Math.round((processedCount / activeSymbols.length) * 100)) : 0,
    startScan,
    resumeScan,
    pauseScan,
    resetScan,
    changePeriod,
    toggleCategory,
    selectAllCategories
  };
}
