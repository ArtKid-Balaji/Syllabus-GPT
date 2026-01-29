
export type Subject = 'DBMS' | 'Operating Systems' | 'Computer Networks' | 'AI' | 'Other';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'md' | 'paste';
  content: string;
  size: string;
  uploadDate: string;
  status: 'ready' | 'processing';
}

export interface Notebook {
  id: string;
  title: string;
  subject: Subject;
  documents: Document[];
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: { docName: string; snippet: string }[];
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
}

export interface AppState {
  user: User | null;
  notebooks: Notebook[];
  currentNotebookId: string | null;
  isDarkMode: boolean;
}
