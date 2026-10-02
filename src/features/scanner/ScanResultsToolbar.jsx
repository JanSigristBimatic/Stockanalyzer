import { ArrowDownWideNarrow, ArrowUpNarrowWide, Download, Search, TrendingDown, Trophy } from 'lucide-react';
import { SCAN_SIGNALS } from '../../utils/analysis/scanSignals';
import { SORT_OPTIONS, VERDICT_GROUPS } from '../../utils/scanResults';

const SELECT_CLASS = 'bg-slate-800 border-2 border-slate-600 rounded-lg px-2 py-1.5 text-sm text-white font-semibold focus:outline-none focus:border-blue-400';

/**
 * Sorting, filters, search and CSV export of the scan results
 */
export function ScanResultsToolbar({ view, groupCounts, onChange, onExport }) {
  const isScoreSort = view.sortId === 'score';

  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <SegmentButton
          icon={Trophy}
          isActive={isScoreSort && view.direction === 'desc'}
          onClick={() => onChange({ sortId: 'score', direction: 'desc' })}
        >
          Beste zuerst
        </SegmentButton>
        <SegmentButton
          icon={TrendingDown}
          isActive={isScoreSort && view.direction === 'asc'}
          onClick={() => onChange({ sortId: 'score', direction: 'asc' })}
        >
          Schlechteste zuerst
        </SegmentButton>

        <label className="flex items-center gap-2 text-slate-400 text-sm font-semibold sm:ml-2">
          Sortieren nach
          <select value={view.sortId} onChange={(e) => onChange({ sortId: e.target.value })} className={SELECT_CLASS}>
            {SORT_OPTIONS.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </label>
        <button
          onClick={() => onChange({ direction: view.direction === 'desc' ? 'asc' : 'desc' })}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border-2 border-slate-600 hover:border-slate-400 text-slate-200 text-sm font-semibold"
          title="Reihenfolge umkehren"
        >
          {view.direction === 'desc'
            ? <><ArrowDownWideNarrow className="w-4 h-4" /> Absteigend</>
            : <><ArrowUpNarrowWide className="w-4 h-4" /> Aufsteigend</>}
        </button>

        <button
          onClick={onExport}
          className="sm:ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold"
          title="Gefilterte Rangliste als CSV speichern"
        >
          <Download className="w-4 h-4" />
          CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {VERDICT_GROUPS.map(group => (
          <button
            key={group.id}
            onClick={() => onChange({ verdictGroup: group.id })}
            aria-pressed={view.verdictGroup === group.id}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-colors ${
              view.verdictGroup === group.id
                ? 'bg-slate-600 border-slate-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {group.label} <span className="opacity-70">{groupCounts[group.id]}</span>
          </button>
        ))}

        <select
          value={view.signalId}
          onChange={(e) => onChange({ signalId: e.target.value })}
          className={SELECT_CLASS}
          aria-label="Nach Signal filtern"
        >
          <option value="">Alle Signale</option>
          {SCAN_SIGNALS.map(signal => <option key={signal.id} value={signal.id}>{signal.label}</option>)}
        </select>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={view.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Symbol oder Name"
            className="bg-slate-800 border-2 border-slate-600 rounded-lg pl-8 pr-2 py-1.5 text-sm text-white w-44 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );
}

function SegmentButton({ icon: Icon, isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-colors ${
        isActive
          ? 'bg-blue-600 border-blue-400 text-white'
          : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
}
