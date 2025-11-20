
export interface User {
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export interface Resume {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface JobDescription {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface AppContextType {
  resumes: Resume[];
  activeResumeId: string | null;
  addResume: (resume: Omit<Resume, 'id' | 'updatedAt'>) => void;
  updateResume: (resume: Omit<Resume, 'updatedAt'>) => void;
  deleteResume: (id: string) => void;
  setActiveResumeId: (id: string | null) => void;
  getActiveResume: () => Resume | undefined;

  jobDescriptions: JobDescription[];
  activeJobDescriptionId: string | null;
  addJobDescription: (jd: Omit<JobDescription, 'id' | 'updatedAt'>) => void;
  updateJobDescription: (jd: Omit<JobDescription, 'updatedAt'>) => void;
  deleteJobDescription: (id: string) => void;
  setActiveJobDescriptionId: (id: string | null) => void;
  getActiveJobDescription: () => JobDescription | undefined;
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface InterviewFeedback {
  rating: number;
  score: number;
  feedbackText: string;
}
