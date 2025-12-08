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

export interface WorkExperience {
  periodArr: string[];
  startDate: string;
  endDate: string;
  companyName: string;
  jobTitle: string;
}

export interface AddEmployeeRequest {
  image: string;
  username: string;
  name: string;
  gender: number | null;
  jobTitle: number | null;
  hireDate: string;
  deptId: number | null;
  phone: string;
  salary: number | null;
  workExpList: WorkExperience[];
}

export interface FindEmployeeByIdResponse {
  id: number | null;
  username: string;
  name: string;
  gender: number | null;
  jobTitle: number | null;
  salary: number | null;
  image: string;
  hireDate: string;
  deptId: number | null;
  workExpList: WorkExperience[];
}

interface UpdateEmployeeRequest extends AddEmployeeRequest {
  id: number | null;
}

export interface ClassTeacherResponse {
  name: string;
  id: number;
}

export const searchEmployee = (params: SearchEmployeeRequest): Promise<ApiResponse<PageResult<SearchEmployeeResponse>>> => request.get('/emps/search', { params });

export const deleteEmployee = (ids: number[]): Promise<ApiResponse<boolean>> => request.delete(`/emps?ids=${ids.join(',')}`);

export const addEmployee = (data: AddEmployeeRequest): Promise<ApiResponse<boolean>> => request.post('/emps', data);

export const findEmployeeById = (id: number): Promise<ApiResponse<FindEmployeeByIdResponse>> => request.get(`/emps/${id}`);

export const updateEmployee = (data: UpdateEmployeeRequest): Promise<ApiResponse<boolean>> => request.put('/emps', data);

export const findAllClassTeacher = (): Promise<ApiResponse<ClassTeacherResponse[]>> => request.get('/emps/teachers');