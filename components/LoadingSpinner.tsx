import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
        <div className="relative w-5 h-5">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-slate-200 dark:border-slate-700"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-current border-t-transparent animate-spin"></div>
        </div>
    </div>
  );
};

export default LoadingSpinner;