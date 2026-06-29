import api from './axios';
import { ApiResponse, Institute, Job, PagedResponse } from '../types';

export const publicApi = {
  getActiveJobs: (page = 0, size = 10) =>
    api.get<ApiResponse<PagedResponse<Job>>>(`/public/jobs?page=${page}&size=${size}`),

  getVerifiedInstitutes: () =>
    api.get<ApiResponse<Institute[]>>('/public/institutes'),
};
