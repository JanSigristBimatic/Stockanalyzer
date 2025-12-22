import React from 'react';

/**
 * Signal type to CSS class mapping
 */
const BADGE_STYLES = {
  bullish: 'bg-green-600 text-white',
  bearish: 'bg-red-600 text-white',
  neutral: 'bg-yellow-600 text-white',
  overbought: 'bg-red-600 text-white',
  oversold: 'bg-green-600 text-white'
};

/**
 * Displays a colored badge for trading signals
 * @param {Object} props
 * @param {string} props.type - Signal type ('bullish', 'bearish', 'neutral', 'overbought', 'oversold')
 * @param {string} props.label - Text to display
 */
export function SignalBadge({ type, label }) {
  const colorClass = BADGE_STYLES[type] || BADGE_STYLES.neutral;

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded ${colorClass}`}>
      {label}
    </span>
  );
}
