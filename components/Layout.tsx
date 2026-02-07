
import React from 'react';
import { UserRole, AuthUser } from '../types';
import { UNIVERSITY_LOGO } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: AuthUser | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, setRole, user, onLogout }) => {
  const navItems = [
    { id: UserRole.PARENT, label: 'Enquiry Desk', icon: 'fa-file-signature', public: true },
    { id: UserRole.COUNSELLOR, label: 'Counselling', icon: 'fa-user-tie', public: false, roles: [UserRole.COUNSELLOR, UserRole.ADMIN] },
    { id: UserRole.GUIDE, label: 'Campus Tour', icon: 'fa-map-marked-alt', public: false, roles: [UserRole.GUIDE, UserRole.ADMIN] },
    { id: UserRole.ADMIN, label: 'Admin Panel', icon: 'fa-cog', public: false, roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F3F4F6]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#142642] text-white flex flex-col shrink-0 sticky top-0 md:h-screen">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="bg-white rounded-lg p-1.5 flex items-center justify-center shadow-inner">
            <img src={UNIVERSITY_LOGO} alt="KRMU" className="h-7 w-auto" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none">KRMU</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Admission Hub</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-8">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2 italic opacity-60">System Navigation</div>
          {navItems.map((item) => {
            // Check if item should be visible
            const isVisible = item.public || (user && item.roles?.includes(user.role));
            
            if (!isVisible && !(!user && !item.public)) return null;

            return (
              <button
                key={item.id}
                onClick={() => setRole(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                  role === item.id 
                  ? 'bg-red-600 text-white shadow-2xl shadow-red-900/40 translate-x-1' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    role === item.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <i className={`fas ${item.icon} text-sm`}></i>
                  </div>
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </div>
                {!item.public && !user && (
                  <i className="fas fa-lock text-[9px] opacity-40"></i>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          {user ? (
            <div className="p-5 bg-white/5 rounded-[1.5rem] border-2 border-white/10 space-y-5 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center font-black shadow-lg border border-red-400">
                  {user.name[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black truncate text-white">{user.name}</p>
                  <p className="text-[9px] text-slate-500 font-bold truncate uppercase tracking-tighter">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border-2 border-red-500/20"
              >
                <i className="fas fa-sign-out-alt"></i>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center gap-3 opacity-20 transition-opacity hover:opacity-100">
               <img src={UNIVERSITY_LOGO} alt="KRMU" className="h-6 filter grayscale brightness-200" />
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">Security Active</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
