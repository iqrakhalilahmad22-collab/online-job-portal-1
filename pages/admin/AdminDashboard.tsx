import React, { useEffect, useState } from 'react';
import { User, Job, UserRole } from '../../types';
import { MockApi } from '../../services/mockApi';
import { Trash2, Shield, Briefcase } from 'lucide-react';

export const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [u, j] = await Promise.all([
      MockApi.getAllUsers(),
      MockApi.getAllJobsAdmin()
    ]);
    setUsers(u);
    setJobs(j);
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Delete this user?')) {
      await MockApi.deleteUser(id);
      loadData();
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Delete this job?')) {
      await MockApi.deleteJob(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Console</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
           <div className="p-3 bg-indigo-100 rounded-full text-indigo-600 mr-4">
             <Shield className="h-6 w-6" />
           </div>
           <div>
             <p className="text-sm text-gray-500">Total Users</p>
             <p className="text-2xl font-bold">{users.length}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
           <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
             <Briefcase className="h-6 w-6" />
           </div>
           <div>
             <p className="text-sm text-gray-500">Total Jobs</p>
             <p className="text-2xl font-bold">{jobs.length}</p>
           </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'jobs'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Jobs
          </button>
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {activeTab === 'users' ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      u.role === UserRole.ADMIN ? 'bg-slate-100 text-slate-800' : 
                      u.role === UserRole.COMPANY ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {u.role !== UserRole.ADMIN && (
                      <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map(j => (
                <tr key={j.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{j.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{j.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(j.postedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDeleteJob(j.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};