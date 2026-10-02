import { useState, useCallback, useRef, useEffect } from 'react';
import { analyzeSymbol, searchSymbolVariants } from '../services';
import { PERIOD_INTERVALS } from '../constants';

const ERROR_MESSAGES = {
  network: 'Netzwerkfehler beim Laden der Daten. Bitte prüfe Proxy oder Verbindung.',
  parse: 'Antwort der Datenquelle konnte nicht verarbeitet werden.'
};

function getErrorMessage(error) {
  if (error.type === 'http') {
    return `Datenquelle antwortet mit Fehler ${error.status}. Bitte später erneut versuchen.`;
  }
  return ERROR_MESSAGES[error.type] || 'Daten konnten nicht geladen werden.';
}

function getNotFoundMessage(symbol) {
  return `Symbol "${symbol}" konnte nicht gefunden werden. Bitte überprüfe das Symbol und versuche es erneut.`;
}

/**
 * Loads and analyzes the selected stock. Only the latest request may update the state, and a
 * failed request keeps the data on screen so the error can be shown above it.
 * @param {{symbol: string|null, period: string, interval: string}} initialRequest - e.g. from a deep link;
 *   the symbol is loaded once on mount
 */
export function useStockAnalysis(initialRequest) {
  const [symbol, setSymbol] = useState(initialRequest.symbol ?? '');
  const [result, setResult] = useState(null);
  const [timePeriod, setTimePeriod] = useState(initialRequest.period);
  const [interval, setInterval] = useState(initialRequest.interval);
  const [loading, setLoading] = useState(Boolean(initialRequest.symbol));
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const requestIdRef = useRef(0);
  const pendingInitialSymbolRef = useRef(initialRequest.symbol);

  const startRequest = useCallback((requestedSymbol) => {
    requestIdRef.current += 1;
    setSymbol(requestedSymbol);
    setLoading(true);
    setError(null);
    setSuggestions([]);
    return requestIdRef.current;
  }, []);

  const isLatestRequest = useCallback((requestId) => requestId === requestIdRef.current, []);

  const showResult = useCallback((resultSymbol, response) => {
    setResult({ symbol: resultSymbol, ...response });
    setLoading(false);
  }, []);

  const showError = useCallback((message) => {
    setError(message);
    setLoading(false);
  }, []);

  /**
   * Opens a known symbol, e.g. from the exchange suggestions, the watchlist, the scanner or the URL.
   * Without options the current period and interval are kept; options must be a valid combination.
   */
  const selectSymbol = useCallback(async (selectedSymbol, { period = timePeriod, interval: barInterval = interval } = {}) => {
    const requestId = startRequest(selectedSymbol);
    const response = await analyzeSymbol(selectedSymbol, period, barInterval);
    if (!isLatestRequest(requestId)) return;

    if (response.error) {
      showError(response.error.type === 'symbol' ? getNotFoundMessage(selectedSymbol) : getErrorMessage(response.error));
      return;
    }
    setTimePeriod(period);
    setInterval(barInterval);
    showResult(selectedSymbol, response);
  }, [timePeriod, interval, startRequest, isLatestRequest, showError, showResult]);

  useEffect(() => {
    const initialSymbol = pendingInitialSymbolRef.current;
    if (!initialSymbol) return;
    pendingInitialSymbolRef.current = null;
    selectSymbol(initialSymbol);
  }, [selectSymbol]);

  /**
   * Searches the entered symbol; unknown symbols are looked up on other exchanges
   */
  const search = useCallback(async (query) => {
    const querySymbol = query.trim().toUpperCase();
    if (!querySymbol) return;

    const requestId = startRequest(querySymbol);
    const response = await analyzeSymbol(querySymbol, timePeriod, interval);
    if (!isLatestRequest(requestId)) return;

    if (!response.error) {
      showResult(querySymbol, response);
      return;
    }
    if (response.error.type !== 'symbol') {
      showError(getErrorMessage(response.error));
      return;
    }

    const variants = await searchSymbolVariants(querySymbol);
    if (!isLatestRequest(requestId)) return;

    if (variants.length === 1) {
      selectSymbol(variants[0].symbol);
    } else if (variants.length > 1) {
      setSuggestions(variants);
      setLoading(false);
    } else {
      showError(getNotFoundMessage(querySymbol));
    }
  }, [timePeriod, interval, startRequest, isLatestRequest, showError, showResult, selectSymbol]);

  /**
   * Reloads the displayed stock with a new period or interval. The selection only changes once
   * the data for it has arrived, so controls and data never disagree.
   */
  const reload = useCallback(async (newPeriod, newInterval) => {
    if (!result) {
      setTimePeriod(newPeriod);
      setInterval(newInterval);
      return;
    }

    const requestId = startRequest(result.symbol);
    const response = await analyzeSymbol(result.symbol, newPeriod, newInterval);
    if (!isLatestRequest(requestId)) return;

    if (response.error) {
      showError(getErrorMessage(response.error));
      return;
    }
    setTimePeriod(newPeriod);
    setInterval(newInterval);
    showResult(result.symbol, response);
  }, [result, startRequest, isLatestRequest, showError, showResult]);

  const changePeriod = useCallback((newPeriod) => {
    const allowedIntervals = PERIOD_INTERVALS[newPeriod];
    reload(newPeriod, allowedIntervals.includes(interval) ? interval : allowedIntervals[0]);
  }, [interval, reload]);

  const changeInterval = useCallback((newInterval) => {
    reload(timePeriod, newInterval);
  }, [timePeriod, reload]);

  return {
    symbol, result, timePeriod, interval, loading, error, suggestions,
    search, selectSymbol, changePeriod, changeInterval
  };
}
