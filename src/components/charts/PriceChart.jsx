import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { ChartHeader } from '../ui';
import { BIMATIC_BLUE, CHART_COLORS, TOOLTIP_STYLE } from '../../constants';

/**
 * Custom tooltip that shows full date
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const fullDate = data?.fullDate;
  const formattedDate = fullDate
    ? fullDate.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    : label;

  return (
    <div style={TOOLTIP_STYLE} className="p-3">
      <div className="text-slate-300 text-sm font-semibold mb-2">{formattedDate}</div>
      {payload.map((entry, i) => (
        <div key={i} className="flex justify-between gap-4 text-sm">
          <span style={{ color: entry.color }}>{entry.name}:</span>
          <span className="font-bold text-white">{typeof entry.value === 'number' ? `$${entry.value.toFixed(2)}` : entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Price chart with Fibonacci levels and Support/Resistance lines
 * @param {Object} props
 * @param {Array} props.data - Stock data array
 * @param {Object} props.fibonacci - Fibonacci levels
 * @param {Object} props.supportResistance - Support and resistance levels
 */
export function PriceChart({ data, fibonacci, supportResistance }) {
  const chartData = data.slice(-60);

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <ChartHeader
        icon={BarChart3}
        title="Kursverlauf mit Fibonacci & Support/Resistance"
        color={BIMATIC_BLUE}
        infoKey="priceChart"
      />

      <Legend />

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }} />
          <YAxis domain={['auto', 'auto']} tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }} />
          <Tooltip content={<CustomTooltip />} />

          {/* Fibonacci Levels */}
          {fibonacci?.levels.map((fib, i) => (
            <ReferenceLine
              key={`fib-${i}`}
              y={fib.price}
              stroke={CHART_COLORS.fibonacci}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
          ))}

          {/* Support Lines */}
          {supportResistance?.support.map((s, i) => (
            <ReferenceLine
              key={`support-${i}`}
              y={s.price}
              stroke={CHART_COLORS.support}
              strokeWidth={2}
              strokeDasharray="6 3"
            />
          ))}

          {/* Resistance Lines */}
          {supportResistance?.resistance.map((r, i) => (
            <ReferenceLine
              key={`resistance-${i}`}
              y={r.price}
              stroke={CHART_COLORS.resistance}
              strokeWidth={2}
              strokeDasharray="6 3"
            />
          ))}

          <Area type="monotone" dataKey="bbUpper" stroke="transparent" fill="#64748b" fillOpacity={0.1} />
          <Line type="monotone" dataKey="close" stroke={CHART_COLORS.price} strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="sma20" stroke={CHART_COLORS.sma20} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sma50" stroke={CHART_COLORS.sma50} strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function Legend() {
  return (
    <div className="text-sm text-slate-300 mb-4 flex flex-wrap gap-4 font-semibold">
      <LegendItem color={BIMATIC_BLUE} label="Kurs" />
      <LegendItem color={CHART_COLORS.sma20} label="SMA 20" />
      <LegendItem color={CHART_COLORS.sma50} label="SMA 50" />
      <LegendItem color={CHART_COLORS.support} label="Support" />
      <LegendItem color={CHART_COLORS.resistance} label="Resistance" />
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <span className="flex items-center gap-2">
      <span className="w-4 h-1 rounded" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
