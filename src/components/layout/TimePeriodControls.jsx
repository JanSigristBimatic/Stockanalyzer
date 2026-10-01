import { Clock, Loader2 } from 'lucide-react';
import { BIMATIC_BLUE, BIMATIC_LIGHT, CHART_INTERVALS, PERIOD_INTERVALS } from '../../constants';

const PERIODS = ['1M', '3M', '6M', '1Y', '2Y', '5Y'];

export function TimePeriodControls({ timePeriod, interval, loading, onPeriodChange, onIntervalChange }) {
  const intervals = CHART_INTERVALS.filter(({ value }) => PERIOD_INTERVALS[timePeriod].includes(value));

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300 font-semibold">Zeitraum:</span>
        <div className="flex gap-1">
          {PERIODS.map(period => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all disabled:opacity-60 ${
                timePeriod === period ? 'text-white border-2' : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
              }`}
              style={timePeriod === period ? { backgroundColor: BIMATIC_BLUE, borderColor: BIMATIC_LIGHT } : {}}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {intervals.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold">Intervall:</span>
          <div className="flex gap-1">
            {intervals.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onIntervalChange(value)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all disabled:opacity-60 ${
                  interval === value ? 'bg-purple-600 text-white border-2 border-purple-400' : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <span className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
          <Loader2 className="w-4 h-4 animate-spin" />
          Lädt...
        </span>
      )}
    </div>
  );
}
