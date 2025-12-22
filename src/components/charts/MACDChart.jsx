import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { ChartHeader } from '../ui';
import { BIMATIC_BLUE, CHART_COLORS, TOOLTIP_STYLE } from '../../constants';

/**
 * MACD (Moving Average Convergence Divergence) chart
 * @param {Object} props
 * @param {Array} props.data - Stock data array with MACD values
 */
export function MACDChart({ data }) {
  const chartData = data.slice(-60);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <ChartHeader
        icon={BarChart3}
        title="MACD (Moving Average Convergence Divergence)"
        color={CHART_COLORS.histogram}
        infoKey="macd"
      />

      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />

          <ReferenceLine y={0} stroke="#64748b" strokeWidth={2} />

          <Bar dataKey="histogram" fill={CHART_COLORS.histogram} fillOpacity={0.6} />
          <Line type="monotone" dataKey="macd" stroke={CHART_COLORS.macd} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="signal" stroke={CHART_COLORS.signal} strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 text-sm font-semibold mt-3">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded" style={{ backgroundColor: BIMATIC_BLUE }} />
          MACD-Linie
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-orange-400" />
          Signal-Linie
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-purple-400" />
          Histogramm
        </span>
      </div>
    </div>
  );
}
