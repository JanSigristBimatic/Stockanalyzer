import { Wifi } from 'lucide-react';
import { toMainCurrency } from '../../utils/format';

/**
 * Shows exchange, currency and the time of the last quote (Yahoo data can be delayed)
 */
export function DataSourceBadge({ meta }) {
  const quoteTime = meta.regularMarketTime
    ? new Date(meta.regularMarketTime * 1000).toLocaleString('de-CH', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
    : null;

  return (
    <div className="mb-5 p-3 rounded-xl flex items-center gap-3 bg-green-900/50 border-2 border-green-600">
      <Wifi className="w-5 h-5 text-green-400" />
      <span className="text-green-200 font-bold">
        Kurse von {meta.exchange} in {toMainCurrency(meta.currency)}
        {quoteTime && <span className="font-medium text-green-300">, Stand {quoteTime}</span>}
      </span>
    </div>
  );
}
