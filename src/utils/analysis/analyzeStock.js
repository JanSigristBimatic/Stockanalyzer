import { calcSMA, calcRSI, calcMACD, calcBollinger, calcOBV, calcATR, calcStochastic, calcADX } from '../indicators';
import { calcFibonacci } from './fibonacci';
import { calcSupportResistance } from './supportResistance';
import { generateVerdict } from './verdict';
import { findLastCrossover } from './crossover';

const VOLUME_AVERAGE_BARS = 20;
const PRICE_DIRECTION_BARS = 5;
const OBV_TREND_BARS = 5;
// Difference of the two OBV window averages, measured in average bar volumes
const OBV_TREND_THRESHOLD = 1;
const BOLLINGER_EDGE_SHARE = 0.2;
const RSI_OVERBOUGHT = 70;
const RSI_OVERSOLD = 30;

/**
 * Runs the complete technical analysis for a bar series.
 * Indicators are calculated on all bars (incl. prefetch) so they are warmed up at the first
 * display bar; Fibonacci, support/resistance, the snapshot and the verdict use the display bars.
 * @param {Array} bars - OHLCV bars including the prefetch
 * @param {Object} [options]
 * @param {number} [options.prefetchCount=0] - Leading bars used only for warm-up
 * @param {Object|null} [options.fundamentals=null] - Fundamental data for the verdict
 * @param {number|null} [options.dailyChangePercent=null] - Change against the previous close
 * @param {boolean} [options.lastBarComplete=true] - False while the current session is still running
 * @param {string} [options.currency] - Quote currency for price texts in the verdict
 * @param {number} [options.priceHint] - Decimal places for price texts in the verdict
 * @returns {{chartData: Array, indicators: Object, fibonacci: Object, supportResistance: Object, verdict: Object}}
 */
export function analyzeStock(bars, {
  prefetchCount = 0, fundamentals = null, dailyChangePercent = null, lastBarComplete = true, currency, priceHint
} = {}) {
  const series = calcIndicatorSeries(bars);
  const chartData = bars
    .map((bar, i) => ({ ...bar, ...seriesValuesAt(series, i) }))
    .slice(prefetchCount);

  const displayBars = bars.slice(prefetchCount);
  const fibonacci = calcFibonacci(displayBars);
  const supportResistance = calcSupportResistance(displayBars);
  const indicators = buildSnapshot(series, bars, displayBars, { dailyChangePercent, lastBarComplete });
  const verdict = generateVerdict({ indicators, fibonacci, supportResistance, fundamentals, currency, priceHint });

  return { chartData, indicators, fibonacci, supportResistance, verdict };
}

/**
 * Condenses an analysis into the row shown by the watchlist and the scanner.
 * The score (bullish minus bearish percent, -100 to 100) ranks rows from best to worst.
 * @param {string} symbol - Yahoo symbol
 * @param {{indicators: Object, verdict: Object}} analysis - Result of analyzeStock
 * @param {{meta: Object, company?: Object|null, fundamentals?: Object|null}} details - Quote meta data, company and fundamentals
 */
export function toAnalysisSummary(symbol, { indicators, verdict }, { meta, company = null, fundamentals = null }) {
  const { lastPrice, volumeData } = indicators;
  const week52High = fundamentals?.week52High;

  return {
    symbol,
    name: company?.name ?? null,
    price: lastPrice,
    priceChange: indicators.priceChange,
    bullishPercent: verdict.bullishPercent,
    bearishPercent: verdict.bearishPercent,
    score: verdict.bullishPercent - verdict.bearishPercent,
    verdict: verdict.verdict,
    verdictType: verdict.verdictType,
    currency: meta.currency,
    exchange: meta.exchange,
    priceHint: meta.priceHint,
    trend: indicators.shortTrend,
    macdSignal: indicators.macdSignal,
    rsi: indicators.lastRSI,
    rsiZone: indicators.rsiSignal,
    sma200Distance: indicators.sma200Distance,
    maCross: indicators.maCross,
    volumeRatio: volumeData?.avgVolume > 0 ? volumeData.currentVolume / volumeData.avgVolume : null,
    week52HighDistance: week52High > 0 ? ((lastPrice - week52High) / week52High) * 100 : null
  };
}

function calcIndicatorSeries(bars) {
  const macd = calcMACD(bars);
  const bollinger = calcBollinger(bars);
  const stochastic = calcStochastic(bars);
  const adx = calcADX(bars);

  return {
    sma20: calcSMA(bars, 20),
    sma50: calcSMA(bars, 50),
    sma200: calcSMA(bars, 200),
    rsi: calcRSI(bars),
    macd: macd.macdLine,
    signal: macd.signalLine,
    histogram: macd.histogram,
    bbUpper: bollinger.map(band => band.upper),
    bbMiddle: bollinger.map(band => band.middle),
    bbLower: bollinger.map(band => band.lower),
    obv: calcOBV(bars),
    atr: calcATR(bars),
    stochK: stochastic.stochK,
    stochD: stochastic.stochD,
    adx: adx.adx,
    plusDI: adx.plusDI,
    minusDI: adx.minusDI
  };
}

function seriesValuesAt(series, index) {
  return Object.fromEntries(Object.entries(series).map(([key, values]) => [key, values[index]]));
}

function buildSnapshot(series, bars, displayBars, { dailyChangePercent, lastBarComplete }) {
  const lastPrice = displayBars[displayBars.length - 1].close;
  const lastRSI = last(series.rsi);
  const sma20 = last(series.sma20);
  const sma50 = last(series.sma50);
  const sma200 = last(series.sma200);
  const histogram = last(series.histogram);

  return {
    lastPrice,
    priceChange: dailyChangePercent,
    lastRSI,
    shortTrend: sma20 == null || sma50 == null ? null : (sma20 > sma50 ? 'bullish' : 'bearish'),
    rsiSignal: getRsiZone(lastRSI),
    macdSignal: histogram == null ? null : (histogram > 0 ? 'bullish' : 'bearish'),
    sma20,
    sma50,
    sma200,
    sma200Distance: sma200 == null ? null : ((lastPrice - sma200) / sma200) * 100,
    maCross: findLastMaCross(series, bars),
    bbPosition: getBollingerPosition(lastPrice, last(series.bbUpper), last(series.bbMiddle), last(series.bbLower)),
    lastATR: last(series.atr),
    lastStochK: last(series.stochK),
    lastStochD: last(series.stochD),
    lastADX: last(series.adx),
    volumeData: buildVolumeData(displayBars, series.obv, lastBarComplete)
  };
}

/**
 * Last golden cross (SMA 50 crosses above SMA 200) or death cross (below) within the loaded bars
 */
function findLastMaCross(series, bars) {
  const cross = findLastCrossover(series.sma50, series.sma200);
  if (!cross) return null;
  return { type: cross.direction === 'up' ? 'golden' : 'death', timestamp: bars[cross.index].timestamp };
}

function getRsiZone(rsi) {
  if (rsi > RSI_OVERBOUGHT) return 'overbought';
  if (rsi < RSI_OVERSOLD) return 'oversold';
  return 'neutral';
}

function getBollingerPosition(price, upper, middle, lower) {
  if (upper == null || lower == null) return 'middle';
  if (price > upper - (upper - middle) * BOLLINGER_EDGE_SHARE) return 'upper';
  if (price < lower + (middle - lower) * BOLLINGER_EDGE_SHARE) return 'lower';
  return 'middle';
}

/**
 * Volume figures of the last completed bar. While the session runs, the last bar is still
 * forming and its partial volume would always look low, so it is left out.
 */
function buildVolumeData(bars, obv, lastBarComplete) {
  const completedBars = lastBarComplete ? bars : bars.slice(0, -1);
  const completedObv = lastBarComplete ? obv : obv.slice(0, -1);
  if (completedBars.length < PRICE_DIRECTION_BARS) return null;

  const avgVolume = average(completedBars.slice(-VOLUME_AVERAGE_BARS).map(bar => bar.volume));
  const directionWindow = completedBars.slice(-PRICE_DIRECTION_BARS);

  return {
    currentVolume: completedBars[completedBars.length - 1].volume,
    avgVolume,
    obvTrend: getObvTrend(completedObv, avgVolume),
    priceDirection: getPriceDirection(directionWindow[directionWindow.length - 1].close, directionWindow[0].close)
  };
}

/**
 * Compares the average OBV of the last bars with the bars before. The difference is scaled by
 * the average volume, which keeps the result independent of the (arbitrary) OBV level and sign.
 */
function getObvTrend(obv, avgVolume) {
  if (obv.length < OBV_TREND_BARS * 2 || !(avgVolume > 0)) return 'neutral';

  const recent = average(obv.slice(-OBV_TREND_BARS));
  const previous = average(obv.slice(-OBV_TREND_BARS * 2, -OBV_TREND_BARS));
  const change = (recent - previous) / avgVolume;

  if (change > OBV_TREND_THRESHOLD) return 'rising';
  if (change < -OBV_TREND_THRESHOLD) return 'falling';
  return 'neutral';
}

function getPriceDirection(lastClose, referenceClose) {
  if (lastClose > referenceClose) return 'up';
  if (lastClose < referenceClose) return 'down';
  return 'flat';
}

function last(values) {
  return values[values.length - 1] ?? null;
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
