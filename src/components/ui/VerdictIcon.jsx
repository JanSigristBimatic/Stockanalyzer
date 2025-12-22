import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Scale } from 'lucide-react';

/**
 * Verdict type to icon mapping
 */
const VERDICT_ICONS = {
  'strong-bullish': { Icon: CheckCircle, color: 'text-green-400' },
  'bullish': { Icon: TrendingUp, color: 'text-green-400' },
  'neutral': { Icon: Scale, color: 'text-yellow-400' },
  'bearish': { Icon: TrendingDown, color: 'text-red-400' },
  'strong-bearish': { Icon: XCircle, color: 'text-red-400' }
};

/**
 * Displays an icon representing the trading verdict
 * @param {Object} props
 * @param {string} props.type - Verdict type
 */
export function VerdictIcon({ type }) {
  const config = VERDICT_ICONS[type] || VERDICT_ICONS.neutral;
  const { Icon, color } = config;

  return <Icon className={`w-10 h-10 ${color}`} />;
}
