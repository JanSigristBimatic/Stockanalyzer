import React, { useState, useEffect } from 'react';
import {
  Search, Activity, BarChart3, Zap, Target, Loader2, AlertCircle, Wifi,
  Shield, AlertTriangle, Globe, Clock, Building2, DollarSign, GraduationCap,
  TrendingUp, TrendingDown, Scale, Star, RefreshCw, Trash2, ChevronUp, ChevronDown, Eye,
  Play, Pause, SkipForward, RotateCcw, Radar, CheckCircle2
} from 'lucide-react';

// Constants
import { BIMATIC_BLUE, BIMATIC_LIGHT, INDICATOR_INFO, FUNDAMENTAL_INFO, CHART_INTERVALS, AUTO_SCAN_PERIODS, BULLISH_THRESHOLDS } from '../constants';

// Hooks
import { useStockAnalysis, useWatchlist, useAutoScan } from '../hooks';

// UI Components
import { SignalBadge, VerdictIcon, EducationCard, InfoTooltip } from './ui';

// Chart Components
import { PriceChart, RSIChart, MACDChart, VolumeChart, ATRChart, StochasticChart, ADXChart } from './charts';

/**
 * Main Stock Analyzer Application Component
 * Provides technical analysis with Fibonacci, Support/Resistance, and automated trading verdicts
 */
export default function StockAnalyzer() {
  const [activeTab, setActiveTab] = useState('analyse');
  const [expandedCards, setExpandedCards] = useState({});

  const {
    symbol, inputValue, setInputValue, loading, searching, error,
    suggestions, showSuggestions, stockData, indicators, fibonacci,
    supportResistance, verdict, dataInfo, fundamentalData, companyInfo,
    timePeriod, interval, handleSearch, selectSuggestion, changePeriod, changeInterval,
    autocompleteResults, showAutocomplete, autocompleteLoading, selectAutocomplete, hideAutocomplete
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6" style={{ fontFamily: "Roboto, system-ui, -apple-system, sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header />

        {/* Search with Autocomplete */}
        <SearchBar
          inputValue={inputValue}
          setInputValue={setInputValue}
          loading={loading}
          searching={searching}
          onSearch={handleSearch}
          autocompleteResults={autocompleteResults}
          showAutocomplete={showAutocomplete}
          autocompleteLoading={autocompleteLoading}
          onSelectAutocomplete={selectAutocomplete}
          onBlur={hideAutocomplete}
        />

        {/* Exchange Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <ExchangeSuggestions suggestions={suggestions} onSelect={selectSuggestion} />
        )}

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} watchlistCount={watchlist.length} />

        {/* Data Source Badge (shown on all data tabs) */}
        {stockData && ['analyse', 'kennzahlen', 'charts'].includes(activeTab) && (
          <DataSourceBadge dataInfo={dataInfo} />
        )}

        {/* Time Controls (only for analyse and charts, not kennzahlen) */}
        {stockData && ['analyse', 'charts'].includes(activeTab) && (
          <TimePeriodControls
            timePeriod={timePeriod}
            interval={interval}
            onPeriodChange={changePeriod}
            onIntervalChange={changeInterval}
          />
        )}

        {/* Education Tab */}
        {activeTab === 'lernen' && (
          <EducationTab expandedCards={expandedCards} toggleCard={toggleCard} />
        )}

        {/* Analysis Tab - Gesamtbewertung, Kurs/RSI/Trend/MACD, Unternehmen */}
        {activeTab === 'analyse' && (
          <>
            {stockData && indicators && verdict && (
              <div className="space-y-6" key={`analyse-${timePeriod}-${interval}`}>
                <VerdictCard verdict={verdict} />
                <WatchlistButton
                  symbol={symbol}
                  companyName={companyInfo?.name}
                  isInWatchlist={isInWatchlist(symbol)}
                  onAdd={() => addToWatchlist(symbol, companyInfo?.name)}
                  onRemove={() => removeFromWatchlist(symbol)}
                />
                <SummaryCards symbol={symbol} indicators={indicators} />
                {companyInfo && <CompanyInfoCard info={companyInfo} />}
                <Disclaimer />
              </div>
            )}
            {!stockData && !loading && error && <ErrorState error={error} />}
            {!stockData && !loading && !error && <EmptyState />}
          </>
        )}

        {/* Kennzahlen Tab - Fundamentale Kennzahlen */}
        {activeTab === 'kennzahlen' && (
          <>
            {stockData && fundamentalData && (
              <div className="space-y-6">
                <FundamentalDataCard data={fundamentalData} />
                <Disclaimer />
              </div>
            )}
            {stockData && !fundamentalData && (
              <div className="text-center py-20">
                <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-300 text-xl font-semibold">Keine Kennzahlen verfügbar</p>
                <p className="text-slate-400 mt-2">Für dieses Symbol sind keine fundamentalen Daten vorhanden.</p>
              </div>
            )}
            {!stockData && !loading && error && <ErrorState error={error} />}
            {!stockData && !loading && !error && <EmptyState />}
          </>
        )}

        {/* Charts Tab - Alle Charts */}
        {activeTab === 'charts' && (
          <>
            {stockData && indicators && (
              <div className="space-y-6" key={`charts-${timePeriod}-${interval}`}>
                <PriceChart data={stockData} fibonacci={fibonacci} supportResistance={supportResistance} currency={dataInfo?.currency} />
                <FibonacciAndSRCards fibonacci={fibonacci} supportResistance={supportResistance} indicators={indicators} />
                <RSIChart data={stockData} />
                <MACDChart data={stockData} />
                <VolumeChart data={stockData} />
                <ATRChart data={stockData} />
                <StochasticChart data={stockData} />
                <ADXChart data={stockData} />
                <Disclaimer />
              </div>
            )}
            {!stockData && !loading && error && <ErrorState error={error} />}
            {!stockData && !loading && !error && <EmptyState />}
          </>
        )}

        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <AutoScanTab
            autoScan={autoScan}
            onAnalyze={(sym) => {
              setInputValue(sym);
              selectSuggestion(sym);
              setActiveTab('analyse');
            }}
            addToWatchlist={addToWatchlist}
            isInWatchlist={isInWatchlist}
          />
        )}

        {/* Watchlist Tab */}
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
            onAnalyze={(sym) => {
              setInputValue(sym);
              selectSuggestion(sym);
              setActiveTab('analyse');
            }}
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

// ============================================================================
// Sub-Components
// ============================================================================

function Header() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: BIMATIC_BLUE }}>
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Stock Analyzer Pro</h1>
          <p className="text-sm font-medium" style={{ color: BIMATIC_LIGHT }}>by Bimatic GmbH</p>
        </div>
      </div>
      <p className="text-slate-300 text-base font-medium">
        Technische Analyse mit Fibonacci, Support/Resistance & automatischem Trading-Fazit
      </p>
    </div>
  );
}

function SearchBar({
  inputValue, setInputValue, loading, searching, onSearch,
  autocompleteResults, showAutocomplete, autocompleteLoading, onSelectAutocomplete, onBlur
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          onBlur={onBlur}
          placeholder="Symbol oder Firmenname (z.B. NVDA, Apple, Tesla)"
          className="w-full bg-slate-900 border-2 border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white text-lg font-medium placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
        />

        {/* Autocomplete Dropdown */}
        {showAutocomplete && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border-2 border-blue-400 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            {autocompleteLoading ? (
              <div className="flex items-center gap-2 p-4 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Suche...</span>
              </div>
            ) : (
              <>
                <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-700 flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  {autocompleteResults.length} Ergebnis{autocompleteResults.length !== 1 ? 'se' : ''} gefunden
                </div>
                {autocompleteResults.map((result, i) => (
                  <button
                    key={i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectAutocomplete(result);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 border-b border-slate-800 last:border-b-0 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400 border border-slate-700">
                      {result.type === 'ETF' ? 'ETF' : result.symbol.slice(0, 3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{result.symbol}</span>
                        {result.type === 'ETF' && (
                          <span className="text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded">ETF</span>
                        )}
                      </div>
                      <div className="text-slate-400 text-sm truncate">{result.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">{result.exchangeDisplay}</div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      <button
        onClick={onSearch}
        disabled={loading || searching || !inputValue.trim()}
        className="px-6 py-3 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:bg-slate-700 disabled:text-slate-500"
        style={{ backgroundColor: (loading || searching || !inputValue.trim()) ? undefined : BIMATIC_BLUE }}
      >
        {(loading || searching) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
        {searching ? 'Suche...' : 'Analysieren'}
      </button>
    </div>
  );
}

function ExchangeSuggestions({ suggestions, onSelect }) {
  return (
    <div className="mb-6 bg-slate-900 border-2 rounded-xl p-4" style={{ borderColor: BIMATIC_BLUE }}>
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-5 h-5" style={{ color: BIMATIC_BLUE }} />
        <span className="text-white font-bold">Symbol gefunden auf mehreren Börsen - bitte wählen:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.symbol)}
            className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-blue-400 rounded-lg transition-all text-left"
          >
            <span className="text-2xl">{s.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold">{s.symbol}</div>
              <div className="text-slate-400 text-sm truncate">{s.exchangeLabel}</div>
            </div>
            <div className="text-green-400 font-bold">{s.currency} {s.price}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TabNavigation({ activeTab, setActiveTab, watchlistCount = 0 }) {
  const tabs = [
    { id: 'analyse', label: 'Analyse', icon: BarChart3 },
    { id: 'kennzahlen', label: 'Kennzahlen', icon: DollarSign },
    { id: 'charts', label: 'Charts', icon: Activity },
    { id: 'scanner', label: 'Auto-Scanner', icon: Radar },
    { id: 'watchlist', label: 'Watchlist', icon: Star, badge: watchlistCount },
    { id: 'lernen', label: 'Lernen', icon: GraduationCap }
  ];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {tabs.map(({ id, label, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === id ? 'text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
          style={activeTab === id ? { backgroundColor: BIMATIC_BLUE } : {}}
        >
          <Icon className="w-4 h-4" />
          {label}
          {badge > 0 && (
            <span className="bg-amber-500 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function DataSourceBadge({ dataInfo }) {
  return (
    <div className="mb-5 p-3 rounded-xl flex items-center gap-3 bg-green-900/50 border-2 border-green-600">
      <Wifi className="w-5 h-5 text-green-400" />
      <span className="text-green-200 font-bold">
        Live-Daten von {dataInfo?.exchange} in {dataInfo?.currency}
      </span>
    </div>
  );
}

function TimePeriodControls({ timePeriod, interval, onPeriodChange, onIntervalChange }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        <span className="text-slate-300 font-semibold">Zeitraum:</span>
        <div className="flex gap-1">
          {['1M', '3M', '6M', '1Y', '2Y', '5Y'].map(period => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                timePeriod === period ? 'text-white border-2' : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
              }`}
              style={timePeriod === period ? { backgroundColor: BIMATIC_BLUE, borderColor: BIMATIC_LIGHT } : {}}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {['1M', '3M'].includes(timePeriod) && (
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold">Intervall:</span>
          <div className="flex gap-1">
            {CHART_INTERVALS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onIntervalChange(value)}
                className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                  interval === value ? 'bg-purple-600 text-white border-2 border-purple-400' : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VerdictCard({ verdict }) {
  const borderClass = verdict.verdictType.includes('bullish')
    ? 'bg-green-900/30 border-green-500'
    : verdict.verdictType.includes('bearish')
    ? 'bg-red-900/30 border-red-500'
    : 'bg-yellow-900/30 border-yellow-500';

  const textClass = verdict.verdictType.includes('bullish')
    ? 'text-green-400'
    : verdict.verdictType.includes('bearish')
    ? 'text-red-400'
    : 'text-yellow-400';

  // Separate signals by category
  const technicalSignals = verdict.signals.filter(s => !s.category || s.category !== 'fundamental');
  const fundamentalSignals = verdict.signals.filter(s => s.category === 'fundamental');
  const hasFundamentals = fundamentalSignals.length > 0;

  return (
    <div className={`rounded-2xl p-6 border-4 ${borderClass}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-4">
          <VerdictIcon type={verdict.verdictType} />
          <div>
            <div className="text-sm text-slate-300 font-semibold">GESAMTBEWERTUNG</div>
            <div className={`text-3xl font-black ${textClass}`}>{verdict.verdict}</div>
            {hasFundamentals && (
              <div className="text-xs text-slate-400 mt-1">Technisch + Fundamental</div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-white font-bold">{verdict.bullishPercent}% Bullish</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-white font-bold">{verdict.bearishPercent}% Bearish</span>
            </div>
          </div>
          <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden flex">
            <div className="bg-green-500 h-full" style={{ width: `${verdict.bullishPercent}%` }} />
            <div className="bg-red-500 h-full" style={{ width: `${verdict.bearishPercent}%` }} />
          </div>

          {/* Score breakdown */}
          {hasFundamentals && verdict.technicalScore !== undefined && (
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Technisch:</span>
                <span className={verdict.technicalScore > 0 ? 'text-green-400' : verdict.technicalScore < 0 ? 'text-red-400' : 'text-yellow-400'}>
                  {verdict.technicalScore > 0 ? '+' : ''}{verdict.technicalScore}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Fundamental:</span>
                <span className={verdict.fundamentalScore > 0 ? 'text-green-400' : verdict.fundamentalScore < 0 ? 'text-red-400' : 'text-yellow-400'}>
                  {verdict.fundamentalScore > 0 ? '+' : ''}{verdict.fundamentalScore}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 p-4 bg-slate-900/50 rounded-xl">
        <p className="text-white text-lg font-medium">{verdict.recommendation}</p>
      </div>

      {/* Technical Signals */}
      <div className="mt-5">
        <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Technische Signale
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {technicalSignals.map((sig, i) => (
            <SignalItem key={i} signal={sig} />
          ))}
        </div>
      </div>

      {/* Fundamental Signals */}
      {hasFundamentals && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Fundamentale Signale
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {fundamentalSignals.map((sig, i) => (
              <SignalItem key={i} signal={sig} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SignalItem({ signal }) {
  // Prüfe ob es ein Volumen-Signal ist
  const isVolumeSignal = signal.text?.includes('Volumen') || signal.text?.includes('OBV');

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg ${
        signal.type === 'bullish' ? 'bg-green-900/40' : signal.type === 'bearish' ? 'bg-red-900/40' : 'bg-slate-800'
      }`}
    >
      {signal.type === 'bullish' && <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />}
      {signal.type === 'bearish' && <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />}
      {signal.type === 'neutral' && <Scale className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
      <span className="text-white font-medium text-sm flex-1">{signal.text}</span>
      {isVolumeSignal && <InfoTooltip info={INDICATOR_INFO.volume} />}
    </div>
  );
}

function SummaryCards({ symbol, indicators }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1">{symbol} Kurs</div>
        <div className="text-2xl font-bold text-white">${indicators.lastPrice.toFixed(2)}</div>
        <div className={`text-base font-bold flex items-center gap-1 mt-1 ${parseFloat(indicators.priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {parseFloat(indicators.priceChange) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {indicators.priceChange}%
        </div>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1 flex items-center">
          RSI (14)
          <InfoTooltip info={INDICATOR_INFO.rsi} />
        </div>
        <div className="text-2xl font-bold text-white">{indicators.lastRSI?.toFixed(1)}</div>
        <div className="mt-1">
          <SignalBadge
            type={indicators.rsiSignal}
            label={indicators.rsiSignal === 'overbought' ? 'Überkauft' : indicators.rsiSignal === 'oversold' ? 'Überverkauft' : 'Neutral'}
          />
        </div>
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1 flex items-center">
          Trend (SMA)
          <InfoTooltip info={INDICATOR_INFO.sma} />
        </div>
        <div className="text-xl font-bold text-white mb-1">
          {indicators.shortTrend === 'bullish' ? '↗ Aufwärts' : '↘ Abwärts'}
        </div>
        <SignalBadge type={indicators.shortTrend} label={indicators.shortTrend === 'bullish' ? 'Bullish' : 'Bearish'} />
      </div>

      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="text-slate-400 text-sm font-semibold mb-1 flex items-center">
          MACD
          <InfoTooltip info={INDICATOR_INFO.macd} />
        </div>
        <div className="text-xl font-bold text-white mb-1">
          {indicators.macdSignal === 'bullish' ? 'Kaufsignal' : 'Verkaufssignal'}
        </div>
        <SignalBadge type={indicators.macdSignal} label={indicators.macdSignal === 'bullish' ? 'Bullish' : 'Bearish'} />
      </div>
    </div>
  );
}

function FundamentalDataCard({ data }) {
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

function getRecommendationLabel(key) {
  const labels = {
    strongBuy: 'Stark Kaufen',
    strong_buy: 'Stark Kaufen',
    buy: 'Kaufen',
    hold: 'Halten',
    underperform: 'Untergewichten',
    sell: 'Verkaufen',
    strongSell: 'Stark Verkaufen',
    strong_sell: 'Stark Verkaufen'
  };
  return labels[key] || key;
}

function MetricCard({ label, value, subValue, highlight }) {
  const borderClass = highlight === 'green'
    ? 'border-green-500/50'
    : highlight === 'red'
    ? 'border-red-500/50'
    : 'border-slate-600';

  const valueClass = highlight === 'green'
    ? 'text-green-400'
    : highlight === 'red'
    ? 'text-red-400'
    : 'text-white';

  return (
    <div className={`bg-slate-800 border ${borderClass} rounded-lg p-3`}>
      <div className="text-slate-400 text-xs font-semibold mb-1">{label}</div>
      <div className={`text-xl font-bold ${valueClass}`}>{value}</div>
      {subValue && <div className="text-xs text-slate-400 mt-1">{subValue}</div>}
    </div>
  );
}

function formatMarketCap(value) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  return `$${(value / 1e6).toFixed(2)}M`;
}

function CompanyInfoCard({ info }) {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Unternehmensinformationen</h2>
      </div>
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
        <h3 className="text-2xl font-bold text-white mb-2">{info.name}</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          {info.sector && <InfoItem label="Sektor" value={info.sector} />}
          {info.industry && <InfoItem label="Branche" value={info.industry} />}
          {info.employees && <InfoItem label="Mitarbeiter" value={info.employees.toLocaleString('de-DE')} />}
        </div>
        {info.city && info.country && (
          <div className="mt-2 text-sm text-slate-400">{info.city}, {info.country}</div>
        )}
        {info.website && (
          <a
            href={info.website.startsWith('http') ? info.website : `https://${info.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm font-semibold flex items-center gap-1 hover:underline"
            style={{ color: BIMATIC_BLUE }}
          >
            <Globe className="w-4 h-4" />
            {info.website}
          </a>
        )}
      </div>
      {info.description && (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mt-4">
          <h4 className="text-white font-bold mb-2">Über das Unternehmen</h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            {info.description.length > 500 ? `${info.description.substring(0, 500)}...` : info.description}
          </p>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{label}:</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

function FibonacciAndSRCards({ fibonacci, supportResistance, indicators }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Fibonacci Levels */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Fibonacci Retracements</h2>
        </div>
        <div className="space-y-2">
          {fibonacci?.levels.map((fib, i) => {
            const isNear = Math.abs(fib.price - indicators.lastPrice) / indicators.lastPrice < 0.02;
            return (
              <div
                key={i}
                className={`flex justify-between items-center p-2 rounded ${isNear ? 'bg-amber-900/40 border border-amber-500' : 'bg-slate-800'}`}
              >
                <span className="text-slate-300 font-medium">{fib.label}</span>
                <span className={`font-bold ${isNear ? 'text-amber-400' : 'text-white'}`}>${fib.price.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support & Resistance */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Support & Resistance</h2>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Widerstände
            </div>
            {supportResistance?.resistance.length > 0 ? (
              supportResistance.resistance.map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-red-900/30 rounded mb-1">
                  <span className="text-slate-300">Level {i + 1}</span>
                  <span className="text-white font-bold">${r.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm">Keine klaren Widerstände erkannt</div>
            )}
          </div>
          <div>
            <div className="text-green-400 font-bold mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Unterstützungen
            </div>
            {supportResistance?.support.length > 0 ? (
              supportResistance.support.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-green-900/30 rounded mb-1">
                  <span className="text-slate-300">Level {i + 1}</span>
                  <span className="text-white font-bold">${s.price.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm">Keine klaren Unterstützungen erkannt</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EducationTab({ expandedCards, toggleCard }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 border-2 border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: BIMATIC_BLUE }}>
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Aktienanalyse verstehen</h2>
            <p className="text-slate-400">Lerne technische Indikatoren und fundamentale Kennzahlen zu interpretieren</p>
          </div>
        </div>
        <p className="text-slate-300">
          Erfolgreiche Anleger nutzen sowohl technische Analyse (Charts, Indikatoren) als auch fundamentale Analyse (Kennzahlen, Bewertung).
          Klicke auf die Karten unten, um mehr über jeden Begriff zu erfahren.
        </p>
      </div>

      {/* Fundamentale Kennzahlen */}
      <div className="bg-slate-900/50 border-2 border-amber-600/50 rounded-xl p-4 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Fundamentale Kennzahlen</h3>
        </div>
        <p className="text-slate-400 text-sm">
          Diese Kennzahlen zeigen die finanzielle Gesundheit und Bewertung eines Unternehmens.
        </p>
      </div>
      <div className="grid gap-4">
        {Object.entries(FUNDAMENTAL_INFO).map(([key, info]) => (
          <EducationCard key={`fund-${key}`} info={info} isExpanded={expandedCards[`fund-${key}`]} onToggle={() => toggleCard(`fund-${key}`)} />
        ))}
      </div>

      {/* Technische Indikatoren */}
      <div className="bg-slate-900/50 border-2 border-cyan-600/50 rounded-xl p-4 mb-2 mt-8">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Technische Indikatoren</h3>
        </div>
        <p className="text-slate-400 text-sm">
          Diese Indikatoren helfen dir, Preisbewegungen und Trends in Charts zu analysieren.
        </p>
      </div>
      <div className="grid gap-4">
        {Object.entries(INDICATOR_INFO).map(([key, info]) => (
          <EducationCard key={key} info={info} isExpanded={expandedCards[key]} onToggle={() => toggleCard(key)} />
        ))}
      </div>

      <TradingTips />
      <EducationDisclaimer />
    </div>
  );
}

function TradingTips() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded-xl p-6 mt-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        Wichtige Trading-Tipps
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="font-bold text-green-400 mb-2">DO's</h4>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>Nutze immer mehrere Indikatoren zur Bestätigung</li>
            <li>Setze Stop-Loss Orders zum Risikomanagement</li>
            <li>Warte auf klare Signale - Geduld zahlt sich aus</li>
            <li>Berücksichtige das Gesamtmarktumfeld</li>
            <li>Lerne aus vergangenen Trades</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="font-bold text-red-400 mb-2">DON'Ts</h4>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>Verlasse dich nicht auf einen einzigen Indikator</li>
            <li>Handle nicht gegen den Haupttrend</li>
            <li>Ignoriere nicht das Volumen</li>
            <li>Lass Emotionen nicht deine Entscheidungen steuern</li>
            <li>Überhandle nicht - Qualität vor Quantität</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function EducationDisclaimer() {
  return (
    <div className="bg-amber-900/20 border border-amber-600/50 rounded-xl p-4 mt-4">
      <p className="text-amber-200 text-sm text-center">
        <strong>Hinweis:</strong> Diese Informationen dienen nur zu Bildungszwecken. Technische Analyse garantiert keine Gewinne.
        Investiere nur Geld, das du bereit bist zu verlieren, und konsultiere ggf. einen Finanzberater.
      </p>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-4 text-center">
      <p className="text-slate-400 text-sm">
        <strong className="text-slate-300">Hinweis:</strong> Diese Analyse dient nur zu Informationszwecken und stellt keine Anlageberatung dar.
        Investitionsentscheidungen sollten auf Basis eigener Recherche und ggf. professioneller Beratung getroffen werden.
      </p>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="text-center py-20">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p className="text-red-400 text-xl font-semibold">{error}</p>
      <p className="text-slate-400 mt-2">Versuche ein anderes Symbol oder überprüfe die Schreibweise.</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <p className="text-slate-300 text-xl font-semibold">Gib ein Aktiensymbol ein</p>
      <p className="text-slate-400 mt-2">Beispiele: NVDA, AAPL, BABA, MSFT, GOOGL, AMZN, META, TSLA</p>
    </div>
  );
}

// ============================================================================
// Auto-Scan Components
// ============================================================================

function AutoScanTab({ autoScan, onAnalyze, addToWatchlist, isInWatchlist }) {
  const {
    scanning, paused, currentSymbol, scannedCount, skippedCount,
    foundStock, scanHistory, scanPeriod, threshold, totalSymbols, progress,
    selectedCategories, categories,
    startScan, pauseScan, continueScan, resetScan, changeScanPeriod, changeThreshold,
    toggleCategory, selectAllCategories
  } = autoScan;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: BIMATIC_BLUE }}>
            <Radar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Auto-Scanner</h2>
            <p className="text-slate-400">Findet automatisch bullishe Aktien für dich</p>
          </div>
        </div>

        {/* Categories Selection */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-400" />
              Kategorien auswählen:
            </span>
            <button
              onClick={selectAllCategories}
              disabled={scanning}
              className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded transition-colors"
            >
              Alle auswählen
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([id, cat]) => (
              <button
                key={id}
                onClick={() => toggleCategory(id)}
                disabled={scanning}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
                  selectedCategories.includes(id)
                    ? 'bg-purple-600 text-white border-2 border-purple-400'
                    : 'bg-slate-800 text-slate-400 border-2 border-slate-600 hover:border-slate-400 hover:text-slate-300'
                }`}
                title={cat.description}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            {totalSymbols} Aktien in {selectedCategories.length} Kategorie{selectedCategories.length !== 1 ? 'n' : ''} ausgewählt
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300 font-semibold">Zeitraum:</span>
            <div className="flex gap-1">
              {AUTO_SCAN_PERIODS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => changeScanPeriod(value)}
                  disabled={scanning}
                  className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${
                    scanPeriod === value
                      ? 'text-white border-2'
                      : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
                  }`}
                  style={scanPeriod === value ? { backgroundColor: BIMATIC_BLUE, borderColor: BIMATIC_LIGHT } : {}}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300 font-semibold">Min. Bullish:</span>
            <div className="flex gap-1">
              {BULLISH_THRESHOLDS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => changeThreshold(value)}
                  disabled={scanning}
                  className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${
                    threshold === value
                      ? 'bg-green-600 text-white border-2 border-green-400'
                      : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {!scanning && !foundStock && (
            <button
              onClick={startScan}
              className="px-6 py-3 text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-colors"
              style={{ backgroundColor: BIMATIC_BLUE }}
            >
              <Play className="w-5 h-5" />
              {paused ? 'Fortsetzen' : 'Scan starten'}
            </button>
          )}

          {scanning && (
            <button
              onClick={pauseScan}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Pause className="w-5 h-5" />
              Pausieren
            </button>
          )}

          {foundStock && (
            <button
              onClick={continueScan}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
              Weiter suchen
            </button>
          )}

          {(scannedCount > 0 || paused) && (
            <button
              onClick={resetScan}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white text-lg font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Zurücksetzen
            </button>
          )}
        </div>

        {/* Progress */}
        {(scanning || scannedCount > 0) && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">
                {scanning ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analysiere: <span className="text-white font-bold">{currentSymbol}</span>
                  </span>
                ) : paused ? (
                  'Pausiert'
                ) : foundStock ? (
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Fund!
                  </span>
                ) : (
                  'Scan abgeschlossen'
                )}
              </span>
              <span className="text-slate-400">
                {scannedCount} analysiert, {skippedCount} übersprungen / {totalSymbols} total
              </span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: foundStock ? '#22c55e' : BIMATIC_BLUE
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Found Stock Card */}
      {foundStock && (
        <div className="bg-green-900/30 border-4 border-green-500 rounded-2xl p-6 animate-pulse-once">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
            <div>
              <h3 className="text-2xl font-bold text-green-400">Bullishe Aktie gefunden!</h3>
              <p className="text-slate-300">{threshold}%+ Bullish-Bewertung erreicht</p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-black text-white">{foundStock.symbol}</div>
                <div className="text-slate-400">{foundStock.exchange}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {foundStock.currency === 'USD' ? '$' : foundStock.currency === 'EUR' ? '€' : foundStock.currency + ' '}
                  {foundStock.price?.toFixed(2)}
                </div>
                <div className={`text-lg font-bold flex items-center justify-end gap-1 ${parseFloat(foundStock.priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(foundStock.priceChange) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {foundStock.priceChange}%
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-white font-bold">{foundStock.bullishPercent}% Bullish</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-white font-bold">{foundStock.bearishPercent}% Bearish</span>
              </div>
            </div>
            <div className="mt-2 w-full h-4 bg-slate-700 rounded-full overflow-hidden flex">
              <div className="bg-green-500 h-full" style={{ width: `${foundStock.bullishPercent}%` }} />
              <div className="bg-red-500 h-full" style={{ width: `${foundStock.bearishPercent}%` }} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onAnalyze(foundStock.symbol)}
              className="flex-1 px-6 py-3 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              style={{ backgroundColor: BIMATIC_BLUE }}
            >
              <Eye className="w-5 h-5" />
              Details analysieren
            </button>
            {isInWatchlist(foundStock.symbol) ? (
              <button
                disabled
                className="flex-1 px-6 py-3 bg-amber-600 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 opacity-75"
              >
                <Star className="w-5 h-5 fill-current" />
                In Watchlist
              </button>
            ) : (
              <button
                onClick={() => addToWatchlist(foundStock.symbol)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-amber-600 text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-colors group"
              >
                <Star className="w-5 h-5 group-hover:fill-current" />
                Zur Watchlist
              </button>
            )}
          </div>
        </div>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-400" />
            Letzte Ergebnisse
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {scanHistory.map((stock, i) => (
              <div
                key={`${stock.symbol}-${i}`}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  stock.bullishPercent >= threshold
                    ? 'bg-green-900/30 border border-green-600'
                    : 'bg-slate-800 hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                    stock.bullishPercent >= threshold ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {stock.bullishPercent}%
                  </div>
                  <div>
                    <div className="text-white font-bold">{stock.symbol}</div>
                    <div className="text-slate-400 text-sm">{stock.verdict}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {stock.currency === 'USD' ? '$' : stock.currency === 'EUR' ? '€' : ''}
                      {stock.price?.toFixed(2)}
                    </div>
                    <div className={`text-sm font-semibold ${parseFloat(stock.priceChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.priceChange}%
                    </div>
                  </div>
                  <button
                    onClick={() => onAnalyze(stock.symbol)}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    title="Analysieren"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {isInWatchlist(stock.symbol) ? (
                    <button
                      disabled
                      className="p-2 bg-amber-600 text-white rounded-lg opacity-75"
                      title="In Watchlist"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={() => addToWatchlist(stock.symbol)}
                      className="p-2 bg-slate-700 hover:bg-amber-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                      title="Zur Watchlist hinzufügen"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!scanning && scannedCount === 0 && !foundStock && (
        <div className="text-center py-16 bg-slate-900/50 border-2 border-slate-700 rounded-xl">
          <Radar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 text-xl font-semibold">Bereit zum Scannen</p>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            Der Auto-Scanner durchsucht {totalSymbols} populäre Aktien und stoppt,
            sobald eine mit mindestens {threshold}% Bullish-Bewertung gefunden wird.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-amber-900/20 border border-amber-600/50 rounded-xl p-4">
        <p className="text-amber-200 text-sm">
          <strong>Hinweis:</strong> Der Scanner analysiert Aktien basierend auf technischen und fundamentalen Indikatoren.
          Eine hohe Bullish-Bewertung bedeutet nicht garantierte Gewinne. Führe immer deine eigene Recherche durch.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Watchlist Components
// ============================================================================

function WatchlistTab({
  watchlist, watchlistData, loadingSymbols, lastRefresh,
  onRefreshAll, onRefreshSymbol, onRemove, onMoveUp, onMoveDown, onAnalyze,
  analyzing, analyzeProgress, currentAnalyzing, analysisResults,
  onAnalyzeAll, onStopAnalyzeAll, onClearAnalysisResults
}) {
  const isAnyLoading = Object.values(loadingSymbols).some(Boolean);
  const hasResults = Object.keys(analysisResults).length > 0;

  // Sort results by bullish percentage
  const sortedResults = Object.values(analysisResults).sort((a, b) => b.bullishPercent - a.bullishPercent);

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-20">
        <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-300 text-xl font-semibold">Deine Watchlist ist leer</p>
        <p className="text-slate-400 mt-2">
          Analysiere eine Aktie und klicke auf "Zur Watchlist hinzufügen"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Meine Watchlist</h2>
              <p className="text-slate-400 text-sm">{watchlist.length} Aktie{watchlist.length !== 1 ? 'n' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {lastRefresh && (
              <span className="text-slate-500 text-xs">
                Aktualisiert: {new Date(lastRefresh).toLocaleTimeString('de-DE')}
              </span>
            )}
            <button
              onClick={onRefreshAll}
              disabled={isAnyLoading || analyzing}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isAnyLoading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </button>
            {!analyzing ? (
              <button
                onClick={onAnalyzeAll}
                disabled={isAnyLoading}
                className="px-4 py-2 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
                style={{ backgroundColor: BIMATIC_BLUE }}
              >
                <BarChart3 className="w-4 h-4" />
                Alle analysieren
              </button>
            ) : (
              <button
                onClick={onStopAnalyzeAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Pause className="w-4 h-4" />
                Stoppen
              </button>
            )}
          </div>
        </div>

        {/* Analysis Progress */}
        {analyzing && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analysiere: <span className="text-white font-bold">{currentAnalyzing}</span>
              </span>
              <span className="text-slate-400">{analyzeProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${analyzeProgress}%`, backgroundColor: BIMATIC_BLUE }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {hasResults && (
        <div className="bg-slate-900 border-2 border-green-600/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">Analyseergebnisse</h3>
              <span className="text-slate-400 text-sm">({sortedResults.length} Aktien, sortiert nach Bullish %)</span>
            </div>
            <button
              onClick={onClearAnalysisResults}
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
      )}

      {/* Watchlist Items */}
      <div className="space-y-2">
        {watchlist.map((item, index) => (
          <WatchlistItem
            key={item.symbol}
            item={item}
            data={watchlistData[item.symbol]}
            isLoading={loadingSymbols[item.symbol]}
            index={index}
            isFirst={index === 0}
            isLast={index === watchlist.length - 1}
            onRefresh={() => onRefreshSymbol(item.symbol)}
            onRemove={() => onRemove(item.symbol)}
            onMoveUp={() => onMoveUp(index)}
            onMoveDown={() => onMoveDown(index)}
            onAnalyze={() => onAnalyze(item.symbol)}
          />
        ))}
      </div>
    </div>
  );
}

function WatchlistItem({
  item, data, isLoading, isFirst, isLast,
  onRefresh, onRemove, onMoveUp, onMoveDown, onAnalyze
}) {
  const changeColor = data?.change >= 0 ? 'text-green-400' : 'text-red-400';
  const weekChangeColor = data?.weekChange >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-slate-900 border-2 border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Symbol & Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">{item.symbol}</span>
            {isLoading && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
          </div>
          {item.name && (
            <p className="text-slate-400 text-sm truncate">{item.name}</p>
          )}
        </div>

        {/* Price Data */}
        {data ? (
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-right">
              <div className="text-white font-bold text-xl">
                {data.currency === 'USD' ? '$' : data.currency === 'EUR' ? '€' : data.currency + ' '}
                {data.price?.toFixed(2)}
              </div>
              <div className={`text-sm font-semibold flex items-center justify-end gap-1 ${changeColor}`}>
                {data.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {data.change >= 0 ? '+' : ''}{data.change}%
              </div>
            </div>

            <div className="text-right hidden md:block">
              <div className="text-slate-400 text-xs">7 Tage</div>
              <div className={`text-sm font-semibold ${weekChangeColor}`}>
                {data.weekChange >= 0 ? '+' : ''}{data.weekChange}%
              </div>
            </div>

            {data.marketCap && (
              <div className="text-right hidden lg:block">
                <div className="text-slate-400 text-xs">Market Cap</div>
                <div className="text-white text-sm font-semibold">
                  {formatMarketCap(data.marketCap)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-500 text-sm">
            {isLoading ? 'Lädt...' : 'Keine Daten'}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onAnalyze}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            title="Analysieren"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-lg transition-colors"
            title="Aktualisieren"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex flex-col">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1 hover:bg-slate-700 disabled:opacity-30 text-slate-400 hover:text-white rounded transition-colors"
              title="Nach oben"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1 hover:bg-slate-700 disabled:opacity-30 text-slate-400 hover:text-white rounded transition-colors"
              title="Nach unten"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onRemove}
            className="p-2 bg-red-900/50 hover:bg-red-800 text-red-400 hover:text-red-300 rounded-lg transition-colors"
            title="Entfernen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function WatchlistButton({ symbol, companyName, isInWatchlist, onAdd, onRemove }) {
  if (isInWatchlist) {
    return (
      <button
        onClick={onRemove}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors"
      >
        <Star className="w-5 h-5 fill-current" />
        <span>{symbol} ist in deiner Watchlist</span>
        <span className="text-amber-200 text-sm ml-2">(Klicken zum Entfernen)</span>
      </button>
    );
  }

  return (
    <button
      onClick={onAdd}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-700 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors group"
    >
      <Star className="w-5 h-5 group-hover:fill-current" />
      <span>Zur Watchlist hinzufügen</span>
    </button>
  );
}
