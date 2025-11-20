import React from 'react';
// FIX: Corrected import from 'react-router-dom' to resolve module export errors.
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
        aria-label="Back to dashboard"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
    </div>
  );
};

export default PageHeader;