import api from './axios';
import { ApiResponse, Resume, ResumeRequest } from '../types';

export const resumeApi = {
  getAll: () =>
    api.get<ApiResponse<Resume[]>>('/candidate/resumes'),

  create: (data: ResumeRequest) =>
    api.post<ApiResponse<Resume>>('/candidate/resumes', data),

  update: (id: number, data: ResumeRequest) =>
    api.put<ApiResponse<Resume>>(`/candidate/resumes/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/candidate/resumes/${id}`),
};
