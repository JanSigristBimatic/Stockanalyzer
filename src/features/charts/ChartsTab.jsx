import { memo } from 'react';
import { Disclaimer } from '../../components/ui';
import { ProChart } from './ProChart';
import { FibonacciAndSRCards } from './FibonacciAndSRCards';

/**
 * Charts tab: interactive chart with indicator panes plus the Fibonacci and support/resistance levels.
 * Memoized so unrelated app state (watchlist, scanner, loading flags) does not rebuild the chart.
 */
export const ChartsTab = memo(function ChartsTab({
  chartData, fibonacci, supportResistance, indicators, currency, priceHint, interval
}) {
  return (
    <div className="space-y-6">
      <ProChart
        chartData={chartData}
        fibonacci={fibonacci}
        supportResistance={supportResistance}
        currency={currency}
        priceHint={priceHint}
        interval={interval}
      />
      <FibonacciAndSRCards
        fibonacci={fibonacci}
        supportResistance={supportResistance}
        indicators={indicators}
        currency={currency}
        priceHint={priceHint}
      />
      <Disclaimer />
    </div>
  );
});
