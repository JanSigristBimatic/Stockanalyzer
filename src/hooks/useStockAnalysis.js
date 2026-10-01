import { useState, useCallback, useRef } from 'react';
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
 */
export function useStockAnalysis() {
  const [symbol, setSymbol] = useState('');
  const [result, setResult] = useState(null);
  const [timePeriod, setTimePeriod] = useState('6M');
  const [interval, setInterval] = useState('1d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const requestIdRef = useRef(0);

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
   * Opens a known symbol, e.g. from the exchange suggestions, the watchlist or the scanner
   */
  const selectSymbol = useCallback(async (selectedSymbol) => {
    const requestId = startRequest(selectedSymbol);
    const response = await analyzeSymbol(selectedSymbol, timePeriod, interval);
    if (!isLatestRequest(requestId)) return;

    if (response.error) {
      showError(response.error.type === 'symbol' ? getNotFoundMessage(selectedSymbol) : getErrorMessage(response.error));
      return;
    }
    showResult(selectedSymbol, response);
  }, [timePeriod, interval, startRequest, isLatestRequest, showError, showResult]);

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
