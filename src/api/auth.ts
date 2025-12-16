import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number | null;
  token: string;
  isFirstLogged: boolean;
}

export interface UpdatePasswordRequest {
  id: number | null;
  password: string;
}

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => request.post('/auth/login', data);

export const updatePassword = (data: UpdatePasswordRequest): Promise<ApiResponse<boolean>> => request.post('/auth/update-password', data);