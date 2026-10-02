import { InfoTooltip, PriceChange, SignalBadge } from '../../components/ui';
import { INDICATOR_INFO } from '../../constants';
import { formatDate } from '../../utils/format';

const CROSS_LABELS = {
  golden: 'Golden Cross',
  death: 'Death Cross'
};

/**
 * Long-term trend: position relative to SMA 200 and the last golden or death cross
 */
export function LongTermTrendCard({ indicators }) {
  const { sma200Distance, maCross } = indicators;
  const isAbove = sma200Distance >= 0;

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
      <div className="text-slate-400 text-sm font-semibold mb-1 flex items-center">
        Langfristtrend (SMA 200)
        <InfoTooltip info={INDICATOR_INFO.sma200} />
      </div>

      {sma200Distance == null ? (
        <div className="text-xl font-bold text-white">Zu wenig Daten</div>
      ) : (
        <>
          <div className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            {isAbove ? 'Über SMA 200' : 'Unter SMA 200'}
            <span className="text-base"><PriceChange value={sma200Distance} /></span>
          </div>
          <SignalBadge type={isAbove ? 'bullish' : 'bearish'} label={isAbove ? 'Aufwärtstrend' : 'Abwärtstrend'} />
        </>
      )}

      {maCross && (
        <div className={`mt-3 text-sm font-semibold ${maCross.type === 'golden' ? 'text-green-400' : 'text-red-400'}`}>
          Letztes {CROSS_LABELS[maCross.type]} am {formatDate(maCross.timestamp)}
        </div>
      )}
    </div>
  );
}
