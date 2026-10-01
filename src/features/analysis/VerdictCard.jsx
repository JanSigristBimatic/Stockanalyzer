import { BarChart3, DollarSign } from 'lucide-react';
import { VerdictIcon } from '../../components/ui';
import { SignalItem } from './SignalItem';

export function VerdictCard({ verdict }) {
  const borderClass = verdict.verdictType.includes('bullish')
    ? 'bg-green-900/30 border-green-500'
    : verdict.verdictType.includes('bearish')
    ? 'bg-red-900/30 border-red-500'
    : 'bg-yellow-900/30 border-yellow-500';

  const textClass = verdict.verdictType.includes('bullish')
    ? 'text-green-400'
    : verdict.verdictType.includes('bearish')
    ? 'text-red-400'
    : 'text-yellow-400';

  // Separate signals by category
  const technicalSignals = verdict.signals.filter(s => !s.category || s.category !== 'fundamental');
  const fundamentalSignals = verdict.signals.filter(s => s.category === 'fundamental');
  const hasFundamentals = fundamentalSignals.length > 0;

  return (
    <div className={`rounded-2xl p-6 border-4 ${borderClass}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-4">
          <VerdictIcon type={verdict.verdictType} />
          <div>
            <div className="text-sm text-slate-300 font-semibold">GESAMTBEWERTUNG</div>
            <div className={`text-3xl font-black ${textClass}`}>{verdict.verdict}</div>
            {hasFundamentals && (
              <div className="text-xs text-slate-400 mt-1">Technisch + Fundamental</div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-white font-bold">{verdict.bullishPercent}% Bullish</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-white font-bold">{verdict.bearishPercent}% Bearish</span>
            </div>
          </div>
          <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden flex">
            <div className="bg-green-500 h-full" style={{ width: `${verdict.bullishPercent}%` }} />
            <div className="bg-red-500 h-full" style={{ width: `${verdict.bearishPercent}%` }} />
          </div>

          {/* Score breakdown */}
          {hasFundamentals && verdict.technicalScore !== undefined && (
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Technisch:</span>
                <span className={verdict.technicalScore > 0 ? 'text-green-400' : verdict.technicalScore < 0 ? 'text-red-400' : 'text-yellow-400'}>
                  {verdict.technicalScore > 0 ? '+' : ''}{verdict.technicalScore}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Fundamental:</span>
                <span className={verdict.fundamentalScore > 0 ? 'text-green-400' : verdict.fundamentalScore < 0 ? 'text-red-400' : 'text-yellow-400'}>
                  {verdict.fundamentalScore > 0 ? '+' : ''}{verdict.fundamentalScore}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 p-4 bg-slate-900/50 rounded-xl">
        <p className="text-white text-lg font-medium">{verdict.recommendation}</p>
      </div>

      {/* Technical Signals */}
      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Technische Signale
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {technicalSignals.map((sig, i) => (
            <SignalItem key={i} signal={sig} />
          ))}
        </div>
      </div>

      {/* Fundamental Signals */}
      {hasFundamentals && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Fundamentale Signale
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {fundamentalSignals.map((sig, i) => (
              <SignalItem key={i} signal={sig} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
