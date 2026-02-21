export enum UserRole {
  SEEKER = 'SEEKER',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In a real app, never store plain text
  skills?: string[]; // For Seekers
  companyName?: string; // For Companies
  bio?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  summary?: string;
  location: string;
  salary: number;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  postedAt: string;
  deadline?: string;
  requirements: string[];
  isActive: boolean;
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  jobTitle: string;
  companyId: string;
  status: ApplicationStatus;
  appliedAt: string;
  resumeLink?: string; // Simulated link
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}