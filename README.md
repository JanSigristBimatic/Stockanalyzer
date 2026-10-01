# Stock Analyzer Pro

Technische und fundamentale Aktienanalyse von Bimatic GmbH. Die App berechnet Indikatoren (RSI, MACD, Bollinger, ATR, Stochastik, ADX, OBV), Fibonacci-Levels und Support/Resistance und fasst alles in einem Gesamturteil zusammen. Dazu kommen ein Auto-Scanner und eine Watchlist.

Die Daten stammen aus der inoffiziellen Yahoo-Finance-API. Kurse können verzögert sein. Die App ist ein Analysewerkzeug und keine Anlageberatung.

## Voraussetzungen

- Node.js 20 oder neuer
- Für das Deployment: [Vercel CLI](https://vercel.com/docs/cli), mit dem bestehenden Projekt verknüpft

## Entwicklung

```bash
npm install
npm run dev
```

Die App läuft auf http://localhost:3000. Der Yahoo-Proxy ist im Dev-Server eingebaut (`/api/yahoo`), ein separater Prozess ist nicht nötig.

## Tests und Qualität

```bash
npm test        # Vitest: Indikatoren, Urteil, Datenparser, Formatierung, Proxy, Middleware
npm run lint    # ESLint inklusive React-Hooks-Regeln
npm run build   # Produktions-Build
```

Vor jedem Commit sollten alle drei Befehle fehlerfrei durchlaufen.

## Aufbau

```
api/yahoo.js            Vercel Function, dünner Adapter auf den Proxy-Kern
server/yahooProxy.js    Proxy-Kern: Allowlist, Yahoo-Crumb, Caching-Header (Vercel und Dev-Server)
middleware.js           Basic Auth für das gesamte Deployment
src/App.jsx             Kompositions-Root mit Tabs
src/features/           Suche, Analyse, Kennzahlen, Charts, Scanner, Watchlist, Lernen
src/components/         Layout und wiederverwendbare UI-Bausteine
src/hooks/              Zustand der Analyse, Watchlist, Scanner und Autocomplete
src/services/           Yahoo-Zugriff und analyzeSymbol (Laden plus Analyse)
src/utils/analysis/     analyzeStock (gemeinsame Pipeline), Urteil, Fibonacci, Support/Resistance
src/utils/indicators/   Indikatorberechnungen
```

Analyse-Tab, Watchlist und Scanner verwenden dieselbe Pipeline (`analyzeStock`) und liefern deshalb für dasselbe Symbol und denselben Zeitraum identische Ergebnisse.

## Deployment (Vercel)

Das Deployment ist per Basic Auth geschützt. Ohne gesetzte Zugangsdaten bleibt die Seite gesperrt (HTTP 500), deshalb zuerst die Umgebungsvariablen anlegen:

```bash
vercel env add BASIC_AUTH_USER
```

```bash
vercel env add BASIC_AUTH_PASSWORD
```

Danach eine Vorschau erstellen und prüfen:

```bash
vercel
```

Die Produktion wird erst nach erfolgreicher Prüfung der Vorschau aktualisiert:

```bash
vercel --prod
```
