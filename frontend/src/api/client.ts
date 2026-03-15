import axios from 'axios';
import type { Institution } from '../data/institutions';
import { mockInstitutions } from '../data/institutions';

const http = axios.create({ baseURL: '' });

// Helper to delay mock responses
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getInstitutions = async (): Promise<Institution[]> => {
  try {
    const res = await http.get('/api/facilities');
    return res.data;
  } catch (err) {
    console.warn('API fallback to mock data (getInstitutions)');
    await delay(300);
    return mockInstitutions;
  }
};

export const getInstitution = async (id: number): Promise<Institution | null> => {
  try {
    const res = await http.get(`/api/facilities/${id}`);
    return res.data;
  } catch (err) {
    console.warn(`API fallback to mock data (getInstitution ${id})`);
    await delay(300);
    const inst = mockInstitutions.find(i => i.id === id);
    return inst || null;
  }
};

interface ReportPayload {
  comment: string;
  status: 'good' | 'warning' | 'bad';
  user_name: string;
  photo?: File;
}

export const submitReport = async (id: number, data: ReportPayload): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('comment', data.comment);
    formData.append('status', data.status);
    formData.append('user_name', data.user_name);
    if (data.photo) {
      formData.append('photo', data.photo);
    }
    
    const res = await http.post(`/api/facilities/${id}/report`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (err) {
    console.warn(`API fallback to mock implementation (submitReport ${id})`);
    await delay(500);
    // return success response mock
    return { success: true, message: 'Report submitted successfully' };
  }
};

export const getStats = async (): Promise<any> => {
  try {
    const res = await http.get('/api/stats');
    return res.data;
  } catch (err) {
    console.warn('API fallback to mock data (getStats)');
    await delay(300);
    return {
      total_checked: 247,
      total_reports: 1842,
      success_rate: 78,
      issues_count: 54,
    };
  }
};
