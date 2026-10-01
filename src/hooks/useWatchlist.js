import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchStockData, fetchQuoteSummary, analyzeSymbol } from '../services';
import { toAnalysisSummary } from '../utils/analysis';

const WATCHLIST_KEY = 'stockanalyzer_watchlist';
const ANALYZE_ALL_PERIOD = '6M';

async function analyzeSummary(symbol) {
  const response = await analyzeSymbol(symbol, ANALYZE_ALL_PERIOD, '1d');
  return response.error ? null : toAnalysisSummary(symbol, response.analysis, response.meta);
}

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
 * Custom hook for managing a stock watchlist with localStorage persistence
 * Stores symbols and fetches live price data on demand
 */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(loadStoredWatchlist);
  const [watchlistData, setWatchlistData] = useState({});
  const [loadingSymbols, setLoadingSymbols] = useState({});
  const [lastRefresh, setLastRefresh] = useState(null);

  // Analyze all states
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [currentAnalyzing, setCurrentAnalyzing] = useState('');
  const [analysisResults, setAnalysisResults] = useState({});
  const abortAnalyzeRef = useRef(false);

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
        return prev; // Already exists
      }
      return [...prev, {
        symbol: upperSymbol,
        name,
        addedAt: new Date().toISOString()
      }];
    });
  }, []);

  /**
   * Removes a symbol from the watchlist
   * @param {string} symbol - Stock symbol to remove
   */
  const removeFromWatchlist = useCallback((symbol) => {
    const upperSymbol = symbol.toUpperCase();
    setWatchlist(prev => prev.filter(item => item.symbol !== upperSymbol));
    setWatchlistData(prev => {
      const newData = { ...prev };
      delete newData[upperSymbol];
      return newData;
    });
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
   * Fetches current price data for a single symbol
   * @param {string} symbol - Stock symbol
   */
  const fetchSymbolData = useCallback(async (symbol) => {
    setLoadingSymbols(prev => ({ ...prev, [symbol]: true }));

    try {
      const [priceResult, quoteSummary] = await Promise.all([
        fetchStockData(symbol, '1M', '1d'),
        fetchQuoteSummary(symbol)
      ]);
      const fundamentals = quoteSummary?.fundamentals;

      if (priceResult?.data?.length > 0) {
        const data = priceResult.data;
        const lastPrice = data[data.length - 1].close;
        const prevPrice = data[data.length - 2]?.close || lastPrice;
        const change = ((lastPrice - prevPrice) / prevPrice * 100);

        // Calculate 1-week change if we have enough data
        const weekAgoIndex = Math.max(0, data.length - 6);
        const weekAgoPrice = data[weekAgoIndex].close;
        const weekChange = ((lastPrice - weekAgoPrice) / weekAgoPrice * 100);

        setWatchlistData(prev => ({
          ...prev,
          [symbol]: {
            price: lastPrice,
            change: change.toFixed(2),
            weekChange: weekChange.toFixed(2),
            currency: priceResult.currency,
            exchange: priceResult.exchange,
            marketCap: fundamentals?.marketCap,
            peRatio: fundamentals?.peRatio,
            week52High: fundamentals?.week52High,
            week52Low: fundamentals?.week52Low,
            updatedAt: new Date().toISOString()
          }
        }));
      }
    } catch (e) {
      console.error(`Failed to fetch data for ${symbol}:`, e);
    } finally {
      setLoadingSymbols(prev => ({ ...prev, [symbol]: false }));
    }
  }, []);

  /**
   * Refreshes data for all symbols in watchlist
   */
  const refreshAll = useCallback(async () => {
    const promises = watchlist.map(item => fetchSymbolData(item.symbol));
    await Promise.all(promises);
    setLastRefresh(new Date().toISOString());
  }, [watchlist, fetchSymbolData]);

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
   * Clears entire watchlist
   */
  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
    setWatchlistData({});
  }, []);

  /**
   * Analyzes all symbols in the watchlist
   */
  const analyzeAll = useCallback(async () => {
    if (watchlist.length === 0) return;

    setAnalyzing(true);
    setAnalyzeProgress(0);
    setAnalysisResults({});
    abortAnalyzeRef.current = false;

    const results = {};

    for (let i = 0; i < watchlist.length; i++) {
      if (abortAnalyzeRef.current) {
        setAnalyzing(false);
        return;
      }

      const item = watchlist[i];
      setCurrentAnalyzing(item.symbol);
      setAnalyzeProgress(Math.round(((i + 1) / watchlist.length) * 100));

      const result = await analyzeSummary(item.symbol);
      if (result) {
        results[item.symbol] = result;
        setAnalysisResults(prev => ({ ...prev, [item.symbol]: result }));
      }

      // Small delay to avoid rate limiting
      if (i < watchlist.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }

    setAnalyzing(false);
    setCurrentAnalyzing('');
  }, [watchlist]);

  /**
   * Stop ongoing analysis
   */
  const stopAnalyzeAll = useCallback(() => {
    abortAnalyzeRef.current = true;
  }, []);

  /**
   * Clear analysis results
   */
  const clearAnalysisResults = useCallback(() => {
    setAnalysisResults({});
    setAnalyzeProgress(0);
  }, []);

  return {
    watchlist,
    watchlistData,
    loadingSymbols,
    lastRefresh,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    fetchSymbolData,
    refreshAll,
    moveUp,
    moveDown,
    clearWatchlist,
    // Analyze all
    analyzing,
    analyzeProgress,
    currentAnalyzing,
    analysisResults,
    analyzeAll,
    stopAnalyzeAll,
    clearAnalysisResults
  };
}
