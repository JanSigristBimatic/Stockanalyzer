import { BarChart3, Loader2, Star, RefreshCw, Pause } from 'lucide-react';
import { BIMATIC_BLUE } from '../../constants';
import { WatchlistItem } from './WatchlistItem';
import { AnalysisResults } from './AnalysisResults';

export function WatchlistTab({
  watchlist, watchlistData, loadingSymbols, lastRefresh,
  onRefreshAll, onRefreshSymbol, onRemove, onMoveUp, onMoveDown, onAnalyze,
  analyzing, analyzeProgress, currentAnalyzing, analysisResults,
  onAnalyzeAll, onStopAnalyzeAll, onClearAnalysisResults
}) {
  const isAnyLoading = Object.values(loadingSymbols).some(Boolean);
  const results = Object.values(analysisResults);

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-20">
        <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-300 text-xl font-semibold">Deine Watchlist ist leer</p>
        <p className="text-slate-400 mt-2">
          Analysiere eine Aktie und klicke auf "Zur Watchlist hinzufügen"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Meine Watchlist</h2>
              <p className="text-slate-400 text-sm">{watchlist.length} Aktie{watchlist.length !== 1 ? 'n' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {lastRefresh && (
              <span className="text-slate-500 text-xs">
                Aktualisiert: {new Date(lastRefresh).toLocaleTimeString('de-DE')}
              </span>
            )}
            <button
              onClick={onRefreshAll}
              disabled={isAnyLoading || analyzing}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isAnyLoading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </button>
            {!analyzing ? (
              <button
                onClick={onAnalyzeAll}
                disabled={isAnyLoading}
                className="px-4 py-2 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
                style={{ backgroundColor: BIMATIC_BLUE }}
              >
                <BarChart3 className="w-4 h-4" />
                Alle analysieren
              </button>
            ) : (
              <button
                onClick={onStopAnalyzeAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Pause className="w-4 h-4" />
                Stoppen
              </button>
            )}
          </div>
        </div>

        {/* Analysis Progress */}
        {analyzing && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analysiere: <span className="text-white font-bold">{currentAnalyzing}</span>
              </span>
              <span className="text-slate-400">{analyzeProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${analyzeProgress}%`, backgroundColor: BIMATIC_BLUE }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {results.length > 0 && (
        <AnalysisResults results={results} onAnalyze={onAnalyze} onClose={onClearAnalysisResults} />
      )}

      {/* Watchlist Items */}
      <div className="space-y-2">
        {watchlist.map((item, index) => (
          <WatchlistItem
            key={item.symbol}
            item={item}
            data={watchlistData[item.symbol]}
            isLoading={loadingSymbols[item.symbol]}
            index={index}
            isFirst={index === 0}
            isLast={index === watchlist.length - 1}
            onRefresh={() => onRefreshSymbol(item.symbol)}
            onRemove={() => onRemove(item.symbol)}
            onMoveUp={() => onMoveUp(index)}
            onMoveDown={() => onMoveDown(index)}
            onAnalyze={() => onAnalyze(item.symbol)}
          />
        ))}
      </div>
    </div>
  );
}
