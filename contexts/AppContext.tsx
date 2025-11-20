
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { AppContextType, Resume, JobDescription } from '../types';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Resume State
  const [resumes, setResumes] = useState<Resume[]>(() => {
    const storedResumes = localStorage.getItem('resumes');
    return storedResumes ? JSON.parse(storedResumes) : [];
  });
  const [activeResumeId, setActiveResumeId] = useState<string | null>(() => {
    return localStorage.getItem('activeResumeId') || null;
  });

  // Job Description State
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>(() => {
    const storedJds = localStorage.getItem('jobDescriptions');
    return storedJds ? JSON.parse(storedJds) : [];
  });
  const [activeJobDescriptionId, setActiveJobDescriptionId] = useState<string | null>(() => {
    return localStorage.getItem('activeJobDescriptionId') || null;
  });


  // --- Effects for Persistence ---
  useEffect(() => {
    localStorage.setItem('resumes', JSON.stringify(resumes));
  }, [resumes]);

  useEffect(() => {
    if (activeResumeId) {
      localStorage.setItem('activeResumeId', activeResumeId);
    } else {
      localStorage.removeItem('activeResumeId');
    }
  }, [activeResumeId]);
  
  useEffect(() => {
    localStorage.setItem('jobDescriptions', JSON.stringify(jobDescriptions));
  }, [jobDescriptions]);

  useEffect(() => {
    if (activeJobDescriptionId) {
      localStorage.setItem('activeJobDescriptionId', activeJobDescriptionId);
    } else {
      localStorage.removeItem('activeJobDescriptionId');
    }
  }, [activeJobDescriptionId]);

  // --- Resume Functions ---
  const addResume = (resumeData: Omit<Resume, 'id' | 'updatedAt'>) => {
    const newResume: Resume = { ...resumeData, id: Date.now().toString(), updatedAt: new Date().toISOString() };
    setResumes(prev => [...prev, newResume]);
  };

  const updateResume = (updatedResume: Omit<Resume, 'updatedAt'>) => {
    setResumes(prev => prev.map(r => r.id === updatedResume.id ? { ...updatedResume, updatedAt: new Date().toISOString() } : r));
  };

  const deleteResume = (id: string) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    if (activeResumeId === id) setActiveResumeId(null);
  };

  const getActiveResume = () => resumes.find(r => r.id === activeResumeId);

  // --- Job Description Functions ---
  const addJobDescription = (jdData: Omit<JobDescription, 'id' | 'updatedAt'>) => {
    const newJd: JobDescription = { ...jdData, id: Date.now().toString(), updatedAt: new Date().toISOString() };
    setJobDescriptions(prev => [...prev, newJd]);
  };

  const updateJobDescription = (updatedJd: Omit<JobDescription, 'updatedAt'>) => {
    setJobDescriptions(prev => prev.map(jd => jd.id === updatedJd.id ? { ...updatedJd, updatedAt: new Date().toISOString() } : jd));
  };

  const deleteJobDescription = (id: string) => {
    setJobDescriptions(prev => prev.filter(jd => jd.id !== id));
    if (activeJobDescriptionId === id) setActiveJobDescriptionId(null);
  };

  const getActiveJobDescription = () => jobDescriptions.find(jd => jd.id === activeJobDescriptionId);


  const appContextValue: AppContextType = {
    resumes,
    activeResumeId,
    addResume,
    updateResume,
    deleteResume,
    setActiveResumeId,
    getActiveResume,
    jobDescriptions,
    activeJobDescriptionId,
    addJobDescription,
    updateJobDescription,
    deleteJobDescription,
    setActiveJobDescriptionId,
    getActiveJobDescription,
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};