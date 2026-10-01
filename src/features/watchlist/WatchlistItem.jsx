import { Loader2, TrendingUp, TrendingDown, RefreshCw, Trash2, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { formatMarketCap } from '../../utils/format';

export function WatchlistItem({
  item, data, isLoading, isFirst, isLast,
  onRefresh, onRemove, onMoveUp, onMoveDown, onAnalyze
}) {
  const changeColor = data?.change >= 0 ? 'text-green-400' : 'text-red-400';
  const weekChangeColor = data?.weekChange >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-slate-900 border-2 border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Symbol & Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">{item.symbol}</span>
            {isLoading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
          </div>
          {item.name && (
            <p className="text-slate-400 text-sm truncate">{item.name}</p>
          )}
        </div>

        {/* Price Data */}
        {data ? (
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-right">
              <div className="text-white font-bold text-xl">
                {data.currency === 'USD' ? '$' : data.currency === 'EUR' ? '€' : data.currency + ' '}
                {data.price?.toFixed(2)}
              </div>
              <div className={`text-sm font-semibold flex items-center justify-end gap-1 ${changeColor}`}>
                {data.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {data.change >= 0 ? '+' : ''}{data.change}%
              </div>
            </div>

            <div className="text-right hidden md:block">
              <div className="text-slate-400 text-xs">7 Tage</div>
              <div className={`text-sm font-semibold ${weekChangeColor}`}>
                {data.weekChange >= 0 ? '+' : ''}{data.weekChange}%
              </div>
            </div>

            {data.marketCap && (
              <div className="text-right hidden lg:block">
                <div className="text-slate-400 text-xs">Market Cap</div>
                <div className="text-white text-sm font-semibold">
                  {formatMarketCap(data.marketCap)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-500 text-sm">
            {isLoading ? 'Lädt...' : 'Keine Daten'}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onAnalyze}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            title="Analysieren"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-lg transition-colors"
            title="Aktualisieren"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex flex-col">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1 hover:bg-slate-700 disabled:opacity-30 text-slate-400 hover:text-white rounded transition-colors"
              title="Nach oben"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1 hover:bg-slate-700 disabled:opacity-30 text-slate-400 hover:text-white rounded transition-colors"
              title="Nach unten"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onRemove}
            className="p-2 bg-red-900/50 hover:bg-red-800 text-red-400 hover:text-red-300 rounded-lg transition-colors"
            title="Entfernen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
