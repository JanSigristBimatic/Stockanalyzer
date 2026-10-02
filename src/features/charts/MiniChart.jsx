import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { createChartOptions } from './chartTheme';
import { addPriceLayer, createPriceFormats } from './chartLayers';

const LAYERS = { sma50: true, sma200: true, levels: true };

/**
 * Static candlestick chart with SMA 50, SMA 200 and the support and resistance levels
 */
export function MiniChart({ chartData, supportResistance, currency, priceHint, interval }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const chart = createChart(containerRef.current, createChartOptions({ interval, interactive: false }));
    addPriceLayer(chart, {
      chartData,
      visible: LAYERS,
      supportResistance,
      quoteFormat: createPriceFormats(currency, priceHint).quote
    });
    chart.timeScale().fitContent();
    return () => chart.remove();
  }, [chartData, supportResistance, currency, priceHint, interval]);

  return <div ref={containerRef} className="h-64" />;
}
