
import { Enquiry, Counsellor, EnquiryStatus, Category, AuthUser, UserRole } from './types';
import { INITIAL_COUNSELLORS, COURSES, MOCK_USERS } from './constants';

class AdmissionStore {
  private enquiries: Enquiry[] = [];
  private counsellors: Counsellor[] = [...INITIAL_COUNSELLORS];
  private users: AuthUser[] = [...MOCK_USERS];
  private listeners: (() => void)[] = [];

  constructor() {
    const savedEnquiries = localStorage.getItem('krmu_enquiries');
    if (savedEnquiries) this.enquiries = JSON.parse(savedEnquiries);
    
    const savedCounsellors = localStorage.getItem('krmu_counsellors');
    if (savedCounsellors) this.counsellors = JSON.parse(savedCounsellors);

    const savedUsers = localStorage.getItem('krmu_users');
    if (savedUsers) this.users = JSON.parse(savedUsers);

    this.processAllocation();
  }

  private notify() {
    localStorage.setItem('krmu_enquiries', JSON.stringify(this.enquiries));
    localStorage.setItem('krmu_counsellors', JSON.stringify(this.counsellors));
    localStorage.setItem('krmu_users', JSON.stringify(this.users));
    this.listeners.forEach(l => l());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getEnquiries() { return [...this.enquiries]; }
  getCounsellors() { return [...this.counsellors]; }
  getUsers() { return [...this.users]; }

  addEnquiry(formData: any) {
    const newEnquiry: Enquiry = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: EnquiryStatus.PENDING,
      visitRequested: false,
      visitCompleted: false,
    };
    this.enquiries.push(newEnquiry);
    this.processAllocation();
    this.notify();
  }

  updateCounsellor(id: string, updates: Partial<Counsellor>) {
    const index = this.counsellors.findIndex(c => c.id === id);
    if (index !== -1) {
      this.counsellors[index] = { ...this.counsellors[index], ...updates };
      if (updates.isAvailable === true) {
        this.processAllocation();
      }
      this.notify();
    }
  }

  toggleCounsellorAvailability(id: string) {
    const c = this.counsellors.find(c => c.id === id);
    if (c) {
      c.isAvailable = !c.isAvailable;
      if (c.isAvailable) this.processAllocation();
      this.notify();
    }
  }

  upgradeUserToAdmin(email: string) {
    const user = this.users.find(u => u.email === email);
    if (user) {
      user.role = UserRole.ADMIN;
      this.notify();
    }
  }

  updateEnquiryStatus(id: string, status: EnquiryStatus) {
    const enq = this.enquiries.find(e => e.id === id);
    if (!enq) return;

    if (status === EnquiryStatus.ONGOING) {
      enq.sessionStartTime = new Date().toISOString();
    } else if (status === EnquiryStatus.COMPLETED) {
      enq.sessionEndTime = new Date().toISOString();
      if (enq.counsellorId) {
        const c = this.counsellors.find(cs => cs.id === enq.counsellorId);
        if (c) {
          c.isAvailable = true;
          c.currentEnquiryId = undefined;
        }
      }
    }

    enq.status = status;
    this.processAllocation();
    this.notify();
  }

  requestVisit(id: string) {
    const enq = this.enquiries.find(e => e.id === id);
    if (enq) {
      enq.visitRequested = true;
      this.notify();
    }
  }

  completeVisit(id: string) {
    const enq = this.enquiries.find(e => e.id === id);
    if (enq) {
      enq.visitCompleted = true;
      this.notify();
    }
  }

  private processAllocation() {
    const pending = this.enquiries
      .filter(e => e.status === EnquiryStatus.PENDING)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    for (const enq of pending) {
      const course = COURSES.find(c => c.id === enq.courseId);
      if (!course) continue;

      const counsellor = this.counsellors.find(c => 
        c.isAvailable && c.specializedSchools.includes(course.school)
      );

      if (counsellor) {
        enq.status = EnquiryStatus.ASSIGNED;
        enq.counsellorId = counsellor.id;
        counsellor.isAvailable = false;
        counsellor.currentEnquiryId = enq.id;
      }
    }
  }
}

export const admissionStore = new AdmissionStore();
