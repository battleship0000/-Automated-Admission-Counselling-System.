
import React, { useState, useEffect } from 'react';
import { admissionStore } from '../store';
import { Enquiry } from '../types';
import { COURSES } from '../constants';

const GuidePortal: React.FC = () => {
  const [visits, setVisits] = useState<Enquiry[]>([]);

  useEffect(() => {
    const update = () => {
      const all = admissionStore.getEnquiries();
      // Filter for those who requested visits and haven't completed
      setVisits(all.filter(e => e.visitRequested && !e.visitCompleted));
    };
    const unsub = admissionStore.subscribe(update);
    update();
    return unsub;
  }, []);

  const handleComplete = (id: string) => {
    admissionStore.completeVisit(id);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-xs font-bold uppercase mb-2">Pending Tours</div>
          <div className="text-3xl font-bold text-slate-800">{visits.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-xs font-bold uppercase mb-2">Completed Today</div>
          <div className="text-3xl font-bold text-slate-800">12</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-500 text-xs font-bold uppercase mb-2">Avg. Tour Duration</div>
          <div className="text-3xl font-bold text-slate-800">45m</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Campus Visit Queue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Parent Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <i className="fas fa-map-location text-4xl mb-3 block opacity-20"></i>
                    No campus visits currently scheduled.
                  </td>
                </tr>
              ) : (
                visits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{visit.studentName}</div>
                      <div className="text-xs text-slate-500">{visit.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {/* Fix: Property 'department' does not exist on type 'Course'. Using 'school' instead. */}
                        {COURSES.find(c => c.id === visit.courseId)?.school}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{visit.phone}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                        Waiting for Tour
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleComplete(visit.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                      >
                        Mark Complete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuidePortal;
