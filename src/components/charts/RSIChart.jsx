import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';
import { ChartHeader } from '../ui';
import { CHART_COLORS, TOOLTIP_STYLE } from '../../constants';

/**
 * RSI (Relative Strength Index) chart
 * @param {Object} props
 * @param {Array} props.data - Stock data array with RSI values
 */
export function RSIChart({ data }) {
  const chartData = data.slice(-60);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <ChartHeader
        icon={Activity}
        title="RSI (Relative Strength Index)"
        color={CHART_COLORS.rsi}
        infoKey="rsi"
      />

      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#cbd5e1', fontSize: 11 }}
            ticks={[0, 30, 50, 70, 100]}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />

          {/* Overbought/Oversold Lines */}
          <ReferenceLine y={70} stroke={CHART_COLORS.resistance} strokeWidth={2} strokeDasharray="4 4" />
          <ReferenceLine y={30} stroke={CHART_COLORS.support} strokeWidth={2} strokeDasharray="4 4" />

          <Area type="monotone" dataKey="rsi" stroke={CHART_COLORS.rsi} fill={CHART_COLORS.rsi} fillOpacity={0.2} />
          <Line type="monotone" dataKey="rsi" stroke={CHART_COLORS.rsi} strokeWidth={3} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex justify-between text-sm font-bold mt-3 px-4">
        <span className="text-green-400">&le;30 Überverkauft (Kaufzone)</span>
        <span className="text-red-400">&ge;70 Überkauft (Verkaufszone)</span>
      </div>
    </div>
  );
}
