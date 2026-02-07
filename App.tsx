
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ParentPortal from './pages/ParentPortal';
import CounsellorPortal from './pages/CounsellorPortal';
import GuidePortal from './pages/GuidePortal';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import { UserRole, AuthUser } from './types';
import { admissionStore } from './store';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.PARENT);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (user) {
      const unsub = admissionStore.subscribe(() => {
        const users = admissionStore.getUsers();
        const currentUser = users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (currentUser && currentUser.role !== user.role) {
          setUser({ ...user, role: currentUser.role });
        }
      });
      return unsub;
    }
  }, [user]);

  const handleLogin = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    // Direct user to their dashboard immediately
    setActiveTab(authenticatedUser.role);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab(UserRole.PARENT);
  };

  const renderContent = () => {
    if (activeTab === UserRole.PARENT) return <ParentPortal />;

    if (!user) return <LoginPage onLogin={handleLogin} />;

    const hasPermission = user.role === UserRole.ADMIN || user.role === activeTab;
    
    if (!hasPermission) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 bg-white rounded-[3rem] border-4 border-slate-50 shadow-2xl animate-pulse-slow">
          <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border-2 border-red-100">
            <i className="fas fa-user-shield text-4xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter">Access Denied</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
            Your current authorization tier (<span className="text-red-600 font-black uppercase tracking-tight">{user.role}</span>) does not grant access to the <span className="text-[#142642] font-black uppercase">{activeTab}</span> portal.
          </p>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab(user.role)} className="px-8 py-4 bg-[#142642] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl text-xs">My Dashboard</button>
            <button onClick={handleLogout} className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl text-xs">Sign Out</button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case UserRole.COUNSELLOR: return <CounsellorPortal counsellorId={user.id || 'c1'} />;
      case UserRole.GUIDE: return <GuidePortal />;
      case UserRole.ADMIN: return <AdminDashboard />;
      default: return <ParentPortal />;
    }
  };

  return (
    <Layout role={activeTab} setRole={setActiveTab} user={user} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
