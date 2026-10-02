import { ChartCandlestick } from 'lucide-react';
import { MiniChart } from '../charts/MiniChart';

/**
 * Compact price chart of the selected period with a link to the full chart
 */
export function PriceOverviewCard({ chartData, supportResistance, currency, priceHint, interval, onOpenCharts }) {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm font-semibold">Kursverlauf mit SMA 50, SMA 200 und Support/Widerstand</span>
        <button
          onClick={onOpenCharts}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 shrink-0"
        >
          <ChartCandlestick className="w-4 h-4" />
          Alle Indikatoren
        </button>
      </div>
      <MiniChart
        chartData={chartData}
        supportResistance={supportResistance}
        currency={currency}
        priceHint={priceHint}
        interval={interval}
      />
    </div>
  );
}
