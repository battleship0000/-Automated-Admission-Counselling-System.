
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { admissionStore } from '../store';
import { Enquiry, EnquiryStatus, UserRole, Counsellor } from '../types';
import { COURSES } from '../constants';
import { geminiService } from '../services/geminiService';

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
    if (confirm(`Upgrade ${email} to Administrative access?`)) {
      admissionStore.upgradeUserToAdmin(email);
    }
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
    { label: 'Avg. Wait', value: '14m', icon: 'fa-clock', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex gap-4 border-b-2 border-slate-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'border-b-4 border-red-600 text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Overview Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={`pb-4 px-4 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'staff' ? 'border-b-4 border-red-600 text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Staff & Roster
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${stat.icon} text-lg`}></i>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#142642] text-white p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border-b-8 border-red-600">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <i className="fas fa-brain text-9xl"></i>
            </div>
            <div className="shrink-0 flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 shadow-inner">
              <i className={`fas fa-wand-magic-sparkles text-3xl ${loadingInsight ? 'animate-pulse text-red-400' : 'text-white'}`}></i>
            </div>
            <div className="flex-1">
              <h4 className="font-black text-lg mb-2 text-red-500 uppercase tracking-tighter italic">KRMU AI PREDICTIVE INSIGHTS</h4>
              <p className="text-slate-200 text-sm leading-relaxed font-bold italic">
                "{aiInsight}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
                <i className="fas fa-chart-bar text-red-600"></i>
                Trend Analysis
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseCounts}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b', fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}} 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} 
                    />
                    <Bar dataKey="count" fill="#142642" radius={[6, 6, 0, 0]} barSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3">
                <i className="fas fa-spinner text-red-600"></i>
                Processing Status
              </h3>
              <div className="h-64 flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-full h-full md:w-2/3">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusCounts}
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {statusCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-1/3 shrink-0">
                  {statusCounts.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                      <span className="text-[10px] text-slate-800 font-black uppercase truncate">{s.name}: {s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-100 overflow-hidden">
          <div className="p-8 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-xl font-black text-[#142642] tracking-tighter">ROSTER MANAGEMENT</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Personnel & Counsellors</p>
            </div>
            <button className="bg-red-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95 border-b-4 border-red-800">
              Onboard Member
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-8 py-6">Identity</th>
                  <th className="px-8 py-6">Domain & Access</th>
                  <th className="px-8 py-6 text-center">Roster Availability</th>
                  <th className="px-8 py-6 text-right">Administrative</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {users.map((user) => {
                  const counsellor = counsellors.find(c => c.id === user.id);
                  return (
                    <tr key={user.email} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#142642] text-white flex items-center justify-center font-black text-lg shadow-lg group-hover:bg-red-600 transition-colors">
                            {user.name[0]}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-sm tracking-tight">{user.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase w-fit tracking-widest border-2 ${
                            user.role === UserRole.ADMIN 
                            ? 'bg-red-50 text-red-600 border-red-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-[10px] text-slate-500 font-black uppercase italic">
                            {counsellor?.specializedSchools.join(', ') || 'Global Protocol'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          {counsellor ? (
                            <button 
                              onClick={() => handleToggleAvailability(counsellor.id)}
                              className={`flex items-center gap-3 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 shadow-sm active:scale-95 ${
                                counsellor.isAvailable 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              }`}
                            >
                              <div className={`w-3 h-3 rounded-full shadow-inner ${counsellor.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                              {counsellor.isAvailable ? 'ACTIVE' : 'BUSY/OFF'}
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest border-2 border-slate-50 px-4 py-2 rounded-2xl italic">Core Staff</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {user.role !== UserRole.ADMIN && (
                            <button 
                              onClick={() => handleUpgradeToAdmin(user.email)}
                              className="text-[10px] font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl border-2 border-indigo-100 transition-all uppercase tracking-tighter"
                            >
                              GRANT ADMIN
                            </button>
                          )}
                          <button className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl border-2 border-slate-100 transition-all">
                            <i className="fas fa-trash-alt"></i>
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
