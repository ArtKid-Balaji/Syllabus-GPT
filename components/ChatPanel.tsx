
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Info, AlertCircle } from 'lucide-react';
import { Message, Notebook } from '../types';
import { getChatResponse } from '../services/gemini';

interface ChatPanelProps {
  notebook: Notebook | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ notebook }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !notebook || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(input, messages, notebook.documents);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error processing your syllabus. Please try again.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!notebook) {
    return (
      <div className="flex-1 h-screen flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50">
        <Bot size={64} className="mb-4 opacity-20" />
        <h3 className="text-xl font-medium text-slate-600">Select a notebook to start studying</h3>
        <p className="text-sm mt-2 max-w-xs text-center">Your AI assistant is ready to help you navigate through your specific syllabus materials.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen flex flex-col bg-white relative">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h2 className="font-bold text-slate-800">{notebook.title} Assistant</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">Syllabus-Locked Mode Active</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Info size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <Bot size={32} className="opacity-40" />
            </div>
            <div className="text-center">
              <p className="text-slate-600 font-medium">Hello! I'm your {notebook.title} tutor.</p>
              <p className="text-sm mt-1">Ask me anything related to your uploaded syllabus.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg mt-8">
              {[
                "Summarize the main modules",
                "Explain the grading criteria",
                "What are the prerequisites?",
                "List all mandatory textbooks"
              ].map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => { setInput(prompt); }}
                  className="text-left p-3 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-slate-600 font-medium"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200">
                <Bot size={18} className="text-white" />
              </div>
            )}
            <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              <div className="prose prose-sm prose-slate max-w-none">
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0 leading-relaxed">{line}</p>
                ))}
              </div>
              <div className={`text-[10px] mt-2 font-medium opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                <img src="https://picsum.photos/seed/student/100/100" alt="U" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
              <Bot size={18} className="text-white" />
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-200 rounded-tl-none flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-sm text-slate-500 font-medium italic">Consulting syllabus materials...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        {notebook.documents.length === 0 && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-800 text-xs font-medium">
            <AlertCircle size={14} />
            Please upload syllabus documents in the right panel to enable AI responses.
          </div>
        )}
        <form onSubmit={handleSend} className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={notebook.documents.length > 0 ? "Ask a question about your syllabus..." : "Upload documents first"}
              disabled={isLoading || notebook.documents.length === 0}
              className="w-full bg-slate-100 text-slate-800 border-none rounded-2xl px-4 py-3.5 pr-12 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none disabled:opacity-50 transition-all font-medium placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim() || notebook.documents.length === 0}
              className="absolute right-2.5 bottom-2.5 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:bg-slate-300 shadow-md shadow-indigo-100"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Responses generated are strictly limited to your uploaded content. Accuracy is prioritized.
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
