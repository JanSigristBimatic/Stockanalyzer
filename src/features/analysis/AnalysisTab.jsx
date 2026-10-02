import { Disclaimer } from '../../components/ui';
import { VerdictCard } from './VerdictCard';
import { WatchlistButton } from './WatchlistButton';
import { SummaryCards } from './SummaryCards';
import { CompanyInfoCard } from './CompanyInfoCard';
import { LongTermTrendCard } from './LongTermTrendCard';
import { RiskCalculator } from './RiskCalculator';
import { UpcomingEvents } from './UpcomingEvents';
import { NewsCard } from './NewsCard';
import { PriceOverviewCard } from './PriceOverviewCard';

/**
 * Analysis tab: overall verdict, upcoming events, key indicators, price chart, news and company information
 */
export function AnalysisTab({
  symbol, verdict, indicators, chartData, supportResistance, events, companyInfo, currency, priceHint, interval,
  isInWatchlist, onAddToWatchlist, onRemoveFromWatchlist, onOpenCharts
}) {
  return (
    <div className="space-y-6">
      <VerdictCard verdict={verdict} />
      <UpcomingEvents events={events} />
      <WatchlistButton
        symbol={symbol}
        isInWatchlist={isInWatchlist}
        onAdd={onAddToWatchlist}
        onRemove={onRemoveFromWatchlist}
      />
      <SummaryCards symbol={symbol} indicators={indicators} currency={currency} priceHint={priceHint} />
      <PriceOverviewCard
        chartData={chartData}
        supportResistance={supportResistance}
        currency={currency}
        priceHint={priceHint}
        interval={interval}
        onOpenCharts={onOpenCharts}
      />
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <LongTermTrendCard indicators={indicators} />
        <RiskCalculator
          indicators={indicators}
          supportResistance={supportResistance}
          currency={currency}
          priceHint={priceHint}
        />
      </div>
      <NewsCard symbol={symbol} companyName={companyInfo?.name ?? null} />
      {companyInfo && <CompanyInfoCard info={companyInfo} />}
      <Disclaimer />
    </div>
  );
}
