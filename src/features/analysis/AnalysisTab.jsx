import { Disclaimer } from '../../components/ui';
import { VerdictCard } from './VerdictCard';
import { WatchlistButton } from './WatchlistButton';
import { SummaryCards } from './SummaryCards';
import { CompanyInfoCard } from './CompanyInfoCard';

/**
 * Analysis tab: overall verdict, key indicators and company information
 */
export function AnalysisTab({
  symbol, verdict, indicators, companyInfo, currency, priceHint,
  isInWatchlist, onAddToWatchlist, onRemoveFromWatchlist
}) {
  return (
    <div className="space-y-6">
      <VerdictCard verdict={verdict} />
      <WatchlistButton
        symbol={symbol}
        isInWatchlist={isInWatchlist}
        onAdd={onAddToWatchlist}
        onRemove={onRemoveFromWatchlist}
      />
      <SummaryCards symbol={symbol} indicators={indicators} currency={currency} priceHint={priceHint} />
      {companyInfo && <CompanyInfoCard info={companyInfo} />}
      <Disclaimer />
    </div>
  );
}
