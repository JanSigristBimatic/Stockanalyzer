/**
 * Educational content for fundamental metrics (Kennzahlen)
 * Used in the learning section
 */
export const FUNDAMENTAL_INFO = {
  pe: {
    title: 'KGV (Kurs-Gewinn-Verhältnis)',
    short: 'Zeigt, wie viel Jahre es dauern würde, bis das Unternehmen seinen Aktienkurs "verdient" hat.',
    full: `Das KGV (P/E Ratio) ist eine der wichtigsten Bewertungskennzahlen und zeigt das Verhältnis zwischen Aktienkurs und Gewinn pro Aktie.

**Berechnung:**
• KGV = Aktienkurs / Gewinn pro Aktie (EPS)
• Beispiel: Kurs 100€, EPS 5€ → KGV = 20

**Interpretation:**
• **Niedriges KGV (<15)**: Aktie könnte unterbewertet sein
• **Mittleres KGV (15-25)**: Faire Bewertung
• **Hohes KGV (>25)**: Hohe Wachstumserwartungen eingepreist

**Forward KGV:**
• Basiert auf erwarteten zukünftigen Gewinnen
• Niedriger als aktuelles KGV = Gewinnwachstum erwartet

**Wichtig:**
- Immer mit Branchendurchschnitt vergleichen (Tech hat höhere KGVs als Versorger)
- Negatives KGV bei Verlusten → nicht aussagekräftig
- Einmalige Sondereffekte können KGV verzerren`
  },
  peg: {
    title: 'PEG Ratio',
    short: 'Kombiniert KGV mit Gewinnwachstum. Unter 1 = möglicherweise unterbewertet, über 2 = teuer.',
    full: `Das PEG Ratio setzt das KGV ins Verhältnis zum Gewinnwachstum - eine verfeinerte Bewertung.

**Berechnung:**
• PEG = KGV / jährliches Gewinnwachstum (%)
• Beispiel: KGV 25, Wachstum 25% → PEG = 1.0

**Interpretation:**
• **PEG < 1**: Aktie könnte unterbewertet sein (Wachstum rechtfertigt mehr)
• **PEG = 1**: "Fair" bewertet nach Peter Lynch
• **PEG > 2**: Möglicherweise überbewertet

**Warum PEG statt nur KGV?**
- Ein KGV von 30 ist günstig bei 40% Wachstum (PEG = 0.75)
- Ein KGV von 15 ist teuer bei 5% Wachstum (PEG = 3.0)

**Einschränkungen:**
- Funktioniert nicht bei negativem Wachstum
- Verwendet oft geschätzte Wachstumsraten (unsicher)
- Besser für Wachstumsaktien als für Value-Aktien`
  },
  pb: {
    title: 'KBV (Kurs-Buchwert-Verhältnis)',
    short: 'Vergleicht Aktienkurs mit dem bilanziellen Eigenkapital. Unter 1 = unter Buchwert gehandelt.',
    full: `Das KBV (P/B Ratio) vergleicht den Marktwert mit dem Buchwert des Unternehmens.

**Berechnung:**
• KBV = Aktienkurs / Buchwert pro Aktie
• Buchwert = Eigenkapital / Anzahl Aktien

**Interpretation:**
• **KBV < 1**: Aktie unter Buchwert (theoretisch unter Liquidationswert)
• **KBV 1-3**: Typischer Bereich für etablierte Unternehmen
• **KBV > 5**: Hohe immaterielle Werte/Wachstumserwartungen

**Wann ist KBV besonders nützlich?**
- Banken und Versicherungen (viele bilanzierte Assets)
- Value-Investing nach Benjamin Graham
- Substanzwerte-Analyse

**Einschränkungen:**
- Immaterielle Werte (Marken, Patente) oft nicht im Buchwert
- Tech-Unternehmen haben oft hohe KBVs (wenig physische Assets)
- Buchhalterische Bewertung ≠ Marktwert der Assets`
  },
  roe: {
    title: 'ROE (Eigenkapitalrendite)',
    short: 'Zeigt, wie effizient das Unternehmen Gewinne aus dem Eigenkapital erwirtschaftet. Über 15% ist gut.',
    full: `Der ROE (Return on Equity) misst die Rentabilität des eingesetzten Eigenkapitals.

**Berechnung:**
• ROE = Nettogewinn / Eigenkapital × 100%
• Beispiel: 50 Mio. Gewinn, 250 Mio. EK → ROE = 20%

**Interpretation:**
• **ROE < 10%**: Niedrige Kapitaleffizienz
• **ROE 10-15%**: Durchschnittlich
• **ROE > 15%**: Gute Kapitaleffizienz
• **ROE > 25%**: Exzellent (aber prüfen warum!)

**Warnsignale:**
- Sehr hoher ROE kann durch hohe Verschuldung entstehen
- Sinkender ROE über Jahre = Wettbewerbsdruck
- Negativer ROE bei Verlusten

**DuPont-Analyse (ROE aufgeschlüsselt):**
ROE = Gewinnmarge × Umschlag × Hebel
- Hohe Marge = starke Preismacht
- Hoher Umschlag = effiziente Asset-Nutzung
- Hoher Hebel = viel Fremdkapital (Risiko!)

**Tipp:**
Vergleiche ROE immer mit Branche und über mehrere Jahre!`
  },
  roa: {
    title: 'ROA (Gesamtkapitalrendite)',
    short: 'Misst die Effizienz aller eingesetzten Assets. Zeigt, wie gut das Management Kapital einsetzt.',
    full: `Der ROA (Return on Assets) zeigt, wie effizient alle Vermögenswerte Gewinne generieren.

**Berechnung:**
• ROA = Nettogewinn / Gesamtvermögen × 100%

**Interpretation:**
• **ROA < 5%**: Kapitalintensives Geschäft oder ineffizient
• **ROA 5-10%**: Durchschnittlich
• **ROA > 10%**: Sehr gute Asset-Effizienz

**ROA vs ROE:**
- ROA ignoriert die Kapitalstruktur (Schulden)
- ROE kann durch Schulden "aufgeblasen" werden
- ROA zeigt die "echte" operative Effizienz

**Branchenunterschiede:**
- Banken: ROA oft nur 1-2% (aber hoher Leverage)
- Software: ROA kann 20%+ sein (wenig Assets nötig)
- Industrie: Typisch 5-10%

**Tipp:**
Ein Unternehmen mit hohem ROE aber niedrigem ROA nutzt viel Fremdkapital - höheres Risiko!`
  },
  profitMargin: {
    title: 'Gewinnmarge (Profit Margin)',
    short: 'Prozent des Umsatzes, der als Gewinn übrig bleibt. Höher = profitabler und oft wettbewerbsstärker.',
    full: `Die Gewinnmarge zeigt, wie viel vom Umsatz als Nettogewinn übrig bleibt.

**Berechnung:**
• Gewinnmarge = Nettogewinn / Umsatz × 100%
• Beispiel: 10 Mio. Gewinn bei 100 Mio. Umsatz → 10% Marge

**Arten von Margen:**
• **Bruttomarge**: (Umsatz - Herstellkosten) / Umsatz
• **Operative Marge**: EBIT / Umsatz (vor Zinsen/Steuern)
• **Nettomarge**: Nettogewinn / Umsatz (das "Endergebnis")

**Interpretation:**
• **< 5%**: Niedriger Margen-Geschäft (Einzelhandel, Airlines)
• **5-15%**: Durchschnittlich
• **> 15%**: Hohe Margen (oft Tech, Pharma, Luxus)

**Was beeinflusst die Marge?**
- Preismacht (starke Marken)
- Effizienz der Produktion
- Skaleneffekte
- Wettbewerbsintensität

**Tipp:**
Steigende Margen über Zeit = Zeichen für Wettbewerbsvorteil. Sinkende Margen = Warnsignal!`
  },
  debtToEquity: {
    title: 'Verschuldungsgrad (Debt-to-Equity)',
    short: 'Verhältnis von Fremd- zu Eigenkapital. Unter 1 = mehr Eigenkapital, über 2 = hohe Verschuldung.',
    full: `Der Verschuldungsgrad zeigt, wie stark ein Unternehmen fremdfinanziert ist.

**Berechnung:**
• D/E = Gesamtschulden / Eigenkapital
• Beispiel: 200 Mio. Schulden, 100 Mio. EK → D/E = 2.0

**Interpretation:**
• **D/E < 0.5**: Konservativ finanziert, viel Puffer
• **D/E 0.5-1.0**: Ausgewogen
• **D/E 1.0-2.0**: Höhere Verschuldung
• **D/E > 2.0**: Hoch verschuldet (höheres Risiko)

**Branchenunterschiede:**
- Versorger/Immobilien: D/E von 2+ normal (stabile Cashflows)
- Tech/Pharma: Oft D/E < 0.5 (weniger Kapitalbedarf)
- Banken: Sehr hohe Leverage-Ratios (anders berechnet)

**Risiken hoher Verschuldung:**
- Höhere Zinskosten fressen Gewinn
- Weniger Flexibilität in Krisen
- Gefahr bei steigenden Zinsen

**Chance hoher Verschuldung:**
- Leverage verstärkt Gewinne (aber auch Verluste!)
- Steuervorteil durch Zinsabzug`
  },
  currentRatio: {
    title: 'Current Ratio (Liquidität)',
    short: 'Kurzfristige Zahlungsfähigkeit. Über 1.5 = gute Liquidität, unter 1 = potenzielle Probleme.',
    full: `Das Current Ratio misst, ob ein Unternehmen seine kurzfristigen Verbindlichkeiten bezahlen kann.

**Berechnung:**
• Current Ratio = Umlaufvermögen / kurzfristige Verbindlichkeiten
• Beispiel: 150 Mio. Umlaufvermögen, 100 Mio. kurzfr. Schulden → CR = 1.5

**Interpretation:**
• **< 1.0**: Warnsignal! Kurzfristige Schulden > kurzfr. Vermögen
• **1.0-1.5**: Knapp, aber funktionsfähig
• **1.5-2.0**: Gesunde Liquidität
• **> 3.0**: Sehr konservativ (evtl. ineffizient)

**Quick Ratio (strengere Version):**
• Wie Current Ratio, aber ohne Lagerbestände
• Zeigt "sofortige" Zahlungsfähigkeit
• Quick Ratio > 1.0 ist gut

**Warum ist das wichtig?**
- Unternehmen können trotz Gewinnen pleite gehen (Liquiditätskrise)
- Kurzfristige Schulden müssen bezahlt werden, egal wie profitabel
- Besonders wichtig in Wirtschaftskrisen

**Tipp:**
Sinkendes Current Ratio über Zeit = mögliche Liquiditätsprobleme. Immer im Zeitverlauf betrachten!`
  },
  dividendYield: {
    title: 'Dividendenrendite',
    short: 'Jährliche Dividende im Verhältnis zum Aktienkurs. Passive Einkommensquelle für Anleger.',
    full: `Die Dividendenrendite zeigt, wie viel Prozent des Aktienkurses als Dividende ausgeschüttet wird.

**Berechnung:**
• Dividendenrendite = Jährliche Dividende / Aktienkurs × 100%
• Beispiel: 4€ Dividende bei 100€ Kurs → 4% Rendite

**Interpretation:**
• **0%**: Keine Dividende (Wachstumsunternehmen)
• **1-3%**: Moderate Dividende
• **3-5%**: Attraktive Dividende
• **> 6%**: Hohe Rendite (Vorsicht - warum so hoch?)

**Payout Ratio (Ausschüttungsquote):**
• Prozent des Gewinns, der als Dividende gezahlt wird
• 30-60% = nachhaltig
• > 80% = möglicherweise nicht nachhaltig

**Warnsignale bei hoher Dividendenrendite:**
- Kurs gefallen? (Rendite steigt automatisch)
- Kann das Unternehmen die Dividende halten?
- Wird aus der Substanz gezahlt?

**Dividendenwachstum:**
- "Dividend Aristocrats" erhöhen seit 25+ Jahren
- Dividendenwachstum oft wichtiger als aktuelle Rendite

**Tipp:**
Eine Dividende von 3% mit 10% jährlichem Wachstum ist besser als 6% ohne Wachstum!`
  },
  beta: {
    title: 'Beta (Volatilität)',
    short: 'Misst die Schwankung relativ zum Gesamtmarkt. Beta > 1 = volatiler als Markt, < 1 = stabiler.',
    full: `Beta misst, wie stark eine Aktie im Vergleich zum Gesamtmarkt schwankt.

**Berechnung:**
• Beta = Kovarianz(Aktie, Markt) / Varianz(Markt)
• Referenz ist meist der S&P 500 oder relevanter Index

**Interpretation:**
• **Beta = 1.0**: Bewegt sich wie der Markt
• **Beta > 1.0**: Volatiler als Markt (z.B. 1.5 = 50% mehr Schwankung)
• **Beta < 1.0**: Weniger volatil als Markt
• **Beta negativ**: Bewegt sich gegenläufig (selten)

**Beispiele:**
• Tech-Aktien: Oft Beta 1.2-1.8 (volatil)
• Versorger: Oft Beta 0.4-0.7 (defensiv)
• Gold-Minen: Manchmal negativer Beta

**Für dein Portfolio:**
- Hohes Beta = mehr Risiko, aber mehr Chance
- Niedriges Beta = stabiler, weniger Upside
- Portfolio-Beta = gewichteter Durchschnitt

**Einschränkungen:**
- Basiert auf historischen Daten
- Kann sich ändern (z.B. bei Geschäftsmodell-Änderung)
- Kurze Zeiträume = unzuverlässiger

**Tipp:**
In Bullenmärkten: High-Beta outperformt. In Krisen: Low-Beta schützt besser.`
  },
  marketCap: {
    title: 'Marktkapitalisierung',
    short: 'Gesamtwert aller Aktien. Zeigt die "Grösse" eines Unternehmens an der Börse.',
    full: `Die Marktkapitalisierung ist der Gesamtwert aller ausstehenden Aktien eines Unternehmens.

**Berechnung:**
• Market Cap = Aktienkurs × Anzahl ausstehender Aktien
• Beispiel: 100€ Kurs × 1 Mrd. Aktien = 100 Mrd. € Market Cap

**Kategorien:**
• **Mega Cap**: > 200 Mrd. (Apple, Microsoft)
• **Large Cap**: 10-200 Mrd. (etablierte Konzerne)
• **Mid Cap**: 2-10 Mrd. (mittlere Unternehmen)
• **Small Cap**: 300 Mio. - 2 Mrd. (kleinere Unternehmen)
• **Micro Cap**: < 300 Mio. (sehr klein, höheres Risiko)

**Warum ist Market Cap wichtig?**
- Bestimmt Index-Zugehörigkeit (S&P 500, DAX, etc.)
- Grössere Unternehmen = meist stabiler, liquider
- Kleinere Unternehmen = höheres Wachstumspotenzial, aber riskanter

**Market Cap vs Enterprise Value:**
• Enterprise Value = Market Cap + Schulden - Cash
• EV ist die "echte" Übernahmepreis
• Für Bewertungsvergleiche oft besser als Market Cap

**Tipp:**
Nicht nur auf Market Cap schauen - ein "günstiger" Large Cap kann besser sein als ein "billiger" Micro Cap!`
  },
  eps: {
    title: 'EPS (Gewinn pro Aktie)',
    short: 'Nettogewinn geteilt durch Anzahl Aktien. Basis für viele Bewertungskennzahlen wie das KGV.',
    full: `EPS (Earnings Per Share) zeigt, wie viel Gewinn auf jede einzelne Aktie entfällt.

**Berechnung:**
• Basis-EPS = Nettogewinn / Anzahl ausstehender Aktien
• Verwässertes EPS = berücksichtigt Optionen, Wandelanleihen

**Arten von EPS:**
• **Trailing EPS**: Letzte 12 Monate (historisch, sicher)
• **Forward EPS**: Erwartung für nächste 12 Monate (Schätzung)
• **GAAP EPS**: Nach Rechnungslegungsstandards
• **Non-GAAP EPS**: Bereinigt um Sondereffekte

**Warum ist EPS wichtig?**
- Grundlage für KGV-Berechnung
- Zeigt Gewinnentwicklung pro Aktie
- Berücksichtigt Aktienrückkäufe/-ausgaben

**EPS-Wachstum:**
- Konstantes Wachstum = gesundes Unternehmen
- Analysten-Erwartungen übertreffen = Kurssprung möglich
- Erwartungen verfehlen = oft Kurseinbruch

**Achtung:**
- EPS kann durch Aktienrückkäufe steigen (ohne echtes Wachstum)
- Einmaleffekte verzerren das Bild
- Immer auch den Umsatz beachten!

**Tipp:**
Steigendes EPS bei steigendem Umsatz = echtes Wachstum. Steigendes EPS bei stagnierendem Umsatz = nur Kostenkürzung oder Rückkäufe.`
  },
  freeCashflow: {
    title: 'Free Cashflow',
    short: 'Geld, das nach allen Ausgaben und Investitionen übrig bleibt. Wichtiger als buchhalterischer Gewinn.',
    full: `Der Free Cashflow (FCF) zeigt, wie viel "echtes Geld" ein Unternehmen generiert.

**Berechnung:**
• FCF = Operativer Cashflow - Investitionsausgaben (CapEx)
• Zeigt verfügbares Geld für Dividenden, Schuldenabbau, Rückkäufe

**Warum ist FCF wichtig?**
- Gewinne können manipuliert werden, Cashflow weniger
- Zeigt tatsächliche Geldgenerierung
- Basis für intrinsische Bewertung (DCF-Modell)

**FCF-Verwendung:**
- Dividendenzahlungen
- Aktienrückkäufe
- Schuldenabbau
- Akquisitionen
- Reinvestitionen

**FCF-Yield (FCF/Marktkapitalisierung):**
• > 5%: Aktie generiert viel Cash relativ zum Preis
• Vergleichbar mit Dividendenrendite, aber inkl. nicht-ausgeschüttetem Cash

**Warnsignale:**
- Positiver Gewinn, aber negativer FCF = Vorsicht!
- Dauerhaft negativer FCF = braucht externe Finanzierung
- FCF sinkt während Gewinn steigt = Bilanz-Tricks?

**Tipp:**
Ein Unternehmen mit solidem, wachsendem FCF ist in der Regel ein gutes Investment - auch wenn das KGV hoch erscheint!`
  }
};

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

**Unsere Analyse prüft 3 Dinge:**

1. **Volumen vs. 20-Tage-Durchschnitt**
   - Über 150%: Starkes Signal (Kauf- oder Verkaufsdruck)
   - Unter 50%: Schwache Bewegung, geringe Überzeugung

2. **OBV-Trend (5 Tage)**
   - Steigend: Akkumulation - Käufer sammeln Aktien ein
   - Fallend: Distribution - grosse Anleger verkaufen

3. **Preis-Volumen-Bestätigung**
   - Preis steigt + OBV steigt = gesunder Trend ✓
   - Preis steigt + OBV fällt = Divergenz, Vorsicht! ⚠️

**Warum ist das wichtig?**
"Volume precedes price" - Volumenänderungen zeigen oft Trendwenden, bevor der Preis reagiert. Eine Rallye ohne Volumen ist verdächtig!`
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
