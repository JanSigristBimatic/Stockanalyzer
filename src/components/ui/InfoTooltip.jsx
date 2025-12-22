import React, { useState } from 'react';
import { HelpCircle, XCircle } from 'lucide-react';
import { BIMATIC_BLUE } from '../../constants';

/**
 * Tooltip component for displaying indicator information
 * @param {Object} props
 * @param {Object} props.info - Info object with title and short description
 */
export function InfoTooltip({ info }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!info) return null;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 p-1 rounded-full hover:bg-slate-700 transition-colors"
        title="Info anzeigen"
        aria-label="Info anzeigen"
      >
        <HelpCircle className="w-4 h-4 text-slate-400 hover:text-blue-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute z-50 left-0 top-8 w-80 p-4 bg-slate-800 border-2 rounded-xl shadow-2xl"
            style={{ borderColor: BIMATIC_BLUE }}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-white">{info.title}</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Schließen"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-300 text-sm whitespace-pre-line">{info.short}</p>
            <div className="mt-3 pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-400">Klicke auf "Lernen" Tab für mehr Details</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
