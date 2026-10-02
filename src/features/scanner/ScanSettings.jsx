import { Clock, Layers } from 'lucide-react';
import { AUTO_SCAN_PERIODS, BIMATIC_BLUE, BIMATIC_LIGHT } from '../../constants';

/**
 * Category and period selection; locked while a scan runs
 */
export function ScanSettings({
  categories, categoryIds, totalSymbols, period, disabled, onToggleCategory, onSelectAllCategories, onPeriodChange
}) {
  return (
    <div className="space-y-4 mb-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-300 font-semibold flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-400" />
            Kategorien
          </span>
          <button
            onClick={onSelectAllCategories}
            disabled={disabled}
            className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded transition-colors"
          >
            Alle auswählen
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([id, category]) => (
            <button
              key={id}
              onClick={() => onToggleCategory(id)}
              disabled={disabled}
              title={category.description}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
                categoryIds.includes(id)
                  ? 'bg-purple-600 text-white border-2 border-purple-400'
                  : 'bg-slate-800 text-slate-400 border-2 border-slate-600 hover:border-slate-400 hover:text-slate-300'
              }`}
            >
              {category.label}
              <span className="ml-1.5 text-xs opacity-70">{category.symbols.length}</span>
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-2">
          {totalSymbols} Aktien in {categoryIds.length} Kategorie{categoryIds.length !== 1 ? 'n' : ''} ausgewählt
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300 font-semibold">Zeitraum:</span>
        <div className="flex flex-wrap gap-1">
          {AUTO_SCAN_PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onPeriodChange(value)}
              disabled={disabled}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${
                period === value
                  ? 'text-white border-2'
                  : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
              }`}
              style={period === value ? { backgroundColor: BIMATIC_BLUE, borderColor: BIMATIC_LIGHT } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
