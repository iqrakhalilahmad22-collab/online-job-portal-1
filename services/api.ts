import { Job } from '../types';

const API_BASE_URL = '/api';

export const api = {
  getJobs: async (): Promise<Job[]> => {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    return response.json();
  },

  getJob: async (id: string): Promise<Job> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }
    return response.json();
  },

  applyForJob: async (formData: FormData): Promise<{ message: string; applicationId: string }> => {
    const response = await fetch(`${API_BASE_URL}/apply`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit application');
    }

    return response.json();
  },

  getMyApplications: async (userId: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/my-applications?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    return response.json();
  }
};
