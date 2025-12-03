import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface FindAllDepartmentResponse {
  id: number;
  name: string;
  updateTime: string;
}

export interface AddDepartmentRequest {
  name: string;
}

export const findAllDepartment = (): Promise<ApiResponse<FindAllDepartmentResponse[]>> => request.get('/depts');

export const addDepartment = (data: AddDepartmentRequest): Promise<ApiResponse<boolean>> => request.post('/depts', data);