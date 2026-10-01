import { useState } from 'react';
import { useStockAnalysis, useWatchlist, useAutoScan } from './hooks';
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/layout/TabNavigation';
import { DataSourceBadge } from './components/layout/DataSourceBadge';
import { TimePeriodControls } from './components/layout/TimePeriodControls';
import { ErrorState, EmptyState, ErrorBanner } from './components/ui';
import { SearchBar } from './features/search/SearchBar';
import { ExchangeSuggestions } from './features/search/ExchangeSuggestions';
import { AnalysisTab } from './features/analysis/AnalysisTab';
import { FundamentalsTab } from './features/fundamentals/FundamentalsTab';
import { ChartsTab } from './features/charts/ChartsTab';
import { AutoScanTab } from './features/scanner/AutoScanTab';
import { WatchlistTab } from './features/watchlist/WatchlistTab';
import { EducationTab } from './features/education/EducationTab';

const DATA_TABS = ['analyse', 'kennzahlen', 'charts'];
const TIME_CONTROLLED_TABS = ['analyse', 'charts'];

/**
 * Main Stock Analyzer Application Component
 * Provides technical analysis with Fibonacci, Support/Resistance, and automated trading verdicts
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('analyse');
  const [expandedCards, setExpandedCards] = useState({});

  const {
    symbol, result, timePeriod, interval, loading, error, suggestions,
    search, selectSymbol, changePeriod, changeInterval
  } = useStockAnalysis();

  const {
    watchlist, quotes, loadingSymbols, failedSymbols, lastRefresh,
    addToWatchlist, removeFromWatchlist, isInWatchlist,
    refreshSymbol, refreshAll, refreshIfStale, moveUp, moveDown,
    analyzing, analyzeProgress, analysisResults,
    analyzeAll, stopAnalyzeAll, clearAnalysisResults
  } = useWatchlist();

  const autoScan = useAutoScan();

  const changeTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'watchlist') refreshIfStale();
  };

  const toggleCard = (key) => {
    setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const openInAnalysis = (sym) => {
    selectSymbol(sym);
    setActiveTab('analyse');
  };

  const isDataTab = DATA_TABS.includes(activeTab);
  const analysis = result?.analysis;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6" style={{ fontFamily: "Roboto, system-ui, -apple-system, sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        <Header />

        <SearchBar currentSymbol={symbol} loading={loading} onSearch={search} />

        {suggestions.length > 0 && (
          <ExchangeSuggestions suggestions={suggestions} onSelect={selectSymbol} />
        )}

        <TabNavigation activeTab={activeTab} setActiveTab={changeTab} watchlistCount={watchlist.length} />

        {result && isDataTab && <DataSourceBadge meta={result.meta} />}

        {result && TIME_CONTROLLED_TABS.includes(activeTab) && (
          <TimePeriodControls
            timePeriod={timePeriod}
            interval={interval}
            loading={loading}
            onPeriodChange={changePeriod}
            onIntervalChange={changeInterval}
          />
        )}

        {result && isDataTab && error && <ErrorBanner message={error} />}

        {activeTab === 'lernen' && (
          <EducationTab expandedCards={expandedCards} toggleCard={toggleCard} />
        )}

        {activeTab === 'analyse' && result && (
          <AnalysisTab
            key={`analyse-${timePeriod}-${interval}`}
            symbol={result.symbol}
            verdict={analysis.verdict}
            indicators={analysis.indicators}
            companyInfo={result.company}
            currency={result.meta.currency}
            priceHint={result.meta.priceHint}
            isInWatchlist={isInWatchlist(result.symbol)}
            onAddToWatchlist={() => addToWatchlist(result.symbol, result.company?.name)}
            onRemoveFromWatchlist={() => removeFromWatchlist(result.symbol)}
          />
        )}

        {activeTab === 'kennzahlen' && result && (
          <FundamentalsTab data={result.fundamentals} currency={result.meta.currency} priceHint={result.meta.priceHint} />
        )}

        {activeTab === 'charts' && result && (
          <ChartsTab
            key={`charts-${timePeriod}-${interval}`}
            stockData={analysis.chartData}
            fibonacci={analysis.fibonacci}
            supportResistance={analysis.supportResistance}
            indicators={analysis.indicators}
            currency={result.meta.currency}
            priceHint={result.meta.priceHint}
          />
        )}

        {isDataTab && !result && !loading && (error ? <ErrorState error={error} /> : <EmptyState />)}

        {activeTab === 'scanner' && (
          <AutoScanTab
            autoScan={autoScan}
            onAnalyze={openInAnalysis}
            addToWatchlist={addToWatchlist}
            isInWatchlist={isInWatchlist}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistTab
            watchlist={watchlist}
            quotes={quotes}
            loadingSymbols={loadingSymbols}
            failedSymbols={failedSymbols}
            lastRefresh={lastRefresh}
            onRefreshAll={refreshAll}
            onRefreshSymbol={refreshSymbol}
            onRemove={removeFromWatchlist}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
            onAnalyze={openInAnalysis}
            analyzing={analyzing}
            analyzeProgress={analyzeProgress}
            analysisResults={analysisResults}
            onAnalyzeAll={analyzeAll}
            onStopAnalyzeAll={stopAnalyzeAll}
            onClearAnalysisResults={clearAnalysisResults}
          />
        )}
      </div>
    </div>
  );
}
