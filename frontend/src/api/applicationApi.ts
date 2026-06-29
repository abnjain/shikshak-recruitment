import api from './axios';
import { ApiResponse, Application, ApplicationRequest, PagedResponse } from '../types';

export const applicationApi = {
  apply: (data: ApplicationRequest) =>
    api.post<ApiResponse<Application>>('/candidate/applications', data),

  getMyApplications: (page = 0, size = 10) =>
    api.get<ApiResponse<PagedResponse<Application>>>(`/candidate/applications?page=${page}&size=${size}`),

  getJobApplications: (jobId: number, page = 0, size = 10) =>
    api.get<ApiResponse<PagedResponse<Application>>>(`/recruiter/applications/job/${jobId}?page=${page}&size=${size}`),

  updateStatus: (data: { applicationId: number; status: string; recruiterNotes?: string; feedback?: string }) =>
    api.put<ApiResponse<Application>>('/recruiter/applications/status', data),

  getInstituteApplications: (page = 0, size = 10) =>
    api.get<ApiResponse<PagedResponse<Application>>>(`/institute/applications?page=${page}&size=${size}`),
};
