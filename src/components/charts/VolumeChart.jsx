import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { ChartHeader } from '../ui';
import { BIMATIC_BLUE, CHART_COLORS, TOOLTIP_STYLE } from '../../constants';
import { reduceChartData } from '../../utils/chartData';

/**
 * Volume and OBV (On-Balance Volume) chart
 * @param {Object} props
 * @param {Array} props.data - Stock data array with volume and OBV values
 */
export function VolumeChart({ data }) {
  const chartData = reduceChartData(data);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <ChartHeader
        icon={BarChart3}
        title="Volumen & OBV (On-Balance Volume)"
        color={CHART_COLORS.obv}
        infoKey="volume"
      />

      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <YAxis
            yAxisId="volume"
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
          />
          <YAxis
            yAxisId="obv"
            orientation="right"
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            tickFormatter={(v) => `${(v / 1000000000).toFixed(1)}B`}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />

          <Bar yAxisId="volume" dataKey="volume" fill={BIMATIC_BLUE} fillOpacity={0.5} />
          <Line yAxisId="obv" type="monotone" dataKey="obv" stroke={CHART_COLORS.obv} strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 text-sm font-semibold mt-3">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded" style={{ backgroundColor: BIMATIC_BLUE }} />
          Volumen (links)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-cyan-400" />
          OBV (rechts)
        </span>
      </div>
    </div>
  );
}
