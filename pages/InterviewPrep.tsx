import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { generateInterviewQuestions } from '../services/geminiService';
import { QuestionAnswer } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
import DownloadIcon from '../components/icons/DownloadIcon';
import PageHeader from '../components/PageHeader';

const QuestionItem: React.FC<{ qa: QuestionAnswer }> = ({ qa }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white dark:bg-slate-900 shadow-lg ring-1 ring-amber-500/50 border-amber-500/50' : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-start gap-4 text-left p-5 cursor-pointer"
      >
        <span className={`text-sm md:text-base font-semibold break-words transition-colors ${isOpen ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
            {qa.question}
        </span>
        <div className={`p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 bg-amber-100 dark:bg-amber-900/30 text-amber-600' : ''}`}>
             <ChevronDownIcon className="h-5 w-5" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-6 pt-0">
            <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-4"></div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                <p className="whitespace-pre-wrap font-medium">Model Answer:</p>
                <p className="whitespace-pre-wrap">{qa.answer}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

const InterviewPrep: React.FC = () => {
  const { getActiveJobDescription } = useAppContext();
  const [questionType, setQuestionType] = useState<'Technical' | 'Behavioral'>('Behavioral');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionAnswer[]>([]);

  const activeJd = getActiveJobDescription();

  const handleGenerate = async (isLoadMore: boolean = false) => {
    if (!activeJd?.content) {
      setError('Please set an active job description first.');
      return;
    }

    if (isLoadMore) {
        setIsLoadMoreLoading(true);
    } else {
        setIsLoading(true);
        setQuestions([]);
    }
    
    setError(null);

    try {
      const existingQuestionTexts = isLoadMore ? questions.map(q => q.question) : [];
      const generatedQuestions = await generateInterviewQuestions(activeJd.content, questionType, existingQuestionTexts);
      
      if (isLoadMore) {
        setQuestions(prev => [...prev, ...generatedQuestions]);
      } else {
        setQuestions(generatedQuestions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setIsLoadMoreLoading(false);
    }
  };

  const handleDownload = () => {
    const content = questions.map(qa => `Q: ${qa.question}\n\nA: ${qa.answer}\n\n---\n\n`).join('');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_questions_${questionType.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Interview Preparation" />
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
        
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">Predict the questions you'll be asked. Generate Technical or Behavioral scenarios tailored to the job.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setQuestionType('Behavioral')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${questionType === 'Behavioral' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Behavioral
            </button>
            <button
              onClick={() => setQuestionType('Technical')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${questionType === 'Technical' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Technical
            </button>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
             <button
                onClick={() => handleGenerate(false)}
                disabled={isLoading || isLoadMoreLoading || !activeJd}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? <><LoadingSpinner /> <span>Thinking...</span></> : <span>Generate Questions</span>}
            </button>
            {questions.length > 0 && (
                <button
                onClick={handleDownload}
                className="px-4 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
                >
                <DownloadIcon className="h-5 w-5" />
                </button>
            )}
          </div>
        </div>

        {error && (
             <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl mb-6 backdrop-blur-sm">
                {error}
            </div>
        )}
        {!activeJd && (
             <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl mb-6 backdrop-blur-sm flex items-center gap-2">
             <span className="text-xl">⚠️</span>
            <p>Please set an active job description to use this feature.</p>
          </div>
        )}

        <div className="space-y-4 min-h-[200px]">
          {questions.length > 0 ? (
            questions.map((qa, index) => <QuestionItem key={index} qa={qa} />)
          ) : (
            !isLoading && <div className="flex flex-col items-center justify-center h-60 text-slate-400 opacity-60"><span className="text-5xl mb-4">💡</span><p>Your interview questions will appear here.</p></div>
          )}
        </div>

        {questions.length > 0 && (
            <div className="mt-10 flex justify-center">
                <button 
                    onClick={() => handleGenerate(true)}
                    disabled={isLoadMoreLoading}
                    className="px-6 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2"
                >
                    {isLoadMoreLoading ? <LoadingSpinner /> : <ChevronDownIcon className="h-4 w-4" />}
                    {isLoadMoreLoading ? "Loading more..." : "Load More Questions"}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;