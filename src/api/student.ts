import request from '@/utils/request';
import type { ApiResponse, PageResult } from './common';

export interface SearchStudentRequest {
  page: number;
  pageSize: number;
  name: string;
  educationLevel: number | null;
  clazzId: number | null;
}

export interface SearchStudentResponse {
  id: number;
  name: string;
  no: string
  gender: string;
  educationLevel: string;
  clazzName: string;
  intakeDate: string;
  updateTime: string;
}

export interface AddStudentRequest {
  name: string;
  gender: number | null;
  birthdate: string;
  phone: string;
  email: string;
  address: string;
  educationLevel: number | null;
  graduationDate: string;
  clazzId: number | null;
  intakeDate: string;
}

export interface FindStudentByIdResponse {
  id: number | null;
  name: string;
  gender: number | null;
  birthdate: string;
  phone: string;
  email: string;
  address: string;
  educationLevel: number | null;
  clazzId: number | null;
  intakeDate: string;
}

export interface UpdateStudentRequest extends AddStudentRequest {
  id: number | null;
}

export const searchStudent = (params: SearchStudentRequest): Promise<ApiResponse<PageResult<SearchStudentResponse>>> => request.get('/students/search', { params });

export const addStudent = (data: AddStudentRequest): Promise<ApiResponse<boolean>> => request.post('/students', data);

export const findStudentById = (id: number): Promise<ApiResponse<FindStudentByIdResponse>> => request.get(`/students/${id}`);

export const updateStudent = (data: UpdateStudentRequest): Promise<ApiResponse<boolean>> => request.put('/students', data);

export const deleteStudent = (ids: number[]): Promise<ApiResponse<boolean>> => request.delete(`/students?ids=${ids.join(',')}`);