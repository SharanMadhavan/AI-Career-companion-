import React, { useState, useEffect, FormEvent } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { JobDescription as JDType } from '../types';
import { generateTextSuggestion } from '../services/geminiService';
import PageHeader from '../components/PageHeader';
import PencilIcon from '../components/icons/PencilIcon';
import TrashIcon from '../components/icons/TrashIcon';
import CheckIcon from '../components/icons/CheckIcon';
import SuggestionButton from '../components/SuggestionButton';
import SmartSuggestions from '../components/SmartSuggestions';
import LoadingSpinner from '../components/LoadingSpinner';

const JobDescription: React.FC = () => {
  const { 
    jobDescriptions, 
    addJobDescription, 
    updateJobDescription, 
    deleteJobDescription, 
    activeJobDescriptionId, 
    setActiveJobDescriptionId 
  } = useAppContext();

  const [editingJd, setEditingJd] = useState<Omit<JDType, 'updatedAt'> | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isTitleLoading, setIsTitleLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);

  const defaultJdTitles = ["Frontend Developer", "Backend Engineer", "Product Manager", "UX Designer", "DevOps Engineer"];
  const jdActions = ["Add Markdown Formatting", "Clarify Responsibilities", "Summarize Requirements"];
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-500/90 border-emerald-400' : 'bg-rose-500/90 border-rose-400';
    toast.className = `px-4 py-3 ${bgColor} backdrop-blur-md border text-white rounded-xl shadow-xl animate-fade-in flex items-center gap-2 pointer-events-auto`;
    toast.innerHTML = `<span class="font-medium">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  };

  useEffect(() => {
    if (editingJd) {
      setTitle(editingJd.title);
      setContent(editingJd.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingJd]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      showToast('Please provide a title and content.', 'error');
      return;
    }
    
    if (editingJd) {
      updateJobDescription({ id: editingJd.id, title, content });
      showToast('Job description updated successfully');
    } else {
      addJobDescription({ title, content });
      showToast('Job description created successfully');
    }

    setEditingJd(null);
    setTitle('');
    setContent('');
  };
  
  const handleEdit = (jd: JDType) => {
    setEditingJd(jd);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingJd(null);
    setTitle('');
    setContent('');
  };

  const handleToggleActive = (id: string) => {
    if (activeJobDescriptionId === id) {
        setActiveJobDescriptionId(null);
    } else {
        setActiveJobDescriptionId(id);
    }
  };

  const handleSuggestTitle = async () => {
    if (!content) {
        showToast("Please provide content first.", 'error');
        return;
    }
    setIsTitleLoading(true);
    try {
        const prompt = `Based on the following job description, suggest a standard job title. Return only the title text.\n\nCONTENT:\n${content}`;
        const suggestedTitle = await generateTextSuggestion(prompt);
         if (suggestedTitle) {
            setTitle(suggestedTitle);
            showToast("Title suggestion applied!", "success");
        }
    } catch (error) {
        showToast("Error generating suggestion.", 'error');
    } finally {
        setIsTitleLoading(false);
    }
  };

  const handleSuggestContent = async () => {
    if (!content && title) {
        handleSmartAction("Generate Sample Description");
        return;
    }
    handleSmartAction("Add Markdown Formatting");
  };

  const handleTitleSelect = (val: string) => {
    setTitle(val);
  };

  const handleSmartAction = async (action: string) => {
      if (!content && !title) {
          showToast("Please add content or a title first.", 'error');
          return;
      }
      setIsContentLoading(true);
      try {
          let prompt = "";
          const context = title ? `CONTEXT: The job title is "${title}".` : "";

          switch (action) {
              case "Generate Sample Description":
                  prompt = `Write a comprehensive job description for a "${title}". Include sections for Responsibilities, Requirements, and Qualifications. Return only the description.`;
                  break;
              case "Add Markdown Formatting":
                  prompt = `${context} Reformat the following job description using proper Markdown. Return only the formatted text.\n\n${content}`;
                  break;
              case "Clarify Responsibilities":
                  prompt = `${context} Review the 'Responsibilities' section and rewrite it to be clearer. Return the full improved description.\n\n${content}`;
                  break;
              case "Summarize Requirements":
                  prompt = `${context} Extract and summarize the key requirements into a bulleted list. Return only the list.\n\n${content}`;
                  break;
              default:
                  prompt = `Improve the following job description: ${content}`;
          }

          const result = await generateTextSuggestion(prompt);
          if (result) {
              setContent(result);
              showToast(`${action === 'Generate Sample Description' ? 'Description Generated' : action + ' Applied'} successfully!`, "success");
          }
      } catch (error) {
          showToast("Failed to apply smart action.", "error");
      } finally {
          setIsContentLoading(false);
      }
  };

  return (
    <div className="space-y-8">
        <PageHeader title="Job Description Management" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Column */}
            <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2">{editingJd ? 'Edit Job Description' : 'Add New JD'}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Define the role you are targeting to unlock tailored insights.</p>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="jd-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Job Title</label>
                        <div className="relative group">
                            <input 
                                id="jd-title" 
                                type="text" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                placeholder="e.g., Senior Frontend Developer @ Google" 
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-4 pr-12 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none shadow-sm group-hover:shadow-md" 
                            />
                            <SuggestionButton onClick={handleSuggestTitle} isLoading={isTitleLoading} disabled={!content} title="Generate Title from Content"/>
                        </div>
                        <SmartSuggestions 
                            suggestions={defaultJdTitles} 
                            onSelect={handleTitleSelect} 
                            label="Common Titles"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="jd-content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Description Content</label>
                         <div className="relative group">
                            <textarea 
                                id="jd-content" 
                                value={content} 
                                onChange={e => setContent(e.target.value)} 
                                rows={16} 
                                placeholder="Paste the full job description here..." 
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-4 pr-12 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none shadow-sm group-hover:shadow-md font-mono text-sm leading-relaxed" 
                            />
                            <SuggestionButton onClick={handleSuggestContent} isLoading={isContentLoading} disabled={!content && !title} title={!content && title ? "Generate Description from Title" : "Reformat & Improve"}/>
                        </div>
                        <SmartSuggestions 
                            suggestions={jdActions} 
                            onSelect={handleSmartAction} 
                            label="AI Formatting"
                        />
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                        <button type="submit" className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                           {editingJd ? 'Update JD' : 'Save JD'}
                        </button>
                        {editingJd && (
                            <button type="button" onClick={handleCancelEdit} className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Sidebar List */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50 h-fit max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <h2 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                        Saved Descriptions
                    </h2>
                    <div className="space-y-4">
                        {jobDescriptions.length > 0 ? jobDescriptions.map(jd => (
                            <div key={jd.id} className={`group relative p-5 rounded-2xl border transition-all duration-300 ${activeJobDescriptionId === jd.id ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'bg-white dark:bg-slate-800/50 border-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`font-semibold text-base ${activeJobDescriptionId === jd.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>{jd.title}</h3>
                                    {activeJobDescriptionId === jd.id && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Modified: {new Date(jd.updatedAt).toLocaleDateString()}</p>
                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                    <button onClick={() => handleEdit(jd)} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="Edit"><PencilIcon className="h-4 w-4" /></button>
                                    <button onClick={() => deleteJobDescription(jd.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title="Delete"><TrashIcon className="h-4 w-4" /></button>
                                    <div className="flex-grow" />
                                    <button 
                                        onClick={() => handleToggleActive(jd.id)} 
                                        className={`text-xs font-medium rounded-lg px-3 py-2 flex items-center gap-1.5 transition-all ${activeJobDescriptionId === jd.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                                    >
                                        {activeJobDescriptionId === jd.id ? <><CheckIcon className="h-3 w-3" /> Active</> : 'Set Active'}
                                    </button>
                                </div>
                            </div>
                        )) : <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl"><p className="text-slate-500 dark:text-slate-400 text-sm">No JDs found.</p></div>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default JobDescription;