
import React, { useState, useEffect } from 'react';
import { admissionStore } from '../store';
import { COURSES, UNIVERSITY_LOGO } from '../constants';
import { Enquiry, EnquiryStatus, Category } from '../types';

const ParentPortal: React.FC = () => {
  const [form, setForm] = useState({
    studentName: '',
    parentName: '',
    lastSchoolAttended: '',
    address: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    courseId: COURSES[0].id,
    category: 'GEN' as Category,
    marks12th: '',
    gradMarks: ''
  });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const update = () => setEnquiries(admissionStore.getEnquiries());
    const unsub = admissionStore.subscribe(update);
    update();
    return unsub;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    admissionStore.addEnquiry(form);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSubmitted(false), 5000);
    setForm({
      ...form,
      studentName: '', parentName: '', lastSchoolAttended: '',
      address: '', state: '', pincode: '', phone: '', email: '',
      marks12th: '', gradMarks: ''
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4">
      {/* Branding Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 bg-white p-8 rounded-[2.5rem] border-4 border-slate-50 shadow-xl gap-8">
        <div className="flex items-center gap-6">
          <div className="h-16 md:h-24 w-auto flex items-center justify-center bg-slate-50 rounded-3xl p-4 border-2 border-slate-100 shadow-inner">
             <img 
               src={UNIVERSITY_LOGO} 
               alt="KR Mangalam University" 
               className="h-full object-contain"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=KRMU&background=142642&color=fff";
               }}
             />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#142642] tracking-tighter leading-none mb-2 uppercase">K.R. Mangalam University</h2>
            <p className="text-red-600 font-black text-[10px] md:text-xs tracking-[0.4em] uppercase opacity-80">Empowering Minds • Transforming Lives</p>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="flex flex-col items-end gap-2">
            <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-emerald-100 shadow-sm flex items-center gap-2">
              <i className="fas fa-shield-check"></i> NAAC Grade A Accredited
            </span>
            <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-indigo-100 shadow-sm flex items-center gap-2">
              <i className="fas fa-certificate"></i> UGC Recognized
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Application Form */}
        <div className="lg:col-span-2">
          <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-2 border-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/40 rounded-bl-full -z-0"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-[#142642] mb-10 flex items-center gap-5">
                <span className="w-16 h-16 bg-red-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-red-200 border-b-4 border-red-800">
                  <i className="fas fa-edit text-2xl"></i>
                </span>
                <div className="flex flex-col">
                  <span className="text-3xl tracking-tighter uppercase italic">Admissions 2024</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Official Enquiry Form</span>
                </div>
              </h3>
              
              {submitted && (
                <div className="mb-10 p-6 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 rounded-[2rem] flex items-center gap-6 animate-bounce-short shadow-lg shadow-emerald-50">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <i className="fas fa-check-double text-2xl"></i>
                  </div>
                  <div>
                    <p className="font-black text-xl">Thank You!</p>
                    <p className="text-sm font-bold opacity-75">Our system is matching you with a senior academic counsellor right now.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Candidate's Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={form.studentName} 
                      onChange={e => setForm({...form, studentName: e.target.value})} 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-bold outline-none transition-all placeholder:text-slate-300 shadow-inner"
                      placeholder="e.g. Aryan Malhotra"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Parent/Guardian Name</label>
                    <input 
                      type="text" 
                      required 
                      value={form.parentName} 
                      onChange={e => setForm({...form, parentName: e.target.value})} 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-bold outline-none transition-all placeholder:text-slate-300 shadow-inner"
                      placeholder="Guardian Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Programme Selection</label>
                  <div className="relative group">
                    <select 
                      value={form.courseId} 
                      onChange={e => setForm({...form, courseId: e.target.value})} 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-black outline-none transition-all appearance-none cursor-pointer shadow-inner"
                    >
                      {COURSES.map(course => <option key={course.id} value={course.id}>{course.name} ({course.school})</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-red-600">
                      <i className="fas fa-chevron-down"></i>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Candidate Category</label>
                    <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 shadow-inner">
                      {['GEN', 'OBC', 'SC/ST', 'OTHER'].map(cat => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer group flex-1 min-w-[70px] justify-center py-1 rounded-xl hover:bg-white transition-colors">
                          <input type="radio" name="category" value={cat} checked={form.category === cat} onChange={() => setForm({...form, category: cat as Category})} className="accent-red-600 w-4 h-4" />
                          <span className={`text-[10px] font-black ${form.category === cat ? 'text-red-600' : 'text-slate-400'}`}>{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Last Institution Attended</label>
                    <input 
                      type="text" 
                      required 
                      value={form.lastSchoolAttended} 
                      onChange={e => setForm({...form, lastSchoolAttended: e.target.value})} 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-bold outline-none transition-all placeholder:text-slate-300 shadow-inner"
                      placeholder="School / College Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest px-1">Class 12th Score (%)</label>
                    <input 
                      type="text" 
                      required 
                      value={form.marks12th} 
                      onChange={e => setForm({...form, marks12th: e.target.value})} 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-black outline-none transition-all shadow-inner" 
                      placeholder="e.g. 92.5" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest px-1">Graduation Marks <span className="opacity-40 font-medium italic">(If Applicable)</span></label>
                    <input 
                      type="text" 
                      value={form.gradMarks} 
                      onChange={e => setForm({...form, gradMarks: e.target.value})} 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-bold outline-none transition-all shadow-inner" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest px-1">Mailing Address</label>
                  <textarea 
                    required 
                    value={form.address} 
                    onChange={e => setForm({...form, address: e.target.value})} 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-bold outline-none transition-all placeholder:text-slate-300 shadow-inner min-h-[140px]" 
                    rows={3}
                    placeholder="Provide detailed residential address..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest px-1">State</label>
                    <input 
                      type="text" 
                      required 
                      value={form.state} 
                      onChange={e => setForm({...form, state: e.target.value})} 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-bold outline-none transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest px-1">Zip / Pin Code</label>
                    <input 
                      type="text" 
                      required 
                      value={form.pincode} 
                      onChange={e => setForm({...form, pincode: e.target.value})} 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-bold outline-none transition-all shadow-inner" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest px-1">Primary Contact No.</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 opacity-60">+91</span>
                      <input 
                        type="tel" 
                        required 
                        value={form.phone} 
                        onChange={e => setForm({...form, phone: e.target.value})} 
                        className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-black outline-none transition-all shadow-inner" 
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest px-1">Personal Email Identity</label>
                    <input 
                      type="email" 
                      required 
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})} 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 text-slate-950 font-bold outline-none transition-all shadow-inner" 
                      placeholder="e.g. aryan@gmail.com"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-2xl shadow-red-200 flex items-center justify-center gap-5 text-xl active:scale-[0.98] border-b-8 border-red-900"
                >
                  Confirm Registration
                  <i className="fas fa-check-circle text-lg"></i>
                </button>
              </form>
            </div>
          </section>
        </div>

        {/* Status Tracker Sidebar */}
        <div className="space-y-10">
          <section className="bg-[#142642] text-white p-8 md:p-10 rounded-[3rem] shadow-2xl overflow-hidden relative border-4 border-[#1e3a63]">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            
            <h4 className="text-xl font-black mb-10 flex items-center gap-4 italic">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Application Tracker
            </h4>

            <div className="space-y-5 max-h-[800px] overflow-y-auto pr-3 custom-scrollbar">
              {enquiries.length === 0 ? (
                <div className="text-center py-24 opacity-30 flex flex-col items-center">
                  <i className="fas fa-satellite-dish text-5xl mb-6"></i>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Listening for submissions...</p>
                </div>
              ) : (
                enquiries.slice().reverse().map(enq => (
                  <div key={enq.id} className="bg-white/5 backdrop-blur-xl border-2 border-white/10 p-6 rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all group shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[8px] font-black text-slate-400 font-mono">APP_ID: {(enq.id || '').toUpperCase()}</span>
                      <span className={`text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                        enq.status === EnquiryStatus.PENDING ? 'bg-amber-400 text-amber-900 shadow-lg shadow-amber-900/20' :
                        enq.status === EnquiryStatus.ASSIGNED ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/20' :
                        enq.status === EnquiryStatus.ONGOING ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/20' :
                        'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                    
                    <p className="font-black text-lg mb-1 group-hover:text-red-400 transition-colors uppercase tracking-tighter leading-tight">{enq.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-bold truncate opacity-90">{COURSES.find(c => c.id === enq.courseId)?.name}</p>
                    
                    <div className="mt-6 pt-5 flex items-center justify-between border-t border-white/5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <i className="far fa-calendar-check text-[10px]"></i>
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {enq.status === EnquiryStatus.COMPLETED && !enq.visitRequested && (
                        <button 
                          onClick={() => admissionStore.requestVisit(enq.id)} 
                          className="text-[9px] bg-red-600 text-white px-5 py-2 rounded-full font-black hover:bg-red-500 transition-all shadow-xl shadow-red-900/40 uppercase tracking-widest active:scale-95"
                        >
                          Book Visit
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Quick Support Widget */}
          <section className="bg-white p-10 rounded-[3rem] shadow-xl border-4 border-slate-50 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center shadow-inner mb-6 border-2 border-red-100">
               <i className="fas fa-headset text-3xl"></i>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Institutional Helpdesk</p>
             <p className="text-2xl font-black text-[#142642] mb-5 tracking-tighter">1800 102 3434</p>
             <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-6 opacity-70">
               Direct Support available Mon-Sat (9 AM to 5:30 PM).<br/>
               Sohna Road, Gurugram, Delhi-NCR.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;
