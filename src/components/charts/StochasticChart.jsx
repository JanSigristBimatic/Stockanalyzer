import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';
import { ChartHeader } from '../ui';
import { CHART_COLORS, TOOLTIP_STYLE } from '../../constants';
import { reduceChartData } from '../../utils/chartData';

/**
 * Stochastic Oscillator chart
 * @param {Object} props
 * @param {Array} props.data - Stock data array with stochastic values
 */
export function StochasticChart({ data }) {
  const chartData = reduceChartData(data);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <ChartHeader
        icon={Activity}
        title="Stochastik Oszillator"
        color={CHART_COLORS.stochK}
        infoKey="stochastic"
      />

      <ResponsiveContainer width="100%" height={140}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            ticks={[0, 20, 50, 80, 100]}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />

          {/* Overbought/Oversold Lines */}
          <ReferenceLine y={80} stroke={CHART_COLORS.resistance} strokeDasharray="4 4" />
          <ReferenceLine y={20} stroke={CHART_COLORS.support} strokeDasharray="4 4" />

          <Area
            type="monotone"
            dataKey="stochK"
            stroke={CHART_COLORS.stochK}
            fill={CHART_COLORS.stochK}
            fillOpacity={0.2}
          />
          <Line type="monotone" dataKey="stochK" stroke={CHART_COLORS.stochK} strokeWidth={2} dot={false} name="%K" />
          <Line type="monotone" dataKey="stochD" stroke={CHART_COLORS.stochD} strokeWidth={2} dot={false} name="%D" />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 text-sm font-semibold mt-2">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-pink-500" />
          %K (Fast)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-purple-500" />
          %D (Slow)
        </span>
      </div>
      <p className="text-slate-400 text-xs text-center mt-2">
        &gt;80 Überkauft, &lt;20 Überverkauft
      </p>
    </div>
  );
}
