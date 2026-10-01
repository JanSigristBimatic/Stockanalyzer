import { DollarSign } from 'lucide-react';
import { Disclaimer } from '../../components/ui';
import { FundamentalDataCard } from './FundamentalDataCard';

/**
 * Fundamentals tab: valuation, profitability, growth and analyst data
 */
export function FundamentalsTab({ data, currency, priceHint }) {
  if (!data) {
    return (
      <div className="text-center py-20">
        <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-300 text-xl font-semibold">Keine Kennzahlen verfügbar</p>
        <p className="text-slate-400 mt-2">Für dieses Symbol sind keine fundamentalen Daten vorhanden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FundamentalDataCard data={data} currency={currency} priceHint={priceHint} />
      <Disclaimer />
    </div>
  );
}
