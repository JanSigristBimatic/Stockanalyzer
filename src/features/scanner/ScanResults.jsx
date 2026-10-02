import { useMemo, useState } from 'react';
import { Eye, ListOrdered, Star } from 'lucide-react';
import { PriceChange } from '../../components/ui';
import { getScanSignals } from '../../utils/analysis/scanSignals';
import { VERDICT_GROUPS, filterScanResults, formatScore, sortScanResults, toScanCsv } from '../../utils/scanResults';
import { formatPrice } from '../../utils/format';
import { SIGNAL_BADGE_CLASSES, VERDICT_STYLES } from './verdictStyles';
import { ScanResultsToolbar } from './ScanResultsToolbar';

const PAGE_SIZE = 25;
const DEFAULT_VIEW = { sortId: 'score', direction: 'desc', verdictGroup: 'all', signalId: '', query: '' };
const RSI_ZONE_CLASSES = { oversold: 'text-green-400', overbought: 'text-red-400' };

/**
 * Ranking of all scanned symbols with sorting, filters and CSV export
 * @param {Object} props
 * @param {Array} props.rows - Results of toAnalysisSummary
 * @param {number} props.referenceTime - Start of the scan in ms; signals such as a recent golden cross relate to it
 * @param {string} props.exportName - File name of the CSV export without extension
 */
export function ScanResults({ rows, referenceTime, exportName, onAnalyze, addToWatchlist, isInWatchlist }) {
  const [view, setView] = useState(DEFAULT_VIEW);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const referenceSeconds = referenceTime / 1000;

  const shownRows = useMemo(
    () => sortScanResults(filterScanResults(rows, view, referenceSeconds), view.sortId, view.direction),
    [rows, view, referenceSeconds]
  );
  const groupCounts = useMemo(
    () => Object.fromEntries(VERDICT_GROUPS.map(group => [
      group.id,
      group.types ? rows.filter(row => group.types.includes(row.verdictType)).length : rows.length
    ])),
    [rows]
  );

  const changeView = (changes) => {
    setView(prev => ({ ...prev, ...changes }));
    setVisibleCount(PAGE_SIZE);
  };
  const exportCsv = () => downloadCsv(`${exportName}.csv`, toScanCsv(shownRows, referenceSeconds));

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <ListOrdered className="w-5 h-5 text-blue-400" />
        Rangliste
      </h3>

      <ScanResultsToolbar view={view} groupCounts={groupCounts} onChange={changeView} onExport={exportCsv} />

      {shownRows.length === 0 ? (
        <p className="text-slate-400 text-sm py-6 text-center">Keine Aktien entsprechen den Filtern.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide border-b border-slate-700">
              <th className="py-2 pr-2 w-8">#</th>
              <th className="py-2 pr-2">Aktie</th>
              <th className="py-2 pr-2 hidden sm:table-cell">Urteil</th>
              <th className="py-2 pr-2">Score</th>
              <th className="py-2 pr-2 hidden md:table-cell text-right">Kurs</th>
              <th className="py-2 pr-2 hidden lg:table-cell text-right">RSI</th>
              <th className="py-2 pr-2 hidden lg:table-cell text-right">SMA 200</th>
              <th className="py-2"><span className="sr-only">Aktionen</span></th>
            </tr>
          </thead>
          <tbody>
            {shownRows.slice(0, visibleCount).map((row, index) => (
              <ResultRow
                key={row.symbol}
                row={row}
                rank={index + 1}
                referenceSeconds={referenceSeconds}
                isWatched={isInWatchlist(row.symbol)}
                onAnalyze={onAnalyze}
                onWatch={() => addToWatchlist(row.symbol, row.name ?? '')}
              />
            ))}
          </tbody>
        </table>
      )}

      {shownRows.length > visibleCount && (
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-sm">
          <span className="text-slate-400">{visibleCount} von {shownRows.length} angezeigt</span>
          <div className="flex gap-2">
            <PagingButton onClick={() => setVisibleCount(count => count + PAGE_SIZE)}>Weitere {PAGE_SIZE}</PagingButton>
            <PagingButton onClick={() => setVisibleCount(shownRows.length)}>Alle anzeigen</PagingButton>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultRow({ row, rank, referenceSeconds, isWatched, onAnalyze, onWatch }) {
  const verdictStyle = VERDICT_STYLES[row.verdictType];
  const signals = getScanSignals(row, referenceSeconds);

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/60 align-top">
      <td className="py-2.5 pr-2 text-slate-500 font-semibold tabular-nums">{rank}</td>
      <td className="py-2.5 pr-2">
        <button onClick={() => onAnalyze(row.symbol)} className="text-white font-bold hover:text-blue-300">
          {row.symbol}
        </button>
        {row.name && row.name !== row.symbol && (
          <div className="text-slate-400 text-xs truncate max-w-[9rem] sm:max-w-[16rem]">{row.name}</div>
        )}
        <div className={`sm:hidden text-xs font-semibold ${verdictStyle.text}`}>{verdictStyle.label}</div>
        {signals.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {signals.map(signal => (
              <span
                key={signal.id}
                title={signal.description}
                className={`px-1.5 py-0.5 rounded border text-[11px] font-semibold ${SIGNAL_BADGE_CLASSES[signal.type]}`}
              >
                {signal.label}
              </span>
            ))}
          </div>
        )}
      </td>
      <td className={`py-2.5 pr-2 hidden sm:table-cell font-semibold ${verdictStyle.text}`}>{verdictStyle.label}</td>
      <td className="py-2.5 pr-2"><ScoreCell row={row} /></td>
      <td className="py-2.5 pr-2 hidden md:table-cell text-right">
        <div className="text-white font-semibold">{formatPrice(row.price, row.currency, row.priceHint)}</div>
        <div className="text-xs"><PriceChange value={row.priceChange} /></div>
      </td>
      <td className={`py-2.5 pr-2 hidden lg:table-cell text-right tabular-nums font-semibold ${RSI_ZONE_CLASSES[row.rsiZone] ?? 'text-slate-200'}`}>
        {Number.isFinite(row.rsi) ? row.rsi.toFixed(1) : '–'}
      </td>
      <td className="py-2.5 pr-2 hidden lg:table-cell text-right tabular-nums font-semibold">
        <PriceChange value={row.sma200Distance} />
      </td>
      <td className="py-2.5 text-right whitespace-nowrap">
        <button
          onClick={() => onAnalyze(row.symbol)}
          className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          title="Analysieren"
          aria-label={`${row.symbol} analysieren`}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={onWatch}
          disabled={isWatched}
          className={`ml-1 p-2 rounded-lg transition-colors ${
            isWatched ? 'bg-amber-600 text-white opacity-75' : 'bg-slate-700 hover:bg-amber-600 text-slate-400 hover:text-white'
          }`}
          title={isWatched ? 'In Watchlist' : 'Zur Watchlist hinzufügen'}
          aria-label={isWatched ? `${row.symbol} ist in der Watchlist` : `${row.symbol} zur Watchlist hinzufügen`}
        >
          <Star className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
        </button>
      </td>
    </tr>
  );
}

// Bullish share grows from the left, bearish share from the right; the gap is neutral
function ScoreCell({ row }) {
  const scoreClass = row.score > 0 ? 'text-green-400' : row.score < 0 ? 'text-red-400' : 'text-slate-300';

  return (
    <div className="w-16 sm:w-28" title={`${row.bullishPercent}% bullish, ${row.bearishPercent}% bearish`}>
      <div className={`font-black tabular-nums ${scoreClass}`}>{formatScore(row.score)}</div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-700 mt-1">
        <div className="bg-green-500" style={{ width: `${row.bullishPercent}%` }} />
        <div className="flex-1" />
        <div className="bg-red-500" style={{ width: `${row.bearishPercent}%` }} />
      </div>
    </div>
  );
}

function PagingButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold">
      {children}
    </button>
  );
}

// The BOM lets Excel detect UTF-8, so umlauts in names stay intact
function downloadCsv(fileName, csv) {
  const url = URL.createObjectURL(new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
