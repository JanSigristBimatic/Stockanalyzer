import { Calculator } from 'lucide-react';
import { useExchangeRate, usePersistentSettings } from '../../hooks';
import { calcRiskPlan } from '../../utils/analysis/riskPlan';
import { formatPrice, mainCurrencyPerQuoteUnit, toMainCurrency } from '../../utils/format';

const ACCOUNT_CURRENCY = 'CHF';
const SETTINGS_KEY = 'stockanalyzer_risk_settings';
const DEFAULT_SETTINGS = { accountSize: '10000', riskPercent: '1', stopMethod: 'atr' };
const STOP_METHODS = [
  { value: 'atr', label: '2x ATR' },
  { value: 'support', label: 'Unter Unterstützung' }
];

/**
 * Position size, stop and target for a long trade with a fixed risk per trade
 */
export function RiskCalculator({ indicators, supportResistance, currency, priceHint }) {
  const [settings, setSettings] = usePersistentSettings(SETTINGS_KEY, DEFAULT_SETTINGS);
  const { rate, loading } = useExchangeRate(toMainCurrency(currency), ACCOUNT_CURRENCY);

  const updateSettings = (changes) => setSettings(prev => ({ ...prev, ...changes }));
  const accountSize = Number(settings.accountSize);
  const riskPercent = Number(settings.riskPercent);
  const hasValidInput = accountSize > 0 && riskPercent > 0 && riskPercent <= 100;

  const plan = hasValidInput && rate != null && indicators.lastATR != null
    ? calcRiskPlan({
      price: indicators.lastPrice,
      atr: indicators.lastATR,
      supports: supportResistance.support,
      resistances: supportResistance.resistance,
      stopMethod: settings.stopMethod,
      accountSize,
      riskPercent,
      exchangeRate: rate * mainCurrencyPerQuoteUnit(currency)
    })
    : null;

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4">
      <div className="text-slate-400 text-sm font-semibold mb-3 flex items-center gap-2">
        <Calculator className="w-4 h-4" />
        Risiko-Rechner
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <NumberField
          label={`Kontogrösse (${ACCOUNT_CURRENCY})`}
          value={settings.accountSize}
          step="1000"
          onChange={(accountSizeInput) => updateSettings({ accountSize: accountSizeInput })}
        />
        <NumberField
          label="Risiko pro Trade (%)"
          value={settings.riskPercent}
          step="0.5"
          onChange={(riskInput) => updateSettings({ riskPercent: riskInput })}
        />
      </div>

      <div className="flex gap-1 mb-4">
        {STOP_METHODS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => updateSettings({ stopMethod: value })}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              settings.stopMethod === value
                ? 'bg-purple-600 text-white border-2 border-purple-400'
                : 'bg-slate-800 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
            }`}
          >
            Stop: {label}
          </button>
        ))}
      </div>

      <RiskPlanResult
        plan={plan}
        status={getStatusMessage({ hasValidInput, loading, rate, currency, stopMethod: settings.stopMethod })}
        formatQuote={(value) => formatPrice(value, currency, priceHint)}
        formatAccount={(value) => formatPrice(value, ACCOUNT_CURRENCY)}
      />

      <p className="text-slate-500 text-xs mt-3">Rechenhilfe für Positionsgrösse und Stop, keine Anlageempfehlung.</p>
    </div>
  );
}

function getStatusMessage({ hasValidInput, loading, rate, currency, stopMethod }) {
  if (!hasValidInput) return 'Bitte Kontogrösse und Risiko (0 bis 100 %) eingeben.';
  if (loading) return 'Wechselkurs wird geladen...';
  if (rate == null) return `Wechselkurs ${toMainCurrency(currency)}/${ACCOUNT_CURRENCY} ist nicht verfügbar.`;
  if (stopMethod === 'support') return 'Keine Unterstützung unterhalb des Kurses gefunden.';
  return 'Zu wenig Daten für den ATR.';
}

function RiskPlanResult({ plan, status, formatQuote, formatAccount }) {
  if (!plan) {
    return <p className="text-slate-400 text-sm">{status}</p>;
  }

  return (
    <div className="space-y-1.5 text-sm">
      <ResultRow label="Stop-Kurs" value={`${formatQuote(plan.stopPrice)} (−${plan.stopDistancePercent.toFixed(1)}%)`} />
      <ResultRow label="Positionsgrösse" value={`${plan.shares} Stück`} />
      <ResultRow label="Positionswert" value={formatAccount(plan.positionValue)} />
      <ResultRow label="Risiko bei Stop" value={formatAccount(plan.riskAmount)} />
      <ResultRow
        label="Ziel (nächster Widerstand)"
        value={plan.targetPrice == null ? 'Kein Widerstand darüber' : formatQuote(plan.targetPrice)}
      />
      {plan.rewardRiskRatio != null && (
        <ResultRow label="Chance/Risiko" value={`1 : ${plan.rewardRiskRatio.toFixed(1)}`} />
      )}
      {plan.shares === 0 && (
        <p className="text-amber-400 text-xs font-semibold">Das Risikobudget reicht nicht für eine Aktie.</p>
      )}
      {plan.isLimitedByAccount && plan.shares > 0 && (
        <p className="text-amber-400 text-xs font-semibold">Positionsgrösse durch die Kontogrösse begrenzt.</p>
      )}
    </div>
  );
}

function ResultRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-semibold text-right">{value}</span>
    </div>
  );
}

function NumberField({ label, value, step, onChange }) {
  return (
    <label className="block">
      <span className="text-slate-400 text-xs font-semibold">{label}</span>
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-slate-800 border-2 border-slate-600 rounded-lg px-3 py-1.5 text-white font-semibold focus:outline-none focus:border-blue-400"
      />
    </label>
  );
}
