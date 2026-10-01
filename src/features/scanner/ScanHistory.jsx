import { Activity, Eye, Star } from 'lucide-react';
import { PriceChange } from '../../components/ui';
import { formatPrice } from '../../utils/format';

/**
 * Lists the most recent scan results, highlighting stocks above the threshold
 */
export function ScanHistory({ history, threshold, onAnalyze, addToWatchlist, isInWatchlist }) {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-slate-400" />
        Letzte Ergebnisse
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((stock, i) => (
          <div
            key={`${stock.symbol}-${i}`}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              stock.bullishPercent >= threshold
                ? 'bg-green-900/30 border border-green-600'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                stock.bullishPercent >= threshold ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {stock.bullishPercent}%
              </div>
              <div>
                <div className="text-white font-bold">{stock.symbol}</div>
                <div className="text-slate-400 text-sm">{stock.verdict}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-white font-semibold">
                  {formatPrice(stock.price, stock.currency, stock.priceHint)}
                </div>
                <div className="text-sm font-semibold">
                  <PriceChange value={stock.priceChange} />
                </div>
              </div>
              <button
                onClick={() => onAnalyze(stock.symbol)}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                title="Analysieren"
              >
                <Eye className="w-4 h-4" />
              </button>
              {isInWatchlist(stock.symbol) ? (
                <button
                  disabled
                  className="p-2 bg-amber-600 text-white rounded-lg opacity-75"
                  title="In Watchlist"
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  onClick={() => addToWatchlist(stock.symbol)}
                  className="p-2 bg-slate-700 hover:bg-amber-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title="Zur Watchlist hinzufügen"
                >
                  <Star className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
