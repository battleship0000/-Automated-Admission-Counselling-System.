
import React, { useState } from 'react';
import { admissionStore } from '../store';
import { AuthUser, UserRole } from '../types';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Network simulation
    setTimeout(() => {
      const users = admissionStore.getUsers();
      const foundUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        (u as any).password === password
      );
      
      if (foundUser) {
        onLogin({
          email: foundUser.email,
          role: foundUser.role,
          id: foundUser.id,
          name: foundUser.name
        });
      } else {
        setError('Verification failed: Invalid institutional ID or passkey.');
        setIsSubmitting(false);
      }
    }, 800);
  };

  const fillDemo = (u: any) => {
    setEmail(u.email);
    setPassword(u.password);
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border-2 border-slate-100 overflow-hidden flex flex-col animate-fadeIn">
        <div className="bg-[#142642] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-white/20 shadow-2xl backdrop-blur-md">
            <i className="fas fa-id-card-clip text-3xl text-white"></i>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">KRMU Portal Login</h2>
          <p className="text-slate-400 text-[10px] mt-2 font-black tracking-[0.2em] uppercase">Authorized Personnel Only</p>
        </div>
        
        <div className="p-8 md:p-12 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 text-xs font-black rounded-2xl flex items-center gap-3 animate-shake">
              <i className="fas fa-exclamation-triangle text-lg"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Institutional Email</label>
              <div className="relative group">
                <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors"></i>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300"
                  placeholder="name@krmu.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Passkey</label>
              <div className="relative group">
                <i className="fas fa-shield-key absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors"></i>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-900 font-bold outline-none transition-all placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-4 text-sm border-b-8 active:scale-[0.98] ${
                isSubmitting 
                ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed' 
                : 'bg-red-600 text-white border-red-800 hover:bg-red-700 shadow-red-200'
              }`}
            >
              {isSubmitting ? <i className="fas fa-spinner animate-spin"></i> : <>Authorize Entrance <i className="fas fa-chevron-right text-xs"></i></>}
            </button>
          </form>

          <div className="pt-8 border-t-2 border-slate-50">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-center">Development Access Keys</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {admissionStore.getUsers().map(u => (
                <button 
                  key={u.email}
                  type="button" 
                  onClick={() => fillDemo(u)}
                  className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-left hover:bg-white hover:border-red-500 hover:shadow-xl transition-all group flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#142642] text-white flex items-center justify-center text-xs font-black group-hover:bg-red-600 transition-colors">
                    {u.role[0]}
                  </div>
                  <div className="min-w-0">
                    <span className="font-black block text-slate-900 text-[11px] group-hover:text-red-600 transition-colors truncate">{u.name}</span>
                    <span className="opacity-50 text-[9px] font-bold block truncate">{u.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
