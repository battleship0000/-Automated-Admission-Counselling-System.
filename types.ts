
export enum UserRole {
  ADMIN = 'ADMIN',
  COUNSELLOR = 'COUNSELLOR',
  GUIDE = 'GUIDE',
  PARENT = 'PARENT'
}

export enum EnquiryStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export type Category = 'GEN' | 'OBC' | 'SC/ST' | 'OTHER';

export interface Course {
  id: string;
  name: string;
  school: string; // e.g., School of Engineering, School of Management
}

export interface AuthUser {
  email: string;
  role: UserRole;
  id?: string;
  name: string;
}

export interface Enquiry {
  id: string;
  studentName: string;
  parentName: string;
  lastSchoolAttended: string;
  address: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  courseId: string;
  category: Category;
  marks12th: string;
  gradMarks?: string;
  status: EnquiryStatus;
  counsellorId?: string;
  createdAt: string;
  sessionStartTime?: string;
  sessionEndTime?: string;
  visitRequested: boolean;
  visitCompleted: boolean;
}

export interface Counsellor {
  id: string;
  name: string;
  specializedSchools: string[]; // Maps to school names
  isAvailable: boolean;
  currentEnquiryId?: string;
}
