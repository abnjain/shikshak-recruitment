import api from './axios';
import { ApiResponse, DashboardStats } from '../types';

export const dashboardApi = {
  getAdminDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),

  getInstituteDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/institute/dashboard'),

  getRecruiterDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/recruiter/dashboard'),

  getCandidateDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/candidate/dashboard'),
};
