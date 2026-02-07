
import React, { useState, useEffect } from 'react';
import { admissionStore } from './store';
import { COURSES, UNIVERSITY_LOGO } from './constants';
import { Enquiry, EnquiryStatus, Category } from './types';

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
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <img src={UNIVERSITY_LOGO} alt="KR Mangalam University" className="h-16 md:h-20 object-contain" />
          <div>
            <h2 className="text-2xl font-black text-[#142642] tracking-tight">K.R. MANGALAM UNIVERSITY</h2>
            <p className="text-red-600 font-bold text-sm tracking-widest uppercase">The Complete World of Education</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 text-xs font-bold">
            <i className="fas fa-award"></i> NAAC Grade A Accredited
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50 -z-0"></div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3 relative">
              <span className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <i className="fas fa-clipboard-list"></i>
              </span>
              Admission Enquiry Form
            </h3>
            
            {submitted && (
              <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <p className="font-bold">Form Submitted Successfully!</p>
                  <p className="text-sm opacity-90">A counsellor has been automatically assigned. Check your status on the right.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Name of Student</label>
                  <input type="text" required value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Parent's/Guardian's Name</label>
                  <input type="text" required value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Programme Interested In</label>
                <select value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all appearance-none cursor-pointer">
                  {COURSES.map(course => <option key={course.id} value={course.id}>{course.name} ({course.school})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                  <div className="flex gap-4">
                    {['GEN', 'OBC', 'SC/ST', 'OTHER'].map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="category" value={cat} checked={form.category === cat} onChange={() => setForm({...form, category: cat as Category})} className="accent-red-600" />
                        <span className={`text-sm font-medium ${form.category === cat ? 'text-red-600' : 'text-slate-500'}`}>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Last School Attended</label>
                  <input type="text" required value={form.lastSchoolAttended} onChange={e => setForm({...form, lastSchoolAttended: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">12th Marks (%)</label>
                  <input type="text" required value={form.marks12th} onChange={e => setForm({...form, marks12th: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300" placeholder="e.g. 85%" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Grad. Marks (%) <span className="text-[10px] text-slate-400 font-normal italic">(If PG course)</span></label>
                  <input type="text" value={form.gradMarks} onChange={e => setForm({...form, gradMarks: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Address</label>
                <textarea required value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300 min-h-[100px]" rows={3}></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">State</label>
                  <input type="text" required value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pincode</label>
                  <input type="text" required value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile No.</label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email ID</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 text-slate-900 font-medium outline-none transition-all placeholder:text-slate-300" />
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 text-lg">
                Submit Enquiry
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </form>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[#142642] text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-search"></i>
              Application Status
            </h4>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {enquiries.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">No enquiries submitted yet.</p>
                </div>
              ) : (
                enquiries.slice().reverse().map(enq => (
                  <div key={enq.id} className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-slate-400">#{(enq.id || '').toUpperCase().slice(0, 6)}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                        enq.status === EnquiryStatus.PENDING ? 'bg-amber-400 text-amber-900' :
                        enq.status === EnquiryStatus.ASSIGNED ? 'bg-blue-400 text-white' :
                        enq.status === EnquiryStatus.ONGOING ? 'bg-indigo-400 text-white' :
                        'bg-emerald-400 text-white'
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                    <p className="font-bold text-sm truncate">{enq.studentName}</p>
                    <p className="text-xs text-slate-400 truncate">{COURSES.find(c => c.id === enq.courseId)?.name}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                      {enq.status === EnquiryStatus.COMPLETED && !enq.visitRequested && (
                        <button onClick={() => admissionStore.requestVisit(enq.id)} className="text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold hover:bg-red-700 transition-colors">
                          Visit Campus
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                 <i className="fas fa-phone"></i>
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase">Need Help?</p>
                 <p className="text-sm font-bold text-slate-800">1800 102 3434</p>
               </div>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed">
               Our admissions office is open Mon-Sat, 9:00 AM to 5:30 PM. Visit us at Sohna Road, Gurugram.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;
