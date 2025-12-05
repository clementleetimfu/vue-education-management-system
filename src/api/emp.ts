import request from '@/utils/request';
import type { ApiResponse, PageResult } from './common';

export interface SearchEmployeeResponse {
  id: number;
  name: string;
  gender: string;
  image: string;
  deptName: string;
  jobTitle: string;
  hireDate: string;
  updateTime: string;
}

export interface SearchEmployeeRequest {
  page: number;
  pageSize: number;
  name: string;
  gender: string;
  startDate: string;
  endDate: string;
}

export const searchEmployee = (params: any): Promise<ApiResponse<PageResult<SearchEmployeeResponse>>> => request.get('/emps/search', { params });

export const deleteEmployee = (ids: number[]): Promise<ApiResponse<boolean>> => request.delete(`/emps?ids=${ids.join(',')}`);
