
import React, { useState, useEffect } from 'react';
import { admissionStore } from '../store';
import { Enquiry, EnquiryStatus, Counsellor } from '../types';
import { COURSES } from '../constants';
import { geminiService } from '../services/geminiService';

const CounsellorPortal: React.FC<{ counsellorId: string }> = ({ counsellorId }) => {
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);

  useEffect(() => {
    const update = () => {
      const all = admissionStore.getEnquiries();
      const active = all.find(e => 
        e.counsellorId === counsellorId && 
        (e.status === EnquiryStatus.ASSIGNED || e.status === EnquiryStatus.ONGOING)
      );
      setActiveEnquiry(active || null);
    };

    const unsub = admissionStore.subscribe(update);
    update();
    return unsub;
  }, [counsellorId]);

  useEffect(() => {
    if (activeEnquiry) {
      const fetchTips = async () => {
        setLoadingTips(true);
        const course = COURSES.find(c => c.id === activeEnquiry.courseId);
        if (course) {
          const res = await geminiService.getCounsellingTips(course.name);
          setTips(res);
        }
        setLoadingTips(false);
      };
      fetchTips();
    } else {
      setTips([]);
    }
  }, [activeEnquiry?.id]);

  const handleStartSession = () => {
    if (activeEnquiry) {
      admissionStore.updateEnquiryStatus(activeEnquiry.id, EnquiryStatus.ONGOING);
    }
  };

  const handleCompleteSession = () => {
    if (activeEnquiry) {
      admissionStore.updateEnquiryStatus(activeEnquiry.id, EnquiryStatus.COMPLETED);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!activeEnquiry ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-user-clock text-4xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Awaiting Assignments</h3>
          <p className="text-slate-500">You are currently available. New enquiries will be automatically assigned to you based on your specialization.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-2 inline-block">
                  Current Assignment
                </span>
                <h3 className="text-2xl font-bold text-slate-800">{activeEnquiry.studentName}</h3>
                <p className="text-slate-500">Interested in {COURSES.find(c => c.id === activeEnquiry.courseId)?.name}</p>
              </div>
              <div className="flex gap-3">
                {activeEnquiry.status === EnquiryStatus.ASSIGNED ? (
                  <button 
                    onClick={handleStartSession}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-100 flex items-center gap-2"
                  >
                    <i className="fas fa-play text-xs"></i> Start Session
                  </button>
                ) : (
                  <button 
                    onClick={handleCompleteSession}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-shadow shadow-lg shadow-emerald-100 flex items-center gap-2"
                  >
                    <i className="fas fa-check text-xs"></i> Complete Session
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                  <i className="fas fa-info-circle text-indigo-400"></i>
                  Student Details
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Parent Name</span>
                    <span className="text-slate-800 text-sm font-medium">{activeEnquiry.parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Contact</span>
                    <span className="text-slate-800 text-sm font-medium">{activeEnquiry.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Waiting Since</span>
                    <span className="text-slate-800 text-sm font-medium">{new Date(activeEnquiry.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                  <i className="fas fa-wand-magic-sparkles text-indigo-400"></i>
                  AI Counselling Copilot
                </h4>
                <div className="bg-indigo-900 text-indigo-50 p-4 rounded-xl min-h-[140px]">
                  {loadingTips ? (
                    <div className="flex items-center justify-center h-full gap-2 text-indigo-300">
                      <i className="fas fa-circle-notch animate-spin"></i>
                      Analyzing course profile...
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <i className="fas fa-check-circle text-indigo-400 mt-1"></i>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-4 text-amber-800">
            <i className="fas fa-clock text-xl mt-1"></i>
            <div>
              <p className="font-bold text-sm">Session Time Tracking</p>
              <p className="text-xs">Your counselling duration is automatically recorded for administrative efficiency reporting. Please ensure all student queries are addressed before completing.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellorPortal;
