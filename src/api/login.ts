import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  name: string;
  token: string;
}

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => request.post('/login', data);