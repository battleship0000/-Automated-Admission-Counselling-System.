
import React, { useState } from 'react';
import { admissionStore } from './store';
import { UserRole, AuthUser } from './types';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  targetRole: UserRole;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, targetRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use store to find user instead of constant to account for upgrades
    const users = admissionStore.getUsers();
    const user = users.find(u => u.email === email && (u as any).password === (password || (u as any).password));
    
    if (user) {
      // Allow access if user is either the target role OR an ADMIN (who can access everything)
      const canAccess = user.role === targetRole || user.role === UserRole.ADMIN;
      
      if (canAccess) {
        onLogin({
          email: user.email,
          role: user.role,
          id: user.id,
          name: user.name
        });
      } else {
        setError(`This account does not have ${targetRole.toLowerCase()} permissions.`);
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const fillDemo = (u: any) => {
    setEmail(u.email);
    setPassword(u.password || 'admin'); // Fallback to 'admin' as most have it
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-[#142642] p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <i className={`fas ${targetRole === UserRole.ADMIN ? 'fa-shield-halved' : 'fa-lock'} text-2xl text-white`}></i>
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">KRMU Staff Login</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">Accessing {targetRole.toLowerCase()} portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
              <i className="fas fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">University Email</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-3.5 text-slate-400"></i>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300"
                placeholder="staff@krmu.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <i className="fas fa-key absolute left-4 top-3.5 text-slate-400"></i>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 active:scale-95"
          >
            Sign In to Dashboard
            <i className="fas fa-arrow-right text-xs"></i>
          </button>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Quick Access for Demo</p>
            <div className="grid grid-cols-1 gap-2">
              {admissionStore.getUsers().filter(u => u.role === targetRole).map(u => (
                <button 
                  key={u.email}
                  type="button" 
                  onClick={() => fillDemo(u)}
                  className="p-3 border border-slate-100 rounded-xl text-[11px] text-slate-600 hover:bg-slate-50 hover:border-red-200 hover:text-red-600 transition-all text-left flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold block">{u.name}</span>
                    <span className="opacity-70">{u.email}</span>
                  </div>
                  <i className="fas fa-chevron-right opacity-30"></i>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
