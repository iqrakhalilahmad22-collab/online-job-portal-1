import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Mock Database (In-memory with optional JSON persistence if needed later)
// For now, we'll just keep it in memory for the session
interface Job {
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

interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  resumePath: string;
  coverLetter: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  jobTitle?: string;
  companyName?: string;
  companyId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SEEKER' | 'COMPANY' | 'ADMIN';
  password?: string;
  skills?: string[];
  companyName?: string;
  bio?: string;
  createdAt: string;
}

let users: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'SEEKER',
    password: 'password',
    skills: ['React', 'Node.js'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'u2',
    name: 'Tech Recruiter',
    email: 'recruiter@techcorp.com',
    role: 'COMPANY',
    password: 'password',
    companyName: 'TechCorp Inc.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'u3',
    name: 'Admin User',
    email: 'admin@jobify.com',
    role: 'ADMIN',
    password: 'password',
    createdAt: new Date().toISOString()
  }
];

// Initial Mock Data
let jobs: Job[] = [
  {
    id: '1',
    companyId: 'comp1',
    companyName: 'TechCorp Inc.',
    companyLogo: 'https://picsum.photos/seed/techcorp/200/200',
    title: 'Senior Frontend Engineer',
    description: 'We are looking for an experienced Frontend Engineer to lead our core product team. You will be working with React, TypeScript, and modern web technologies to build scalable and performant user interfaces.',
    summary: 'Lead core product team using React and TypeScript.',
    location: 'Remote',
    salary: 140000,
    type: 'Full-time',
    postedAt: '2024-02-15',
    deadline: '2024-03-15',
    requirements: ['React', 'TypeScript', 'Node.js'],
    isActive: true
  },
  {
    id: '2',
    companyId: 'comp2',
    companyName: 'Creative Studio',
    companyLogo: 'https://picsum.photos/seed/creative/200/200',
    title: 'Product Designer',
    description: 'Join our award-winning design team. We need someone with a strong portfolio in UI/UX design, proficiency in Figma, and a passion for creating beautiful user experiences.',
    summary: 'Design beautiful user experiences for award-winning team.',
    location: 'New York, NY',
    salary: 90000,
    type: 'Contract',
    postedAt: '2024-02-14',
    deadline: '2024-03-01',
    requirements: ['Figma', 'UI/UX', 'Adobe Creative Suite'],
    isActive: true
  },
  {
    id: '3',
    companyId: 'comp3',
    companyName: 'DataSystems',
    companyLogo: 'https://picsum.photos/seed/datasys/200/200',
    title: 'Backend Developer',
    description: 'Seeking a backend developer with Node.js and Python experience. You will be responsible for building robust APIs and managing our cloud infrastructure.',
    summary: 'Build robust APIs and manage cloud infrastructure.',
    location: 'Austin, TX',
    salary: 125000,
    type: 'Full-time',
    postedAt: '2024-02-10',
    deadline: '2024-03-10',
    requirements: ['Node.js', 'Python', 'AWS'],
    isActive: true
  }
];

let applications: Application[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes

  // Auth Routes
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  app.post('/api/register', (req, res) => {
    const { name, email, password, role, companyName } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
      companyName: role === 'COMPANY' ? companyName : undefined,
      skills: [],
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  });

  // Job Routes
  app.get('/api/jobs', (req, res) => {
    res.json(jobs);
  });

  app.post('/api/jobs', (req, res) => {
    const jobData = req.body;
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      postedAt: new Date().toISOString(),
      isActive: true
    };
    jobs.push(newJob);
    res.status(201).json(newJob);
  });

  // Get a specific job
  app.get('/api/jobs/:id', (req, res) => {
    const job = jobs.find(j => j.id === req.params.id);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  });

  // Apply for a job
  app.post('/api/apply', upload.single('resume'), (req, res) => {
    try {
      const { jobId, userId, userName, email, coverLetter } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'Resume file is required' });
      }

      // Check if already applied
      const existingApplication = applications.find(
        app => app.jobId === jobId && app.seekerId === userId
      );

      if (existingApplication) {
        return res.status(409).json({ message: 'You have already applied for this job' });
      }

      const job = jobs.find(j => j.id === jobId);

      const newApplication: Application = {
        id: Date.now().toString(),
        jobId,
        seekerId: userId,
        seekerName: userName,
        seekerEmail: email,
        resumePath: file.path,
        coverLetter,
        status: 'PENDING',
        appliedAt: new Date().toISOString(),
        companyId: job?.companyId
      };

      applications.push(newApplication);

      res.status(201).json({ 
        message: 'Application submitted successfully', 
        applicationId: newApplication.id 
      });
    } catch (error) {
      console.error('Error processing application:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get applications for a user
  app.get('/api/my-applications', (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const userApps = applications.filter(app => app.seekerId === userId);
    
    // Enrich with job details
    const enrichedApps = userApps.map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      return { 
        ...app, 
        jobTitle: job?.title, 
        companyName: job?.companyName,
        companyId: job?.companyId
      };
    });

    res.json(enrichedApps);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (if we were building for prod)
    app.use(express.static(path.resolve(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
