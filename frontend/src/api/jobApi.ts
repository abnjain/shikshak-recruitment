import api from './axios';
import { ApiResponse, Job, JobRequest, PagedResponse } from '../types';

export const jobApi = {
  getAllActive: (page = 0, size = 10) =>
    api.get<ApiResponse<PagedResponse<Job>>>(`/jobs?page=${page}&size=${size}`),

  search: (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') query.append(key, String(value));
    });
    return api.get<ApiResponse<PagedResponse<Job>>>(`/jobs/search?${query.toString()}`);
  },

  getById: (id: number) =>
    api.get<ApiResponse<Job>>(`/jobs/${id}`),

  create: (data: JobRequest) =>
    api.post<ApiResponse<Job>>('/institute/jobs', data),

  update: (id: number, data: JobRequest) =>
    api.put<ApiResponse<Job>>(`/jobs/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/jobs/${id}`),

  updateStatus: (id: number, status: string) =>
    api.patch<ApiResponse<Job>>(`/jobs/${id}/status?status=${status}`),

  getInstituteJobs: (page = 0, size = 10) =>
    api.get<ApiResponse<PagedResponse<Job>>>(`/institute/jobs?page=${page}&size=${size}`),

  getRecruiterJobs: (page = 0, size = 10) =>
    api.get<ApiResponse<PagedResponse<Job>>>(`/recruiter/jobs?page=${page}&size=${size}`),
};
