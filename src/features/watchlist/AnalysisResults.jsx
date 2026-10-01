import { CheckCircle2, Eye } from 'lucide-react';

/**
 * Results of "Alle analysieren", sorted by bullish percentage
 */
export function AnalysisResults({ results, onAnalyze, onClose }) {
  const sortedResults = [...results].sort((a, b) => b.bullishPercent - a.bullishPercent);

  return (
    <div className="bg-slate-900 border-2 border-green-600/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Analyseergebnisse</h3>
          <span className="text-slate-400 text-sm">({sortedResults.length} Aktien, sortiert nach Bullish %)</span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
        >
          Schliessen
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedResults.map((result) => (
          <div
            key={result.symbol}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              result.bullishPercent >= 70
                ? 'bg-green-900/30 border border-green-600'
                : result.bullishPercent <= 30
                ? 'bg-red-900/30 border border-red-600'
                : 'bg-slate-800 border border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold ${
                result.bullishPercent >= 70 ? 'bg-green-600 text-white' :
                result.bullishPercent <= 30 ? 'bg-red-600 text-white' :
                'bg-yellow-600 text-white'
              }`}>
                {result.bullishPercent}%
              </div>
              <div>
                <div className="text-white font-bold">{result.symbol}</div>
                <div className={`text-sm font-medium ${
                  result.verdictType.includes('bullish') ? 'text-green-400' :
                  result.verdictType.includes('bearish') ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {result.verdict}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-white font-semibold">
                  {result.currency === 'USD' ? '$' : result.currency === 'EUR' ? '€' : result.currency + ' '}
                  {result.price?.toFixed(2)}
                </div>
                <div className={`text-sm font-semibold ${parseFloat(result.priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(result.priceChange) >= 0 ? '+' : ''}{result.priceChange}%
                </div>
              </div>

              <div className="flex gap-1">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  result.trend === 'bullish' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                }`}>
                  {result.trend === 'bullish' ? '↗ Trend' : '↘ Trend'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  result.macdSignal === 'bullish' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                }`}>
                  MACD
                </span>
              </div>

              <button
                onClick={() => onAnalyze(result.symbol)}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                title="Details ansehen"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
