
import React, { useState } from 'react';
import { 
  Library, 
  Plus, 
  BookOpen, 
  Database, 
  Cpu, 
  Network, 
  BrainCircuit, 
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { Notebook, Subject } from '../types';

interface SidebarProps {
  notebooks: Notebook[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onAdd: (subject: Subject, title: string) => void;
  onDelete: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notebooks, currentId, onSelect, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<Subject>('DBMS');

  const subjects: { name: Subject; icon: any; color: string }[] = [
    { name: 'DBMS', icon: Database, color: 'text-blue-600 bg-blue-50' },
    { name: 'Operating Systems', icon: Cpu, color: 'text-purple-600 bg-purple-50' },
    { name: 'Computer Networks', icon: Network, color: 'text-green-600 bg-green-50' },
    { name: 'AI', icon: BrainCircuit, color: 'text-orange-600 bg-orange-50' },
    { name: 'Other', icon: BookOpen, color: 'text-slate-600 bg-slate-50' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd(newSubject, newTitle);
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col shrink-0 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Library className="text-white w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-800 tracking-tight">Library</h2>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg transition-colors font-medium text-sm"
        >
          <Plus size={16} /> New Notebook
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="mb-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
            <input 
              autoFocus
              className="w-full bg-white border border-indigo-200 rounded p-2 text-sm mb-2 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Notebook name..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <select 
              className="w-full bg-white border border-indigo-200 rounded p-2 text-xs mb-3 outline-none"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value as Subject)}
            >
              {subjects.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white text-xs py-1.5 rounded font-medium">Create</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-white text-slate-500 text-xs py-1.5 rounded border border-slate-200 font-medium">Cancel</button>
            </div>
          </form>
        )}

        {subjects.map((sub) => {
          const subNotebooks = notebooks.filter(n => n.subject === sub.name);
          if (subNotebooks.length === 0 && sub.name !== 'Other') return null;

          return (
            <div key={sub.name} className="mb-6">
              <div className="flex items-center gap-2 px-2 mb-2">
                <div className={`p-1 rounded ${sub.color}`}>
                  <sub.icon size={14} />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{sub.name}</span>
              </div>
              <div className="space-y-1">
                {subNotebooks.map((nb) => (
                  <div 
                    key={nb.id}
                    onClick={() => onSelect(nb.id)}
                    className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                      currentId === nb.id 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <BookOpen size={16} className={currentId === nb.id ? 'text-indigo-200' : 'text-slate-400'} />
                      <span className="text-sm font-medium truncate">{nb.title}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(nb.id); }}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/10 transition-opacity ${currentId === nb.id ? 'text-white' : 'text-slate-400'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {subNotebooks.length === 0 && (
                  <p className="text-[11px] text-slate-400 px-3 py-1 italic">No notebooks yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white">
            <img src="https://picsum.photos/seed/student/100/100" alt="User" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">Alex Student</p>
            <p className="text-[10px] text-slate-400 truncate">alex@university.edu</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
