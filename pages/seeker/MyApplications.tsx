import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Application, ApplicationStatus } from '../../types';
import { api } from '../../services/api';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getMyApplications(user.id).then(setApplications).finally(() => setLoading(false));
    }
  }, [user]);

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case ApplicationStatus.REJECTED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusClass = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              You haven't applied to any jobs yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {applications.map(app => (
                <div key={app.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{app.jobTitle}</h3>
                    <p className="text-sm text-gray-500">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(app.status)}`}>
                    <span className="mr-2">{getStatusIcon(app.status)}</span>
                    {app.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};