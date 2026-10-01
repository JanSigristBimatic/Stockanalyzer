import { BarChart3, Target, Loader2, Clock, Play, Pause, SkipForward, RotateCcw, Radar, CheckCircle2 } from 'lucide-react';
import { BIMATIC_BLUE, BIMATIC_LIGHT, AUTO_SCAN_PERIODS, BULLISH_THRESHOLDS } from '../../constants';
import { FoundStockCard } from './FoundStockCard';
import { ScanHistory } from './ScanHistory';

export function AutoScanTab({ autoScan, onAnalyze, addToWatchlist, isInWatchlist }) {
  const {
    scanning, paused, currentSymbol, scannedCount, skippedCount,
    foundStock, scanHistory, scanPeriod, threshold, totalSymbols, progress,
    selectedCategories, categories,
    startScan, pauseScan, continueScan, resetScan, changeScanPeriod, changeThreshold,
    toggleCategory, selectAllCategories
  } = autoScan;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: BIMATIC_BLUE }}>
            <Radar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Auto-Scanner</h2>
            <p className="text-slate-400">Findet automatisch bullishe Aktien für dich</p>
          </div>
        </div>

        {/* Categories Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              Kategorien auswählen:
            </span>
            <button
              onClick={selectAllCategories}
              disabled={scanning}
              className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded transition-colors"
            >
              Alle auswählen
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([id, cat]) => (
              <button
                key={id}
                onClick={() => toggleCategory(id)}
                disabled={scanning}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
                  selectedCategories.includes(id)
                    ? 'bg-purple-600 text-white border-2 border-purple-400'
                    : 'bg-slate-800 text-slate-400 border-2 border-slate-600 hover:border-slate-400 hover:text-slate-300'
                }`}
                title={cat.description}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {totalSymbols} Aktien in {selectedCategories.length} Kategorie{selectedCategories.length !== 1 ? 'n' : ''} ausgewählt
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300 font-semibold">Zeitraum:</span>
            <div className="flex gap-1">
              {AUTO_SCAN_PERIODS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => changeScanPeriod(value)}
                  disabled={scanning}
                  className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${
                    scanPeriod === value
                      ? 'text-white border-2'
                      : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
                  }`}
                  style={scanPeriod === value ? { backgroundColor: BIMATIC_BLUE, borderColor: BIMATIC_LIGHT } : {}}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300 font-semibold">Min. Bullish:</span>
            <div className="flex gap-1">
              {BULLISH_THRESHOLDS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => changeThreshold(value)}
                  disabled={scanning}
                  className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${
                    threshold === value
                      ? 'bg-green-600 text-white border-2 border-green-400'
                      : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {!scanning && !foundStock && (
            <button
              onClick={startScan}
              className="px-6 py-3 text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-colors"
              style={{ backgroundColor: BIMATIC_BLUE }}
            >
              <Play className="w-5 h-5" />
              {paused ? 'Fortsetzen' : 'Scan starten'}
            </button>
          )}

          {scanning && (
            <button
              onClick={pauseScan}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Pause className="w-5 h-5" />
              Pausieren
            </button>
          )}

          {foundStock && (
            <button
              onClick={continueScan}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
              Weiter suchen
            </button>
          )}

          {(scannedCount > 0 || paused) && (
            <button
              onClick={resetScan}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Zurücksetzen
            </button>
          )}
        </div>

        {/* Progress */}
        {(scanning || scannedCount > 0) && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">
                {scanning ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analysiere: <span className="text-white font-bold">{currentSymbol}</span>
                  </span>
                ) : paused ? (
                  'Pausiert'
                ) : foundStock ? (
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Fund!
                  </span>
                ) : (
                  'Scan abgeschlossen'
                )}
              </span>
              <span className="text-slate-400">
                {scannedCount} analysiert, {skippedCount} übersprungen / {totalSymbols} total
              </span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: foundStock ? '#22c55e' : BIMATIC_BLUE
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Found Stock Card */}
      {foundStock && (
        <FoundStockCard
          stock={foundStock}
          threshold={threshold}
          onAnalyze={onAnalyze}
          addToWatchlist={addToWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <ScanHistory
          history={scanHistory}
          threshold={threshold}
          onAnalyze={onAnalyze}
          addToWatchlist={addToWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* Empty State */}
      {!scanning && scannedCount === 0 && !foundStock && (
        <div className="text-center py-16 bg-slate-900/50 border-2 border-slate-700 rounded-xl">
          <Radar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 text-xl font-semibold">Bereit zum Scannen</p>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            Der Auto-Scanner durchsucht {totalSymbols} populäre Aktien und stoppt,
            sobald eine mit mindestens {threshold}% Bullish-Bewertung gefunden wird.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-amber-900/20 border border-amber-600/50 rounded-xl p-4">
        <p className="text-amber-200 text-sm">
          <strong>Hinweis:</strong> Der Scanner analysiert Aktien basierend auf technischen und fundamentalen Indikatoren.
          Eine hohe Bullish-Bewertung bedeutet nicht garantierte Gewinne. Führe immer deine eigene Recherche durch.
        </p>
      </div>
    </div>
  );
}
