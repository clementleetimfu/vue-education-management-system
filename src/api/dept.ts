import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface FindAllDepartmentResponse {
  id: number;
  name: string;
  updateTime: string;
}

interface AddDepartmentRequest {
  name: string;
}

interface EditDepartmentRequest {
  id: number;
  name: string;
}

export const findAllDepartment = (): Promise<ApiResponse<FindAllDepartmentResponse[]>> => request.get('/depts');

export const addDepartment = (data: AddDepartmentRequest): Promise<ApiResponse<boolean>> => request.post('/depts', data);

export const editDepartment = (data: EditDepartmentRequest): Promise<ApiResponse<boolean>> => request.put('/depts', data);

export const deleteDepartment = (id: number): Promise<ApiResponse<boolean>> => request.delete(`/depts/${id}`);