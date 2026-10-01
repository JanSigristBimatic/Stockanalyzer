import { SignalBadge, InfoTooltip, PriceChange } from '../../components/ui';
import { INDICATOR_INFO } from '../../constants';
import { formatPrice } from '../../utils/format';

const NOT_ENOUGH_DATA = 'Zu wenig Daten';

export function SummaryCards({ symbol, indicators, currency, priceHint }) {
  const { shortTrend, macdSignal } = indicators;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1">{symbol} Kurs</div>
        <div className="text-2xl font-bold text-white">{formatPrice(indicators.lastPrice, currency, priceHint)}</div>
        <div className="text-base font-bold mt-1">
          <PriceChange value={indicators.priceChange} withIcon />
        </div>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1 flex items-center">
          RSI (14)
          <InfoTooltip info={INDICATOR_INFO.rsi} />
        </div>
        <div className="text-2xl font-bold text-white">{indicators.lastRSI?.toFixed(1) ?? '–'}</div>
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
          {shortTrend === 'bullish' ? '↗ Aufwärts' : shortTrend === 'bearish' ? '↘ Abwärts' : NOT_ENOUGH_DATA}
        </div>
        {shortTrend && <SignalBadge type={shortTrend} label={shortTrend === 'bullish' ? 'Bullish' : 'Bearish'} />}
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1 flex items-center">
          MACD
          <InfoTooltip info={INDICATOR_INFO.macd} />
        </div>
        <div className="text-xl font-bold text-white mb-1">
          {macdSignal === 'bullish' ? 'Kaufsignal' : macdSignal === 'bearish' ? 'Verkaufssignal' : NOT_ENOUGH_DATA}
        </div>
        {macdSignal && <SignalBadge type={macdSignal} label={macdSignal === 'bullish' ? 'Bullish' : 'Bearish'} />}
      </div>
    </div>
  );
}
