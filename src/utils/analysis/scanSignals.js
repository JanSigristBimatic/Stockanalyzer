// Ten trading days, measured in calendar time
const RECENT_CROSS_SECONDS = 14 * 24 * 60 * 60;
const VOLUME_SPIKE_RATIO = 2;
const NEAR_HIGH_PERCENT = -3;

const isRecentCross = (row, type, nowSeconds) => (
  row.maCross?.type === type && nowSeconds - row.maCross.timestamp <= RECENT_CROSS_SECONDS
);

/**
 * Notable events of a scan row; type colors the badge like a bullish or bearish signal
 */
export const SCAN_SIGNALS = [
  {
    id: 'goldenCross',
    label: 'Golden Cross',
    description: 'SMA 50 hat den SMA 200 in den letzten zwei Wochen nach oben gekreuzt',
    type: 'bullish',
    matches: (row, nowSeconds) => isRecentCross(row, 'golden', nowSeconds)
  },
  {
    id: 'deathCross',
    label: 'Death Cross',
    description: 'SMA 50 hat den SMA 200 in den letzten zwei Wochen nach unten gekreuzt',
    type: 'bearish',
    matches: (row, nowSeconds) => isRecentCross(row, 'death', nowSeconds)
  },
  {
    id: 'oversold',
    label: 'Überverkauft',
    description: 'RSI unter 30',
    type: 'bullish',
    matches: (row) => row.rsiZone === 'oversold'
  },
  {
    id: 'overbought',
    label: 'Überkauft',
    description: 'RSI über 70',
    type: 'bearish',
    matches: (row) => row.rsiZone === 'overbought'
  },
  {
    id: 'volumeSpike',
    label: 'Hohes Volumen',
    description: 'Letzte Kerze mit mindestens doppeltem Durchschnittsvolumen',
    type: 'neutral',
    matches: (row) => row.volumeRatio >= VOLUME_SPIKE_RATIO
  },
  {
    id: 'near52WeekHigh',
    label: 'Nahe 52W-Hoch',
    description: 'Kurs höchstens 3% unter dem 52-Wochen-Hoch',
    type: 'bullish',
    matches: (row) => Number.isFinite(row.week52HighDistance) && row.week52HighDistance >= NEAR_HIGH_PERCENT
  }
];

/**
 * Events that apply to a scan row
 * @param {Object} row - Result of toAnalysisSummary
 * @param {number} [nowSeconds]
 * @returns {Array<Object>} - Entries of SCAN_SIGNALS
 */
export function getScanSignals(row, nowSeconds = Date.now() / 1000) {
  return SCAN_SIGNALS.filter(signal => signal.matches(row, nowSeconds));
}
