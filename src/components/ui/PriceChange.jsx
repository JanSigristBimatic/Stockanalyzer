import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercent } from '../../utils/format';

/**
 * Colored percentage change with sign; gray dash when the value is missing
 */
export function PriceChange({ value, withIcon = false }) {
  const isMissing = value == null;
  const isUp = value >= 0;
  const color = isMissing ? 'text-slate-400' : isUp ? 'text-green-400' : 'text-red-400';
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>
      {withIcon && !isMissing && <Icon className="w-4 h-4" />}
      {formatPercent(value)}
    </span>
  );
}
