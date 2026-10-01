import { CheckCircle2, Eye, Star } from 'lucide-react';
import { PriceChange } from '../../components/ui';
import { BIMATIC_BLUE } from '../../constants';
import { formatPrice } from '../../utils/format';

/**
 * Highlights the stock that reached the bullish threshold
 */
export function FoundStockCard({ stock, threshold, onAnalyze, addToWatchlist, isInWatchlist }) {
  return (
    <div className="bg-green-900/30 border-4 border-green-500 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
        <div>
          <h3 className="text-2xl font-bold text-green-400">Bullishe Aktie gefunden!</h3>
          <p className="text-slate-300">{threshold}%+ Bullish-Bewertung erreicht</p>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-3xl font-black text-white">{stock.symbol}</div>
            <div className="text-slate-400">{stock.exchange}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {formatPrice(stock.price, stock.currency, stock.priceHint)}
            </div>
            <div className="text-lg font-bold">
              <PriceChange value={stock.priceChange} withIcon />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-white font-bold">{stock.bullishPercent}% Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-white font-bold">{stock.bearishPercent}% Bearish</span>
          </div>
        </div>
        <div className="mt-2 w-full h-4 bg-slate-700 rounded-full overflow-hidden flex">
          <div className="bg-green-500 h-full" style={{ width: `${stock.bullishPercent}%` }} />
          <div className="bg-red-500 h-full" style={{ width: `${stock.bearishPercent}%` }} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onAnalyze(stock.symbol)}
          className="flex-1 px-6 py-3 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          style={{ backgroundColor: BIMATIC_BLUE }}
        >
          <Eye className="w-5 h-5" />
          Details analysieren
        </button>
        {isInWatchlist(stock.symbol) ? (
          <button
            disabled
            className="flex-1 px-6 py-3 bg-amber-600 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 opacity-75"
          >
            <Star className="w-5 h-5 fill-current" />
            In Watchlist
          </button>
        ) : (
          <button
            onClick={() => addToWatchlist(stock.symbol)}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-amber-600 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors group"
          >
            <Star className="w-5 h-5 group-hover:fill-current" />
            Zur Watchlist
          </button>
        )}
      </div>
    </div>
  );
}
