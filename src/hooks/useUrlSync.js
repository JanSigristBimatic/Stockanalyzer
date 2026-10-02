import { useEffect, useRef } from 'react';
import { buildUrlSearch, readUrlState } from '../utils/urlState';

/**
 * Mirrors the displayed symbol, period, interval and tab in the URL and follows the browser's
 * back and forward buttons. Nothing is written while a request is loading, so the URL always
 * describes what is shown.
 * @param {Object} state - Displayed symbol, period, interval, tab and the loading flag
 * @param {function(Object): void} state.onNavigate - Receives the URL state after back or forward
 */
export function useUrlSync({ symbol, period, interval, tab, isLoading, onNavigate }) {
  const syncedSymbolRef = useRef(symbol);

  useEffect(() => {
    if (isLoading) return;
    const isNewSymbol = symbol !== syncedSymbolRef.current;
    syncedSymbolRef.current = symbol;

    const search = buildUrlSearch({ symbol, period, interval, tab });
    if (search === window.location.search) return;

    // Only a newly opened symbol gets its own history entry. A failed load keeps the shown
    // symbol and replaces the entry, so back never leads into the same failing request again.
    const url = `${window.location.pathname}${search}`;
    if (isNewSymbol && readUrlState(window.location.search).symbol !== symbol) {
      window.history.pushState(null, '', url);
    } else {
      window.history.replaceState(null, '', url);
    }
  }, [symbol, period, interval, tab, isLoading]);

  useEffect(() => {
    const handlePopState = () => onNavigate(readUrlState(window.location.search));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onNavigate]);
}
