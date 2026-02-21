import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockApi } from '../../services/mockApi';
import { User } from '../../types';
import { User as UserIcon, Save, Sparkles, AlertCircle } from 'lucide-react';

export const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    skills: '' // Managed as comma separated string for input
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const updatedUser = await MockApi.updateUser(user.id, {
        name: formData.name,
        bio: formData.bio,
        skills: skillsArray
      });

      login(updatedUser); // Update context
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <UserIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500">Manage your information to get better job recommendations</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm py-2 px-3 text-gray-500"
              />
            </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-1">
               <label className="block text-sm font-medium text-gray-700">Professional Bio</label>
             </div>
             <textarea
               rows={4}
               value={formData.bio}
               onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
               placeholder="Briefly describe your experience and what you are looking for..."
               className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
             />
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
             <div className="flex items-center mb-2">
               <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
               <label className="block text-sm font-medium text-indigo-900">Skills & Keywords</label>
             </div>
             <p className="text-xs text-indigo-700 mb-2">
               Add your technical skills separated by commas (e.g., React, Node.js, Design). 
               These are crucial for our recommendation engine to find the best jobs for you.
             </p>
             <input
               type="text"
               value={formData.skills}
               onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
               placeholder="e.g. React, TypeScript, Java, Project Management"
               className="block w-full border border-indigo-200 rounded-lg shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
             />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 flex items-center">
               <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
               <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 p-4 flex items-center">
               <Save className="h-5 w-5 text-green-400 mr-2" />
               <span className="text-sm text-green-800">Profile updated successfully!</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};