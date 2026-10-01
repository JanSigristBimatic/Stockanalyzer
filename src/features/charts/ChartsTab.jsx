import { Disclaimer } from '../../components/ui';
import { PriceChart } from './PriceChart';
import { FibonacciAndSRCards } from './FibonacciAndSRCards';
import { RSIChart } from './RSIChart';
import { MACDChart } from './MACDChart';
import { VolumeChart } from './VolumeChart';
import { ATRChart } from './ATRChart';
import { StochasticChart } from './StochasticChart';
import { ADXChart } from './ADXChart';

/**
 * Charts tab: price chart with levels plus all indicator charts
 */
export function ChartsTab({ stockData, fibonacci, supportResistance, indicators, currency, priceHint }) {
  return (
    <div className="space-y-6">
      <PriceChart
        data={stockData}
        fibonacci={fibonacci}
        supportResistance={supportResistance}
        currency={currency}
        priceHint={priceHint}
      />
      <FibonacciAndSRCards
        fibonacci={fibonacci}
        supportResistance={supportResistance}
        indicators={indicators}
        currency={currency}
        priceHint={priceHint}
      />
      <RSIChart data={stockData} />
      <MACDChart data={stockData} />
      <VolumeChart data={stockData} />
      <ATRChart data={stockData} />
      <StochasticChart data={stockData} />
      <ADXChart data={stockData} />
      <Disclaimer />
    </div>
  );
}
