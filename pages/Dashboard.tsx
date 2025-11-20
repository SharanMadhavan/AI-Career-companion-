import React from 'react';
import { useAuth } from '../hooks/useAuth';
// FIX: Corrected import from 'react-router-dom' to resolve module export errors.
import { Link } from 'react-router-dom';
import FileTextIcon from '../components/icons/FileTextIcon';
import BriefcaseIcon from '../components/icons/BriefcaseIcon';
import TargetIcon from '../components/icons/TargetIcon';
import HelpCircleIcon from '../components/icons/HelpCircleIcon';
import MessageSquareIcon from '../components/icons/MessageSquareIcon';
import UserIcon from '../components/icons/UserIcon';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const features = [
    { 
      name: 'Resume Management', 
      path: '/resume', 
      description: 'Upload, organize, and refine your professional resumes.', 
      icon: <FileTextIcon className="h-6 w-6" />,
      color: 'from-blue-500 to-indigo-500',
      shadow: 'shadow-blue-500/20' 
    },
    { 
      name: 'Job Descriptions', 
      path: '/job-description', 
      description: 'Analyze job requirements to align your profile.', 
      icon: <BriefcaseIcon className="h-6 w-6" />,
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20'
    },
    { 
      name: 'Tailor Resume', 
      path: '/tailor-resume', 
      description: 'AI-powered customization to match job keywords.', 
      icon: <TargetIcon className="h-6 w-6" />,
      color: 'from-purple-500 to-fuchsia-500',
      shadow: 'shadow-purple-500/20'
    },
    { 
      name: 'Interview Questions', 
      path: '/interview-prep', 
      description: 'Anticipate technical and behavioral questions.', 
      icon: <HelpCircleIcon className="h-6 w-6" />,
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20'
    },
    { 
      name: 'Mock Interview', 
      path: '/mock-interview', 
      description: 'Real-time voice practice with an AI interviewer.', 
      icon: <MessageSquareIcon className="h-6 w-6" />,
      color: 'from-rose-500 to-pink-500',
      shadow: 'shadow-rose-500/20'
    },
    { 
      name: 'Profile Settings', 
      path: '/profile', 
      description: 'Manage your account preferences and data.', 
      icon: <UserIcon className="h-6 w-6" />,
      color: 'from-cyan-500 to-sky-500',
      shadow: 'shadow-cyan-500/20'
    },
  ];

  return (
    <div className="space-y-12 relative pb-12">
      
      <div className="text-center max-w-4xl mx-auto py-12 space-y-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium uppercase tracking-wider mb-2 backdrop-blur-sm">
          Next Gen Career Tools
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          Master Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600">Career Trajectory</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Leverage advanced AI to craft tailored resumes, practice with realistic mock interviews, and land your dream job faster.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link 
            key={feature.name} 
            to={feature.path} 
            className="group relative flex flex-col p-6 h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg ${feature.shadow} transform group-hover:scale-110 transition-transform duration-500`}>
                    {feature.icon}
                </div>
                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                   <ArrowRightIcon className="h-4 w-4" />
                </div>
            </div>
            
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300 transition-all">
                {feature.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 flex-grow leading-relaxed text-sm mb-4">
                {feature.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;