import React, { useEffect, useState } from 'react';
import { Job, UserRole } from '../../types';
import { api } from '../../services/api';
import { JobCard } from '../../components/JobCard';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, X, Sparkles, ArrowRight, Upload, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JobSearch = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: 'All',
    salaryMin: 0
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    loadJobs();
    // Recommendations would typically come from a real ML service
    // For now we'll just simulate it or fetch from API if implemented
    if (user) {
      setRecommendationsLoading(false); // Placeholder
    }
  }, [user]);

  useEffect(() => {
    let result = jobs;
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.companyName.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (filters.type !== 'All') {
      result = result.filter(job => job.type === filters.type);
    }

    // Location filter
    if (filters.location) {
      result = result.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    
    // Salary Filter
    if (filters.salaryMin > 0) {
      result = result.filter(job => job.salary >= filters.salaryMin);
    }

    setFilteredJobs(result);
  }, [jobs, searchTerm, filters]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    if (!user) return;
    setSelectedJob(job);
    setIsModalOpen(true);
    setCoverLetter('');
    setResumeFile(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedJob || !resumeFile) {
      alert("Please upload a resume");
      return;
    }

    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('jobId', selectedJob.id);
      formData.append('userId', user.id);
      formData.append('userName', user.name);
      formData.append('email', user.email);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resumeFile);

      await api.applyForJob(formData);
      alert('Application submitted successfully!');
      setIsModalOpen(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Dashboard</h1>
           <p className="text-slate-500">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Recommendations Section - Simplified for now as backend doesn't support it yet */}
      {/* ... (Kept similar but using real data if available, or just hidden if empty) ... */}
      
      {/* Main Search & Filters */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">All Jobs</h2>
        
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700"
            />
          </div>
          
          <select 
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="w-full md:w-40 px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-700 bg-white"
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Contract">Contract</option>
          </select>

          <input 
            type="number"
            placeholder="Min Salary"
            value={filters.salaryMin || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, salaryMin: parseInt(e.target.value) || 0 }))}
            className="w-full md:w-32 px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-700"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  userRole={UserRole.SEEKER}
                  onApply={handleApply}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                No jobs found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Apply for {selectedJob.title}</h3>
                <p className="text-sm text-slate-500">{selectedJob.companyName}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleApplySubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resume / CV <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-primary-400 hover:bg-primary-50/30 transition-all group cursor-pointer relative">
                  <input 
                    type="file" 
                    id="resume-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="space-y-1 text-center pointer-events-none">
                    {resumeFile ? (
                      <div className="flex flex-col items-center text-primary-600">
                        <CheckCircle className="h-10 w-10 mb-2" />
                        <span className="text-sm font-medium">{resumeFile.name}</span>
                        <span className="text-xs text-primary-400">Click to change</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-10 w-10 text-slate-400 group-hover:text-primary-500 transition-colors" />
                        <div className="flex text-sm text-slate-600">
                          <span className="font-medium text-primary-600 hover:text-primary-500">Upload a file</span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">PDF, DOC, DOCX up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    rows={4}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm placeholder-slate-400 transition-shadow"
                    placeholder="Tell us why you're a great fit..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary-500/20 transition-all"
                >
                  {submitLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};