import React from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { BIMATIC_BLUE, BIMATIC_LIGHT } from '../../constants';

/**
 * Expandable card for educational content
 * @param {Object} props
 * @param {Object} props.info - Info object with title, short, and full descriptions
 * @param {boolean} props.isExpanded - Whether the card is expanded
 * @param {Function} props.onToggle - Toggle callback
 */
export function EducationCard({ info, isExpanded, onToggle }) {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: BIMATIC_BLUE + '30' }}
          >
            <BookOpen className="w-5 h-5" style={{ color: BIMATIC_BLUE }} />
          </div>
          <div>
            <h3 className="font-bold text-white">{info.title}</h3>
            <p className="text-sm text-slate-400">{info.short}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 border-t border-slate-700">
          <div className="prose prose-invert prose-sm max-w-none">
            {info.full.split('\n').map((line, i) => (
              <EducationLine key={i} line={line} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Renders a single line of educational content with formatting
 */
function EducationLine({ line }) {
  // Bold header
  if (line.startsWith('**') && line.endsWith('**')) {
    return (
      <h4 className="text-white font-bold mt-4 mb-2">
        {line.replace(/\*\*/g, '')}
      </h4>
    );
  }

  // Bullet point with bold label
  if (line.startsWith('• **')) {
    const parts = line.replace('• **', '').split('**:');
    return (
      <p className="text-slate-300 text-sm my-1">
        <span className="font-bold" style={{ color: BIMATIC_LIGHT }}>
          {parts[0]}:
        </span>
        {parts[1]}
      </p>
    );
  }

  // Simple list item
  if (line.startsWith('- ')) {
    return <p className="text-slate-300 text-sm my-1 pl-4">{line}</p>;
  }

  // Empty line
  if (line.trim() === '') {
    return <div className="h-2" />;
  }

  // Regular paragraph
  return <p className="text-slate-300 text-sm my-2">{line}</p>;
}
