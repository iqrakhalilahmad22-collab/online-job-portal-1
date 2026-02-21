import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MockApi } from '../../services/mockApi';
import { generateJobDescription } from '../../services/geminiService';
import { Sparkles } from 'lucide-react';

export const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: 0,
    type: 'Full-time' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await MockApi.createJob({
        ...formData,
        companyId: user.id,
        companyName: user.companyName || 'Company'
      });
      navigate('/company-dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title || !user?.companyName) {
      alert('Please enter a Job Title to generate a description.');
      return;
    }
    setGenerating(true);
    const desc = await generateJobDescription(formData.title, user.companyName);
    setFormData(prev => ({ ...prev, description: desc }));
    setGenerating(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">Salary ($/year)</label>
            <input
              type="number"
              required
              value={formData.salary || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Job Type</label>
           <select
             value={formData.type}
             onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
           >
             <option value="Full-time">Full-time</option>
             <option value="Part-time">Part-time</option>
             <option value="Contract">Contract</option>
             <option value="Remote">Remote</option>
           </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-medium text-gray-700">Description</label>
             <button
               type="button"
               onClick={handleAIGenerate}
               disabled={generating}
               className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
             >
               <Sparkles className="h-3 w-3 mr-1" />
               {generating ? 'Generating...' : 'Auto-Generate with AI'}
             </button>
          </div>
          <textarea
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};