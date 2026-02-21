import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Job, Application, ApplicationStatus, UserRole } from '../../types';
import { MockApi } from '../../services/mockApi';
import { JobCard } from '../../components/JobCard';
import { Users, X } from 'lucide-react';

export const CompanyDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [user]);

  const loadJobs = async () => {
    if (user) {
      setLoading(true);
      try {
        const data = await MockApi.getCompanyJobs(user.id);
        setJobs(data);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await MockApi.deleteJob(jobId);
      loadJobs();
    }
  };

  const handleViewApplicants = async (jobId: string) => {
    setSelectedJobId(jobId);
    const apps = await MockApi.getJobApplications(jobId);
    setApplicants(apps);
  };

  const handleUpdateStatus = async (appId: string, status: ApplicationStatus) => {
    await MockApi.updateApplicationStatus(appId, status);
    // Refresh applicants list
    if (selectedJobId) {
      const apps = await MockApi.getJobApplications(selectedJobId);
      setApplicants(apps);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="text-gray-500">Manage your postings and applicants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div>Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">
            No jobs posted yet. Click "Post a Job" to get started.
          </div>
        ) : (
          jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              userRole={UserRole.COMPANY}
              onDelete={handleDeleteJob}
              onViewApplicants={handleViewApplicants}
            />
          ))
        )}
      </div>

      {/* Applicants Modal Overlay */}
      {selectedJobId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <Users className="mr-2 h-5 w-5 text-indigo-600" />
                Applicants
              </h2>
              <button onClick={() => setSelectedJobId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {applicants.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No applicants yet.</div>
              ) : (
                <div className="space-y-4">
                  {applicants.map(app => (
                    <div key={app.id} className="border rounded-lg p-4 flex justify-between items-center bg-gray-50">
                      <div>
                        <h4 className="font-bold text-gray-900">{app.seekerName}</h4>
                        <p className="text-sm text-gray-500">{app.seekerEmail}</p>
                        <p className="text-xs text-gray-400 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      
                      {app.status === ApplicationStatus.PENDING ? (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleUpdateStatus(app.id, ApplicationStatus.ACCEPTED)}
                            className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button 
                             onClick={() => handleUpdateStatus(app.id, ApplicationStatus.REJECTED)}
                             className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                          app.status === ApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};