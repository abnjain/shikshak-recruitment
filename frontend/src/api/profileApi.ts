import api from './axios';
import { ApiResponse, CandidateProfile, ProfileUpdateRequest } from '../types';

export const profileApi = {
  getProfile: () =>
    api.get<ApiResponse<CandidateProfile>>('/candidate/profile'),

  updateProfile: (data: ProfileUpdateRequest) =>
    api.put<ApiResponse<CandidateProfile>>('/candidate/profile', data),
};
