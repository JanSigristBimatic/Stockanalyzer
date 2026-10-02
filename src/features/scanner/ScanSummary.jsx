import { useMemo } from 'react';
import { Gauge } from 'lucide-react';
import { VERDICT_TYPES, formatScore, summarizeScanResults } from '../../utils/scanResults';
import { formatDateTime } from '../../utils/format';
import { VERDICT_STYLES } from './verdictStyles';

/**
 * Market breadth of the scanned symbols: verdict distribution, share above SMA 200,
 * average score and the strongest and weakest symbol
 */
export function ScanSummary({ rows, status, period, finishedAt, onAnalyze }) {
  const summary = useMemo(() => summarizeScanResults(rows), [rows]);
  const { total, verdictCounts, aboveSma200Percent, averageScore, best, worst } = summary;

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-400" />
          Marktbreite
        </h3>
        <span className="text-slate-400 text-sm">
          {status === 'scanning' ? 'Scan läuft' : `Stand ${formatDateTime(finishedAt / 1000)}`} · Zeitraum {period} · {total} Aktien
        </span>
      </div>

      <div className="flex h-4 rounded-full overflow-hidden bg-slate-800 mb-2">
        {VERDICT_TYPES.filter(type => verdictCounts[type] > 0).map(type => (
          <div
            key={type}
            className={VERDICT_STYLES[type].bar}
            style={{ width: `${(verdictCounts[type] / total) * 100}%` }}
            title={`${VERDICT_STYLES[type].label}: ${verdictCounts[type]}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-4">
        {VERDICT_TYPES.map(type => (
          <span key={type} className="flex items-center gap-1.5 text-slate-300">
            <span className={`w-3 h-3 rounded-sm ${VERDICT_STYLES[type].bar}`} />
            {VERDICT_STYLES[type].label}
            <span className="text-white font-bold">{verdictCounts[type]}</span>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile
          label="Über SMA 200"
          value={aboveSma200Percent == null ? '–' : `${aboveSma200Percent.toFixed(0)}%`}
          hint="Anteil im langfristigen Aufwärtstrend"
          tone={aboveSma200Percent == null ? null : aboveSma200Percent >= 50 ? 'good' : 'bad'}
        />
        <Tile
          label="Ø Score"
          value={averageScore == null ? '–' : formatScore(Math.round(averageScore))}
          hint="Bullish minus Bearish %"
          tone={averageScore > 0 ? 'good' : averageScore < 0 ? 'bad' : null}
        />
        <SymbolTile label="Stärkste Aktie" row={best} onAnalyze={onAnalyze} />
        <SymbolTile label="Schwächste Aktie" row={worst} onAnalyze={onAnalyze} />
      </div>
    </div>
  );
}

const TONE_CLASSES = { good: 'text-green-400', bad: 'text-red-400' };

function Tile({ label, value, hint, tone }) {
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
      <div className="text-slate-400 text-xs font-semibold mb-1">{label}</div>
      <div className={`text-xl font-black ${TONE_CLASSES[tone] ?? 'text-white'}`}>{value}</div>
      <div className="text-slate-500 text-xs mt-0.5">{hint}</div>
    </div>
  );
}

function SymbolTile({ label, row, onAnalyze }) {
  return (
    <button
      onClick={() => onAnalyze(row.symbol)}
      className="text-left bg-slate-800 border border-slate-600 hover:border-slate-400 rounded-lg p-3 transition-colors"
    >
      <div className="text-slate-400 text-xs font-semibold mb-1">{label}</div>
      <div className="text-xl font-black text-white">
        {row.symbol}
        <span className={`ml-2 text-base ${row.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatScore(row.score)}</span>
      </div>
      <div className="text-slate-500 text-xs mt-0.5 truncate">{row.name ?? VERDICT_STYLES[row.verdictType].label}</div>
    </button>
  );
}
