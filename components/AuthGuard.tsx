
import React, { useState } from 'react';
import { LogIn, GraduationCap, Github } from 'lucide-react';
import { User } from '../types';

interface AuthGuardProps {
  children: (user: User) => React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (provider: string) => {
    setLoading(true);
    // Mocking Firebase Auth delay
    setTimeout(() => {
      setUser({
        id: 'u1',
        name: 'Alex Student',
        email: 'alex@university.edu',
        photoURL: 'https://picsum.photos/seed/student/200/200'
      });
      setLoading(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">SyllabusGPT</h1>
            <p className="text-slate-500 mt-2 text-center">Your private AI academic workspace</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pwa/google.svg" className="w-5 h-5" alt="Google" />
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>
            <button
              onClick={() => handleLogin('github')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 border border-slate-900 py-3 rounded-lg font-medium text-white hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            All uploaded syllabus materials are encrypted and private to your account.
          </div>
        </div>
      </div>
    );
  }

  return <>{children(user)}</>;
};

export default AuthGuard;
