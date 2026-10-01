import { useState, useEffect } from 'react';
import { useStockAnalysis, useWatchlist, useAutoScan } from './hooks';
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/layout/TabNavigation';
import { DataSourceBadge } from './components/layout/DataSourceBadge';
import { TimePeriodControls } from './components/layout/TimePeriodControls';
import { ErrorState, EmptyState } from './components/ui';
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
    symbol, loading, searching, error,
    suggestions, showSuggestions, stockData, indicators, fibonacci,
    supportResistance, verdict, dataInfo, fundamentalData, companyInfo,
    timePeriod, interval, handleSearch, selectSuggestion, changePeriod, changeInterval
  } = useStockAnalysis();

  const {
    watchlist, watchlistData, loadingSymbols, lastRefresh,
    addToWatchlist, removeFromWatchlist, isInWatchlist,
    fetchSymbolData, refreshAll, moveUp, moveDown,
    analyzing, analyzeProgress, currentAnalyzing, analysisResults,
    analyzeAll, stopAnalyzeAll, clearAnalysisResults
  } = useWatchlist();

  const autoScan = useAutoScan();

  // Auto-refresh watchlist data when switching to watchlist tab
  useEffect(() => {
    if (activeTab === 'watchlist' && watchlist.length > 0) {
      const needsRefresh = watchlist.some(item => !watchlistData[item.symbol]);
      if (needsRefresh) {
        refreshAll();
      }
    }
  }, [activeTab, watchlist, watchlistData, refreshAll]);

  const toggleCard = (key) => {
    setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const openInAnalysis = (sym) => {
    selectSuggestion(sym);
    setActiveTab('analyse');
  };

  const isDataTab = DATA_TABS.includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6" style={{ fontFamily: "Roboto, system-ui, -apple-system, sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        <Header />

        <SearchBar
          currentSymbol={symbol}
          loading={loading}
          searching={searching}
          onSearch={handleSearch}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ExchangeSuggestions suggestions={suggestions} onSelect={selectSuggestion} />
        )}

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} watchlistCount={watchlist.length} />

        {stockData && isDataTab && <DataSourceBadge dataInfo={dataInfo} />}

        {stockData && TIME_CONTROLLED_TABS.includes(activeTab) && (
          <TimePeriodControls
            timePeriod={timePeriod}
            interval={interval}
            onPeriodChange={changePeriod}
            onIntervalChange={changeInterval}
          />
        )}

        {activeTab === 'lernen' && (
          <EducationTab expandedCards={expandedCards} toggleCard={toggleCard} />
        )}

        {activeTab === 'analyse' && stockData && indicators && verdict && (
          <AnalysisTab
            key={`analyse-${timePeriod}-${interval}`}
            symbol={symbol}
            verdict={verdict}
            indicators={indicators}
            companyInfo={companyInfo}
            isInWatchlist={isInWatchlist(symbol)}
            onAddToWatchlist={() => addToWatchlist(symbol, companyInfo?.name)}
            onRemoveFromWatchlist={() => removeFromWatchlist(symbol)}
          />
        )}

        {activeTab === 'kennzahlen' && stockData && <FundamentalsTab data={fundamentalData} />}

        {activeTab === 'charts' && stockData && indicators && (
          <ChartsTab
            key={`charts-${timePeriod}-${interval}`}
            stockData={stockData}
            fibonacci={fibonacci}
            supportResistance={supportResistance}
            indicators={indicators}
            currency={dataInfo?.currency}
          />
        )}

        {isDataTab && !stockData && !loading && (error ? <ErrorState error={error} /> : <EmptyState />)}

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
            watchlistData={watchlistData}
            loadingSymbols={loadingSymbols}
            lastRefresh={lastRefresh}
            onRefreshAll={refreshAll}
            onRefreshSymbol={fetchSymbolData}
            onRemove={removeFromWatchlist}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
            onAnalyze={openInAnalysis}
            analyzing={analyzing}
            analyzeProgress={analyzeProgress}
            currentAnalyzing={currentAnalyzing}
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
