import { User, Job, Application, UserRole, ApplicationStatus } from '../types';

// Initial Dummy Data
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john@seeker.com', password: 'password', role: UserRole.SEEKER, skills: ['React', 'Node.js', 'JavaScript'], bio: 'Full stack developer passionate about React ecosystem.', createdAt: new Date().toISOString() },
  { id: 'u2', name: 'Tech Corp', email: 'hr@techcorp.com', password: 'password', role: UserRole.COMPANY, companyName: 'Tech Corp Inc.', createdAt: new Date().toISOString() },
  { id: 'u3', name: 'Super Admin', email: 'admin@portal.com', password: 'password', role: UserRole.ADMIN, createdAt: new Date().toISOString() },
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'j1',
    companyId: 'u2',
    companyName: 'Tech Corp Inc.',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to join our team.',
    location: 'Remote',
    salary: 120000,
    type: 'Full-time',
    requirements: ['React', 'TypeScript', 'Tailwind'],
    postedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: 'j2',
    companyId: 'u2',
    companyName: 'Tech Corp Inc.',
    title: 'Backend Engineer',
    description: 'Node.js expert needed for high scale architecture.',
    location: 'New York, NY',
    salary: 140000,
    type: 'Full-time',
    requirements: ['Node.js', 'MongoDB', 'Redis'],
    postedAt: new Date(Date.now() - 86400000).toISOString(),
    isActive: true,
  },
  {
    id: 'j3',
    companyId: 'u2',
    companyName: 'Tech Corp Inc.',
    title: 'Product Manager',
    description: 'Lead our product team to success.',
    location: 'San Francisco, CA',
    salary: 160000,
    type: 'Full-time',
    requirements: ['Agile', 'Communication', 'Jira'],
    postedAt: new Date(Date.now() - 172800000).toISOString(),
    isActive: true,
  }
];

const INITIAL_APPLICATIONS: Application[] = [];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage Wrappers
const getStorage = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const setStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const MockApi = {
  // --- AUTH ---
  login: async (email: string, password: string): Promise<User> => {
    await delay(500);
    const users = getStorage<User[]>('users', INITIAL_USERS);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    const { password: _, ...userWithoutPass } = user;
    return userWithoutPass as User;
  },

  register: async (userData: Partial<User>): Promise<User> => {
    await delay(500);
    const users = getStorage<User[]>('users', INITIAL_USERS);
    if (users.find(u => u.email === userData.email)) throw new Error('User already exists');
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      skills: [],
      ...userData
    } as User;
    
    users.push(newUser);
    setStorage('users', users);
    const { password: _, ...userWithoutPass } = newUser;
    return userWithoutPass as User;
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
    await delay(300);
    const users = getStorage<User[]>('users', INITIAL_USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    // Merge existing user data with updates
    users[index] = { ...users[index], ...data };
    setStorage('users', users);
    
    // Update current session if it matches (for AuthContext)
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.id === userId) {
        const { password: _, ...safeUser } = users[index];
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
      }
    }

    const { password: _, ...userWithoutPass } = users[index];
    return userWithoutPass as User;
  },

  // --- JOBS ---
  getJobs: async (): Promise<Job[]> => {
    await delay(300);
    return getStorage<Job[]>('jobs', INITIAL_JOBS).filter(j => j.isActive);
  },

  getRecommendedJobs: async (userId: string): Promise<Job[]> => {
    await delay(600); // Slightly longer delay to simulate "thinking"
    const users = getStorage<User[]>('users', INITIAL_USERS);
    const user = users.find(u => u.id === userId);
    
    // If user has no skills, return empty or random (we return empty to prompt them to add skills)
    if (!user || !user.skills || user.skills.length === 0) return [];

    const jobs = getStorage<Job[]>('jobs', INITIAL_JOBS).filter(j => j.isActive);
    
    // Recommendation Algorithm
    const scoredJobs = jobs.map(job => {
        let score = 0;
        const jobRequirements = job.requirements ? job.requirements.map(r => r.toLowerCase()) : [];
        const userSkills = user.skills ? user.skills.map(s => s.toLowerCase()) : [];
        
        // 1. Exact Skill Matching
        userSkills.forEach(skill => {
            if (jobRequirements.includes(skill)) {
                score += 10; // High score for exact requirement match
            } else if (jobRequirements.some(req => req.includes(skill) || skill.includes(req))) {
                score += 5; // Partial match
            }
        });

        // 2. Title matching
        userSkills.forEach(skill => {
            if (job.title.toLowerCase().includes(skill)) {
                score += 8;
            }
        });

        return { job, score };
    });

    // Filter out jobs with 0 score and sort by score descending
    return scoredJobs
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.job)
        .slice(0, 3); // Return top 3 recommendations
  },

  getAllJobsAdmin: async (): Promise<Job[]> => {
     await delay(300);
    return getStorage<Job[]>('jobs', INITIAL_JOBS);
  },

  getCompanyJobs: async (companyId: string): Promise<Job[]> => {
    await delay(300);
    const jobs = getStorage<Job[]>('jobs', INITIAL_JOBS);
    return jobs.filter(j => j.companyId === companyId);
  },

  createJob: async (jobData: Partial<Job>): Promise<Job> => {
    await delay(500);
    const jobs = getStorage<Job[]>('jobs', INITIAL_JOBS);
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      postedAt: new Date().toISOString(),
      isActive: true,
      requirements: [],
      ...jobData
    } as Job;
    jobs.push(newJob);
    setStorage('jobs', jobs);
    return newJob;
  },

  deleteJob: async (jobId: string): Promise<void> => {
    await delay(300);
    let jobs = getStorage<Job[]>('jobs', INITIAL_JOBS);
    jobs = jobs.filter(j => j.id !== jobId);
    setStorage('jobs', jobs);
  },

  // --- APPLICATIONS ---
  applyForJob: async (jobId: string, seekerId: string, seekerName: string, seekerEmail: string, jobTitle: string, companyId: string): Promise<Application> => {
    await delay(500);
    const apps = getStorage<Application[]>('applications', INITIAL_APPLICATIONS);
    
    if (apps.find(a => a.jobId === jobId && a.seekerId === seekerId)) {
      throw new Error('Already applied to this job');
    }

    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      seekerId,
      seekerName,
      seekerEmail,
      jobTitle,
      companyId,
      status: ApplicationStatus.PENDING,
      appliedAt: new Date().toISOString(),
    };
    apps.push(newApp);
    setStorage('applications', apps);
    return newApp;
  },

  getSeekerApplications: async (seekerId: string): Promise<Application[]> => {
    await delay(300);
    const apps = getStorage<Application[]>('applications', INITIAL_APPLICATIONS);
    return apps.filter(a => a.seekerId === seekerId);
  },

  getJobApplications: async (jobId: string): Promise<Application[]> => {
    await delay(300);
    const apps = getStorage<Application[]>('applications', INITIAL_APPLICATIONS);
    return apps.filter(a => a.jobId === jobId);
  },

  updateApplicationStatus: async (appId: string, status: ApplicationStatus): Promise<void> => {
    await delay(300);
    const apps = getStorage<Application[]>('applications', INITIAL_APPLICATIONS);
    const index = apps.findIndex(a => a.id === appId);
    if (index !== -1) {
      apps[index].status = status;
      setStorage('applications', apps);
    }
  },

  // --- USERS (Admin) ---
  getAllUsers: async (): Promise<User[]> => {
    await delay(300);
    return getStorage<User[]>('users', INITIAL_USERS);
  },
  
  deleteUser: async (userId: string): Promise<void> => {
    await delay(300);
    let users = getStorage<User[]>('users', INITIAL_USERS);
    users = users.filter(u => u.id !== userId);
    setStorage('users', users);
  }
};