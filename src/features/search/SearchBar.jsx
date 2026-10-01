import { useState } from 'react';
import { Search, Zap, Loader2 } from 'lucide-react';
import { BIMATIC_BLUE } from '../../constants';
import { useSymbolAutocomplete } from '../../hooks';

export function SearchBar({ currentSymbol, loading, onSearch }) {
  const [inputValue, setInputValue] = useState(currentSymbol);
  const [syncedSymbol, setSyncedSymbol] = useState(currentSymbol);
  const autocomplete = useSymbolAutocomplete();

  // Show the analyzed symbol when it was opened from the scanner or the watchlist
  if (currentSymbol !== syncedSymbol) {
    setSyncedSymbol(currentSymbol);
    setInputValue(currentSymbol);
  }

  const submit = (query) => {
    autocomplete.close();
    onSearch(query);
  };

  const selectResult = (result) => {
    setInputValue(result.symbol);
    submit(result.symbol);
  };

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    autocomplete.search(value);
  };

  const isDisabled = loading || !inputValue.trim();

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && submit(inputValue)}
          onBlur={autocomplete.close}
          placeholder="Symbol oder Firmenname (z.B. NVDA, Apple, Tesla)"
          className="w-full bg-slate-900 border-2 border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white text-lg font-medium placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
        />

        {/* Autocomplete Dropdown */}
        {autocomplete.isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border-2 border-blue-400 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            {autocomplete.isLoading ? (
              <div className="flex items-center gap-2 p-4 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Suche...</span>
              </div>
            ) : (
              <>
                <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-700 flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  {autocomplete.results.length} Ergebnis{autocomplete.results.length !== 1 ? 'se' : ''} gefunden
                </div>
                {autocomplete.results.map((result, i) => (
                  <button
                    key={i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectResult(result);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 border-b border-slate-800 last:border-b-0 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400 border border-slate-700">
                      {result.type === 'ETF' ? 'ETF' : result.symbol.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{result.symbol}</span>
                        {result.type === 'ETF' && (
                          <span className="text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded">ETF</span>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm truncate">{result.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">{result.exchangeDisplay}</div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => submit(inputValue)}
        disabled={isDisabled}
        className="px-6 py-3 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:bg-slate-700 disabled:text-slate-500"
        style={{ backgroundColor: isDisabled ? undefined : BIMATIC_BLUE }}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
        {loading ? 'Lädt...' : 'Analysieren'}
      </button>
    </div>
  );
}
