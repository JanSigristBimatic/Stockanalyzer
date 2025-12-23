import { findNearestFibLevel } from './fibonacci';
import { findNearbyLevel } from './supportResistance';

/**
 * Signal weights for different indicators
 */
const SIGNAL_WEIGHTS = {
  // Technical indicators
  trend: 2,
  rsi: { extreme: 2, mild: 1 },
  macd: 2,
  bollinger: 1,
  fibonacci: 1,
  supportResistance: 1,
  volume: 1.5,  // Volumen-Analyse
  // Fundamental indicators
  peg: 2,
  pe: 1,
  roe: 1.5,
  debtToEquity: 1,
  currentRatio: 1,
  growth: 1.5,
  profitMargin: 1,
  analystTarget: 1
};

/**
 * Verdict types and their thresholds
 */
const VERDICT_THRESHOLDS = {
  strongBullish: 3,
  bullish: 1,
  strongBearish: 3,
  bearish: 1
};

/**
 * Generates a trading verdict based on technical and fundamental indicators
 * @param {Object} indicators - Current indicator values
 * @param {Object} fibonacci - Fibonacci analysis result
 * @param {Object} supportResistance - Support/Resistance levels
 * @param {number} lastPrice - Current price
 * @param {Object} fundamentalData - Fundamental data (optional)
 * @returns {Object} - Verdict with signals, percentages, and recommendation
 */
export function generateVerdict(indicators, fibonacci, supportResistance, lastPrice, fundamentalData = null) {
  const technicalAnalysis = analyzeIndicators(indicators, fibonacci, supportResistance, lastPrice);
  const fundamentalAnalysis = fundamentalData
    ? analyzeFundamentals(fundamentalData, lastPrice)
    : { bullishSignals: 0, bearishSignals: 0, neutralSignals: 0, signals: [] };

  // Combine technical and fundamental signals
  const bullishSignals = technicalAnalysis.bullishSignals + fundamentalAnalysis.bullishSignals;
  const bearishSignals = technicalAnalysis.bearishSignals + fundamentalAnalysis.bearishSignals;
  const neutralSignals = technicalAnalysis.neutralSignals + fundamentalAnalysis.neutralSignals;
  const signals = [...technicalAnalysis.signals, ...fundamentalAnalysis.signals];

  const percentages = calculatePercentages(bullishSignals, bearishSignals, neutralSignals);
  const verdict = determineVerdict(bullishSignals, bearishSignals, fundamentalData);

  return {
    ...verdict,
    signals,
    ...percentages,
    bullishSignals,
    bearishSignals,
    technicalScore: technicalAnalysis.bullishSignals - technicalAnalysis.bearishSignals,
    fundamentalScore: fundamentalAnalysis.bullishSignals - fundamentalAnalysis.bearishSignals
  };
}

/**
 * Analyzes all indicators and generates signals
 */
function analyzeIndicators(indicators, fibonacci, supportResistance, lastPrice) {
  let bullishSignals = 0;
  let bearishSignals = 0;
  let neutralSignals = 0;
  const signals = [];

  // Trend Analysis (SMA)
  if (indicators.shortTrend === 'bullish') {
    bullishSignals += SIGNAL_WEIGHTS.trend;
    signals.push({ type: 'bullish', text: 'SMA 20 über SMA 50 (Aufwärtstrend)' });
  } else {
    bearishSignals += SIGNAL_WEIGHTS.trend;
    signals.push({ type: 'bearish', text: 'SMA 20 unter SMA 50 (Abwärtstrend)' });
  }

  // RSI Analysis
  const rsiSignal = analyzeRSI(indicators.lastRSI);
  signals.push(rsiSignal.signal);
  if (rsiSignal.type === 'bullish') bullishSignals += rsiSignal.weight;
  else if (rsiSignal.type === 'bearish') bearishSignals += rsiSignal.weight;

  // MACD Analysis
  if (indicators.macdSignal === 'bullish') {
    bullishSignals += SIGNAL_WEIGHTS.macd;
    signals.push({ type: 'bullish', text: 'MACD über Signal-Linie (Kaufsignal)' });
  } else {
    bearishSignals += SIGNAL_WEIGHTS.macd;
    signals.push({ type: 'bearish', text: 'MACD unter Signal-Linie (Verkaufssignal)' });
  }

  // Bollinger Band Position
  const bbSignal = analyzeBollinger(indicators.bbPosition);
  signals.push(bbSignal.signal);
  if (bbSignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.bollinger;
  else if (bbSignal.type === 'bearish') bearishSignals += SIGNAL_WEIGHTS.bollinger;
  else neutralSignals += SIGNAL_WEIGHTS.bollinger;

  // Fibonacci Analysis
  const fibSignal = analyzeFibonacci(fibonacci.levels, lastPrice);
  if (fibSignal) {
    signals.push(fibSignal.signal);
    if (fibSignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.fibonacci;
    else bearishSignals += SIGNAL_WEIGHTS.fibonacci;
  }

  // Support/Resistance Analysis
  const srSignals = analyzeSupportResistance(supportResistance, lastPrice);
  srSignals.forEach(s => {
    signals.push(s.signal);
    if (s.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.supportResistance;
    else bearishSignals += SIGNAL_WEIGHTS.supportResistance;
  });

  // Volume Analysis
  const volumeResult = analyzeVolume(indicators.volumeData);
  if (volumeResult) {
    volumeResult.signals.forEach(s => {
      signals.push({ type: s.type, text: s.text });
    });
    if (volumeResult.type === 'bullish') bullishSignals += volumeResult.weight;
    else if (volumeResult.type === 'bearish') bearishSignals += volumeResult.weight;
    else neutralSignals += volumeResult.weight;
  }

  return { bullishSignals, bearishSignals, neutralSignals, signals };
}

/**
 * Analyzes RSI indicator
 */
function analyzeRSI(rsi) {
  if (rsi > 70) {
    return {
      type: 'bearish',
      weight: SIGNAL_WEIGHTS.rsi.extreme,
      signal: { type: 'bearish', text: `RSI ${rsi.toFixed(1)} - Überkauft` }
    };
  }
  if (rsi < 30) {
    return {
      type: 'bullish',
      weight: SIGNAL_WEIGHTS.rsi.extreme,
      signal: { type: 'bullish', text: `RSI ${rsi.toFixed(1)} - Überverkauft` }
    };
  }
  if (rsi > 50) {
    return {
      type: 'bullish',
      weight: SIGNAL_WEIGHTS.rsi.mild,
      signal: { type: 'bullish', text: `RSI ${rsi.toFixed(1)} - Leicht bullish` }
    };
  }
  return {
    type: 'bearish',
    weight: SIGNAL_WEIGHTS.rsi.mild,
    signal: { type: 'bearish', text: `RSI ${rsi.toFixed(1)} - Leicht bearish` }
  };
}

/**
 * Analyzes Bollinger Band position
 */
function analyzeBollinger(position) {
  const signals = {
    upper: { type: 'bearish', signal: { type: 'bearish', text: 'Kurs nahe oberem Bollinger Band' } },
    lower: { type: 'bullish', signal: { type: 'bullish', text: 'Kurs nahe unterem Bollinger Band' } },
    middle: { type: 'neutral', signal: { type: 'neutral', text: 'Kurs im mittleren Bollinger-Bereich' } }
  };
  return signals[position] || signals.middle;
}

/**
 * Analyzes Fibonacci position
 */
function analyzeFibonacci(levels, price) {
  const nearest = findNearestFibLevel(levels, price);

  if (nearest.level <= 0.382) {
    return {
      type: 'bearish',
      signal: { type: 'bearish', text: `Nahe Fibonacci ${nearest.label} (Widerstand)` }
    };
  }
  if (nearest.level >= 0.618) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `Nahe Fibonacci ${nearest.label} (Unterstützung)` }
    };
  }
  return null;
}

/**
 * Analyzes Support/Resistance proximity
 */
function analyzeSupportResistance(sr, price) {
  const signals = [];

  const nearSupport = findNearbyLevel(sr.support, price);
  if (nearSupport) {
    signals.push({
      type: 'bullish',
      signal: { type: 'bullish', text: `Nahe Unterstützung bei $${nearSupport.price.toFixed(2)}` }
    });
  }

  const nearResistance = findNearbyLevel(sr.resistance, price);
  if (nearResistance) {
    signals.push({
      type: 'bearish',
      signal: { type: 'bearish', text: `Nahe Widerstand bei $${nearResistance.price.toFixed(2)}` }
    });
  }

  return signals;
}

/**
 * Analyzes Volume indicators
 * @param {Object} volumeData - Volume analysis data
 * @returns {Object} - Analysis result with type, weight and signal
 */
function analyzeVolume(volumeData) {
  if (!volumeData) return null;

  const { currentVolume, avgVolume, obvTrend, priceDirection, volumeConfirmation } = volumeData;
  const signals = [];
  let totalBullish = 0;
  let totalBearish = 0;

  // 1. Volume vs Average (hohes Volumen = starke Überzeugung)
  if (currentVolume && avgVolume && avgVolume > 0) {
    const volumeRatio = currentVolume / avgVolume;

    if (volumeRatio > 1.5) {
      // Hohes Volumen - Richtung wichtig
      if (priceDirection === 'up') {
        signals.push({ type: 'bullish', text: `Volumen ${(volumeRatio * 100).toFixed(0)}% über Durchschnitt (starker Kaufdruck)` });
        totalBullish += 0.5;
      } else {
        signals.push({ type: 'bearish', text: `Volumen ${(volumeRatio * 100).toFixed(0)}% über Durchschnitt (starker Verkaufsdruck)` });
        totalBearish += 0.5;
      }
    } else if (volumeRatio < 0.5) {
      // Niedriges Volumen - schwache Überzeugung
      signals.push({ type: 'neutral', text: `Volumen ${(volumeRatio * 100).toFixed(0)}% unter Durchschnitt (schwache Bewegung)` });
    }
  }

  // 2. OBV Trend (Akkumulation vs Distribution)
  if (obvTrend) {
    if (obvTrend === 'rising') {
      signals.push({ type: 'bullish', text: 'OBV steigend (Akkumulation)' });
      totalBullish += 0.5;
    } else if (obvTrend === 'falling') {
      signals.push({ type: 'bearish', text: 'OBV fallend (Distribution)' });
      totalBearish += 0.5;
    }
  }

  // 3. Preis-Volumen Bestätigung/Divergenz
  if (volumeConfirmation !== undefined) {
    if (volumeConfirmation) {
      signals.push({ type: 'bullish', text: 'Volumen bestätigt Preistrend' });
      totalBullish += 0.5;
    } else {
      signals.push({ type: 'bearish', text: 'Volumen-Preis-Divergenz (Vorsicht!)' });
      totalBearish += 0.5;
    }
  }

  // Falls keine Signale gefunden wurden
  if (signals.length === 0) return null;

  // Bestimme Gesamttyp
  let type = 'neutral';
  if (totalBullish > totalBearish) type = 'bullish';
  else if (totalBearish > totalBullish) type = 'bearish';

  return {
    type,
    weight: SIGNAL_WEIGHTS.volume,
    signals
  };
}

/**
 * Analyzes fundamental data and generates signals
 * @param {Object} data - Fundamental data from Yahoo Finance
 * @param {number} price - Current stock price
 * @returns {Object} - Analysis result with signals
 */
function analyzeFundamentals(data, price) {
  let bullishSignals = 0;
  let bearishSignals = 0;
  let neutralSignals = 0;
  const signals = [];

  // PEG Ratio Analysis (most important valuation metric)
  if (data.pegRatio != null) {
    const pegSignal = analyzePEG(data.pegRatio);
    signals.push(pegSignal.signal);
    if (pegSignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.peg;
    else if (pegSignal.type === 'bearish') bearishSignals += SIGNAL_WEIGHTS.peg;
    else neutralSignals += SIGNAL_WEIGHTS.peg;
  }

  // P/E Ratio Analysis
  if (data.peRatio != null) {
    const peSignal = analyzePE(data.peRatio, data.forwardPE);
    signals.push(peSignal.signal);
    if (peSignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.pe;
    else if (peSignal.type === 'bearish') bearishSignals += SIGNAL_WEIGHTS.pe;
    else neutralSignals += SIGNAL_WEIGHTS.pe;
  }

  // Return on Equity (ROE) Analysis
  if (data.returnOnEquity != null) {
    const roeSignal = analyzeROE(data.returnOnEquity);
    signals.push(roeSignal.signal);
    if (roeSignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.roe;
    else if (roeSignal.type === 'bearish') bearishSignals += SIGNAL_WEIGHTS.roe;
    else neutralSignals += SIGNAL_WEIGHTS.roe;
  }

  // Debt-to-Equity Analysis
  if (data.debtToEquity != null) {
    const debtSignal = analyzeDebtToEquity(data.debtToEquity);
    signals.push(debtSignal.signal);
    if (debtSignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.debtToEquity;
    else if (debtSignal.type === 'bearish') bearishSignals += SIGNAL_WEIGHTS.debtToEquity;
    else neutralSignals += SIGNAL_WEIGHTS.debtToEquity;
  }

  // Current Ratio Analysis (Liquidity)
  if (data.currentRatio != null) {
    const liquiditySignal = analyzeCurrentRatio(data.currentRatio);
    signals.push(liquiditySignal.signal);
    if (liquiditySignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.currentRatio;
    else if (liquiditySignal.type === 'bearish') bearishSignals += SIGNAL_WEIGHTS.currentRatio;
    else neutralSignals += SIGNAL_WEIGHTS.currentRatio;
  }

  // Growth Analysis (Earnings + Revenue)
  const growthSignal = analyzeGrowth(data.earningsGrowth, data.revenueGrowth);
  if (growthSignal) {
    signals.push(growthSignal.signal);
    if (growthSignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.growth;
    else if (growthSignal.type === 'bearish') bearishSignals += SIGNAL_WEIGHTS.growth;
    else neutralSignals += SIGNAL_WEIGHTS.growth;
  }

  // Profit Margin Analysis
  if (data.profitMargin != null) {
    const marginSignal = analyzeProfitMargin(data.profitMargin);
    signals.push(marginSignal.signal);
    if (marginSignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.profitMargin;
    else if (marginSignal.type === 'bearish') bearishSignals += SIGNAL_WEIGHTS.profitMargin;
    else neutralSignals += SIGNAL_WEIGHTS.profitMargin;
  }

  // Analyst Target Price Analysis
  if (data.targetMeanPrice != null && price > 0) {
    const targetSignal = analyzeTargetPrice(price, data.targetMeanPrice, data.recommendationKey);
    signals.push(targetSignal.signal);
    if (targetSignal.type === 'bullish') bullishSignals += SIGNAL_WEIGHTS.analystTarget;
    else if (targetSignal.type === 'bearish') bearishSignals += SIGNAL_WEIGHTS.analystTarget;
    else neutralSignals += SIGNAL_WEIGHTS.analystTarget;
  }

  return { bullishSignals, bearishSignals, neutralSignals, signals };
}

/**
 * Analyzes PEG Ratio
 * PEG < 1 = undervalued, PEG > 2 = overvalued
 */
function analyzePEG(peg) {
  if (peg < 0) {
    return {
      type: 'bearish',
      signal: { type: 'bearish', text: `PEG ${peg.toFixed(2)} - Negatives Wachstum`, category: 'fundamental' }
    };
  }
  if (peg < 1) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `PEG ${peg.toFixed(2)} - Unterbewertet (< 1)`, category: 'fundamental' }
    };
  }
  if (peg <= 1.5) {
    return {
      type: 'neutral',
      signal: { type: 'neutral', text: `PEG ${peg.toFixed(2)} - Fair bewertet`, category: 'fundamental' }
    };
  }
  if (peg <= 2) {
    return {
      type: 'neutral',
      signal: { type: 'neutral', text: `PEG ${peg.toFixed(2)} - Leicht überbewertet`, category: 'fundamental' }
    };
  }
  return {
    type: 'bearish',
    signal: { type: 'bearish', text: `PEG ${peg.toFixed(2)} - Stark überbewertet (> 2)`, category: 'fundamental' }
  };
}

/**
 * Analyzes P/E Ratio with forward P/E consideration
 */
function analyzePE(pe, forwardPE) {
  // Very high or negative P/E is bearish
  if (pe < 0 || pe > 50) {
    return {
      type: 'bearish',
      signal: { type: 'bearish', text: `KGV ${pe < 0 ? 'negativ' : pe.toFixed(1)} - Ungünstige Bewertung`, category: 'fundamental' }
    };
  }

  // Check if forward P/E shows improvement
  if (forwardPE && forwardPE < pe * 0.8) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `KGV ${pe.toFixed(1)} → Forward ${forwardPE.toFixed(1)} - Wachstum erwartet`, category: 'fundamental' }
    };
  }

  // Low P/E is generally bullish
  if (pe < 15) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `KGV ${pe.toFixed(1)} - Günstig bewertet (< 15)`, category: 'fundamental' }
    };
  }

  // Moderate P/E is neutral
  if (pe <= 25) {
    return {
      type: 'neutral',
      signal: { type: 'neutral', text: `KGV ${pe.toFixed(1)} - Durchschnittlich bewertet`, category: 'fundamental' }
    };
  }

  return {
    type: 'bearish',
    signal: { type: 'bearish', text: `KGV ${pe.toFixed(1)} - Hoch bewertet (> 25)`, category: 'fundamental' }
  };
}

/**
 * Analyzes Return on Equity
 * ROE > 15% = excellent, ROE > 10% = good, ROE < 5% = poor
 */
function analyzeROE(roe) {
  const roePercent = roe * 100;

  if (roePercent > 20) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `ROE ${roePercent.toFixed(1)}% - Exzellent (> 20%)`, category: 'fundamental' }
    };
  }
  if (roePercent > 15) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `ROE ${roePercent.toFixed(1)}% - Sehr gut (> 15%)`, category: 'fundamental' }
    };
  }
  if (roePercent > 10) {
    return {
      type: 'neutral',
      signal: { type: 'neutral', text: `ROE ${roePercent.toFixed(1)}% - Solide`, category: 'fundamental' }
    };
  }
  if (roePercent > 0) {
    return {
      type: 'bearish',
      signal: { type: 'bearish', text: `ROE ${roePercent.toFixed(1)}% - Niedrig (< 10%)`, category: 'fundamental' }
    };
  }
  return {
    type: 'bearish',
    signal: { type: 'bearish', text: `ROE ${roePercent.toFixed(1)}% - Negativ`, category: 'fundamental' }
  };
}

/**
 * Analyzes Debt-to-Equity Ratio
 * D/E < 0.5 = excellent, D/E < 1 = good, D/E > 2 = risky
 */
function analyzeDebtToEquity(de) {
  if (de < 0) {
    // Negative equity is very bad
    return {
      type: 'bearish',
      signal: { type: 'bearish', text: 'Negatives Eigenkapital - Hohes Risiko', category: 'fundamental' }
    };
  }
  if (de < 0.5) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `Verschuldungsgrad ${de.toFixed(2)} - Sehr niedrig`, category: 'fundamental' }
    };
  }
  if (de < 1) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `Verschuldungsgrad ${de.toFixed(2)} - Gesund (< 1)`, category: 'fundamental' }
    };
  }
  if (de < 2) {
    return {
      type: 'neutral',
      signal: { type: 'neutral', text: `Verschuldungsgrad ${de.toFixed(2)} - Moderat`, category: 'fundamental' }
    };
  }
  return {
    type: 'bearish',
    signal: { type: 'bearish', text: `Verschuldungsgrad ${de.toFixed(2)} - Hoch (> 2)`, category: 'fundamental' }
  };
}

/**
 * Analyzes Current Ratio (Liquidity)
 * CR > 2 = excellent, CR > 1.5 = good, CR < 1 = risky
 */
function analyzeCurrentRatio(cr) {
  if (cr > 2) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `Liquidität ${cr.toFixed(2)} - Sehr gut (> 2)`, category: 'fundamental' }
    };
  }
  if (cr > 1.5) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `Liquidität ${cr.toFixed(2)} - Gut`, category: 'fundamental' }
    };
  }
  if (cr >= 1) {
    return {
      type: 'neutral',
      signal: { type: 'neutral', text: `Liquidität ${cr.toFixed(2)} - Ausreichend`, category: 'fundamental' }
    };
  }
  return {
    type: 'bearish',
    signal: { type: 'bearish', text: `Liquidität ${cr.toFixed(2)} - Kritisch (< 1)`, category: 'fundamental' }
  };
}

/**
 * Analyzes Growth (Earnings and Revenue Growth)
 */
function analyzeGrowth(earningsGrowth, revenueGrowth) {
  // Need at least one growth metric
  if (earningsGrowth == null && revenueGrowth == null) return null;

  const eg = earningsGrowth ? earningsGrowth * 100 : null;
  const rg = revenueGrowth ? revenueGrowth * 100 : null;

  // Use the better available metric
  const primaryGrowth = eg ?? rg;
  const growthLabel = eg != null ? 'Gewinnwachstum' : 'Umsatzwachstum';

  if (primaryGrowth > 25) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `${growthLabel} ${primaryGrowth.toFixed(1)}% - Stark`, category: 'fundamental' }
    };
  }
  if (primaryGrowth > 10) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `${growthLabel} ${primaryGrowth.toFixed(1)}% - Solide`, category: 'fundamental' }
    };
  }
  if (primaryGrowth > 0) {
    return {
      type: 'neutral',
      signal: { type: 'neutral', text: `${growthLabel} ${primaryGrowth.toFixed(1)}% - Moderat`, category: 'fundamental' }
    };
  }
  return {
    type: 'bearish',
    signal: { type: 'bearish', text: `${growthLabel} ${primaryGrowth.toFixed(1)}% - Rückgang`, category: 'fundamental' }
  };
}

/**
 * Analyzes Profit Margin
 * PM > 20% = excellent, PM > 10% = good, PM < 5% = thin margins
 */
function analyzeProfitMargin(margin) {
  const pm = margin * 100;

  if (pm > 20) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `Gewinnmarge ${pm.toFixed(1)}% - Exzellent`, category: 'fundamental' }
    };
  }
  if (pm > 10) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `Gewinnmarge ${pm.toFixed(1)}% - Gut`, category: 'fundamental' }
    };
  }
  if (pm > 5) {
    return {
      type: 'neutral',
      signal: { type: 'neutral', text: `Gewinnmarge ${pm.toFixed(1)}% - Durchschnittlich`, category: 'fundamental' }
    };
  }
  if (pm > 0) {
    return {
      type: 'bearish',
      signal: { type: 'bearish', text: `Gewinnmarge ${pm.toFixed(1)}% - Niedrig`, category: 'fundamental' }
    };
  }
  return {
    type: 'bearish',
    signal: { type: 'bearish', text: `Gewinnmarge ${pm.toFixed(1)}% - Verlust`, category: 'fundamental' }
  };
}

/**
 * Analyzes Analyst Target Price vs Current Price
 */
function analyzeTargetPrice(currentPrice, targetPrice, recommendation) {
  const upside = ((targetPrice - currentPrice) / currentPrice) * 100;
  const recText = getRecommendationText(recommendation);

  if (upside > 20) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `Analysten: ${recText} (${upside.toFixed(0)}% Kurspotential)`, category: 'fundamental' }
    };
  }
  if (upside > 10) {
    return {
      type: 'bullish',
      signal: { type: 'bullish', text: `Analysten: ${recText} (${upside.toFixed(0)}% Potential)`, category: 'fundamental' }
    };
  }
  if (upside > -10) {
    return {
      type: 'neutral',
      signal: { type: 'neutral', text: `Analysten: ${recText} (fair bewertet)`, category: 'fundamental' }
    };
  }
  return {
    type: 'bearish',
    signal: { type: 'bearish', text: `Analysten: ${recText} (${upside.toFixed(0)}% unter Ziel)`, category: 'fundamental' }
  };
}

/**
 * Translates Yahoo Finance recommendation keys to German
 */
function getRecommendationText(key) {
  const recommendations = {
    'strongBuy': 'Stark Kaufen',
    'buy': 'Kaufen',
    'hold': 'Halten',
    'sell': 'Verkaufen',
    'strongSell': 'Stark Verkaufen'
  };
  return recommendations[key] || key || 'Keine Empfehlung';
}

/**
 * Calculates bullish/bearish percentages
 */
function calculatePercentages(bullish, bearish, neutral) {
  const total = bullish + bearish + neutral;
  return {
    bullishPercent: Math.round((bullish / total) * 100),
    bearishPercent: Math.round((bearish / total) * 100)
  };
}

/**
 * Determines the final verdict based on signal counts
 * @param {number} bullish - Total bullish signal score
 * @param {number} bearish - Total bearish signal score
 * @param {Object} fundamentalData - Fundamental data for enhanced recommendations
 */
function determineVerdict(bullish, bearish, fundamentalData = null) {
  const diff = bullish - bearish;
  const hasFundamentals = fundamentalData != null;

  // Adjust thresholds based on whether we have fundamental data
  // With fundamentals, we have more signals so need higher thresholds
  const thresholdMultiplier = hasFundamentals ? 1.5 : 1;
  const strongThreshold = VERDICT_THRESHOLDS.strongBullish * thresholdMultiplier;
  const normalThreshold = VERDICT_THRESHOLDS.bullish * thresholdMultiplier;

  if (diff > strongThreshold) {
    return {
      verdict: 'STARK BULLISH',
      verdictType: 'strong-bullish',
      recommendation: hasFundamentals
        ? 'Technische und fundamentale Analyse zeigen ein starkes Kaufsignal. Solide Fundamentaldaten unterstützen den positiven Trend.'
        : 'Die technischen Indikatoren zeigen ein starkes Kaufsignal. Der Trend ist aufwärts gerichtet mit positivem Momentum.'
    };
  }
  if (diff > normalThreshold) {
    return {
      verdict: 'BULLISH',
      verdictType: 'bullish',
      recommendation: hasFundamentals
        ? 'Überwiegend positive Signale aus technischer und fundamentaler Sicht. Ein Einstieg könnte erwogen werden.'
        : 'Überwiegend positive Signale. Ein Einstieg könnte erwogen werden, aber mit Stop-Loss absichern.'
    };
  }
  if (diff < -strongThreshold) {
    return {
      verdict: 'STARK BEARISH',
      verdictType: 'strong-bearish',
      recommendation: hasFundamentals
        ? 'Technische und fundamentale Warnsignale! Schwache Kennzahlen und negativer Trend erfordern erhöhte Vorsicht.'
        : 'Die technischen Indikatoren zeigen ein starkes Verkaufssignal. Vorsicht ist geboten, Positionen absichern.'
    };
  }
  if (diff < -normalThreshold) {
    return {
      verdict: 'BEARISH',
      verdictType: 'bearish',
      recommendation: hasFundamentals
        ? 'Überwiegend negative Signale. Fundamentale Schwächen oder technischer Abwärtstrend vorhanden.'
        : 'Überwiegend negative Signale. Abwarten oder bestehende Positionen reduzieren.'
    };
  }
  return {
    verdict: 'NEUTRAL',
    verdictType: 'neutral',
    recommendation: hasFundamentals
      ? 'Gemischte Signale aus technischer und fundamentaler Analyse. Abwarten auf klarere Richtung.'
      : 'Gemischte Signale. Abwarten auf klarere Trendrichtung empfohlen.'
  };
}
