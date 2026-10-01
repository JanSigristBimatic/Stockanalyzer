import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchStockData, fetchQuoteSummary, analyzeSymbolSummary } from '../services';
import { mapWithConcurrency } from '../utils/async';

const WATCHLIST_KEY = 'stockanalyzer_watchlist';
const ANALYZE_ALL_PERIOD = '6M';
const MAX_PARALLEL_REQUESTS = 4;
const QUOTES_MAX_AGE_MS = 5 * 60 * 1000;
const WEEK_BARS = 5;

function loadStoredWatchlist() {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load watchlist:', e);
    return [];
  }
}

/**
 * Loads price, daily and weekly change and market cap for one symbol
 * @returns {Promise<Object|null>} - null if the chart could not be loaded
 */
async function loadQuote(symbol) {
  const [chart, quoteSummary] = await Promise.all([
    fetchStockData(symbol, '1M', '1d'),
    fetchQuoteSummary(symbol)
  ]);
  if (chart.error) return null;

  const closes = chart.data.map(bar => bar.close);
  const lastPrice = closes[closes.length - 1];
  const weekAgoPrice = closes[Math.max(0, closes.length - 1 - WEEK_BARS)];

  return {
    price: lastPrice,
    change: quoteSummary?.dailyChangePercent ?? null,
    weekChange: ((lastPrice - weekAgoPrice) / weekAgoPrice) * 100,
    currency: chart.currency,
    priceHint: chart.priceHint,
    marketCap: quoteSummary?.fundamentals.marketCap ?? null
  };
}

/**
 * Custom hook for managing a stock watchlist with localStorage persistence.
 * Quotes are loaded on demand with limited parallelism; a symbol is never loaded twice at once.
 */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(loadStoredWatchlist);
  const [quotes, setQuotes] = useState({});
  const [loadingSymbols, setLoadingSymbols] = useState({});
  const [failedSymbols, setFailedSymbols] = useState({});
  const [lastRefresh, setLastRefresh] = useState(null);
  const inFlightRef = useRef(new Set());

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState({});
  const analyzeRunRef = useRef(0);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist:', e);
    }
  }, [watchlist]);

  /**
   * Adds a symbol to the watchlist
   * @param {string} symbol - Stock symbol to add
   * @param {string} name - Company name (optional)
   */
  const addToWatchlist = useCallback((symbol, name = '') => {
    const upperSymbol = symbol.toUpperCase();
    setWatchlist(prev => {
      if (prev.some(item => item.symbol === upperSymbol)) {
        return prev;
      }
      return [...prev, { symbol: upperSymbol, name, addedAt: new Date().toISOString() }];
    });
  }, []);

  /**
   * Removes a symbol and its quote from the watchlist
   * @param {string} symbol - Stock symbol to remove
   */
  const removeFromWatchlist = useCallback((symbol) => {
    const upperSymbol = symbol.toUpperCase();
    const withoutSymbol = (prev) => {
      const next = { ...prev };
      delete next[upperSymbol];
      return next;
    };
    setWatchlist(prev => prev.filter(item => item.symbol !== upperSymbol));
    setQuotes(withoutSymbol);
    setFailedSymbols(withoutSymbol);
  }, []);

  /**
   * Checks if a symbol is in the watchlist
   * @param {string} symbol - Stock symbol to check
   * @returns {boolean}
   */
  const isInWatchlist = useCallback((symbol) => {
    return watchlist.some(item => item.symbol === symbol.toUpperCase());
  }, [watchlist]);

  /**
   * Loads the quote of one symbol; a failed load keeps the previous quote and flags the symbol
   * @param {string} symbol - Stock symbol
   */
  const refreshSymbol = useCallback(async (symbol) => {
    if (inFlightRef.current.has(symbol)) return;
    inFlightRef.current.add(symbol);
    setLoadingSymbols(prev => ({ ...prev, [symbol]: true }));

    const quote = await loadQuote(symbol);
    if (quote) {
      setQuotes(prev => ({ ...prev, [symbol]: quote }));
    }
    setFailedSymbols(prev => ({ ...prev, [symbol]: !quote }));
    setLoadingSymbols(prev => ({ ...prev, [symbol]: false }));
    inFlightRef.current.delete(symbol);
  }, []);

  const refreshSymbols = useCallback(
    (items) => mapWithConcurrency(items, MAX_PARALLEL_REQUESTS, item => refreshSymbol(item.symbol)),
    [refreshSymbol]
  );

  /**
   * Refreshes the quotes of all symbols in the watchlist
   */
  const refreshAll = useCallback(async () => {
    await refreshSymbols(watchlist);
    setLastRefresh(Date.now());
  }, [watchlist, refreshSymbols]);

  /**
   * Called when the watchlist opens: reloads everything once the quotes are older than five
   * minutes, otherwise only symbols that have never been loaded
   */
  const refreshIfStale = useCallback(() => {
    if (!lastRefresh || Date.now() - lastRefresh > QUOTES_MAX_AGE_MS) {
      refreshAll();
      return;
    }
    refreshSymbols(watchlist.filter(item => !quotes[item.symbol] && !failedSymbols[item.symbol]));
  }, [lastRefresh, watchlist, quotes, failedSymbols, refreshAll, refreshSymbols]);

  /**
   * Moves an item up in the watchlist
   * @param {number} index - Current index of the item
   */
  const moveUp = useCallback((index) => {
    if (index <= 0) return;
    setWatchlist(prev => {
      const newList = [...prev];
      [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
      return newList;
    });
  }, []);

  /**
   * Moves an item down in the watchlist
   * @param {number} index - Current index of the item
   */
  const moveDown = useCallback((index) => {
    setWatchlist(prev => {
      if (index >= prev.length - 1) return prev;
      const newList = [...prev];
      [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      return newList;
    });
  }, []);

  /**
   * Runs the full analysis for all symbols; stopping discards the remaining results
   */
  const analyzeAll = useCallback(async () => {
    if (watchlist.length === 0) return;

    const runId = ++analyzeRunRef.current;
    const isCurrentRun = () => runId === analyzeRunRef.current;
    let completed = 0;

    setAnalyzing(true);
    setAnalyzeProgress(0);
    setAnalysisResults({});

    await mapWithConcurrency(watchlist, MAX_PARALLEL_REQUESTS, async (item) => {
      if (!isCurrentRun()) return;
      const result = await analyzeSymbolSummary(item.symbol, ANALYZE_ALL_PERIOD);
      if (!isCurrentRun()) return;

      completed += 1;
      setAnalyzeProgress(Math.round((completed / watchlist.length) * 100));
      if (result) {
        setAnalysisResults(prev => ({ ...prev, [item.symbol]: result }));
      }
    });

    if (isCurrentRun()) {
      setAnalyzing(false);
    }
  }, [watchlist]);

  /**
   * Stops an ongoing analysis
   */
  const stopAnalyzeAll = useCallback(() => {
    analyzeRunRef.current += 1;
    setAnalyzing(false);
  }, []);

  /**
   * Clears the analysis results
   */
  const clearAnalysisResults = useCallback(() => {
    setAnalysisResults({});
    setAnalyzeProgress(0);
  }, []);

  return {
    watchlist,
    quotes,
    loadingSymbols,
    failedSymbols,
    lastRefresh,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refreshSymbol,
    refreshAll,
    refreshIfStale,
    moveUp,
    moveDown,
    analyzing,
    analyzeProgress,
    analysisResults,
    analyzeAll,
    stopAnalyzeAll,
    clearAnalysisResults
  };
}
