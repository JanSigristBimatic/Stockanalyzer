import { Radar } from 'lucide-react';
import { BIMATIC_BLUE } from '../../constants';
import { ScanSettings } from './ScanSettings';
import { ScanControls } from './ScanControls';
import { ScanSummary } from './ScanSummary';
import { ScanResults } from './ScanResults';

/**
 * Auto-Scanner: rates every symbol of the selected categories and ranks them by score
 */
export function AutoScanTab({ autoScan, onAnalyze, addToWatchlist, isInWatchlist }) {
  const {
    status, rows, failedSymbols, startedAt, finishedAt, currentSymbol, period, categoryIds, categories,
    totalSymbols, processedCount, progress,
    startScan, resumeScan, pauseScan, resetScan, changePeriod, toggleCategory, selectAllCategories
  } = autoScan;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: BIMATIC_BLUE }}>
            <Radar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Auto-Scanner</h2>
            <p className="text-slate-400">Bewertet alle Aktien der Auswahl und sortiert sie vom besten zum schlechtesten Urteil</p>
          </div>
        </div>

        <ScanSettings
          categories={categories}
          categoryIds={categoryIds}
          totalSymbols={totalSymbols}
          period={period}
          disabled={status === 'scanning'}
          onToggleCategory={toggleCategory}
          onSelectAllCategories={selectAllCategories}
          onPeriodChange={changePeriod}
        />
        <ScanControls
          status={status}
          currentSymbol={currentSymbol}
          processedCount={processedCount}
          failedCount={failedSymbols.length}
          totalSymbols={totalSymbols}
          progress={progress}
          onStart={startScan}
          onResume={resumeScan}
          onPause={pauseScan}
          onReset={resetScan}
        />
      </div>

      {rows.length > 0 && (
        <>
          <ScanSummary rows={rows} status={status} period={period} finishedAt={finishedAt} onAnalyze={onAnalyze} />
          <ScanResults
            rows={rows}
            referenceTime={startedAt}
            exportName={`scanner-${period}-${new Date(startedAt).toISOString().slice(0, 10)}`}
            onAnalyze={onAnalyze}
            addToWatchlist={addToWatchlist}
            isInWatchlist={isInWatchlist}
          />
        </>
      )}

      {status === 'idle' && (
        <div className="text-center py-16 bg-slate-900/50 border-2 border-slate-700 rounded-xl">
          <Radar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 text-xl font-semibold">Bereit zum Scannen</p>
          <p className="text-slate-400 mt-2 max-w-md mx-auto px-4">
            Der Scanner bewertet {totalSymbols} Aktien mit derselben Analyse wie der Analyse-Tab
            und erstellt daraus eine Rangliste mit Marktbreite und Signalen.
          </p>
        </div>
      )}

      <div className="bg-amber-900/20 border border-amber-600/50 rounded-xl p-4">
        <p className="text-amber-200 text-sm">
          <strong>Hinweis:</strong> Der Score ist der Bullish-Anteil minus der Bearish-Anteil aller technischen und fundamentalen Signale.
          Eine hohe Bewertung garantiert keine Gewinne. Führe immer deine eigene Recherche durch.
        </p>
      </div>
    </div>
  );
}
