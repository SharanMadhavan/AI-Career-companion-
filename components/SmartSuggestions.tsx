import React from 'react';
import BulbIcon from './icons/BulbIcon';

interface SmartSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  label?: string;
  icon?: React.ReactNode;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ suggestions, onSelect, label = "Smart Suggestions:", icon }) => {
  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:items-start gap-3">
      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium shrink-0 text-xs uppercase tracking-wide py-1.5">
        {icon || <BulbIcon className="w-4 h-4" />}
        <span>{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 dark:hover:border-blue-800 transition-all duration-200 text-xs font-medium shadow-sm active:scale-95"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;