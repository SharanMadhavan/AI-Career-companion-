import React from 'react';
// FIX: Corrected import from 'react-router-dom' to resolve module export errors.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // This is a mock login. In a real app, this would trigger the OAuth flow.
    const mockUser = {
      name: 'Dadige',
      email: 'dadigeladsm@gmail.com',
    };
    login(mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <div className="p-8 max-w-sm w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl text-center border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Career Companion</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Sign in to get started</p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.35 6.48C12.73 13.72 17.9 9.5 24 9.5z"></path>
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h13.04c-.58 2.92-2.26 5.4-4.78 7.08l6.85 6.85c3.87-3.56 6.2-8.95 6.2-15.89z"></path>
            <path fill="#FBBC05" d="M10.91 28.7a14.92 14.92 0 0 1 0-9.4l-8.35-6.48A25.001 25.001 0 0 0 0 24c0 3.58.76 6.95 2.1 9.92l8.81-6.72z"></path>
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-6.85-6.85c-2.18 1.45-4.96 2.3-8.04 2.3-6.1 0-11.27-4.22-13.09-9.92L2.56 34.78C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;