import { Disclaimer } from '../../components/ui';
import { VerdictCard } from './VerdictCard';
import { WatchlistButton } from './WatchlistButton';
import { SummaryCards } from './SummaryCards';
import { CompanyInfoCard } from './CompanyInfoCard';
import { LongTermTrendCard } from './LongTermTrendCard';
import { RiskCalculator } from './RiskCalculator';
import { UpcomingEvents } from './UpcomingEvents';

/**
 * Analysis tab: overall verdict, upcoming events, key indicators and company information
 */
export function AnalysisTab({
  symbol, verdict, indicators, supportResistance, events, companyInfo, currency, priceHint,
  isInWatchlist, onAddToWatchlist, onRemoveFromWatchlist
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
      <div className="grid md:grid-cols-2 gap-4 items-start">
        <LongTermTrendCard indicators={indicators} />
        <RiskCalculator
          indicators={indicators}
          supportResistance={supportResistance}
          currency={currency}
          priceHint={priceHint}
        />
      </div>
      {companyInfo && <CompanyInfoCard info={companyInfo} />}
      <Disclaimer />
    </div>
  );
}
