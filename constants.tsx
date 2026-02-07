
import { Course, UserRole } from './types';

export const UNIVERSITY_LOGO = "https://www.krmangalam.edu.in/wp-content/uploads/2023/07/KR-Mangalam-University-Logo.png";

export const COURSES: Course[] = [
  // School of Engineering & Technology
  { id: 'cse', name: 'B.Tech Computer Science & Engineering', school: 'SOET' },
  { id: 'cse-ai', name: 'B.Tech CSE (AI & ML)', school: 'SOET' },
  { id: 'bca-ds', name: 'BCA (AI & Data Science)', school: 'SOET' },
  
  // School of Management & Commerce
  { id: 'bba', name: 'BBA (Digital Marketing/HR/Finance)', school: 'SOMC' },
  { id: 'mba', name: 'MBA (Business Analytics/Entrepreneurship)', school: 'SOMC' },
  { id: 'bcom', name: 'B.Com (Hons.)', school: 'SOMC' },

  // School of Legal Studies
  { id: 'ba-llb', name: 'B.A. LL.B. (Hons.)', school: 'SOLS' },
  { id: 'llb', name: 'LL.B. (Hons.)', school: 'SOLS' },

  // School of Medical & Allied Sciences
  { id: 'bpharm', name: 'Bachelor of Pharmacy (B.Pharm)', school: 'SMAS' },
  { id: 'bpt', name: 'Bachelor of Physiotherapy (BPT)', school: 'SMAS' },

  // Architecture & Design
  { id: 'barch', name: 'Bachelor of Architecture (B.Arch)', school: 'SOAD' },
  { id: 'bdes', name: 'Bachelor of Design (B.Des)', school: 'SOAD' },
];

export const INITIAL_COUNSELLORS = [
  { id: 'c1', name: 'Dr. Amit Sharma', specializedSchools: ['SOET', 'SOAD'], isAvailable: true },
  { id: 'c2', name: 'Prof. Rita Gupta', specializedSchools: ['SOMC', 'SOLS'], isAvailable: true },
  { id: 'c3', name: 'Dr. S. K. Verma', specializedSchools: ['SMAS'], isAvailable: true },
];

// Simplified credentials for the user
export const MOCK_USERS = [
  { email: 'admin@krmu.edu', password: 'admin', role: UserRole.ADMIN, name: 'Dean of Admissions' },
  { email: 'c1@krmu.edu', password: 'c1', role: UserRole.COUNSELLOR, id: 'c1', name: 'Dr. Amit Sharma' },
  { email: 'c2@krmu.edu', password: 'c2', role: UserRole.COUNSELLOR, id: 'c2', name: 'Prof. Rita Gupta' },
  { email: 'guide@krmu.edu', password: 'guide', role: UserRole.GUIDE, name: 'Campus Guide Team' },
];
