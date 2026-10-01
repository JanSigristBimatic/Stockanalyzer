import { DollarSign } from 'lucide-react';
import { getRecommendationLabel } from '../../constants';
import { formatMarketCap } from '../../utils/format';
import { MetricCard } from './MetricCard';

export function FundamentalDataCard({ data }) {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-6 h-6 text-amber-400" />
        <h2 className="text-xl font-bold text-white">Fundamentale Kennzahlen</h2>
      </div>

      {/* Bewertungskennzahlen */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Bewertung</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data.peRatio != null && (
            <MetricCard
              label="KGV (P/E)"
              value={data.peRatio.toFixed(1)}
              subValue={data.forwardPE && `Forward: ${data.forwardPE.toFixed(1)}`}
              highlight={data.peRatio < 15 ? 'green' : data.peRatio > 30 ? 'red' : null}
            />
          )}
          {data.pegRatio != null && (
            <MetricCard
              label="PEG Ratio"
              value={data.pegRatio.toFixed(2)}
              subValue={data.pegRatio < 1 ? 'Unterbewertet' : data.pegRatio > 2 ? 'Überbewertet' : 'Fair'}
              highlight={data.pegRatio < 1 ? 'green' : data.pegRatio > 2 ? 'red' : null}
            />
          )}
          {data.priceToBook != null && (
            <MetricCard
              label="KBV (P/B)"
              value={data.priceToBook.toFixed(2)}
              highlight={data.priceToBook < 1 ? 'green' : data.priceToBook > 5 ? 'red' : null}
            />
          )}
          {data.priceToSales != null && (
            <MetricCard label="KUV (P/S)" value={data.priceToSales.toFixed(2)} />
          )}
          {data.marketCap && (
            <MetricCard label="Marktkapitalisierung" value={formatMarketCap(data.marketCap)} />
          )}
        </div>
      </div>

      {/* Profitabilität */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Profitabilität</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data.returnOnEquity != null && (
            <MetricCard
              label="ROE"
              value={`${(data.returnOnEquity * 100).toFixed(1)}%`}
              subValue={data.returnOnEquity > 0.15 ? 'Sehr gut' : data.returnOnEquity > 0.1 ? 'Gut' : 'Niedrig'}
              highlight={data.returnOnEquity > 0.15 ? 'green' : data.returnOnEquity < 0.05 ? 'red' : null}
            />
          )}
          {data.returnOnAssets != null && (
            <MetricCard
              label="ROA"
              value={`${(data.returnOnAssets * 100).toFixed(1)}%`}
              highlight={data.returnOnAssets > 0.1 ? 'green' : data.returnOnAssets < 0.02 ? 'red' : null}
            />
          )}
          {data.profitMargin != null && (
            <MetricCard
              label="Gewinnmarge"
              value={`${(data.profitMargin * 100).toFixed(1)}%`}
              highlight={data.profitMargin > 0.15 ? 'green' : data.profitMargin < 0 ? 'red' : null}
            />
          )}
          {data.operatingMargin != null && (
            <MetricCard
              label="Operative Marge"
              value={`${(data.operatingMargin * 100).toFixed(1)}%`}
            />
          )}
          {data.eps != null && (
            <MetricCard
              label="EPS"
              value={`$${data.eps.toFixed(2)}`}
              subValue={data.forwardEps && `Forward: $${data.forwardEps.toFixed(2)}`}
            />
          )}
        </div>
      </div>

      {/* Wachstum */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Wachstum</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data.earningsGrowth != null && (
            <MetricCard
              label="Gewinnwachstum"
              value={`${(data.earningsGrowth * 100).toFixed(1)}%`}
              highlight={data.earningsGrowth > 0.15 ? 'green' : data.earningsGrowth < 0 ? 'red' : null}
            />
          )}
          {data.revenueGrowth != null && (
            <MetricCard
              label="Umsatzwachstum"
              value={`${(data.revenueGrowth * 100).toFixed(1)}%`}
              highlight={data.revenueGrowth > 0.1 ? 'green' : data.revenueGrowth < 0 ? 'red' : null}
            />
          )}
          {data.week52High != null && data.week52Low != null && (
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-3">
              <div className="text-slate-400 text-xs font-semibold mb-1">52-Wochen Range</div>
              <div className="text-sm font-bold text-green-400">H: ${data.week52High.toFixed(2)}</div>
              <div className="text-sm font-bold text-red-400">L: ${data.week52Low.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Finanzielle Gesundheit */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Finanzielle Gesundheit</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data.debtToEquity != null && (
            <MetricCard
              label="Verschuldungsgrad"
              value={data.debtToEquity.toFixed(2)}
              subValue={data.debtToEquity < 1 ? 'Gesund' : data.debtToEquity > 2 ? 'Hoch' : 'Moderat'}
              highlight={data.debtToEquity < 0.5 ? 'green' : data.debtToEquity > 2 ? 'red' : null}
            />
          )}
          {data.currentRatio != null && (
            <MetricCard
              label="Current Ratio"
              value={data.currentRatio.toFixed(2)}
              subValue={data.currentRatio > 1.5 ? 'Gut' : data.currentRatio < 1 ? 'Kritisch' : 'OK'}
              highlight={data.currentRatio > 1.5 ? 'green' : data.currentRatio < 1 ? 'red' : null}
            />
          )}
          {data.quickRatio != null && (
            <MetricCard
              label="Quick Ratio"
              value={data.quickRatio.toFixed(2)}
              highlight={data.quickRatio > 1 ? 'green' : data.quickRatio < 0.5 ? 'red' : null}
            />
          )}
          {data.freeCashflow != null && (
            <MetricCard
              label="Free Cashflow"
              value={formatMarketCap(data.freeCashflow)}
              highlight={data.freeCashflow > 0 ? 'green' : 'red'}
            />
          )}
        </div>
      </div>

      {/* Dividende & Analysten */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Dividende & Analysten</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data.dividendYield != null && (
            <MetricCard
              label="Dividendenrendite"
              value={`${(data.dividendYield * 100).toFixed(2)}%`}
              subValue={data.payoutRatio && `Payout: ${(data.payoutRatio * 100).toFixed(0)}%`}
              highlight={data.dividendYield > 0.03 ? 'green' : null}
            />
          )}
          {data.beta != null && (
            <MetricCard
              label="Beta"
              value={data.beta.toFixed(2)}
              subValue={data.beta > 1.5 ? 'Volatil' : data.beta < 0.8 ? 'Defensiv' : 'Markt'}
              highlight={data.beta > 1.5 ? 'red' : data.beta < 0.8 ? 'green' : null}
            />
          )}
          {data.targetMeanPrice != null && (
            <MetricCard
              label="Analysten-Kursziel"
              value={`$${data.targetMeanPrice.toFixed(2)}`}
              subValue={data.numberOfAnalystOpinions && `${data.numberOfAnalystOpinions} Analysten`}
            />
          )}
          {data.recommendationKey && (
            <MetricCard
              label="Empfehlung"
              value={getRecommendationLabel(data.recommendationKey)}
              highlight={
                ['strongBuy', 'strong_buy', 'buy'].includes(data.recommendationKey) ? 'green'
                : ['strongSell', 'strong_sell', 'sell', 'underperform'].includes(data.recommendationKey) ? 'red'
                : null
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
