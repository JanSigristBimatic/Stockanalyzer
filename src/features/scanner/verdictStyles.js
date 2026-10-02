/**
 * Label and colors per verdict type, from best to worst
 */
export const VERDICT_STYLES = {
  'strong-bullish': { label: 'Stark bullish', text: 'text-green-400', bar: 'bg-green-500' },
  bullish: { label: 'Bullish', text: 'text-green-300', bar: 'bg-green-300' },
  neutral: { label: 'Neutral', text: 'text-yellow-400', bar: 'bg-slate-500' },
  bearish: { label: 'Bearish', text: 'text-red-300', bar: 'bg-red-300' },
  'strong-bearish': { label: 'Stark bearish', text: 'text-red-400', bar: 'bg-red-500' }
};

export const SIGNAL_BADGE_CLASSES = {
  bullish: 'bg-green-900/50 text-green-300 border-green-700',
  bearish: 'bg-red-900/50 text-red-300 border-red-700',
  neutral: 'bg-blue-900/40 text-blue-300 border-blue-700'
};
