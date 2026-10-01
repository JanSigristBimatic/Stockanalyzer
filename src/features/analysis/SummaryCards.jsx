import { TrendingUp, TrendingDown } from 'lucide-react';
import { SignalBadge, InfoTooltip } from '../../components/ui';
import { INDICATOR_INFO } from '../../constants';

export function SummaryCards({ symbol, indicators }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1">{symbol} Kurs</div>
        <div className="text-2xl font-bold text-white">${indicators.lastPrice.toFixed(2)}</div>
        <div className={`text-base font-bold flex items-center gap-1 mt-1 ${parseFloat(indicators.priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {parseFloat(indicators.priceChange) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {indicators.priceChange}%
        </div>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1 flex items-center">
          RSI (14)
          <InfoTooltip info={INDICATOR_INFO.rsi} />
        </div>
        <div className="text-2xl font-bold text-white">{indicators.lastRSI?.toFixed(1)}</div>
        <div className="mt-1">
          <SignalBadge
            type={indicators.rsiSignal}
            label={indicators.rsiSignal === 'overbought' ? 'Überkauft' : indicators.rsiSignal === 'oversold' ? 'Überverkauft' : 'Neutral'}
          />
        </div>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1 flex items-center">
          Trend (SMA)
          <InfoTooltip info={INDICATOR_INFO.sma} />
        </div>
        <div className="text-xl font-bold text-white mb-1">
          {indicators.shortTrend === 'bullish' ? '↗ Aufwärts' : '↘ Abwärts'}
        </div>
        <SignalBadge type={indicators.shortTrend} label={indicators.shortTrend === 'bullish' ? 'Bullish' : 'Bearish'} />
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1 flex items-center">
          MACD
          <InfoTooltip info={INDICATOR_INFO.macd} />
        </div>
        <div className="text-xl font-bold text-white mb-1">
          {indicators.macdSignal === 'bullish' ? 'Kaufsignal' : 'Verkaufssignal'}
        </div>
        <SignalBadge type={indicators.macdSignal} label={indicators.macdSignal === 'bullish' ? 'Bullish' : 'Bearish'} />
      </div>
    </div>
  );
}
