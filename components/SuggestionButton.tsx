import React from 'react';
import BulbIcon from './icons/BulbIcon';

interface SuggestionButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({
  onClick,
  isLoading,
  disabled = false,
  className = '',
  title = 'Get AI Suggestion'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`absolute top-1/2 -translate-y-1/2 right-2 p-1.5 text-yellow-400 rounded-full hover:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors ${className}`}
      title={title}
    >
      {isLoading ? (
        <div className="w-5 h-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
      ) : (
        <BulbIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default SuggestionButton;