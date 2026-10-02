import { useEffect, useMemo, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { ChartCandlestick } from 'lucide-react';
import { ChartHeader } from '../../components/ui';
import { BIMATIC_BLUE } from '../../constants';
import { usePersistentSettings } from '../../hooks';
import { createChartOptions } from './chartTheme';
import { INDICATOR_PANES, addIndicatorPane, addPriceLayer, createPriceFormats } from './chartLayers';
import { ChartToolbar } from './ChartToolbar';
import { ChartLegend } from './ChartLegend';

const SETTINGS_KEY = 'stockanalyzer_chart_settings';
const DEFAULT_SETTINGS = {
  sma20: true, sma50: true, sma200: true, bollinger: false, levels: true, fibonacci: false,
  volume: true, rsi: true, macd: true, stochastic: false, adx: false, atr: false, obv: false
};
const PRICE_PANE_HEIGHT = 360;
const INDICATOR_PANE_HEIGHT = 120;
const TIME_AXIS_HEIGHT = 28;

/**
 * Candlestick chart with switchable overlays and indicator panes that share one time axis and crosshair
 */
export function ProChart({ chartData, fibonacci, supportResistance, currency, priceHint, interval }) {
  const containerRef = useRef(null);
  const shownDataRef = useRef(null);
  const visibleRangeRef = useRef(null);
  const [settings, setSettings] = usePersistentSettings(SETTINGS_KEY, DEFAULT_SETTINGS);
  const [hoveredTime, setHoveredTime] = useState(null);

  const priceFormats = useMemo(() => createPriceFormats(currency, priceHint), [currency, priceHint]);
  const barIndexByTime = useMemo(() => new Map(chartData.map((bar, i) => [bar.timestamp, i])), [chartData]);
  const paneCount = INDICATOR_PANES.filter(pane => settings[pane.id]).length;

  useEffect(() => {
    const chart = createChart(containerRef.current, createChartOptions({ interval }));
    addPriceLayer(chart, { chartData, visible: settings, fibonacci, supportResistance, quoteFormat: priceFormats.quote });
    INDICATOR_PANES
      .filter(pane => settings[pane.id])
      .forEach((pane, i) => addIndicatorPane(chart, pane, chartData, i + 1, priceFormats));
    chart.panes().forEach((pane, i) => pane.setStretchFactor(i === 0 ? PRICE_PANE_HEIGHT : INDICATOR_PANE_HEIGHT));

    // Switching layers rebuilds the chart but keeps the zoom; new data starts with all bars in view
    const timeScale = chart.timeScale();
    if (shownDataRef.current === chartData && visibleRangeRef.current) {
      timeScale.setVisibleLogicalRange(visibleRangeRef.current);
    } else {
      timeScale.fitContent();
    }
    shownDataRef.current = chartData;
    timeScale.subscribeVisibleLogicalRangeChange(range => { visibleRangeRef.current = range; });
    chart.subscribeCrosshairMove(param => setHoveredTime(param.time ?? null));

    return () => chart.remove();
  }, [chartData, settings, fibonacci, supportResistance, priceFormats, interval]);

  const toggleLayer = (id) => setSettings(prev => ({ ...prev, [id]: !prev[id] }));
  const barIndex = barIndexByTime.get(hoveredTime) ?? chartData.length - 1;

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <ChartHeader icon={ChartCandlestick} title="Kursverlauf und Indikatoren" color={BIMATIC_BLUE} infoKey="priceChart" />
      <ChartToolbar settings={settings} onToggle={toggleLayer} />
      <ChartLegend
        bar={chartData[barIndex]}
        previousBar={chartData[barIndex - 1]}
        settings={settings}
        priceFormats={priceFormats}
        interval={interval}
        currency={currency}
      />
      <div
        ref={containerRef}
        style={{ height: PRICE_PANE_HEIGHT + paneCount * INDICATOR_PANE_HEIGHT + TIME_AXIS_HEIGHT }}
      />
    </div>
  );
}
