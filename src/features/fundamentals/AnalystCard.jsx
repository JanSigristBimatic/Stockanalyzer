import { Users } from 'lucide-react';
import { getRecommendationLabel } from '../../constants';
import { formatPrice, formatPercent } from '../../utils/format';

const RATINGS = [
  { key: 'strongBuy', color: 'bg-green-600' },
  { key: 'buy', color: 'bg-green-400' },
  { key: 'hold', color: 'bg-slate-400' },
  { key: 'sell', color: 'bg-red-400' },
  { key: 'strongSell', color: 'bg-red-600' }
];

/**
 * Analyst consensus: distribution of ratings and the 12-month price target range against the current price
 */
export function AnalystCard({ fundamentals, ratings, currentPrice, currency, priceHint }) {
  const { targetLowPrice, targetMeanPrice, targetHighPrice, recommendationKey, recommendationMean } = fundamentals;
  const hasTargets = targetLowPrice != null && targetMeanPrice != null && targetHighPrice != null && currentPrice != null;
  if (!ratings && !hasTargets) return null;

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Analysten
        </h2>
        {recommendationKey && (
          <span className="text-slate-300 font-semibold" title="Durchschnitt aller Einstufungen: 1 = Stark Kaufen, 5 = Stark Verkaufen">
            Konsens: {getRecommendationLabel(recommendationKey)}
            {recommendationMean != null && ` (Ø ${recommendationMean.toFixed(1)})`}
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {ratings && <RatingDistribution ratings={ratings} />}
        {hasTargets && (
          <TargetRange
            low={targetLowPrice}
            mean={targetMeanPrice}
            high={targetHighPrice}
            current={currentPrice}
            count={fundamentals.numberOfAnalystOpinions}
            formatValue={(value) => formatPrice(value, currency, priceHint)}
          />
        )}
      </div>
    </div>
  );
}

function RatingDistribution({ ratings }) {
  const total = RATINGS.reduce((sum, { key }) => sum + ratings[key], 0);

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">
        Einstufungen ({total})
      </h3>
      <div className="flex h-4 rounded-full overflow-hidden bg-slate-800">
        {RATINGS.filter(({ key }) => ratings[key] > 0).map(({ key, color }) => (
          <div key={key} className={color} style={{ width: `${(ratings[key] / total) * 100}%` }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
        {RATINGS.map(({ key, color }) => (
          <span key={key} className="flex items-center gap-1.5 text-slate-300">
            <span className={`w-3 h-3 rounded-sm ${color}`} />
            {getRecommendationLabel(key)}
            <span className="text-white font-bold">{ratings[key]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function TargetRange({ low, mean, high, current, count, formatValue }) {
  // The axis also covers a current price outside the target range
  const axisMin = Math.min(low, current);
  const axisMax = Math.max(high, current);
  const position = (value) => (axisMax === axisMin ? 50 : ((value - axisMin) / (axisMax - axisMin)) * 100);
  const upside = ((mean - current) / current) * 100;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">
        Kursziele 12 Monate{count != null && ` (${count})`}
      </h3>
      <div className="relative h-4 mx-2">
        <div className="absolute top-1.5 h-1 bg-slate-800 rounded-full inset-x-0" />
        <div
          className="absolute top-1.5 h-1 bg-blue-500/60 rounded-full"
          style={{ left: `${position(low)}%`, width: `${position(high) - position(low)}%` }}
        />
        <Marker left={position(mean)} className="bg-blue-400" />
        <Marker left={position(current)} className="bg-white ring-2 ring-slate-900" />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
        <Value label="Tief" value={formatValue(low)} />
        <Value label="Durchschnitt" value={formatValue(mean)} dotClass="bg-blue-400" />
        <Value label="Hoch" value={formatValue(high)} />
      </div>
      <div className="mt-2 text-sm text-slate-300 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-white" />
        Aktueller Kurs <span className="text-white font-bold">{formatValue(current)}</span>
        <span className={upside >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
          ({formatPercent(upside, 1)} bis zum Durchschnittsziel)
        </span>
      </div>
    </div>
  );
}

function Marker({ left, className }) {
  return (
    <div
      className={`absolute top-0.5 w-3 h-3 -ml-1.5 rounded-full ${className}`}
      style={{ left: `${left}%` }}
    />
  );
}

function Value({ label, value, dotClass }) {
  return (
    <div>
      <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
        {dotClass && <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />}
        {label}
      </div>
      <div className="text-white font-bold">{value}</div>
    </div>
  );
}
