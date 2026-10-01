import { Globe } from 'lucide-react';
import { BIMATIC_BLUE } from '../../constants';

export function ExchangeSuggestions({ suggestions, onSelect }) {
  return (
    <div className="mb-6 bg-slate-900 border-2 rounded-xl p-4" style={{ borderColor: BIMATIC_BLUE }}>
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-5 h-5" style={{ color: BIMATIC_BLUE }} />
        <span className="text-white font-bold">Symbol gefunden auf mehreren Börsen - bitte wählen:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.symbol)}
            className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-blue-400 rounded-lg transition-all text-left"
          >
            <span className="text-2xl">{s.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold">{s.symbol}</div>
              <div className="text-slate-400 text-sm truncate">{s.exchangeLabel}</div>
            </div>
            <div className="text-green-400 font-bold">{s.currency} {s.price}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
