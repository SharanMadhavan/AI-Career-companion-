import React from 'react';
// FIX: Corrected import from 'react-router-dom' to resolve module export errors.
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Futuristic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 dark:bg-cyan-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-500/20 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Action Button - Holographic Style */}
       <div 
        className="fixed bottom-8 right-8 z-50 group"
        aria-label="AI Assistant"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse-slow"></div>
        <div className="relative w-14 h-14 rounded-full bg-slate-900/90 backdrop-blur-sm flex items-center justify-center text-white shadow-2xl border border-white/10 cursor-pointer hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H5V4z" />
            <path fillRule="evenodd" d="M3 6h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm2 2a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
        </div>
      </div>

      {/* Placeholder for toast notifications */}
      <div id="toast-container" className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none"></div>
    </div>
  );
};

export default Layout;