import React from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Zap } from 'lucide-react';
import { ChartHeader } from '../ui';
import { CHART_COLORS, TOOLTIP_STYLE } from '../../constants';
import { reduceChartData } from '../../utils/chartData';

/**
 * ADX (Average Directional Index) trend strength chart
 * @param {Object} props
 * @param {Array} props.data - Stock data array with ADX values
 */
export function ADXChart({ data }) {
  const chartData = reduceChartData(data);
  const lastData = chartData[chartData.length - 1];
  const lastADX = lastData?.adx;
  const plusDI = lastData?.plusDI;
  const minusDI = lastData?.minusDI;

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <ChartHeader
        icon={Zap}
        title="ADX - Average Directional Index (Trendstärke)"
        color={CHART_COLORS.adx}
        infoKey="adx"
      />

      <ResponsiveContainer width="100%" height={140}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <YAxis domain={[0, 60]} tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />

          {/* Trend Strength Thresholds */}
          <ReferenceLine y={20} stroke="#64748b" strokeDasharray="4 4" />
          <ReferenceLine y={40} stroke="#64748b" strokeDasharray="4 4" />

          <Line type="monotone" dataKey="adx" stroke={CHART_COLORS.adx} strokeWidth={3} dot={false} name="ADX" />
          <Line type="monotone" dataKey="plusDI" stroke={CHART_COLORS.plusDI} strokeWidth={2} dot={false} name="+DI" />
          <Line type="monotone" dataKey="minusDI" stroke={CHART_COLORS.minusDI} strokeWidth={2} dot={false} name="-DI" />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 text-sm font-semibold mt-2">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-yellow-400" />
          ADX
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-500" />
          +DI
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-red-500" />
          -DI
        </span>
      </div>

      {lastADX && (
        <div className="mt-3 p-2 bg-slate-800 rounded-lg text-center">
          <span className="text-white text-sm font-medium">
            Trendstärke: {getTrendStrength(lastADX)}
            {plusDI && minusDI && (
              <span className={plusDI > minusDI ? 'text-green-400' : 'text-red-400'}>
                {' '}({plusDI > minusDI ? 'Aufwärts' : 'Abwärts'})
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

function getTrendStrength(adx) {
  if (adx < 20) return 'Schwach / Seitwärts';
  if (adx < 40) return 'Mittel';
  return 'Stark';
}
