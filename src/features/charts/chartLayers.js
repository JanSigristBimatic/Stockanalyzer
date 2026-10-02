import { CandlestickSeries, HistogramSeries, LineSeries, LineStyle } from 'lightweight-charts';
import { CHART_COLORS } from '../../constants';
import { toCandles, toColoredBars, toLinePoints } from '../../utils/chartSeries';
import { createQuoteFormatter, formatCompactNumber } from '../../utils/format';
import { CANDLE_COLORS } from './chartTheme';

const REFERENCE_COLOR = '#64748b';
const VOLUME_COLORS = { up: 'rgba(34, 197, 94, 0.45)', down: 'rgba(239, 68, 68, 0.45)' };
const isUpBar = (bar) => bar.close >= (bar.open ?? bar.close);

/**
 * Lines drawn over the candles. Every entry is a toggle of the chart toolbar.
 */
export const PRICE_OVERLAYS = [
  { id: 'sma20', label: 'SMA 20', color: CHART_COLORS.sma20, lines: [{ key: 'sma20', label: 'SMA 20' }] },
  { id: 'sma50', label: 'SMA 50', color: CHART_COLORS.sma50, lines: [{ key: 'sma50', label: 'SMA 50' }] },
  { id: 'sma200', label: 'SMA 200', color: CHART_COLORS.sma200, lines: [{ key: 'sma200', label: 'SMA 200' }] },
  {
    id: 'bollinger',
    label: 'Bollinger',
    color: CHART_COLORS.bollinger,
    lines: [{ key: 'bbUpper', label: 'BB oben' }, { key: 'bbLower', label: 'BB unten' }]
  }
];

/**
 * Horizontal price levels from the analysis, also toggled in the toolbar
 */
export const PRICE_LEVELS = [
  { id: 'levels', label: 'Support/Widerstand', color: CHART_COLORS.support },
  { id: 'fibonacci', label: 'Fibonacci', color: CHART_COLORS.fibonacci }
];

/**
 * Indicator panes below the price pane, in display order. A series formats its values as
 * 'quote' (price units), 'decimal' (oscillators) or 'compact' (volume sizes).
 */
export const INDICATOR_PANES = [
  {
    id: 'volume',
    label: 'Volumen',
    infoKey: 'volume',
    series: [{
      key: 'volume', label: 'Vol', type: 'histogram', format: 'compact',
      colorOf: (bar) => (isUpBar(bar) ? VOLUME_COLORS.up : VOLUME_COLORS.down)
    }]
  },
  {
    id: 'rsi',
    label: 'RSI 14',
    infoKey: 'rsi',
    range: { minValue: 0, maxValue: 100 },
    levels: [{ price: 70, color: CHART_COLORS.resistance }, { price: 30, color: CHART_COLORS.support }],
    series: [{ key: 'rsi', label: 'RSI', color: CHART_COLORS.rsi, format: 'decimal' }]
  },
  {
    id: 'macd',
    label: 'MACD 12/26/9',
    infoKey: 'macd',
    levels: [{ price: 0, color: REFERENCE_COLOR }],
    series: [
      {
        key: 'histogram', label: 'Hist.', type: 'histogram', format: 'quote',
        colorOf: (bar) => (bar.histogram >= 0 ? VOLUME_COLORS.up : VOLUME_COLORS.down)
      },
      { key: 'macd', label: 'MACD', color: CHART_COLORS.macd, format: 'quote' },
      { key: 'signal', label: 'Signal', color: CHART_COLORS.signal, format: 'quote' }
    ]
  },
  {
    id: 'stochastic',
    label: 'Stochastik 14/3',
    infoKey: 'stochastic',
    range: { minValue: 0, maxValue: 100 },
    levels: [{ price: 80, color: CHART_COLORS.resistance }, { price: 20, color: CHART_COLORS.support }],
    series: [
      { key: 'stochK', label: '%K', color: CHART_COLORS.stochK, format: 'decimal' },
      { key: 'stochD', label: '%D', color: CHART_COLORS.stochD, format: 'decimal' }
    ]
  },
  {
    id: 'adx',
    label: 'ADX 14',
    infoKey: 'adx',
    levels: [{ price: 20, color: REFERENCE_COLOR }, { price: 40, color: REFERENCE_COLOR }],
    series: [
      { key: 'adx', label: 'ADX', color: CHART_COLORS.adx, format: 'decimal' },
      { key: 'plusDI', label: '+DI', color: CHART_COLORS.plusDI, format: 'decimal' },
      { key: 'minusDI', label: '−DI', color: CHART_COLORS.minusDI, format: 'decimal' }
    ]
  },
  {
    id: 'atr',
    label: 'ATR 14',
    infoKey: 'atr',
    series: [{ key: 'atr', label: 'ATR', color: CHART_COLORS.atr, format: 'quote' }]
  },
  {
    id: 'obv',
    label: 'OBV',
    infoKey: 'volume',
    series: [{ key: 'obv', label: 'OBV', color: CHART_COLORS.obv, format: 'compact' }]
  }
];

/**
 * Custom price formats for the value formats of the series; the chart uses them for its scales
 * and the legend for its values
 * @param {string|null} currency - Yahoo currency code of the quote
 * @param {number} priceHint - Decimal places of the quote
 * @returns {Object<string, {formatter: function(number): string, minMove: number}>}
 */
export function createPriceFormats(currency, priceHint) {
  return {
    quote: { formatter: createQuoteFormatter(currency, priceHint), minMove: 10 ** -priceHint },
    decimal: { formatter: (value) => value.toFixed(1), minMove: 0.1 },
    compact: { formatter: formatCompactNumber, minMove: 1 }
  };
}

/**
 * Adds the candles of the price pane with the active overlays and price levels
 * @param {Object} chart - Lightweight Charts chart
 * @param {Object} params
 * @param {Array} params.chartData - Bars with indicator values
 * @param {Object<string, boolean>} params.visible - Active overlay and level ids
 * @param {Object} params.fibonacci - Fibonacci levels of the analysis
 * @param {Object} params.supportResistance - Support and resistance levels of the analysis
 * @param {Object} params.quoteFormat - Custom price format for quote values
 */
export function addPriceLayer(chart, { chartData, visible, fibonacci, supportResistance, quoteFormat }) {
  const priceFormat = { type: 'custom', ...quoteFormat };
  const candles = chart.addSeries(CandlestickSeries, {
    upColor: CANDLE_COLORS.up,
    downColor: CANDLE_COLORS.down,
    wickUpColor: CANDLE_COLORS.up,
    wickDownColor: CANDLE_COLORS.down,
    borderVisible: false,
    priceFormat
  });
  candles.setData(toCandles(chartData));
  candles.priceScale().applyOptions({ scaleMargins: { top: 0.08, bottom: 0.08 } });

  PRICE_OVERLAYS.filter(overlay => visible[overlay.id]).forEach(overlay => {
    overlay.lines.forEach(line => {
      const series = chart.addSeries(LineSeries, {
        color: overlay.color,
        lineWidth: 1,
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
        priceFormat
      });
      series.setData(toLinePoints(chartData, line.key));
    });
  });

  // Titles on the lines would cover the latest candles; the colored axis labels mark the levels
  if (visible.levels) {
    supportResistance.support.forEach(level => candles.createPriceLine(levelLine(level.price, CHART_COLORS.support)));
    supportResistance.resistance.forEach(level => candles.createPriceLine(levelLine(level.price, CHART_COLORS.resistance)));
  }
  if (visible.fibonacci) {
    fibonacci.levels.forEach(level => candles.createPriceLine({
      price: level.price,
      color: CHART_COLORS.fibonacci,
      lineWidth: 1,
      lineStyle: LineStyle.Dotted,
      axisLabelVisible: false,
      title: level.label
    }));
  }
}

function levelLine(price, color) {
  return { price, color, lineWidth: 1, lineStyle: LineStyle.Dashed, axisLabelVisible: true };
}

/**
 * Adds an indicator pane with its series and reference levels
 * @param {Object} chart - Lightweight Charts chart
 * @param {Object} pane - Entry of INDICATOR_PANES
 * @param {Array} chartData - Bars with indicator values
 * @param {number} paneIndex - Index of the pane, 0 is the price pane
 * @param {Object<string, Object>} priceFormats - Custom price format per series format
 */
export function addIndicatorPane(chart, pane, chartData, paneIndex, priceFormats) {
  const mainLine = pane.series.find(definition => definition.type !== 'histogram');

  pane.series.forEach((definition, i) => {
    const isHistogram = definition.type === 'histogram';
    const series = chart.addSeries(isHistogram ? HistogramSeries : LineSeries, {
      ...(isHistogram ? {} : { color: definition.color, lineWidth: definition === mainLine ? 2 : 1 }),
      ...(pane.range && { autoscaleInfoProvider: () => ({ priceRange: pane.range }) }),
      title: definition.label,
      priceLineVisible: false,
      priceFormat: { type: 'custom', ...priceFormats[definition.format] }
    }, paneIndex);

    series.setData(isHistogram
      ? toColoredBars(chartData, definition.key, definition.colorOf)
      : toLinePoints(chartData, definition.key));

    if (i === 0) {
      pane.levels?.forEach(level => series.createPriceLine({
        price: level.price,
        color: level.color,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: false
      }));
    }
  });
}
