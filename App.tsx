
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import InsightsPanel from './components/InsightsPanel';
import AuthGuard from './components/AuthGuard';
import { Notebook, Subject } from './types';

const App: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>(() => {
    const saved = localStorage.getItem('syllabusgpt_notebooks');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentNotebookId, setCurrentNotebookId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('syllabusgpt_notebooks', JSON.stringify(notebooks));
  }, [notebooks]);

  const handleAddNotebook = (subject: Subject, title: string) => {
    const newNotebook: Notebook = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      subject,
      documents: [],
      createdAt: new Date().toISOString()
    };
    setNotebooks([...notebooks, newNotebook]);
    setCurrentNotebookId(newNotebook.id);
  };

  const handleUpdateNotebook = (updated: Notebook) => {
    setNotebooks(notebooks.map(n => n.id === updated.id ? updated : n));
  };

  const handleDeleteNotebook = (id: string) => {
    if (confirm('Are you sure you want to delete this notebook and all its documents?')) {
      setNotebooks(notebooks.filter(n => n.id !== id));
      if (currentNotebookId === id) setCurrentNotebookId(null);
    }
  };

  const currentNotebook = notebooks.find(n => n.id === currentNotebookId) || null;

  return (
    <AuthGuard>
      {(user) => (
        <div className="flex h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
          {/* Main Three-Panel Layout */}
          <Sidebar 
            notebooks={notebooks}
            currentId={currentNotebookId}
            onSelect={setCurrentNotebookId}
            onAdd={handleAddNotebook}
            onDelete={handleDeleteNotebook}
          />
          
          <main className="flex flex-1 overflow-hidden relative">
            <ChatPanel notebook={currentNotebook} />
            <InsightsPanel 
              notebook={currentNotebook} 
              onUpdateNotebook={handleUpdateNotebook} 
            />
          </main>

          {/* Quick Shortcuts Bar (Optional addition for UX) */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-20 md:hidden">
            <button className="p-3 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all">
              <SidebarIcon size={20} />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button className="p-3 text-slate-400 rounded-xl hover:bg-slate-50 transition-all">
              <LayersIcon size={20} />
            </button>
          </div>
        </div>
      )}
    </AuthGuard>
  );
};

// Simple icon fallbacks for the mobile bar
const SidebarIcon = ({size}: {size: number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="9" y1="3" y2="21"/></svg>;
const LayersIcon = ({size}: {size: number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;

export default App;
