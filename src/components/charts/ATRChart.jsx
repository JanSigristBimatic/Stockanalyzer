import React from 'react';
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { ChartHeader } from '../ui';
import { CHART_COLORS, TOOLTIP_STYLE } from '../../constants';
import { reduceChartData } from '../../utils/chartData';

/**
 * ATR (Average True Range) volatility chart
 * @param {Object} props
 * @param {Array} props.data - Stock data array with ATR values
 */
export function ATRChart({ data }) {
  const chartData = reduceChartData(data);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <ChartHeader
        icon={Activity}
        title="ATR - Average True Range (Volatilität)"
        color={CHART_COLORS.atr}
        infoKey="atr"
      />

      <ResponsiveContainer width="100%" height={140}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} tickFormatter={(v) => v.toFixed(2)} />
          <Tooltip
            contentStyle={{ ...TOOLTIP_STYLE, border: '2px solid #f97316' }}
            formatter={(value) => [value?.toFixed(2), 'ATR']}
          />
          <Area
            type="monotone"
            dataKey="atr"
            stroke={CHART_COLORS.atr}
            fill={CHART_COLORS.atr}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 text-sm font-semibold mt-2">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-orange-500" />
          ATR (14)
        </span>
      </div>
      <p className="text-slate-400 text-xs text-center mt-2">
        Höhere Werte = Höhere Volatilität
      </p>
    </div>
  );
}
