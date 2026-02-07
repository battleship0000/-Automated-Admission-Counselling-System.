
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { admissionStore } from './store';
import { Enquiry, EnquiryStatus, UserRole, Counsellor } from './types';
import { COURSES } from './constants';
import { geminiService } from './services/geminiService';

const AdminDashboard: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('Generating smart insights...');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'staff'>('overview');

  useEffect(() => {
    const update = () => {
      setEnquiries(admissionStore.getEnquiries());
      setCounsellors(admissionStore.getCounsellors());
      setUsers(admissionStore.getUsers());
    };
    const unsub = admissionStore.subscribe(update);
    update();
    return unsub;
  }, []);

  useEffect(() => {
    const getInsight = async () => {
      if (enquiries.length > 0) {
        setLoadingInsight(true);
        const text = await geminiService.analyzeEnquiryTrend(enquiries);
        setAiInsight(text || "No recent trends detected.");
        setLoadingInsight(false);
      } else {
        setAiInsight("No enquiry data available for analysis.");
      }
    };
    getInsight();
  }, [enquiries.length]);

  const handleToggleAvailability = (id: string) => {
    admissionStore.toggleCounsellorAvailability(id);
  };

  const handleUpgradeToAdmin = (email: string) => {
    admissionStore.upgradeUserToAdmin(email);
  };

  const courseCounts = COURSES.map(course => ({
    name: course.name.split(' ').slice(0, 2).join(' '),
    count: enquiries.filter(e => e.courseId === course.id).length
  }));

  const statusCounts = Object.values(EnquiryStatus).map(status => ({
    name: status,
    value: enquiries.filter(e => e.status === status).length
  })).filter(s => s.value > 0);

  const COLORS = ['#142642', '#ef4444', '#f59e0b', '#10b981', '#6366f1'];

  const stats = [
    { label: 'Total Enquiries', value: enquiries.length, icon: 'fa-users', color: 'bg-[#142642]' },
    { label: 'Completed', value: enquiries.filter(e => e.status === EnquiryStatus.COMPLETED).length, icon: 'fa-check-double', color: 'bg-emerald-500' },
    { label: 'Waitlisted', value: enquiries.filter(e => e.status === EnquiryStatus.PENDING).length, icon: 'fa-hourglass-start', color: 'bg-amber-500' },
    { label: 'Avg. Wait Time', value: '14 min', icon: 'fa-clock', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-2 font-bold text-sm transition-all ${activeTab === 'overview' ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-400'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`pb-4 px-2 font-bold text-sm transition-all ${activeTab === 'staff' ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-400'}`}
        >
          Staff Management
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <i className={`fas ${stat.icon} text-lg`}></i>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#142642] text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <i className="fas fa-brain text-8xl"></i>
            </div>
            <div className="shrink-0 flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <i className={`fas fa-wand-magic-sparkles text-2xl ${loadingInsight ? 'animate-pulse' : ''}`}></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1 text-red-500 uppercase tracking-tight">KRMU AI Insights</h4>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "{aiInsight}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <i className="fas fa-chart-simple text-red-600"></i>
                Course Popularity
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseCounts}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}} 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Bar dataKey="count" fill="#142642" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <i className="fas fa-circle-notch text-red-600"></i>
                Processing Status
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusCounts}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 pr-8 shrink-0">
                  {statusCounts.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                      <span className="text-[11px] text-slate-600 font-bold uppercase">{s.name}: {s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-[#142642]">Staff & Counsellor Management</h3>
            <button className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-md active:scale-95">
              Add New Member
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-6 py-5">Staff Profile</th>
                  <th className="px-6 py-5">Role & Dept</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const counsellor = counsellors.find(c => c.id === user.id);
                  return (
                    <tr key={user.email} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#142642] text-white flex items-center justify-center font-bold text-sm">
                            {user.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase w-fit ${
                            user.role === UserRole.ADMIN ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {counsellor?.specializedSchools.join(', ') || 'Global Access'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {counsellor ? (
                          <button 
                            onClick={() => handleToggleAvailability(counsellor.id)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                              counsellor.isAvailable 
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${counsellor.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                            {counsellor.isAvailable ? 'Available' : 'Busy/Offline'}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-300 italic">Always Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          {user.role !== UserRole.ADMIN && (
                            <button 
                              onClick={() => handleUpgradeToAdmin(user.email)}
                              className="text-[10px] font-black text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-all uppercase tracking-tight"
                            >
                              Upgrade to Admin
                            </button>
                          )}
                          <button className="p-2 text-slate-300 hover:text-[#142642] transition-all">
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
