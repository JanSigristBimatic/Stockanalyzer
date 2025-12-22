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
  }
};
