import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => request.post('/login', data);