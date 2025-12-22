import React from 'react';
import { InfoTooltip } from './InfoTooltip';
import { INDICATOR_INFO } from '../../constants';

/**
 * Header component for chart sections with optional info tooltip
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.title - Section title
 * @param {string} props.color - Icon color
 * @param {string} [props.infoKey] - Key for INDICATOR_INFO lookup
 */
export function ChartHeader({ icon: Icon, title, color, infoKey }) {
  const info = infoKey ? INDICATOR_INFO[infoKey] : null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-6 h-6" style={{ color }} />
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {info && <InfoTooltip info={info} />}
    </div>
  );
}
