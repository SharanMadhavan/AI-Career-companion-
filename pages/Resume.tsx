import React, { useState, useCallback, ChangeEvent, FormEvent, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Resume as ResumeType } from '../types';
import { generateTextSuggestion, extractTextFromPdf } from '../services/geminiService';
import PageHeader from '../components/PageHeader';
import PencilIcon from '../components/icons/PencilIcon';
import TrashIcon from '../components/icons/TrashIcon';
import CheckIcon from '../components/icons/CheckIcon';
import SuggestionButton from '../components/SuggestionButton';
import SmartSuggestions from '../components/SmartSuggestions';
import LoadingSpinner from '../components/LoadingSpinner';

const Resume: React.FC = () => {
  const { resumes, addResume, updateResume, deleteResume, activeResumeId, setActiveResumeId } = useAppContext();

  const [editingResume, setEditingResume] = useState<Omit<ResumeType, 'updatedAt'> | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isTitleLoading, setIsTitleLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  
  const defaultTitles = ["Software Engineer", "Product Manager", "Data Scientist", "Sales Representative", "Marketing Specialist"];
  const contentActions = ["Fix Grammar", "Professional Tone", "Action Verbs", "Summarize"];

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-500/90 border-emerald-400' : 'bg-rose-500/90 border-rose-400';
    toast.className = `px-4 py-3 ${bgColor} backdrop-blur-md border text-white rounded-xl shadow-xl animate-fade-in flex items-center gap-2 pointer-events-auto`;
    toast.innerHTML = `<span class="font-medium">${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  useEffect(() => {
    if (editingResume) {
      setTitle(editingResume.title);
      setContent(editingResume.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingResume]);

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsFileProcessing(true);

    try {
        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setContent(text);
                setIsFileProcessing(false);
            };
            reader.readAsText(file);
        } else if (file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = (reader.result as string).split(',')[1];
                try {
                    const extractedText = await extractTextFromPdf(base64String, file.type);
                    setContent(extractedText);
                    showToast("PDF Parsed Successfully!", "success");
                } catch (error) {
                    showToast("Failed to parse PDF with AI.", "error");
                } finally {
                    setIsFileProcessing(false);
                }
            };
            reader.readAsDataURL(file);
        } else if (file.name.endsWith('.docx')) {
             setIsFileProcessing(false);
             showToast("DOCX parsing is limited. Please copy-paste or use PDF.", "error");
        } else {
            setIsFileProcessing(false);
            showToast('Unsupported file format. Please use PDF or TXT.', 'error');
        }
    } catch (e) {
        setIsFileProcessing(false);
        showToast("Error processing file", "error");
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      showToast('Please provide a title and content.', 'error');
      return;
    }
    
    if (editingResume) {
      updateResume({ id: editingResume.id, title, content });
      showToast('Resume updated successfully');
    } else {
      addResume({ title, content });
      showToast('Resume created successfully');
    }

    setEditingResume(null);
    setTitle('');
    setContent('');
    setFileName('');
  };
  
  const handleEdit = (resume: ResumeType) => {
      setEditingResume(resume);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
      setEditingResume(null);
      setTitle('');
      setContent('');
      setFileName('');
  }

  const handleToggleActive = (id: string) => {
    if (activeResumeId === id) {
        setActiveResumeId(null); 
    } else {
        setActiveResumeId(id);
    }
  };

  const handleSuggestTitle = async () => {
    if (!content) {
        showToast("Please provide resume content first.", 'error');
        return;
    }
    setIsTitleLoading(true);
    try {
        const prompt = `Based on the following resume content, suggest a concise and professional title. Return only the title text.\n\nCONTENT:\n${content}`;
        const suggestedTitle = await generateTextSuggestion(prompt);
        if (suggestedTitle) {
            setTitle(suggestedTitle);
            showToast("Title suggestion applied!", "success");
        }
    } catch (error) {
        showToast("Error generating suggestion.", "error");
    } finally {
        setIsTitleLoading(false);
    }
  };

  const handleSuggestContent = async () => {
    if (!content && title) {
        handleSmartAction("Generate Template");
        return;
    }
    if (!content) {
         showToast("Please add content or a title first.", 'error');
         return;
    }
    handleSmartAction("Professional Tone");
  };

  const handleTitleSelect = (selectedTitle: string) => {
    setTitle(selectedTitle);
  };

  const handleSmartAction = async (action: string) => {
    if (!content && !title) {
        showToast("Please add content or a title first.", 'error');
        return;
    }

    setIsContentLoading(true);
    try {
        let prompt = "";
        const context = title ? `CONTEXT: The candidate's job title is "${title}".` : "";

        switch (action) {
            case "Generate Template":
                 prompt = `Create a professional resume template/outline for a "${title}". Include sections for Summary, Skills, and Experience with placeholder bullet points. Return only the resume content.`;
                 break;
            case "Fix Grammar":
                prompt = `${context} Fix all grammar and spelling errors in the following resume content. Maintain the original meaning. Return only the corrected text.\n\n${content}`;
                break;
            case "Professional Tone":
                prompt = `${context} Rewrite the following resume content to have a more professional, corporate tone. Return only the rewritten text.\n\n${content}`;
                break;
            case "Action Verbs":
                prompt = `${context} Rewrite the bullet points in the following resume content to start with strong action verbs. Return only the improved text.\n\n${content}`;
                break;
            case "Summarize":
                prompt = `${context} Create a professional summary paragraph based on the following resume content. Return only the summary.\n\n${content}`;
                break;
            default:
                prompt = `Improve the following resume content: ${content}`;
        }

        const result = await generateTextSuggestion(prompt);
        if (result) {
            setContent(result);
            showToast(`${action === 'Generate Template' ? 'Template Generated' : action + ' Applied'} successfully!`, "success");
        }
    } catch (error) {
        showToast("Failed to apply smart action.", "error");
    } finally {
        setIsContentLoading(false);
    }
  };

  return (
    <div className="space-y-8">
        <PageHeader title="Resume Management" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Column */}
            <div className="lg:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-slate-700/50 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-2">{editingResume ? 'Edit Resume' : 'Add New Resume'}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Build your professional profile using AI assistance.</p>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="resume-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Resume Title</label>
                        <div className="relative group">
                           <input 
                            id="resume-title" 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g., Senior Software Engineer" 
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-4 pr-12 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none shadow-sm group-hover:shadow-md" 
                           />
                           <SuggestionButton onClick={handleSuggestTitle} isLoading={isTitleLoading} disabled={!content} title="Generate Title from Content"/>
                        </div>
                        <SmartSuggestions 
                            suggestions={defaultTitles} 
                            onSelect={handleTitleSelect} 
                            label="Popular Titles"
                        />
                    </div>

                     <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Import File</label>
                        <label className={`w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all group ${isFileProcessing ? 'opacity-75 cursor-wait' : ''}`}>
                            <input type="file" accept=".pdf,.txt,.docx" onChange={handleFileChange} className="hidden" disabled={isFileProcessing} />
                            {isFileProcessing ? (
                                <div className="flex items-center gap-3 text-blue-500">
                                    <LoadingSpinner />
                                    <span className="font-medium">Extracting text with AI...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <span className="text-sm font-medium">{fileName || 'Upload PDF or TXT'}</span>
                                    {!fileName && <span className="text-xs opacity-70">Click to browse</span>}
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="resume-content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Content</label>
                        <div className="relative group">
                            <textarea 
                                id="resume-content" 
                                value={content} 
                                onChange={e => setContent(e.target.value)} 
                                rows={16} 
                                placeholder="Paste your resume content here or generate a template..." 
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-4 pr-12 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none shadow-sm group-hover:shadow-md font-mono text-sm leading-relaxed" 
                            />
                            <SuggestionButton onClick={handleSuggestContent} isLoading={isContentLoading} disabled={!content && !title} title={!content && title ? "Generate Template from Title" : "Enhance Content with AI"}/>
                        </div>
                        <SmartSuggestions 
                            suggestions={contentActions} 
                            onSelect={handleSmartAction} 
                            label="AI Actions"
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button type="submit" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                           {editingResume ? 'Update Resume' : 'Save Resume'}
                        </button>
                        {editingResume && (
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
                        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                        Your Resumes
                    </h2>
                    <div className="space-y-4">
                        {resumes.length > 0 ? resumes.map(r => (
                            <div key={r.id} className={`group relative p-5 rounded-2xl border transition-all duration-300 ${activeResumeId === r.id ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10' : 'bg-white dark:bg-slate-800/50 border-transparent hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`font-semibold text-base ${activeResumeId === r.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>{r.title}</h3>
                                    {activeResumeId === r.id && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Modified: {new Date(r.updatedAt).toLocaleDateString()}</p>
                                
                                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                    <button onClick={() => handleEdit(r)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit"><PencilIcon className="h-4 w-4" /></button>
                                    <button onClick={() => deleteResume(r.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title="Delete"><TrashIcon className="h-4 w-4" /></button>
                                    <div className="flex-grow" />
                                    <button 
                                        onClick={() => handleToggleActive(r.id)} 
                                        className={`text-xs font-medium rounded-lg px-3 py-2 flex items-center gap-1.5 transition-all ${activeResumeId === r.id ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                                    >
                                        {activeResumeId === r.id ? <><CheckIcon className="h-3 w-3" /> Active</> : 'Set Active'}
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                                <p className="text-slate-500 dark:text-slate-400 text-sm">No resumes found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Resume;