import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { generateTailoredBullets } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ClipboardIcon from '../components/icons/ClipboardIcon';
import PageHeader from '../components/PageHeader';

const TailorResume: React.FC = () => {
  const { getActiveResume, getActiveJobDescription } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalBullets, setOriginalBullets] = useState<string[]>([]);
  const [tailoredBullets, setTailoredBullets] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const activeResume = getActiveResume();
  const activeJd = getActiveJobDescription();

  const handleGenerate = async () => {
      if (!activeResume?.content || !activeJd?.content) {
      setError('Please set an active resume and an active job description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTailoredBullets([]);
    setOriginalBullets([]);

    try {
      const result = await generateTailoredBullets(activeResume.content, activeJd.content);
      setOriginalBullets(result.originalBullets);
      setTailoredBullets(result.tailoredBullets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Tailor Your Resume" />
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
        
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">Transform your existing experience into targeted bullet points that match the job description keywords.</p>
        
        <div className="flex flex-wrap gap-4 mb-8">
            <button
            onClick={handleGenerate}
            disabled={isLoading || !activeResume || !activeJd}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
            {isLoading ? <><LoadingSpinner /> <span>Optimizing...</span></> : <span>Generate Tailored Bullets</span>}
            </button>
        </div>

        {error && (
             <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl mb-6 backdrop-blur-sm">
                {error}
            </div>
        )}
        
        {(!activeResume || !activeJd) && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl mb-6 backdrop-blur-sm flex items-center gap-2">
             <span className="text-xl">⚠️</span>
            <p>Please set an active resume and an active job description to use this feature.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original Column */}
          <div className="bg-white/40 dark:bg-slate-950/40 rounded-2xl border border-white/20 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-slate-100/50 dark:bg-slate-900/50">
                <h2 className="text-lg font-display font-bold text-slate-700 dark:text-slate-200">Original Highlights</h2>
                <p className="text-xs text-slate-500">From: {activeResume?.title || '...'}</p>
            </div>
            <div className="p-4 h-[500px] overflow-y-auto custom-scrollbar">
              {isLoading && !originalBullets.length && <div className="flex justify-center items-center h-full opacity-50"><LoadingSpinner /></div>}
              {originalBullets.length > 0 ? (
                <ul className="space-y-4">
                  {originalBullets.map((bullet, index) => (
                      <li key={index} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm leading-relaxed shadow-sm">
                          {bullet}
                      </li>
                  ))}
                </ul>
              ) : (
                !isLoading && <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 text-center p-4"><span className="text-4xl mb-2">📄</span><p>Source bullets will appear here</p></div>
              )}
            </div>
          </div>

          {/* Tailored Column */}
          <div className="bg-purple-500/5 dark:bg-purple-900/10 rounded-2xl border border-purple-500/20 dark:border-purple-500/20 overflow-hidden flex flex-col relative">
            <div className="p-4 border-b border-purple-500/10 bg-purple-500/5">
                <h2 className="text-lg font-display font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    ✨ AI Enhanced
                </h2>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Optimized for: {activeJd?.title || '...'}</p>
            </div>
            <div className="p-4 h-[500px] overflow-y-auto custom-scrollbar">
              {isLoading && !tailoredBullets.length && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
              {tailoredBullets.length > 0 && (
                <ul className="space-y-4">
                  {tailoredBullets.map((bullet, index) => (
                    <li key={index} className="group relative p-4 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm leading-relaxed shadow-md hover:shadow-lg hover:border-purple-400 dark:hover:border-purple-500/50 transition-all">
                      <span>{bullet}</span>
                      <button 
                        onClick={() => handleCopy(bullet, index)} 
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-all"
                        title="Copy text"
                      >
                        {copiedIndex === index ? <span className="text-xs font-bold text-green-500">✓</span> : <ClipboardIcon />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {!isLoading && tailoredBullets.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-purple-400 opacity-60 text-center p-4"><span className="text-4xl mb-2">✨</span><p>Optimized bullets will appear here</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailorResume;