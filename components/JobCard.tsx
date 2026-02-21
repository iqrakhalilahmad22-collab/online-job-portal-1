import React from 'react';
import { Job, UserRole } from '../types';
import { MapPin, DollarSign, Clock, Building } from 'lucide-react';

interface JobCardProps {
  job: Job;
  userRole?: UserRole;
  onApply?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  onViewApplicants?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, userRole, onApply, onDelete, onViewApplicants }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-200 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          {job.companyLogo ? (
            <img 
              src={job.companyLogo} 
              alt={`${job.companyName} logo`} 
              className="h-12 w-12 rounded-lg object-cover border border-slate-100"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">
              {job.companyName.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</h3>
            <div className="flex items-center mt-1 text-slate-500 text-sm font-medium">
              <Building className="h-4 w-4 mr-1.5" />
              {job.companyName}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
          job.type === 'Full-time' ? 'bg-green-100 text-green-700' :
          job.type === 'Remote' ? 'bg-orange-100 text-orange-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {job.type}
        </span>
      </div>

      <div className="flex-1">
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-4">
          {job.summary || job.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-500 mb-4">
          <div className="flex items-center bg-slate-50 p-2 rounded-lg">
            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center bg-slate-50 p-2 rounded-lg">
            <DollarSign className="h-4 w-4 mr-2 text-slate-400" />
            <span className="truncate">${job.salary.toLocaleString()}</span>
          </div>
          {job.deadline && (
            <div className="col-span-2 flex items-center bg-red-50 p-2 rounded-lg text-red-600/80">
              <Clock className="h-4 w-4 mr-2" />
              <span className="truncate font-medium">Apply by {new Date(job.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex space-x-3">
        {userRole === UserRole.SEEKER && onApply && (
          <button 
            onClick={() => onApply(job)}
            className="flex-1 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-all shadow-sm shadow-primary-500/20"
          >
            Apply Now
          </button>
        )}
        
        {userRole === UserRole.COMPANY && onViewApplicants && (
           <button 
             onClick={() => onViewApplicants(job.id)}
             className="flex-1 bg-white border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
           >
             View Applicants
           </button>
        )}

        {(userRole === UserRole.ADMIN || userRole === UserRole.COMPANY) && onDelete && (
          <button 
            onClick={() => onDelete(job.id)}
            className="px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};