import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { createInterviewChat, generateInterviewFeedback } from '../services/geminiService';
import { ChatMessage, InterviewFeedback } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import MicIcon from '../components/icons/MicIcon';
import DownloadIcon from '../components/icons/DownloadIcon';
import PageHeader from '../components/PageHeader';
import StarRating from '../components/StarRating';
import type { Chat } from '@google/genai';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';


const MockInterview: React.FC = () => {
  const { getActiveJobDescription } = useAppContext();
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [interviewState, setInterviewState] = useState<'idle' | 'active' | 'finished'>('idle');
  const [feedback, setFeedback] = useState<InterviewFeedback | string | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const activeJd = getActiveJobDescription();


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
          setIsListening(false);
      }
    }
  }, []);
  
  const toggleListening = () => {
      if (!recognitionRef.current) {
          alert("Sorry, your browser doesn't support speech recognition.");
          return;
      }
      if (isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
      } else {
          recognitionRef.current.start();
          setIsListening(true);
      }
  }

  const startInterview = async () => {
    const session = createInterviewChat();
    setChatSession(session);
    setInterviewState('active');
    setIsAiTyping(true);
    const response = await session.sendMessage({ message: `The user is applying for this job:\n\n${activeJd?.content}\n\nPlease start the interview.` });
    setIsAiTyping(false);
    setMessages([{ sender: 'ai', text: response.text }]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chatSession) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsAiTyping(true);

    const response = await chatSession.sendMessage({ message: userInput });
    setIsAiTyping(false);
    setMessages([...newMessages, { sender: 'ai', text: response.text }]);
  };

  const endInterview = async () => {
    setInterviewState('finished');
    if (!activeJd?.content) {
        setFeedback("Could not generate feedback because no active job description was found.");
        return;
    };
    setIsGeneratingFeedback(true);
    const chatHistory = messages.map(m => `${m.sender === 'user' ? 'Candidate' : 'Interviewer'}: ${m.text}`).join('\n');
    try {
      const fb = await generateInterviewFeedback(activeJd.content, chatHistory);
      setFeedback(fb);
    } catch (error) {
      setFeedback("Sorry, I couldn't generate feedback at this time.");
    }
    setIsGeneratingFeedback(false);
  };
  
  const resetInterview = () => {
    setInterviewState('idle');
    setMessages([]);
    setFeedback(null);
    setChatSession(null);
  }

  const handleDownloadTranscript = () => {
    let content = '';
    if (feedback && typeof feedback === 'object') {
        content += '--- MOCK INTERVIEW FEEDBACK ---\n\n';
        content += `Overall Rating: ${feedback.rating.toFixed(1)} / 5.0\n`;
        content += `Overall Score: ${feedback.score} / 100\n\n`;
        content += '--- DETAILED FEEDBACK ---\n\n';
        content += `${feedback.feedbackText}\n\n`;
    }

    content += '--- INTERVIEW TRANSCRIPT ---\n\n';
    content += messages.map(m => `${m.sender === 'user' ? 'Candidate' : 'Interviewer'}: ${m.text}`).join('\n\n---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock_interview_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Mock Interview" />
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 relative overflow-hidden flex flex-col h-[calc(100vh-180px)] min-h-[600px]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500"></div>

        {interviewState === 'idle' && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
             <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6 text-rose-500 animate-pulse">
                 <MicIcon className="h-10 w-10" />
             </div>
             <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-4">Ready to Practice?</h2>
             <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-lg">Start a real-time voice conversation with our AI interviewer customized to your job description.</p>
             
             {!activeJd && (
               <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl mb-6 flex items-center gap-2">
                 <span className="text-xl">⚠️</span>
                 <p>Set an active job description to start.</p>
               </div>
             )}
             
             <button 
                onClick={startInterview} 
                disabled={!activeJd} 
                className="px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg rounded-full shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
                 Start Interview
             </button>
          </div>
        )}

        {interviewState === 'active' && (
          <div className="flex flex-col h-full">
            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm leading-relaxed text-sm md:text-base ${
                      msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                      }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start animate-fade-in">
                    <div className="p-4 rounded-2xl rounded-bl-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex gap-1.5 items-center h-14">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce animation-delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce animation-delay-200"></div>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-4xl mx-auto">
                    <button 
                        type="button" 
                        onClick={toggleListening} 
                        className={`p-3 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-red-500/50 shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        title="Toggle Microphone"
                    >
                        <MicIcon className="h-6 w-6" />
                    </button>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your answer..."
                        className="flex-grow bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-950 border focus:border-blue-500 rounded-full px-6 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        disabled={isAiTyping}
                    />
                    <button 
                        type="submit" 
                        disabled={isAiTyping || !userInput} 
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                     <button 
                        type="button" 
                        onClick={endInterview} 
                        className="px-4 py-3 text-rose-500 font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-colors"
                    >
                        End
                    </button>
                </form>
            </div>
          </div>
        )}
        
        {interviewState === 'finished' && (
          <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-white mb-6 text-center">Performance Analysis</h2>
                
                {isGeneratingFeedback && (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <LoadingSpinner /> 
                        <span className="text-slate-500 dark:text-slate-400 animate-pulse">AI is analyzing your responses...</span>
                    </div>
                )}
                
                {feedback && typeof feedback === 'object' && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Score Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            </div>
                            <h3 className="text-amber-100 text-sm font-semibold uppercase tracking-wider mb-1">Overall Rating</h3>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-bold">{feedback.rating.toFixed(1)}</span>
                                <span className="text-xl mb-1 opacity-80">/ 5.0</span>
                            </div>
                            <div className="mt-4">
                                <StarRating rating={feedback.rating} />
                            </div>
                         </div>

                         <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2h2v2h2v-2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h2v2z"/></svg>
                             </div>
                            <h3 className="text-blue-100 text-sm font-semibold uppercase tracking-wider mb-1">Match Score</h3>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-bold">{feedback.score}</span>
                                <span className="text-xl mb-1 opacity-80">%</span>
                            </div>
                             <div className="mt-4 h-2 bg-black/20 rounded-full overflow-hidden">
                                 <div className="h-full bg-white/90" style={{ width: `${feedback.score}%` }}></div>
                             </div>
                         </div>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
                        <div dangerouslySetInnerHTML={{ __html: marked(feedback.feedbackText) }} />
                    </div>
                    
                    <div className="flex justify-center gap-4 pt-4">
                        <button onClick={resetInterview} className="px-8 py-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            Start New Session
                        </button>
                        <button 
                            onClick={handleDownloadTranscript} 
                            className="px-8 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                            <DownloadIcon className="h-5 w-5" /> Transcript
                        </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;