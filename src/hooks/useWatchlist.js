import { useState, useEffect, useCallback } from 'react';
import { fetchStockData, fetchFundamentalData } from '../services';

const WATCHLIST_KEY = 'stockanalyzer_watchlist';

/**
 * Custom hook for managing a stock watchlist with localStorage persistence
 * Stores symbols and fetches live price data on demand
 */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [watchlistData, setWatchlistData] = useState({});
  const [loadingSymbols, setLoadingSymbols] = useState({});
  const [lastRefresh, setLastRefresh] = useState(null);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWatchlist(parsed);
      }
    } catch (e) {
      console.error('Failed to load watchlist:', e);
    }
  }, []);

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
      const [priceResult, fundamentals] = await Promise.all([
        fetchStockData(symbol, '1M', '1d'),
        fetchFundamentalData(symbol)
      ]);

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
    clearWatchlist
  };
}
