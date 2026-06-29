import api from './axios';
import { ApiResponse, GoogleLoginRequest, JwtResponse, LoginRequest, SignupRequest, User } from '../types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<JwtResponse>>('/auth/login', data),

  googleLogin: (data: GoogleLoginRequest) =>
    api.post<ApiResponse<JwtResponse>>('/auth/google', data),

  register: (data: SignupRequest) =>
    api.post<ApiResponse<User>>('/auth/register', data),

  getCurrentUser: () =>
    api.get<ApiResponse<User>>('/users/me'),

  checkUsername: (username: string) =>
    api.get<ApiResponse<{ exists: boolean }>>(`/auth/check-username?username=${username}`),

  checkEmail: (email: string) =>
    api.get<ApiResponse<{ exists: boolean }>>(`/auth/check-email?email=${email}`),
};
