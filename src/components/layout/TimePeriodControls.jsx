import { Clock } from 'lucide-react';
import { BIMATIC_BLUE, BIMATIC_LIGHT, CHART_INTERVALS } from '../../constants';

export function TimePeriodControls({ timePeriod, interval, onPeriodChange, onIntervalChange }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300 font-semibold">Zeitraum:</span>
        <div className="flex gap-1">
          {['1M', '3M', '6M', '1Y', '2Y', '5Y'].map(period => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                timePeriod === period ? 'text-white border-2' : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
              }`}
              style={timePeriod === period ? { backgroundColor: BIMATIC_BLUE, borderColor: BIMATIC_LIGHT } : {}}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {['1M', '3M'].includes(timePeriod) && (
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold">Intervall:</span>
          <div className="flex gap-1">
            {CHART_INTERVALS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onIntervalChange(value)}
                className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                  interval === value ? 'bg-purple-600 text-white border-2 border-purple-400' : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
