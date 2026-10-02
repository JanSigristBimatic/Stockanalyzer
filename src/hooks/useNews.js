import { useState, useEffect } from 'react';
import { fetchNews } from '../services';

/**
 * Loads the latest news for a search query when the consuming component is shown
 * @returns {{news: Array|null, loading: boolean}} - news is null while loading or when the request failed
 */
export function useNews(query) {
  const [loaded, setLoaded] = useState({ query: null, news: null });

  useEffect(() => {
    let isCancelled = false;
    fetchNews(query).then(news => {
      if (!isCancelled) setLoaded({ query, news });
    });
    return () => { isCancelled = true; };
  }, [query]);

  return loaded.query === query ? { news: loaded.news, loading: false } : { news: null, loading: true };
}
