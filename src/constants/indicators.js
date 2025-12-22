/**
 * Educational content for each technical indicator
 * Used in tooltips and the learning section
 */
export const INDICATOR_INFO = {
  priceChart: {
    title: 'Kursverlauf',
    short: 'Zeigt den historischen Preisverlauf mit gleitenden Durchschnitten und wichtigen Preislevels.',
    full: `Der Kursverlauf zeigt die Entwicklung des Aktienkurses über Zeit. Die wichtigsten Elemente sind:

• **Kurslinie (blau)**: Der tägliche Schlusskurs der Aktie
• **SMA 20 (gelb)**: Durchschnitt der letzten 20 Tage - zeigt kurzfristigen Trend
• **SMA 50 (lila)**: Durchschnitt der letzten 50 Tage - zeigt mittelfristigen Trend
• **Support (grün)**: Preisniveaus, bei denen Käufer typischerweise einsteigen
• **Resistance (rot)**: Preisniveaus, bei denen Verkäufer typischerweise verkaufen
• **Fibonacci-Levels (orange gestrichelt)**: Mathematische Retracement-Levels

**Wie lesen?**
- Wenn SMA 20 über SMA 50 liegt = Aufwärtstrend (bullish)
- Wenn SMA 20 unter SMA 50 liegt = Abwärtstrend (bearish)
- Kreuzungen der SMAs sind wichtige Signale`
  },
  rsi: {
    title: 'RSI (Relative Strength Index)',
    short: 'Momentum-Indikator der zeigt, ob eine Aktie überkauft (>70) oder überverkauft (<30) ist.',
    full: `Der RSI misst die Stärke und Geschwindigkeit von Preisbewegungen auf einer Skala von 0-100.

**Die wichtigen Zonen:**
• **Über 70 (rote Zone)**: Überkauft - Aktie könnte überbewertet sein, Korrektur möglich
• **Unter 30 (grüne Zone)**: Überverkauft - Aktie könnte unterbewertet sein, Erholung möglich
• **Um 50**: Neutraler Bereich

**Wie lesen?**
- RSI steigt = zunehmendes Kaufinteresse
- RSI fällt = zunehmendes Verkaufsinteresse
- Divergenzen zwischen Kurs und RSI sind starke Signale

**Beispiel:**
Wenn der Kurs neue Hochs macht, aber RSI niedrigere Hochs zeigt, ist das eine bearishe Divergenz - mögliche Trendumkehr!`
  },
  macd: {
    title: 'MACD (Moving Average Convergence Divergence)',
    short: 'Trend-Momentum-Indikator der Kauf- und Verkaufssignale durch Linienkreuzungen zeigt.',
    full: `Der MACD zeigt die Beziehung zwischen zwei exponentiellen gleitenden Durchschnitten.

**Die Komponenten:**
• **MACD-Linie (blau)**: Differenz zwischen EMA 12 und EMA 26
• **Signal-Linie (orange)**: 9-Tage-EMA der MACD-Linie
• **Histogramm (lila Balken)**: Differenz zwischen MACD und Signal

**Wie lesen?**
- **Kaufsignal**: MACD kreuzt Signal-Linie von unten nach oben
- **Verkaufssignal**: MACD kreuzt Signal-Linie von oben nach unten
- **Histogramm positiv**: Bullishes Momentum
- **Histogramm negativ**: Bearishes Momentum

**Tipp:**
Je weiter die Linien von der Nulllinie entfernt sind, desto stärker der Trend. Annäherung an Null deutet auf mögliche Trendumkehr hin.`
  },
  volume: {
    title: 'Volumen & OBV',
    short: 'Handelsvolumen bestätigt Preisbewegungen. OBV zeigt akkumulierten Kauf-/Verkaufsdruck.',
    full: `Das Volumen zeigt, wie viele Aktien gehandelt wurden - ein wichtiger Bestätigungsindikator.

**Volumen (blaue Balken):**
• Hohes Volumen bei Preisanstieg = starke Kaufkraft (bullish)
• Hohes Volumen bei Preisfall = starker Verkaufsdruck (bearish)
• Niedriges Volumen = schwache Überzeugung der Bewegung

**OBV (On-Balance Volume - türkise Linie):**
• Steigendes OBV = Akkumulation (Käufer dominieren)
• Fallendes OBV = Distribution (Verkäufer dominieren)

**Wie lesen?**
- Kurs steigt + Volumen steigt = gesunder Aufwärtstrend
- Kurs steigt + Volumen fällt = schwacher Aufwärtstrend, Vorsicht!
- OBV-Divergenzen zum Kurs sind starke Warnsignale`
  },
  fibonacci: {
    title: 'Fibonacci Retracements',
    short: 'Mathematische Levels die potenzielle Unterstützungs- und Widerstandszonen identifizieren.',
    full: `Fibonacci Retracements basieren auf der Fibonacci-Zahlenfolge und werden verwendet, um potenzielle Umkehrpunkte zu finden.

**Die wichtigsten Levels:**
• **23.6%**: Erste Korrekturebene - schwache Korrektur
• **38.2%**: Moderate Korrektur - oft wichtiger Support
• **50%**: Psychologisch wichtiges Level
• **61.8%**: Das "goldene Verhältnis" - sehr wichtiges Level
• **78.6%**: Tiefe Korrektur - letzte Chance für Trendfortsetzung

**Wie lesen?**
- In einem Aufwärtstrend: Levels dienen als potenzielle Kaufzonen
- In einem Abwärtstrend: Levels dienen als potenzielle Verkaufszonen
- Mehrere Indikatoren am gleichen Level = starke Zone

**Tipp:**
Die 61.8% Marke ist besonders wichtig. Fällt der Kurs darunter, ist der vorherige Trend möglicherweise gebrochen.`
  },
  supportResistance: {
    title: 'Support & Resistance',
    short: 'Preiszonen wo historisch viele Käufer (Support) oder Verkäufer (Resistance) aktiv waren.',
    full: `Support und Resistance sind Preisniveaus, an denen der Kurs in der Vergangenheit umgekehrt ist.

**Support (Unterstützung):**
• Preislevel, bei dem Käufer typischerweise einsteigen
• Verhindert weiteren Preisverfall
• Je öfter getestet und gehalten, desto stärker

**Resistance (Widerstand):**
• Preislevel, bei dem Verkäufer typischerweise verkaufen
• Verhindert weiteren Preisanstieg
• Je öfter getestet und gehalten, desto stärker

**Wichtige Regeln:**
1. Durchbrochener Widerstand wird oft zum neuen Support
2. Durchbrochener Support wird oft zum neuen Widerstand
3. Je mehr "Touches" ein Level hat, desto wichtiger ist es

**Trading-Tipp:**
Kaufe nahe Support mit Stop-Loss darunter. Verkaufe nahe Resistance oder warte auf Durchbruch.`
  },
  sma: {
    title: 'SMA (Simple Moving Average)',
    short: 'Gleitender Durchschnitt der Kursbewegung zur Trenderkennung. SMA20 über SMA50 = Aufwärtstrend.',
    full: `Der Simple Moving Average (SMA) glättet Kursbewegungen und hilft, den Trend zu erkennen.

**Die wichtigsten SMAs:**
• **SMA 20**: Kurzfristiger Trend (ca. 1 Monat Handelstage)
• **SMA 50**: Mittelfristiger Trend (ca. 2-3 Monate)
• **SMA 200**: Langfristiger Trend (ca. 1 Jahr)

**Wie lesen?**
- Kurs über SMA = Aufwärtstrend
- Kurs unter SMA = Abwärtstrend
- SMA 20 über SMA 50 = Bullish (Golden Cross wenn sie sich kreuzen)
- SMA 20 unter SMA 50 = Bearish (Death Cross wenn sie sich kreuzen)

**Wichtige Signale:**
1. Golden Cross: SMA 50 kreuzt SMA 200 von unten = starkes Kaufsignal
2. Death Cross: SMA 50 kreuzt SMA 200 von oben = starkes Verkaufssignal
3. Kurs prallt am SMA ab = SMA fungiert als Support/Resistance

**Tipp:**
Je länger der SMA-Zeitraum, desto stärker ist das Signal, aber desto später kommt es. Nutze mehrere SMAs für Bestätigung.`
  },
  atr: {
    title: 'ATR (Average True Range)',
    short: 'Volatilitätsindikator der die durchschnittliche Kursschwankung misst. Höher = volatiler.',
    full: `Der ATR misst die durchschnittliche Schwankungsbreite eines Wertpapiers über einen bestimmten Zeitraum (typisch 14 Tage).

**Was zeigt der ATR?**
• Hoher ATR = Hohe Volatilität, grosse Kursbewegungen
• Niedriger ATR = Geringe Volatilität, ruhiger Markt
• Steigender ATR = Zunehmende Unsicherheit/Bewegung
• Fallender ATR = Beruhigung des Marktes

**Praktische Anwendung:**
• **Stop-Loss setzen**: Viele Trader setzen Stop-Loss bei 2x ATR unter dem Einstieg
• **Positionsgrösse**: Bei hohem ATR kleinere Positionen wählen
• **Ausbrüche erkennen**: ATR-Anstieg oft vor grossen Bewegungen

**Beispiel Stop-Loss:**
Bei einem ATR von 5$ und Einstieg bei 100$:
- Stop-Loss bei 100$ - (2 x 5$) = 90$
- Das gibt dem Trade genug "Raum zum Atmen"

**Wichtig:**
Der ATR zeigt NICHT die Richtung an, nur die Stärke der Bewegung! Kombiniere ihn mit Trendindikatoren.`
  },
  stochastic: {
    title: 'Stochastik Oszillator',
    short: 'Momentum-Indikator der zeigt, wo der Kurs relativ zu seiner Range steht. >80 überkauft, <20 überverkauft.',
    full: `Der Stochastik Oszillator vergleicht den aktuellen Schlusskurs mit der Handelsspanne der letzten Perioden.

**Die Komponenten:**
• **%K (schnelle Linie)**: Reagiert schnell auf Preisänderungen
• **%D (langsame Linie)**: Geglättete Version von %K (Signallinie)

**Die wichtigen Zonen:**
• **Über 80**: Überkauft - Kurs nahe am Hoch der Range
• **Unter 20**: Überverkauft - Kurs nahe am Tief der Range
• **Kreuzungen**: %K kreuzt %D = Handelssignal

**Trading-Signale:**
1. **Kaufsignal**: %K kreuzt %D von unten nach oben (besonders unter 20)
2. **Verkaufssignal**: %K kreuzt %D von oben nach unten (besonders über 80)
3. **Divergenzen**: Kurs macht neue Hochs/Tiefs, Stochastik nicht = Warnsignal

**Unterschied zum RSI:**
- RSI misst Momentum der Preisbewegung
- Stochastik misst Position innerhalb der Range
- Stochastik reagiert schneller, mehr Signale (auch Fehlsignale)

**Tipp:**
In starken Trends kann Stochastik lange im überkauften/überverkauften Bereich bleiben. Nicht gegen den Trend handeln!`
  },
  adx: {
    title: 'ADX (Average Directional Index)',
    short: 'Misst die Trendstärke (nicht Richtung). >25 = Trend vorhanden, <20 = Seitwärtsmarkt.',
    full: `Der ADX misst, wie stark ein Trend ist - unabhängig davon, ob er aufwärts oder abwärts geht.

**Die Komponenten:**
• **ADX (gelb)**: Zeigt die Trendstärke (0-100)
• **+DI (grün)**: Positive Richtungsbewegung (Aufwärtsdruck)
• **-DI (rot)**: Negative Richtungsbewegung (Abwärtsdruck)

**ADX-Interpretation:**
• **0-20**: Kein oder schwacher Trend (Seitwärtsmarkt)
• **20-40**: Moderater Trend
• **40-60**: Starker Trend
• **60+**: Sehr starker Trend (selten)

**Trading-Signale:**
1. **Kaufsignal**: +DI kreuzt -DI nach oben bei ADX > 20
2. **Verkaufssignal**: -DI kreuzt +DI nach oben bei ADX > 20
3. **Trend-Trading**: Bei ADX > 25 Trend folgen, nicht gegen ihn handeln
4. **Range-Trading**: Bei ADX < 20 auf Ausbruch warten oder Range handeln

**Strategische Nutzung:**
- ADX steigt = Trend verstärkt sich (mit dem Trend gehen)
- ADX fällt = Trend schwächt ab (Gewinne mitnehmen)
- ADX unter 20 = Seitwärtsphase (Range-Strategien nutzen)

**Wichtig:**
Der ADX zeigt NUR die Stärke, nicht die Richtung! Für die Richtung schaue auf +DI vs -DI oder andere Trendindikatoren.`
  }
};
