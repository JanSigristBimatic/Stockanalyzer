import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { ChartHeader, InfoTooltip } from '../../components/ui';
import { BIMATIC_BLUE, CHART_COLORS, TOOLTIP_STYLE, INDICATOR_INFO } from '../../constants';
import { reduceChartData } from '../../utils/chartData';
import { formatPrice } from '../../utils/format';

// Recharts draws an area between both values when the data key returns a [low, high] pair
const bollingerRange = (point) => (
  point.bbLower == null || point.bbUpper == null ? null : [point.bbLower, point.bbUpper]
);

/**
 * Custom tooltip that shows full date
 */
function CustomTooltip({ active, payload, label, currency, priceHint }) {
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
          <span className="font-bold text-white">
            {Array.isArray(entry.value)
              ? entry.value.map(value => formatPrice(value, currency, priceHint)).join(' bis ')
              : formatPrice(entry.value, currency, priceHint)}
          </span>
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
 * @param {string} [props.currency] - Yahoo currency code of the quote
 * @param {number} [props.priceHint] - Decimal places for prices
 */
export function PriceChart({ data, fibonacci, supportResistance, currency, priceHint }) {
  const chartData = reduceChartData(data);

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
          <Tooltip content={<CustomTooltip currency={currency} priceHint={priceHint} />} />

          {/* Fibonacci Levels */}
          {fibonacci?.levels.map((fib, i) => (
            <ReferenceLine
              key={`fib-${i}`}
              y={fib.price}
              stroke={CHART_COLORS.fibonacci}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{
                value: `${fib.label} (${formatPrice(fib.price, currency, priceHint)})`,
                position: 'right',
                fill: CHART_COLORS.fibonacci,
                fontSize: 10,
                fontWeight: 500
              }}
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

          <Area
            type="monotone"
            dataKey={bollingerRange}
            name="Bollinger-Band"
            stroke={CHART_COLORS.bollinger}
            strokeOpacity={0.4}
            fill={CHART_COLORS.bollinger}
            fillOpacity={0.12}
          />
          <Line type="monotone" dataKey="close" name="Kurs" stroke={CHART_COLORS.price} strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="sma20" name="SMA 20" stroke={CHART_COLORS.sma20} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sma50" name="SMA 50" stroke={CHART_COLORS.sma50} strokeWidth={2} dot={false} />
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
      <LegendItem color={CHART_COLORS.bollinger} label="Bollinger-Band" />
      <LegendItem color={CHART_COLORS.fibonacci} label="Fibonacci" dashed infoKey="fibonacci" />
      <LegendItem color={CHART_COLORS.support} label="Support" />
      <LegendItem color={CHART_COLORS.resistance} label="Resistance" />
    </div>
  );
}

function LegendItem({ color, label, dashed, infoKey }) {
  const info = infoKey ? INDICATOR_INFO[infoKey] : null;

  return (
    <span className="flex items-center gap-1">
      <span
        className="w-4 h-1 rounded"
        style={{
          backgroundColor: dashed ? 'transparent' : color,
          borderTop: dashed ? `2px dashed ${color}` : 'none'
        }}
      />
      {label}
      {info && <InfoTooltip info={info} />}
    </span>
  );
}
