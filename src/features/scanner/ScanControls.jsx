import { CheckCircle2, Loader2, Pause, Play, RefreshCw, RotateCcw } from 'lucide-react';
import { BIMATIC_BLUE } from '../../constants';

/**
 * Start, pause, continue and reset buttons plus the progress of the scan
 */
export function ScanControls({
  status, currentSymbol, processedCount, failedCount, totalSymbols, progress, onStart, onResume, onPause, onReset
}) {
  const hasStarted = status !== 'idle';

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {status === 'idle' && (
          <ActionButton icon={Play} onClick={onStart} disabled={totalSymbols === 0} style={{ backgroundColor: BIMATIC_BLUE }}>
            Scan starten
          </ActionButton>
        )}
        {status === 'scanning' && (
          <ActionButton icon={Pause} onClick={onPause} className="bg-amber-600 hover:bg-amber-700">
            Pausieren
          </ActionButton>
        )}
        {status === 'paused' && (
          <ActionButton icon={Play} onClick={onResume} style={{ backgroundColor: BIMATIC_BLUE }}>
            Fortsetzen
          </ActionButton>
        )}
        {(status === 'paused' || status === 'done') && (
          <>
            <ActionButton icon={RefreshCw} onClick={onStart} className="bg-purple-600 hover:bg-purple-700">
              Neu scannen
            </ActionButton>
            <ActionButton icon={RotateCcw} onClick={onReset} className="bg-slate-700 hover:bg-slate-600">
              Zurücksetzen
            </ActionButton>
          </>
        )}
      </div>

      {hasStarted && (
        <div className="mt-4">
          <div className="flex flex-wrap justify-between gap-2 text-sm mb-2">
            <StatusText status={status} currentSymbol={currentSymbol} />
            <span className="text-slate-400">
              {processedCount} von {totalSymbols} analysiert
              {failedCount > 0 && `, ${failedCount} übersprungen`}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: status === 'done' ? '#22c55e' : BIMATIC_BLUE }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatusText({ status, currentSymbol }) {
  if (status === 'scanning') {
    return (
      <span className="flex items-center gap-2 text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        Analysiere <span className="text-white font-bold">{currentSymbol}</span>
      </span>
    );
  }
  if (status === 'paused') return <span className="text-amber-400 font-semibold">Pausiert</span>;
  return (
    <span className="text-green-400 font-bold flex items-center gap-1">
      <CheckCircle2 className="w-4 h-4" /> Scan abgeschlossen
    </span>
  );
}

function ActionButton({ icon: Icon, children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`px-6 py-3 text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 ${className}`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );
}
