import React from 'react';
// FIX: Corrected import from 'react-router-dom' to resolve module export errors.
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppContextProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';

const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Error</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">{error.message}</p>
      <button onClick={() => window.location.reload()} className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
        Reload Page
      </button>
    </div>
  </div>
);

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import JobDescription from './pages/JobDescription';
import TailorResume from './pages/TailorResume';
import InterviewPrep from './pages/InterviewPrep';
import MockInterview from './pages/MockInterview';
import Profile from './pages/Profile';

const App: React.FC = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Comprehensive chrome extension error detection
      const errorMsg = event.error?.message || '';
      const errorStr = String(event.error || '');
      
      const isChromeError = 
        errorMsg.includes('chrome') || 
        errorMsg.includes('extension') || 
        errorMsg.includes('runtime') ||
        errorMsg.includes('Blocked message') ||
        errorMsg.includes('blocked') ||
        errorMsg.includes('unauthorized') ||
        errorStr.includes('chrome') ||
        errorStr.includes('extension') ||
        errorStr.includes('blocked') ||
        event.error?.constructor?.name === 'SecurityError';
      
      if (isChromeError) {
        event.preventDefault();
        event.stopPropagation();
        return; // Silently ignore
      }
      
      // Only log non-extension errors
      if (event.error && !isChromeError) {
        console.error('Global error:', event.error);
        setError(event.error);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const reasonMsg = String(reason?.message || reason || '').toLowerCase();
      
      const isChromeError = 
        reasonMsg.includes('chrome') || 
        reasonMsg.includes('extension') || 
        reasonMsg.includes('runtime') ||
        reasonMsg.includes('blocked') ||
        reasonMsg.includes('unauthorized');
      
      if (isChromeError) {
        event.preventDefault();
        return; // Silently ignore
      }
      
      if (reason instanceof Error && !isChromeError) {
        console.error('Unhandled promise rejection:', reason);
        setError(reason);
      }
    };

    window.addEventListener('error', handleError, true); // Capture phase
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true); // Capture phase
    
    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, []);

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContextProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="resume" element={<Resume />} />
                <Route path="job-description" element={<JobDescription />} />
                <Route path="tailor-resume" element={<TailorResume />} />
                <Route path="interview-prep" element={<InterviewPrep />} />
                <Route path="mock-interview" element={<MockInterview />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </HashRouter>
        </AppContextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;