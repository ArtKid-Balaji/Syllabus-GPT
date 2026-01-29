
import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Wand2, 
  FilePlus, 
  Search, 
  Clock, 
  Zap,
  BookMarked,
  Layers,
  HelpCircle,
  FileSearch,
  CheckCircle2,
  X
} from 'lucide-react';
import { Notebook, Document } from '../types';
import { generateStudyTool } from '../services/gemini';

interface InsightsPanelProps {
  notebook: Notebook | null;
  onUpdateNotebook: (updated: Notebook) => void;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ notebook, onUpdateNotebook }) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'tools' | 'search'>('materials');
  const [isUploading, setIsUploading] = useState(false);
  const [toolLoading, setToolLoading] = useState<string | null>(null);
  const [toolResult, setToolResult] = useState<{ title: string; content: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !notebook) return;
    
    setIsUploading(true);
    // Cast to File[] to fix 'unknown' type error in map
    const files = Array.from(e.target.files) as File[];
    
    // Simulating upload to R2 and processing
    setTimeout(() => {
      const newDocs: Document[] = files.map((file, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'pdf' : 'txt',
        size: (file.size / 1024).toFixed(1) + ' KB',
        uploadDate: new Date().toLocaleDateString(),
        status: 'ready',
        content: `MOCKED CONTENT FOR ${file.name}: Syllabus covers Introduction to ${notebook.subject}, Module 1 on fundamentals, Module 2 on advanced topics. Grading is 40% assignments, 60% exam.`
      }));

      onUpdateNotebook({
        ...notebook,
        documents: [...notebook.documents, ...newDocs]
      });
      setIsUploading(false);
    }, 1500);
  };

  const handleRemoveDoc = (docId: string) => {
    if (!notebook) return;
    onUpdateNotebook({
      ...notebook,
      documents: notebook.documents.filter(d => d.id !== docId)
    });
  };

  const runStudyTool = async (type: 'summary' | 'simple' | 'notes' | 'viva', title: string) => {
    if (!notebook || notebook.documents.length === 0) return;
    setToolLoading(type);
    try {
      const content = await generateStudyTool(type, notebook.documents);
      setToolResult({ title, content });
    } catch (error) {
      setToolResult({ title: "Error", content: "Failed to generate tool output." });
    } finally {
      setToolLoading(null);
    }
  };

  if (!notebook) return <div className="w-80 bg-slate-50 border-l border-slate-200"></div>;

  return (
    <div className="w-96 h-screen flex flex-col bg-slate-50 border-l border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200 bg-white">
        {(['materials', 'tools', 'search'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === tab 
                ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' 
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm border-dashed border-2 flex flex-col items-center justify-center text-center group hover:border-indigo-300 transition-all">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-all">
                {isUploading ? <Clock className="text-indigo-600 animate-spin" /> : <Upload className="text-slate-400 group-hover:text-indigo-600" />}
              </div>
              <h4 className="text-sm font-bold text-slate-800">Add Materials</h4>
              <p className="text-xs text-slate-500 mt-1">Upload PDF, DOCX, or MD</p>
              <label className="mt-4 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-700 transition-all shadow-md">
                Select Files
                <input type="file" className="hidden" multiple onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Managed Documents</h3>
              {notebook.documents.length === 0 ? (
                <div className="text-center py-8 opacity-40">
                  <FilePlus size={32} className="mx-auto mb-2" />
                  <p className="text-xs">No materials uploaded yet</p>
                </div>
              ) : (
                notebook.documents.map((doc) => (
                  <div key={doc.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate leading-tight">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-medium">{doc.size}</span>
                          <span className="text-[10px] text-slate-200">•</span>
                          <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5"><CheckCircle2 size={10} /> Processed</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'summary', title: 'Chapter Summary', icon: Layers, desc: 'Generates structured module summaries' },
                { id: 'simple', title: 'Simple Explain', icon: BookMarked, desc: 'Explains complex topics for beginners' },
                { id: 'notes', title: 'Exam Notes', icon: Zap, desc: 'Key formulas, definitions & charts' },
                { id: 'viva', title: 'Viva Prep', icon: HelpCircle, desc: 'Predicts common viva/exam questions' }
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => runStudyTool(tool.id as any, tool.title)}
                  disabled={!!toolLoading || notebook.documents.length === 0}
                  className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-2xl text-left hover:border-indigo-400 hover:shadow-lg transition-all disabled:opacity-50 group"
                >
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {toolLoading === tool.id ? <Clock className="animate-spin" size={20} /> : <tool.icon size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800">{tool.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{tool.desc}</p>
                  </div>
                  <Wand2 size={14} className="text-slate-300 group-hover:text-indigo-400" />
                </button>
              ))}
            </div>
            
            {notebook.documents.length === 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs text-center font-medium">
                Upload at least one document to unlock study tools.
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                placeholder="Semantic search materials..."
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm transition-all"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 px-1">
                <FileSearch size={14} /> SEMANTIC MATCHES
              </div>
              <p className="text-xs text-slate-400 text-center py-10 italic">Type to search across all your syllabus documents using vector embeddings (Qdrant Powered).</p>
            </div>
          </div>
        )}
      </div>

      {toolResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <Wand2 className="text-white w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl">{toolResult.title}</h3>
              </div>
              <button onClick={() => setToolResult(null)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 prose prose-slate max-w-none prose-sm">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                {toolResult.content}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-300 transition-all">Download PDF</button>
              <button onClick={() => setToolResult(null)} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Finish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;
