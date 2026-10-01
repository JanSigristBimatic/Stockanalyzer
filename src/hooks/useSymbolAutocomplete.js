import { useState, useRef, useCallback, useEffect } from 'react';
import { searchSymbols } from '../services';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

/**
 * Debounced symbol search for the search input.
 * Only explicit calls to `search` (user typing) trigger a request, so setting the
 * input programmatically never reopens the dropdown.
 */
export function useSymbolAutocomplete() {
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);
  const requestIdRef = useRef(0);

  const cancelPending = useCallback(() => {
    clearTimeout(timerRef.current);
    requestIdRef.current += 1;
  }, []);

  const search = useCallback((query) => {
    cancelPending();
    if (query.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    const requestId = requestIdRef.current;
    timerRef.current = setTimeout(async () => {
      setIsLoading(true);
      const found = await searchSymbols(query);
      if (requestId !== requestIdRef.current) return;
      setResults(found);
      setIsOpen(found.length > 0);
      setIsLoading(false);
    }, DEBOUNCE_MS);
  }, [cancelPending]);

  const close = useCallback(() => {
    cancelPending();
    setIsOpen(false);
    setIsLoading(false);
  }, [cancelPending]);

  useEffect(() => cancelPending, [cancelPending]);

  return { results, isOpen, isLoading, search, close };
}
